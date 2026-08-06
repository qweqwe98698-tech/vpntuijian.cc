/** 内容集合查询与相关文章解析工具 */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { collectionBase, collectionLabels, entryUrl } from './site';

export type ArticleCollection =
  | 'articles'
  | 'picks'
  | 'clients'
  | 'troubleshooting'
  | 'protocols'
  | 'scenarios'
  | 'comparisons';

export const articleCollections: ArticleCollection[] = [
  'articles',
  'picks',
  'clients',
  'troubleshooting',
  'protocols',
  'scenarios',
  'comparisons',
];

export interface ArticleCard {
  title: string;
  description: string;
  href: string;
  category: string;
  updatedAt: Date;
  publishedAt: Date;
  featured: boolean;
  collection: string;
  slug: string;
  tags: string[];
  /** 是否 noindex(示例数据等),RSS 与聚合列表据此过滤 */
  noindex: boolean;
}

type AnyArticle = CollectionEntry<ArticleCollection>;

export function toCard(entry: AnyArticle): ArticleCard {
  return {
    title: entry.data.title,
    description: entry.data.description,
    href: `${collectionBase[entry.collection]}${entry.id}/`,
    category: entry.data.category,
    updatedAt: entry.data.updatedAt,
    publishedAt: entry.data.publishedAt,
    featured: entry.data.featured,
    collection: entry.collection,
    slug: entry.id,
    tags: entry.data.tags,
    noindex: entry.data.noindex,
  };
}

/** 取某集合的全部已发布条目(过滤草稿) */
export async function getPublished<C extends ArticleCollection>(collection: C) {
  const entries = await getCollection(collection, ({ data }) => !data.draft);
  return entries.sort(
    (a, b) => b.data.updatedAt.getTime() - a.data.updatedAt.getTime()
  );
}

/**
 * 全站文章卡片(用于最新更新、RSS、标签聚合)。
 *
 * 默认排除 noindex 内容:示例数据一律 noindex,不应出现在首页最新更新、
 * RSS 或标签聚合里。传 includeNoindex 可以拿到完整列表。
 */
export async function getAllCards(includeNoindex = false): Promise<ArticleCard[]> {
  const all = await Promise.all(articleCollections.map((c) => getPublished(c)));
  return all
    .flat()
    .map((e) => toCard(e as AnyArticle))
    .filter((c) => includeNoindex || !c.noindex)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

/** 解析 related: ["collection/slug", ...] 为卡片,忽略不存在的引用 */
export async function resolveRelated(refs: string[]): Promise<ArticleCard[]> {
  const cards: ArticleCard[] = [];
  for (const ref of refs) {
    const [collection, ...rest] = ref.split('/');
    const slug = rest.join('/');
    if (!collection || !slug) continue;
    if (collection === 'glossary') {
      const entry = await getEntry('glossary', slug);
      if (entry) {
        cards.push({
          title: `术语:${entry.data.term}`,
          description: entry.data.definition,
          href: entryUrl(ref),
          category: '术语表',
          updatedAt: entry.data.updatedAt,
          publishedAt: entry.data.publishedAt,
          featured: false,
          collection: 'glossary',
          slug,
          tags: [],
          noindex: false,
        });
      }
      continue;
    }
    if (!articleCollections.includes(collection as ArticleCollection)) continue;
    const entry = await getEntry(collection as ArticleCollection, slug);
    if (entry && !entry.data.draft) cards.push(toCard(entry as AnyArticle));
  }
  return cards;
}

/** 相关文章:优先手工 related,不足时按同集合同分类补齐 */
export async function relatedFor(entry: AnyArticle, limit = 4): Promise<ArticleCard[]> {
  const manual = await resolveRelated(entry.data.related ?? []);
  if (manual.length >= limit) return manual.slice(0, limit);
  const siblings = (await getPublished(entry.collection as ArticleCollection))
    .filter((e) => e.id !== entry.id)
    .filter((e) => !manual.some((m) => m.slug === e.id && m.collection === e.collection))
    .map((e) => toCard(e as AnyArticle));
  return [...manual, ...siblings].slice(0, limit);
}

/** 作者名解析 */
export async function authorName(id: string | undefined): Promise<string> {
  if (!id) return '编辑部';
  const entry = await getEntry('authors', id);
  return entry?.data.name ?? '编辑部';
}

export { collectionLabels, collectionBase, entryUrl };
