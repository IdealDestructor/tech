---
title: 'Redis 数据结构速查'
pubDate: "2025-12-22T09:00:00.000Z"
tags: ["redis", "database", "backend", "cache"]
template: "blackWhite"
---

```json
{
  "title": "Redis 数据结构速查",
  "description": "Redis 五大核心数据结构及其底层实现速查表，包括 String、List、Hash、Set、Sorted Set 的使用场景和常用命令。",
  "keyPoints": [
    "String: 最基础类型，可存二进制，底层 SDS 结构",
    "List: 双向链表，支持阻塞操作(BLPOP)，适合消息队列",
    "Hash: 字段-值映射，适合存储对象，HGETALL 获取全部",
    "Set: 无序不重复集合，支持交并差运算(SINTER/SUNION)",
    "Sorted Set: 有序集合，带 score 排序，适合排行榜",
    "过期策略: 惰性删除 + 定期删除，配合内存淘汰策略",
    "持久化: RDB 快照 + AOF 日志，混合持久化最佳"
  ],
  "references": [
    "https://redis.io/docs/data-types/",
    "https://redis.io/commands/"
  ],
  "tools": [],
  "mermaidMarkdown": "flowchart TB\n    A[Redis 数据结构] --> B[String]\n    A --> C[List]\n    A --> D[Hash]\n    A --> E[Set]\n    A --> F[Sorted Set]\n    B --> G[缓存/计数器/分布式锁]\n    C --> H[消息队列/最新列表]\n    D --> I[对象存储/购物车]\n    E --> J[标签/好友关系]\n    F --> K[排行榜/延迟队列]",
  "url": ""
}
```

