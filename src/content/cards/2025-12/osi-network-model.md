---
title: '计算机网络七层模型'
pubDate: "2025-12-02T11:00:00.000Z"
tags: ["network", "osi", "computer-science"]
template: "blackWhite"
---

```json
{
  "title": "计算机网络 OSI 七层模型",
  "description": "OSI（开放系统互联）参考模型将网络通信分为七层，每层负责特定功能。理解这个模型有助于诊断网络问题和理解协议设计。",
  "keyPoints": [
    "应用层 (L7): HTTP, FTP, DNS, SMTP - 用户接口",
    "表示层 (L6): 数据格式转换、加密解密、压缩",
    "会话层 (L5): 建立、维护、终止会话连接",
    "传输层 (L4): TCP/UDP - 端到端可靠传输",
    "网络层 (L3): IP, ICMP - 路由选择、逻辑寻址",
    "数据链路层 (L2): MAC 地址、帧传输、错误检测",
    "物理层 (L1): 比特流传输、电气特性、物理介质"
  ],
  "references": [
    "https://en.wikipedia.org/wiki/OSI_model"
  ],
  "tools": ["Wireshark", "tcpdump"],
  "mermaidMarkdown": "flowchart TB\n    subgraph 应用层\n    A7[应用层 L7<br/>HTTP/FTP/DNS]\n    end\n    subgraph 表示层\n    A6[表示层 L6<br/>加密/压缩]\n    end\n    subgraph 会话层\n    A5[会话层 L5<br/>会话管理]\n    end\n    subgraph 传输层\n    A4[传输层 L4<br/>TCP/UDP]\n    end\n    subgraph 网络层\n    A3[网络层 L3<br/>IP/路由]\n    end\n    subgraph 数据链路层\n    A2[数据链路层 L2<br/>MAC/帧]\n    end\n    subgraph 物理层\n    A1[物理层 L1<br/>比特流]\n    end\n    A7 --> A6 --> A5 --> A4 --> A3 --> A2 --> A1",
  "url": ""
}
```

