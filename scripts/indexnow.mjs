/**
 * IndexNow 提交脚本:向搜索引擎推送新增或更新的 URL。
 *
 * 用法:
 *   INDEXNOW_KEY=<你的密钥> node scripts/indexnow.mjs            # 提交 sitemap 中全部 URL
 *   INDEXNOW_KEY=<你的密钥> node scripts/indexnow.mjs /a/ /b/    # 只提交指定路径
 *   node scripts/indexnow.mjs --dry-run                          # 只打印将提交的内容
 *
 * 密钥从环境变量读取,不写入仓库。使用前需要在 public/ 下放置一个
 * 名为 <密钥>.txt、内容为该密钥的文件,详见 docs/deployment.md。
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { walk, read } from './lib.mjs';

const SITE = process.env.SITE_URL ?? 'https://vpntuijian.cc';
const HOST = new URL(SITE).host;
const KEY = process.env.INDEXNOW_KEY;
const ENDPOINT = 'https://api.indexnow.org/IndexNow';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const explicitPaths = args.filter((a) => a.startsWith('/'));

function urlsFromSitemap() {
  const dist = join(process.cwd(), 'dist');
  if (!existsSync(dist)) {
    console.error('dist 不存在,请先运行 npm run build');
    process.exit(1);
  }
  const urls = new Set();
  for (const file of walk(dist, '.xml')) {
    if (!/sitemap-\d+\.xml$/.test(file)) continue;
    for (const m of read(file).matchAll(/<loc>([^<]+)<\/loc>/g)) {
      urls.add(m[1]);
    }
  }
  return [...urls];
}

const urlList = explicitPaths.length
  ? explicitPaths.map((p) => `${SITE}${p}`)
  : urlsFromSitemap();

if (urlList.length === 0) {
  console.error('没有可提交的 URL');
  process.exit(1);
}

console.log(`准备提交 ${urlList.length} 个 URL 到 IndexNow`);

if (dryRun) {
  for (const u of urlList) console.log(`  ${u}`);
  console.log('\n(--dry-run,未实际提交)');
  process.exit(0);
}

if (!KEY) {
  console.error(
    '缺少环境变量 INDEXNOW_KEY。请参考 .env.example 与 docs/deployment.md 配置后重试。'
  );
  process.exit(1);
}

const body = {
  host: HOST,
  key: KEY,
  keyLocation: `${SITE}/${KEY}.txt`,
  urlList,
};

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

// IndexNow 对成功提交返回 200 或 202
if (res.ok) {
  console.log(`提交成功(HTTP ${res.status})`);
} else {
  console.error(`提交失败:HTTP ${res.status} ${res.statusText}`);
  console.error(await res.text());
  process.exit(1);
}
