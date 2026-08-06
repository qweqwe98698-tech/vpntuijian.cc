/**
 * 内容检查:直接扫描 src/content 下的 Markdown frontmatter。
 * 检查必填字段、日期有效性、related 引用是否存在、示例数据是否已 noindex。
 */
import { existsSync } from 'node:fs';
import { walk, read, Reporter } from './lib.mjs';

const ROOT = 'src/content';
const r = new Reporter('内容检查');

if (!existsSync(ROOT)) {
  console.error('src/content 不存在');
  process.exit(1);
}

/** 极简 frontmatter 解析:够用于字段存在性与标量取值检查 */
function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const data = {};
  const listKeys = new Set();
  let currentKey = null;
  for (const rawLine of m[1].split(/\r?\n/)) {
    if (!rawLine.trim() || rawLine.trim().startsWith('#')) continue;
    const topLevel = rawLine.match(/^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/);
    if (topLevel) {
      currentKey = topLevel[1];
      const value = topLevel[2].trim();
      if (value === '') {
        data[currentKey] = [];
        listKeys.add(currentKey);
      } else if (value.startsWith('[')) {
        data[currentKey] = value
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean);
      } else {
        data[currentKey] = value.replace(/^["']|["']$/g, '');
      }
      continue;
    }
    const listItem = rawLine.match(/^\s+-\s+(.*)$/);
    if (listItem && currentKey && listKeys.has(currentKey)) {
      const v = listItem[1].trim();
      if (!v.includes(': ')) {
        data[currentKey].push(v.replace(/^["']|["']$/g, ''));
      } else {
        data[currentKey].push(v);
      }
    }
  }
  return data;
}

const articleCollections = [
  'articles',
  'clients',
  'troubleshooting',
  'protocols',
  'scenarios',
  'reviews',
  'comparisons',
];

const existing = new Set();
const entries = [];

for (const file of walk(ROOT, '.md')) {
  const rel = file.replaceAll('\\', '/').slice(`${ROOT}/`.length);
  const [collection, ...rest] = rel.split('/');
  const slug = rest.join('/').replace(/\.md$/, '');
  const text = read(file);
  const data = parseFrontmatter(text);
  if (!data) {
    r.error(`${rel} 缺少 frontmatter`);
    continue;
  }
  existing.add(`${collection}/${slug}`);
  entries.push({ rel, collection, slug, data, body: text.split(/^---$/m).slice(2).join('---') });
}

const requiredByType = {
  article: ['title', 'description', 'publishedAt', 'updatedAt', 'category', 'summary'],
  providers: ['name', 'summary', 'publishedAt', 'updatedAt', 'status', 'dataStatus'],
  glossary: ['term', 'definition', 'publishedAt', 'updatedAt'],
  authors: ['name', 'role', 'bio'],
};

const isValidDate = (v) => v && !Number.isNaN(new Date(v).getTime());

for (const e of entries) {
  const { rel, collection, data } = e;
  const type = articleCollections.includes(collection) ? 'article' : collection;
  const required = requiredByType[type];
  if (!required) continue;

  for (const field of required) {
    if (data[field] === undefined || data[field] === '') {
      r.error(`${rel} 缺少必填字段: ${field}`);
    }
  }

  for (const field of ['publishedAt', 'updatedAt', 'reviewedAt', 'verifiedAt', 'comparedAt', 'checkedAt']) {
    if (data[field] !== undefined && !isValidDate(data[field])) {
      r.error(`${rel} 字段 ${field} 不是有效日期: ${data[field]}`);
    }
  }

  if (isValidDate(data.publishedAt) && isValidDate(data.updatedAt)) {
    if (new Date(data.updatedAt) < new Date(data.publishedAt)) {
      r.warn(`${rel} updatedAt 早于 publishedAt`);
    }
  }

  // 示例数据必须 noindex
  if (data.dataStatus === 'sample' && data.noindex !== 'true') {
    r.error(`${rel} dataStatus 为 sample 但未设置 noindex: true`);
  }

  // related 引用必须存在
  const refs = [...(data.related ?? []), ...(data.relatedArticles ?? [])];
  for (const ref of refs) {
    if (!ref.includes('/')) continue;
    if (!existing.has(ref)) r.error(`${rel} related 指向不存在的内容: ${ref}`);
  }

  // 正文不应为空
  if (type === 'article' && e.body.trim().length < 200) {
    r.error(`${rel} 正文过短或为空`);
  }

  // 正文不应包含绝对承诺用语
  const forbidden = ['100% 解锁', '100%解锁', '绝对最好', '永远稳定', '零风险'];
  for (const word of forbidden) {
    if (e.body.includes(word)) r.warn(`${rel} 正文包含绝对承诺用语「${word}」`);
  }

  if (type !== 'article') continue;

  // 正文不应重复渲染由模板输出的区块,否则页面会出现两份
  // 只匹配与模板区块同名的标题;「常见问题与处理」这类扩展标题是独立章节,不算重复
  const duplicatedSections = [
    ['常见问题', /^##+\s*常见问题\s*$/m],
    ['FAQ', /^##+\s*FAQ\s*$/m],
    ['相关阅读', /^##+\s*相关(阅读|文章)\s*$/m],
    ['参考来源', /^##+\s*参考(来源|资料)\s*$/m],
    ['关键结论', /^##+\s*关键结论\s*$/m],
  ];
  for (const [name, re] of duplicatedSections) {
    if (re.test(e.body)) {
      r.error(`${rel} 正文重复了模板已渲染的「${name}」章节,应删除并改用 frontmatter 字段`);
    }
  }

  // 正文应从二级标题开始,不自带 H1
  if (/^#\s+/m.test(e.body)) {
    r.error(`${rel} 正文包含 H1,标题应只由 frontmatter 的 title 提供`);
  }

  // 每篇应有可提取的表格或清单(GEO 结构要求)
  if (!e.body.includes('|') && !/^\s*[-*\d]/m.test(e.body)) {
    r.warn(`${rel} 正文既无表格也无列表,可提取性较差`);
  }
}

// ---------------------------------------------------------------------------
// 跨文章雷同检测:批量生成最明显的信号是开头句式与元数据高度重合
// ---------------------------------------------------------------------------
const articleEntries = entries.filter((e) => articleCollections.includes(e.collection));

/** 取正文第一个非空、非标题的段落 */
function firstParagraph(body) {
  for (const line of body.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#') || t.startsWith('>') || t.startsWith('|')) continue;
    return t;
  }
  return '';
}

const openings = new Map();
for (const e of articleEntries) {
  const head = firstParagraph(e.body).slice(0, 20);
  if (!head) continue;
  if (!openings.has(head)) openings.set(head, []);
  openings.get(head).push(e.rel);
}
for (const [head, files] of openings) {
  if (files.length > 1) {
    r.error(`${files.length} 篇文章开头雷同(「${head}…」): ${files.join(', ')}`);
  }
}

/** 标题与描述在全站范围内必须唯一 */
for (const field of ['title', 'description', 'summary']) {
  const seen = new Map();
  for (const e of articleEntries) {
    const v = e.data[field];
    if (!v) continue;
    if (!seen.has(v)) seen.set(v, []);
    seen.get(v).push(e.rel);
  }
  for (const [v, files] of seen) {
    if (files.length > 1) {
      r.error(`${files.length} 篇文章的 ${field} 完全相同(「${v.slice(0, 30)}…」): ${files.join(', ')}`);
    }
  }
}

// 作者引用检查
const authors = new Set(entries.filter((e) => e.collection === 'authors').map((e) => e.slug));
for (const e of entries) {
  if (!articleCollections.includes(e.collection)) continue;
  for (const field of ['author', 'reviewer']) {
    const v = e.data[field];
    if (v && !authors.has(v)) r.error(`${e.rel} ${field} 指向不存在的作者: ${v}`);
  }
}

console.log(`已检查 ${entries.length} 个内容文件,作者档案 ${authors.size} 个`);
r.finish();
