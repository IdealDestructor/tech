---
title: '时间复杂度速查表'
pubDate: "2025-12-24T10:00:00.000Z"
tags: ["algorithm", "complexity", "big-o"]
template: "blackWhite"
---

```json
{
  "title": "时间复杂度速查表",
  "description": "算法时间复杂度（Big O）速查表，涵盖常见操作的复杂度对比、数据规模估算指南，帮助你评估算法效率。",
  "keyPoints": [
    "O(1): 哈希查找、数组索引访问、栈/队列操作",
    "O(log n): 二分查找、平衡树操作、堆操作",
    "O(n): 线性遍历、单层循环、链表操作",
    "O(n log n): 快排/归并排序、堆排序",
    "O(n²): 双层循环、冒泡排序、简单DP",
    "O(2ⁿ): 子集问题、递归斐波那契(无记忆化)",
    "数据规模: n≤20用O(2ⁿ), n≤10⁶用O(n), n≤10⁸用O(log n)"
  ],
  "references": [
    "https://www.bigocheatsheet.com/",
    "https://en.wikipedia.org/wiki/Big_O_notation"
  ],
  "tools": [],
  "mermaidMarkdown": "graph LR\n    A[O(1)] --> B[O(log n)]\n    B --> C[O(n)]\n    C --> D[O(n log n)]\n    D --> E[O(n²)]\n    E --> F[O(2ⁿ)]\n    F --> G[O(n!)]\n    style A fill:#4ade80\n    style B fill:#a3e635\n    style C fill:#facc15\n    style D fill:#fb923c\n    style E fill:#f87171\n    style F fill:#dc2626\n    style G fill:#7f1d1d",
  "url": ""
}
```

