---
title: "Agent Skills 初体验"
description: "从概念到实战，记录我对 Agent Skills 的第一次完整踩坑与上手体验"
publishDate: 2026-01-26
tags:
  - Agent Skills
  - AI
  - Copilot
  - 工具使用
---

最近刷抖音和技术文章时，频繁看到 **Agent Skills** 这个概念，被吹得“很火、很强、很智能”。
出于好奇，我也花了一点时间系统了解并亲自实践了一下，本文记录整个探索过程和一些真实踩坑经验。

---

## 什么是 Agent Skills

Agent Skills 最初由 **Anthropic** 为 Claude 提出并实现，后来逐渐发展为一个更通用、可移植的规范。

官方站点：
[https://agentskills.io/home](https://agentskills.io/home)

一开始我并没有深入了解 skill 的具体内容，第一眼看上去感觉和 **Cursor Rules** 很像 ——
本质上就是给 AI 提供一些 prompt，让模型更好地理解你的需求，并按照约定方式完成任务。

但在仔细阅读文档后发现，**Agent Skills 和 Rules 并不是一个层级的东西**：

> 如果简单类比，Agent Skills 更像是
> **Rules + MCP（可执行能力） 的进阶版本**

---

## Agent Skills 的基本概念

Agent Skills 以「文件结构」作为基本单位，每个 skill 都是一个独立的目录，遵循明确的规范：

```
my-skill/
├── SKILL.md        # 必须：技能说明 + 元数据
├── scripts/        # 可选：可执行脚本
├── references/     # 可选：参考文档
└── assets/         # 可选：模板或资源文件
```

核心点只有一个：**`SKILL.md` 是技能的入口和灵魂**。

---

## SKILL.md 文件结构说明

一个最基础的 `SKILL.md` 文件示例如下：

```md
---
name: pdf-processing
description: Extract text and tables from PDF files, fill forms, merge documents.
---

# PDF Processing

## When to use this skill

Use this skill when the user needs to work with PDF files...

## How to extract text

1. Use pdfplumber for text extraction...

## How to fill forms

...
```

### SKILL.md 顶部元数据（必须）

`SKILL.md` 顶部必须包含一个 YAML 区块，包含以下字段：

- **name**
  - 最多 64 个字符
  - 只能使用：小写字母、数字、连字符
  - 不能以连字符开头或结尾

- **description**
  - 用一句话描述这个 skill 何时、为何使用

  **踩坑提示**
  我一开始是照着抖音视频写的中文 `name`，在某些环境下确实“看起来能生效”，
  但在我本地多次尝试后发现并不稳定。

后来翻官方文档才确认：
**`name` 的字符限制是规范的一部分，建议严格遵守**
（不排除是较新版本的强校验要求）

官方完整规范文档：
[https://agentskills.io/specification](https://agentskills.io/specification)

---

## 为什么 Agent Skills 值得用

这种设计有几个非常明显的优势：

- **自文档化**
  直接阅读 `SKILL.md` 就能理解技能用途和行为
- **可扩展性强**
  从纯文本指令，到脚本、模板、资源都可以逐步演进
- **高度可移植**
  Skill 本质就是文件夹，非常适合版本控制和共享

---

## 实践体验：从 Claude 到 Copilot

### Claude：直接劝退

因为 Agent Skills 最早由 Claude 提出，我第一反应是想直接用 Claude 体验：

- 国内无法注册
- 价格偏高

  直接放弃。

---

### GitHub Copilot：再次踩坑

我平时一直在用 **GitHub Copilot**，于是打算直接用它试试。

**结果又踩坑了。**

一开始我使用的是 **VS Code Copilot 稳定版插件**，
无论怎么配置 Skills，完全不生效。

后来翻官方文档才发现：

> Agent Skills 目前仅支持：
>
> - Copilot Coding Agent
> - GitHub Copilot CLI
> - Visual Studio Code **预览版** 的 Agent 模式
>
> VS Code 稳定版尚未支持（即将支持）

---

## 使用 GitHub Copilot CLI 实践 Agent Skills

### 安装 Copilot CLI

我本地已有 Node.js，因此直接使用 npm 安装：

```bash
# 需要 Node.js 22+
npm install -g @github/copilot
```

安装完成后，直接在终端输入 `copilot` 即可。
如果未登录，会提示你先完成 GitHub 登录授权。

---

### Skill 的两种作用范围

Copilot CLI 支持两种 Skill 作用域：

- **全局 Skill**

  ```
  ~/.copilot/skills/
  ```

- **项目级 Skill**

  ```
  /path/to/repo/.github/skills/
  ```

---

## 不使用 Skill 的默认效果

我先写了一个最简单的 JS 函数：

```js
function add(a, b) {
  return a + b;
}
```

然后在终端中让 Copilot 给函数加注释。
生成结果没问题，会提示确认是否修改文件，整体体验正常。

![终端中调用 Copilot](/assets/agent-skills/image.png)

![确认修改提示](/assets/agent-skills/image-1.png)

---

## 添加第一个 Skill 并验证是否生效

接着我创建了一个最简单的本地 Skill：

```
test-skill-project/
└── .github/
    └── skills/
        └── test/
            └── SKILL.md
```

`SKILL.md` 内容如下：

```md
---
name: function-explanation
description: 这是一个用于解释代码中函数作用的技能。
---

给代码中的函数加上中文注释，并且在结尾处加上：
created by Yinjiajun 2026-01-26
```

这里只做了**最小可用配置**，目的只有一个：
👉 **确认 Skill 是否真的会被 Copilot 使用**

---

### Skills 管理命令

Copilot CLI 自带 skills 管理能力：

```
/skills [list|info|add|remove|reload]
```

可以用来查看、加载和调试当前可用的 skills。

![skills 管理命令界面](/assets/agent-skills/image-2.png)

---

### Skill 生效验证结果

再次让 Copilot 处理同样的代码后，可以明显看到：

- 注释内容发生变化
- 自动按 Skill 中的要求追加了固定文本

👉 **说明 Skill 已成功生效**

![再次提问的输入示例](/assets/agent-skills/image-3.png)

![技能生效后的输出结果](/assets/agent-skills/image-4.png)

这也是 `SKILL.md` 最基础、最直接的使用方式。

---

## 更复杂的 Skill 能做什么？

在 Skill 目录下，你还可以继续扩展：

- `scripts/`：执行真实代码
- `assets/`：模板、UI 片段
- `references/`：补充上下文文档

后续我还尝试了一些社区中比较热门的 Skill，比如用于生成前端界面的：

[https://skills.sh/anthropics/skills/frontend-design](https://skills.sh/anthropics/skills/frontend-design)

---

## 总结

这次对 Agent Skills 的初体验，我的结论是：

- **它不是简单的 Prompt 封装**，更像是为 AI Agent 提供的一套「结构化、可复用、可执行的能力模块」。
- 在 Copilot、Agent Workflow 与复杂任务自动化场景中，**潜力很大**。

相比传统的 Rules，我更倾向于这样理解：

- **Rules**：始终生效的行为约束。
- **Skills**：按需加载的能力单元。

Skills 会先基于 **元数据 / 意图 / 上下文** 进行匹配，命中后才执行后续逻辑或脚本，这带来的收益是：

- 每轮对话不必注入完整 Prompt
- 显著减少无效上下文
- 在复杂 Agent 场景下大幅节省 token
- 可维护性与可扩展性更强
