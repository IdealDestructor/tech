---
title: "Transformer 架构详解：从注意力机制到 GPT"
pubDate: "2025-12-25T08:00:00.000Z"
author: foxgem
description: "深入理解 Transformer 架构的核心组件，从自注意力机制到位置编码，再到 BERT 和 GPT 的实现原理。"
tags: [ai, transformer, attention, deep-learning, nlp]
image: "/blog-covers/transformer.jpg"
---

Transformer 是现代大语言模型的基石，从 BERT 到 GPT 系列，都基于这一革命性架构。本文将深入解析 Transformer 的核心原理。

## 为什么需要 Transformer？

在 Transformer 出现之前，序列建模主要依赖 RNN 和 LSTM：

| 模型 | 并行能力 | 长距离依赖 | 训练效率 |
|-----|---------|-----------|---------|
| RNN | ❌ 串行 | ❌ 梯度消失 | 低 |
| LSTM | ❌ 串行 | ✅ 较好 | 低 |
| Transformer | ✅ 完全并行 | ✅ 全局注意力 | 高 |

Transformer 的核心创新：**自注意力机制（Self-Attention）**，让模型能够直接关注输入序列的任意位置。

## 自注意力机制

### 核心思想

自注意力允许序列中的每个位置"看到"所有其他位置，计算相关性权重。

```
输入: "The cat sat on the mat"

对于 "cat" 这个词：
- 与 "The" 相关度: 0.1
- 与 "sat" 相关度: 0.3
- 与 "mat" 相关度: 0.2
...
```

### 数学公式

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

其中：
- **Q (Query)**: 查询向量，表示"我想找什么"
- **K (Key)**: 键向量，表示"我有什么"
- **V (Value)**: 值向量，表示"我能提供什么"
- **d_k**: 键向量的维度，用于缩放

### 实现代码

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
import math

class SelfAttention(nn.Module):
    def __init__(self, embed_size, heads):
        super().__init__()
        self.embed_size = embed_size
        self.heads = heads
        self.head_dim = embed_size // heads
        
        assert self.head_dim * heads == embed_size, "embed_size 必须能被 heads 整除"
        
        self.W_q = nn.Linear(embed_size, embed_size)
        self.W_k = nn.Linear(embed_size, embed_size)
        self.W_v = nn.Linear(embed_size, embed_size)
        self.W_o = nn.Linear(embed_size, embed_size)
        
    def forward(self, x, mask=None):
        batch_size, seq_len, _ = x.shape
        
        # 线性变换
        Q = self.W_q(x)  # (batch, seq_len, embed_size)
        K = self.W_k(x)
        V = self.W_v(x)
        
        # 分割多头
        Q = Q.view(batch_size, seq_len, self.heads, self.head_dim).transpose(1, 2)
        K = K.view(batch_size, seq_len, self.heads, self.head_dim).transpose(1, 2)
        V = V.view(batch_size, seq_len, self.heads, self.head_dim).transpose(1, 2)
        
        # 计算注意力分数
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.head_dim)
        
        # 应用掩码（如果有）
        if mask is not None:
            scores = scores.masked_fill(mask == 0, float('-inf'))
        
        # Softmax 归一化
        attention = F.softmax(scores, dim=-1)
        
        # 加权求和
        out = torch.matmul(attention, V)
        
        # 合并多头
        out = out.transpose(1, 2).contiguous().view(batch_size, seq_len, self.embed_size)
        
        return self.W_o(out)
```

### 多头注意力

多头注意力让模型从不同的表示子空间学习信息：

```
Multi-Head Attention = Concat(head_1, head_2, ..., head_h) × W_o

每个 head 关注不同的特征：
- head_1: 可能关注语法关系
- head_2: 可能关注语义关系
- head_3: 可能关注位置关系
...
```

## 位置编码

Transformer 没有循环结构，需要显式地注入位置信息。

### 正弦位置编码

```python
class PositionalEncoding(nn.Module):
    def __init__(self, embed_size, max_len=5000):
        super().__init__()
        
        pe = torch.zeros(max_len, embed_size)
        position = torch.arange(0, max_len).unsqueeze(1).float()
        div_term = torch.exp(torch.arange(0, embed_size, 2).float() 
                            * (-math.log(10000.0) / embed_size))
        
        pe[:, 0::2] = torch.sin(position * div_term)  # 偶数维度
        pe[:, 1::2] = torch.cos(position * div_term)  # 奇数维度
        
        pe = pe.unsqueeze(0)  # (1, max_len, embed_size)
        self.register_buffer('pe', pe)
        
    def forward(self, x):
        return x + self.pe[:, :x.size(1)]
```

### 为什么用正弦函数？

1. **相对位置可计算**：PE(pos+k) 可以表示为 PE(pos) 的线性函数
2. **泛化到更长序列**：训练时没见过的位置也能得到合理的编码
3. **不同维度编码不同频率的信息**

## Transformer 整体架构

```
                    输出概率
                       ↑
                  Linear + Softmax
                       ↑
              ┌────────────────┐
              │   Decoder × N  │
              │  ┌──────────┐  │
              │  │ FFN      │  │
              │  │ Add&Norm │  │
              │  │ Cross-Att│  │  ← 编码器输出
              │  │ Add&Norm │  │
              │  │ Masked   │  │
              │  │ Self-Att │  │
              │  │ Add&Norm │  │
              │  └──────────┘  │
              └────────────────┘
                       ↑
              ┌────────────────┐
              │   Encoder × N  │
              │  ┌──────────┐  │
              │  │ FFN      │  │
              │  │ Add&Norm │  │
              │  │ Self-Att │  │
              │  │ Add&Norm │  │
              │  └──────────┘  │
              └────────────────┘
                       ↑
              Positional Encoding
                       ↑
                  Embedding
                       ↑
                    输入序列
```

### Encoder Block

```python
class EncoderBlock(nn.Module):
    def __init__(self, embed_size, heads, ff_hidden, dropout):
        super().__init__()
        self.attention = SelfAttention(embed_size, heads)
        self.norm1 = nn.LayerNorm(embed_size)
        self.norm2 = nn.LayerNorm(embed_size)
        
        self.feed_forward = nn.Sequential(
            nn.Linear(embed_size, ff_hidden),
            nn.GELU(),
            nn.Linear(ff_hidden, embed_size),
            nn.Dropout(dropout)
        )
        
        self.dropout = nn.Dropout(dropout)
        
    def forward(self, x, mask=None):
        # Self-Attention + 残差连接
        attn_out = self.attention(x, mask)
        x = self.norm1(x + self.dropout(attn_out))
        
        # Feed Forward + 残差连接
        ff_out = self.feed_forward(x)
        x = self.norm2(x + self.dropout(ff_out))
        
        return x
```

### Feed Forward Network

```python
# 两层全连接，中间用 GELU 激活
FFN(x) = GELU(xW_1 + b_1)W_2 + b_2

# 通常 ff_hidden = 4 × embed_size
```

## BERT vs GPT：两种范式

### BERT（双向编码器）

```
架构: Encoder-only
训练: 掩码语言模型 (MLM) + 下一句预测 (NSP)
特点: 双向上下文，适合理解任务

输入: The [MASK] sat on the mat
目标: 预测 [MASK] = cat
```

### GPT（自回归解码器）

```
架构: Decoder-only
训练: 下一个 token 预测 (Causal LM)
特点: 单向（从左到右），适合生成任务

输入: The cat sat
目标: 预测下一个词 → on
```

### Causal Mask

GPT 使用因果掩码，确保每个位置只能看到之前的内容：

```python
def create_causal_mask(seq_len):
    mask = torch.triu(torch.ones(seq_len, seq_len), diagonal=1)
    return mask == 0  # 上三角为 False

# 示例 (seq_len=4):
# [[True, False, False, False],
#  [True, True,  False, False],
#  [True, True,  True,  False],
#  [True, True,  True,  True ]]
```

## 现代改进

### 1. RoPE 位置编码

旋转位置编码（Rotary Position Embedding），被 LLaMA 等模型采用：

```python
def rotate_half(x):
    x1, x2 = x[..., :x.shape[-1]//2], x[..., x.shape[-1]//2:]
    return torch.cat([-x2, x1], dim=-1)

def apply_rotary_pos_emb(q, k, cos, sin):
    q_embed = (q * cos) + (rotate_half(q) * sin)
    k_embed = (k * cos) + (rotate_half(k) * sin)
    return q_embed, k_embed
```

### 2. Flash Attention

优化注意力计算的内存效率：

```python
# 传统方法: O(n²) 内存
attention = softmax(QK^T / sqrt(d)) @ V

# Flash Attention: 分块计算，内存更高效
# 通过 tiling 技术，避免存储完整的注意力矩阵
```

### 3. Group Query Attention (GQA)

减少 KV 缓存的内存占用：

```
MHA:  每个 head 有独立的 K, V
MQA:  所有 head 共享 K, V
GQA:  分组共享 K, V（折中方案）
```

## 总结

1. **自注意力** - Transformer 的核心，实现全局依赖建模
2. **多头机制** - 从不同子空间学习信息
3. **位置编码** - 注入序列位置信息
4. **残差连接 + LayerNorm** - 稳定深层网络训练
5. **BERT vs GPT** - 理解任务 vs 生成任务的不同范式

理解 Transformer 架构，是深入学习大语言模型的基础。掌握这些原理，你就能更好地理解和使用现代 AI 模型。

