/**
 * 内部链接检查:
 * - 空 href / javascript:void
 * - 指向不存在页面的站内链接(404 内链)
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { walk, read, htmlToUrl, Reporter } from './lib.mjs';

const DIST = join(process.cwd(), 'dist');
const r = new Reporter('audit:links');

if (!existsSync(DIST)) {
  console.error('dist 不存在,请先运行 npm run build');
  process.exit(1);
}

const htmlFiles = walk(DIST, '.html');
const pages = new Set(htmlFiles.map((f) => htmlToUrl(DIST, f)));
// 非 HTML 静态资源也算有效目标
const assets = new Set(
  walk(DIST).map((f) => f.slice(DIST.length).replaceAll('\\', '/'))
);

const hrefRe = /href\s*=\s*"([^"]*)"/g;

for (const file of htmlFiles) {
  const url = htmlToUrl(DIST, file);
  const html = read(file);
  for (const m of html.matchAll(hrefRe)) {
    const href = m[1];
    if (href === '' || href === '#') {
      r.error(`${url} 存在空链接 href="${href}"`);
      continue;
    }
    if (href.startsWith('javascript:')) {
      r.error(`${url} 使用了 javascript: 链接`);
      continue;
    }
    if (!href.startsWith('/')) continue; // 外链与锚点不检查
    // 目录名在磁盘上是解码后的形式,链接可能是百分号编码,需先解码再比对
    let clean = href.split('#')[0].split('?')[0];
    try {
      clean = decodeURIComponent(clean);
    } catch {
      r.error(`${url} 链接包含无效的百分号编码: ${href}`);
      continue;
    }
    if (clean === '/') continue;
    const asPage = clean.endsWith('/') ? clean : `${clean}/`;
    if (pages.has(asPage)) continue;
    if (assets.has(clean)) continue;
    // sitemap 等构建产物
    if (clean.startsWith('/sitemap') || clean.startsWith('/pagefind/')) continue;
    r.error(`${url} 内链 404: ${href}`);
  }
}

console.log(`已检查 ${htmlFiles.length} 个页面`);
r.finish();
