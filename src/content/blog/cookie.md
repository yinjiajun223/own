---
title: "跨域登录与 Token 共享踩坑记录"
description: "记录在 a.com 嵌套 b.com 场景下遇到的 Cookie、Storage 以及 Token 共享相关问题与解决方案"
publishDate: 2025-09-08
tags:
  - 跨域
  - Cookie
  - Token
  - 前端开发
---

# 跨域登录 / Token 共享 踩坑记录

## 背景

- 项目中存在 **a.com 嵌套 b.com** 的场景。
- b.com 有自己的登录逻辑，并将 token 写入 Cookie。
- 发现 **Cookie 在跨域 iframe 场景下不生效**，但当 a.com 和 b.com 属于同一主域时，可以正常使用。

---

## 踩坑点总结

### 1. Cookie 设置不生效

- 现象：在 iframe 中登录 b.com，前端通过 JS 设置 Cookie，不生效。
- 原因：浏览器（Chrome 80+）对第三方 Cookie 默认限制，iframe 中 JS 设置 Cookie 会被拦截。
- 解决：
  - 必须由 **后端通过 `Set-Cookie` header 设置 Cookie**。
  - 并且满足：`SameSite=None; Secure` + HTTPS。

---

### 2. Cookie 设置了，但请求没带上

- 现象：在 DevTools 里能看到 Cookie，但请求时没有携带。
- 原因：`SameSite` 策略阻止了第三方请求带上 Cookie。
- 解决：
  - 确认 Cookie 响应头：
    ```
    Set-Cookie: token=xxxx; Path=/; Domain=b.com; SameSite=None; Secure
    ```
  - 确认请求走的是 HTTPS。

---

### 3. 正常模式 vs 无痕模式差异

- **正常模式**：
  - 第三方 Cookie 还能用，但控制台有警告：
    > “来自 xxx.com 的 Cookie 可能因第三方 Cookie 逐步淘汰机制而被屏蔽”
- **无痕模式**：
  - 第三方 Cookie 默认直接被屏蔽，即使 `SameSite=None; Secure` 也不行。
- **结论**：
  - 这是 Chrome 正在逐步淘汰第三方 Cookie 的表现，未来（2025 前后）即使正常模式也会全面禁用。

---

### 4. localStorage / sessionStorage 的限制

- **同源策略**：只能在相同 origin 下访问，a.com 无法访问 b.com 的存储。
- **iframe 内部**：
  - b.com 的脚本可以访问自己的 localStorage/sessionStorage。
  - 但在 Safari、无痕模式、以及部分 Chrome 实验中，第三方 iframe 的存储会被完全禁用。
- **解决**：可以使用 **Storage Access API** 在用户交互时申请存储访问，但只是过渡方案。

---

### 5. Storage Access API

- 用途：允许嵌入的第三方 iframe（如 b.com）在 **用户交互后** 申请访问自己的 Cookie/localStorage。
- API 示例：
  ```js
  document.hasStorageAccess().then((hasAccess) => {
    if (!hasAccess) {
      document
        .requestStorageAccess()
        .then(() => {
          console.log("已获取存储访问权限");
        })
        .catch(() => {
          console.warn("用户拒绝授权");
        });
    }
  });
  ```
