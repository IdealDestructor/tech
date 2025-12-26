---
title: "数据库索引原理与优化实践"
pubDate: "2025-12-23T08:00:00.000Z"
author: foxgem
description: "深入理解数据库索引的工作原理，掌握 B+ 树结构、索引类型和查询优化技巧，让你的 SQL 查询快如闪电。"
tags: [database, mysql, index, backend, optimization]
image: "https://picsum.photos/seed/database-index/1600/900"
---

数据库索引是提升查询性能的关键。本文将深入探讨索引的底层原理、设计原则和优化技巧，帮助你写出高效的数据库查询。

## 为什么需要索引？

没有索引时，数据库必须进行全表扫描（Full Table Scan）：

```
查询: SELECT * FROM users WHERE email = 'test@example.com'

无索引: 扫描 100 万行 → 耗时 5000ms
有索引: 直接定位 → 耗时 5ms
```

索引本质上是一种数据结构，用空间换时间，加速数据检索。

## B+ 树：数据库索引的基石

### 为什么选择 B+ 树？

| 数据结构 | 查找复杂度 | 范围查询 | 磁盘友好 |
|---------|-----------|---------|---------|
| 哈希表 | O(1) | ❌ 不支持 | ❌ |
| 二叉搜索树 | O(log n) | ✅ | ❌ 树太高 |
| B 树 | O(log n) | ✅ | ✅ |
| B+ 树 | O(log n) | ✅✅ 更优 | ✅✅ 更优 |

### B+ 树结构特点

```
                    [30, 60]              ← 根节点
                   /    |    \
            [10,20]  [40,50]  [70,80]    ← 分支节点
            /  |  \    |  \     |  \
          [数据页] [数据页] ... [数据页]  ← 叶子节点（存储实际数据）
          ↔      ↔      ↔      ↔        ← 双向链表连接
```

**关键特性**：
1. **非叶子节点只存索引** - 一个页可以存更多键值
2. **叶子节点存数据** - 并通过链表连接
3. **叶子节点有序链表** - 范围查询超高效
4. **树高度低** - 3-4 层可支撑千万级数据

### 查询过程演示

```sql
SELECT * FROM users WHERE id = 45;
```

```
第 1 次 I/O: 读取根节点 → 45 在 [30,60] 之间
第 2 次 I/O: 读取分支节点 → 45 在 [40,50] 之间
第 3 次 I/O: 读取叶子节点 → 找到 id=45 的数据

总计: 3 次磁盘 I/O
```

## 索引类型详解

### 主键索引 (Clustered Index)

```sql
-- 主键索引：数据按主键物理排序存储
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);
```

特点：
- 叶子节点存储完整的行数据
- 一个表只能有一个聚簇索引
- InnoDB 默认以主键创建聚簇索引

### 二级索引 (Secondary Index)

```sql
-- 二级索引：叶子节点存储主键值
CREATE INDEX idx_email ON users(email);
```

```
查询: SELECT * FROM users WHERE email = 'test@example.com'

1. 在 idx_email 索引中查找 → 得到主键 id=100
2. 回表：用 id=100 在主键索引中查找完整数据
```

### 覆盖索引 (Covering Index)

```sql
-- 查询的列都在索引中，无需回表
CREATE INDEX idx_email_name ON users(email, name);

-- 这个查询可以只用索引
SELECT name FROM users WHERE email = 'test@example.com';
```

### 联合索引 (Composite Index)

```sql
CREATE INDEX idx_abc ON table(a, b, c);

-- ✅ 使用索引
WHERE a = 1
WHERE a = 1 AND b = 2
WHERE a = 1 AND b = 2 AND c = 3

-- ❌ 不使用索引（跳过了 a）
WHERE b = 2
WHERE c = 3
WHERE b = 2 AND c = 3
```

**最左前缀原则**：联合索引从最左列开始匹配。

## 索引设计原则

### 1. 选择性高的列优先

```sql
-- 选择性 = 不重复值数量 / 总行数
SELECT 
  COUNT(DISTINCT gender) / COUNT(*) AS gender_selectivity,  -- 低: 0.5
  COUNT(DISTINCT email) / COUNT(*) AS email_selectivity     -- 高: ~1.0
FROM users;

-- email 更适合建索引
```

### 2. 联合索引的列顺序

```sql
-- 原则：高选择性列放前面，等值查询列放范围查询前
-- 假设查询模式：WHERE status = 'active' AND created_at > '2024-01-01'

-- ✅ 推荐
CREATE INDEX idx_status_created ON orders(status, created_at);

-- 原因：status 是等值条件，可以精确定位
-- 然后在 status 的范围内按 created_at 排序筛选
```

### 3. 避免索引失效

```sql
-- ❌ 对索引列使用函数
WHERE YEAR(created_at) = 2024
-- ✅ 改写为范围查询
WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01'

-- ❌ 隐式类型转换
WHERE phone = 13800138000  -- phone 是 VARCHAR
-- ✅ 使用正确的类型
WHERE phone = '13800138000'

-- ❌ 前导通配符
WHERE name LIKE '%test%'
-- ✅ 后缀通配符可以用索引
WHERE name LIKE 'test%'

-- ❌ OR 条件（除非所有列都有索引）
WHERE a = 1 OR b = 2
-- ✅ 改用 UNION
SELECT * FROM t WHERE a = 1
UNION
SELECT * FROM t WHERE b = 2
```

## EXPLAIN：索引诊断利器

```sql
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
```

```
+----+-------------+-------+------+---------------+-----------+---------+-------+------+-------+
| id | select_type | table | type | possible_keys | key       | key_len | ref   | rows | Extra |
+----+-------------+-------+------+---------------+-----------+---------+-------+------+-------+
|  1 | SIMPLE      | users | ref  | idx_email     | idx_email | 303     | const |    1 |       |
+----+-------------+-------+------+---------------+-----------+---------+-------+------+-------+
```

### type 列详解

| type | 说明 | 性能 |
|------|------|------|
| system | 表只有一行 | 最优 |
| const | 主键/唯一索引等值查询 | 极好 |
| eq_ref | 关联查询主键/唯一索引 | 很好 |
| ref | 非唯一索引等值查询 | 好 |
| range | 索引范围扫描 | 较好 |
| index | 全索引扫描 | 一般 |
| ALL | 全表扫描 | 差 |

### Extra 列重点

```
Using index      → 覆盖索引，无需回表 ✅
Using where      → 服务层过滤 ⚠️
Using filesort   → 额外排序，需优化 ❌
Using temporary  → 使用临时表，需优化 ❌
```

## 实战优化案例

### 案例 1：分页查询优化

```sql
-- ❌ 深度分页性能差
SELECT * FROM orders ORDER BY id LIMIT 1000000, 20;
-- 需要扫描 1000020 行

-- ✅ 使用游标分页
SELECT * FROM orders WHERE id > 1000000 ORDER BY id LIMIT 20;
-- 直接从 id=1000000 开始

-- ✅ 延迟关联
SELECT o.* FROM orders o
INNER JOIN (
  SELECT id FROM orders ORDER BY id LIMIT 1000000, 20
) AS t ON o.id = t.id;
```

### 案例 2：排序优化

```sql
-- 现有索引：idx_status_created(status, created_at)

-- ✅ 利用索引排序
SELECT * FROM orders 
WHERE status = 'pending' 
ORDER BY created_at DESC 
LIMIT 20;

-- ❌ 无法利用索引排序（Using filesort）
SELECT * FROM orders 
WHERE status IN ('pending', 'processing') 
ORDER BY created_at DESC;
```

### 案例 3：COUNT 优化

```sql
-- ❌ 全表扫描
SELECT COUNT(*) FROM users WHERE status = 'active';

-- ✅ 使用覆盖索引
CREATE INDEX idx_status ON users(status);
-- 现在 COUNT 只需扫描索引，不需要回表

-- ✅ 近似计数（大表）
SHOW TABLE STATUS LIKE 'users';  -- 查看 Rows 估算值

-- ✅ 缓存计数
-- 维护一个计数表，通过触发器更新
```

## 索引监控与维护

### 查看索引使用情况

```sql
-- 查看表的索引
SHOW INDEX FROM users;

-- 查看索引基数（Cardinality）
SELECT 
  INDEX_NAME,
  CARDINALITY,
  TABLE_ROWS
FROM information_schema.STATISTICS
WHERE TABLE_NAME = 'users';

-- 查找未使用的索引（需要开启 performance_schema）
SELECT * FROM sys.schema_unused_indexes;
```

### 索引维护

```sql
-- 分析表，更新索引统计信息
ANALYZE TABLE users;

-- 重建索引（解决索引碎片）
ALTER TABLE users ENGINE=InnoDB;

-- 或者
OPTIMIZE TABLE users;
```

## 总结

1. **理解 B+ 树** - 索引的核心数据结构
2. **选择正确的索引类型** - 主键、二级、联合、覆盖
3. **遵循设计原则** - 高选择性、最左前缀、避免失效
4. **善用 EXPLAIN** - 诊断查询性能
5. **持续监控优化** - 索引不是一劳永逸的

记住：**索引不是越多越好**。每个索引都有维护成本，在写入密集的场景要权衡利弊。

