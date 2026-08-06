---
title: "Shadowsocks、Trojan 与 VLESS 的区别"
description: "Shadowsocks、Trojan 与 VLESS 的区别:一个加密成无特征噪声,一个伪装成真实 HTTPS,一个只做薄框架靠外层 TLS 兜底。速度差距主要来自线路而非协议。"
publishedAt: 2026-08-04
updatedAt: 2026-08-04
author: mai-heng
reviewer: lin-shu
category: "线路与协议"
subcategory: "代理协议"
tags: ["Shadowsocks", "Trojan", "VLESS", "协议对比"]
searchIntent: informational
audience: beginner
difficulty: medium
summary: "三者代表三种隐蔽思路:Shadowsocks 把流量加密成无特征的随机数据,轻量高效;Trojan 把代理流量伪装成真实的 HTTPS 访问,混在正常网页流量里;VLESS 本身只是轻量传输框架,须搭配 TLS 或 REALITY 等外层方案,灵活性最强。日常使用三者体验接近,机场给什么用什么即可,无需刻意追新。"
keyTakeaways:
  - "Shadowsocks 思路是「看起来像随机噪声」,Trojan 与 VLESS+TLS 思路是「看起来像正常 HTTPS」"
  - "Trojan 强制走 443 端口的 TLS,伪装成网站访问,特征上最接近普通流量"
  - "VLESS 自身不加密,安全性由外层的 TLS/REALITY 提供,组合灵活但配置复杂"
  - "三者速度差异主要来自服务器与线路质量,协议本身的开销差距很小"
  - "普通用户无需自行选协议,客户端按订阅自动处理,连不上时换协议是排查手段之一"
featured: false
related:
  - "protocols/hysteria2-explained"
  - "clients/v2rayn-windows-guide"
  - "clients/clash-subscription-import"
  - "troubleshooting/partial-nodes-fail"
faq:
  - q: "哪个协议速度最快?"
    a: "同一台服务器、同一条线路下,三者吞吐差距很小,速度瓶颈几乎总在线路而非协议。感觉某协议更快,通常是因为机场把它部署在了更好的节点上。"
  - q: "Shadowsocks 是不是已经过时了?"
    a: "没有。现代 Shadowsocks(如 2022 版加密)修补了早期缺陷,凭借轻量和全平台兼容仍被大量机场用作主力协议,是否好用取决于具体实现与线路。"
  - q: "订阅里同一节点有多个协议版本,选哪个?"
    a: "优先用默认推荐的那个;某协议连不稳时切换另一协议对比,往往能定位是协议受扰还是线路故障。"
dataStatus: verified
---

## 三个协议各是什么

[Shadowsocks](/glossary/shadowsocks/) 是一个轻量加密代理协议,把流量变成一段没有可辨识特征的随机数据流。[Trojan](/glossary/trojan/) 是一个「伪装型」协议,让代理流量在外观上与访问普通 HTTPS 网站完全一致。[VLESS](/glossary/vless/) 则是一个极简的传输框架:它自己几乎什么都不做,把加密与伪装交给外层组件,换来最大的组合自由度。

三者要解决的是同一个问题——让代理流量在中间网络设备眼里不可识别——但走了两条不同的路:Shadowsocks 选择「隐身」,Trojan 和 VLESS+TLS 选择「化装」。

## 它们各自怎么工作

**Shadowsocks:加密成噪声。** 客户端与服务器共享一个密码,所有数据用对称加密处理后传输。加密后的字节流没有协议头、没有握手特征,理想状态下就像一段无意义的随机数据。它的优点是实现简单、性能开销小、客户端支持无处不在;弱点是「一段完全随机的长连接」本身也可能成为一种统计特征,早期版本曾因此被针对,现代实现(AEAD、2022 版加密)已大幅改进。

**Trojan:混进人群。** 与其让流量「看不懂」,不如让它「看起来很正常」。Trojan 服务器监听 443 端口并持有真实证书,流量走标准 TLS:中间设备看到的是一次寻常的 HTTPS 会话;只有携带正确密码的连接被当作代理处理,其余访问会看到一个真实网站。化装的代价是必须配备域名和证书,服务器部署门槛比 Shadowsocks 高。

**VLESS:只做骨架。** VLESS 诞生于 V2Ray 生态,设计哲学是把协议做到最薄——只负责用户校验和数据转发,本身不含加密。安全性完全依赖外层:套 TLS 时与 Trojan 思路相同;搭配 REALITY 时甚至可以「借用」他人网站的证书特征,免去自备域名。薄框架带来低开销和高扩展性(支持 XTLS 等流控优化),也意味着「VLESS 节点」的实际表现取决于外层组合,配置复杂度是三者中最高的。

## 关键区别一览

| 维度 | Shadowsocks | Trojan | VLESS |
| --- | --- | --- | --- |
| 隐蔽思路 | 加密成无特征噪声 | 伪装成真实 HTTPS | 取决于外层(TLS/REALITY) |
| 自带加密 | 有(对称加密) | 依赖 TLS | 无,必须依赖外层 |
| 需要域名证书 | 不需要 | 需要 | 视外层方案而定 |
| 协议开销 | 很低 | 低(TLS 握手成本) | 极低 |
| 部署复杂度 | 低 | 中 | 中到高 |
| 客户端兼容性 | 几乎全部客户端 | 主流客户端均支持 | 需较新内核 |

## 什么场景用什么

对普通用户,协议由[机场](/glossary/airport/)决定、由订阅自动下发,真正的选择场景只有两个。一是**客户端兼容性**:老设备或小众客户端可能只认 Shadowsocks,而 VLESS+REALITY 这类新组合需要较新的内核,[v2rayN](/clients/v2rayn-windows-guide/) 和 sing-box 支持最全。二是**故障排查**:同一节点提供多协议入口时,某个协议突然大面积连不上、换协议即恢复,基本可以判定是协议特征被干扰而非节点宕机,类似情形的处理见[部分节点失效排查](/troubleshooting/partial-nodes-fail/)。

从机场侧看:追求低成本大规模部署用 Shadowsocks;愿意为每台服务器配域名证书、追求流量形态自然的用 Trojan;想要极限性能与前沿抗干扰能力的用 VLESS 系组合。三者长期共存,不存在谁淘汰谁。

## 选择时的常见误区

**「新协议一定更好」**——VLESS 比 Shadowsocks 新,但「新」意味着框架更灵活,不等于连接更稳。稳定性八成取决于线路与服务器质量,协议只占小头,线路层面的差异可参考[直连、中转与专线的对比](/protocols/direct-relay-dedicated-lines/)。

**「VLESS 不加密所以不安全」**——VLESS 从不裸奔,实际部署必然套 TLS 或 REALITY,传输安全性与 Trojan 同级。「无加密」指的是协议层不重复加密,反而省掉了双重加密的浪费。

**「Trojan 和木马病毒有关」**——只是命名借用了「特洛伊木马」的伪装意象,协议本身与恶意软件毫无关系。

**「换协议能提速」**——同线路下三者吞吐差距很小。想要显著提速,换节点、换线路档位,或了解走 UDP 路线的 [Hysteria 2](/protocols/hysteria2-explained/) 更实际。
