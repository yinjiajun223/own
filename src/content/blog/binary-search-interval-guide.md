---
title: "二分法核心：如何正确维护搜索区间"
description: "二分查找最容易错的不是 mid，而是区间定义。系统讲清左闭右闭与左闭右开两种写法的初始化、循环条件、更新规则与常见陷阱。"
publishDate: 2026-03-05
tags:
  - 算法
  - 二分查找
  - JavaScript
  - 数据结构
  - LeetCode
---

二分法的本质不是“折半”，而是**持续维护一个不变的搜索区间**。  
只要区间定义一致，代码就稳定；一旦定义混用，就容易死循环或漏查。

这篇文章把两种最常见区间定义一次讲清：

- 左闭右闭：`[left, right]`
- 左闭右开：`[left, right)`

---

## 1）左闭右闭区间 `[left, right]`

### 区间含义

- `left` 和 `right` 都是**有效下标**
- 区间包含两端

### 初始化

```js
let left = 0;
let right = nums.length - 1;
```

因为要让初始区间覆盖全部元素，右端必须是最后一个有效下标。

### 循环条件

```js
while (left <= right)
```

当 `left === right` 时，区间里还有 1 个元素，仍然需要检查。

### 更新规则

- `nums[mid] < target`：目标在右侧，`left = mid + 1`
- `nums[mid] > target`：目标在左侧，`right = mid - 1`

注意：`mid` 已经比较过，必须排除。

### 终止条件

- 当 `left > right`，区间为空，循环结束

### 模板代码

```js
function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) return mid;
    if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}
```

---

## 2）左闭右开区间 `[left, right)`

### 区间含义

- `left` 是有效下标
- `right` 是边界，不在区间内

### 初始化

```js
let left = 0;
let right = nums.length;
```

`right` 取到“末尾后一位”，符合右开定义。

### 循环条件

```js
while (left < right)
```

当 `left === right` 时，区间长度为 0，已是空区间。

### 更新规则

- `nums[mid] < target`：`left = mid + 1`
- `nums[mid] > target`：`right = mid`

关键点：右开区间里，`right` 本来就不包含，所以可以直接收缩到 `mid`。

### 终止条件

- 当 `left === right`，区间为空，循环结束

### 模板代码

```js
function search(nums, target) {
  let left = 0;
  let right = nums.length;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) return mid;
    if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return -1;
}
```

---

## 3）两种写法对照

| 细节           | 左闭右闭 `[left, right]` | 左闭右开 `[left, right)` |
| -------------- | ------------------------ | ------------------------ |
| 初始化 `right` | `nums.length - 1`        | `nums.length`            |
| 循环条件       | `left <= right`          | `left < right`           |
| 更新 `right`   | `right = mid - 1`        | `right = mid`            |
| 终止状态       | `left > right`           | `left === right`         |

---

## 4）最常见的坑

### 坑 1：区间定义混用

例如你写的是左闭右闭，却用了 `right = mid`，可能导致死循环。

### 坑 2：循环条件写错

左闭右闭如果写成 `left < right`，会漏掉 `left === right` 的单元素检查。

### 坑 3：左右更新不对称

如果左边用 `left = mid + 1`，右边却不是对应地排除 `mid`（如还写 `right = mid`），逻辑就不闭合。

---

## 5）例子走一遍

给定：

```txt
nums = [1, 2, 3, 4, 5], target = 2
```

### 左闭右闭 `[left, right]`

1. 初始：`left = 0, right = 4`
2. `mid = 2`，`nums[mid] = 3 > 2`，`right = 1`
3. `mid = 0`，`nums[mid] = 1 < 2`，`left = 1`
4. `mid = 1`，命中，返回 `1`

### 左闭右开 `[left, right)`

1. 初始：`left = 0, right = 5`
2. `mid = 2`，`nums[mid] = 3 > 2`，`right = 2`
3. `mid = 1`，命中，返回 `1`

---

## 6）怎么选？

- 如果你更重视“下标直觉”，优先用左闭右闭 `[left, right]`
- 如果你想和很多库/语言习惯（例如切片）统一，可用左闭右开 `[left, right)`

没有绝对优劣，关键是：**选一种后，从初始化到更新全程自洽**。

---

## 总结

写二分法时，先回答这三个问题，再写代码：

1. 我的区间到底是 `[left, right]` 还是 `[left, right)`？
2. 循环什么时候停止？
3. `mid` 比较后，左右边界如何收缩才不破坏区间定义？

只要这三件事统一，二分法就会稳定、可复用、几乎不出错。
