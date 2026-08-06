// @ts-check
import { defineConfig } from 'astro/config';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';

/**
 * 把 Markdown 正文里的 <table> 包进可横向滚动的容器。
 *
 * 组件生成的表格走 ResponsiveTable,已有容器;但正文 Markdown 表格没有,
 * 在窄屏上会挤压或溢出,键盘用户也无法聚焦滚动。这里在构建期统一补上,
 * 无需依赖(手写遍历,不引入 unist-util-visit)。
 */
function rehypeWrapTables() {
  /** @param {any} tree */
  return (tree) => {
    /** @param {any} node */
    const walk = (node) => {
      if (!node.children) return;
      node.children = node.children.map(/** @param {any} child */ (child) => {
        walk(child);
        if (child.type === 'element' && child.tagName === 'table') {
          return {
            type: 'element',
            tagName: 'div',
            properties: {
              className: ['table-wrap'],
              role: 'region',
              tabIndex: 0,
              'aria-label': '数据表格,可横向滚动',
            },
            children: [child],
          };
        }
        return child;
      });
    };
    walk(tree);
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://vpntuijian.cc',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) =>
        // 搜索页与标签索引页 noindex,不进入 sitemap
        !page.includes('/search/') &&
        !page.includes('/tags/'),
      serialize(item) {
        item.changefreq = ChangeFreqEnum.WEEKLY;
        return item;
      },
    }),
  ],
  markdown: {
    rehypePlugins: [rehypeWrapTables],
  },
  build: {
    format: 'directory',
  },
});
