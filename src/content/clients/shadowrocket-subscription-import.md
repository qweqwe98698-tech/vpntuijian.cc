---
title: "Shadowrocket 订阅导入与代理模式选择"
description: "Shadowrocket 订阅导入要点:添加时类型必须选 Subscribe 才能整组导入,全局路由设为「配置」走规则分流。附连接开关自动弹回、蜂窝网络不通的处理。"
publishedAt: 2026-08-04
updatedAt: 2026-08-04
author: mai-heng
reviewer: lin-shu
category: "客户端教程"
subcategory: "iOS 客户端"
tags: ["Shadowrocket", "iOS", "订阅导入", "代理模式"]
searchIntent: informational
audience: beginner
difficulty: easy
summary: "Shadowrocket 是 iOS 上的付费代理客户端,需用外区 Apple ID 在 App Store 购买。安装后在首页点击右上角加号、类型选 Subscribe、粘贴订阅链接即可导入全部节点;日常把全局路由设为「配置」(规则分流),选好节点后打开顶部连接开关并允许添加 VPN 配置就能使用。"
keyTakeaways:
  - "Shadowrocket 仅在 App Store 分发,需要美区等外区 Apple ID 购买,任何免签名安装包都不可信"
  - "添加订阅时类型选 Subscribe 而不是 Server,才能整组导入并支持后续自动更新"
  - "全局路由日常设为「配置」即规则分流;「代理」相当于全局模式,仅临时使用"
  - "首次连接必须在系统弹窗中允许添加 VPN 配置,否则开关会自动弹回"
  - "Wi-Fi 正常而蜂窝网络不通时,优先检查 iOS 蜂窝数据权限设置"
featured: false
related:
  - "clients/clash-subscription-import"
  - "clients/sing-box-getting-started"
  - "troubleshooting/wifi-ok-cellular-fails"
  - "articles/multi-device-plan-guide"
faq:
  - q: "没有外区 Apple ID 能安装 Shadowrocket 吗?"
    a: "不能。Shadowrocket 未在中国大陆区 App Store 上架,需要注册美区等外区 Apple ID 并为其充值后购买。请勿使用来路不明的共享账号,存在设备被锁风险。"
  - q: "订阅导入后节点很多,应该怎么选?"
    a: "点击首页的「连通性测试」测一轮延迟,选择延迟低且稳定的节点即可。看流媒体或用 AI 工具时再按业务需求换对应地区的节点。"
  - q: "为什么打开连接开关后马上自动关闭?"
    a: "通常是首次使用时拒绝了添加 VPN 配置的系统弹窗。前往系统设置删除旧的 VPN 描述文件后重新打开开关,在弹窗中选择允许并验证密码或面容。"
dataStatus: verified
platforms: ["iOS", "iPadOS"]
appVersion: "以 2026 年主流稳定版界面为准"
checkedAt: 2026-08-04
---

## 使用前提与版本说明

Shadowrocket 是 iPhone 和 iPad 上最常用的代理客户端之一,支持 Shadowsocks、[Trojan](/glossary/trojan/)、VLESS、Hysteria 2 等主流协议。它是付费应用,且没有在中国大陆区 App Store 上架,因此你需要两样东西:一个美区(或其他外区)Apple ID 用于购买,以及一条从[机场](/glossary/airport/)用户面板复制的[订阅链接](/glossary/subscription-link/)。本文界面描述以 2026 年主流稳定版为准,iPad 版与 iPhone 版布局一致。

特别提醒:App Store 是 Shadowrocket 唯一的官方分发渠道。网上流传的「免费签名版」「企业证书版」安装包全部属于二次打包,轻则证书随时失效,重则内置流量劫持,请勿安装。

## 购买与安装

在外区 Apple ID 登录 App Store 的状态下搜索 Shadowrocket,支付后正常下载安装即可。安装完成后可以切回常用 Apple ID,已购应用不受影响,后续更新时再临时切换回购买账号。如果你打算在多台设备上使用同一套订阅,建议先了解[多设备套餐的选择思路](/guides/multi-device-plan-guide/),确认机场允许的同时在线设备数。

## 把订阅加进来

1. 打开 Shadowrocket,停留在默认的「首页」标签。
2. 点击右上角的加号按钮进入添加页面。
3. 「类型」一栏默认是 Server(单个服务器),点击它改为 **Subscribe**(订阅)。
4. 在 URL 输入框粘贴订阅链接,备注可随意填写机场名称,然后点右上角「完成」。
5. 返回首页稍等片刻,订阅分组和节点列表就会出现;如果没有自动加载,下拉刷新一次。

导入成功的标志是首页出现按机场名分组的节点列表。若提示下载失败,先在 Safari 中直接打开订阅链接测试:能打开说明应用内网络受阻,可在设置中把「订阅」里的「打开代理更新」暂时关闭再刷新;打不开则回面板重新复制链接。整组导入的另一个好处是支持自动更新,在「设置 → 订阅」中开启「自动后台更新」,机场调整节点后无需手动操作。

## 选节点与代理模式

节点选择很直接:在首页点击某个节点名称,前面出现蓝色圆点即为选中。点击「连通性测试」可以对全部节点测一轮延迟,数字越小越好。不同业务对节点的要求不同,例如 AI 工具对 IP 质量敏感,可参考 [AI 工具的节点选择建议](/scenarios/ai-tools-node-selection/)。

模式设置在首页的「全局路由」一栏,这是新手最容易配错的地方。三个常用选项的区别如下:

| 全局路由选项 | 实际行为 | 适用情形 |
| --- | --- | --- |
| 配置 | 按内置规则分流,国内直连、国外走代理 | 日常默认,等价于 Clash 的[规则模式](/glossary/rule-based-routing/) |
| 代理 | 所有流量都走选中节点 | 排查分流误判,或需要全部流量出国时临时用 |
| 直连 | 所有流量不走代理 | 保持连接但暂时停用代理 |

日常保持「配置」即可。如果遇到某个国外网站没走代理,先临时切到「代理」验证节点本身可用,再回头排查规则。

## 首次连接与验证

打开首页顶部的连接开关,iOS 会弹出「要添加 VPN 配置吗」的系统提示——必须点「允许」并通过密码或面容验证,这是系统级授权,拒绝后开关会立刻弹回。授权成功后状态栏会出现 VPN 图标。

验证分两步:先开一个国内 App 或网站确认速度正常,再访问平时打不开的国外网站确认代理生效。两步都通过,配置就完成了。

## 出问题时按这张表排查

| 现象 | 排查方向 |
| --- | --- |
| 开关打开即弹回 | 系统设置中删除旧 VPN 描述文件,重新授权 |
| Wi-Fi 下正常,蜂窝网络不通 | 检查蜂窝数据权限,详见[蜂窝网络故障排查](/troubleshooting/wifi-ok-cellular-fails/) |
| 订阅刷新失败 | 关闭「打开代理更新」后重试,或换网络刷新 |
| 节点全部超时 | 更新订阅、确认套餐未到期,再换网络测试 |
| 连上但部分网站打不开 | 切「代理」模式对比,判断是规则还是节点问题 |

## 停用与恢复网络

关闭首页顶部的连接开关即可断开,状态栏 VPN 图标消失,系统网络立刻恢复原状——iOS 的 VPN 机制由系统托管,不会像桌面端那样残留代理设置。如果想彻底移除,可在「设置 → 通用 → VPN 与设备管理」中删除 Shadowrocket 创建的 VPN 配置。

## 安全注意事项

订阅链接泄露等于账号泄露,不要把带有订阅地址的截图发到群聊。购买外区 Apple ID 礼品卡时注意辨别渠道,避免黑卡充值导致账号被锁,相关思路与[付款安全指南](/guides/payment-safety-guide/)一致。最后,代理开启期间登录银行等敏感账号建议临时切「直连」,减少不必要的风险面。
