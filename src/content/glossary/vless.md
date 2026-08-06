---
term: "VLESS"
aliases: ["VLESS 协议"]
definition: "VLESS 是 V2Ray/Xray 生态中的轻量传输协议,本身不含加密,依赖 TLS 等外层加密,常与 REALITY、XTLS 等技术组合使用。"
category: "协议"
seoDescription: "VLESS 只做 UUID 认证与转发,自身不加密而依赖外层 TLS,因此常以 VLESS 加 WebSocket、XTLS Vision 或 REALITY 的组合出现,表现取决于所配传输层,线路差时换协议改善有限。"
publishedAt: 2026-08-04
updatedAt: 2026-08-04
related: ["glossary/trojan", "glossary/hysteria2", "glossary/shadowsocks"]
---

VLESS 是 V2Ray 项目提出、现由 Xray 生态主要维护的代理协议,可以看作 VMess 的精简继任者:去掉了 VMess 内置的加密和时间校验等冗余设计,协议本身只负责认证(UUID)和转发,加密完全交给外层的 TLS。这种"轻内核 + 外层加密"的分层带来了更低的开销和更灵活的组合方式。

实际部署中,VLESS 很少单独出现,常见组合包括 VLESS + TLS + WebSocket(便于套 CDN)、VLESS + XTLS Vision(减少双重加密开销)以及 VLESS + REALITY(借用真实网站的 TLS 指纹,无需自有证书)。机场节点列表里的"VLESS"通常指这些组合中的一种,具体表现取决于所配的传输层,而不只是协议名。

常见误解:一是"VLESS 不加密所以不安全"——它设计上就要求配合 TLS 使用,正确部署时链路加密强度与 [Trojan](/glossary/trojan/) 相当,裸 VLESS 只应出现在内部链路;二是认为 VLESS 一定优于旧协议——它的优势在于低开销和 REALITY 等新特性,若线路本身质量差,换协议并不能带来实质改善。
