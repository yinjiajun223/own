---
title: "阿里云OSS上传实践与踩坑记录"
description: "记录在使用阿里云OSS进行文件上传时的实践经验和遇到的问题解决方案"
publishDate: 2025-01-27
tags:
  - 阿里云
  - OSS
  - 文件上传11
---

## 前言

虽然公司已经有完整成熟的OSS上传组件和流程，但为了更深入理解其中的细节，我决定自己实现一套上传流程。在这个过程中遇到了一些值得记录的问题。

## 前提条件

在开始接入阿里云OSS之前，需要确保满足以下条件：

1. 已注册阿里云账号
2. 已完成个人实名认证或企业实名认证
3. 已开通OSS服务
4. 已创建有OSS管理权限的RAM用户AccessKey

### RAM用户创建流程

1. 登录阿里云控制台，进入RAM访问控制
2. 创建RAM用户：
   - 进入"用户" > "创建用户"
   - 设置登录名称和显示名称
   - 选择"编程访问"，获取AccessKey
   - 保存AccessKeyId和AccessKeySecret
3. 授权：
   - 为RAM用户授予`AliyunOSSFullAccess`权限
   - 建议遵循最小权限原则，根据实际需求授予必要权限

### OSS Bucket配置

1. 创建Bucket：
   - 登录OSS控制台
   - 选择"创建Bucket"
   - 设置Bucket名称、地域、存储类型等
   - 根据需求配置读写权限（建议私有）
2. 跨域设置：
   - 进入Bucket详情 > 权限管理 > 跨域设置
   - 添加跨域规则：
     - 来源：允许的域名
     - 允许Methods：GET、POST、PUT等
     - 允许Headers：*
     - 暴露Headers：ETag等
     - 缓存时间：根据需求设置

## 主要踩坑点

### 1. 文件预览问题

在实践过程中遇到的第一个重要问题是：通过阿里云OSS默认生成的文件URL无法在浏览器中直接预览。

**原因：**
- 出于安全考虑，OSS在使用默认Bucket域名访问文件时，会强制添加下载响应头
- 这导致浏览器会强制下载文件，而不是预览

**解决方案：**
- 使用自定义域名访问OSS文件
- 自定义域名访问不会强制添加下载响应头
- 这样就可以实现在浏览器中直接预览文件

### 2. Vercel部署NestJS服务问题

在实现OSS表单上传时，需要搭建后端服务来处理签名等操作。我选择使用NestJS并部署到Vercel，但遇到了构建配置的问题。

**默认构建失败原因：**
1. Vercel默认会寻找项目根目录下的入口文件（如index.js）
2. NestJS项目编译后的文件在dist目录下，默认配置无法正确识别入口文件
3. NestJS的路由处理方式需要特殊配置才能在Vercel上正常工作

**解决方案：**
在项目根目录创建`vercel.json`配置文件：

```json
{
    "version": 2,
    "builds": [
      {
        "src": "dist/main.js",  // 指定NestJS编译后的入口文件
        "use": "@vercel/node"   // 使用Node.js运行时
      }
    ],
    "routes": [
      {
        "src": "/(.*)",         // 匹配所有路由
        "dest": "dist/main.js"  // 将请求转发到入口文件
      }
    ]
}
```

**配置说明：**
1. `version: 2`: 使用Vercel最新的部署配置版本
2. `builds`配置：
   - `src`: 指定构建的源文件，这里是NestJS编译后的主入口文件
   - `use`: 指定使用的构建器，`@vercel/node`用于Node.js应用
3. `routes`配置：
   - `src`: 使用正则表达式匹配所有incoming请求
   - `dest`: 将所有请求转发到NestJS的入口文件，由NestJS的路由系统处理

### 实施步骤

1. 在阿里云OSS控制台绑定自定义域名
2. 配置DNS解析
3. 如需要HTTPS访问，需要配置SSL证书
4. 在NestJS项目根目录添加vercel.json配置
5. 确保构建命令正确（package.json中的build脚本）
6. 部署到Vercel平台

### 3. 本地开发环境跨域问题

在本地开发过程中遇到了一个特殊的跨域问题：本地开发环境使用HTTP协议（如http://localhost:3000），而OSS上传地址是HTTPS协议，导致跨域请求失败。

**问题表现：**
- 浏览器控制台报错：`Access to XMLHttpRequest at 'https://xxx.oss-cn-xxx.aliyuncs.com' from origin 'http://localhost:3000' has been blocked by CORS policy`
- 上传请求被浏览器拦截，无法完成文件上传

**解决方案：**
1. OSS Bucket跨域设置：
   ```
   来源（Origins）：添加 http://localhost:3000
   允许Methods：GET, POST, PUT, DELETE, HEAD
   允许Headers：*, Content-Type, Content-Disposition, x-oss-*
   暴露Headers：ETag, x-oss-request-id
   缓存时间：86400秒
   ```

2. 注意事项：
   - 来源地址必须完整匹配，包括协议（http/https）和端口号
   - 可以添加多个来源地址，用于支持不同环境
   - 建议开发环境和生产环境分别配置
   - 不建议在生产环境使用`*`通配符

3. 验证方法：
   - 使用浏览器开发者工具查看请求头中的`Origin`
   - 确保OSS返回的响应头包含正确的`Access-Control-Allow-Origin`

4. 最佳实践：
   - 开发环境配置：
     ```
     Origins: http://localhost:3000, http://127.0.0.1:3000
     ```
   - 测试环境配置：
     ```
     Origins: https://test.yourdomain.com
     ```
   - 生产环境配置：
     ```
     Origins: https://www.yourdomain.com
     ```

## 服务端接入实现

### 1. 安装依赖

在NestJS项目中安装阿里云OSS SDK：

```bash
npm install ali-oss
```

### 2. 环境变量配置

创建`.env`文件，添加OSS配置信息：

```env
OSS_REGION=oss-cn-shanghai
OSS_ACCESS_KEY_ID=your_access_key_id
OSS_ACCESS_KEY_SECRET=your_access_key_secret
OSS_BUCKET=your_bucket_name
```

### 3. 创建OSS服务

```typescript
// src/services/oss.service.ts
import { Injectable } from '@nestjs/common';
import * as OSS from 'ali-oss';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OssService {
  private client: OSS;

  constructor(private configService: ConfigService) {
    this.client = new OSS({
      region: configService.get('OSS_REGION'),
      accessKeyId: configService.get('OSS_ACCESS_KEY_ID'),
      accessKeySecret: configService.get('OSS_ACCESS_KEY_SECRET'),
      bucket: configService.get('OSS_BUCKET'),
    });
  }

  // 生成上传签名
  async generateUploadSignature(dir: string = ''): Promise<any> {
    try {
      const date = new Date();
      date.setHours(date.getHours() + 1); // 签名1小时内有效
      const policy = {
        expiration: date.toISOString(), // 设置policy过期时间
        conditions: [
          ['content-length-range', 0, 1048576000], // 设置上传文件的大小限制
          ['starts-with', '$key', dir], // 限制上传文件的路径前缀
        ],
      };

      const formData = await this.client.calculatePostSignature(policy);
      const host = `https://${this.configService.get('OSS_BUCKET')}.${this.configService.get('OSS_REGION')}.aliyuncs.com`;

      return {
        expire: date.getTime(),
        policy: formData.policy,
        signature: formData.Signature,
        accessId: formData.OSSAccessKeyId,
        host,
        dir,
      };
    } catch (error) {
      throw new Error('生成上传签名失败：' + error.message);
    }
  }

  // 获取文件访问URL
  async getFileUrl(objectName: string): Promise<string> {
    try {
      const url = this.client.signatureUrl(objectName, {
        expires: 3600, // URL有效期1小时
      });
      return url;
    } catch (error) {
      throw new Error('获取文件访问URL失败：' + error.message);
    }
  }
}
```

### 4. 创建上传控制器

```typescript
// src/controllers/upload.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { OssService } from '../services/oss.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly ossService: OssService) {}

  @Get('signature')
  async getUploadSignature(@Query('dir') dir: string = '') {
    return await this.ossService.generateUploadSignature(dir);
  }

  @Get('url')
  async getFileUrl(@Query('objectName') objectName: string) {
    return await this.ossService.getFileUrl(objectName);
  }
}
```

### 5. 注册模块

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadController } from './controllers/upload.controller';
import { OssService } from './services/oss.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [UploadController],
  providers: [OssService],
})
export class AppModule {}
```

### 6. 安全性考虑

1. 文件大小限制：
   - 在policy中设置`content-length-range`
   - 建议根据业务需求设置合适的限制

2. 文件类型限制：
   - 在policy中可以添加文件类型限制
   - 前端也需要做相应的校验

3. 上传路径限制：
   - 使用`starts-with`限制上传路径
   - 可以按用户、日期等组织文件路径

4. 签名有效期：
   - 设置合理的签名过期时间
   - 默认设置为1小时，可根据需求调整

## 4. Vercel部署路由配置问题

在将前端和后端项目部署到Vercel时，都遇到了路由访问404的问题。这是因为Vercel的默认路由处理机制与项目的路由系统不完全匹配。

#### 前端项目（Vue3 + Vite）路由问题

**问题描述：**
- 本地开发环境中，直接访问路由地址（如`http://localhost:3000/upload`）可以正常访问
- 部署到Vercel后，直接访问路由地址返回404错误
- 这是因为Vercel默认不知道如何处理Vue Router的历史模式路由

**解决方案：**
在项目根目录创建`vercel.json`配置文件：
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**配置说明：**
- `rewrites`：URL重写规则
- `source`: 匹配所有的路由请求
- `destination`: 将所有请求重定向到index.html，让Vue Router接管路由处理
- 这样配置后，所有的路由请求都会被转发到前端应用的入口文件，由Vue Router进行处理

#### 后端项目（NestJS）路由问题

**问题描述：**
- 本地开发环境中API接口可以正常访问
- 部署到Vercel后，API接口返回404错误
- 这是因为Vercel需要明确知道如何构建和路由NestJS应用

**解决方案：**
更新后的`vercel.json`配置：
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/main.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/src/main.ts"
    }
  ]
}
```

**配置说明：**
1. `version`: 指定Vercel配置版本
2. `builds`配置：
   - `src`: 指定NestJS应用的入口文件
   - `use`: 使用@vercel/node处理Node.js应用
3. `routes`配置：
   - `src`: 匹配所有incoming请求
   - `dest`: 将请求转发到应用入口文件

**注意事项：**
1. 前端项目：
   - 确保Vue Router使用的是历史模式（createWebHistory）
   - 配置后需要重新部署项目

2. 后端项目：
   - 确保main.ts中正确配置了全局前缀（如果有）
   - 注意跨域配置（CORS）
   - 环境变量需要在Vercel平台上配置

这两个配置文件的本质都是处理路由重写，使得Vercel能够正确地将请求转发到应用的对应处理程序。前端项目重写到index.html让Vue Router处理路由，后端项目重写到入口文件让NestJS处理API请求。

## 总结

在使用阿里云OSS时，除了基本的文件访问配置外，还需要注意部署环境的特殊要求。使用Vercel部署NestJS服务时，正确的配置文件对于成功部署至关重要。