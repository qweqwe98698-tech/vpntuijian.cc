---
title: "Hysteria 2 是什么:原理、优势与适用场景"
description: "Hysteria 2 是什么:基于 QUIC/UDP,用激进拥塞控制替代 TCP 一丢包就退让,高丢包链路上提速明显。代价是怕运营商 UDP 限速,流量开销也偏高。"
publishedAt: 2026-08-04
updatedAt: 2026-08-04
author: mai-heng
reviewer: lin-shu
category: "线路与协议"
subcategory: "代理协议"
tags: ["Hysteria 2", "QUIC", "UDP", "协议原理"]
searchIntent: informational
audience: intermediate
difficulty: medium
summary: "Hysteria 2 是基于 QUIC(UDP)的代理协议,用激进的拥塞控制策略替代 TCP 的保守退让:遇到丢包不大幅降速,而是按设定带宽持续发送。这让它在跨境公网这类高丢包链路上速度优势明显,尤其适合直连线路;代价是对 UDP 的依赖——运营商对 UDP 限速(QoS)时表现会急剧下降,因此它是补充选项而非万能答案。"
keyTakeaways:
  - "Hysteria 2 跑在 QUIC/UDP 上,伪装成 HTTP/3 流量,与 TCP 系协议路线完全不同"
  - "核心优势来自激进拥塞控制:高丢包链路上不像 TCP 那样一丢包就大幅降速"
  - "在拥堵的跨境直连线路上提速最明显,专线本身丢包低,提升有限"
  - "最大短板是怕 UDP QoS:运营商对 UDP 限速时可能比 TCP 协议更慢"
  - "客户端需较新内核,sing-box、v2rayN 及 Clash Meta 系均已支持"
featured: false
related:
  - "protocols/ss-trojan-vless-differences"
  - "protocols/direct-relay-dedicated-lines"
  - "clients/sing-box-getting-started"
  - "troubleshooting/wifi-ok-cellular-fails"
faq:
  - q: "Hysteria 2 一定比 Shadowsocks、Trojan 快吗?"
    a: "不一定。在高丢包的拥堵公网链路上它优势明显;但线路本身干净(如专线)时差距很小,而遇到运营商 UDP 限速时它反而可能更慢。"
  - q: "为什么 Hysteria 2 节点白天快、晚上突然很慢?"
    a: "典型的 UDP QoS 现象:晚高峰运营商优先保障 TCP,对大流量 UDP 会话降级限速。此时切换到同机场的 TCP 系节点(Trojan、VLESS)对比即可确认。"
  - q: "用 Hysteria 2 会更费流量吗?"
    a: "会略多一些。其拥塞控制在丢包时坚持重发,加上 QUIC 本身的开销,实际消耗通常比 TCP 系协议高几个百分点,对流量紧张的套餐需要留意。"
dataStatus: verified
---

## Hysteria 2 是什么

[Hysteria 2](/glossary/hysteria2/) 是一个构建在 QUIC(基于 UDP 的现代传输层)之上的代理协议,主打一件事:在丢包严重、质量糟糕的网络链路上,依然把带宽跑满。

## 它为什么快:从 TCP 的「礼貌」说起

要理解 Hysteria 2,先看传统协议慢在哪。[Shadowsocks](/glossary/shadowsocks/)、Trojan、VLESS 都跑在 TCP 上,而 TCP 的拥塞控制天生「礼貌」:一旦检测到丢包,就认为网络拥堵,主动大幅降低发送速度,再慢慢试探着恢复。这套机制在正常网络里维持了公平,但跨境公网出口的丢包很多时候并非真拥堵,而是链路质量差或设备随机丢弃——TCP 无法分辨,照样一丢包就急刹车,结果是明明还有带宽,速度却上不去。

Hysteria 2 的回答是换掉整套逻辑:跑在 QUIC/UDP 上,采用激进的拥塞控制策略(源自暴力发包思路的工程化版本),按照配置或探测出的带宽持续发送,丢了就快速重传,不做大幅退让。打个比方:TCP 像守规矩的司机,前方稍有刹车灯就减速;Hysteria 2 像开着导航知道前方其实没堵车的司机,保持车速穿过虚假的「拥堵路段」。

除了拥塞控制,它还有两个设计加分项:外观上模拟 HTTP/3 流量并要求正确认证才响应,降低被识别的概率;QUIC 的 0-RTT 特性让连接建立更快,弱网切换(如 Wi-Fi 换蜂窝)时恢复也更利索。

## 与 TCP 系协议的关键差异

| 维度 | Hysteria 2 | Shadowsocks / Trojan / VLESS |
| --- | --- | --- |
| 传输层 | QUIC(UDP) | TCP |
| 拥塞控制 | 激进,丢包不大幅降速 | 保守,丢包即退让 |
| 高丢包链路表现 | 优势显著 | 速度明显受压 |
| 遇 UDP QoS 时 | 可能急剧劣化 | 不受影响 |
| 流量开销 | 略高(坚持重传) | 较低 |
| 客户端要求 | 需较新内核 | 几乎全部客户端 |
| 对线路公平性 | 挤占共享带宽,对他人不友好 | 与其他流量公平竞争 |

最后一行值得多说一句:激进发包的本质是在拥堵链路上「抢」带宽,同一条线路上 Hysteria 2 用户越多,互相挤占越严重。这也是部分机场只在特定节点开放它的原因。

## 什么场景适合,什么场景不适合

**适合**:走公网出口的直连或普通中转线路,晚高峰丢包高,此时提速立竿见影;移动网络、酒店 Wi-Fi 等弱网环境;大文件下载、高码率流媒体这类吞吐优先的任务。线路类型的背景知识见[直连、中转与专线怎么选](/protocols/direct-relay-dedicated-lines/)。

**不合适或收益小**:本身低丢包的 IEPL/IPLC 专线,TCP 已能跑满,换协议意义不大;运营商 UDP QoS 严格的网络——症状是速度周期性断崖式波动,或 Wi-Fi 正常而蜂窝网络异常(后者也可能是权限问题,先按[蜂窝网络故障排查](/troubleshooting/wifi-ok-cellular-fails/)排除);流量倍率高、余量紧张的套餐,因为它的重传开销会放大消耗。

客户端方面,sing-box 对 Hysteria 2 支持最早最完整,入门配置见 [sing-box 上手教程](/clients/sing-box-getting-started/);v2rayN 与 Clash Meta 系内核也已支持,老旧客户端则无法使用。

## 关于 Hysteria 2 的几个误传

**「Hysteria 2 是最强协议,应该只用它」**——它是针对高丢包场景的特化方案,不是全面上位替代。理性的用法是与 TCP 系节点并存,按网络状况切换。

**「UDP 协议不安全」**——传输层与安全性无关。Hysteria 2 全程走 QUIC 内建的 TLS 1.3 加密,安全强度与 TCP+TLS 方案同级。

**「快就说明机场线路好」**——恰恰相反,Hysteria 2 的提速幅度越夸张,越说明底层线路丢包严重。评估[机场](/glossary/airport/)质量时,应看它 TCP 协议节点的表现,协议层面的横向背景可回看 [Shadowsocks、Trojan 与 VLESS 的区别](/protocols/ss-trojan-vless-differences/)。
