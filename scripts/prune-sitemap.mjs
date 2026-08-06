/**
 * 构建后处理:把 noindex 页面从 sitemap 中移除。
 *
 * @astrojs/sitemap 在构建时不知道每个页面的 robots 值,只能按路径过滤。
 * 这里直接扫描产物 HTML,以页面实际输出的 robots 标签为准裁剪 sitemap,
 * 保证 sitemap 收录集合与可索引集合始终一致。
 */
import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { walk, read, htmlToUrl } from './lib.mjs';

const DIST = join(process.cwd(), 'dist');
const SITE = 'https://vpntuijian.cc';

if (!existsSync(DIST)) {
  console.error('dist 不存在,请先运行构建');
  process.exit(1);
}

// 收集所有 noindex 页面的 URL 路径
const noindexPaths = new Set();
for (const file of walk(DIST, '.html')) {
  const html = read(file);
  const m = html.match(/<meta\s+name="robots"\s+content="([^"]*)"/i);
  if (m && m[1].includes('noindex')) {
    noindexPaths.add(htmlToUrl(DIST, file));
  }
}

const sitemapFiles = walk(DIST, '.xml').filter((f) => /sitemap-\d+\.xml$/.test(f));
let removed = 0;

for (const file of sitemapFiles) {
  const xml = read(file);
  const pruned = xml.replace(/<url>[\s\S]*?<\/url>/g, (block) => {
    const loc = block.match(/<loc>([^<]+)<\/loc>/);
    if (!loc) return block;
    let path = loc[1].replace(SITE, '');
    try {
      path = decodeURIComponent(path);
    } catch {
      /* 保持原样 */
    }
    if (noindexPaths.has(path)) {
      removed += 1;
      return '';
    }
    return block;
  });
  if (pruned !== xml) writeFileSync(file, pruned, 'utf8');
}

console.log(
  `[prune-sitemap] 发现 ${noindexPaths.size} 个 noindex 页面,从 sitemap 移除 ${removed} 条 URL`
);
