---
title: "动态规划算法入门与经典题目"
pubDate: "2025-12-02T15:00:00.000Z"
author: foxgem
description: "系统学习动态规划的核心思想，掌握解题模板，攻克 LeetCode 高频 DP 问题。"
tags: [algorithm, dynamic-programming, leetcode, interview]
image: "/blog-covers/dynamic-programming.jpg"
---

动态规划（Dynamic Programming, DP）是算法面试中最重要的主题之一。本文将帮助你建立系统的 DP 思维。

## 什么是动态规划？

动态规划是一种通过把原问题分解为相对简单的子问题来求解复杂问题的方法。

### 核心要素

1. **最优子结构** - 问题的最优解包含子问题的最优解
2. **重叠子问题** - 子问题会被重复计算
3. **状态转移方程** - 定义状态之间的关系

## DP 解题框架

```python
def dp_template(problem):
    # 1. 定义状态
    # dp[i] 表示什么含义？
    
    # 2. 初始化
    dp = [initial_value] * n
    
    # 3. 状态转移
    for i in range(1, n):
        dp[i] = f(dp[i-1], dp[i-2], ...)
    
    # 4. 返回结果
    return dp[n-1]
```

## 经典 DP 问题

### 1. 斐波那契数列

最基础的 DP 问题，用来理解递归到 DP 的转换。

```python
# 递归（有大量重复计算）
def fib_recursive(n):
    if n <= 1:
        return n
    return fib_recursive(n-1) + fib_recursive(n-2)

# 记忆化搜索
def fib_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib_memo(n-1, memo) + fib_memo(n-2, memo)
    return memo[n]

# 动态规划
def fib_dp(n):
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]

# 空间优化
def fib_optimized(n):
    if n <= 1:
        return n
    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    return curr
```

### 2. 爬楼梯 (LeetCode 70)

```python
def climbStairs(n: int) -> int:
    """
    状态定义: dp[i] = 到达第 i 阶的方法数
    状态转移: dp[i] = dp[i-1] + dp[i-2]
    """
    if n <= 2:
        return n
    prev, curr = 1, 2
    for _ in range(3, n + 1):
        prev, curr = curr, prev + curr
    return curr
```

### 3. 打家劫舍 (LeetCode 198)

```python
def rob(nums: list) -> int:
    """
    状态定义: dp[i] = 抢到第 i 家能获得的最大金额
    状态转移: dp[i] = max(dp[i-1], dp[i-2] + nums[i])
    """
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    prev2, prev1 = 0, 0
    for num in nums:
        curr = max(prev1, prev2 + num)
        prev2, prev1 = prev1, curr
    return prev1
```

### 4. 最长递增子序列 (LeetCode 300)

```python
def lengthOfLIS(nums: list) -> int:
    """
    状态定义: dp[i] = 以 nums[i] 结尾的最长递增子序列长度
    状态转移: dp[i] = max(dp[j] + 1) for j < i and nums[j] < nums[i]
    时间复杂度: O(n²)
    """
    n = len(nums)
    dp = [1] * n
    
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    
    return max(dp)

# 二分查找优化 O(n log n)
def lengthOfLIS_binary(nums: list) -> int:
    tails = []
    for num in nums:
        left, right = 0, len(tails)
        while left < right:
            mid = (left + right) // 2
            if tails[mid] < num:
                left = mid + 1
            else:
                right = mid
        if left == len(tails):
            tails.append(num)
        else:
            tails[left] = num
    return len(tails)
```

### 5. 最长公共子序列 (LeetCode 1143)

```python
def longestCommonSubsequence(text1: str, text2: str) -> int:
    """
    状态定义: dp[i][j] = text1[:i] 和 text2[:j] 的 LCS 长度
    状态转移: 
      if text1[i-1] == text2[j-1]: dp[i][j] = dp[i-1][j-1] + 1
      else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    """
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return dp[m][n]
```

### 6. 0-1 背包问题

```python
def knapsack_01(weights: list, values: list, capacity: int) -> int:
    """
    状态定义: dp[i][w] = 前 i 个物品，容量为 w 时的最大价值
    状态转移:
      不选第 i 个: dp[i][w] = dp[i-1][w]
      选第 i 个:   dp[i][w] = dp[i-1][w-weights[i]] + values[i]
    """
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            dp[i][w] = dp[i-1][w]  # 不选
            if w >= weights[i-1]:
                dp[i][w] = max(dp[i][w], 
                              dp[i-1][w-weights[i-1]] + values[i-1])
    
    return dp[n][capacity]

# 空间优化（一维数组）
def knapsack_01_optimized(weights: list, values: list, capacity: int) -> int:
    dp = [0] * (capacity + 1)
    
    for i in range(len(weights)):
        # 注意：必须倒序遍历，保证每个物品只选一次
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    
    return dp[capacity]
```

### 7. 零钱兑换 (LeetCode 322)

```python
def coinChange(coins: list, amount: int) -> int:
    """
    完全背包变形
    状态定义: dp[i] = 凑成金额 i 需要的最少硬币数
    状态转移: dp[i] = min(dp[i - coin] + 1) for coin in coins
    """
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i and dp[i - coin] != float('inf'):
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1
```

### 8. 编辑距离 (LeetCode 72)

```python
def minDistance(word1: str, word2: str) -> int:
    """
    状态定义: dp[i][j] = word1[:i] 转换到 word2[:j] 的最少操作数
    状态转移:
      相等: dp[i][j] = dp[i-1][j-1]
      不等: dp[i][j] = 1 + min(dp[i-1][j],    # 删除
                               dp[i][j-1],    # 插入
                               dp[i-1][j-1])  # 替换
    """
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # 初始化
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    
    return dp[m][n]
```

## DP 问题分类

| 类型 | 典型问题 |
|-----|---------|
| 线性 DP | 爬楼梯、打家劫舍、最长递增子序列 |
| 区间 DP | 最长回文子串、戳气球 |
| 背包 DP | 0-1背包、完全背包、零钱兑换 |
| 树形 DP | 打家劫舍 III、二叉树直径 |
| 状态压缩 DP | 最短 Hamilton 路径 |
| 数位 DP | 数字 1 的个数 |

## 解题技巧

### 1. 确定状态

问自己：需要哪些变量来描述问题的当前状态？

### 2. 找到转移方程

问自己：当前状态如何从之前的状态转移而来？

### 3. 确定边界条件

问自己：最小的子问题是什么？答案是多少？

### 4. 确定计算顺序

问自己：应该从哪里开始计算？

## 总结

掌握动态规划的关键：

1. **多练习** - 从简单到困难，建立题感
2. **分类总结** - 按问题类型归纳模板
3. **画图理解** - 用表格或树形图辅助思考
4. **空间优化** - 学会降维技巧

DP 不是靠背公式，而是理解状态和转移的本质。

