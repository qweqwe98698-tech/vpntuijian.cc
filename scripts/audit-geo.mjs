/**
 * SEO 与 GEO 深度审计。
 *
 * 与 audit-seo.mjs 的分工:那个脚本做的是「有没有错」的硬性校验(缺失、重复、无效);
 * 这个脚本做的是「做到了什么程度」的覆盖率盘点 —— 孤立页面、内链深度、锚文本多样性、
 * 结构化数据类型覆盖,以及 GEO 可提取要素(直接答案、关键结论、表格、步骤、FAQ、
 * 时间标注、作者署名、来源)的落实比例。
 *
 * 只报告不阻断:输出报告供人判断,不因覆盖率不足而退出非零。
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { walk, read, htmlToUrl } from './lib.mjs';

const DIST = join(process.cwd(), 'dist');
const SITE = 'https://vpntuijian.cc';

if (!existsSync(DIST)) {
  console.error('dist 不存在,请先运行 npm run build');
  process.exit(1);
}

const files = walk(DIST, '.html');
const pages = new Map();

const pick = (h, re) => {
  const m = h.match(re);
  return m ? m[1].trim() : null;
};
const countOf = (h, re) => [...h.matchAll(re)].length;

for (const file of files) {
  const url = htmlToUrl(DIST, file);
  const html = read(file);
  const robots = pick(html, /<meta\s+name="robots"\s+content="([^"]*)"/i) ?? '';
  const noindex = robots.includes('noindex');

  const jsonLdTypes = [];
  for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const parsed = JSON.parse(m[1]);
      if (parsed['@type']) jsonLdTypes.push(parsed['@type']);
    } catch {
      jsonLdTypes.push('INVALID');
    }
  }

  // 正文文本量(去标签、去脚本样式)
  const bodyText = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
  const cjk = (bodyText.match(/[一-龥]/g) || []).length;

  // 站内链接(去重后的目标)
  const outLinks = new Set();
  const anchors = [];
  for (const m of html.matchAll(/<a\b[^>]*href="(\/[^"#?]*)"[^>]*>([\s\S]*?)<\/a>/gi)) {
    let href = m[1];
    try {
      href = decodeURIComponent(href);
    } catch {}
    if (!href.endsWith('/')) href = `${href}/`;
    outLinks.add(href);
    const text = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, '').trim();
    if (text) anchors.push({ href, text });
  }

  pages.set(url, {
    url,
    noindex,
    title: pick(html, /<title>([\s\S]*?)<\/title>/i),
    description: pick(html, /<meta\s+name="description"\s+content="([^"]*)"/i),
    canonical: pick(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i),
    h1: countOf(html, /<h1[^>]*>/gi),
    h2: countOf(html, /<h2[^>]*>/gi),
    jsonLdTypes,
    cjk,
    outLinks,
    anchors,
    // GEO 可提取要素
    directAnswer: html.includes('direct-answer') || html.includes('>直接答案<'),
    // 术语页的定义框同样是可被直接提取的答案单元
    definitionBox: html.includes('definition-box') || /什么是[^<]{1,20}</.test(html),
    keyTakeaways: html.includes('key-takeaways') || html.includes('>关键结论<'),
    tables: countOf(html, /<table[\s>]/gi),
    orderedLists: countOf(html, /<ol[\s>]/gi),
    faqItems: countOf(html, /class="faq-item"/g),
    timeTags: countOf(html, /<time\s+datetime=/gi),
    hasAuthor: /作者:|作者：/.test(bodyText),
    hasSources: html.includes('source-list') || html.includes('>参考来源<'),
    hasSpeedTest: html.includes('class="speedtest"') || html.includes('>本站实测数据<'),
    imgs: [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]),
  });
}

const all = [...pages.values()];
const indexable = all.filter((p) => !p.noindex && p.url !== '/404.html');

// 内链入度
const inbound = new Map(all.map((p) => [p.url, 0]));
for (const p of all) {
  if (p.noindex) continue;
  for (const href of p.outLinks) {
    if (href === p.url) continue;
    if (inbound.has(href)) inbound.set(href, inbound.get(href) + 1);
  }
}

// 从首页出发的点击深度
const depth = new Map([['/', 0]]);
let frontier = ['/'];
while (frontier.length) {
  const next = [];
  for (const u of frontier) {
    const p = pages.get(u);
    if (!p) continue;
    for (const href of p.outLinks) {
      if (!pages.has(href) || depth.has(href)) continue;
      depth.set(href, depth.get(u) + 1);
      next.push(href);
    }
  }
  frontier = next;
}

const pct = (n, d) => (d === 0 ? '—' : `${Math.round((n / d) * 100)}%`);
const line = (label, value, note = '') =>
  console.log(`  ${label.padEnd(26)} ${String(value).padStart(10)}  ${note}`);

console.log('\n══════ SEO / GEO 覆盖率审计 ══════\n');
console.log(`产物页面 ${all.length} 个,其中可索引 ${indexable.length} 个,noindex ${all.length - indexable.length} 个\n`);

// ---------- SEO ----------
console.log('【SEO 基础】');
line('有 title', indexable.filter((p) => p.title).length, pct(indexable.filter((p) => p.title).length, indexable.length));
line('有 description', indexable.filter((p) => p.description).length, pct(indexable.filter((p) => p.description).length, indexable.length));
line('canonical 自引用', indexable.filter((p) => {
  if (!p.canonical) return false;
  let c = p.canonical.replace(SITE, '');
  try { c = decodeURIComponent(c); } catch {}
  return c === p.url;
}).length, pct(indexable.filter((p) => p.canonical).length, indexable.length));
line('恰好 1 个 H1', indexable.filter((p) => p.h1 === 1).length, pct(indexable.filter((p) => p.h1 === 1).length, indexable.length));

const titleLens = indexable.filter((p) => p.title).map((p) => p.title.length);
line('title 长度中位数', titleLens.sort((a, b) => a - b)[Math.floor(titleLens.length / 2)] + ' 字符');
const longTitles = indexable.filter((p) => p.title && p.title.length > 40);
line('title 超 40 字符', longTitles.length, longTitles.length ? '(中文标题在 SERP 可能截断)' : '');

// 中文 description 的可见长度按像素算:Google 桌面摘要约 920px,全角字符约 14px,
// 因此实际显示上限约 65–80 个汉字 —— 不是按拉丁字符的 155–160 来衡量。
// 目标区间 80–110:占满可见区,并留一点供 Google 匹配查询词的余量。
const descLens = indexable.filter((p) => p.description).map((p) => p.description.length);
const sortedDesc = [...descLens].sort((a, b) => a - b);
line('description 中位数', sortedDesc[Math.floor(sortedDesc.length / 2)] + ' 字符', '(中文可见上限约 65–80)');
const tooShort = indexable.filter((p) => p.description && p.description.length < 60);
line('description < 60 字符', tooShort.length, tooShort.length ? '⚠ 未占满可见区' : '✓');
tooShort.slice(0, 10).forEach((p) => console.log(`      ${String(p.description.length).padStart(3)}  ${p.url}`));
const tooLong = indexable.filter((p) => p.description && p.description.length > 120);
line('description > 120 字符', tooLong.length, tooLong.length ? '(超出部分不会显示)' : '✓');
tooLong.slice(0, 10).forEach((p) => console.log(`      ${String(p.description.length).padStart(3)}  ${p.url}`));

console.log('\n【内链结构】');
const orphans = indexable.filter((p) => p.url !== '/' && inbound.get(p.url) === 0);
line('孤立页面(0 入链)', orphans.length, orphans.length ? '⚠' : '✓');
if (orphans.length) orphans.slice(0, 10).forEach((p) => console.log(`      ${p.url}`));

const unreachable = indexable.filter((p) => !depth.has(p.url));
line('首页不可达', unreachable.length, unreachable.length ? '⚠' : '✓');
if (unreachable.length) unreachable.slice(0, 10).forEach((p) => console.log(`      ${p.url}`));

const depths = indexable.filter((p) => depth.has(p.url)).map((p) => depth.get(p.url));
line('最大点击深度', Math.max(...depths));
const deep = indexable.filter((p) => (depth.get(p.url) ?? 99) > 3);
line('深度 > 3 的页面', deep.length, deep.length ? '⚠' : '✓');

const inboundVals = [...inbound.entries()].filter(([u]) => indexable.some((p) => p.url === u)).map(([, v]) => v);
line('平均入链数', (inboundVals.reduce((a, b) => a + b, 0) / inboundVals.length).toFixed(1));

// 锚文本多样性:同一目标是否被同一锚文本反复使用
const anchorMap = new Map();
for (const p of all) {
  if (p.noindex) continue;
  for (const a of p.anchors) {
    if (!anchorMap.has(a.href)) anchorMap.set(a.href, new Set());
    anchorMap.get(a.href).add(a.text);
  }
}
const targets = [...anchorMap.entries()].filter(([, s]) => s.size > 0);
const singleAnchor = targets.filter(([href, s]) => s.size === 1 && inbound.get(href) >= 5);
line('锚文本单一的热门页', singleAnchor.length, singleAnchor.length ? '(入链≥5 但只有一种锚文本)' : '✓');
singleAnchor.slice(0, 5).forEach(([href, s]) => console.log(`      ${href} → 「${[...s][0]}」×${inbound.get(href)}`));

console.log('\n【结构化数据】');
const typeCount = new Map();
for (const p of indexable) for (const t of p.jsonLdTypes) typeCount.set(t, (typeCount.get(t) ?? 0) + 1);
[...typeCount.entries()].sort((a, b) => b[1] - a[1]).forEach(([t, n]) => line(t, n));
line('无任何 JSON-LD', indexable.filter((p) => p.jsonLdTypes.length === 0).length);
line('JSON-LD 解析失败', indexable.filter((p) => p.jsonLdTypes.includes('INVALID')).length);

console.log('\n【图片】');
const allImgs = all.flatMap((p) => p.imgs);
line('img 标签总数', allImgs.length);
line('缺 alt', allImgs.filter((t) => !/\balt=/.test(t)).length);
line('缺 width/height', allImgs.filter((t) => !/\bwidth=/.test(t) || !/\bheight=/.test(t)).length);

// ---------- GEO ----------
// 内容页 = 有直接答案区块的页面(文章类),用于计算 GEO 要素覆盖
const content = indexable.filter((p) => p.directAnswer || p.faqItems > 0 || p.cjk > 800);

console.log('\n【GEO 可提取要素】');
console.log(`  内容页判定为 ${content.length} 个(有直接答案 / FAQ / 正文超 800 字)\n`);
line('直接答案区块', content.filter((p) => p.directAnswer).length, pct(content.filter((p) => p.directAnswer).length, content.length));
line('定义框(术语页)', content.filter((p) => p.definitionBox).length, pct(content.filter((p) => p.definitionBox).length, content.length));
line('关键结论列表', content.filter((p) => p.keyTakeaways).length, pct(content.filter((p) => p.keyTakeaways).length, content.length));
line('含表格', content.filter((p) => p.tables > 0).length, pct(content.filter((p) => p.tables > 0).length, content.length));
line('含有序步骤', content.filter((p) => p.orderedLists > 0).length, pct(content.filter((p) => p.orderedLists > 0).length, content.length));
line('含 FAQ', content.filter((p) => p.faqItems > 0).length, pct(content.filter((p) => p.faqItems > 0).length, content.length));
line('FAQ 条目总数', content.reduce((a, p) => a + p.faqItems, 0));
line('机器可读时间', content.filter((p) => p.timeTags > 0).length, pct(content.filter((p) => p.timeTags > 0).length, content.length));
line('作者署名', content.filter((p) => p.hasAuthor).length, pct(content.filter((p) => p.hasAuthor).length, content.length));
line('参考来源', content.filter((p) => p.hasSources).length, pct(content.filter((p) => p.hasSources).length, content.length));
line('第一方实测数据', all.filter((p) => p.hasSpeedTest).length, '(可被引用的独家数据)');

const noExtract = content.filter(
  (p) => !p.directAnswer && !p.definitionBox && !p.keyTakeaways && p.tables === 0 && p.faqItems === 0
);
line('无任何可提取结构', noExtract.length, noExtract.length ? '⚠' : '✓');
noExtract.slice(0, 8).forEach((p) => console.log(`      ${p.url}`));

console.log('\n【内容规模】');
const cjkVals = content.map((p) => p.cjk).sort((a, b) => a - b);
line('正文中位字数', cjkVals[Math.floor(cjkVals.length / 2)]);
const thin = indexable.filter((p) => p.cjk < 400);
line('薄内容(<400 字)', thin.length, thin.length ? '⚠ 见下' : '✓');
thin.slice(0, 8).forEach((p) => console.log(`      ${p.url}  ${p.cjk} 字`));

console.log('\n【关键词分工重叠检查】');
// 标题去掉站名后取首段作为主题,检查是否有页面主题高度相似
const norm = (t) => (t || '').replace(/｜VPN推荐指南$/, '').replace(/[:\s（）()「」,、。]/g, '');
const seen = new Map();
for (const p of indexable) {
  const k = norm(p.title).slice(0, 8);
  if (!k) continue;
  if (!seen.has(k)) seen.set(k, []);
  seen.get(k).push(p.url);
}
const overlaps = [...seen.entries()].filter(([, u]) => u.length > 1);
line('标题前缀重叠组', overlaps.length, overlaps.length ? '(需确认搜索意图是否不同)' : '✓');
overlaps.slice(0, 8).forEach(([k, u]) => console.log(`      「${k}…」 ${u.join('  ')}`));

console.log('\n══════ 审计结束 ══════\n');
