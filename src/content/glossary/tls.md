---
term: "TLS"
aliases: ["传输层安全协议", "Transport Layer Security", "SSL"]
definition: "TLS 是在传输层之上为网络通信提供加密、完整性校验和身份认证的标准协议,HTTPS 的安全性正来自它,也是多数现代代理协议的加密底座。"
category: "协议"
seoDescription: "TLS 做证书验证、密钥协商与数据加密,既是 HTTPS 的安全来源,也是多数代理协议的伪装底座。节点参数里的 sni、skip-cert-verify 就在描述这层握手;它保护内容,却不隐藏元数据。"
publishedAt: 2026-08-05
updatedAt: 2026-08-05
related: ["glossary/trojan", "glossary/vless", "glossary/websocket"]
---

TLS 的前身是 SSL,如今通用的版本是 TLS 1.2 与 TLS 1.3。它做三件事:用证书验证服务端身份、协商出一把只有通信双方知道的会话密钥、对之后的数据做加密与完整性保护。浏览器地址栏里的 `https://` 与锁形图标,背后就是一次完整的 TLS 握手。

## 在代理场景里的位置

代理协议使用 TLS 主要不是为了"更安全",而是为了"更像普通流量"。[Trojan](/glossary/trojan/) 直接把代理数据塞进标准 TLS 连接并监听 443 端口,让服务器在外部看来就是一台普通的 HTTPS 网站服务器;[VLESS](/glossary/vless/) 自身不加密,通常要外挂 TLS 或 REALITY 这类基于 TLS 特征的传输层才能上线使用。因此机场节点参数里常见的 `tls: true`、`sni`、`skip-cert-verify` 等字段,都是在描述这层握手怎么做。

其中 SNI(服务器名称指示)填写的域名会在握手初期以明文出现,它决定了链路中间设备看到的"你在访问哪个站点";而 `skip-cert-verify` 表示跳过证书校验,虽然能让自签证书的节点连上,却也让中间人替换证书变得可行,不建议长期开启。

## 常见误解

一是把 TLS 等同于匿名。TLS 保护的是内容,不隐藏你连接了哪个 IP、什么时间连、连了多久,这些元数据服务商与链路两端依然可见。二是认为"开了 TLS 就不会被识别"。加密内容确实读不出来,但握手指纹、证书特征、流量时序仍可能构成识别依据,这也是 REALITY 等方案继续演进的原因。
