---
title: "LeetCode 刷题方法论"
author: "foxgem"
description: "分享高效的 LeetCode 刷题策略与技巧，帮助你系统性地准备技术面试。"
pubDate: 2025-12-02
tags: ["leetcode", "algorithm", "interview", "data-structure"]
theme: "solarized"
transition: "slide"
controls: true
progress: true
---

## LeetCode 刷题方法论

系统性准备技术面试

---

## 为什么要刷 LeetCode？

- 🎯 大厂面试必考
- 🧠 锻炼编程思维
- 📈 提升代码能力
- 💪 建立解题信心

---

## 刷题常见误区

❌ 追求数量，忽视质量 <!-- .element: class="fragment" -->

❌ 看一眼就看答案 <!-- .element: class="fragment" -->

❌ 只刷一遍不复习 <!-- .element: class="fragment" -->

❌ 不总结题型规律 <!-- .element: class="fragment" -->

---

## 正确的刷题姿势

```
1. 分类刷题，掌握套路
2. 先思考，再看解析
3. 手写代码，不复制
4. 总结模板，举一反三
5. 定期复习，间隔重复
```

---

## 核心数据结构

| 结构 | 常见操作 | 典型题目 |
|-----|---------|---------|
| 数组 | 双指针、滑动窗口 | 两数之和 |
| 链表 | 快慢指针、反转 | 反转链表 |
| 栈 | 单调栈、括号匹配 | 有效括号 |
| 队列 | BFS、单调队列 | 二叉树层序 |
| 哈希表 | 去重、计数 | 两数之和 |
| 树 | DFS、BFS、递归 | 二叉树遍历 |

---

## 核心算法思想

```
├── 双指针
│   ├── 对撞指针
│   └── 快慢指针
├── 二分查找
├── 滑动窗口
├── 回溯法
├── 动态规划
├── 贪心算法
├── 图算法
│   ├── DFS/BFS
│   └── 最短路径
└── 排序相关
```

---

## 双指针模板

```python
# 对撞指针
def two_pointers(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        if condition:
            left += 1
        else:
            right -= 1

# 快慢指针（链表环检测）
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False
```

---

## 二分查找模板

```python
def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1  # 未找到
```

---

## 滑动窗口模板

```python
def sliding_window(s):
    left = 0
    window = {}  # 窗口内容
    result = 0
    
    for right in range(len(s)):
        # 扩大窗口
        char = s[right]
        window[char] = window.get(char, 0) + 1
        
        # 收缩窗口
        while need_shrink(window):
            window[s[left]] -= 1
            left += 1
        
        # 更新结果
        result = max(result, right - left + 1)
    
    return result
```

---

## 回溯法模板

```python
def backtrack(path, choices):
    if is_solution(path):
        result.append(path[:])
        return
    
    for choice in choices:
        if is_valid(choice):
            # 做选择
            path.append(choice)
            # 递归
            backtrack(path, new_choices)
            # 撤销选择
            path.pop()
```

---

## BFS 模板

```python
from collections import deque

def bfs(start):
    queue = deque([start])
    visited = {start}
    
    while queue:
        node = queue.popleft()
        
        for neighbor in get_neighbors(node):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
```

---

## 刷题计划建议

```
第一阶段 (1-2周): 基础数据结构
  - 数组、链表、栈、队列
  
第二阶段 (2-3周): 树和图
  - 二叉树、BST、图遍历
  
第三阶段 (2-3周): 算法思想
  - 双指针、二分、滑动窗口
  
第四阶段 (3-4周): 进阶
  - 动态规划、回溯、贪心
```

---

## 面试高频题目 (必刷)

- 两数之和 (哈希表)
- 反转链表 (链表)
- 有效括号 (栈)
- 二叉树遍历 (递归/迭代)
- 最长子串 (滑动窗口)
- 爬楼梯 (动态规划)
- 合并区间 (排序)
- 二分查找 (二分)

---

## 中国互联网常考

- 字节跳动: 动态规划、字符串
- 阿里巴巴: 系统设计、多线程
- 腾讯: 图算法、游戏相关
- 美团: 贪心、模拟
- 百度: 搜索相关、字符串

---

## 总结

1. 分类刷题，掌握模板
2. 质量优先，反复练习
3. 手写代码，理解过程
4. 总结规律，举一反三
5. 模拟面试，克服紧张

---

## 资源推荐

- [LeetCode 官网](https://leetcode.cn/)
- [代码随想录](https://programmercarl.com/)
- [labuladong 算法笔记](https://labuladong.github.io/algo/)

