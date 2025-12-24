---
title: 'HTTP 协议要点速查'
pubDate: "2025-12-23T09:00:00.000Z"
tags: ["http", "network", "web", "protocol"]
template: "blackWhite"
---

```json
{
  "title": "HTTP 协议要点速查",
  "description": "HTTP 协议核心知识点速查表，涵盖请求方法、状态码、头部字段、缓存机制、HTTPS 等关键内容，与 TCP/IP 协议形成完整的网络知识体系。",
  "keyPoints": [
    "请求方法: GET(幂等) POST(非幂等) PUT DELETE PATCH",
    "2xx 成功: 200 OK, 201 Created, 204 No Content",
    "3xx 重定向: 301 永久, 302 临时, 304 缓存命中",
    "4xx 客户端错误: 400 Bad Request, 401 未授权, 403 禁止, 404 未找到",
    "5xx 服务端错误: 500 内部错误, 502 网关错误, 503 服务不可用",
    "缓存: Cache-Control, ETag, Last-Modified, If-None-Match",
    "HTTP/2: 多路复用, 头部压缩, 服务端推送, 二进制分帧"
  ],
  "references": [
    "https://developer.mozilla.org/zh-CN/docs/Web/HTTP",
    "https://http.cat/"
  ],
  "tools": [],
  "mermaidMarkdown": "sequenceDiagram\n    participant C as Client\n    participant S as Server\n    C->>S: HTTP Request (Method + URL + Headers + Body)\n    S->>C: HTTP Response (Status + Headers + Body)\n    Note over C,S: HTTP/1.1: 持久连接\n    Note over C,S: HTTP/2: 多路复用\n    Note over C,S: HTTP/3: 基于 QUIC",
  "url": ""
}
```

