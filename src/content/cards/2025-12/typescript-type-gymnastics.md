---
title: 'TypeScript 类型体操速查'
pubDate: "2025-12-20T09:00:00.000Z"
tags: ["typescript", "types", "frontend"]
template: "blackWhite"
---

```json
{
  "title": "TypeScript 类型体操速查",
  "description": "TypeScript 高级类型编程的核心概念速查表，涵盖泛型、条件类型、映射类型、模板字面量等关键知识点，助你掌握类型体操技巧。",
  "keyPoints": [
    "泛型约束: T extends SomeType 限制类型范围",
    "条件类型: T extends U ? X : Y 类型层面的三元表达式",
    "infer 关键字: 在条件类型中推断并提取类型",
    "映射类型: { [K in keyof T]: T[K] } 批量变换属性",
    "模板字面量: `${A}-${B}` 构造字符串字面量类型",
    "内置工具: Partial, Required, Pick, Omit, Record",
    "类型守卫: is 关键字实现运行时类型收窄"
  ],
  "references": [
    "https://www.typescriptlang.org/docs/handbook/2/types-from-types.html",
    "https://github.com/type-challenges/type-challenges"
  ],
  "tools": [],
  "mermaidMarkdown": "flowchart LR\n    A[TypeScript 类型系统] --> B[基础类型]\n    A --> C[高级类型]\n    B --> D[原始类型]\n    B --> E[对象类型]\n    C --> F[泛型 Generics]\n    C --> G[条件类型]\n    C --> H[映射类型]\n    C --> I[模板字面量]\n    F --> J[约束 extends]\n    G --> K[infer 推断]\n    H --> L[keyof + in]\n    I --> M[字符串操作]",
  "url": ""
}
```

