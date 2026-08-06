import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAllCards } from '@lib/content';
import { SITE } from '@lib/site';

export async function GET(context: APIContext) {
  // getAllCards 默认已排除 noindex(示例数据一律 noindex)。
  // 这样把示例档案替换成真实评测后,评测会自动进入 RSS,不需要改这里。
  const cards = await getAllCards();
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: cards.slice(0, 30).map((c) => ({
      title: c.title,
      description: c.description,
      link: c.href,
      pubDate: c.publishedAt,
      categories: [c.category],
    })),
    customData: '<language>zh-CN</language>',
  });
}
