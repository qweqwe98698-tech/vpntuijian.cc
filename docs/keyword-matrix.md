# 关键词矩阵与页面分工

本文件把《2026 年整站 SEO 关键词优先级清单》和《2026 机场网站 SEO＋GEO 长尾问题库》落到具体 URL 上。

**一条铁律:一页一主词。** 新增内容前先查本表,确认目标关键词还没有被其他页面占用。如果已被占用,把内容合并进那个页面,而不是新建。

---

## 零、当前覆盖状态

| 层级 | 状态 | 承接页面 |
| --- | --- | --- |
| P0 首页核心词 | ✅ | `/` |
| P1 推荐与排行榜 | ✅ | `/airport/`、`/airport/ranking/` |
| P2 价格套餐优惠 | ✅ | `/value/`、`/airport/cost-performance/`、`pay-as-you-go`、`free-trial`、`coupon` |
| P3 客户端绑定词 | ✅ | `/airport/clash|shadowrocket|v2rayn|android/` |
| P4 使用场景 | ✅ | `/airport/chatgpt|streaming|netflix|tiktok|low-latency/` |
| P5 线路协议 IP | ✅ | `/airport/dedicated-line|native-ip/`、`/stable/` |
| **P6 品牌评测** | ✅ | **`/directory/<slug>/` × 9,`/reviews/` 为入口** |
| P7 故障排查 | ✅ | `/troubleshooting/` × 16 |
| P8 风险与安全 | ✅ | `/risk/` + 2 篇指南 |
| P9 泛流量词 | ✅ | `/tools/` |
| P10 教程与知识 | ✅ | `/clients/` × 8、`/protocols/` × 4、`/glossary/` × 18、`/guides/` × 6 |

P6 是最后补齐的一层。它此前空缺不是遗漏,而是**缺少真实服务数据**——在没有可核实档案之前建立品牌页,只能靠编造,那会同时触发 Google 的 helpful content 信号并摧毁站点可信度。九家档案完成实测后,该层才具备建立条件。

## 一、与来源文档的两处偏离(重要)

### 1. 不建立虚构名单的排行榜页

关键词清单建议建立 `/airport-ranking/` 承接「机场排行榜、机场天梯榜、2026 机场推荐排行榜」。这些词确实有量,但**排行榜的内容主体是具体服务名单,本站目前没有任何经过核验的真实服务数据**。

用虚构数据填充排行榜会同时伤害三个目标:

- Google 的 helpful content 系统针对的正是这类「为搜索引擎而非用户制作」的名单页;
- Bing 对无法核实的商业排名同样有质量信号;
- AI 搜索(GEO)不会采纳无法溯源的排名结论,反而会降低整站被引用的概率。

**当前做法:** `/airport/ranking/` 承接排行榜关键词,但页面主体是「排行榜该怎么看、按什么维度排、为什么不同网站结果不同、如何识别有推广利益的榜单」。这组内容对应问题库第 37 节的 25 个问题,本身就是完整的搜索意图。真实数据就绪后,在同一 URL 下追加名单模块即可,不需要新建页面,也不损失已积累的权重。

### 2. 首页不改成纯排行榜定位

关键词清单建议首页 H1 用「2026 机场推荐与稳定机场排行榜」。本站已按品牌定位建立了故障排查与客户端教程两条差异化内容线,这是目前唯一有真实深度的资产。首页 H1 调整为覆盖 P0 核心词,但保留「指南/怎么选」的定位表述,不承诺不存在的榜单。

---

## 二、页面分工总表

### P0 — 首页

| 项 | 内容 |
| --- | --- |
| URL | `/` |
| 主词 | 机场推荐 |
| 次词 | 机场推荐 2026、2026 机场推荐、稳定机场推荐、便宜机场推荐、专线机场推荐 |
| 自然覆盖 | 好用机场推荐、靠谱机场推荐、高速机场推荐、老牌机场推荐、机场推荐排行、翻墙机场推荐、科学上网机场推荐 |
| 承接问题 | 问题库第 49 节(首页应该回答的 10 个核心决策问题) |
| 不在首页优化 | Clash 机场推荐、Shadowrocket 机场推荐、IEPL 机场推荐、免费试用机场、Netflix 机场推荐、机场优惠码、机场跑路、任何品牌名 |

### P1 — 机场推荐 Hub 与排行榜

| URL | 主词 | 次词 | 问题库来源 |
| --- | --- | --- | --- |
| `/airport/` | 机场推荐 | 机场选择、机场代理服务、机场是什么 | 第 1 节 |
| `/airport/ranking/` | 机场排行榜 | 机场天梯榜、机场排名、机场测评排行榜、2026 机场排行榜 | 第 37 节 |

### P2 — 价格、套餐与优惠

| URL | 主词 | 次词 | 问题库来源 |
| --- | --- | --- | --- |
| `/value/` | 便宜机场推荐 | 低价机场推荐、平价机场推荐、学生党机场推荐、10/15/20 元机场 | 第 3 节 |
| `/airport/cost-performance/` | 高性价比机场推荐 | 性价比高的机场、每 GB 流量价格、节点倍率影响 | 第 4 节 |
| `/airport/pay-as-you-go/` | 按量计费机场 | 不限时机场、流量包机场、一次性机场套餐、永久流量机场 | 第 12 节 |
| `/airport/free-trial/` | 免费试用机场 | 一元试用机场、支持试用的机场、有退款保障的机场 | 第 33 节 |
| `/airport/coupon/` | 机场优惠码 | 机场折扣码、机场优惠活动、机场年付优惠 | 第 32 节 |

`/value/` 与 `/airport/cost-performance/` 必须使用不同评价标准:前者主轴是「绝对价格低」,后者主轴是「单位价格买到的质量」。两页互链但不重复论证。

### P3 — 客户端绑定词

| URL | 主词 | 次词 | 问题库来源 |
| --- | --- | --- | --- |
| `/airport/clash/` | Clash 机场推荐 | Clash 节点推荐、Clash 订阅推荐、支持 Clash 的机场、Clash Verge 机场推荐 | 第 13 节 |
| `/airport/shadowrocket/` | Shadowrocket 机场推荐 | 小火箭机场推荐、iPhone 机场推荐、iOS 机场推荐、苹果机场推荐 | 第 14 节 |
| `/airport/v2rayn/` | v2rayN 机场推荐 | Windows 机场推荐、电脑机场推荐、v2rayN 订阅推荐 | 第 15 节 |
| `/airport/android/` | 安卓机场推荐 | Android 机场推荐、手机机场推荐、v2rayNG 机场推荐 | 第 15、17 节 |

**分工边界:** 这四个页面回答「选什么服务」,`/clients/` 下的教程回答「怎么配置」,`/troubleshooting/` 下的文章回答「连不上怎么办」。三者互链,不互相抢词。

### P4 — 使用场景与平台解锁

| URL | 主词 | 次词 | 问题库来源 |
| --- | --- | --- | --- |
| `/airport/chatgpt/` | ChatGPT 机场推荐 | ChatGPT 节点推荐、支持 ChatGPT 的机场、AI 工具机场推荐、Claude 机场推荐 | 第 27、28 节 |
| `/airport/streaming/` | 流媒体解锁机场 | 流媒体机场推荐、Disney+ 机场推荐、HBO Max 机场推荐、港区/美区流媒体节点 | 第 29 节 |
| `/airport/netflix/` | Netflix 机场推荐 | Netflix 解锁机场、奈飞机场推荐、Netflix 节点推荐 | 第 29 节 |
| `/airport/tiktok/` | TikTok 机场推荐 | TikTok 原生 IP 节点、TikTok 住宅 IP、社交平台节点 | 第 30 节 |
| `/airport/low-latency/` | 低延迟机场推荐 | 游戏机场推荐、延迟低的机场、丢包低的机场、晚高峰稳定机场 | 第 20、21 节 |

`/airport/streaming/` 是流媒体总入口(覆盖多平台),`/airport/netflix/` 单独承接 Netflix 品牌词。前者不深入 Netflix 细节,后者不泛谈其他平台。

### P5 — 线路、协议与 IP 类型

| URL | 主词 | 次词 | 问题库来源 |
| --- | --- | --- | --- |
| `/airport/dedicated-line/` | 专线机场推荐 | IEPL 机场推荐、IPLC 机场推荐、企业级专线机场、真专线机场 | 第 25 节 |
| `/airport/native-ip/` | 原生 IP 机场推荐 | 原生 IP 节点推荐、家宽 IP 机场、住宅 IP 节点、独享 IP 机场 | 第 31 节 |
| `/stable/` | 稳定机场推荐 | 稳定机场排行榜、老牌机场推荐、晚高峰稳定机场 | 第 2 节 |

**商业词与知识词分离:** `/airport/dedicated-line/` 回答「专线机场怎么选、值不值」,`/protocols/iepl-vs-iplc/` 回答「IEPL 和 IPLC 技术上有什么区别」。前者商业意图,后者信息意图,互链但不合并。同理 `/airport/native-ip/` 对应知识文章的 IP 类型说明。

### P6 — 品牌评测与官网入口词

**承接页面:`/directory/<slug>/`(服务档案页)。** 每家一页,共 9 页。

关键词清单为品牌词列出了三组模板(品牌名+官网/怎么样/跑路了吗)。本站**不为同一品牌建立「档案页 + 评测页」两个 URL** —— 那会构成重复内容并互相稀释。档案页本身就包含了清单要求的全部要素:

| 清单要求的要素 | 档案页中的位置 |
| --- | --- |
| 品牌基本信息 | 页头 + `positioning` |
| 官网入口说明 | `officialUrl` / `affiliateUrl` + 推广披露 |
| 套餐与流量 | `pricing` 表格 + `trafficPolicy` |
| 线路与协议 | `lineTypes` / `protocols` |
| 客户端支持 | `clients` |
| 晚高峰表现 | `speedTest`(测试时间落在高峰时段时会注明) |
| AI 与流媒体解锁 | `claims` 区块,并注明本站未验证 |
| 优点与不足 | `strengths` / `limitations` |
| 适合人群 | `suitableFor` / `notSuitableFor` |
| 风险提示 | `riskNotes` |
| 常见问题 | `faq` 字段,渲染为可见问答 + FAQPage |
| 最后检查日期 | `verifiedAt` + `speedTest.testedAt` |

**关键词落位:**

| 关键词组 | 承接位置 |
| --- | --- |
| 品牌名、品牌名机场、品牌名官网、最新地址 | `seoTitle` + 页头 + 官网入口 |
| 品牌名怎么样 / 好用吗 / 值得买吗 / 评测 | `seoTitle` + `faq` 评测组 |
| 品牌名套餐 / 价格 / 优惠码 / 有没有试用 | `pricing` + `coupon` + `faq` 套餐组 |
| 品牌名跑路了吗 / 安全吗 / 打不开怎么办 | `riskNotes` + `faq` 风险组 |
| 品牌 A 和品牌 B 哪个好 | `/compare/nine-providers-speed-test/` |

`faq` 内容取自问题库第 41–44 节的品牌页模板(基础 / 评测 / 套餐 / 风险故障四组),每家 10–14 条,答案必须基于该档案的真实数据。

**`/reviews/` 的定位:** 只做入口与方法说明,列出九家的实测摘要并链向各自档案页,**不重复渲染档案内容**。这样「机场评测」这个栏目词由 `/reviews/` 承接,而「品牌名怎么样」由各档案页承接,两者不争词。

**风险类品牌词的答法有硬性约束:** 「品牌名跑路了吗」不得回答「不会」或「很安全」——本站无法预测,只能给出观察方法并链接风险信号一文。「安全吗 / 会记录日志吗」必须说明无日志属服务方单方声明、无第三方审计。违反这两条会让整站的可信度归零。

### P7 — 故障排查(已完成)

`/troubleshooting/` 下 16 篇,覆盖问题库第 22、23、24 节及第 52 节的故障页结构要求。关键词分工:

| URL | 承接关键词 |
| --- | --- |
| `all-nodes-timeout` | 机场节点全部超时、机场节点 timeout、节点全红、换节点还是超时 |
| `subscription-update-failed` | 机场订阅更新失败、订阅链接打不开、订阅地址无效 |
| `subscription-import-failed` | 机场订阅导入失败、订阅无法解析、订阅没有节点、更新后节点消失 |
| `connected-but-no-internet` | 连接成功但打不开网页、测速正常但无法使用 |
| `partial-nodes-fail` | 只能使用部分节点、只有一个地区不能用 |
| `evening-peak-slow` | 晚高峰卡顿、白天快晚上慢、节点延迟高、节点速度慢 |
| `dns-resolution-failure` | DNS 污染导致无法连接、DNS 错误 |
| `tls-handshake-failure` | TLS 错误、证书错误、握手失败、系统时间错误 |
| `websocket-disconnect` | WebSocket 连接失败、长连接被中断 |
| `v2rayn-cannot-connect` | v2rayN 无法连接、v2rayN 节点超时、端口被占用 |
| `wifi-ok-cellular-fails` | Wi-Fi 能用但手机流量不能用 |
| `phone-works-pc-fails` | 手机能用但电脑不能用 |
| `network-switch-fails` | 换网络后不能用、公司/校园/酒店网络不能用 |
| `single-device-cannot-connect` | 其他用户正常只有自己不能用、设备数超限 |
| `telegram-global-mode` | Telegram 只有全局模式才能连接 |
| `chatgpt-long-task-disconnect` | ChatGPT 长任务断流、Codex 长连接断开 |

### P8 — 风险与安全

| URL | 主词 | 问题库来源 |
| --- | --- | --- |
| `/risk/` | 机场避坑、机场跑路 | 第 35、36 节 |
| `/guides/airport-runaway-warning-signs/` | 机场跑路前兆、怎么判断机场会不会跑路 | 第 35 节 |
| `/guides/payment-safety-guide/` | 机场订阅链接泄露、机场共享账号安全吗、机场会记录访问内容吗 | 第 34 节 |

### P9 — 泛流量词

| URL | 主词 | 次词 | 问题库来源 |
| --- | --- | --- | --- |
| `/tools/` | 科学上网工具 | 梯子推荐、梯子软件推荐、翻墙工具推荐、魔法上网工具 | 第 6 节 |

该页以工具与客户端选择为主,通过内链导向机场推荐主线。**不要让「梯子推荐」成为全站主题**,否则会稀释「机场推荐」的主题聚焦。

### P10 — 教程与知识(已完成)

| 集合 | URL | 承接 |
| --- | --- | --- |
| clients | `/clients/*` | 客户端安装、导入订阅、配置教程(8 篇) |
| protocols | `/protocols/*` | 线路与协议知识(4 篇) |
| glossary | `/glossary/*` | 「X 是什么意思」类词(18 条) |
| articles | `/guides/*` | 选购方法与风险知识(6 篇) |

---

## 三、长尾问题库 → 内容结构的转换规则

问题库有 1800 余行、上千个问题。**不要一问一页。** 转换规则如下:

| 问题库位置 | 落到页面的哪个部位 |
| --- | --- |
| 章节主问题 | 页面 H1 / `title` |
| 该章节的核心 5–10 问 | 正文 H2,每个 H2 正面回答一个问题 |
| 延伸 3–5 问 | frontmatter `faq`,渲染为可见 `<details>` + FAQPage JSON-LD |
| 决策型 GEO 问题(第 45 节) | frontmatter `summary`(直接答案)与 `keyTakeaways` |
| 对比型 GEO 问题(第 46 节) | 正文中的对比表格 |
| 原因型 GEO 问题(第 47 节) | 正文中的「为什么」小节 |
| 操作型 GEO 问题(第 48 节) | 正文中的有序步骤列表 |

**合并规则**(问题库第 24 节):意图相同的问题必须合并进同一页面,不得各自建页。已执行的合并见上方 P7 表格——例如「节点全红 / 全部超时 / TIMEOUT / 换节点还是超时」四个问法合并进 `all-nodes-timeout` 一页。

---

## 四、GEO 内容格式要求

每个专题页与文章页按问题库第 22 节的格式组织,本站已通过模板强制其中大部分:

| 要素 | 实现方式 | 是否强制 |
| --- | --- | --- |
| 直接答案 | `summary` 字段,80–160 字,渲染在正文最前 | Schema 强制 60–300 字符 |
| 关键结论 | `keyTakeaways`,3–6 条完整陈述句 | 模板渲染 |
| 详细原因 | 正文 H2 | 写作规范 |
| 操作步骤 | 正文有序列表 | `audit:content` 检查有无列表 |
| 判断标准 | 正文「怎么确认已解决 / 怎么判断合不合适」小节 | 写作规范 |
| 注意事项 | `WarningBox` / `RiskNotice` 组件 | 按需 |
| 相关问题 | `related` 字段 + 模板自动补齐 | 模板强制不出现孤立页 |
| 更新时间 | `updatedAt` / `reviewedAt`,页面可见且带 `<time datetime>` | Schema 强制 |
| FAQ | `faq` 字段,同时渲染可见问答与 FAQPage JSON-LD | 二者同源,不可能不一致 |

---

## 五、年份词处理

**不为年份建立重复 URL。** 「2026 机场推荐」与「机场推荐」使用同一页面。年份通过四处体现:

1. 页面 `title` 中的年份表述;
2. `updatedAt` 更新时间(页面可见 + Article schema 的 `dateModified`);
3. 正文中的年度说明段落;
4. `reviewedAt` 最后核验时间。

跨年时的操作:更新这四处,不新建 URL。历史权重全部保留。

---

## 六、避免内耗的检查清单

新增页面前逐条确认:

- [ ] 主词在本表中尚未被占用
- [ ] 与最接近的现有页面,搜索意图确实不同(而不只是措辞不同)
- [ ] 能列出 3–5 个次词和 10–20 个长尾词,且不与其他页面的主词重叠
- [ ] `title`、`description`、H1 与全站现有页面均不重复(`audit:seo` 会拦截)
- [ ] 与上级 Hub 建立了双向内链
- [ ] 如果涉及具体服务名单,数据状态已明确标注

已知的易混淆边界:

| 容易混淆的两个页面 | 边界 |
| --- | --- |
| `/airport/clash/` 与 `/clients/clash-subscription-import/` | 前者选服务,后者配客户端 |
| `/airport/chatgpt/` 与 `/scenarios/ai-tools-node-selection/` | 前者商业选购,后者节点判断方法 |
| `/airport/chatgpt/` 与 `/troubleshooting/chatgpt-long-task-disconnect/` | 前者买什么,后者坏了怎么修 |
| `/airport/dedicated-line/` 与 `/protocols/iepl-vs-iplc/` | 前者商业选购,后者技术区别 |
| `/value/` 与 `/airport/cost-performance/` | 前者绝对低价,后者单位价格的质量 |
| `/airport/streaming/` 与 `/airport/netflix/` | 前者多平台总览,后者单平台深入 |
| `/airport/ranking/` 与 `/risk/` | 前者怎么看榜单,后者怎么避坑 |

---

## 七、待真实数据就绪后的动作

以下页面已建好结构与判断标准,`providerListStatus` 为 `pending`,服务名单模块显示占位说明。真实数据到位后:

1. 在 `src/content/providers/` 建立真实服务档案,`dataStatus` 设为 `verified` 或 `reference`,移除 `noindex`;
2. 把对应专题页的 `providerListStatus` 改为 `ready`;
3. 在专题页正文追加名单模块,每条标注核验日期;
4. 不需要改 URL、不需要改 `title`,已积累的权重全部保留。

涉及的页面:全部 16 个 `/airport/*` 专题页,以及 `/stable/`、`/value/`、`/directory/`、`/reviews/`、`/compare/`。
