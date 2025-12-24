---
title: "算法设计思想与解题模式"
author: "foxgem"
description: "系统总结常见的算法设计思想和解题模式，包括双指针、滑动窗口、分治、贪心、动态规划等核心方法。"
pubDate: 2025-12-24
tags: ["algorithm", "leetcode", "programming", "interview"]
theme: "solarized"
transition: "slide"
controls: true
progress: true
---

## 算法设计思想与解题模式

掌握套路，举一反三

---

## 常见算法思想概览

```
┌─────────────┬─────────────┬─────────────┐
│   暴力枚举   │   双指针    │   滑动窗口   │
├─────────────┼─────────────┼─────────────┤
│   二分查找   │   分治      │    递归     │
├─────────────┼─────────────┼─────────────┤
│   回溯      │    贪心     │   动态规划   │
└─────────────┴─────────────┴─────────────┘
```

---

## 模式 1: 双指针

### 两种形态

```
相向双指针:  →  ←
同向双指针:  →  →  (快慢指针)
```

---

## 双指针应用

```javascript
// 两数之和 (有序数组)
function twoSum(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    sum < target ? left++ : right--;
  }
  return [-1, -1];
}
```

---

## 双指针题型

- 两数之和（有序）
- 三数之和
- 盛最多水的容器
- 移除元素
- 链表中点 / 环检测

---

## 模式 2: 滑动窗口

```
数组: [a, b, c, d, e, f, g]
           └─────┘
         滑动窗口
```

### 模板

```javascript
let left = 0;
for (let right = 0; right < n; right++) {
  // 扩大窗口
  window.add(arr[right]);
  
  while (需要收缩) {
    // 收缩窗口
    window.remove(arr[left]);
    left++;
  }
  
  // 更新结果
}
```

---

## 滑动窗口应用

```javascript
// 最长无重复子串
function lengthOfLongestSubstring(s) {
  const set = new Set();
  let left = 0, maxLen = 0;
  
  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left++]);
    }
    set.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
```

---

## 滑动窗口题型

- 最长无重复子串
- 最小覆盖子串
- 找所有字母异位词
- 长度最小的子数组

---

## 模式 3: 二分查找

### 三种边界

```javascript
// 标准二分
while (left <= right) { mid... }

// 左边界
while (left < right) { right = mid; }

// 右边界
while (left < right) { left = mid + 1; }
```

---

## 二分查找模板

```javascript
function binarySearch(nums, target) {
  let left = 0, right = nums.length - 1;
  
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}
```

---

## 二分查找题型

- 搜索旋转排序数组
- 寻找峰值
- 搜索二维矩阵
- 第 K 小的元素
- 最小化最大值 (二分答案)

---

## 模式 4: 回溯

### 框架

```javascript
function backtrack(路径, 选择列表) {
  if (满足结束条件) {
    result.push(路径);
    return;
  }
  
  for (选择 of 选择列表) {
    做选择;
    backtrack(路径, 选择列表);
    撤销选择;  // 回溯
  }
}
```

---

## 回溯应用

```javascript
// 全排列
function permute(nums) {
  const result = [];
  
  function backtrack(path, used) {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }
    
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      path.push(nums[i]);
      used[i] = true;
      backtrack(path, used);
      path.pop();      // 回溯
      used[i] = false; // 回溯
    }
  }
  
  backtrack([], []);
  return result;
}
```

---

## 回溯题型

- 全排列 / 组合
- 子集
- N 皇后
- 数独
- 单词搜索

---

## 模式 5: 动态规划

### 核心要素

1. **状态定义**: dp[i] 的含义
2. **状态转移**: dp[i] 如何从之前状态推导
3. **初始条件**: dp[0] 等边界值
4. **遍历顺序**: 确保依赖的状态已计算

---

## DP 模板

```javascript
// 1. 定义 dp 数组
const dp = new Array(n).fill(0);

// 2. 初始条件
dp[0] = ...;

// 3. 状态转移
for (let i = 1; i < n; i++) {
  dp[i] = f(dp[i-1], dp[i-2], ...);
}

// 4. 返回结果
return dp[n-1];
```

---

## DP 应用：爬楼梯

```javascript
// dp[i] = 到达第 i 阶的方法数
function climbStairs(n) {
  if (n <= 2) return n;
  
  let dp1 = 1, dp2 = 2;
  for (let i = 3; i <= n; i++) {
    const temp = dp1 + dp2;
    dp1 = dp2;
    dp2 = temp;
  }
  return dp2;
}
```

---

## DP 常见题型

| 类型 | 例题 |
|-----|------|
| 线性 DP | 最长递增子序列 |
| 背包 DP | 0-1 背包、完全背包 |
| 区间 DP | 最长回文子串 |
| 树形 DP | 打家劫舍 III |
| 状态压缩 | 旅行商问题 |

---

## 模式 6: 贪心

### 核心思想

每一步选择**当前最优**，期望达到**全局最优**

```
贪心成立条件：
1. 贪心选择性质
2. 最优子结构
```

---

## 贪心应用

```javascript
// 跳跃游戏
function canJump(nums) {
  let maxReach = 0;
  
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  
  return true;
}
```

---

## 算法选择指南

| 问题特征 | 推荐算法 |
|---------|---------|
| 有序数组查找 | 二分查找 |
| 求所有方案 | 回溯 |
| 求最优方案数量 | 动态规划 |
| 求最优方案本身 | 贪心 / DP |
| 连续子数组问题 | 滑动窗口 |

---

## 刷题建议

1. **按专题刷** - 每个模式刷 10-20 题
2. **先理解再写** - 想清楚思路再编码
3. **总结模板** - 提炼通用代码模板
4. **复习错题** - 定期回顾做错的题

---

## 总结

| 思想 | 核心 | 典型题 |
|-----|------|-------|
| 双指针 | 缩小搜索空间 | 两数之和 |
| 滑动窗口 | 维护窗口状态 | 最长无重复子串 |
| 二分 | 对数级查找 | 旋转数组搜索 |
| 回溯 | 穷举 + 剪枝 | 全排列 |
| DP | 子问题最优解 | 背包问题 |

---

## 参考资源

- [LeetCode 题目分类](https://leetcode.com/problemset/)
- [代码随想录](https://programmercarl.com/)
- [labuladong 的算法小抄](https://labuladong.github.io/algo/)

