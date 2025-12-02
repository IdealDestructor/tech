---
title: "操作系统进程调度算法"
pubDate: "2025-12-02T14:00:00.000Z"
author: foxgem
description: "深入理解操作系统的进程调度算法，从 FCFS 到 CFS，掌握 CPU 资源分配的核心机制。"
tags: [operating-system, process, scheduling, computer-science]
image: "/blog-covers/os-process.jpg"
---

进程调度是操作系统的核心功能之一，决定了 CPU 资源如何在多个进程之间分配。本文将详细介绍各种调度算法。

## 进程与线程

### 进程 (Process)

进程是程序执行的实例，拥有独立的地址空间。

```
进程结构:
┌──────────────────────────┐
│         Stack           │  ← 局部变量、函数调用
├──────────────────────────┤
│           ↓             │
│                         │
│           ↑             │
├──────────────────────────┤
│          Heap           │  ← 动态分配内存
├──────────────────────────┤
│          BSS            │  ← 未初始化全局变量
├──────────────────────────┤
│          Data           │  ← 已初始化全局变量
├──────────────────────────┤
│          Text           │  ← 代码段
└──────────────────────────┘
```

### 线程 (Thread)

线程是进程内的执行单元，共享进程的地址空间。

```
进程
┌─────────────────────────────────────┐
│  共享: 代码段、数据段、堆、文件描述符  │
├─────────────────────────────────────┤
│ 线程1     │ 线程2     │ 线程3       │
│ ┌───────┐ │ ┌───────┐ │ ┌───────┐  │
│ │ Stack │ │ │ Stack │ │ │ Stack │  │
│ │ 寄存器 │ │ │ 寄存器 │ │ │ 寄存器 │  │
│ │  PC   │ │ │  PC   │ │ │  PC   │  │
│ └───────┘ │ └───────┘ │ └───────┘  │
└─────────────────────────────────────┘
```

### 进程状态转换

```
        新建                    终止
          │                      ↑
          ↓                      │
       ┌──────┐               ┌──────┐
       │ 新建 │               │ 退出 │
       └──────┘               └──────┘
          │                      ↑
          ↓                      │
       ┌──────┐   调度        ┌──────┐
       │ 就绪 │ ─────────────>│ 运行 │
       └──────┘               └──────┘
          ↑                    │   │
          │     时间片用完      │   │
          │<───────────────────┘   │
          │                        │
          │   I/O 完成             │ I/O 请求
          │<───────────┐           │
                       │           ↓
                   ┌──────┐
                   │ 阻塞 │
                   └──────┘
```

## 调度算法分类

### 非抢占式 vs 抢占式

| 类型 | 特点 | 适用场景 |
|-----|------|---------|
| 非抢占式 | 进程运行直到完成或阻塞 | 批处理系统 |
| 抢占式 | 可被高优先级进程打断 | 交互式系统 |

## 经典调度算法

### 1. 先来先服务 (FCFS)

```
进程   到达时间   运行时间
 P1       0         5
 P2       1         3
 P3       2         2

甘特图:
|  P1  |  P2  |  P3  |
0      5      8     10

平均等待时间: (0 + 4 + 6) / 3 = 3.33
平均周转时间: (5 + 7 + 8) / 3 = 6.67
```

**特点**: 简单，但存在"护航效应"（短作业等待长作业）

### 2. 短作业优先 (SJF)

```
进程   到达时间   运行时间
 P1       0         5
 P2       1         3
 P3       2         2

非抢占 SJF:
|  P1  |P3|  P2  |
0      5   7     10

抢占 SJF (SRTF):
|P1|P3| P2 |    P1    |
0  2  4    7          12
```

**特点**: 最优平均等待时间，但可能导致长作业饥饿

### 3. 优先级调度

```python
class Process:
    def __init__(self, pid, priority, burst_time):
        self.pid = pid
        self.priority = priority  # 数值越小优先级越高
        self.burst_time = burst_time
        self.waiting_time = 0

def priority_scheduling(processes):
    # 按优先级排序
    processes.sort(key=lambda p: p.priority)
    
    current_time = 0
    for process in processes:
        process.waiting_time = current_time
        current_time += process.burst_time
    
    return processes
```

**问题**: 低优先级进程可能饥饿

**解决**: 老化（Aging）- 等待时间越长，优先级越高

### 4. 时间片轮转 (Round Robin)

```
进程   运行时间
 P1       5
 P2       3
 P3       2

时间片 = 2

甘特图:
|P1|P2|P3|P1|P2|P1|
0  2  4  6  8  9  10

P3 在时间 6 完成
P2 在时间 9 完成
P1 在时间 10 完成
```

```python
from collections import deque

def round_robin(processes, quantum):
    queue = deque(processes)
    current_time = 0
    results = []
    
    while queue:
        process = queue.popleft()
        
        if process.remaining_time <= quantum:
            # 进程完成
            current_time += process.remaining_time
            process.remaining_time = 0
            process.completion_time = current_time
            results.append(process)
        else:
            # 时间片用完，重新入队
            current_time += quantum
            process.remaining_time -= quantum
            queue.append(process)
    
    return results
```

**时间片选择**:
- 太大 → 退化为 FCFS
- 太小 → 上下文切换开销大
- 经验值: 10-100ms

### 5. 多级反馈队列 (MLFQ)

```
优先级高  ┌─────────────────────────┐
    ↑    │ Queue 0 (时间片 = 8ms)  │ ← 新进程进入这里
    │    └───────────┬─────────────┘
    │                ↓ 时间片用完
    │    ┌─────────────────────────┐
    │    │ Queue 1 (时间片 = 16ms) │
    │    └───────────┬─────────────┘
    │                ↓ 时间片用完
    ↓    ┌─────────────────────────┐
优先级低  │ Queue 2 (时间片 = 32ms) │
         └─────────────────────────┘
```

**规则**:
1. 新进程进入最高优先级队列
2. 时间片用完，降级到下一队列
3. I/O 操作后，可能升级
4. 定期重置所有进程到最高优先级（防止饥饿）

## Linux CFS 调度器

### 完全公平调度器 (Completely Fair Scheduler)

CFS 是 Linux 2.6.23 引入的默认调度器，核心思想是让所有进程获得相等的 CPU 时间。

### 虚拟运行时间 (vruntime)

```
vruntime = 实际运行时间 × (基准权重 / 进程权重)

nice 值与权重的关系:
nice = 0   → weight = 1024 (基准)
nice = -20 → weight = 88761
nice = 19  → weight = 15

nice 值越小，权重越大，vruntime 增长越慢
```

### 红黑树实现

```
         CFS 运行队列
              │
              ↓
           ┌─────┐
           │ 45  │  (root)
           └──┬──┘
         ┌────┴────┐
      ┌──┴──┐   ┌──┴──┐
      │ 23  │   │ 67  │
      └─────┘   └─────┘
         ↑
    最左节点 = 下一个运行的进程
```

```c
// CFS 选择下一个进程的简化逻辑
struct task_struct *pick_next_task_fair(struct rq *rq) {
    struct sched_entity *se;
    struct cfs_rq *cfs_rq = &rq->cfs;
    
    // 获取红黑树最左节点 (vruntime 最小)
    se = rb_entry(rb_first(&cfs_rq->tasks_timeline),
                  struct sched_entity, run_node);
    
    return task_of(se);
}
```

### CFS 参数调优

```bash
# 查看调度相关参数
cat /proc/sys/kernel/sched_latency_ns        # 调度延迟
cat /proc/sys/kernel/sched_min_granularity_ns # 最小时间片

# 修改进程优先级
nice -n 10 ./program      # 启动时设置 nice 值
renice -n 5 -p 1234       # 修改运行中进程的 nice 值

# 实时调度策略
chrt -f 99 ./realtime_app # FIFO 策略，优先级 99
chrt -r 50 ./realtime_app # Round Robin 策略
```

## 实时调度

### 实时调度类

Linux 支持两种实时调度策略：

| 策略 | 描述 |
|-----|------|
| SCHED_FIFO | 先进先出，无时间片 |
| SCHED_RR | 时间片轮转 |

```c
#include <sched.h>

struct sched_param param;
param.sched_priority = 50;

// 设置为实时调度
sched_setscheduler(pid, SCHED_FIFO, &param);
```

### 优先级范围

```
┌─────────────────────────────────────┐
│ 实时进程 (SCHED_FIFO, SCHED_RR)    │  0-99 (数值越大优先级越高)
├─────────────────────────────────────┤
│ 普通进程 (SCHED_NORMAL/CFS)        │  100-139 (nice -20 到 +19)
└─────────────────────────────────────┘
实时进程总是优先于普通进程
```

## 进程同步

### 竞态条件示例

```python
# 没有同步的危险代码
counter = 0

def increment():
    global counter
    temp = counter    # 读取
    temp = temp + 1   # 修改
    counter = temp    # 写回
    
# 两个线程同时执行可能导致:
# T1: temp = 0
# T2: temp = 0
# T1: counter = 1
# T2: counter = 1  (丢失了一次增加!)
```

### 互斥锁

```python
import threading

lock = threading.Lock()
counter = 0

def safe_increment():
    global counter
    with lock:  # 获取锁
        counter += 1
    # 自动释放锁
```

### 死锁条件

1. **互斥**: 资源不能共享
2. **占有并等待**: 持有资源的同时请求其他资源
3. **不可抢占**: 资源不能被强制释放
4. **循环等待**: 存在进程循环等待链

### 死锁预防

```python
# 按固定顺序获取锁
def transfer(from_account, to_account, amount):
    # 总是先锁 ID 小的账户
    first = min(from_account, to_account, key=lambda a: a.id)
    second = max(from_account, to_account, key=lambda a: a.id)
    
    with first.lock:
        with second.lock:
            from_account.balance -= amount
            to_account.balance += amount
```

## 性能指标

| 指标 | 定义 |
|-----|------|
| CPU 利用率 | CPU 忙碌时间 / 总时间 |
| 吞吐量 | 单位时间完成的进程数 |
| 周转时间 | 完成时间 - 到达时间 |
| 等待时间 | 周转时间 - 运行时间 |
| 响应时间 | 首次响应时间 - 到达时间 |

## 总结

1. **了解各种调度算法** - 每种都有适用场景
2. **理解 Linux CFS** - 现代系统的主流实现
3. **掌握进程同步** - 避免竞态条件和死锁
4. **性能调优** - 合理设置优先级和调度策略

进程调度是操作系统的核心，理解它有助于编写高效的并发程序和进行系统性能优化。

