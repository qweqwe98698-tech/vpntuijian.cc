# 部署文档

本项目为 Astro 静态站点,构建产物是纯静态文件,部署到 Cloudflare Pages。

## 1. 本地安装

要求 Node.js 当前 LTS 版本(项目在 Node 24 上验证通过)。

```bash
npm install
```

## 2. 本地开发

```bash
npm run dev
```

默认地址 `http://localhost:4321`。

注意:开发模式下站内搜索不可用,因为 Pagefind 索引在构建阶段生成。要预览搜索功能,先 `npm run build` 再 `npm run preview`。

## 3. 新增内容

内容都在 `src/content/` 下,按集合分目录。新增一篇文章就是新建一个 Markdown 文件,文件名即 URL slug。

| 集合目录 | 生成的 URL | 用途 |
| --- | --- | --- |
| `src/content/articles/` | `/guides/<slug>/` | 选择指南、风险与避坑类文章 |
| `src/content/clients/` | `/clients/<slug>/` | 客户端配置教程 |
| `src/content/troubleshooting/` | `/troubleshooting/<slug>/` | 故障排查 |
| `src/content/protocols/` | `/protocols/<slug>/` | 线路与协议知识 |
| `src/content/scenarios/` | `/scenarios/<slug>/` | 使用场景 |
| `src/content/reviews/` | `/reviews/<slug>/` | 服务评测 |
| `src/content/comparisons/` | `/compare/<slug>/` | 服务对比 |
| `src/content/providers/` | `/directory/<slug>/` | 服务档案 |
| `src/content/glossary/` | `/glossary/<slug>/` | 术语表 |
| `src/content/authors/` | 无独立页面 | 作者与审核者档案 |

字段定义见 `src/content.config.ts`。必填字段缺失时构建会报错并指出具体文件和字段,不会静默生成不完整的页面。

新增内容时的几个约定:

- `dataStatus` 为 `sample` 的内容必须同时设置 `noindex: true`,内容检查脚本会强制这一点。
- `related` 使用 `集合名/slug` 格式,指向不存在的内容会被检查脚本报错。
- `author` 和 `reviewer` 填 `src/content/authors/` 下的文件名。

## 4. 构建检查

提交前运行完整校验:

```bash
npm run validate
```

它依次执行:类型与内容 Schema 检查 → 构建 → 内部链接检查 → SEO 检查 → 内容字段检查。任何一步失败都会中断并返回非零退出码。

单独运行某一项:

```bash
npm run check
npm run audit:links
npm run audit:seo
npm run audit:content
```

## 5. 在 Cloudflare Pages 创建项目

1. 把代码推送到 Git 仓库(GitHub / GitLab)。
2. 在 Cloudflare 控制台进入 **Workers & Pages** → **Create** → **Pages** → **Connect to Git**。
3. 选择本项目仓库并授权。

## 6. 构建配置

| 配置项 | 值 |
| --- | --- |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Production branch | `main` |
| Node.js version | 当前 LTS(通过环境变量 `NODE_VERSION` 指定,例如 `22`) |

构建命令中已经包含 Pagefind 索引生成和 sitemap 裁剪,不需要额外配置构建步骤。

如果需要 IndexNow 密钥,在 Pages 项目的 **Settings** → **Environment variables** 中添加 `INDEXNOW_KEY`。不要把密钥写进仓库。

## 7. 绑定自定义域名

1. 在 Pages 项目的 **Custom domains** 中点击 **Set up a custom domain**。
2. 输入 `vpntuijian.cc`,按提示完成验证。
3. 如果域名的 DNS 已托管在 Cloudflare,记录会自动创建。

## 8. DNS 检查

绑定完成后确认:

- `vpntuijian.cc` 解析正常,HTTPS 证书已签发(通常几分钟内完成);
- 如果同时配置了 `www` 子域,应设置为 301 跳转到主域名,而不是两个域名都提供内容;
- 访问 `https://vpntuijian.cc/` 返回站点首页而不是 Cloudflare 的占位页。

## 9. pages.dev 域名处理

Cloudflare 会自动分配一个 `<project>.pages.dev` 域名。它会和主域名提供完全相同的内容,可能造成重复内容问题。

本项目的处理方式:所有页面的 canonical 都硬编码指向 `https://vpntuijian.cc`(见 `src/lib/site.ts` 中的 `SITE.url`),因此即使 `pages.dev` 域名被抓取,canonical 也会把权重指回主域名。`audit:seo` 脚本会检查是否有页面的 canonical 指向了 `pages.dev`、`www` 或 `http`。

如果希望更彻底,可以在 Cloudflare 的 **Redirect Rules** 中把 `*.pages.dev` 的请求 301 到主域名。

## 10. 提交 Sitemap

站点地图入口:`https://vpntuijian.cc/sitemap-index.xml`

它已经写入 `public/robots.txt`。sitemap 只包含可索引页面——构建后的 `scripts/prune-sitemap.mjs` 会扫描产物 HTML,把所有输出了 `noindex` 的页面从 sitemap 中移除,保证两者始终一致。

## 11. Google Search Console

1. 添加资源,选择「网址前缀」并填入 `https://vpntuijian.cc`。
2. 验证方式建议用 DNS 记录(域名在 Cloudflare 上时最方便)。
3. 验证通过后在「站点地图」中提交 `sitemap-index.xml`。
4. 首次收录通常需要数天,可以用「网址检查」工具对首页和几个重点页面请求编入索引。

## 12. Bing Webmaster Tools

1. 添加站点 `https://vpntuijian.cc`。
2. 可以直接从 Google Search Console 导入已验证的资源,省去重复验证。
3. 提交同一个 `sitemap-index.xml`。
4. 在 Bing 后台可以生成 IndexNow 密钥,供下一步使用。

## 13. IndexNow

IndexNow 用于在内容更新后主动通知搜索引擎,而不是被动等待抓取。

**首次配置:**

1. 生成一个 32 位十六进制字符串作为密钥(可以在 Bing Webmaster Tools 中生成)。
2. 在 `public/` 下创建文件 `<密钥>.txt`,内容就是该密钥本身。这个文件会随构建发布到 `https://vpntuijian.cc/<密钥>.txt`,搜索引擎用它验证域名归属。
3. 把密钥写入本地 `.env`(参考 `.env.example`),并在 Cloudflare Pages 的环境变量中添加同名变量。`.env` 已在 `.gitignore` 中,不会被提交。

**提交 URL:**

```bash
INDEXNOW_KEY=<你的密钥> node scripts/indexnow.mjs
```

默认提交 sitemap 中的全部 URL。也可以只提交指定页面:

```bash
INDEXNOW_KEY=<你的密钥> node scripts/indexnow.mjs /troubleshooting/all-nodes-timeout/ /clients/clash-subscription-import/
```

先确认将要提交的内容而不实际发送:

```bash
node scripts/indexnow.mjs --dry-run
```

注意:IndexNow 只是通知机制,不保证收录,也不影响排名。频繁重复提交没有意义,建议在有实质内容更新后再调用。

## 14. 部署后检查

每次上线后过一遍:

- [ ] 首页正常加载,导航和页脚链接可用
- [ ] 随机打开三篇文章,确认正文、目录、FAQ 和相关阅读都正常
- [ ] `/search/` 页面能搜出结果(Pagefind 索引已生成)
- [ ] `/sitemap-index.xml` 可访问,且不包含示例数据页面
- [ ] `/rss.xml` 可访问
- [ ] 访问一个不存在的路径,确认返回 404 页面
- [ ] 移动端打开首页和一篇文章,确认导航展开正常、表格可横向滚动
- [ ] 浏览器控制台无报错
- [ ] 检查响应头中 `X-Content-Type-Options`、`Referrer-Policy` 已生效

## 15. 常见构建问题

**`Duplicate id "xxx" found` 告警。** 在已有内容缓存的情况下一次性新增较多 Markdown 文件时,glob loader 可能重复加载条目。这不是文件重复(可以用下面的命令确认没有重名文件),而是内容层缓存陈旧:

```bash
find src/content -name "*.md" -exec basename {} \; | sort | uniq -d
```

如果上面的命令没有输出,说明没有真正的重名文件。清掉缓存后重建即可:

```bash
rm -rf .astro node_modules/.astro dist && npm run build
```

**Pagefind 提示 zh-cn 不支持词干还原。** 这是正常提示,不影响中文搜索可用性,只是不做跨词根匹配。

**Pagefind 建议改用 Component UI。** 当前使用的 Default UI 仍受支持,不需要处理。

## 16. 回滚方法

Cloudflare Pages 保留历史部署记录。

1. 进入 Pages 项目的 **Deployments** 列表。
2. 找到上一个正常的部署,点击右侧菜单中的 **Rollback to this deployment**。
3. 回滚是即时生效的,不需要重新构建。

如果问题出在源码,回滚后在本地修复并运行 `npm run validate`,通过后再推送。

## 附:响应头与重定向

- `public/_headers` 定义安全响应头与缓存策略。静态资源(`/_astro/*`,文件名带内容哈希)长缓存,HTML 不缓存以保证更新及时可见。
- `public/_redirects` 定义旧站 URL 的 301 映射,完整映射表见 `docs/redirect-map.csv`。
- 目前没有配置 CSP。如果后续要加,需要先完整验证站内脚本(主题切换、移动导航、Pagefind)和样式不被拦截,再逐步收紧。
