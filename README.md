# VPN推荐指南 (VPN Tuijian Guide)

> 选得明白,用得稳定,出问题能解决。

面向中文用户的网络代理服务(机场)知识博客。内容覆盖服务选择、客户端配置、节点与订阅管理、连接故障排查、线路与协议知识,以及风险提示。

站点地址:<https://vpntuijian.cc>

## 定位

网站围绕四个动作组织内容:

- **选** —— 按预算、设备和使用场景提供选择参考
- **测** —— 用统一模板展示服务信息、测试环境和更新状态
- **用** —— 客户端、设备和订阅的配置教程
- **修** —— 按故障现象组织的排查流程

其中故障排查和客户端教程是核心差异化内容。本站不做排行榜导航站,也不把页面做成注册链接集合。

## 技术栈

Astro 5(静态输出)+ TypeScript + Content Collections + 原生 CSS。搜索用 Pagefind(构建期静态索引),站点地图与 RSS 用 Astro 官方集成。没有引入 React/Vue/Tailwind/UI 框架/图标库。

部署到 Cloudflare Pages。

## 快速开始

```bash
npm install
npm run dev
```

开发服务器默认在 `http://localhost:4321`。搜索功能需要构建后才可用。

## 命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 本地开发 |
| `npm run build` | 构建 + 裁剪 sitemap + 生成 Pagefind 索引 |
| `npm run preview` | 预览构建产物 |
| `npm run check` | Astro 类型与内容 Schema 检查 |
| `npm run validate` | 完整校验(check → build → links → seo → content) |
| `npm run audit:links` | 内部链接检查 |
| `npm run audit:seo` | SEO 元数据与 sitemap 一致性检查 |
| `npm run audit:content` | 内容字段与引用检查 |

提交前跑 `npm run validate`。

## 目录

```
src/
├── components/         57 个 .astro 组件
├── layouts/            BaseLayout / SectionLayout / ArticleLayout
├── pages/              路由
├── content/            内容集合(Markdown)
├── lib/                site.ts / content.ts / schema.ts
├── styles/global.css   设计系统(CSS 变量)
└── content.config.ts   所有集合的 Schema
scripts/                零依赖检查脚本
docs/                   项目文档
public/                 静态资源、_headers、_redirects、robots.txt、llms.txt
```

## 新增内容

在 `src/content/<集合>/` 下新建 Markdown 文件,文件名即 URL slug。字段定义见 `src/content.config.ts`,必填字段缺失时构建会报错并指出具体位置。

集合与 URL 的对应关系、字段约定见 [docs/deployment.md](docs/deployment.md) 第 3 节。写作规范见 [docs/content-guidelines.md](docs/content-guidelines.md)。

## 内容原则

- 服务信息标注数据状态(已核实 / 参考信息 / 示例展示 / 等待更新 / 需重新核验)与核验日期。
- 标注为「示例展示」的页面使用示例数据展示结构,默认 `noindex`,不进入 sitemap 和 RSS。
- 不使用「绝对最好」「永远稳定」「100% 解锁」这类无法验证的表述。
- 含推广关系的内容明确标识,规则见 `/disclosure/`。

## 文档

| 文件 | 内容 |
| --- | --- |
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | 当前进度与已知问题 |
| [SESSION_HANDOFF.md](SESSION_HANDOFF.md) | 新会话接手指引 |
| [CHANGELOG.md](CHANGELOG.md) | 变更记录 |
| [docs/architecture.md](docs/architecture.md) | 技术架构与设计决策 |
| [docs/design-system.md](docs/design-system.md) | 设计系统 |
| [docs/content-guidelines.md](docs/content-guidelines.md) | 内容创作规范 |
| [docs/seo-strategy.md](docs/seo-strategy.md) | SEO 与 GEO 策略、关键词映射 |
| [docs/deployment.md](docs/deployment.md) | 部署与运维 |
| [docs/qa-report.md](docs/qa-report.md) | 质量检查报告与待补充项 |
| [docs/redirect-map.csv](docs/redirect-map.csv) | 旧站 URL 重定向映射 |

## 说明

本站内容用于教育与参考,不构成对任何服务的担保。请遵守所在地法律法规。
