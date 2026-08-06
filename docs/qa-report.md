# QA 报告

生成日期:2026-08-05
构建版本:1.1.0(内容扩展后)

## 一、自动检查结果

全部通过。命令:`npm run validate`

| 检查 | 结果 | 说明 |
| --- | --- | --- |
| `astro check`(类型 + 内容 Schema) | ✅ 0 错误 0 警告 | 111 个文件 |
| `astro build` | ✅ 成功 | 96 个页面 |
| `prune-sitemap` | ✅ 成功 | 识别 16 个 noindex 页面,从 sitemap 移除 5 条 |
| Pagefind 索引 | ✅ 成功 | 中文索引 `pagefind.zh-cn_*.pf_meta` 已生成 |
| `audit:links` | ✅ 0 错误 0 警告 | 96 个页面全部 href 检查 |
| `audit:seo` | ✅ 0 错误 0 警告 | 可索引 80 个,sitemap 收录 80 个,完全一致 |
| `audit:content` | ✅ 0 错误 0 警告 | 62 个内容文件 |

## 二、验收标准逐项核对

| # | 标准 | 状态 | 依据 |
| --- | --- | --- | --- |
| 1 | `npm install` 成功 | ✅ | 依赖安装无阻塞错误 |
| 2 | `npm run build` 成功 | ✅ | 96 页面构建完成 |
| 3 | `npm run validate` 成功 | ✅ | 五个环节全部通过 |
| 4 | dist 目录完整 | ✅ | HTML、_astro、pagefind、sitemap、rss、robots、_headers、_redirects 齐备 |
| 5 | 首页正常 | ✅ | H1 唯一,12 个内容区块静态渲染 |
| 6 | 所有一级栏目正常 | ✅ | 10 个一级栏目 + start/choose 等全部生成 |
| 7 | 文章详情正常 | ✅ | 抽查故障排查页:H1、H2 锚点、FAQ、相关阅读、上下篇均正常 |
| 8 | 搜索正常 | ✅ | Pagefind UI 资源与中文索引均已生成 |
| 9 | Sitemap 正常 | ✅ | 80 条 URL,与可索引集合严格一致 |
| 10 | RSS 正常 | ✅ | 39 条内容,已排除示例数据页 |
| 11 | 404 正常 | ✅ | `/404.html` 生成,noindex,含搜索与栏目入口 |
| 12 | 没有空白页面 | ✅ | 内容检查强制正文长度,组件在无数据时不渲染 |
| 13 | 没有空 href | ✅ | `audit:links` 检查 `href=""` 与 `href="#"` |
| 14 | 没有明显错误链接 | ✅ | `audit:links` 0 个 404 内链 |
| 15 | 没有 Invalid Date | ✅ | `audit:seo` 扫描产物文本 |
| 16 | 没有重复 H1 | ✅ | `audit:seo` 检查每页 H1 数量 |
| 17 | 没有明显重复 Title | ✅ | 全站 title 去重检查 |
| 18 | 没有明显重复 Description | ✅ | 全站 description 去重检查 |
| 19 | Canonical 统一 | ✅ | 全部 `https://vpntuijian.cc` 前缀且自引用 |
| 20 | JSON-LD 有效 | ✅ | 每个 ld+json 块通过 JSON.parse |
| 21 | 移动端导航正常 | ✅ | 900px 断点切换,`aria-expanded` + Esc 关闭 |
| 22 | 表格移动端可用 | ✅ | `.table-wrap` 横向滚动,可键盘聚焦 |
| 23 | 重要图片有 alt 和尺寸 | ✅ | 检查通过(当前站内正文未使用图片,图标为内联 SVG) |
| 24 | 示例数据标识明确 | ✅ | 5 个 sample 页面均有徽章 + 独立提示框 + noindex |
| 25 | 推广关系说明清晰 | ✅ | 评测页与对比页默认渲染披露组件,有 `/disclosure/` 页 |
| 26 | 没有把 pages.dev 设为 Canonical | ✅ | `audit:seo` 显式拦截该形式 |
| 27 | 文档完整 | ✅ | 见下方交付清单 |
| 28 | SESSION_HANDOFF.md 已更新 | ✅ | 反映当前完成状态 |
| 29 | PROJECT_STATUS.md 显示完成状态 | ✅ | 阶段 10 完成 |
| 30 | 最终 QA 报告 | ✅ | 本文件 |

## 三、内容盘点

62 个内容文件,分布如下:

| 集合 | 数量 | 说明 |
| --- | --- | --- |
| troubleshooting | 16 | 故障排查,已覆盖规范列出的全部 16 个主题 |
| articles | 6 | 选择指南 4 篇 + 风险与避坑 2 篇 |
| clients | 8 | Clash、Shadowrocket、v2rayN、sing-box、Surge、Quantumult X、OpenWrt、Linux |
| protocols | 4 | IEPL/IPLC、线路类型、协议对比、Hysteria 2 |
| scenarios | 3 | AI 工具、流媒体、远程办公 |
| glossary | 18 | 术语词条 |
| providers | 3 | 服务档案(全部为示例) |
| reviews | 1 | 服务评测(示例) |
| comparisons | 1 | 服务对比(示例) |
| authors | 2 | 作者与审核者档案 |

页面产物 96 个,其中可索引 80 个。

## 四、数据状态盘点

**已核实(verified)**:全部 39 篇文章类内容。这些内容是方法性、原理性和流程性知识,不依赖对特定服务的实测数据。

**示例(sample,已 noindex)**:5 个页面

| 页面 | 类型 |
| --- | --- |
| `/directory/sample-xiguang/` | 服务档案 |
| `/directory/sample-xinglan/` | 服务档案 |
| `/directory/sample-xunhang/` | 服务档案 |
| `/reviews/sample-xiguang-review/` | 服务评测 |
| `/compare/sample-xiguang-vs-xinglan/` | 服务对比 |

这五个页面使用虚构的服务名和数据,用途是展示档案、评测、对比三类模板的信息结构。它们都带有数据状态徽章、独立的示例说明提示框,并设置了 `noindex`,不进入 sitemap 也不进入 RSS。

## 五、仍需人工补充的内容

以下项目无法在本次交付中完成,需要站点运营者补充:

### 必须补充(影响生产可用性)

1. **真实服务档案。** 当前 `src/content/providers/` 下三个档案全部是示例。需要用真实服务替换,并把 `dataStatus` 从 `sample` 改为 `verified` 或 `reference`,同时移除 `noindex: true`。字段结构已就绪,只需填充数据。
2. **推广链接与关系。** `providers` 的 `affiliateUrl` 和 `disclosure` 字段目前为空。添加时使用 `rel="nofollow sponsored"`。
3. **Google Search Console 验证与 sitemap 提交。** 见 `docs/deployment.md` 第 11 节。
4. **Bing Webmaster Tools 验证。** 见第 12 节。
5. **IndexNow 密钥。** 需要生成密钥、在 `public/` 下放置对应的 `<密钥>.txt` 文件、配置环境变量。脚本已就绪(`scripts/indexnow.mjs`)。

### 建议补充(提升质量)

6. **客户端教程截图。** 八篇教程目前用文字描述界面位置。补充截图时需遵守图片规范(英文文件名、width/height、alt、WebP/AVIF)。
7. **真实测速数据。** `TestResult` 与 `TestEnvironment` 组件已就绪,补充数据后可在评测页启用。
8. **联系方式。** `/contact/` 页面的具体联系渠道需要确认后填写。
9. **旧站 URL 精确映射。** 当前 `_redirects` 用三条通配规则覆盖旧站路由模式。上线后从 Search Console 的抓取报告中发现有价值的具体旧 URL 时,应补充一对一 301。

### 可选

10. **深色模式配色微调。** 已实现完整深色模式,但未在多种设备上做实际对比度验证。
11. **CSP 响应头。** 当前未配置,以免误拦截。如需添加,先验证主题切换、移动导航、Pagefind 三处脚本与样式不受影响。

## 六、未做自动化验证的项目

以下项目需要在真实浏览器环境中人工确认,本次交付未执行:

- Lighthouse 性能、可访问性、最佳实践、SEO 四项评分
- Core Web Vitals(LCP / CLS / INP)实测
- 多浏览器兼容性(Safari、Firefox、移动端浏览器)
- 键盘导航的完整走查
- 屏幕阅读器测试
- 富媒体结果测试工具对 JSON-LD 的验证

技术上已按目标设计:产物 JS 仅约 16KB(不含仅搜索页加载的 Pagefind),无外部字体、无第三方脚本、无客户端 hydration,图片均为内联 SVG 因此无布局偏移来源。但**实测数据未采集,不能声称已达成具体的性能指标**。

## 七、已知取舍

1. **标签页全部 noindex。** 规范允许「不生成或设 noindex, follow」两种处理。当前实现是:少于 3 篇文章的标签不生成页面,已生成的标签页统一 noindex。原因是现有标签与栏目分类重叠度高,单独索引价值有限。后续标签体系分化后可以为达标标签补充独立介绍并开放索引。

2. **未使用 MDX。** 当前内容用纯 Markdown 即可满足,组件通过布局层注入。若后续需要在正文中间插入交互组件,再引入 `@astrojs/mdx`。

3. **未使用 Astro Image 优化。** 站内正文暂无图片,图标全部为内联 SVG。补充截图时需要引入 `astro:assets` 并配置。

4. **相关文章补齐机制。** 手工 `related` 不足 4 条时用同集合文章按更新时间补齐。这保证了没有孤立页面,但补齐部分的相关性弱于手工指定。内容量增长后应提高手工指定的比例。

## 八、本轮内容扩展中发现并修复的问题

1.1.0 版本为 `audit-content.mjs` 增加了针对批量生成痕迹的检查(正文重复渲染模板区块、正文自带 H1、缺少表格与列表、跨文章开头雷同、跨文章元数据相同)。这些新检查对既有内容做回归时暴露了三个真实问题,均已修复:

| 问题 | 影响 | 处理 |
| --- | --- | --- |
| 三篇使用场景文章的 H2 标题完全相同 | 明显的模板化痕迹,违反内容规范 | 按各自主题重写为差异化标题 |
| 四篇协议文章收尾标题均为「常见误解」,开头均为「一句话…」句式 | 同上,程度较轻 | 差异化改写 |
| 评测示例页无表格无列表 | 该页作用是展示评测模板结构,纯段落形式没起到示范作用 | 服务信息改表格,优点与局限改要点列表 |

同时修正了检查脚本自身的一处误报:重复区块正则 `^##+\s*常见问题` 过宽,会把「常见问题与处理」这类独立章节误判为 FAQ 重复,已改为精确匹配同名标题。

### 抽查产物时发现的两个聚合逻辑缺陷

这两个问题自动检查发现不了(链接有效、页面正常),是核对 RSS 条目数时顺带查出来的:

| 问题 | 后果 | 处理 |
| --- | --- | --- |
| `getAllCards()` 不过滤 noindex,首页「最新更新」直接取前 N 条 | 示例数据页可能出现在首页,并被搜索引擎跟随 | 在 `getAllCards()` 源头排除 noindex,标签聚合同时受益 |
| RSS 按集合名硬编码排除 `reviews` / `comparisons` | 运营者把示例档案换成真实评测后(待办第一项),真实评测将永远进不了 RSS | 改为按 `noindex` 过滤,替换示例数据后自动生效 |

第二个尤其值得记录:它是一个只在完成待办事项时才会暴露的潜伏缺陷,按集合名过滤看起来能工作,实际表达的不是真正的意图。

**非缺陷告警:** 在已有内容缓存的情况下新增大量文件后,`astro build` 可能输出 glob-loader 的 `Duplicate id` 告警。已核实无重名文件、无嵌套目录,清除 `.astro` 与 `node_modules/.astro` 后重建即消失。处理方法已写入 `docs/deployment.md` 第 15 节。
