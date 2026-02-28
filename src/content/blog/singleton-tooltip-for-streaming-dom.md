---
title: "流式渲染下的 Tooltip 闪动问题与单例委托方案"
description: "AI 回答流式输出时，v-html 不断替换 DOM，导致挂载在子元素上的 el-tooltip 反复销毁重建、剧烈闪动。记录问题的根因分析与最终采用的单例事件委托解法。"
publishDate: 2026-02-28
tags:
  - Vue3
  - Element Plus
  - Tooltip
  - 流式渲染
  - 事件委托
---

## 背景

AI 搜索结果页在流式输出分析内容时，后端会在 Markdown 文本中插入引用标注，形如：

```html
<span class="ref-mark" data-tooltip="来源：超星学习通公告 - 2024-03-15" data-type="news" data-object-id="abc123" data-url="https://..."> [1] </span>
```

前端用 `marked` 渲染 Markdown 后通过 `v-html` 绑定到容器，鼠标悬停 `.ref-mark` 时显示来源信息的 tooltip。

## 问题：流式 v-html 替换导致 tooltip 闪动

流式输出阶段，每收到一个新的 token，就会重新渲染整段 Markdown 并更新 `v-html`。`v-html` 的更新机制是**整体替换 innerHTML**，旧的 DOM 子树被销毁，新的子树被创建。

如果在每个 `.ref-mark` 元素上直接使用 `<el-tooltip>`（或在 `onMounted` 里绑定实例），会出现以下循环：

```
鼠标悬停 .ref-mark → tooltip 打开
     ↓
流式更新触发 v-html 替换
     ↓
旧 .ref-mark 元素销毁 → tooltip 宿主消失 → tooltip 立即关闭
     ↓
新 .ref-mark 在同位置生成
     ↓
需要重新 hover 才能再次打开
     ↓
（持续流式输出期间上述过程反复发生）→ 剧烈闪动
```

## 解法：单例 Tooltip + 事件委托 + 坐标追踪

核心思路：**把 tooltip 的生命周期与具体 DOM 节点完全解耦**。

实现为 `useSingletonTooltip` composable，位于 `share/hooks/use-singleton-tooltip.ts`。

### 设计一：事件委托到外层容器

不在每个 `.ref-mark` 上绑定事件，而是在外层容器（`analysisResultRef`）统一监听：

```typescript
container.addEventListener("mouseover", handleMouseOver, true);
container.addEventListener("mouseout", handleMouseOut, true);
container.addEventListener("mousemove", handleMouseMove, true);
```

`v-html` 替换时，内部 DOM 节点反复销毁/创建，**外层容器始终存在**，事件监听不受影响。事件回调中通过 `e.target.closest(targetSelector)` 找到目标节点。

### 设计二：全局单例 ElTooltip（virtualTriggering）

整个页面只渲染一个 `ElTooltip` 实例，用命令式 API 控制开关：

```typescript
const vnode = h(ElTooltip, {
  virtualTriggering: true, // 不订阅触发元素的任何事件
  virtualRef: target, // 锚定到当前 .ref-mark 的位置
  appendTo: document.body, // 挂载到 body，完全脱离 v-html 的替换范围
  showAfter: 0,
  hideAfter: 0,
  // ...
});

render(vnode, container);
(vnode.component as any).exposed.onOpen(); // 命令式打开
```

关键点：

- `virtualTriggering: true` 让 tooltip 只借用目标元素的**坐标**来定位，不订阅它的任何 DOM 事件
- `appendTo: document.body` 使 tooltip 的 DOM 完全独立于 `v-html` 替换的区域
- 通过 `render(null, container)` 命令式销毁，无需依赖宿主元素的生命周期

### 设计三：持续记录鼠标坐标 + elementFromPoint 重新寻找目标

这是消除闪动的关键一环。`mousemove` 事件持续记录最新鼠标坐标，当 DOM 替换发生时立即用坐标重新定位新节点：

```typescript
const handleMouseMove = (e: MouseEvent) => {
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;

  if (singletonTarget) {
    // DOM 被替换后，用已知坐标重新找「当前鼠标下的 .ref-mark」
    const maybeTarget = resolveTargetAtPoint(lastMouseX, lastMouseY);
    if (maybeTarget && maybeTarget !== singletonTarget) {
      // 找到新节点，直接更新 virtualRef，tooltip 不关闭、不重建
      renderTooltipFor(maybeTarget);
    }
    if (!maybeTarget) {
      destroyTooltip();
    }
  }
};

const resolveTargetAtPoint = (x: number, y: number) => {
  const el = document.elementFromPoint(x, y) as HTMLElement | null;
  return el?.closest?.(targetSelector) as HTMLElement | null;
};
```

`v-html` 替换后新节点出现在**相同屏幕坐标**，`mousemove` 在下一帧触发，`elementFromPoint` 找到新节点，`renderTooltipFor` 直接用新节点更新 `virtualRef`——用户视觉上 tooltip 从未关闭过。

### 设计四：mouseout 延迟 + 二次坐标验证

DOM 替换时浏览器会对消失的旧节点触发 `mouseout`，若直接响应会提前关闭 tooltip。通过延迟 80ms 再做二次验证来规避：

```typescript
const handleMouseOut = (e: MouseEvent) => {
  hideTimer = window.setTimeout(() => {
    // 80ms 后再查一次：鼠标是否还在某个 .ref-mark 上
    const stillOn = resolveTargetAtPoint(lastMouseX!, lastMouseY!);
    if (stillOn) {
      // 新节点已就位，重新绑定，不隐藏
      renderTooltipFor(stillOn);
      return;
    }
    destroyTooltip();
  }, 80); // 80ms 足够覆盖一次流式 DOM 替换的耗时
};
```

## 完整时序

```
流式更新触发 v-html 替换
  │
  ├─ 旧 .ref-mark 销毁 → 浏览器触发 mouseout
  │    └─ 启动 80ms 隐藏定时器（暂不关闭 tooltip）
  │
  ├─ 新 .ref-mark 在同坐标生成（innerHTML 已替换）
  │
  ├─ mousemove 触发（鼠标未移动，浏览器仍会派发）
  │    └─ elementFromPoint → 找到新节点
  │         └─ renderTooltipFor(新节点)：更新 virtualRef，tooltip 保持显示
  │
  └─ 80ms 后隐藏定时器到期
       └─ elementFromPoint 仍有结果 → 取消隐藏 ✓
```

## 使用方式

```typescript
// result.vue
const analysisResultRef = ref<HTMLElement>();

useSingletonTooltip({
  containerRef: analysisResultRef,
  targetSelector: ".ref-mark",
  // getTooltipText 默认读取 data-tooltip 属性
});
```

模板侧只需要在容器绑定 ref，内部的 `.ref-mark` 元素携带 `data-tooltip` 属性即可，无需任何额外绑定：

```html
<div ref="analysisResultRef" v-html="analysisResultHtml"></div>
```

Markdown 渲染阶段（`renderMarkdown` + `processRefTags`）负责在 `.ref-mark` 上写入 `data-tooltip` 内容。

## 完整 API

```typescript
interface UseSingletonTooltipOptions {
  containerRef: Ref<HTMLElement | undefined>; // 监听事件的外层容器
  targetSelector: string; // 触发 tooltip 的目标选择器
  getTooltipText?: (el: HTMLElement) => string | null | undefined; // 默认读 data-tooltip
  showDelayMs?: number; // 显示延迟，默认 0ms
  hideDelayMs?: number; // 隐藏延迟，默认 80ms
  placement?: Placement; // 方向，默认 'top'
  offset?: number; // 偏移，默认 8px
  effect?: "dark" | "light"; // 主题，默认 'dark'
  popperClass?: string; // 自定义类名，默认 'cx-singleton-tooltip'
}
```
