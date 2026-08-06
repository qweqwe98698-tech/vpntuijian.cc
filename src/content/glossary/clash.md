---
term: "Clash"
aliases: ["Clash Meta", "mihomo", "Clash Verge"]
definition: "Clash 是一类以规则分流为核心的代理客户端内核,支持多协议与订阅导入,衍生出 Clash Verge、mihomo 等多个图形界面和内核分支。"
category: "客户端"
seoDescription: "Clash 是以规则分流为核心的一族客户端内核。原版已于 2023 年停更,现在主流是 mihomo 内核配 Clash Verge 等界面。它只是客户端、本身不提供节点,订阅也只是一种 YAML 配置格式。"
publishedAt: 2026-08-04
updatedAt: 2026-08-04
related: ["glossary/rule-based-routing", "glossary/subscription-link", "glossary/tun-mode"]
---

Clash 最初是一个开源代理内核,以 YAML 配置和强大的规则分流能力著称:用户导入[订阅链接](/glossary/subscription-link/)后,可以按域名、IP、地理位置等条件决定哪些流量走代理、走哪个节点、哪些直连。这套"策略组 + 规则"的模型影响深远,如今已成为中文用户配置代理的事实标准之一。

需要理清它的生态现状:原版 Clash 及其内核分支 Clash Premium 已于 2023 年停止开发并删库,目前社区主流是继承者 mihomo(原 Clash.Meta)内核,支持 VLESS、Hysteria 2 等新协议;图形界面方面,桌面端常见 Clash Verge(及其衍生版),移动端有 Clash Meta for Android 等。日常说"用 Clash",多半指这一族客户端,而非某个单一软件。

常见误解:一是把 Clash 当作代理服务本身——它只是客户端,不提供节点,必须搭配机场或自建服务端使用;二是认为"Clash 订阅"是一种特殊服务——它只是订阅内容采用 Clash 的 YAML 配置格式;三是混淆内核与界面,报告问题时说明具体使用的界面和内核版本,更容易获得有效帮助。
