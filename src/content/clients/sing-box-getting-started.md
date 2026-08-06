---
title: "sing-box 入门:安装、订阅与常用配置"
description: "sing-box 入门:桌面与手机四端通用,以 Remote 类型导入 sing-box 格式订阅,默认 TUN 模式接管流量、无需再开系统代理。Clash 订阅不能直接套用。"
publishedAt: 2026-08-04
updatedAt: 2026-08-04
author: mai-heng
reviewer: lin-shu
category: "客户端教程"
subcategory: "sing-box 系列"
tags: ["sing-box", "TUN 模式", "订阅导入", "全平台"]
searchIntent: informational
audience: intermediate
difficulty: medium
summary: "sing-box 是新一代全平台代理内核,官方图形客户端在桌面端从 GitHub Releases 获取,iOS 从 App Store 安装。使用时在 Profiles 页以 Remote 类型添加机场的 sing-box 订阅地址,回到 Dashboard 启动即可;它默认以 TUN 模式接管全部流量,规则分流写在配置文件内,对 Hysteria 2 等新协议支持最完整。"
keyTakeaways:
  - "sing-box 官方客户端桌面端见 GitHub Releases,iOS 版在 App Store,来源只有这两处"
  - "订阅需选 Remote(远程)类型导入,且必须是 sing-box 格式,Clash 订阅不能直接用"
  - "sing-box 默认用 TUN 模式接管全局流量,无需再设置系统代理"
  - "分流规则由订阅配置内的 route 段决定,机场配置通常已内置国内直连规则"
  - "启动失败多为配置格式版本不匹配,优先让机场提供适配当前版本的订阅"
featured: false
related:
  - "clients/clash-subscription-import"
  - "clients/shadowrocket-subscription-import"
  - "protocols/hysteria2-explained"
  - "troubleshooting/dns-resolution-failure"
faq:
  - q: "机场只提供 Clash 订阅,能在 sing-box 里用吗?"
    a: "不能直接用。sing-box 使用自己的 JSON 配置格式,需要机场提供 sing-box 订阅地址;部分机场面板的订阅转换功能可以输出 sing-box 格式,优先询问机场客服。"
  - q: "sing-box 和 Clash、v2rayN 是什么关系?"
    a: "它们都是代理客户端,但 sing-box 是更新的内核,协议支持最全,Hysteria 2、TUIC 等新协议往往第一时间可用;代价是配置格式变化较快,新手容易遇到版本不兼容。"
  - q: "启动时报配置解析错误怎么办?"
    a: "多数是订阅配置的字段与当前客户端版本不匹配。先在 Profiles 页更新一次订阅,仍报错就联系机场确认其 sing-box 配置适配的版本号,必要时安装对应版本的客户端。"
dataStatus: verified
platforms: ["Windows", "macOS", "Android", "iOS"]
appVersion: "以 2026 年主流稳定版界面为准"
checkedAt: 2026-08-04
---

## sing-box 是什么,适合谁

sing-box 是近几年增长最快的代理内核,一套核心适配 Windows、macOS、Android、iOS 四个平台,对 [Hysteria 2](/glossary/hysteria2/)、TUIC 这类基于 QUIC 的新协议支持最早也最完整。如果你的[机场](/glossary/airport/)主推 Hysteria 2 节点,或者你希望手机和电脑用同一套配置逻辑,sing-box 是目前的最优解。它比 Clash 系客户端更「新」,但界面更精简、文档更偏开发者,本文帮你避开新手期的主要障碍,界面描述以 2026 年主流稳定版为准。

前置条件与其他客户端相同:一条有效的[订阅链接](/glossary/subscription-link/),且必须是 **sing-box 格式**——这是与 Clash 教程最大的差异点,两种格式互不通用,复制订阅时请在机场面板选对类型。

## 各平台的官方安装渠道

| 平台 | 官方渠道 | 说明 |
| --- | --- | --- |
| Windows | GitHub Releases(SFI 图形版) | 下载 `.msi` 或便携包,解压/安装即用 |
| macOS | GitHub Releases 或 App Store | App Store 版更新稍慢但免签名操作 |
| Android | GitHub Releases 或 Google Play | 选 `arm64-v8a` 的 `.apk` |
| iOS / iPadOS | App Store(需外区账号) | 唯一渠道,无任何第三方安装方式 |

和所有代理软件一样,搜索引擎里的「sing-box 官网下载站」基本都是仿冒,只认 GitHub 官方仓库(SagerNet 组织)与各应用商店的官方上架页。iOS 版需要外区 Apple ID,操作方式与 [Shadowrocket 的获取流程](/clients/shadowrocket-subscription-import/)相同。

## 导入订阅:四个平台一个套路

官方图形客户端在各平台的界面结构一致,都由 Dashboard(仪表盘)、Profiles(配置)、Settings(设置)几个页面组成,导入步骤如下:

1. 打开客户端,进入 **Profiles** 页面。
2. 点击「+」或「Create Profile」新建配置。
3. Name 填机场名称;**Type 选择 Remote**(远程),而不是 Local。
4. 在 URL 栏粘贴 sing-box 格式的订阅地址,保存。
5. 客户端会立刻拉取配置,列表出现新条目且无红色报错即导入成功。

Remote 类型的好处是支持自动更新,默认每隔一段时间重新拉取,机场调整[节点](/glossary/node/)后无需手动干预;也可以在配置条目上手动点击刷新图标立即更新。如果拉取失败,先用浏览器访问订阅地址确认返回的是一段 JSON 文本,再排查本机网络。

## 启动与模式:TUN 是默认项

回到 Dashboard 页面,选中刚导入的配置,点击启动按钮:

- **桌面端**首次启动会请求管理员权限,这是创建虚拟网卡所需,允许即可。
- **Android** 会弹出 VPN 连接请求,**iOS** 会请求添加 VPN 配置,都需要确认允许。

sing-box 与 Clash 的一个重要区别在这里:它默认以 [TUN 模式](/glossary/tun-mode/)工作,通过虚拟网卡接管系统全部流量,因此**不需要**再打开任何「系统代理」开关,对不读系统代理的软件也天然生效。

「接管全部流量」不等于「全部流量都出国」。走不走代理由配置里的 route(路由)段决定,机场提供的订阅通常已内置[规则分流](/glossary/rule-based-routing/):国内域名直连、国外域名走代理、广告域名拦截。想临时全局出国时,在 Dashboard 的出站分组里把模式组切换为全局(视机场配置而定,组名常为 Global/Proxy),而不是去改配置文件。

节点切换同样在 Dashboard:展开出站分组,点击组内任一节点即可切换,组名旁的测速按钮可对全组测延迟。

## 验证连接

启动后做三个检查:国内网站是否秒开(直连规则正常)、目标国外网站能否加载(代理链路正常)、Dashboard 的流量曲线是否随访问跳动(TUN 接管正常)。三项都通过即配置完成。如果国内外网站都打不开,优先怀疑 DNS 配置,处理思路见 [DNS 解析失败排查](/troubleshooting/dns-resolution-failure/)。

## 高频问题对照

| 现象 | 原因与处理 |
| --- | --- |
| 启动即报 config 解析错误 | 订阅格式与客户端版本不匹配,更新订阅或按机场建议换版本 |
| 提示端口或网卡被占用 | 关闭其他正在运行的代理软件后重启 sing-box |
| 能上国外网站但国内网站变慢 | 路由规则缺失导致国内流量出国,联系机场修正订阅 |
| Android 息屏后断连 | 在系统电池设置中允许后台运行、关闭省电限制 |
| 部分节点不通 | 常见于晚高峰或个别线路故障,参考[部分节点失效的排查](/troubleshooting/partial-nodes-fail/) |

## 停用与卸载

在 Dashboard 点击停止按钮,虚拟网卡随即移除,系统网络立刻恢复,无需手动清理代理设置——这是 TUN 模式的优点之一。彻底卸载时,桌面端正常卸载程序即可;iOS 与 Android 卸载 App 后,残留的 VPN 配置可在系统设置的 VPN 管理页删除。

## 安全建议

sing-box 的配置文件包含完整的节点密码与订阅地址,不要把配置 JSON 直接发给他人求助,截图时也要遮住 URL 与 uuid 字段。客户端更新只跟随 GitHub Releases 与应用商店;凡是要求你导入「破解配置」「免费节点配置」的来源都应视为高风险,更多边界问题见[风险与合规栏目](/risk/)。
