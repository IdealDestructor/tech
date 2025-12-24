---
title: 'RAG 技术要点速查'
pubDate: "2025-12-25T10:00:00.000Z"
tags: ["ai", "rag", "llm", "vector-database"]
template: "blackWhite"
---

```json
{
  "title": "RAG 技术要点速查",
  "description": "检索增强生成（RAG）技术核心要点速查表，涵盖架构流程、向量检索、文档处理等关键知识点，帮助理解 LLM 应用开发。",
  "keyPoints": [
    "RAG = Retrieval + Augmented + Generation，检索增强生成",
    "流程: 用户问题 → 向量化 → 相似度检索 → 上下文增强 → LLM 生成",
    "Embedding: 将文本转为高维向量，常用 text-embedding-ada-002",
    "向量数据库: Pinecone, Milvus, Chroma, Faiss, Weaviate",
    "文档切分: 按段落/句子切分，保持语义完整，适当重叠",
    "检索策略: 相似度检索, 混合检索(关键词+向量), 重排序",
    "Prompt模板: 将检索结果注入 Prompt 作为上下文参考"
  ],
  "references": [
    "https://www.pinecone.io/learn/retrieval-augmented-generation/",
    "https://python.langchain.com/docs/use_cases/question_answering/"
  ],
  "tools": ["LangChain", "LlamaIndex", "Pinecone", "Chroma"],
  "mermaidMarkdown": "flowchart TB\n    A[用户问题] --> B[Embedding 模型]\n    B --> C[向量化查询]\n    C --> D[向量数据库检索]\n    D --> E[相关文档片段]\n    E --> F[Prompt 组装]\n    A --> F\n    F --> G[LLM 生成]\n    G --> H[答案输出]\n    subgraph 离线索引\n    I[文档] --> J[切分]\n    J --> K[Embedding]\n    K --> L[存入向量库]\n    end",
  "url": ""
}
```

