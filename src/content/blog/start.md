---
title: Markdown 样式示例
description: '这是一些基本的 Markdown 语法示例，可以在 Astro 中编写 Markdown 内容时使用。'
publishDate: 2024-10-20 00:00:00
# img: /assets/stock.jpg 可配置文章封面
# img_alt: stock
tags:
  - Markdown
---

这是一些基本的 Markdown 语法示例，可以在 Astro 中编写 Markdown 内容时使用。

## 标题

以下 HTML `<h1>`—`<h6>` 元素表示六个级别的章节标题。`<h1>` 是最高级别的章节，而 `<h6>` 是最低的。

# H1

## H2

### H3

#### H4

##### H5

###### H6

## 段落

Xerum, quo qui aut unt expliquam qui dolut labo. Aque venitatiusda cum, voluptionse latur sitiae dolessi aut parist aut dollo enim qui voluptate ma dolestendit peritin re plis aut quas inctum laceat est volestemque commosa as cus endigna tectur, offic to cor sequas etum rerum idem sintibus eiur? Quianimin porecus evelectur, cum que nis nust voloribus ratem aut omnimi, sitatur? Quiatem. Nam, omnis sum am facea corem alique molestrunt et eos evelece arcillit ut aut eos eos nus, sin conecerem erum fuga. Ri oditatquam, ad quibus unda veliamenimin cusam et facea ipsamus es exerum sitate dolores editium rerore eost, temped molorro ratiae volorro te reribus dolorer sperchicium faceata tiustia prat.

Itatur? Quiatae cullecum rem ent aut odis in re eossequodi nonsequ idebis ne sapicia is sinveli squiatum, core et que aut hariosam ex eat.

## 图片

![alt text](/public/assets/cover/grid-animation.png)

## 引用

blockquote 元素表示从其他来源引用的内容，可以选择性地在 `footer` 或 `cite` 元素中包含引用，并可以选择性地进行内联更改，如注释和缩写。

### 无署名引用

#### 语法

```markdown
> Tiam, ad mint andaepu dandae nostion secatur sequo quae.  
> **注意** 你可以在 blockquote 中使用 _Markdown 语法_。
```

#### 输出

> Tiam, ad mint andaepu dandae nostion secatur sequo quae.  
> **注意** 你可以在 blockquote 中使用 _Markdown 语法_。

### 带署名引用

#### 语法

```markdown
> 不要通过共享内存来通信，而是通过通信来共享内存。<br>
> — <cite>Rob Pike[^1]</cite>
```

#### 输出

> 不要通过共享内存来通信，而是通过通信来共享内存。<br>
> — <cite>Rob Pike[^1]</cite>

[^1]: 上述引用摘自 Rob Pike 在 2015 年 11 月 18 日 Gopherfest 上的[演讲](https://www.youtube.com/watch?v=PAAkCSZUG1c)。

## 表格

### 语法

```markdown
| 斜体   | 粗体     | 代码   |
| --------- | -------- | ------ |
| _斜体_ | **粗体** | `代码` |
```

### 输出

| 斜体   | 粗体     | 代码   |
| --------- | -------- | ------ |
| _斜体_ | **粗体** | `代码` |

## 代码块

### 语法

我们可以使用三个反引号 ``` 在新行中编写代码片段，并在新行中关闭三个反引号。为了突出显示特定语言的语法，在第一个三个反引号后写一个语言名称，例如 html、javascript、css、markdown、typescript、txt、bash。

````markdown
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>示例 HTML5 文档</title>
  </head>
  <body>
    <p>测试</p>
  </body>
</html>
```
````

### 输出

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>示例 HTML5 文档</title>
  </head>
  <body>
    <p>测试</p>
  </body>
</html>
```

## 列表类型

### 有序列表

#### 语法

```markdown
1. 第一项
2. 第二项
3. 第三项
```

#### 输出

1. 第一项
2. 第二项
3. 第三项

### 无序列表

#### 语法

```markdown
- 列表项
- 另一个项
- 还有一个项
```

#### 输出

- 列表项
- 另一个项
- 还有一个项

### 嵌套列表

#### 语法

```markdown
- 水果
  - 苹果
  - 橙子
  - 香蕉
- 乳制品
  - 牛奶
  - 奶酪
```

#### 输出

- 水果
  - 苹果
  - 橙子
  - 香蕉
- 乳制品
  - 牛奶
  - 奶酪

## 其他元素 — abbr, sub, sup, kbd, mark

### 语法

```markdown
<abbr title="Graphics Interchange Format">GIF</abbr> 是一种位图图像格式。

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

按 <kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>Delete</kbd> 结束会话。

大多数 <mark>蝾螈</mark> 是夜行性的，捕食昆虫、蠕虫和其他小生物。
```

### 输出

<abbr title="Graphics Interchange Format">GIF</abbr> 是一种位图图像格式。

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

按 <kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>Delete</kbd> 结束会话。

大多数 <mark>蝾螈</mark> 是夜行性的，捕食昆虫、蠕虫和其他小生物。