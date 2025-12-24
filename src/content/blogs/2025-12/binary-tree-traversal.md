---
title: "二叉树遍历与常见算法详解"
pubDate: "2025-12-24T10:00:00.000Z"
author: foxgem
description: "全面掌握二叉树的遍历方式、递归与迭代实现、层序遍历变体，以及 LCA、路径和等高频面试题的解法。"
tags: [algorithm, tree, binary-tree, data-structure]
image: "/blog-covers/binary-tree.jpg"
---

二叉树是最常见的树形数据结构，也是面试中的高频考点。本文将系统介绍二叉树的遍历方法和常见算法。

## 二叉树节点定义

```javascript
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}
```

## 深度优先遍历（DFS）

### 三种遍历顺序

```
        1
       / \
      2   3
     / \
    4   5

前序遍历: 1 → 2 → 4 → 5 → 3  (根 → 左 → 右)
中序遍历: 4 → 2 → 5 → 1 → 3  (左 → 根 → 右)
后序遍历: 4 → 5 → 2 → 3 → 1  (左 → 右 → 根)
```

### 递归实现

```javascript
// 前序遍历
function preorderTraversal(root) {
  const result = [];
  
  function traverse(node) {
    if (!node) return;
    result.push(node.val);    // 根
    traverse(node.left);       // 左
    traverse(node.right);      // 右
  }
  
  traverse(root);
  return result;
}

// 中序遍历
function inorderTraversal(root) {
  const result = [];
  
  function traverse(node) {
    if (!node) return;
    traverse(node.left);       // 左
    result.push(node.val);    // 根
    traverse(node.right);      // 右
  }
  
  traverse(root);
  return result;
}

// 后序遍历
function postorderTraversal(root) {
  const result = [];
  
  function traverse(node) {
    if (!node) return;
    traverse(node.left);       // 左
    traverse(node.right);      // 右
    result.push(node.val);    // 根
  }
  
  traverse(root);
  return result;
}
```

### 迭代实现

```javascript
// 前序遍历（迭代）
function preorderIterative(root) {
  if (!root) return [];
  
  const result = [];
  const stack = [root];
  
  while (stack.length) {
    const node = stack.pop();
    result.push(node.val);
    
    // 先右后左入栈，保证左子树先处理
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  
  return result;
}

// 中序遍历（迭代）
function inorderIterative(root) {
  const result = [];
  const stack = [];
  let current = root;
  
  while (current || stack.length) {
    // 一路向左
    while (current) {
      stack.push(current);
      current = current.left;
    }
    
    // 处理节点
    current = stack.pop();
    result.push(current.val);
    
    // 转向右子树
    current = current.right;
  }
  
  return result;
}

// 后序遍历（迭代）- 双栈法
function postorderIterative(root) {
  if (!root) return [];
  
  const result = [];
  const stack1 = [root];
  const stack2 = [];
  
  while (stack1.length) {
    const node = stack1.pop();
    stack2.push(node);
    
    if (node.left) stack1.push(node.left);
    if (node.right) stack1.push(node.right);
  }
  
  while (stack2.length) {
    result.push(stack2.pop().val);
  }
  
  return result;
}
```

## 广度优先遍历（BFS）

### 层序遍历

```javascript
function levelOrder(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length) {
    const levelSize = queue.length;
    const level = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      level.push(node.val);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(level);
  }
  
  return result;
}

// 输出: [[1], [2, 3], [4, 5]]
```

### 层序遍历变体

```javascript
// 之字形遍历 (Zigzag)
function zigzagLevelOrder(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  let leftToRight = true;
  
  while (queue.length) {
    const levelSize = queue.length;
    const level = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      
      if (leftToRight) {
        level.push(node.val);
      } else {
        level.unshift(node.val);
      }
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(level);
    leftToRight = !leftToRight;
  }
  
  return result;
}

// 右视图
function rightSideView(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length) {
    const levelSize = queue.length;
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      
      if (i === levelSize - 1) {
        result.push(node.val); // 每层最后一个
      }
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  
  return result;
}
```

## 二叉树基础操作

### 求树的深度

```javascript
// 递归
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// BFS
function maxDepthBFS(root) {
  if (!root) return 0;
  
  let depth = 0;
  const queue = [root];
  
  while (queue.length) {
    depth++;
    const levelSize = queue.length;
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  
  return depth;
}
```

### 判断平衡二叉树

```javascript
function isBalanced(root) {
  function getHeight(node) {
    if (!node) return 0;
    
    const leftHeight = getHeight(node.left);
    if (leftHeight === -1) return -1;
    
    const rightHeight = getHeight(node.right);
    if (rightHeight === -1) return -1;
    
    if (Math.abs(leftHeight - rightHeight) > 1) {
      return -1; // 不平衡
    }
    
    return 1 + Math.max(leftHeight, rightHeight);
  }
  
  return getHeight(root) !== -1;
}
```

### 判断对称二叉树

```javascript
function isSymmetric(root) {
  if (!root) return true;
  
  function isMirror(left, right) {
    if (!left && !right) return true;
    if (!left || !right) return false;
    
    return left.val === right.val
      && isMirror(left.left, right.right)
      && isMirror(left.right, right.left);
  }
  
  return isMirror(root.left, root.right);
}
```

## 高频面试题

### 最近公共祖先（LCA）

```javascript
function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) {
    return root;
  }
  
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  
  // p 和 q 分别在左右子树
  if (left && right) return root;
  
  // 都在一侧
  return left || right;
}
```

### 路径总和

```javascript
// 判断是否存在根到叶路径和等于 target
function hasPathSum(root, target) {
  if (!root) return false;
  
  // 叶子节点
  if (!root.left && !root.right) {
    return root.val === target;
  }
  
  const remaining = target - root.val;
  return hasPathSum(root.left, remaining) 
      || hasPathSum(root.right, remaining);
}

// 返回所有满足条件的路径
function pathSum(root, target) {
  const result = [];
  
  function dfs(node, remaining, path) {
    if (!node) return;
    
    path.push(node.val);
    
    if (!node.left && !node.right && node.val === remaining) {
      result.push([...path]);
    } else {
      dfs(node.left, remaining - node.val, path);
      dfs(node.right, remaining - node.val, path);
    }
    
    path.pop(); // 回溯
  }
  
  dfs(root, target, []);
  return result;
}
```

### 从遍历序列构建二叉树

```javascript
// 从前序和中序构建
function buildTree(preorder, inorder) {
  if (!preorder.length) return null;
  
  const rootVal = preorder[0];
  const root = new TreeNode(rootVal);
  
  const rootIndex = inorder.indexOf(rootVal);
  
  root.left = buildTree(
    preorder.slice(1, rootIndex + 1),
    inorder.slice(0, rootIndex)
  );
  
  root.right = buildTree(
    preorder.slice(rootIndex + 1),
    inorder.slice(rootIndex + 1)
  );
  
  return root;
}
```

### 二叉树序列化与反序列化

```javascript
// 序列化（前序）
function serialize(root) {
  if (!root) return 'null';
  return `${root.val},${serialize(root.left)},${serialize(root.right)}`;
}

// 反序列化
function deserialize(data) {
  const nodes = data.split(',');
  let index = 0;
  
  function build() {
    const val = nodes[index++];
    if (val === 'null') return null;
    
    const node = new TreeNode(parseInt(val));
    node.left = build();
    node.right = build();
    return node;
  }
  
  return build();
}
```

### 验证二叉搜索树

```javascript
function isValidBST(root) {
  function validate(node, min, max) {
    if (!node) return true;
    
    if (node.val <= min || node.val >= max) {
      return false;
    }
    
    return validate(node.left, min, node.val)
        && validate(node.right, node.val, max);
  }
  
  return validate(root, -Infinity, Infinity);
}

// 中序遍历法（BST 中序遍历是升序）
function isValidBSTInorder(root) {
  let prev = -Infinity;
  
  function inorder(node) {
    if (!node) return true;
    
    if (!inorder(node.left)) return false;
    
    if (node.val <= prev) return false;
    prev = node.val;
    
    return inorder(node.right);
  }
  
  return inorder(root);
}
```

## 遍历方式对比

| 遍历方式 | 顺序 | 应用场景 |
|---------|------|---------|
| 前序 | 根→左→右 | 复制树、序列化 |
| 中序 | 左→根→右 | BST 有序输出 |
| 后序 | 左→右→根 | 删除树、计算高度 |
| 层序 | 按层 | 最短路径、层级操作 |

## 总结

1. **掌握三种 DFS 顺序** - 前序、中序、后序的递归与迭代
2. **熟练使用 BFS** - 层序遍历及其变体
3. **理解递归思想** - 大多数树问题可以分解为子树问题
4. **注意边界条件** - 空节点、单节点、叶子节点
5. **BST 特性** - 中序遍历有序，可以用来验证

二叉树问题的核心是**递归思维**：把大问题分解为对左右子树的相同问题。掌握这个思路，大部分树的问题都能迎刃而解。

