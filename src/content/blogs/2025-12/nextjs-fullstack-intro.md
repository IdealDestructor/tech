---
title: "Next.js 14 全栈开发入门"
pubDate: "2025-12-02T10:00:00.000Z"
author: foxgem
description: "探索 Next.js 14 的新特性，包括 App Router、Server Components 和 Server Actions，开启全栈开发新篇章。"
tags: [nextjs, react, fullstack, frontend]
image: "https://picsum.photos/seed/nextjs/1600/900"
---

Next.js 是 React 生态中最受欢迎的全栈框架，Next.js 14 带来了许多革命性的特性。本文将带你全面了解这些新特性。

## App Router：全新的路由系统

### 文件系统路由

```
app/
├── layout.tsx          # 根布局
├── page.tsx            # 首页 (/)
├── about/
│   └── page.tsx        # 关于页 (/about)
├── blog/
│   ├── page.tsx        # 博客列表 (/blog)
│   └── [slug]/
│       └── page.tsx    # 博客详情 (/blog/xxx)
└── api/
    └── users/
        └── route.ts    # API 路由 (/api/users)
```

### 布局嵌套

```tsx
// app/layout.tsx - 根布局
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <header>导航栏</header>
        <main>{children}</main>
        <footer>页脚</footer>
      </body>
    </html>
  );
}

// app/dashboard/layout.tsx - 嵌套布局
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <aside>侧边栏</aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
```

## Server Components：性能革命

### 默认服务端渲染

```tsx
// app/posts/page.tsx
// 这是一个 Server Component（默认）
async function PostsPage() {
  // 直接在组件中获取数据
  const posts = await fetch('https://api.example.com/posts', {
    cache: 'force-cache', // 默认缓存
  }).then(res => res.json());

  return (
    <div>
      <h1>博客文章</h1>
      <ul>
        {posts.map((post: any) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default PostsPage;
```

### 客户端组件

```tsx
'use client'; // 声明为客户端组件

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      点击次数: {count}
    </button>
  );
}
```

### Server/Client 组件边界

```tsx
// app/page.tsx (Server Component)
import Counter from './Counter'; // Client Component

export default async function Page() {
  const data = await fetchData(); // 服务端获取数据

  return (
    <div>
      <h1>{data.title}</h1>
      <Counter /> {/* 客户端交互组件 */}
    </div>
  );
}
```

## Server Actions：告别 API 路由

### 表单处理

```tsx
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  // 直接操作数据库
  await db.post.create({
    data: { title, content },
  });

  // 重新验证页面缓存
  revalidatePath('/posts');
}
```

```tsx
// app/posts/new/page.tsx
import { createPost } from '../actions';

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="标题" required />
      <textarea name="content" placeholder="内容" required />
      <button type="submit">发布</button>
    </form>
  );
}
```

### 带状态反馈的表单

```tsx
'use client';

import { useFormStatus, useFormState } from 'react-dom';
import { createPost } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? '提交中...' : '提交'}
    </button>
  );
}

export default function PostForm() {
  const [state, formAction] = useFormState(createPost, { error: null });

  return (
    <form action={formAction}>
      <input name="title" required />
      <textarea name="content" required />
      {state.error && <p className="text-red-500">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}
```

## 数据获取策略

### 静态数据获取

```tsx
// 构建时获取，可被 CDN 缓存
async function StaticPage() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'force-cache',
  });
  // ...
}
```

### 动态数据获取

```tsx
// 每次请求时获取
async function DynamicPage() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'no-store',
  });
  // ...
}
```

### 增量静态再生成 (ISR)

```tsx
// 每 60 秒重新验证
async function ISRPage() {
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 60 },
  });
  // ...
}
```

## 中间件与路由保护

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  // 保护 /dashboard 路由
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

## 并行路由与插槽

```
app/
├── layout.tsx
├── page.tsx
├── @modal/
│   └── login/
│       └── page.tsx
└── @sidebar/
    └── default.tsx
```

```tsx
// app/layout.tsx
export default function Layout({
  children,
  modal,
  sidebar,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div className="flex">
      {sidebar}
      <main className="flex-1">
        {children}
        {modal}
      </main>
    </div>
  );
}
```

## 最佳实践

### 1. 组件服务端化

优先使用 Server Components，只在需要交互时使用 Client Components：

```tsx
// ✅ 好的做法
// page.tsx (Server Component)
import InteractiveButton from './InteractiveButton';

export default async function Page() {
  const data = await getData();
  return (
    <div>
      <StaticContent data={data} />
      <InteractiveButton /> {/* 只有这个需要客户端 */}
    </div>
  );
}
```

### 2. 数据获取靠近使用处

```tsx
// ✅ 在需要数据的组件中获取
async function UserProfile({ userId }: { userId: string }) {
  const user = await getUser(userId);
  return <div>{user.name}</div>;
}

async function UserPosts({ userId }: { userId: string }) {
  const posts = await getPosts(userId);
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}

// 并行获取数据
export default function UserPage({ params }: { params: { id: string } }) {
  return (
    <>
      <UserProfile userId={params.id} />
      <UserPosts userId={params.id} />
    </>
  );
}
```

### 3. 错误处理

```tsx
// app/dashboard/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>出错了！</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>重试</button>
    </div>
  );
}
```

## 总结

Next.js 14 带来的新特性让全栈开发变得更加简单：

1. **App Router** - 更直观的文件系统路由
2. **Server Components** - 默认服务端渲染，性能更优
3. **Server Actions** - 简化的后端交互
4. **流式渲染** - 更好的用户体验
5. **并行路由** - 复杂布局的优雅解决方案

拥抱这些新特性，开启现代全栈开发之旅！

