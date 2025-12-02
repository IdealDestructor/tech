---
title: "深度学习基础：从感知机到神经网络"
pubDate: "2025-12-02T12:00:00.000Z"
author: foxgem
description: "系统讲解深度学习的基础知识，从感知机到多层神经网络，理解深度学习的核心概念。"
tags: [deep-learning, neural-network, machine-learning, ai]
image: "/blog-covers/deep-learning.jpg"
---

深度学习是人工智能领域最重要的技术之一。本文将从最基础的感知机开始，逐步深入到现代神经网络。

## 感知机：一切的起点

感知机（Perceptron）是最简单的神经网络单元，由 Frank Rosenblatt 在 1957 年提出。

### 数学模型

```
y = f(w₁x₁ + w₂x₂ + ... + wₙxₙ + b)

其中：
- x: 输入特征
- w: 权重
- b: 偏置
- f: 激活函数（阶跃函数）
```

### Python 实现

```python
import numpy as np

class Perceptron:
    def __init__(self, input_dim, learning_rate=0.01):
        self.weights = np.zeros(input_dim)
        self.bias = 0
        self.lr = learning_rate
    
    def predict(self, x):
        linear_output = np.dot(x, self.weights) + self.bias
        return 1 if linear_output >= 0 else 0
    
    def train(self, X, y, epochs=100):
        for _ in range(epochs):
            for xi, yi in zip(X, y):
                prediction = self.predict(xi)
                # 权重更新规则
                self.weights += self.lr * (yi - prediction) * xi
                self.bias += self.lr * (yi - prediction)
```

### 感知机的局限

感知机只能解决线性可分问题，著名的 XOR 问题就无法解决：

```
XOR 问题：
(0,0) → 0
(0,1) → 1
(1,0) → 1
(1,1) → 0

这四个点无法用一条直线分开！
```

## 多层感知机（MLP）

为了解决非线性问题，我们需要多层网络：

```
输入层 → 隐藏层 → 输出层
  x    →   h    →   y

h = σ(W₁x + b₁)
y = σ(W₂h + b₂)
```

### 激活函数

激活函数引入非线性，使网络能够学习复杂模式：

| 函数 | 公式 | 特点 |
|-----|------|------|
| Sigmoid | σ(x) = 1/(1+e⁻ˣ) | 输出 (0,1)，梯度消失 |
| Tanh | tanh(x) | 输出 (-1,1)，零中心化 |
| ReLU | max(0,x) | 简单高效，主流选择 |
| LeakyReLU | max(0.01x,x) | 解决 ReLU 死亡问题 |
| GELU | x·Φ(x) | Transformer 常用 |

```python
# 常用激活函数实现
def relu(x):
    return np.maximum(0, x)

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def softmax(x):
    exp_x = np.exp(x - np.max(x))
    return exp_x / exp_x.sum()
```

## 反向传播算法

反向传播是训练神经网络的核心算法，基于链式法则计算梯度。

### 前向传播

```python
def forward(x, W1, b1, W2, b2):
    # 第一层
    z1 = np.dot(x, W1) + b1
    a1 = relu(z1)
    
    # 第二层
    z2 = np.dot(a1, W2) + b2
    a2 = softmax(z2)
    
    return z1, a1, z2, a2
```

### 反向传播

```python
def backward(x, y, z1, a1, z2, a2, W1, W2):
    m = x.shape[0]
    
    # 输出层梯度
    dz2 = a2 - y  # 交叉熵 + softmax 的梯度
    dW2 = (1/m) * np.dot(a1.T, dz2)
    db2 = (1/m) * np.sum(dz2, axis=0)
    
    # 隐藏层梯度
    da1 = np.dot(dz2, W2.T)
    dz1 = da1 * (z1 > 0)  # ReLU 梯度
    dW1 = (1/m) * np.dot(x.T, dz1)
    db1 = (1/m) * np.sum(dz1, axis=0)
    
    return dW1, db1, dW2, db2
```

## 损失函数

### 回归任务：均方误差 (MSE)

```python
def mse_loss(y_true, y_pred):
    return np.mean((y_true - y_pred) ** 2)
```

### 分类任务：交叉熵损失

```python
def cross_entropy_loss(y_true, y_pred):
    # 防止 log(0)
    epsilon = 1e-15
    y_pred = np.clip(y_pred, epsilon, 1 - epsilon)
    return -np.mean(y_true * np.log(y_pred))
```

## 优化算法

### 梯度下降家族

```python
# 批量梯度下降 (BGD)
def bgd(params, grads, lr):
    for param, grad in zip(params, grads):
        param -= lr * grad

# 随机梯度下降 (SGD)
def sgd(params, grads, lr):
    # 每次只用一个样本
    for param, grad in zip(params, grads):
        param -= lr * grad

# 小批量梯度下降 (Mini-batch)
# 结合两者优点，实践中最常用
```

### Adam 优化器

Adam 是目前最流行的优化器，结合了动量和自适应学习率：

```python
class Adam:
    def __init__(self, lr=0.001, beta1=0.9, beta2=0.999, eps=1e-8):
        self.lr = lr
        self.beta1 = beta1
        self.beta2 = beta2
        self.eps = eps
        self.m = {}  # 一阶矩估计
        self.v = {}  # 二阶矩估计
        self.t = 0   # 时间步
    
    def update(self, params, grads):
        self.t += 1
        
        for key in params:
            if key not in self.m:
                self.m[key] = np.zeros_like(params[key])
                self.v[key] = np.zeros_like(params[key])
            
            # 更新矩估计
            self.m[key] = self.beta1 * self.m[key] + (1 - self.beta1) * grads[key]
            self.v[key] = self.beta2 * self.v[key] + (1 - self.beta2) * (grads[key] ** 2)
            
            # 偏差修正
            m_hat = self.m[key] / (1 - self.beta1 ** self.t)
            v_hat = self.v[key] / (1 - self.beta2 ** self.t)
            
            # 参数更新
            params[key] -= self.lr * m_hat / (np.sqrt(v_hat) + self.eps)
```

## 正则化技术

### Dropout

训练时随机"丢弃"部分神经元：

```python
def dropout(x, keep_prob=0.5, training=True):
    if not training:
        return x
    
    mask = np.random.binomial(1, keep_prob, size=x.shape) / keep_prob
    return x * mask
```

### Batch Normalization

标准化每层的输入：

```python
def batch_norm(x, gamma, beta, eps=1e-5):
    mean = np.mean(x, axis=0)
    var = np.var(x, axis=0)
    
    x_norm = (x - mean) / np.sqrt(var + eps)
    return gamma * x_norm + beta
```

### L2 正则化（权重衰减）

```python
def l2_loss(weights, lambda_):
    return lambda_ * sum(np.sum(w ** 2) for w in weights)

# 在梯度更新时
# dW += lambda_ * W
```

## 完整的神经网络示例

```python
class NeuralNetwork:
    def __init__(self, layer_dims):
        self.params = {}
        self.L = len(layer_dims) - 1
        
        # Xavier 初始化
        for l in range(1, self.L + 1):
            self.params[f'W{l}'] = np.random.randn(
                layer_dims[l-1], layer_dims[l]
            ) * np.sqrt(2 / layer_dims[l-1])
            self.params[f'b{l}'] = np.zeros((1, layer_dims[l]))
    
    def forward(self, X):
        self.cache = {'A0': X}
        A = X
        
        for l in range(1, self.L):
            Z = np.dot(A, self.params[f'W{l}']) + self.params[f'b{l}']
            A = relu(Z)
            self.cache[f'Z{l}'] = Z
            self.cache[f'A{l}'] = A
        
        # 输出层
        ZL = np.dot(A, self.params[f'W{self.L}']) + self.params[f'b{self.L}']
        AL = softmax(ZL)
        self.cache[f'Z{self.L}'] = ZL
        self.cache[f'A{self.L}'] = AL
        
        return AL
    
    def backward(self, Y):
        m = Y.shape[0]
        grads = {}
        
        # 输出层
        dZ = self.cache[f'A{self.L}'] - Y
        grads[f'W{self.L}'] = (1/m) * np.dot(self.cache[f'A{self.L-1}'].T, dZ)
        grads[f'b{self.L}'] = (1/m) * np.sum(dZ, axis=0, keepdims=True)
        
        # 隐藏层
        for l in range(self.L - 1, 0, -1):
            dA = np.dot(dZ, self.params[f'W{l+1}'].T)
            dZ = dA * (self.cache[f'Z{l}'] > 0)
            grads[f'W{l}'] = (1/m) * np.dot(self.cache[f'A{l-1}'].T, dZ)
            grads[f'b{l}'] = (1/m) * np.sum(dZ, axis=0, keepdims=True)
        
        return grads
    
    def train(self, X, Y, epochs=1000, lr=0.01):
        for epoch in range(epochs):
            # 前向传播
            AL = self.forward(X)
            
            # 计算损失
            loss = -np.mean(Y * np.log(AL + 1e-8))
            
            # 反向传播
            grads = self.backward(Y)
            
            # 更新参数
            for l in range(1, self.L + 1):
                self.params[f'W{l}'] -= lr * grads[f'W{l}']
                self.params[f'b{l}'] -= lr * grads[f'b{l}']
            
            if epoch % 100 == 0:
                print(f'Epoch {epoch}, Loss: {loss:.4f}')
```

## 总结

深度学习的核心知识点：

1. **感知机** → **多层网络** - 堆叠获得非线性表达能力
2. **激活函数** - ReLU 是主流选择
3. **反向传播** - 基于链式法则的梯度计算
4. **优化算法** - Adam 是默认首选
5. **正则化** - Dropout、BatchNorm 防止过拟合

掌握这些基础，你就为学习更高级的深度学习技术（CNN、RNN、Transformer）打下了坚实的基础。

