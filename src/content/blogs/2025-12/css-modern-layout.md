---
title: "CSS 现代布局技术：Grid 与 Flexbox 实战"
pubDate: "2025-12-21T08:00:00.000Z"
author: foxgem
description: "全面掌握 CSS Grid 和 Flexbox 两大现代布局系统，从基础概念到复杂布局实战，告别浮动布局时代。"
tags: [css, frontend, layout, grid, flexbox]
image: "https://picsum.photos/seed/css-layout/1600/900"
---

CSS 布局技术经历了从 Table 布局、Float 布局到现代 Flexbox 和 Grid 的演进。本文将深入介绍这两大现代布局系统的核心概念与实战技巧。

## 布局技术演进

```
Table 布局 (1990s) → Float 布局 (2000s) → Flexbox (2012) → Grid (2017)
```

现代布局的核心优势：
- **声明式** - 描述想要的结果，而非实现过程
- **响应式友好** - 内建对不同屏幕尺寸的适应能力
- **代码简洁** - 几行 CSS 就能实现复杂布局

## Flexbox：一维布局王者

Flexbox 是一维布局的最佳选择，适合处理行或列的元素排列。

### 核心概念

```css
.container {
  display: flex;
  
  /* 主轴方向 */
  flex-direction: row | row-reverse | column | column-reverse;
  
  /* 主轴对齐 */
  justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
  
  /* 交叉轴对齐 */
  align-items: stretch | flex-start | flex-end | center | baseline;
  
  /* 换行 */
  flex-wrap: nowrap | wrap | wrap-reverse;
  
  /* 间距 (现代浏览器) */
  gap: 1rem;
}
```

### Flex 子项属性

```css
.item {
  /* 放大比例，默认 0 不放大 */
  flex-grow: 1;
  
  /* 缩小比例，默认 1 可缩小 */
  flex-shrink: 0;
  
  /* 基础尺寸 */
  flex-basis: 200px;
  
  /* 简写：flex-grow flex-shrink flex-basis */
  flex: 1 0 200px;
  
  /* 单独对齐 */
  align-self: center;
  
  /* 排序 */
  order: -1;
}
```

### 常用 Flex 简写值

| 值 | 等价于 | 用途 |
|---|--------|-----|
| `flex: 1` | `1 1 0%` | 等分剩余空间 |
| `flex: auto` | `1 1 auto` | 基于内容自动调整 |
| `flex: none` | `0 0 auto` | 固定尺寸不伸缩 |
| `flex: 0` | `0 1 0%` | 最小尺寸 |

### 实战：导航栏

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.nav-logo {
  flex: none; /* 固定大小 */
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-actions {
  display: flex;
  gap: 1rem;
}
```

### 实战：卡片等高布局

```css
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.card {
  flex: 1 1 300px; /* 最小 300px，可伸缩 */
  display: flex;
  flex-direction: column;
}

.card-content {
  flex: 1; /* 填充剩余空间，确保按钮始终在底部 */
}

.card-actions {
  margin-top: auto; /* 推到底部 */
}
```

## CSS Grid：二维布局利器

Grid 是二维布局系统，可以同时控制行和列。

### 核心概念

```css
.container {
  display: grid;
  
  /* 定义列 */
  grid-template-columns: 200px 1fr 1fr;
  
  /* 定义行 */
  grid-template-rows: auto 1fr auto;
  
  /* 间距 */
  gap: 1rem;
  row-gap: 1rem;
  column-gap: 2rem;
}
```

### fr 单位与 repeat()

```css
.grid {
  /* fr: 剩余空间的份数 */
  grid-template-columns: 1fr 2fr 1fr; /* 1:2:1 比例 */
  
  /* repeat(): 重复模式 */
  grid-template-columns: repeat(3, 1fr); /* 3 列等宽 */
  
  /* auto-fill: 自动填充 */
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  
  /* auto-fit: 自动适应（会拉伸填满） */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
```

### 网格区域命名

```css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
```

### 网格线定位

```css
.item {
  /* 行开始 / 列开始 / 行结束 / 列结束 */
  grid-area: 1 / 1 / 3 / 4;
  
  /* 或分开写 */
  grid-row: 1 / 3;      /* 第1行到第3行线 */
  grid-column: 1 / -1;  /* 第1列到最后 */
  
  /* span 关键字 */
  grid-column: span 2;  /* 跨2列 */
}
```

### 对齐控制

```css
.container {
  /* 整体内容对齐 */
  justify-content: center;  /* 水平 */
  align-content: center;    /* 垂直 */
  
  /* 单元格内对齐 */
  justify-items: center;    /* 水平 */
  align-items: center;      /* 垂直 */
  
  /* 简写 */
  place-content: center;
  place-items: center;
}

.item {
  /* 单个项目对齐 */
  justify-self: start;
  align-self: end;
  place-self: center;
}
```

### 实战：响应式图片画廊

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

/* 特色图片占更大区域 */
.gallery-item.featured {
  grid-column: span 2;
  grid-row: span 2;
}

/* 响应式调整 */
@media (max-width: 600px) {
  .gallery-item.featured {
    grid-column: span 1;
    grid-row: span 1;
  }
}
```

### 实战：仪表盘布局

```css
.dashboard {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  min-height: 100vh;
}

.dashboard-header {
  grid-area: header;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  border-bottom: 1px solid #e5e5e5;
}

.dashboard-sidebar {
  grid-area: sidebar;
  background: #1a1a2e;
  color: white;
  padding: 1rem;
}

.dashboard-main {
  grid-area: main;
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  align-content: start;
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .dashboard {
    grid-template-columns: 1fr;
    grid-template-rows: 60px auto 1fr;
    grid-template-areas:
      "header"
      "sidebar"
      "main";
  }
  
  .dashboard-sidebar {
    flex-direction: row;
    overflow-x: auto;
  }
}
```

## Flexbox vs Grid：如何选择？

| 场景 | 推荐方案 |
|-----|---------|
| 一行/一列元素 | Flexbox |
| 导航栏、工具栏 | Flexbox |
| 卡片列表 | Grid (auto-fit) |
| 页面整体布局 | Grid |
| 复杂二维布局 | Grid |
| 元素居中 | 两者都可 |
| 动态内容 | Flexbox |

**黄金法则**：
- **一维布局用 Flexbox**：元素沿着一个方向排列
- **二维布局用 Grid**：同时控制行和列
- **两者可以组合使用**：Grid 做大布局，Flexbox 做组件内部

## 现代布局技巧

### 1. 完美居中

```css
/* Flexbox 居中 */
.center-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Grid 居中 (最简洁) */
.center-grid {
  display: grid;
  place-items: center;
}
```

### 2. Sticky Footer

```css
body {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

header { /* 自动高度 */ }
main { /* 填充剩余空间 */ }
footer { /* 自动高度，始终在底部 */ }
```

### 3. 响应式边栏

```css
.layout {
  display: grid;
  grid-template-columns: fit-content(250px) 1fr;
}

/* 或使用 clamp */
.sidebar {
  width: clamp(200px, 25vw, 300px);
}
```

### 4. 瀑布流布局

```css
.masonry {
  columns: 3;
  column-gap: 1rem;
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 1rem;
}

/* 或使用 Grid (实验性) */
.masonry-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: masonry;
}
```

## 总结

1. **Flexbox** - 一维布局首选，适合组件内部布局
2. **Grid** - 二维布局利器，适合页面整体结构
3. **gap 属性** - 统一的间距控制，告别 margin hack
4. **auto-fit/auto-fill** - 自动响应式布局的核心
5. **grid-template-areas** - 可视化的布局定义方式

现代 CSS 布局让我们告别了 float 和 clearfix 的时代，用更少的代码实现更复杂的布局。掌握 Flexbox 和 Grid，你就掌握了现代前端布局的核心技能。

