# 个人简历网站 - 基于 Astro.js

### 网站预览

预览地址: <a href="https://blog.yinjiajun.cn/" target="_blank">https://blog.yinjiajun.cn/</a>

### 技术栈

- Astro.js 4.15.9
- Sass 1.79.4
- TypeScript 5.6.2
- TailwindCSS 3.4.11

### 主要功能

1. 个人简介展示

   - 专业技能介绍
   - 工作经历展示
   - 技术理念阐述

2. 项目展示

   - 支持多图片展示
   - 项目分类标签
   - 自定义项目详情页

3. 博客
   - Markdown 支持
   - 标签分类
   - 自定义文章模板

### 项目结构

```
/
├── public/              # 静态资源
├── src/
│   ├── assets/         # 图片等资源
│   ├── components/     # 组件
│   ├── content/        # 博客内容
│   ├── data/          # 网站配置数据
│   ├── layouts/       # 布局模板
│   └── pages/         # 页面
├── astro.config.mjs    # Astro 配置
└── package.json
```

### 快速开始

```bash
# 安装依赖
npm install

# 开发环境
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview
```

### 自定义内容

1. 修改个人信息

   - 编辑 `src/data/content.ts` 更新基本信息
   - 在 `src/pages/about.astro` 中更新个人简介

2. 添加项目展示

   - 在 `src/data/project.ts` 中添加项目信息
   - 创建对应的项目详情页

3. 发布博客文章
   - 在 `src/content/blog/` 下创建 markdown 文件
   - 按模板格式添加文章内容

<!-- ### 关于作者

我是尹家俊，一名专注于 Angular 和 Vue.js 技术栈的前端开发工程师。在大型企业级应用开发方面有丰富经验，擅长统一认证、微前端架构和通用组件库开发。

### 联系方式

- QQ: 316390862 -->
