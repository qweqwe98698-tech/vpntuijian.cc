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

它依次执行:类型与内容 Schema 检查 → 构建 → 内部链接检查 → SEO 检查 → 内容字段检查 → SEO/GEO 覆盖率审计。任何一步失败都会中断并返回非零退出码。

单独运行某一项:

```bash
npm run check
npm run audit:links
npm run audit:seo
npm run audit:content
npm run audit:geo
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

IndexNow 密钥在 Pages 项目的 **Settings** → **Environment variables** 中添加 `INDEXNOW_KEY`。该密钥按协议设计即为公开,验证文件需随仓库发布,详见第 13 节。

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

**本站已配置的密钥:**

```
62402f2b4fad24d296a81fca429c33d5
```

验证文件已随仓库提交:`public/62402f2b4fad24d296a81fca429c33d5.txt`,上线后可通过
`https://vpntuijian.cc/62402f2b4fad24d296a81fca429c33d5.txt` 访问。

**关于「这个密钥算不算机密」:**

不算。IndexNow 的密钥**按协议设计就是公开的** —— 搜索引擎必须能读取 `https://<域名>/<密钥>.txt`
来验证你确实控制这个域名,所以该文件必须随站点发布,也因此需要提交进仓库。

它不是访问凭证:拿到密钥的人只能提交**你这个域名下的 URL**,最坏情况是触发一些无意义的
重新抓取请求,不能读取或修改任何数据。这一点和 API Key、数据库密码性质完全不同,
不要套用「密钥一律不入库」的规则。

需要更换时,生成新的 32 位十六进制字符串,替换 `public/` 下的验证文件并更新环境变量即可,
旧密钥自然失效。

**在 Cloudflare Pages 配置环境变量:**

进入 Pages 项目 → **Settings** → **Environment variables**,添加:

| 变量名 | 值 |
| --- | --- |
| `INDEXNOW_KEY` | `62402f2b4fad24d296a81fca429c33d5` |

本地运行脚本时,把同样的值写进 `.env`(参考 `.env.example`)。

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

## 14. robots.txt 与 AI 爬虫策略(重要)

### Cloudflare 会覆盖你的 robots.txt

仓库里的 `public/robots.txt` **不是线上最终生效的版本**。Cloudflare 会在其前面注入一段托管内容,标记为
`# BEGIN Cloudflare Managed content` 到 `# END Cloudflare Managed Content`。

默认注入的内容会拦截 AI 爬虫:

```
User-agent: *
Content-Signal: search=yes,ai-train=no,use=reference

User-agent: GPTBot          Disallow: /
User-agent: ClaudeBot       Disallow: /
User-agent: Google-Extended Disallow: /
User-agent: Bytespider      Disallow: /
User-agent: CCBot           Disallow: /
（以及 Amazonbot、Applebot-Extended、meta-externalagent 等）
```

### 本站的决定:关闭该拦截

**已决定关闭 Cloudflare 的 AI 爬虫拦截。** 理由记录如下,以免日后有人看到 robots.txt 里
没有 AI 拦截,误以为是配置遗漏又加回去。

**1. 它挡不住真正需要担心的事。**
`Google-Extended` 控制的是 Gemini 与 Vertex AI 的接地和训练,**不影响 Google AI 概览**
—— AI 概览走的是普通 Googlebot。开着这个拦截的实际效果是:内容照样被 AI 概览摘要,
而 Gemini 里的引用位却主动放弃了。属于纯亏。

同理,名单里拦的 `GPTBot` 是 OpenAI 的训练爬虫,ChatGPT 搜索引用走的是另一个 UA,
不在该名单内。

**2. 本站的内容结构是为 GEO 建的。**
522 条 FAQ、75% 页面带直接答案区块、DefinedTerm 结构化数据、可提取的表格与有序步骤
—— 这些投入只有在 AI 爬得到时才有回报。

**3. 第一方实测数据是本站最可能被引用的资产。**
九家服务在同一工具、同一网络下的测速结果,是其他站点无法复制的数据。

**4. 对本站的商业模式,被引用优于不出现。**
「品牌名怎么样」这类查询是商业意图,用户看到 AI 给出的实测数字后,仍需到站上看套餐、
优惠码与注册入口。真正会被 AI 消化掉的是纯信息型查询(如「IEPL 是什么意思」),
而那类页面本就不是转化页。

### 关闭位置

Cloudflare 控制台 → 对应域名 → **安全性 → 机器人(Bot)** → 找 **AI 抓取工具控制 /
AI Crawl Control**(不同账户界面措辞可能不同,也可能叫「管理 robots.txt」),
关闭 AI 爬虫拦截或托管 robots.txt。

### 关闭后如何验证

```bash
curl -s https://vpntuijian.cc/robots.txt
```

**正确的结果**应该只剩本站自己的内容,不含 `Cloudflare Managed content` 区块:

```
User-agent: *
Allow: /
Disallow: /search/

Sitemap: https://vpntuijian.cc/sitemap-index.xml
```

判断标准:输出里**不应出现** `GPTBot`、`ClaudeBot`、`Google-Extended`、`Content-Signal`
这些字样。只要还能搜到它们,说明拦截仍然生效。

### 需要留意的不确定性

各家 AI 爬虫的 UA 名称、以及每个名称实际控制什么,这几年一直在变。上面的判断基于当前
普遍情况。关闭后建议过一到两周在 Search Console 的抓取统计里对比一下实际变化,
不要假设配置改了效果就一定符合预期。

## 15. 部署后检查

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

## 16. 常见构建问题

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

## 17. 回滚方法

Cloudflare Pages 保留历史部署记录。

1. 进入 Pages 项目的 **Deployments** 列表。
2. 找到上一个正常的部署,点击右侧菜单中的 **Rollback to this deployment**。
3. 回滚是即时生效的,不需要重新构建。

如果问题出在源码,回滚后在本地修复并运行 `npm run validate`,通过后再推送。

## 附:响应头与重定向

- `public/_headers` 定义安全响应头与缓存策略。静态资源(`/_astro/*`,文件名带内容哈希)长缓存,HTML 不缓存以保证更新及时可见。
- `public/_redirects` 定义旧站 URL 的 301 映射,完整映射表见 `docs/redirect-map.csv`。
- 目前没有配置 CSP。如果后续要加,需要先完整验证站内脚本(主题切换、移动导航、Pagefind)和样式不被拦截,再逐步收紧。
