---
term: "Trojan"
aliases: ["Trojan-GFW", "Trojan 协议"]
definition: "Trojan 是一种将代理流量伪装成标准 HTTPS 流量的协议,依托真实 TLS 加密和网站伪装来规避流量识别。"
category: "协议"
seoDescription: "Trojan 靠伪装而非隐身:服务端监听 443 端口、持有真实域名证书,把代理数据放进标准 TLS,探测者会被转发到真网站。它与同名木马病毒无关,部署需要域名,证书配错会削弱伪装。"
publishedAt: 2026-08-04
updatedAt: 2026-08-04
related: ["glossary/shadowsocks", "glossary/vless", "glossary/node"]
---

Trojan 的核心思路与 Shadowsocks 相反:不追求"不可识别",而是把自己伪装成最常见的流量——HTTPS。Trojan 服务端监听 443 端口并持有真实域名证书,代理流量经标准 TLS 加密传输;当非授权访问者(如探测程序)连接时,服务端将其转发到一个真实网站,使服务器表现得与普通 Web 服务器无异。

由于建立在标准 TLS 之上,Trojan 需要域名和证书才能部署,配置比 [Shadowsocks](/glossary/shadowsocks/) 稍重,但流量特征与正常网站访问高度一致,抗识别能力在直连公网场景下口碑较好。主流客户端(Clash 系、sing-box、Shadowrocket 等)均已支持,机场套餐中也很常见。

使用语境上,"Trojan 节点"通常意味着 TLS 加密开销略高于 SS,对性能的影响在现代设备上可以忽略。常见误解:一是与恶意软件"木马"(Trojan horse)混淆——两者只是重名,代理协议 Trojan 与病毒无关;二是认为 TLS 伪装等于绝对安全——若服务端证书配置不当、或使用了被大量滥用的域名,伪装效果会打折扣,协议本身也不能防止服务商记录你的流量元数据。
