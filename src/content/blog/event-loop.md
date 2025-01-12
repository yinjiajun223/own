---
title: "JavaScript 事件循环"
description: "探索 JavaScript 事件循环的工作原理及其在异步编程中的应用"
publishDate: 2024-10-26
tags:
  - JavaScript
  - 事件循环
  - 异步编程
---

## 引言

JavaScript 是一种**单线程**语言，这意味着它一次只能执行一个任务。然而，JavaScript 通过**事件循环**机制实现了异步编程，使得它能够处理多个任务而不阻塞主线程。本文将深入探讨 JavaScript 事件循环的工作原理，并通过示例帮助你理解这一概念。

## 事件循环的基本概念

事件循环是 JavaScript 运行时的一部分，它负责管理代码执行、事件处理和子任务队列。事件循环的核心思想是不断检查**调用栈**和**任务队列**，并在调用栈为空时处理任务队列中的事件。

### 调用栈

调用栈是一个 **LIFO**（后进先出）结构，用于存储代码执行的上下文。当函数被调用时，它会被压入栈中，执行完毕后会被弹出。

```javascript
function foo() {
  console.log('foo');
}

function bar() {
  foo();
  console.log('bar');
}

bar();
// 输出顺序：foo, bar
```

### 任务队列

任务队列用于存储待处理的异步任务，如 `setTimeout`、`Promise` 回调等。当调用栈为空时，事件循环会从任务队列中取出任务并执行。

```javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout');
}, 0);

console.log('End');
// 输出顺序：Start, End, Timeout
```

## 微任务与宏任务

JavaScript 中的任务分为**微任务**（Microtask）和**宏任务**（Macrotask）。微任务的优先级高于宏任务，事件循环会在每个宏任务结束后立即执行所有微任务。

### 宏任务

宏任务包括 `setTimeout`、`setInterval`、`I/O` 操作等。每次事件循环都会从宏任务队列中取出一个任务执行。

### 微任务

微任务包括 `Promise` 回调、`MutationObserver` 等。微任务会在当前宏任务执行完毕后立即执行。

```javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise');
});

console.log('End');
// 输出顺序：Start, End, Promise, Timeout
```

## 实际案例分析

### 案例 1: 理解异步任务的执行顺序

```javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout 1');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise 1');
}).then(() => {
  console.log('Promise 2');
});

setTimeout(() => {
  console.log('Timeout 2');
}, 0);

console.log('End');
// 输出顺序：Start, End, Promise 1, Promise 2, Timeout 1, Timeout 2
```

### 案例 2: 微任务与宏任务的交替执行

```javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout 1');
  Promise.resolve().then(() => {
    console.log('Promise 1');
  });
}, 0);

setTimeout(() => {
  console.log('Timeout 2');
}, 0);

console.log('End');
// 输出顺序：Start, End, Timeout 1, Promise 1, Timeout 2
```

### 案例 3: 复杂的异步任务执行顺序

```javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout 1');
}, 0);

setTimeout(() => {
  console.log('Timeout 2');
  Promise.resolve().then(() => {
    console.log('Promise 1');
  });
}, 0);

Promise.resolve().then(() => {
  console.log('Promise 2');
}).then(() => {
  console.log('Promise 3');
});

console.log('End');
// 输出顺序：Start, End, Promise 2, Promise 3, Timeout 1, Timeout 2, Promise 1
```

## 结语

了解**事件循环**、**调用栈**、**任务队列**以及**微任务**和**宏任务**的执行顺序，对 JavaScript 的异步编程有更清晰的认识。