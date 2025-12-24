---
title: "React 状态管理方案对比"
author: "foxgem"
description: "全面对比 React 生态中的状态管理方案，从 useState 到 Redux、Zustand、Jotai，帮助你选择合适的方案。"
pubDate: 2025-12-20
tags: ["react", "state-management", "redux", "zustand"]
theme: "moon"
transition: "slide"
controls: true
progress: true
---

## React 状态管理方案对比

从本地状态到全局状态的最佳实践

---

## 为什么需要状态管理？

- 组件间共享状态 <!-- .element: class="fragment" -->
- 状态持久化和同步 <!-- .element: class="fragment" -->
- 复杂的状态逻辑 <!-- .element: class="fragment" -->
- 时间旅行调试 <!-- .element: class="fragment" -->

---

## 状态管理方案全景图

```
┌─────────────────────────────────────────┐
│           React 状态管理方案             │
├─────────────┬─────────────┬─────────────┤
│  本地状态    │  轻量级方案  │   重量级方案  │
├─────────────┼─────────────┼─────────────┤
│  useState   │  Zustand    │   Redux     │
│  useReducer │  Jotai      │   MobX      │
│  Context    │  Valtio     │   Recoil    │
└─────────────┴─────────────┴─────────────┘
```

---

## 方案 1: useState + Context

```jsx
// 最简单的全局状态方案
const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
```

**适用**: 简单的全局状态，如主题、用户信息

---

## Context 的问题

- 任何 value 变化都会导致所有消费者重渲染 <!-- .element: class="fragment" -->
- 没有内置的性能优化机制 <!-- .element: class="fragment" -->
- 嵌套多个 Provider 会形成"Provider 地狱" <!-- .element: class="fragment" -->

---

## 方案 2: Redux Toolkit

```javascript
// 现代 Redux 写法
import { createSlice, configureStore } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1 },
    decrement: (state) => { state.value -= 1 },
  },
});

const store = configureStore({
  reducer: { counter: counterSlice.reducer },
});
```

---

## Redux 特点

| 优点 | 缺点 |
|-----|------|
| 生态完善 | 学习曲线陡峭 |
| DevTools 强大 | 样板代码多 |
| 中间件系统 | 概念较多 |
| 可预测性强 | 小项目过重 |

---

## 方案 3: Zustand ⭐

```javascript
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

// 使用
function Counter() {
  const { count, increment } = useStore();
  return <button onClick={increment}>{count}</button>;
}
```

---

## Zustand 优势

- 极简 API，几乎零学习成本 <!-- .element: class="fragment" -->
- 不需要 Provider 包装 <!-- .element: class="fragment" -->
- 自动的渲染优化 <!-- .element: class="fragment" -->
- 支持中间件（persist、devtools） <!-- .element: class="fragment" -->
- TypeScript 友好 <!-- .element: class="fragment" -->

---

## 方案 4: Jotai

```javascript
import { atom, useAtom } from 'jotai';

// 原子状态
const countAtom = atom(0);
const doubleCountAtom = atom((get) => get(countAtom) * 2);

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

**特点**: 原子化状态，自动依赖追踪

---

## 如何选择？

```
项目规模小 + 状态简单 → useState + Context
中小型项目 + 需要全局状态 → Zustand ⭐
大型项目 + 复杂状态 → Redux Toolkit
原子化状态需求 → Jotai / Recoil
需要响应式 → MobX / Valtio
```

---

## 最佳实践

1. **能不用全局状态就不用** - 优先 props 和组合
2. **状态就近原则** - 状态放在使用它的最近祖先
3. **派生状态不要存** - 能计算出来的不要存储
4. **分离 UI 状态和服务器状态** - 用 TanStack Query 管理服务器状态

---

## 服务器状态管理

```javascript
import { useQuery } from '@tanstack/react-query';

function Users() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json()),
  });
  
  if (isLoading) return <Spinner />;
  return <UserList users={data} />;
}
```

**TanStack Query**: 缓存、同步、后台更新

---

## 总结

| 方案 | 复杂度 | 包大小 | 推荐场景 |
|-----|-------|-------|---------|
| Context | 低 | 0 | 简单全局状态 |
| Zustand | 低 | 1KB | 中小项目首选 |
| Redux | 高 | 10KB+ | 大型复杂项目 |
| Jotai | 中 | 3KB | 原子化状态 |

---

## 参考资源

- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Redux Toolkit 文档](https://redux-toolkit.js.org/)
- [Jotai 文档](https://jotai.org/)
- [TanStack Query](https://tanstack.com/query)

