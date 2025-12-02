---
title: 'React 核心概念总结'
pubDate: "2025-12-02T09:00:00.000Z"
tags: ["react", "frontend", "hooks"]
template: "blackWhite"
---

```json
{
  "title": "React 核心概念总结",
  "description": "React 是用于构建用户界面的 JavaScript 库，本卡片总结了 React 18 的核心概念，包括组件、Hooks、状态管理等关键知识点。",
  "keyPoints": [
    "组件化: 函数组件是现代 React 的推荐写法",
    "JSX: JavaScript 的语法扩展，让 UI 描述更直观",
    "Props: 父传子的数据流，单向数据绑定",
    "State: 组件内部的响应式数据 (useState)",
    "副作用: useEffect 处理数据获取、订阅等",
    "Hooks: useState, useEffect, useMemo, useCallback, useRef",
    "Context: 跨组件层级传递数据，避免 prop drilling"
  ],
  "references": [
    "https://react.dev/"
  ],
  "tools": [],
  "mermaidMarkdown": "flowchart TD\n    A[React App] --> B[Components]\n    B --> C[Props]\n    B --> D[State]\n    D --> E[useState]\n    D --> F[useReducer]\n    B --> G[Side Effects]\n    G --> H[useEffect]\n    B --> I[Context]\n    I --> J[useContext]\n    B --> K[Performance]\n    K --> L[useMemo]\n    K --> M[useCallback]\n    K --> N[React.memo]",
  "url": ""
}
```

