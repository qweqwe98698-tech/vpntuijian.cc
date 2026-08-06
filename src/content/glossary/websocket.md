---
term: "WebSocket"
aliases: ["WS", "ws 传输"]
definition: "WebSocket 是一种在单条 HTTP 连接上建立全双工长连接的协议,代理场景中常被用作承载数据的传输层,以便伪装成普通网页流量并穿过 CDN。"
category: "协议"
seoDescription: "WebSocket 在一条 HTTP 连接上建立全双工长连接,代理借它伪装成普通网页访问并藏在 CDN 之后。ws-path 与 Host 必须和服务端一致,写错会出现能测出延迟却传不了数据的现象。"
publishedAt: 2026-08-05
updatedAt: 2026-08-05
related: ["glossary/tls", "glossary/vless", "glossary/node"]
---

WebSocket 最初是为网页实时通信设计的:浏览器先发一个带 `Upgrade: websocket` 头的普通 HTTP 请求,服务端同意后,这条连接就从"一问一答"升级为双向随时收发的长连接,聊天室、行情推送、在线协作都依赖它。

## 为什么代理要用它

代理软件看中的是它的"外形"。WebSocket 的握手是标准 HTTP 请求,带有正常的 Host 头和路径(节点参数里的 `ws-path`,例如 `/ray`),再叠加 [TLS](/glossary/tls/) 之后,链路上看到的就是一次再普通不过的 HTTPS 网页访问。更关键的是,主流 CDN 普遍支持 WebSocket 反向代理,于是节点可以隐藏在 CDN 背后:外界只看到 CDN 的 IP,源站地址不直接暴露,IP 被单独封锁的成本也随之提高。

在机场提供的配置里,你会看到 `network: ws` 搭配 `ws-path` 与 `ws-headers.Host` 三件套,它们必须与服务端完全一致,少一个斜杠或写错 Host 都会导致握手失败——表现往往是[节点](/glossary/node/)能测出延迟却无法真正传输数据。

## 代价与误解

WebSocket 会引入额外的封装开销和一次 HTTP 握手往返,再经过 CDN 中转后路径变长,延迟通常高于直连的 TCP 或 gRPC 传输,高带宽下载场景尤其明显。常见误解有两个:一是以为 ws 本身提供加密,实际上不加 TLS 的裸 ws 是明文;二是以为套上 CDN 就无法被追踪,事实上流量特征、连接时序等信息依然存在,只是识别难度上升而非归零。
