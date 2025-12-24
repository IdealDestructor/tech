---
title: "图论算法基础：从 BFS 到最短路径"
pubDate: "2025-12-24T08:00:00.000Z"
author: foxgem
description: "系统学习图论算法，掌握 BFS、DFS、拓扑排序、最短路径等核心算法，解决实际的路径规划和网络问题。"
tags: [algorithm, graph, bfs, dfs, shortest-path]
image: "/blog-covers/graph-algorithm.jpg"
---

图是计算机科学中最重要的数据结构之一，社交网络、地图导航、任务调度等问题都可以用图来建模。本文将系统介绍图论的核心算法。

## 图的基本概念

### 图的表示方法

```javascript
// 1. 邻接矩阵 - 适合稠密图
const matrix = [
  [0, 1, 0, 1],
  [1, 0, 1, 0],
  [0, 1, 0, 1],
  [1, 0, 1, 0]
];
// matrix[i][j] = 1 表示节点 i 和 j 之间有边

// 2. 邻接表 - 适合稀疏图（推荐）
const graph = {
  0: [1, 3],
  1: [0, 2],
  2: [1, 3],
  3: [0, 2]
};

// 3. 边列表
const edges = [
  [0, 1], [0, 3], [1, 2], [2, 3]
];
```

### 图的类型

| 类型 | 特点 | 示例 |
|-----|------|------|
| 无向图 | 边没有方向 | 社交好友关系 |
| 有向图 | 边有方向 | 微博关注关系 |
| 加权图 | 边有权重 | 地图路径距离 |
| 有向无环图(DAG) | 有向 + 无环 | 任务依赖关系 |

## BFS：广度优先搜索

BFS 按"层"遍历图，适合求最短路径（无权图）。

### 基本实现

```javascript
function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const result = [];
  
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node);
    
    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return result;
}

// 使用
const graph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'],
  E: ['B', 'F'],
  F: ['C', 'E']
};

console.log(bfs(graph, 'A')); // ['A', 'B', 'C', 'D', 'E', 'F']
```

### 求最短路径（无权图）

```javascript
function shortestPath(graph, start, end) {
  if (start === end) return [start];
  
  const visited = new Set([start]);
  const queue = [[start, [start]]];
  
  while (queue.length > 0) {
    const [node, path] = queue.shift();
    
    for (const neighbor of graph[node] || []) {
      if (neighbor === end) {
        return [...path, neighbor];
      }
      
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, [...path, neighbor]]);
      }
    }
  }
  
  return null; // 无法到达
}
```

### BFS 应用场景

1. **最短路径**（无权图）
2. **层序遍历**（二叉树、N叉树）
3. **连通分量**
4. **网格问题**（走迷宫、岛屿数量）

## DFS：深度优先搜索

DFS "一条路走到黑"，适合探索所有路径、检测环等场景。

### 递归实现

```javascript
function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  console.log(start);
  
  for (const neighbor of graph[start] || []) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}
```

### 迭代实现（显式栈）

```javascript
function dfsIterative(graph, start) {
  const visited = new Set();
  const stack = [start];
  const result = [];
  
  while (stack.length > 0) {
    const node = stack.pop();
    
    if (visited.has(node)) continue;
    visited.add(node);
    result.push(node);
    
    // 逆序入栈以保持顺序
    const neighbors = graph[node] || [];
    for (let i = neighbors.length - 1; i >= 0; i--) {
      if (!visited.has(neighbors[i])) {
        stack.push(neighbors[i]);
      }
    }
  }
  
  return result;
}
```

### 检测有向图中的环

```javascript
function hasCycle(graph, numNodes) {
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Array(numNodes).fill(WHITE);
  
  function dfs(node) {
    color[node] = GRAY; // 正在访问
    
    for (const neighbor of graph[node] || []) {
      if (color[neighbor] === GRAY) {
        return true; // 发现后向边，存在环
      }
      if (color[neighbor] === WHITE && dfs(neighbor)) {
        return true;
      }
    }
    
    color[node] = BLACK; // 访问完成
    return false;
  }
  
  for (let i = 0; i < numNodes; i++) {
    if (color[i] === WHITE && dfs(i)) {
      return true;
    }
  }
  
  return false;
}
```

## 拓扑排序

拓扑排序将有向无环图（DAG）排成线性序列，保证边的方向一致。

### Kahn 算法（BFS）

```javascript
function topologicalSort(graph, numNodes) {
  // 计算入度
  const inDegree = new Array(numNodes).fill(0);
  for (let node = 0; node < numNodes; node++) {
    for (const neighbor of graph[node] || []) {
      inDegree[neighbor]++;
    }
  }
  
  // 入度为 0 的节点入队
  const queue = [];
  for (let i = 0; i < numNodes; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }
  
  const result = [];
  
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node);
    
    for (const neighbor of graph[node] || []) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }
  
  // 如果结果长度不等于节点数，说明有环
  return result.length === numNodes ? result : null;
}
```

### DFS 实现

```javascript
function topologicalSortDFS(graph, numNodes) {
  const visited = new Set();
  const stack = [];
  
  function dfs(node) {
    visited.add(node);
    
    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }
    
    stack.push(node); // 后序入栈
  }
  
  for (let i = 0; i < numNodes; i++) {
    if (!visited.has(i)) {
      dfs(i);
    }
  }
  
  return stack.reverse();
}
```

### 应用：课程表问题

```javascript
// LeetCode 210: 课程表 II
function findOrder(numCourses, prerequisites) {
  const graph = Array.from({ length: numCourses }, () => []);
  const inDegree = new Array(numCourses).fill(0);
  
  for (const [course, prereq] of prerequisites) {
    graph[prereq].push(course);
    inDegree[course]++;
  }
  
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }
  
  const result = [];
  
  while (queue.length > 0) {
    const course = queue.shift();
    result.push(course);
    
    for (const next of graph[course]) {
      if (--inDegree[next] === 0) {
        queue.push(next);
      }
    }
  }
  
  return result.length === numCourses ? result : [];
}
```

## 最短路径算法

### Dijkstra 算法

适用于**非负权图**的单源最短路径。

```javascript
function dijkstra(graph, start, numNodes) {
  const dist = new Array(numNodes).fill(Infinity);
  const visited = new Set();
  dist[start] = 0;
  
  // 优先队列（最小堆），这里用数组模拟
  const pq = [[0, start]]; // [距离, 节点]
  
  while (pq.length > 0) {
    // 取出距离最小的节点
    pq.sort((a, b) => a[0] - b[0]);
    const [d, node] = pq.shift();
    
    if (visited.has(node)) continue;
    visited.add(node);
    
    for (const [neighbor, weight] of graph[node] || []) {
      const newDist = d + weight;
      if (newDist < dist[neighbor]) {
        dist[neighbor] = newDist;
        pq.push([newDist, neighbor]);
      }
    }
  }
  
  return dist;
}

// 使用（加权邻接表）
const weightedGraph = {
  0: [[1, 4], [2, 1]],  // 节点0 -> 节点1 权重4, 节点0 -> 节点2 权重1
  1: [[3, 1]],
  2: [[1, 2], [3, 5]],
  3: []
};

console.log(dijkstra(weightedGraph, 0, 4)); // [0, 3, 1, 4]
```

### Bellman-Ford 算法

适用于**可能有负权边**的图，能检测负权环。

```javascript
function bellmanFord(edges, numNodes, start) {
  const dist = new Array(numNodes).fill(Infinity);
  dist[start] = 0;
  
  // 松弛 n-1 次
  for (let i = 0; i < numNodes - 1; i++) {
    for (const [u, v, weight] of edges) {
      if (dist[u] !== Infinity && dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
      }
    }
  }
  
  // 检测负权环
  for (const [u, v, weight] of edges) {
    if (dist[u] !== Infinity && dist[u] + weight < dist[v]) {
      return null; // 存在负权环
    }
  }
  
  return dist;
}
```

### Floyd-Warshall 算法

求**所有点对**之间的最短路径。

```javascript
function floydWarshall(matrix) {
  const n = matrix.length;
  const dist = matrix.map(row => [...row]);
  
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }
  
  return dist;
}
```

## 算法选择指南

| 问题 | 推荐算法 | 时间复杂度 |
|-----|---------|-----------|
| 无权图最短路径 | BFS | O(V + E) |
| 非负权图最短路径 | Dijkstra | O((V+E)logV) |
| 有负权图最短路径 | Bellman-Ford | O(VE) |
| 所有点对最短路径 | Floyd-Warshall | O(V³) |
| 检测环 | DFS | O(V + E) |
| 拓扑排序 | Kahn / DFS | O(V + E) |

## 总结

1. **BFS** - 层序遍历，最短路径（无权）
2. **DFS** - 深度探索，检测环，路径枚举
3. **拓扑排序** - DAG 线性排序，任务调度
4. **Dijkstra** - 单源最短路径（非负权）
5. **Bellman-Ford** - 单源最短路径（可负权）

图论算法是算法竞赛和面试的高频考点，掌握这些基础算法，你就能解决大部分图相关的问题。

