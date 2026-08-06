# 阶段 6–10:内容、SEO 验证、质量检查与部署交付

日期:2026-08-05

## 本批次完成的工作

### 内容补齐

前一批次的内容代理因会话额度中断,留下 12 个未完成文件。本批次由主会话直接补齐:

- 7 篇故障排查:wifi-ok-cellular-fails、subscription-update-failed、evening-peak-slow、v2rayn-cannot-connect、connected-but-no-internet、partial-nodes-fail、dns-resolution-failure
- 5 篇指南:plan-billing-cycle-guide、how-much-traffic-needed、multi-device-plan-guide、airport-runaway-warning-signs、payment-safety-guide

内容总量达到 44 个文件。

### 检查脚本

新增三个脚本:

- `scripts/audit-seo.mjs` —— SEO 元数据、H1、canonical、重复检测、JSON-LD、sitemap 一致性
- `scripts/audit-content.mjs` —— frontmatter 字段、日期、引用、sample 强制 noindex、绝对承诺用语
- `scripts/prune-sitemap.mjs` —— 构建后按产物实际 robots 值裁剪 sitemap

### 修复的问题

| 问题 | 原因 | 处理 |
| --- | --- | --- |
| 59 个标签页链接被报 404 | 磁盘目录名是解码后的中文,链接是百分号编码,检查脚本直接字符串比对 | `audit-links.mjs` 改为 `decodeURIComponent` 后比对 |
| 生成大量单篇标签页 | 无阈值控制 | 增加 `MIN_ARTICLES_PER_TAG = 3`,标签索引页同步过滤避免产生 404 内链 |
| 5 个示例数据页进入 sitemap | `@astrojs/sitemap` 的 filter 只能按路径判断,拿不到页面实际 robots 值 | 新增构建后裁剪脚本,扫描产物 HTML 为准 |
| `astro check` 报 changefreq 类型错误 | 字面量 `'weekly'` 不匹配 `EnumChangefreq` | 改用 `ChangeFreqEnum.WEEKLY` |
| Seo 组件 script 标签提示 | JSON-LD script 带属性但未声明 is:inline | 显式加 `is:inline` |
| ArticleLayout 未使用的导入 | 重构残留 | 移除 `toCard` |

### 文档

新增:README.md、CHANGELOG.md、docs/architecture.md、docs/design-system.md、docs/content-guidelines.md、docs/seo-strategy.md、docs/deployment.md、docs/qa-report.md、docs/redirect-map.csv、public/llms.txt、scripts/indexnow.mjs

更新:PROJECT_STATUS.md、SESSION_HANDOFF.md

## 最终检查结果

`npm run validate` 全部通过:

```
astro check      0 错误 0 警告(110 个文件)
astro build      76 个页面
prune-sitemap    14 个 noindex 页面,移除 5 条 URL
pagefind         中文索引已生成
audit:links      0 错误 0 警告
audit:seo        0 错误 0 警告(可索引 62 = sitemap 62)
audit:content    0 错误 0 警告(44 个内容文件)
```

## 产物核验

- `dist/` 76 个 HTML,`_astro` 约 16KB,pagefind 索引齐全
- 首页与文章页的正文、标题层级、FAQ、相关阅读均静态存在于 HTML 中,不依赖客户端 JS
- 文章页 JSON-LD 输出 TechArticle + BreadcrumbList + FAQPage
- RSS 25 条,已排除示例数据页
- OG 图为真实 1200×630 PNG

## 遗留事项

见 `docs/qa-report.md` 第五节(需人工补充)与第六节(需浏览器实测)。最关键的一项是用真实服务替换 3 个示例服务档案。

## 结论

项目达到可部署状态。阶段 0 至 10 全部完成。
