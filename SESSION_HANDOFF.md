# SESSION_HANDOFF

新会话接手本项目时,先读本文件,再读 PROJECT_STATUS.md 和 docs/qa-report.md。

## 项目定位

vpntuijian.cc —— 「VPN推荐指南」(VPN Tuijian Guide)。中文网络代理服务(机场)选择、客户端配置、节点与订阅管理、故障排查、线路协议知识与风险提示的知识型博客。口号:选得明白,用得稳定,出问题能解决。

核心差异化是**故障排查中心 + 客户端教程中心**,不做排行榜导航站,不做注册链接集合页。

## 技术栈

- Astro 5(静态输出,`trailingSlash: 'always'`)+ TypeScript strict + Content Collections + Markdown
- 原生 CSS(CSS 变量,无 Tailwind / 无 UI 框架)、三处原生 JS(主题切换、移动导航、目录折叠)
- Pagefind 静态搜索、@astrojs/sitemap、@astrojs/rss
- 部署:Cloudflare Pages(preset Astro,build `npm run build`,输出 `dist`,production branch `main`)

路径别名:`@components/*` `@layouts/*` `@lib/*`(定义在 tsconfig.json)

## 项目目录

```
src/components/     57 个组件
src/layouts/        BaseLayout / SectionLayout / ArticleLayout
src/pages/          路由
src/content/        11 个集合的 Markdown(含 picks 选购专题)
src/lib/            site.ts(常量与导航)content.ts(查询)schema.ts(JSON-LD)
src/styles/         global.css(设计系统)
src/content.config.ts   全部集合 Schema
scripts/            4 个检查脚本 + prune-sitemap + indexnow
docs/               项目文档
```

## 已完成页面

120 个页面产物,其中可索引 97 个。

- 首页(12 个内容区块)
- 一级栏目:start / choose / airport / stable / value / directory / reviews / compare / clients / troubleshooting / protocols / scenarios / risk / subscription / glossary / guides / topics
- 信息页:about / methodology / editorial-policy / disclosure / privacy / terms / contact
- 功能页:search(noindex)/ 404 / tags 索引与标签页(noindex)
- 详情路由:guides / clients / troubleshooting / protocols / scenarios / reviews / compare / directory / glossary

内容 78 个文件:troubleshooting 16、picks 16、clients 8、articles 6、protocols 4、scenarios 3、glossary 18、providers 3、reviews 1、comparisons 1、authors 2。

## 未完成任务

见 PROJECT_STATUS.md「未完成事项」与 docs/qa-report.md 第五节。核心是:**3 个服务档案目前是示例数据(sample + noindex),需要用真实服务替换**。

## 重要文件

| 文件 | 作用 |
| --- | --- |
| `src/content.config.ts` | 全部集合 Schema 与 dataStatus 枚举 |
| `src/lib/site.ts` | 站点常量、导航配置、数据状态标签、集合与 URL 映射 |
| `src/lib/content.ts` | 内容查询、related 解析、相关文章补齐 |
| `src/lib/schema.ts` | JSON-LD 生成 |
| `src/components/Seo.astro` | 统一 head 元数据 |
| `src/layouts/ArticleLayout.astro` | 所有文章详情页共用布局 |
| `scripts/prune-sitemap.mjs` | 构建后按实际 robots 值裁剪 sitemap |
| `docs/seo-strategy.md` | 关键词与 URL 映射表 |
| `docs/content-guidelines.md` | 写作规范(新增内容前必读) |

## 构建命令

```bash
npm run dev        # 本地开发(搜索功能不可用,需构建后才有索引)
npm run build      # 构建 + 裁剪 sitemap + Pagefind 索引
npm run preview    # 预览产物
npm run validate   # 完整校验:check → build → links → seo → content
```

改完任何东西,提交前跑 `npm run validate`。

## 部署方式

Cloudflare Pages。完整步骤见 `docs/deployment.md`,包含创建项目、构建配置、域名绑定、pages.dev 处理、Search Console、Bing、IndexNow、部署后检查清单、回滚方法。

## 当前错误

无。`npm run validate` 五个环节全部通过。

## 新会话应从哪里继续

按 PROJECT_STATUS.md「下一步操作」执行。简要说:

1. 部署上线(推 Git → Cloudflare Pages → 绑域名 → 提交 sitemap)
2. **补充真实服务档案替换示例数据** —— 这是目前最大的缺口。`/directory/`、`/reviews/`、`/compare/` 三个栏目现在没有可索引的详情页,`/airport/`、`/stable/`、`/value/` 也因此缺少落地内容。
3. 扩展使用场景(当前 3 篇,是文章类集合里最薄的)

故障排查已覆盖规范列出的全部 16 个主题,客户端教程已覆盖 8 个主流客户端与平台,这两块不必再为凑数量新建。

## 新增内容时必须知道的约定

- 文件放 `src/content/<集合>/`,文件名即 slug。集合与 URL 对应关系见 `docs/deployment.md` 第 3 节。
- `dataStatus: sample` 必须同时 `noindex: true`,否则 `audit:content` 报错。
- `related` 格式为 `集合名/slug`,指向不存在的内容会被检查脚本拦截。
- `author` / `reviewer` 填 `src/content/authors/` 下的文件名(目前是 `mai-heng` 和 `lin-shu`)。
- 正文不写 H1(布局渲染 frontmatter 的 title),从 `##` 开始。
- 正文不写 FAQ / 相关阅读 / 参考来源章节,这些由布局从 frontmatter 渲染。
- 禁止绝对承诺用语,`audit:content` 会扫描并警告。

## 历史背景

本目录曾有一个 Vite+React SPA 旧站(react-snap 预渲染),重建前已被清空,无法枚举全部旧 URL。`public/_redirects` 用三条通配规则覆盖旧站已知路由模式(`/review/*` → `/reviews/`、`/tutorial/*` → `/clients/`、`/category/*` → `/directory/`),均按内容类型落到对应栏目页,未统一重定向到首页。映射说明见 `docs/redirect-map.csv`。

旧站的推广链接约定(供后续填充 `affiliateUrl` 时参考):飞猫云 → guangs.flycataff.com,其余 → qwerty.gsyaff.com,使用 `rel="nofollow sponsored"`。
