/**
 * SEO 检查:对构建产物 dist 做静态分析。
 * 检查项:title / description / H1 / canonical / robots / sitemap 一致性 / JSON-LD / 图片 alt。
 */
import { existsSync } from 'node:fs';
import { walk, read, htmlToUrl, Reporter } from './lib.mjs';

const DIST = 'dist';
const SITE = 'https://vpntuijian.cc';
const r = new Reporter('SEO 检查');

if (!existsSync(DIST)) {
  console.error('dist 不存在,请先运行 npm run build');
  process.exit(1);
}

const files = walk(DIST, '.html');
const titles = new Map();
const descriptions = new Map();
const indexableUrls = new Set();

const pick = (html, re) => {
  const m = html.match(re);
  return m ? m[1].trim() : null;
};

for (const file of files) {
  const url = htmlToUrl(DIST, file);
  const html = read(file);

  const title = pick(html, /<title>([\s\S]*?)<\/title>/i);
  const description = pick(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
  const canonical = pick(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
  const robots = pick(html, /<meta\s+name="robots"\s+content="([^"]*)"/i);
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  const noindex = (robots ?? '').includes('noindex');

  // 基础元数据
  if (!title) r.error(`${url} 缺失 title`);
  if (!description) r.error(`${url} 缺失 meta description`);
  if (description && description.length > 200) {
    r.warn(`${url} description 偏长(${description.length} 字符)`);
  }
  if (!canonical) r.error(`${url} 缺失 canonical`);

  // canonical 必须统一使用主域名,且指向自身
  if (canonical) {
    if (!canonical.startsWith(SITE)) {
      r.error(`${url} canonical 域名不正确: ${canonical}`);
    }
    if (canonical.includes('pages.dev') || canonical.startsWith('http://') || canonical.includes('://www.')) {
      r.error(`${url} canonical 使用了错误的域名形式: ${canonical}`);
    }
    // 404.html 是宿主的错误页面,不参与自引用校验
    if (url !== '/404.html' && canonical.startsWith(SITE)) {
      let canonicalPath = canonical.replace(SITE, '');
      try {
        canonicalPath = decodeURIComponent(canonicalPath);
      } catch {
        r.error(`${url} canonical 包含无效的百分号编码: ${canonical}`);
      }
      if (canonicalPath !== url) {
        r.error(`${url} canonical 未自引用,实际为 ${canonical}`);
      }
    }
  }

  // H1
  if (h1s.length === 0) r.error(`${url} 缺失 H1`);
  if (h1s.length > 1) r.error(`${url} 存在 ${h1s.length} 个 H1`);

  // 重复元数据(只统计可索引页面)
  if (!noindex) {
    indexableUrls.add(url);
    if (title) {
      if (!titles.has(title)) titles.set(title, []);
      titles.get(title).push(url);
    }
    if (description) {
      if (!descriptions.has(description)) descriptions.set(description, []);
      descriptions.get(description).push(url);
    }
  }

  // JSON-LD 必须是合法 JSON
  for (const m of html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi
  )) {
    try {
      JSON.parse(m[1]);
    } catch (e) {
      r.error(`${url} JSON-LD 解析失败: ${e.message}`);
    }
  }

  // Invalid Date
  if (html.includes('Invalid Date')) r.error(`${url} 页面包含 Invalid Date`);

  // 图片 alt 与尺寸
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    if (!/\balt=/.test(tag)) r.error(`${url} 存在缺失 alt 的图片: ${tag.slice(0, 80)}`);
    if (!/\bwidth=/.test(tag) || !/\bheight=/.test(tag)) {
      r.warn(`${url} 图片缺少 width/height: ${tag.slice(0, 80)}`);
    }
  }
}

// 重复 title / description
for (const [title, urls] of titles) {
  if (urls.length > 1) r.error(`重复 title「${title}」出现在: ${urls.join(', ')}`);
}
for (const [desc, urls] of descriptions) {
  if (urls.length > 1) {
    r.error(`重复 description「${desc.slice(0, 40)}…」出现在: ${urls.join(', ')}`);
  }
}

// Sitemap 与 noindex 一致性
const sitemapFiles = walk(DIST, '.xml').filter((f) => f.includes('sitemap'));
const sitemapUrls = new Set();
for (const f of sitemapFiles) {
  for (const m of read(f).matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const loc = m[1];
    if (loc.endsWith('.xml')) continue;
    sitemapUrls.add(loc.replace(SITE, ''));
  }
}

if (sitemapUrls.size === 0) r.error('sitemap 中没有任何页面 URL');

for (const url of sitemapUrls) {
  if (!indexableUrls.has(url)) {
    r.error(`sitemap 包含了 noindex 或不存在的页面: ${url}`);
  }
}

console.log(
  `已检查 ${files.length} 个页面,可索引 ${indexableUrls.size} 个,sitemap 收录 ${sitemapUrls.size} 个`
);
r.finish();
