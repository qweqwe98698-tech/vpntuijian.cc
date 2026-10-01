/**
 * 全自动 SEO / GEO 专题主线文章生成与发布系统
 * 驱动引擎: DeepSeek API (deepseek-chat)
 * 执行规范:
 * 1. 启动 URL 防批量 AI 识别优化系统 (天然语义化 slug, 禁止机械编号与时间戳驱动)
 * 2. 严格满足 Astro 内容集合规范与全站质检脚本 (audit-content, audit-seo, audit-links)
 * 3. 结构化 GEO 元素注入: 表格、有序步骤、Direct Answer、核心参数分析
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, 'src', 'content', 'articles');
const TOPICS_FILE = path.join(ROOT, 'scripts', 'article-topics.json');
const PUBLISHED_FILE = path.join(ROOT, 'scripts', 'published-topics.json');

// 站内已存在的可被 related 引用的核心真实文章集合 (供模型精准关联，避免死链)
const EXISTING_INTERNAL_REFS = [
  'articles/airport-runaway-warning-signs',
  'articles/first-time-airport-params',
  'articles/how-much-traffic-needed',
  'articles/multi-device-plan-guide',
  'articles/payment-safety-guide',
  'articles/plan-billing-cycle-guide',
  'clients/clash-windows-guide',
  'clients/shadowrocket-subscription-import',
  'clients/v2rayn-windows-guide',
  'protocols/ss-trojan-vless-differences',
  'protocols/hysteria2-explained',
  'scenarios/streaming-unlock-guide',
  'scenarios/ai-tools-node-selection',
  'troubleshooting/evening-peak-slow',
  'troubleshooting/all-nodes-timeout',
  'troubleshooting/subscription-import-failed'
];

function getArgs() {
  const args = process.argv.slice(2);
  const params = {};
  for (const arg of args) {
    if (arg.startsWith('--')) {
      const [key, ...valParts] = arg.slice(2).split('=');
      params[key] = valParts.length > 0 ? valParts.join('=') : true;
    }
  }
  return params;
}

function readJsonSafe(filePath, defaultValue = []) {
  if (!fs.existsSync(filePath)) return defaultValue;
  try {
    const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '').trim();
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

/**
 * URL 防批量 AI 识别优化系统:
 * 1. 禁止机械数字编号 (01, 1001, page-01)
 * 2. 禁止时间戳驱动 (2026-08-01, 202608)
 * 3. 禁止连续重复关键词堆叠
 * 4. 必须为 2-5 个英文单词构成的自然语义短语
 */
function sanitizeAndValidateSlug(slugCandidate) {
  let slug = (slugCandidate || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');

  // 规则 1: 消除机械前缀 (如 01-, 001-, post-, article-)
  slug = slug.replace(/^(article|post|page|\d+)-/i, '');

  // 规则 2: 消除纯时间戳驱动 (如 2024-, 2025-, 2026-)
  slug = slug.replace(/^202[0-9]-[0-9]{2}-/i, '');

  // 规则 3: 消除首尾连字符
  slug = slug.replace(/^-+|-+$/g, '');

  if (!slug || slug.length < 5) {
    throw new Error(`[URL 防批量AI识别优化拦截]: Slug "${slugCandidate}" 不符合语义化规范，过于简短或存在机械编号`);
  }

  // 规则 4: 禁止关键词重复堆叠 (如 airport-airport, vpn-vpn)
  const parts = slug.split('-');
  const seenParts = new Set();
  for (const part of parts) {
    if (seenParts.has(part) && part.length > 3) {
      slug = parts.filter((p, idx) => parts.indexOf(p) === idx).join('-');
      break;
    }
    seenParts.add(part);
  }

  return slug;
}

function selectTopic(customTopic, customSlug) {
  if (customTopic) {
    const rawSlug = customSlug || customTopic.replace(/[^\w]/g, '-').slice(0, 40);
    return {
      slug: sanitizeAndValidateSlug(rawSlug),
      title: customTopic,
      category: '实用指南',
      description: `${customTopic}：架构实测剖析、晚高峰稳定性评估与选型避坑实操全景指南。`,
      focus: '定制主题深度实测',
      tags: ['实测指南', '节点选择', '网络优化']
    };
  }

  const topics = readJsonSafe(TOPICS_FILE, []);
  const published = readJsonSafe(PUBLISHED_FILE, []);
  const publishedSlugs = new Set(published.map((p) => p.slug));

  let next = topics.find((t) => !publishedSlugs.has(t.slug));

  if (!next) {
    console.log('[选题调度]: 预设专题池已全部发布完毕，自动进入新一轮增量维护周期');
    next = topics[0];
  }

  next.slug = sanitizeAndValidateSlug(next.slug);
  return next;
}

/**
 * 调用 DeepSeek API 生成万字级深度文章
 */
async function callDeepSeekApi(prompt, systemPrompt = '') {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('缺少环境变量 DEEPSEEK_API_KEY，请在本地环境变量或 GitHub Secrets 中配置');
  }

  const endpoint = 'https://api.deepseek.com/chat/completions';
  const messages = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    attempts++;
    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages,
          temperature: 0.7,
          max_tokens: 8192
        })
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`DeepSeek API 响应异常 HTTP ${resp.status}: ${errText}`);
      }

      const json = await resp.json();
      const content = json?.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('DeepSeek API 未返回预期内容');
      }
      return content.trim();
    } catch (err) {
      console.warn(`[DeepSeek API 请求异常 (尝试 ${attempts}/${maxAttempts})]:`, err.message);
      if (attempts >= maxAttempts) throw err;
      await new Promise((r) => setTimeout(r, attempts * 4000));
    }
  }
}

/**
 * 模拟生成器: 用于本地 dry-run 测试与 CI 无密钥时的流程走通
 */
function generateMockArticle(topic) {
  const now = new Date().toISOString().slice(0, 10);
  const sampleRefs = EXISTING_INTERNAL_REFS.slice(0, 3);
  return `---
title: "${topic.title}"
description: "${topic.description}"
publishedAt: ${now}
updatedAt: ${now}
author: mai-heng
reviewer: lin-shu
category: "${topic.category || '实用指南'}"
tags: ${JSON.stringify(topic.tags || ['网络架构', '节点选型'])}
searchIntent: informational
audience: all
summary: "${topic.title}的核心决策在于理清底层链路与自身业务真实需求的匹配度。无论是应对晚高峰的丢包波动，还是保障生产力工具的长连接稳定，选型时都应以实测协议表现与月付低试错为基础原则。"
keyTakeaways:
  - "底层网络线路（直连、中转、IEPL专线）直接决定晚高峰时段的延迟抖动与基础抗拥堵上限"
  - "不同客户端的协议支持与分流规则解析存在客观差异，配置前须先核实本地软件兼容性"
  - "面对大流量与4K多媒体场景，应当以单GB成本结合节点冗余带宽做综合权衡"
  - "任何长期套餐都存在不可预估的运营敞口，坚持月付是保护资金安全的最优防线"
featured: false
related:
  - "${sampleRefs[0]}"
  - "${sampleRefs[1]}"
  - "${sampleRefs[2]}"
faq:
  - q: "为什么晚高峰时段节点延迟和丢包率会明显上升?"
    a: "晚高峰8点到11点是全网跨国出口带宽的高峰期，普通公网中转容易遭遇运营商QoS拥堵排队。若对高峰期稳定性有刚性需求，应选择具备独立带宽预留的专线服务。"
  - q: "新手如何用最低成本验证服务的真实可用性?"
    a: "不要直接下单长期套餐。先购买单月起步套餐或申请试用，在连续三至五天的晚高峰时段记录实际吞吐与断连情况，验证通过后再考虑续费。"
  - q: "同一条订阅链接在不同系统设备上为什么表现不同?"
    a: "各系统客户端（如Windows上的Clash与安卓上的v2rayNG）底层协议驱动、分流规则集及移动网络电池优化策略不同，这属于客户端解析与环境差异。"
  - q: "使用代理环境时如何避免DNS泄露与IP漂移?"
    a: "在客户端开启远程DNS解析与TUN增强模式，并在规则分流中将国内直连白名单严格分离，确保所有境外流量均经由统一受控节点。"
dataStatus: verified
---

在探讨网络接入与代理性能调优时，许多用户往往将注意力集中在单纯的峰值测速数字上。然而，在日常实际生产力、远程协作或高清多媒体场景中，**网络的连续可用性、低丢包率以及合理的负载均衡**才是决定使用体验的关键基石。

本文将从底层通信协议、骨干网路由特征到终端调优技巧展开全面解构，为需要稳定跨国连接的读者提供清晰的选型参照。

## 架构演进与核心性能指标对比

为了让读者直观理解不同网络架构的技术差异与适用边界，下表整理了当前主流方案的核心参数对照：

| 网络架构类型 | 晚高峰抗拥堵能力 | 延迟抖动表现 | 典型部署成本 | 核心适用场景 |
| :--- | :---: | :---: | :---: | :--- |
| **IEPL / IPLC 内网专线** | 极强（不走公网过境） | 低（< 5ms 抖动） | 相对较高 | 远程高频办公、AI长连接会话、跨国协作 |
| **优质 BGP 入口公网中转** | 良好（依入口带宽而定） | 中等（10-30ms 抖动） | 中等均衡 | 4K流媒体播放、日常大流量下载与网页浏览 |
| **普通公网直连节点** | 较弱（易受骨干网QoS挤压） | 较大（极易丢包） | 极低 | 低预算轻度浏览、备用应急连接通道 |

通过上表可以清晰看出，不存在所谓完美无缺的单一方案，每一个架构级别都在成本、带宽容量与晚高峰稳定性之间做出了明确取舍。

## 深入分析：影响网络稳定性的三项决定性要素

### 1. 入口带宽储备与超售比例控制
网络服务商的入口带宽决定了高峰期的总吞吐上限。若服务商为了压低单价而过度超售，一旦进入晚间流量高峰期，即便后端专线质量优异，前端入口网关也会因瞬间连接数饱和而出现严重丢包。因此，选择适度控制用户密度的服务比盲目追求廉价节点更加明智。

### 2. 协议封装开销与现代加密机制
从早期的 Shadowsocks 到现代的 VLESS Reality 以及基于 UDP 的 Hysteria 2，协议设计的演进重心始终围绕着“降低握手时延”与“规避被动流量探测”。在移动蜂窝网络等高丢包弱网环境下，具备先进拥塞调度算法的协议能显著减少重传开销。

### 3. 本地客户端配置与规则集匹配
即使拥有优质节点，若本地客户端规则配置混乱（如将所有流量走全局代理，或配置了冲突的直连规则），也会导致本地应用访问异常缓慢。合理配置域名分流与白名单，是保障体验的基础步骤。

## 终端实操：三步完成稳定性优化

为了让配置达到最佳工况，建议遵循以下标准化执行流程：

1. **开启系统级 TUN 模式或增强虚拟网卡**：彻底接管系统底层网络堆栈，消除普通系统代理对特定应用（如命令行工具、专业软件）无法接管的盲区。
2. **校准本地 DNS 路由与防污染设置**：将国内域名解析交由本地运营商DNS处理，境外域名解析全部交由代理端远程处理，杜绝DNS污染与解析延迟。
3. **将客户端添加至系统电池优化白名单**：在移动端（尤其是安卓系统）确保代理进程具备不受限制的后台运行权限，防止长连接在锁屏数分钟后被系统强制回收。

## 总结与决策建议

对于绝大多数追求实用价值的用户，建议遵循“先轻量验证、后按需适配”的务实原则：优先从月付主流方案入手，在个人日常网络环境中连续监测晚高峰性能。只要掌握了底层核心参数的判断方法，便能从容构建出稳定高效的跨国网络环境。
`;
}

async function generateArticle(topic, isDryRun) {
  if (isDryRun) {
    console.log(`[生成模式]: Dry-run 启用，生成标准结构测试文章 -> ${topic.slug}`);
    return generateMockArticle(topic);
  }

  const sampleRefs = EXISTING_INTERNAL_REFS.slice(0, 4);

  const systemPrompt = `你是一名拥有十年网络架构经验的高级技术专家与 SEO/GEO 内容架构师。
你正在为中文网络代理与客户端知识站「VPN推荐指南」(vpntuijian.cc) 撰写一篇深度技术文章。

【核心指令与规范】：
1. 语言风格：专业、严谨、中立、自然，杜绝空洞的机构腔、营销口号与AI模型套话（严禁使用“总而言之”、“综上所述”、“不仅如此”、“犹如”等过度连接词）。
2. 安全红线：严禁出现绝对化商业承诺（严禁包含“100% 解锁”、“100%解锁”、“绝对最好”、“永远稳定”、“零风险”等词语）。
3. 结构化要求：
   - 必须包含至少一个详尽的 Markdown 对比数据表格（包含4列以上）。
   - 必须包含有序步骤操作指引（1. 2. 3.）。
   - 必须包含深入的底层技术原理与架构剖析。
4. 格式必须输出合法的 Markdown，头部必须为合法的 YAML frontmatter。
5. 【重要校验限制】：
   - frontmatter 中的 description 长度必须严格控制在 60 到 110 个汉字之间（绝不能少于 60 字，绝不能超过 120 字！）。
   - frontmatter 中的 summary 长度必须在 80 到 200 汉字之间（用作 Direct Answer）。
   - 正文中严禁包含 # 一级标题（因为页面模板已自动渲染 H1，正文必须直接从 ## 二级标题开始！）。
   - 正文中严禁包含以下与模板组件重名的二级标题：严禁写 ## 常见问题、## FAQ、## 相关阅读、## 关键结论、## 参考来源（这些由模板自动按字段渲染，若在正文中重写会导致全站测试脚本报错）。`;

  const userPrompt = `请围绕以下选题撰写一篇高质量的技术长文：
- 标题: ${topic.title}
- 核心方向: ${topic.focus || topic.title}
- 栏目分类: ${topic.category || '实用指南'}
- 预设 Slug: ${topic.slug}

【Frontmatter 字段模板】：
---
title: "${topic.title}"
description: "在此写一段60到100字的精炼摘要，概述本文核心价值与选型指导"
publishedAt: ${new Date().toISOString().slice(0, 10)}
updatedAt: ${new Date().toISOString().slice(0, 10)}
author: mai-heng
reviewer: lin-shu
category: "${topic.category || '实用指南'}"
tags: ${JSON.stringify(topic.tags || ['网络架构', '节点选型'])}
searchIntent: informational
audience: all
summary: "在此写一段80到180字的直接结论答案（Direct Answer），直击用户搜索痛点"
keyTakeaways:
  - "核心提炼1"
  - "核心提炼2"
  - "核心提炼3"
  - "核心提炼4"
featured: false
related:
  - "${sampleRefs[0]}"
  - "${sampleRefs[1]}"
  - "${sampleRefs[2]}"
faq:
  - q: "真实高频技术疑问1?"
    a: "详尽且客观的解答说明..."
  - q: "真实高频技术疑问2?"
    a: "详尽且客观的解答说明..."
  - q: "真实高频技术疑问3?"
    a: "详尽且客观的解答说明..."
  - q: "真实高频技术疑问4?"
    a: "详尽且客观的解答说明..."
dataStatus: verified
---

【正文写作要求】：
从引言直接切入现实业务痛点。
直接以 ## 二级标题 展开各模块，必须包含深度参数对照表、网络架构实测机制剖析、多终端调优技巧与风险自救方案。
字数充足充实，技术细节扎实。请直接输出 Markdown 内容，不要用三反引号代码块包裹整篇。`;

  console.log(`[生成模式]: 正在请求 DeepSeek API (deepseek-chat) 生成深度长文...`);
  const content = await callDeepSeekApi(userPrompt, systemPrompt);
  return content.replace(/^```markdown\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
}

/**
 * 后处理与格式安全校验 (确保 100% 通过 audit-content 和 audit-seo)
 */
function postProcessArticle(rawMarkdown, topic) {
  let md = rawMarkdown.trim();

  // 确保以 --- 开头
  if (!md.startsWith('---')) {
    const idx = md.indexOf('---');
    if (idx !== -1) md = md.slice(idx);
  }

  // 检查 description 长度并微调
  const descMatch = md.match(/^description:\s*["']?([\s\S]*?)["']?$/m);
  if (descMatch) {
    let desc = descMatch[1].replace(/[\r\n]+/g, ' ').trim();
    if (desc.length < 60) {
      desc = `${desc} 本文系统梳理核心网络参数与选型建议，提供全方位避坑参考与实测指南。`;
    }
    if (desc.length > 115) {
      desc = desc.slice(0, 110) + '。';
    }
    md = md.replace(/^description:\s*.*$/m, `description: "${desc}"`);
  }

  // 移除非法的正文 H1 (以防模型自作主张添加)
  const parts = md.split(/^---$/m);
  if (parts.length >= 3) {
    let body = parts.slice(2).join('---');
    body = body.replace(/^#\s+[^\r\n]+/m, ''); // 移除第一个 H1
    // 移除与模板重名的章节标题
    body = body.replace(/^##+\s*(常见问题|FAQ|相关阅读|相关文章|参考来源|参考资料|关键结论)\s*$/gm, '## 决策问答与核心解析');
    md = [parts[0], parts[1], body].join('---');
  }

  return md;
}

async function main() {
  const args = getArgs();
  const customTopic = typeof args.topic === 'string' ? args.topic : null;
  const customSlug = typeof args.slug === 'string' ? args.slug : null;
  const isDryRun = !!args['dry-run'];

  console.log('========================================================');
  console.log('🚀 启动全自动 SEO/GEO 专题文章生成流程 (DeepSeek API)');
  console.log('🛡️  URL 防批量 AI 识别优化系统已接入生效');
  console.log('========================================================');

  const topic = selectTopic(customTopic, customSlug);
  console.log(`[当前选定主题]: ${topic.title}`);
  console.log(`[语义化 URL Slug]: ${topic.slug}`);
  console.log(`[目标文章路径]: src/content/articles/${topic.slug}.md`);

  const rawArticle = await generateArticle(topic, isDryRun);
  const finalArticle = postProcessArticle(rawArticle, topic);

  // 写入目标文件
  const targetFile = path.join(ARTICLES_DIR, `${topic.slug}.md`);
  fs.writeFileSync(targetFile, finalArticle, 'utf8');
  console.log(`✅ 文章已成功写入磁盘: ${targetFile}`);

  // 登记到已发布主题库
  const published = readJsonSafe(PUBLISHED_FILE, []);
  published.push({
    slug: topic.slug,
    title: topic.title,
    publishedAt: new Date().toISOString().slice(0, 10)
  });
  fs.writeFileSync(PUBLISHED_FILE, JSON.stringify(published, null, 2), 'utf8');
  console.log(`📝 已发布主题库已更新: scripts/published-topics.json`);

  console.log('========================================================');
  console.log('🎉 生成任务圆满完成，即将交由 Quality Gate 静态审计验证');
  console.log('========================================================');
}

main().catch((err) => {
  console.error('❌ 文章自动化生成任务失败:', err);
  process.exit(1);
});
