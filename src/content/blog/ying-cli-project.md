---
title: "从零搭建个人脚手架工具：Ying CLI"
description: "详细介绍如何使用 Node.js 构建一个现代化的项目脚手架工具，包含项目模板管理、开发服务器等功能"
publishDate: 2025-01-18
tags:
  - Node.js
  - CLI
  - 工程化
  - 脚手架
---

## 前言

#### 1.什么是脚手架，为什么要学习脚手架开发？
前端脚手架是一种用于快速搭建前端项目基础结构的工具，通过命令行交互的方式帮助开发者减少重复性工作，提高开发效率，掌握前端工程化思想
#### 2.常见的脚手架（@vue/cli、@angular/cli、create-react-app、vite...）

## 全局安装和命令执行的原理

在开始介绍项目之前，我先说说为什么全局安装后就能在命令行里直接用 `ying-cli` 这个命令。

原来是这样的：
1. 当我们执行 `npm install -g ying-cli` 的时候，npm 会把这个包安装到全局目录下
   - Windows 系统一般在 `C:\\Users\\用户名\\AppData\\Roaming\\npm\\node_modules`
   - Mac/Linux 一般在 `/usr/local/lib/node_modules`

2. 安装的时候 npm 会看我们 package.json 里的 `bin` 字段：
   ```json
   {
     "bin": {
       "ying-cli": "./bin/cli.js"
     }
   }
   ```
   这个配置告诉 npm："嘿，帮我在全局目录创建一个叫 `ying-cli` 的命令，指向这个 JS 文件"

3. npm 就会在全局目录的 bin 文件夹里创建一个软链接：
   - Windows 会创建 `ying-cli.cmd`
   - Mac/Linux 会创建一个叫 `ying-cli` 的软链接

4. 这些目录都在系统的环境变量 PATH 里，所以当我们在终端输入 `ying-cli` 的时候，系统就能找到并执行对应的 JS 文件了

5. 在 cli.js 的开头，有一行很重要的代码：
   ```javascript
   #!/usr/bin/env node
   ```
   这行代码告诉系统用 node 来执行这个文件，这个注释必须放在第一行，专业点叫 "Shebang(Hashbang)"

## 脚手架是怎么工作的？

在开始介绍我的项目之前，先来聊聊脚手架的基本原理。它主要做这么几件事：

1. **命令解析**：当你在终端输入命令时（比如 `ying-cli create my-project`），脚手架会解析这个命令和参数，判断你想干什么。

2. **项目模板**：脚手架会在某个地方（可能是本地，也可能是远程）存储一些项目模板。就像你装修房子用的样板间，里面已经帮你把基础设施都配好了。

3. **文件操作**：根据你的选择，脚手架会把模板复制到你指定的位置，并且可能会根据你的配置修改一些文件内容。

4. **依赖安装**：最后，它会帮你装好所有需要的依赖，这样你就可以直接开始写代码了。

简单来说，脚手架就是一个自动化工具，帮你把那些重复的准备工作一键搞定！

## 为什么要自己造轮子？

已经有 Vue CLI、Create React App 这些成熟的工具了，为什么还要自己造轮子呢？

主要有这几个原因：
1. 现有的脚手架可能不完全符合我们团队的开发习惯
2. 想要更灵活的定制能力
3. 最重要的是...学习嘛，造轮子的过程其实就是学习的过程！

## 核心功能

Ying CLI 目前实现了这些功能：

- 🚀 快速创建项目：支持多种项目模板
- 📦 自动装依赖：省去手动 npm install 的步骤
- 🔄 强制更新：想覆盖就覆盖，就是这么任性
- 🌐 开发服务器：内置了一个静态文件服务器
- 🎨 交互体验：命令行界面很友好，菜鸟也能轻松上手

## 技术实现

### 1. 命令行工具开发

首先用 `commander` 来处理命令行操作：

```javascript
import chalk from "chalk"; // 命令行美化工具
import { program } from "commander"; // 引入commander

// 设置命令行名称、使用方法、描述、版本
program.name(pkg.name).usage("<command> [options]").description(chalk.greenBright(pkg.description)).version(pkg.version);

// 定义 create 命令
program
  .command("create [projectName]") // 配置命令的名字和参数
  .description(chalk.greenBright("创建一个项目")) // 命令对应的描述
  .option("-f, --force", chalk.greenBright("如果文件存在就强行覆盖"))
  .action(create);

// 定义 server 命令
program
  .command("server [directory]")
  .description(chalk.greenBright(chalk.bold("启动本地静态文件服务器")))
  .option("-p, --port <port>", `指定${chalk.yellowBright("端口号")}`, "8080")
  .option("-o, --open", "自动打开浏览器", false)
  .action((directory, options) => {
    server(directory, {
      port: parseInt(options.port),
      open: options.open,
    }).catch(() => process.exit(1));
  });
```

### 2. 项目模板管理
  目前功能已经实现，但是还没有模板

<!-- 目前支持两种模板：
- Vue2 + TypeScript + Vant 的 H5 模板
- Vue2 + TypeScript + Vant 的 AppWeb 模板

模板的目录结构是这样的：
```
templates/
├── vue2-h5/
│   ├── template/
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   └── meta.js
└── vue2-appweb/
    ├── template/
    │   ├── src/
    │   ├── public/
    │   └── package.json
    └── meta.js
``` -->

### 3. 开发服务器实现

用 Express 搭了个简单的静态服务器：

```javascript
import express from "express";
import path from "path";
import chalk from "chalk";
import os from "os";

async function server(directory = ".", options = {}) {
  const {
    port = 8080,
    host = "0.0.0.0",
    open = false,
  } = options;

  const app = express();
  const rootDir = path.resolve(process.cwd(), directory);
  
  // 静态文件服务
  app.use(express.static(rootDir));

  return new Promise((resolve, reject) => {
    try {
        const portNumber = parseInt(port, 10);
        const server = app.listen(portNumber, host, () => {
        const localIP = getLocalIP();
        const networkAddress = `http://${localIP}:${portNumber}`;

        console.log(`${chalk.cyan("Network:")} ${chalk.cyan(networkAddress)}`);

        if (open) {
          import("open").then(module => module.default(localAddress));
        }

        resolve(server);
      });

      server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
          console.error(chalk.red(`Port ${portNumber} is already in use`));
          console.error(chalk.yellow(`Try: ying-cli server -p ${portNumber + 1}`));
        } else {
          console.error(chalk.red("Server error:"), err.message);
        }
        reject(err);
      });
    } catch (err) {
      console.error(chalk.red("Fatal error:"), err.message);
      reject(err);
    }
  });
}
```

### 4. 用户交互优化

使用 `inquirer` 来实现命令行交互，让用户选择项目模板：

```javascript
const inquirer = require('inquirer');

async function promptTemplate() {
  const { template } = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: '请选择项目模板：',
      choices: [
        { name: 'Vue2 + TS + Vant (H5)', value: 'vue2-h5' },
        { name: 'Vue2 + TS + Vant (AppWeb)', value: 'vue2-appweb' }
      ]
    }
  ]);
  return template;
}
```

## 怎么用？

### 安装

```bash
# 全局安装
npm install -g ying-cli

# 或者用 yarn 也行
yarn global add ying-cli
```

### 创建项目

```bash
# 创建新项目
ying-cli create my-project

# 要是目录已经存在，可以强制覆盖
ying-cli create my-project -f
```

### 启动开发服务器

```bash
# 在当前目录启动服务器
ying-cli server

# 想指定端口和目录？没问题
ying-cli server ./dist -p 3000

# 懒得自己打开浏览器？加个 -o 参数就行
ying-cli server -o
```

## 项目结构

```
ying-cli/
├── bin/              # CLI 入口文件
├── src/              # 源代码
│   ├── config/       # 配置文件
│   └── scripts/      # 脚本文件
└── templates/        # 项目模板
```

## 用到的工具

- commander：处理命令行
- chalk：让命令行输出有点颜色看着舒服
- inquirer：处理用户输入，支持选择、确认等交互
- ora：添加好看的加载动画
- fs-extra：文件操作更方便
- express：搭建开发服务器
- open：自动打开浏览器

## 写在最后

这是我的第一个脚手架工具,虽然功能还比较简单，但是对于我个人来说还是挺有帮助的。通过这个项目，我也学到了不少关于 Node.js 和工程化的知识。
