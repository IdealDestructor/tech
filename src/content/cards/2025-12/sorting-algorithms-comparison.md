---
title: '常见排序算法复杂度对比'
pubDate: "2025-12-02T12:00:00.000Z"
tags: ["algorithm", "sorting", "interview"]
template: "vintage"
---

```json
{
  "title": "常见排序算法复杂度对比",
  "description": "面试必备的排序算法时间复杂度和空间复杂度对比表，包括各算法的稳定性分析，帮助快速选择合适的排序算法。",
  "keyPoints": [
    "冒泡排序: O(n²) 时间，O(1) 空间，稳定",
    "选择排序: O(n²) 时间，O(1) 空间，不稳定",
    "插入排序: O(n²) 时间，O(1) 空间，稳定，小数据高效",
    "归并排序: O(n log n) 时间，O(n) 空间，稳定",
    "快速排序: O(n log n) 平均，O(log n) 空间，不稳定",
    "堆排序: O(n log n) 时间，O(1) 空间，不稳定",
    "计数排序: O(n+k) 时间，O(k) 空间，稳定，整数限定"
  ],
  "references": [
    "https://visualgo.net/zh/sorting"
  ],
  "tools": [],
  "mermaidMarkdown": "mindmap\n  root((排序算法))\n    比较排序 O(n log n) 下界\n      交换类\n        冒泡排序\n        快速排序\n      选择类\n        选择排序\n        堆排序\n      插入类\n        插入排序\n        希尔排序\n      归并类\n        归并排序\n    非比较排序\n      计数排序\n      桶排序\n      基数排序",
  "url": ""
}
```

