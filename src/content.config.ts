import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** 数据状态:全站统一的内容可信度标识 */
export const dataStatusValues = [
  'verified', // 已核实数据
  'reference', // 参考数据
  'sample', // 示例数据
  'pending', // 等待补充
  'outdated', // 需要重新核验
] as const;

const dataStatus = z.enum(dataStatusValues);

const faqItem = z.object({
  q: z.string().min(4),
  a: z.string().min(10),
});

const sourceItem = z.object({
  title: z.string(),
  url: z.string().url().optional(),
  note: z.string().optional(),
});

/** 文章通用字段(articles / clients / troubleshooting / protocols / scenarios 共用) */
const baseArticleSchema = z.object({
  title: z.string().min(6).max(60),
  /**
   * meta description。上限按中文 SERP 的实际可见宽度定,不是按拉丁字符。
   *
   * Google 桌面摘要约 920px,中文全角字符约 14px,可见上限约 65–80 个汉字
   * —— 而不是拉丁语系常说的 155–160。目标区间 80–110:占满可见区,
   * 并留少量余量供 Google 匹配查询词。超过 120 的部分永远不会显示。
   */
  description: z.string().min(60).max(120),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  reviewedAt: z.coerce.date().optional(),
  author: z.string().default('mai-heng'),
  reviewer: z.string().optional(),
  category: z.string(),
  subcategory: z.string().optional(),
  tags: z.array(z.string()).default([]),
  searchIntent: z
    .enum(['informational', 'commercial', 'transactional', 'navigational', 'troubleshooting'])
    .default('informational'),
  audience: z.enum(['beginner', 'intermediate', 'advanced', 'all']).default('all'),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  /** 80–160 字直接答案,用于页面开头 DirectAnswer 和 meta 补充 */
  summary: z.string().min(60).max(300),
  keyTakeaways: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  noindex: z.boolean().default(false),
  canonical: z.string().url().optional(),
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
  /** 相关文章:跨集合引用,格式 "collection/slug",如 "troubleshooting/all-nodes-timeout" */
  related: z.array(z.string()).default([]),
  sources: z.array(sourceItem).default([]),
  faq: z.array(faqItem).default([]),
  dataStatus: dataStatus.default('verified'),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: baseArticleSchema,
});

const clients = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/clients' }),
  schema: baseArticleSchema.extend({
    /** 教程适用平台 */
    platforms: z.array(z.string()).default([]),
    /** 教程适用的客户端版本说明 */
    appVersion: z.string().optional(),
    /** 最后按步骤实测检查日期 */
    checkedAt: z.coerce.date().optional(),
  }),
});

const troubleshooting = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/troubleshooting' }),
  schema: baseArticleSchema.extend({
    /** 故障现象一句话描述 */
    symptom: z.string().optional(),
    /** 涉及平台 */
    platforms: z.array(z.string()).default([]),
    /** 严重程度:影响范围提示 */
    severity: z.enum(['common', 'occasional', 'rare']).default('common'),
  }),
});

const protocols = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/protocols' }),
  schema: baseArticleSchema,
});

const scenarios = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/scenarios' }),
  schema: baseArticleSchema,
});

/**
 * 选购专题(picks):承接 P1–P5 商业关键词的落地页。
 * URL: /airport/<slug>/
 *
 * 与 articles 的区别:articles 是知识与方法文章,picks 是关键词落地页,
 * 每页锁定 1 个主词 + 3–5 个次词 + 10–20 个长尾词,并显式声明服务名单的数据状态。
 */
const picks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/picks' }),
  schema: baseArticleSchema.extend({
    /** 关键词优先级层级,对应 docs/keyword-matrix.md */
    priority: z.enum(['P0', 'P1', 'P2', 'P3', 'P4', 'P5']),
    /** 主关键词,一页一主词 */
    primaryKeyword: z.string(),
    /** 次要关键词 3–5 个 */
    secondaryKeywords: z.array(z.string()).min(2).max(8),
    /** 自然覆盖的长尾词 10–20 个 */
    longtailKeywords: z.array(z.string()).default([]),
    /**
     * 该页服务名单的数据状态。
     * pending 表示尚无可发布的真实服务数据,页面会渲染说明模块而不是虚构名单。
     */
    providerListStatus: z.enum(['ready', 'pending']).default('pending'),
    /** 评估维度:这个专题下判断服务好坏的具体标准 */
    criteria: z
      .array(
        z.object({
          name: z.string(),
          what: z.string(),
          why: z.string().optional(),
        })
      )
      .default([]),
  }),
});

const comparisons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/comparisons' }),
  schema: baseArticleSchema.extend({
    /** 对比对象(providers slug 或名称) */
    subjects: z.array(z.string()).min(2),
    /** 对比日期 */
    comparedAt: z.coerce.date(),
    /** 对比维度 */
    dimensions: z.array(z.string()).default([]),
  }),
});

/** 服务档案(数据集合,页面 /directory/[slug]/) */
const providers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/providers' }),
  schema: z.object({
    name: z.string(),
    aliases: z.array(z.string()).default([]),
    summary: z.string().min(40).max(300),
    /** 服务当前状态 */
    status: z.enum(['active', 'unstable', 'closed', 'unknown']).default('unknown'),
    dataStatus: dataStatus.default('pending'),
    officialUrl: z.string().url().optional(),
    affiliateUrl: z.string().url().optional(),
    /** 推广关系说明 */
    disclosure: z.string().optional(),
    verifiedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date(),
    publishedAt: z.coerce.date(),
    noindex: z.boolean().default(false),
    draft: z.boolean().default(false),
    pricing: z
      .array(
        z.object({
          plan: z.string(),
          price: z.string(),
          traffic: z.string(),
          devices: z.string().optional(),
          note: z.string().optional(),
        })
      )
      .default([]),
    billingCycle: z.array(z.string()).default([]),
    trafficPolicy: z.string().optional(),
    platforms: z.array(z.string()).default([]),
    clients: z.array(z.string()).default([]),
    nodeRegions: z.array(z.string()).default([]),
    lineTypes: z.array(z.string()).default([]),
    protocols: z.array(z.string()).default([]),
    supportChannels: z.array(z.string()).default([]),
    refundPolicy: z.string().optional(),
    /** 一句话定位,用于卡片副标题 */
    positioning: z.string().optional(),
    /**
     * 该服务归属的专题(对应 /airport/<slug>/ 的 slug)。
     * 专题页据此筛选要展示的服务,不需要在页面里硬编码服务名。
     */
    topics: z.array(z.string()).default([]),
    /** 优惠信息。code 为服务方提供,本站不保证时效,页面会提示在结算页核对。 */
    coupon: z
      .object({
        name: z.string(),
        code: z.string(),
        note: z.string().optional(),
      })
      .optional(),
    /** 服务方自行声明、本站未独立验证的说法,页面会加前缀展示 */
    claims: z.array(z.string()).default([]),
    /**
     * 合作推荐位次序,数字越小越靠前。未设置的按服务名排列在其后。
     *
     * 这个字段反映的是商业合作关系,不是测评结论。设置了该字段的服务
     * 会在名单中优先展示并带「合作推荐」标识,同时名单顶部的说明会
     * 如实告知读者排序依据 —— 不得在使用该字段的同时声称名单为中立排序。
     */
    promotedRank: z.number().int().positive().optional(),
    featured: z.boolean().default(false),
    /**
     * 第一方实测数据。有此字段说明本站实际跑过测速,而不只是转述官方页面。
     *
     * 必须同时记录测试条件(工具、网络、线程、时间),否则数字没有意义:
     * 同一节点在不同 ISP、不同时段的结果差异可以很大。
     */
    speedTest: z
      .object({
        testedAt: z.coerce.date(),
        tool: z.string(),
        /** 测试所用网络环境,如「珠海联通 9Gbps」 */
        network: z.string(),
        threads: z.number().int().positive().optional(),
        /** 订阅中实际探测到的节点总数 */
        nodeCount: z.number().int().nonnegative(),
        /** 测速为 0 或近乎为 0 的故障节点数 */
        failedNodes: z.number().int().nonnegative().default(0),
        protocol: z.string().optional(),
        regions: z
          .array(
            z.object({
              name: z.string(),
              count: z.number().int().positive(),
              /** TLS RTT 区间,如 "94–113ms" */
              rtt: z.string(),
              /** 平均速度区间,如 "428–546MB/s" */
              speed: z.string(),
            })
          )
          .default([]),
        note: z.string().optional(),
      })
      .optional(),
    strengths: z.array(z.string()).default([]),
    limitations: z.array(z.string()).default([]),
    suitableFor: z.array(z.string()).default([]),
    notSuitableFor: z.array(z.string()).default([]),
    riskNotes: z.array(z.string()).default([]),
    sources: z.array(sourceItem).default([]),
    relatedArticles: z.array(z.string()).default([]),
    /**
     * 品牌页 SEO 元数据。承接 P6 品牌词簇(品牌名+怎么样/评测/官网/值得买吗/跑路了吗)。
     * 不填则回退到「<名称> 服务档案」这类通用标题,会浪费品牌词流量。
     */
    seoTitle: z.string().max(60).optional(),
    seoDescription: z.string().min(60).max(120).optional(),
    /**
     * 品牌长尾问答,对应问题库第 41–44 节的品牌页模板。
     * 同时渲染为可见问答与 FAQPage 结构化数据,二者同源。
     */
    faq: z.array(faqItem).default([]),
  }),
});

const glossary = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/glossary' }),
  schema: z.object({
    term: z.string(),
    /** 英文或别名 */
    aliases: z.array(z.string()).default([]),
    /** 一句话定义(可提取) */
    definition: z.string().min(20).max(300),
    category: z.string().default('通用'),
    /**
     * 词条页的 meta description。definition 要短以便被直接提取,
     * 而 meta description 需要更长以占满 SERP 展示区,两者用途不同,分开维护。
     */
    seoDescription: z.string().min(80).max(120).optional(),
    updatedAt: z.coerce.date(),
    publishedAt: z.coerce.date(),
    related: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    expertise: z.array(z.string()).default([]),
  }),
});

export const collections = {
  articles,
  picks,
  clients,
  troubleshooting,
  protocols,
  scenarios,
  comparisons,
  providers,
  glossary,
  authors,
};
