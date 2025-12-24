---
title: '神经网络基础速查'
pubDate: "2025-12-25T09:00:00.000Z"
tags: ["ai", "neural-network", "deep-learning"]
template: "blackWhite"
---

```json
{
  "title": "神经网络基础速查",
  "description": "神经网络核心概念速查表，涵盖网络结构、激活函数、优化器、损失函数等关键知识点，帮助快速理解深度学习基础。",
  "keyPoints": [
    "前向传播: 输入 → 隐藏层 → 输出，逐层计算",
    "反向传播: 计算梯度，链式法则，更新权重",
    "激活函数: ReLU(最常用), Sigmoid, Tanh, GELU",
    "损失函数: MSE(回归), CrossEntropy(分类), BCE(二分类)",
    "优化器: SGD, Adam(最常用), AdamW, RMSprop",
    "正则化: Dropout, L2正则, BatchNorm, LayerNorm",
    "超参数: 学习率, batch_size, epochs, 网络深度/宽度"
  ],
  "references": [
    "https://www.deeplearningbook.org/",
    "https://pytorch.org/tutorials/"
  ],
  "tools": [],
  "mermaidMarkdown": "flowchart LR\n    A[输入层] --> B[隐藏层1]\n    B --> C[激活函数]\n    C --> D[隐藏层2]\n    D --> E[激活函数]\n    E --> F[输出层]\n    F --> G[损失函数]\n    G --> H[反向传播]\n    H --> I[优化器]\n    I --> J[更新权重]",
  "url": ""
}
```

