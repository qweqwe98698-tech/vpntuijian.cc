# 技术架构

## 技术选型

| 层 | 选择 | 理由 |
| --- | --- | --- |
| 框架 | Astro 5(静态输出) | 内容型站点,构建期生成全部 HTML,运行时无框架开销 |
| 类型 | TypeScript(strict) | 内容 Schema 与组件属性都有类型保障 |
| 内容 | Astro Content Collections + Markdown | 构建期校验 frontmatter,字段缺失直接报错 |
| 样式 | 原生 CSS + CSS 变量 | 无构建期 CSS 框架依赖,产物体积小 |
| 交互 | 少量原生 JS | 只有移动导航、主题切换、目录折叠三处 |
| 搜索 | Pagefind | 构建期生成静态索引,无运行时服务依赖 |
| 站点地图 | @astrojs/sitemap + 自定义裁剪脚本 | 集成生成,脚本保证与 noindex 集合一致 |
| RSS | @astrojs/rss | 官方集成 |
| 部署 | Cloudflare Pages | 静态托管,全球 CDN |

刻意没有引入:React / Vue / Svelte、Tailwind、UI 组件库、图标库、动画库、运行时搜索服务。

## 目录结构

```
src/
├── components/     可复用组件(全部为 .astro,无客户端框架组件)
├── layouts/        BaseLayout / ArticleLayout / SectionLayout
├── pages/          路由。[slug].astro 为动态路由,index.astro 为栏目页
├── content/        内容集合(Markdown)
├── lib/            site.ts(常量与导航)、content.ts(查询)、schema.ts(JSON-LD)
├── styles/         global.css(设计系统)
└── content.config.ts   所有集合的 Zod Schema
scripts/            零依赖的 Node 检查脚本
public/             静态资源、_headers、_redirects、robots.txt、llms.txt
docs/               项目文档
```

## 三层布局

**BaseLayout** —— HTML 骨架、`<head>`(经 Seo 组件)、页眉、页脚、跳过导航链接。所有页面最终都经过它。

**SectionLayout** —— 栏目页与静态信息页。在 BaseLayout 之上加面包屑、页头(H1 + 导语),并按需输出 `CollectionPage` 与 `BreadcrumbList` 结构化数据。

**ArticleLayout** —— 所有内容详情页共用。负责的完整链路:

```
面包屑 → 文章头部(H1/描述/元信息)→ 示例数据提示(dataStatus=sample 时)
→ 推广披露(评测与对比页)→ 时效提示(超过 180 天)→ 直接答案 → 关键结论
→ 正文 → FAQ → 参考来源 → 上一篇/下一篇 → 相关阅读
侧栏:目录 + 作者卡片 + 审核者卡片 + 内容状态
```

七个内容集合(articles / clients / troubleshooting / protocols / scenarios / reviews / comparisons)共用这一个布局,页面文件只负责取数据和渲染 `<Content />`。这保证了元数据、结构化数据和内链结构在所有文章页上完全一致。

## 内容集合模型

`src/content.config.ts` 中,七个文章类集合共享 `baseArticleSchema`,各自 extend 出专属字段:

- `clients` 增加 `platforms`、`appVersion`、`checkedAt`
- `troubleshooting` 增加 `symptom`、`platforms`、`severity`
- `reviews` 增加 `provider`、`verifiedAt`、`verifiedItems`、`pendingItems`
- `comparisons` 增加 `subjects`、`comparedAt`、`dimensions`

`providers`(服务档案)、`glossary`(术语)、`authors`(作者)是独立的数据模型。

**数据状态系统**贯穿全站:`verified` / `reference` / `sample` / `pending` / `outdated`。它同时驱动三处行为——页面上的状态徽章、`sample` 页面的额外提示框、以及内容检查脚本对 `sample` 必须 `noindex` 的强制校验。

## 跨集合引用

`related` 字段使用 `集合名/slug` 格式,由 `src/lib/content.ts` 的 `resolveRelated()` 解析。它会跳过不存在的引用而不是抛错(保证构建健壮),同时 `audit:content` 脚本会独立检查所有引用的有效性并报错。这样既不会因为一个笔误中断构建,也不会让坏链接静默上线。

`relatedFor()` 的补全策略:手工 `related` 不足时,用同集合的其他文章按更新时间补齐到 4 条。这保证每篇文章都有相关阅读,不会出现孤立页面。

## SEO 与结构化数据

所有 `<head>` 元数据由 `src/components/Seo.astro` 统一输出,页面只传参数,不自己写 meta 标签。canonical 统一以 `SITE.url` 为前缀拼接,杜绝 `www`、`http`、`pages.dev` 混用。

JSON-LD 由 `src/lib/schema.ts` 的工厂函数生成,按页面类型组合:

| 页面类型 | 输出的 Schema |
| --- | --- |
| 首页 | Organization + WebSite + FAQPage |
| 文章详情 | Article 或 TechArticle + BreadcrumbList + FAQPage(有 FAQ 时) |
| 栏目页 | CollectionPage + BreadcrumbList + ItemList |
| 服务档案 | BreadcrumbList |

`faqSchema()` 在 FAQ 数组为空时返回 `null`,页面不会输出空的 FAQPage。FAQ 内容来自 frontmatter,同一份数据既渲染成页面上可见的 `<details>`,又生成 JSON-LD,两者不可能不一致。

## 构建流程

```
astro build              生成静态 HTML 到 dist/
  → prune-sitemap.mjs    扫描产物,把 noindex 页面从 sitemap 移除
  → pagefind --site dist 生成搜索索引
```

sitemap 裁剪放在构建后而不是配置里,是因为 `@astrojs/sitemap` 的 `filter` 只能按路径判断,拿不到页面实际的 robots 值。扫描产物是唯一能保证 sitemap 与可索引集合严格一致的方式。

## 检查脚本

四个零依赖的 Node 脚本,都在 `scripts/` 下,共用 `lib.mjs` 的工具函数和 `Reporter` 类(错误退出码非零,警告不中断)。

- `audit-links.mjs` —— 扫描产物 HTML 的所有 href,检查空链接、`javascript:` 链接、站内 404。会对百分号编码的路径解码后再比对。
- `audit-seo.mjs` —— title / description / H1 数量 / canonical 自引用与域名形式 / JSON-LD 可解析性 / Invalid Date / 图片 alt 与尺寸 / 全站重复 title 与 description / sitemap 与 noindex 一致性。
- `audit-content.mjs` —— 直接读 Markdown frontmatter,检查必填字段、日期有效性、related 与 author 引用、sample 是否 noindex、正文长度、绝对承诺用语。
- `prune-sitemap.mjs` —— 构建后处理,见上。

`npm run validate` 串联全部检查。

## 性能取舍

- 页面组件默认不使用任何 `client:*` 指令,产物中的 JS 只有三段内联脚本(主题、移动导航、目录折叠)和 Pagefind(仅搜索页加载)。当前 `dist/_astro` 约 16KB。
- 字体使用中文系统字体栈,不加载任何外部字体。
- 无第三方跟踪脚本。
- 图标全部为内联 SVG,不引入图标库。
