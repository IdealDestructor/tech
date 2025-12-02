---
title: 'Node.js 核心模块速查'
pubDate: "2025-12-02T13:00:00.000Z"
tags: ["nodejs", "backend", "javascript"]
template: "blackWhite"
---

```json
{
  "title": "Node.js 核心模块速查",
  "description": "Node.js 内置的核心模块速查表，涵盖文件系统、网络、进程、流等常用模块的主要 API，便于日常开发查阅。",
  "keyPoints": [
    "fs: 文件系统操作 (readFile, writeFile, mkdir)",
    "path: 路径处理 (join, resolve, dirname, basename)",
    "http/https: 创建 HTTP 服务器和客户端",
    "events: EventEmitter 事件驱动编程",
    "stream: 流式数据处理 (Readable, Writable, Transform)",
    "process: 进程信息和控制 (env, argv, exit)",
    "child_process: 创建子进程 (exec, spawn, fork)"
  ],
  "references": [
    "https://nodejs.org/docs/latest/api/"
  ],
  "tools": ["npm", "pnpm", "yarn"],
  "mermaidMarkdown": "mindmap\n  root((Node.js Core))\n    文件系统\n      fs\n      path\n      url\n    网络\n      http\n      https\n      net\n      dns\n    进程\n      process\n      child_process\n      cluster\n    数据流\n      stream\n      buffer\n    工具\n      util\n      events\n      crypto\n      os",
  "url": ""
}
```

