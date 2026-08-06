# SEO 与 GEO 策略

## 关键词与 URL 映射

每个 URL 承担独立的搜索意图,不在所有页面重复堆砌全部关键词。

| URL | 主要承担的搜索意图 |
| --- | --- |
| `/` | VPN 推荐指南、机场选择、客户端教程、故障排查(品牌与总入口) |
| `/start/` | 新手入门、第一次使用怎么开始 |
| `/choose/` | 怎么选、选择标准、按需求选择 |
| `/airport/` | 机场推荐、机场选择、机场代理服务参考 |
| `/stable/` | 稳定机场推荐、稳定线路选择参考 |
| `/value/` | 性价比机场、低预算套餐选择 |
| `/directory/` | 机场导航、网络代理服务目录 |
| `/reviews/` | 机场评测、服务档案、服务体验分析 |
| `/compare/` | 机场对比、套餐对比、线路对比 |
| `/clients/` | Clash、Shadowrocket、v2rayN、sing-box 教程 |
| `/troubleshooting/` | 节点超时、订阅失败、无法连接、速度慢 |
| `/protocols/` | 线路、协议、IEPL、IPLC、Shadowsocks、Trojan、VLESS、Hysteria 2 |
| `/scenarios/` | AI 工具、流媒体、远程办公、多设备使用场景 |
| `/subscription/` | 订阅管理、订阅链接、节点更新 |
| `/risk/` | 跑路风险、付款安全、隐私、虚假宣传识别 |
| `/glossary/` | 术语解释、名词是什么意思 |

栏目下的每篇文章再细分到具体的长尾意图,例如 `/troubleshooting/` 下的八篇各自对应一个具体故障现象,彼此不抢关键词。

## 年份关键词的处理

不为年份建立重复 URL。年份信息通过四个位置体现:页面标题中的表述、`updatedAt` 更新时间、正文中的年度说明、以及 `reviewedAt` 最后核验时间。这样 URL 保持稳定,历史权重不会被每年新建的页面稀释。

## 元数据规则

所有页面的 `<head>` 由 `src/components/Seo.astro` 统一输出,页面不自行写 meta 标签。

- **title** —— 优先表达页面主题,不堆词。文章页格式为 `<标题>｜VPN推荐指南`。
- **description** —— 必须是页面摘要,不能复制正文开头。Schema 强制 40 到 180 字符。
- **canonical** —— 统一以 `https://vpntuijian.cc` 为前缀,自引用。`audit:seo` 会检查是否出现 `www`、`http`、`pages.dev` 形式。
- **尾斜杠** —— `astro.config.mjs` 设置 `trailingSlash: 'always'`,全站统一带尾斜杠。
- **lang** —— `<html lang="zh-CN">`。
- **重复检测** —— `audit:seo` 会在全站范围内检查 title 与 description 是否重复,重复即报错。

## 索引控制

| 页面类型 | robots | 理由 |
| --- | --- | --- |
| 内容页、栏目页、信息页 | index, follow | 正常收录 |
| `/search/` | noindex, follow | 搜索结果页无独立价值 |
| `/tags/` 及标签页 | noindex, follow | 与分类页存在重叠,避免薄内容 |
| `dataStatus: sample` 的内容 | noindex, follow | 示例数据不应进入索引 |
| 404 | noindex | 错误页 |

标签页还有一层控制:文章数少于 3 篇的标签不生成页面(`MIN_ARTICLES_PER_TAG`),标签索引页也只列出实际生成的标签,避免产生 404 内链。

sitemap 与上表严格一致——`scripts/prune-sitemap.mjs` 扫描构建产物中每个页面的实际 robots 值,把 noindex 页面从 sitemap 移除。`audit:seo` 会反向验证这一点。

## 结构化数据

按页面类型输出,全部与页面可见内容一一对应:

| 页面 | Schema |
| --- | --- |
| 首页 | Organization、WebSite、FAQPage |
| 文章 | Article 或 TechArticle、BreadcrumbList |
| 教程与故障排查 | TechArticle、BreadcrumbList |
| 有 FAQ 的页面 | 追加 FAQPage |
| 栏目页 | CollectionPage、BreadcrumbList、ItemList |
| 服务档案 | BreadcrumbList |

明确不做的事:输出页面上不存在的 FAQ、虚构 AggregateRating、把推广内容伪装成用户评分、在 Schema 中填写不存在的作者或图片。FAQ 的 JSON-LD 和页面上的 `<details>` 使用同一份 frontmatter 数据渲染,不可能不一致。

`audit:seo` 会对每个 `<script type="application/ld+json">` 做 JSON 解析,语法错误即报错。

## GEO(生成式搜索)结构

GEO 不作为独立功能处理,而是落在内容结构和 HTML 语义上。每篇文章的可提取要素:

1. **直接答案** —— `summary` 字段,80 到 160 字,渲染在正文最前面的独立区块中,直接回答页面标题提出的问题。
2. **关键结论** —— `keyTakeaways` 数组,3 到 6 条完整陈述句,渲染为带标题的列表。
3. **清晰的标题层级** —— H2/H3 带 id 锚点,可被精确引用。
4. **可提取的步骤** —— 排查流程与配置步骤用有序列表。
5. **比较表** —— 每篇文章至少一个表格,带表头。
6. **明确的适用与不适用** —— 服务档案有 `suitableFor` / `notSuitableFor`,文章正文中写明什么情况适用。
7. **数据条件** —— 测试环境说明模块列出设备、网络、时间等前提。
8. **时间信息** —— 发布、更新、最后核验三个日期都在页面上可见且有 `<time datetime>`。
9. **实体一致性** —— 服务名、客户端名、协议名、线路名全站统一拼写。
10. **术语链接** —— 专业术语第一次出现时链接到 `/glossary/` 下的对应词条,每个词条有一句话定义。
11. **参考来源** —— `sources` 字段渲染为来源列表。
12. **FAQ** —— 3 到 5 条,问答形式,同时可见并输出 JSON-LD。

写作上要求多用明确陈述句,减少没有主语的模糊表达。

`public/llms.txt` 提供站点结构与内容约定的说明,作为补充信息,不视为收录或排名的替代方案。

## 内部链接体系

Hub-and-Spoke 结构:栏目页为 Hub,具体文章为 Spoke。

自动生成的链接:

- **面包屑** —— 每个页面三级(首页 → 栏目 → 当前页),同时输出 BreadcrumbList。
- **上一篇/下一篇** —— 同集合内按发布时间排序。
- **相关阅读** —— 优先 `related` 手工指定,不足时按同集合补齐到 4 条。

手工建立的链接:每篇文章正文中 3 到 7 个上下文内链,指向上级栏目、相关基础知识、相关教程、相关故障、相关服务档案。锚文本要求自然,不使用统一的精确匹配关键词。

结果是没有孤立页面——`relatedFor()` 的补齐机制保证每篇文章至少有 4 条出链,面包屑保证至少有 2 条入链路径。

## 检查项

`npm run audit:seo` 覆盖:缺失 title / description / H1、多个 H1、缺失或无效 canonical、重复 title、重复 description、noindex 页面进入 sitemap、JSON-LD 语法错误、Invalid Date、图片缺失 alt 与尺寸。

`npm run audit:links` 覆盖:空 href、`javascript:` 链接、站内 404 内链。

`npm run audit:content` 覆盖:必填字段缺失、无效日期、related 与 author 指向不存在的内容、sample 数据未设 noindex、正文过短、绝对承诺用语。
