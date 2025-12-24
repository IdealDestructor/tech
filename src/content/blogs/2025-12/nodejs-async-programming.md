---
title: "Node.js 异步编程深入理解"
pubDate: "2025-12-22T08:00:00.000Z"
author: foxgem
description: "深入理解 Node.js 事件循环、异步模型和并发控制，掌握 Promise、async/await 的最佳实践，写出高性能的 Node.js 代码。"
tags: [nodejs, javascript, async, backend]
image: "/blog-covers/nodejs-async.jpg"
---

Node.js 的异步非阻塞 I/O 模型是其高性能的核心。本文将深入探讨 Node.js 的异步机制，帮助你写出高效、可维护的异步代码。

## 事件循环：Node.js 的心脏

Node.js 基于 libuv 实现事件循环，理解它是掌握异步编程的关键。

### 事件循环的六个阶段

```
   ┌───────────────────────────┐
┌─>│           timers          │ ← setTimeout, setInterval
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │ ← 系统操作回调
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │ ← 内部使用
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │ ← I/O 回调（文件、网络）
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │ ← setImmediate
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │ ← socket.on('close')
   └───────────────────────────┘
```

### 微任务与宏任务

```javascript
console.log('1: 同步代码');

setTimeout(() => console.log('2: setTimeout'), 0);
setImmediate(() => console.log('3: setImmediate'));

Promise.resolve().then(() => console.log('4: Promise.then'));

process.nextTick(() => console.log('5: nextTick'));

console.log('6: 同步代码结束');

// 输出顺序：1 → 6 → 5 → 4 → 2 → 3
// (setTimeout 和 setImmediate 的顺序在主模块中不确定)
```

**执行优先级**：
1. 同步代码
2. `process.nextTick` (微任务)
3. `Promise.then` (微任务)
4. 宏任务 (按事件循环阶段)

### nextTick vs setImmediate

```javascript
// process.nextTick: 在当前阶段结束后立即执行
process.nextTick(() => {
  console.log('nextTick'); // 优先级最高的异步
});

// setImmediate: 在 check 阶段执行
setImmediate(() => {
  console.log('setImmediate');
});

// 建议：优先使用 setImmediate，避免 nextTick 阻塞事件循环
```

## Promise 最佳实践

### 链式调用 vs async/await

```javascript
// Promise 链式调用
function fetchUserData(userId) {
  return fetch(`/api/users/${userId}`)
    .then(res => res.json())
    .then(user => fetch(`/api/posts?userId=${user.id}`))
    .then(res => res.json())
    .catch(err => {
      console.error('Error:', err);
      throw err;
    });
}

// async/await 更清晰
async function fetchUserData(userId) {
  try {
    const userRes = await fetch(`/api/users/${userId}`);
    const user = await userRes.json();
    
    const postsRes = await fetch(`/api/posts?userId=${user.id}`);
    return await postsRes.json();
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
}
```

### 并发控制

```javascript
// ❌ 串行执行，效率低
async function fetchAll(ids) {
  const results = [];
  for (const id of ids) {
    const data = await fetchData(id); // 一个接一个
    results.push(data);
  }
  return results;
}

// ✅ 并发执行
async function fetchAll(ids) {
  return Promise.all(ids.map(id => fetchData(id)));
}

// ✅ 带错误处理的并发
async function fetchAllSettled(ids) {
  const results = await Promise.allSettled(
    ids.map(id => fetchData(id))
  );
  
  return results.map(result => 
    result.status === 'fulfilled' ? result.value : null
  );
}
```

### 并发限制

```javascript
// 限制并发数量，避免资源耗尽
async function asyncPool(concurrency, items, fn) {
  const results = [];
  const executing = new Set();
  
  for (const item of items) {
    const promise = fn(item).then(result => {
      executing.delete(promise);
      return result;
    });
    
    results.push(promise);
    executing.add(promise);
    
    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }
  
  return Promise.all(results);
}

// 使用：最多同时执行 5 个请求
const results = await asyncPool(5, urls, fetchData);
```

## 错误处理策略

### 未捕获的 Promise 错误

```javascript
// 全局监听未捕获的 Promise 错误
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // 应用程序特定的日志记录或错误报告
});

// 全局监听未捕获的异常
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // 优雅关闭服务器，然后退出
  server.close(() => process.exit(1));
});
```

### 错误包装与重试

```javascript
class RetryError extends Error {
  constructor(message, attempts, lastError) {
    super(message);
    this.name = 'RetryError';
    this.attempts = attempts;
    this.lastError = lastError;
  }
}

async function retry(fn, options = {}) {
  const { 
    maxAttempts = 3, 
    delay = 1000, 
    backoff = 2,
    shouldRetry = () => true 
  } = options;
  
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn(attempt);
    } catch (error) {
      lastError = error;
      
      if (attempt === maxAttempts || !shouldRetry(error)) {
        throw new RetryError(
          `Failed after ${attempt} attempts`,
          attempt,
          lastError
        );
      }
      
      const waitTime = delay * Math.pow(backoff, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

// 使用
const data = await retry(
  () => fetch('https://api.example.com/data'),
  { maxAttempts: 5, delay: 500 }
);
```

## Stream：高效处理大数据

### 四种 Stream 类型

```javascript
const fs = require('fs');
const { Transform } = require('stream');

// Readable - 可读流
const readable = fs.createReadStream('input.txt');

// Writable - 可写流
const writable = fs.createWriteStream('output.txt');

// Duplex - 双向流（如 TCP socket）
// Transform - 转换流

// 创建转换流
const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

// 管道连接
readable
  .pipe(upperCase)
  .pipe(writable)
  .on('finish', () => console.log('Done!'));
```

### 使用 pipeline 处理错误

```javascript
const { pipeline } = require('stream/promises');
const fs = require('fs');
const zlib = require('zlib');

async function compress(input, output) {
  await pipeline(
    fs.createReadStream(input),
    zlib.createGzip(),
    fs.createWriteStream(output)
  );
  console.log('Compression complete');
}

// pipeline 会自动处理错误和清理资源
compress('file.txt', 'file.txt.gz').catch(console.error);
```

## Worker Threads：CPU 密集型任务

```javascript
// main.js
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  // 主线程
  const worker = new Worker(__filename, {
    workerData: { start: 0, end: 1000000 }
  });
  
  worker.on('message', result => {
    console.log('Result:', result);
  });
  
  worker.on('error', err => {
    console.error('Worker error:', err);
  });
} else {
  // Worker 线程
  const { start, end } = workerData;
  let sum = 0;
  
  for (let i = start; i <= end; i++) {
    sum += i;
  }
  
  parentPort.postMessage(sum);
}
```

### Worker Pool 模式

```javascript
const { Worker } = require('worker_threads');
const os = require('os');

class WorkerPool {
  constructor(workerPath, numWorkers = os.cpus().length) {
    this.workerPath = workerPath;
    this.workers = [];
    this.freeWorkers = [];
    this.queue = [];
    
    for (let i = 0; i < numWorkers; i++) {
      this.addNewWorker();
    }
  }
  
  addNewWorker() {
    const worker = new Worker(this.workerPath);
    
    worker.on('message', result => {
      worker.currentTask.resolve(result);
      worker.currentTask = null;
      this.freeWorkers.push(worker);
      this.processQueue();
    });
    
    worker.on('error', err => {
      if (worker.currentTask) {
        worker.currentTask.reject(err);
      }
    });
    
    this.workers.push(worker);
    this.freeWorkers.push(worker);
  }
  
  runTask(data) {
    return new Promise((resolve, reject) => {
      this.queue.push({ data, resolve, reject });
      this.processQueue();
    });
  }
  
  processQueue() {
    if (this.queue.length === 0 || this.freeWorkers.length === 0) {
      return;
    }
    
    const worker = this.freeWorkers.pop();
    const task = this.queue.shift();
    
    worker.currentTask = task;
    worker.postMessage(task.data);
  }
}
```

## 性能优化技巧

### 1. 避免阻塞事件循环

```javascript
// ❌ 同步阻塞
function processLargeArray(arr) {
  return arr.map(item => heavyComputation(item));
}

// ✅ 分块异步处理
async function processLargeArray(arr, chunkSize = 100) {
  const results = [];
  
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    const chunkResults = chunk.map(heavyComputation);
    results.push(...chunkResults);
    
    // 让出事件循环
    await new Promise(resolve => setImmediate(resolve));
  }
  
  return results;
}
```

### 2. 使用对象池减少 GC

```javascript
class ObjectPool {
  constructor(factory, initialSize = 10) {
    this.factory = factory;
    this.pool = Array.from({ length: initialSize }, factory);
  }
  
  acquire() {
    return this.pool.pop() || this.factory();
  }
  
  release(obj) {
    this.pool.push(obj);
  }
}
```

### 3. 连接池管理

```javascript
const genericPool = require('generic-pool');

const dbPool = genericPool.createPool({
  create: async () => {
    return await createConnection();
  },
  destroy: async (connection) => {
    await connection.close();
  }
}, {
  max: 10,
  min: 2,
  acquireTimeoutMillis: 3000
});

// 使用
async function query(sql) {
  const connection = await dbPool.acquire();
  try {
    return await connection.query(sql);
  } finally {
    dbPool.release(connection);
  }
}
```

## 总结

1. **理解事件循环** - 掌握 Node.js 异步执行的核心机制
2. **正确使用并发** - Promise.all 并发，但要控制并发数
3. **完善错误处理** - 全局捕获 + 本地处理，配合重试机制
4. **善用 Stream** - 处理大文件和数据流的最佳方式
5. **Worker Threads** - CPU 密集型任务的解决方案
6. **性能意识** - 避免阻塞，使用池化技术

掌握这些知识，你就能写出高效、稳定的 Node.js 应用。

