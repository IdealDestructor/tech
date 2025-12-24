---
title: '常见数据结构对比'
pubDate: "2025-12-24T09:00:00.000Z"
tags: ["algorithm", "data-structure", "programming"]
template: "blackWhite"
---

```json
{
  "title": "常见数据结构对比",
  "description": "常用数据结构的特性、时间复杂度和适用场景速查表，帮助你在编程和面试中快速选择合适的数据结构。",
  "keyPoints": [
    "数组 Array: 随机访问 O(1), 插入删除 O(n), 连续内存",
    "链表 LinkedList: 插入删除 O(1), 查找 O(n), 无需连续内存",
    "栈 Stack: LIFO, 括号匹配/函数调用栈/DFS",
    "队列 Queue: FIFO, BFS/任务调度/消息队列",
    "哈希表 HashMap: 增删查平均 O(1), 处理哈希冲突",
    "堆 Heap: 获取极值 O(1), 插入删除 O(logn), Top-K问题",
    "树 Tree: 二叉搜索树/红黑树/B+树, 有序存储查找"
  ],
  "references": [
    "https://visualgo.net/",
    "https://www.bigocheatsheet.com/"
  ],
  "tools": [],
  "mermaidMarkdown": "flowchart LR\n    A[数据结构] --> B[线性]\n    A --> C[非线性]\n    B --> D[数组]\n    B --> E[链表]\n    B --> F[栈/队列]\n    C --> G[树]\n    C --> H[图]\n    C --> I[哈希表]\n    G --> J[二叉树]\n    G --> K[堆]\n    G --> L[Trie]",
  "url": ""
}
```

