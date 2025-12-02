---
title: "现代前端工程化实践"
author: "foxgem"
description: "探索现代前端工程化的核心概念与最佳实践，从模块化到构建工具再到部署流程。"
pubDate: 2025-12-02
tags: ["frontend", "engineering", "vite", "webpack"]
theme: "night"
transition: "slide"
controls: true
progress: true
---

## 现代前端工程化实践

从刀耕火种到自动化构建

---

## 前端工程化的演进

- 石器时代：手写 HTML + CSS + JS <!-- .element: class="fragment" -->
- 青铜时代：jQuery + 手动压缩 <!-- .element: class="fragment" -->
- 铁器时代：Grunt/Gulp 任务流 <!-- .element: class="fragment" -->
- 工业时代：Webpack 模块打包 <!-- .element: class="fragment" -->
- 现代：Vite + ESM 原生模块 <!-- .element: class="fragment" -->

---

## 模块化规范

| 规范 | 特点 | 环境 |
|-----|------|-----|
| CommonJS | 同步加载 | Node.js |
| AMD | 异步加载 | 浏览器 |
| UMD | 通用模块 | 两者兼容 |
| ESM | 原生模块 | 现代标准 |

---

## ESM 是未来

```javascript
// 导出
export const name = 'module';
export default function() {}

// 导入
import { name } from './module.js';
import fn from './module.js';

// 动态导入
const module = await import('./module.js');
```

---

## 构建工具对比

```
Webpack: 功能全面，配置复杂
  适合大型复杂项目

Vite: 开发极速，配置简单
  适合现代项目新建

Rollup: 打包精简，Tree-shaking 优秀
  适合库的打包

esbuild: 构建极快，Go 语言编写
  适合作为其他工具的底层
```

---

## TypeScript 已成标配

- 类型安全，减少运行时错误 <!-- .element: class="fragment" -->
- IDE 智能提示，提升开发效率 <!-- .element: class="fragment" -->
- 重构更安全，维护更容易 <!-- .element: class="fragment" -->
- 团队协作的文档即代码 <!-- .element: class="fragment" -->

---

## 代码质量保障

```bash
# ESLint - 代码规范检查
npx eslint src/

# Prettier - 代码格式化
npx prettier --write .

# Husky - Git Hooks
npx husky add .husky/pre-commit "npm run lint"

# lint-staged - 只检查暂存文件
npx lint-staged
```

---

## CI/CD 流水线

```yaml
# GitHub Actions 示例
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

---

## 部署策略

- **静态托管**: Vercel, Netlify, GitHub Pages
- **容器化**: Docker + K8s
- **边缘部署**: Cloudflare Workers, Deno Deploy
- **Serverless**: AWS Lambda, 阿里云函数计算

---

## 总结

1. 拥抱 ESM 和 TypeScript
2. 选择合适的构建工具
3. 建立代码质量规范
4. 自动化一切可自动化的

---

## 参考资源

- [Vite 官方文档](https://vitejs.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [前端工程化体系设计](https://github.com/nicehorse06/frontend-engineering)

