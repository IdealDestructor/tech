---
title: 'CSS Grid 与 Flexbox 对比'
pubDate: "2025-12-21T09:00:00.000Z"
tags: ["css", "layout", "frontend"]
template: "blackWhite"
---

```json
{
  "title": "CSS Grid 与 Flexbox 对比",
  "description": "CSS 现代布局两大核心技术的对比速查，帮助你快速选择合适的布局方案，掌握 Grid 和 Flexbox 的核心属性与使用场景。",
  "keyPoints": [
    "Flexbox: 一维布局(行或列)，适合组件内部排列",
    "Grid: 二维布局(行和列)，适合页面整体结构",
    "Flex 核心: flex-direction, justify-content, align-items",
    "Grid 核心: grid-template-columns/rows, gap, grid-area",
    "auto-fit/auto-fill + minmax() 实现自动响应式",
    "gap 属性: 统一的间距控制(Flex/Grid 都支持)",
    "place-items: center 是最简洁的居中方案"
  ],
  "references": [
    "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
    "https://css-tricks.com/snippets/css/complete-guide-grid/"
  ],
  "tools": [],
  "mermaidMarkdown": "flowchart TB\n    A[CSS 布局] --> B[Flexbox]\n    A --> C[Grid]\n    B --> D[一维布局]\n    B --> E[justify-content]\n    B --> F[align-items]\n    B --> G[flex-wrap]\n    C --> H[二维布局]\n    C --> I[grid-template]\n    C --> J[grid-area]\n    C --> K[auto-fit/fill]\n    D --> L[导航栏/工具栏]\n    H --> M[页面布局/仪表盘]",
  "url": ""
}
```

