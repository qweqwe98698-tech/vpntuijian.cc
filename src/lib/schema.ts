/** JSON-LD 结构化数据生成工具。所有输出必须与页面可见内容一致。 */
import { SITE } from './site';

type JsonLd = Record<string, unknown>;

export function organizationSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    alternateName: SITE.englishName,
    url: `${SITE.url}/`,
    description: SITE.description,
  };
}

export function websiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.name,
    url: `${SITE.url}/`,
    inLanguage: 'zh-CN',
    publisher: { '@id': `${SITE.url}/#organization` },
  };
}

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.href}`,
    })),
  };
}

export interface ArticleSchemaInput {
  title: string;
  description: string;
  url: string;
  publishedAt: Date;
  updatedAt: Date;
  authorName: string;
  isTech?: boolean;
}

export function articleSchema(input: ArticleSchemaInput): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': input.isTech ? 'TechArticle' : 'Article',
    headline: input.title,
    description: input.description,
    url: `${SITE.url}${input.url}`,
    inLanguage: 'zh-CN',
    datePublished: input.publishedAt.toISOString(),
    dateModified: input.updatedAt.toISOString(),
    author: { '@type': 'Person', name: input.authorName },
    publisher: { '@id': `${SITE.url}/#organization` },
    mainEntityOfPage: `${SITE.url}${input.url}`,
  };
}

export function collectionPageSchema(input: {
  title: string;
  description: string;
  url: string;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: input.title,
    description: input.description,
    url: `${SITE.url}${input.url}`,
    inLanguage: 'zh-CN',
    isPartOf: { '@id': `${SITE.url}/#website` },
  };
}

export function itemListSchema(items: { name: string; url: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: `${SITE.url}${item.url}`,
    })),
  };
}

/**
 * 术语词条。DefinedTerm 比 Article 更准确地描述「X 是什么意思」类页面,
 * 也更利于生成式搜索直接提取定义。
 */
export function definedTermSchema(input: {
  term: string;
  definition: string;
  url: string;
  aliases?: string[];
  category?: string;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: input.term,
    description: input.definition,
    url: `${SITE.url}${input.url}`,
    inLanguage: 'zh-CN',
    ...(input.aliases?.length ? { alternateName: input.aliases } : {}),
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: '网络代理服务术语表',
      url: `${SITE.url}/glossary/`,
    },
  };
}

/** 只有页面正文中实际可见的问答才输出 FAQPage */
export function faqSchema(faq: { q: string; a: string }[]): JsonLd | null {
  if (!faq.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}
