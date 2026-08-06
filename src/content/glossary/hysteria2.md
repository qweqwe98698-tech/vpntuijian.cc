---
term: "Hysteria 2"
aliases: ["Hysteria2", "hy2"]
definition: "Hysteria 2 是基于 QUIC(UDP)的代理协议,通过激进的拥塞控制在高丢包线路上维持吞吐,常用于跨境网络的弱网提速。"
category: "协议"
seoDescription: "Hysteria 2 基于 QUIC 走 UDP,用激进的拥塞控制在高丢包线路上顶住吞吐,弱网提速效果明显;代价是重传与填充会多扣流量,公司网、校园网屏蔽 UDP 时完全不可用,稳定专线上优势有限。"
publishedAt: 2026-08-04
updatedAt: 2026-08-04
related: ["glossary/vless", "glossary/shadowsocks", "glossary/node"]
---

Hysteria 2(常简写为 hy2)是构建在 QUIC 之上的代理协议,底层走 UDP,流量表现类似 HTTP/3。它的招牌能力是对抗丢包:传统 TCP 协议遇到丢包会大幅降速,而 Hysteria 2 使用可自定义带宽的拥塞控制策略,在跨境公网这类高丢包链路上仍能把带宽"顶"上去,因此在晚高峰直连场景下常有明显的速度优势。

使用语境上,hy2 节点在机场中越来越常见,客户端方面 sing-box、Clash.Meta 内核及部分移动端应用已支持。需要注意两类环境限制:一是部分网络(如公司、校园网)会限制或阻断 UDP 流量,导致 hy2 完全不可用,此时需要回退到 TCP 系协议;二是运营商对持续高速的 UDP 流量可能进行 QoS 限速。

常见误解:一是把 hy2 当作万能提速器——它改善的是丢包环境下的吞吐,在本就稳定的专线上优势有限;二是忽视其代价——激进的重传和填充会消耗更多实际流量,在按量计费的套餐下,同样的下载量可能扣除更多流量;三是认为 UDP 协议不可靠——QUIC 自带可靠传输与 TLS 1.3 加密,可靠性和安全性并不逊于 TCP 方案。
