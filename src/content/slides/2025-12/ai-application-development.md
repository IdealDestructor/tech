---
title: "AI 应用开发实践指南"
author: "foxgem"
description: "从零开始构建 AI 应用，涵盖 LLM API 调用、Prompt Engineering、RAG 实现、Agent 开发等核心内容。"
pubDate: 2025-12-25
tags: ["ai", "llm", "langchain", "rag", "agent"]
theme: "dracula"
transition: "slide"
controls: true
progress: true
---

## AI 应用开发实践指南

构建下一代智能应用

---

## AI 应用开发全景图

```
┌─────────────────────────────────────────┐
│              AI 应用层                  │
├─────────────┬─────────────┬─────────────┤
│   聊天机器人 │  知识问答   │   AI Agent  │
├─────────────┴─────────────┴─────────────┤
│              开发框架层                  │
│     LangChain  |  LlamaIndex  |  DIY    │
├─────────────────────────────────────────┤
│              基础能力层                  │
│   LLM API  |  Embedding  |  向量数据库   │
└─────────────────────────────────────────┘
```

---

## LLM API 调用

```python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "你是一个专业的技术顾问"},
        {"role": "user", "content": "解释什么是 RAG？"}
    ],
    temperature=0.7,
    max_tokens=1000
)

print(response.choices[0].message.content)
```

---

## 核心参数调优

| 参数 | 作用 | 推荐值 |
|-----|------|-------|
| temperature | 随机性 | 0-0.3: 精确任务 |
| max_tokens | 输出长度 | 按需设置 |
| top_p | 采样范围 | 0.9-1.0 |
| frequency_penalty | 避免重复 | 0-0.5 |

---

## Prompt 设计原则

```markdown
1. 角色设定 (Role)
   "你是一个资深的后端工程师..."

2. 任务说明 (Task)
   "请帮我分析以下代码的性能问题..."

3. 格式要求 (Format)
   "以 Markdown 表格形式输出..."

4. 示例参考 (Examples)
   "示例输入: ... 示例输出: ..."

5. 约束条件 (Constraints)
   "回答不超过 500 字..."
```

---

## RAG 架构

```
┌─────────────────────────────────────────┐
│                 Query                    │
│           "什么是微服务？"                │
└────────────────┬────────────────────────┘
                 ↓
┌────────────────────────────────────────┐
│           Embedding Model              │
│         (文本向量化)                    │
└────────────────┬───────────────────────┘
                 ↓
┌────────────────────────────────────────┐
│           Vector Database              │
│    (相似度检索 → Top-K 文档)            │
└────────────────┬───────────────────────┘
                 ↓
┌────────────────────────────────────────┐
│            LLM Generation              │
│   (基于检索内容 + 问题生成答案)          │
└────────────────────────────────────────┘
```

---

## RAG 实现 (LangChain)

```python
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI

# 1. 创建向量存储
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_documents(docs, embeddings)

# 2. 创建 QA Chain
qa_chain = RetrievalQA.from_chain_type(
    llm=OpenAI(),
    retriever=vectorstore.as_retriever()
)

# 3. 查询
result = qa_chain.run("什么是微服务架构？")
```

---

## 文档处理最佳实践

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,      # 块大小
    chunk_overlap=200,    # 重叠区域
    separators=["\n\n", "\n", "。", "，"]
)

chunks = splitter.split_documents(documents)
```

**要点**:
- 保持语义完整 <!-- .element: class="fragment" -->
- 适当重叠避免信息丢失 <!-- .element: class="fragment" -->
- 按语言特点选择分隔符 <!-- .element: class="fragment" -->

---

## AI Agent 架构

```
┌─────────────────────────────────────────┐
│              用户输入                    │
└────────────────┬────────────────────────┘
                 ↓
┌────────────────────────────────────────┐
│           Agent (LLM)                  │
│    思考 → 选择工具 → 执行 → 观察        │
└────────────────┬───────────────────────┘
                 ↓
┌─────────┬──────┴──────┬─────────┐
│ 搜索工具 │ 计算工具    │ 代码工具 │
└─────────┴─────────────┴─────────┘
```

---

## Agent 实现

```python
from langchain.agents import initialize_agent, Tool
from langchain.tools import DuckDuckGoSearchRun

# 定义工具
tools = [
    Tool(
        name="Search",
        func=DuckDuckGoSearchRun().run,
        description="搜索互联网获取最新信息"
    ),
    Tool(
        name="Calculator",
        func=lambda x: eval(x),
        description="执行数学计算"
    )
]

# 创建 Agent
agent = initialize_agent(
    tools, llm, 
    agent="zero-shot-react-description"
)

agent.run("北京今天天气怎么样？")
```

---

## ReAct 模式

```
Thought: 我需要查询北京的天气
Action: Search
Action Input: 北京今天天气
Observation: 北京今天晴，气温 15-25℃
Thought: 我已经获得了天气信息
Final Answer: 北京今天天气晴朗，气温 15-25℃
```

**循环**: 思考 → 行动 → 观察 → ...

---

## 流式输出

```python
from openai import OpenAI

client = OpenAI()

stream = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "讲个故事"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

**用户体验提升**: 即时反馈，无需等待

---

## 常见优化策略

| 问题 | 解决方案 |
|-----|---------|
| 响应慢 | 流式输出、缓存 |
| 成本高 | 小模型兜底、缓存 |
| 幻觉 | RAG、Prompt 约束 |
| 上下文长度 | 摘要、压缩 |

---

## 生产环境考量

- **安全**: Prompt 注入防护 <!-- .element: class="fragment" -->
- **成本**: Token 监控和限制 <!-- .element: class="fragment" -->
- **可靠性**: 重试机制、降级策略 <!-- .element: class="fragment" -->
- **可观测**: 日志、指标、追踪 <!-- .element: class="fragment" -->

---

## 开发框架选择

| 框架 | 特点 | 适用场景 |
|-----|------|---------|
| LangChain | 生态丰富 | 通用 AI 应用 |
| LlamaIndex | 专注 RAG | 知识库应用 |
| Semantic Kernel | 微软出品 | .NET 生态 |
| DIY | 完全控制 | 简单场景 |

---

## 技术栈推荐

```
前端: Next.js + Vercel AI SDK
后端: Python + FastAPI
LLM: OpenAI / Claude / 本地模型
向量库: Pinecone / Chroma / Milvus
框架: LangChain / LlamaIndex
```

---

## 学习路径

```
1. 掌握 LLM API 调用
    ↓
2. 学习 Prompt Engineering
    ↓
3. 实现 RAG 应用
    ↓
4. 构建 AI Agent
    ↓
5. 生产环境部署优化
```

---

## 总结

1. **API First** - 先熟悉 LLM API
2. **Prompt 是关键** - 好的 Prompt 事半功倍
3. **RAG 增强准确性** - 减少幻觉，接入私有数据
4. **Agent 扩展能力** - 工具调用实现复杂任务
5. **重视工程化** - 安全、成本、可观测

---

## 参考资源

- [LangChain 文档](https://python.langchain.com/)
- [OpenAI Cookbook](https://cookbook.openai.com/)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [LlamaIndex 文档](https://docs.llamaindex.ai/)

