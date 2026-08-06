/** 全站常量与导航配置 */

export const SITE = {
  url: 'https://vpntuijian.cc',
  name: 'VPN推荐指南',
  englishName: 'VPN Tuijian Guide',
  tagline: '选得明白,用得稳定,出问题能解决。',
  description:
    'VPN推荐指南提供网络代理服务选择参考、机场评测、Clash 与 Shadowrocket 教程、节点超时和订阅故障排查,以及 AI、流媒体和远程办公场景指南。',
  locale: 'zh-CN',
} as const;

export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

/** 一级导航(页眉) */
export const primaryNav: NavItem[] = [
  { label: '新手入门', href: '/start/', description: '第一次接触代理服务从这里开始' },
  { label: '选择指南', href: '/choose/', description: '按预算、设备和场景选择服务' },
  { label: '服务评测', href: '/reviews/', description: '九家服务的实测数据与选购结论' },
  { label: '服务对比', href: '/compare/', description: '套餐、线路与客户端支持对比' },
  { label: '客户端教程', href: '/clients/', description: 'Clash、Shadowrocket、v2rayN、sing-box 配置' },
  { label: '故障排查', href: '/troubleshooting/', description: '按现象定位节点、订阅和连接问题' },
  { label: '线路与协议', href: '/protocols/', description: 'IEPL、IPLC、Shadowsocks、Trojan、VLESS' },
  { label: '使用场景', href: '/scenarios/', description: 'AI 工具、流媒体、远程办公场景指南' },
  { label: '风险与避坑', href: '/risk/', description: '跑路信号、付款安全与虚假宣传识别' },
  { label: '服务导航', href: '/directory/', description: '网络代理服务目录与状态' },
];

/** 页脚栏目分组 */
export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: '开始使用',
    items: [
      { label: '新手入门', href: '/start/' },
      { label: '选择指南', href: '/choose/' },
      { label: '机场推荐', href: '/airport/' },
      { label: '稳定机场', href: '/stable/' },
      { label: '便宜机场', href: '/value/' },
      { label: '科学上网工具', href: '/tools/' },
    ],
  },
  {
    title: '使用与排查',
    items: [
      { label: '客户端教程', href: '/clients/' },
      { label: '故障排查', href: '/troubleshooting/' },
      { label: '订阅管理', href: '/subscription/' },
      { label: '线路与协议', href: '/protocols/' },
      { label: '术语表', href: '/glossary/' },
    ],
  },
  {
    title: '评测与参考',
    items: [
      { label: '服务评测', href: '/reviews/' },
      { label: '服务对比', href: '/compare/' },
      { label: '服务导航', href: '/directory/' },
      { label: '使用场景', href: '/scenarios/' },
      { label: '风险与避坑', href: '/risk/' },
      { label: '实用指南', href: '/guides/' },
    ],
  },
  {
    title: '关于本站',
    items: [
      { label: '关于我们', href: '/about/' },
      { label: '测试方法', href: '/methodology/' },
      { label: '编辑规范', href: '/editorial-policy/' },
      { label: '推广披露', href: '/disclosure/' },
      { label: '联系方式', href: '/contact/' },
      { label: '全站内容总览', href: '/topics/' },
    ],
  },
];

/** 数据状态 → 中文标签与样式 */
export const dataStatusLabels: Record<
  string,
  { label: string; tone: 'ok' | 'info' | 'muted' | 'warn' }
> = {
  verified: { label: '已核实', tone: 'ok' },
  reference: { label: '参考信息', tone: 'info' },
  sample: { label: '示例展示', tone: 'muted' },
  pending: { label: '等待更新', tone: 'muted' },
  outdated: { label: '需重新核验', tone: 'warn' },
};

/** 集合 → URL 前缀映射 */
export const collectionBase: Record<string, string> = {
  articles: '/guides/',
  picks: '/airport/',
  clients: '/clients/',
  troubleshooting: '/troubleshooting/',
  protocols: '/protocols/',
  scenarios: '/scenarios/',
  comparisons: '/compare/',
  providers: '/directory/',
  glossary: '/glossary/',
};

/** 集合 → 栏目名(面包屑用) */
export const collectionLabels: Record<string, string> = {
  articles: '实用指南',
  picks: '机场推荐',
  clients: '客户端教程',
  troubleshooting: '故障排查',
  protocols: '线路与协议',
  scenarios: '使用场景',
  comparisons: '服务对比',
  providers: '服务导航',
  glossary: '术语表',
};

/**
 * 站内路径 → 自然锚文本。
 *
 * FAQ 答案里直接写裸路径时,渲染层用这张表换成可点击的链接。裸路径既不可点,
 * 也不产生任何内链权重,等于白写。表里没有的路径按原样保留为文本。
 */
export const pathLabels: Record<string, string> = {
  '/guides/airport-runaway-warning-signs/': '机场跑路前常见的风险信号',
  '/guides/payment-safety-guide/': '购买代理服务的安全注意事项',
  '/guides/plan-billing-cycle-guide/': '月付、季付和不限时套餐怎么选',
  '/guides/first-time-airport-params/': '第一次选择机场应该看哪些参数',
  '/guides/how-much-traffic-needed/': '一个人每月需要多少流量',
  '/guides/multi-device-plan-guide/': '多设备套餐怎么选',
  '/airport/ranking/': '机场排行榜怎么看',
  '/airport/dedicated-line/': '专线机场推荐',
  '/airport/native-ip/': '原生 IP 机场推荐',
  '/airport/chatgpt/': 'ChatGPT 机场推荐',
  '/airport/streaming/': '流媒体解锁机场',
  '/airport/netflix/': 'Netflix 机场推荐',
  '/airport/low-latency/': '低延迟机场推荐',
  '/airport/pay-as-you-go/': '按量计费机场',
  '/airport/cost-performance/': '高性价比机场推荐',
  '/airport/free-trial/': '免费试用机场',
  '/airport/coupon/': '机场优惠码',
  '/compare/nine-providers-speed-test/': '九家机场实测对比',
  '/methodology/': '测试方法',
  '/editorial-policy/': '编辑规范',
  '/disclosure/': '推广披露',
  '/directory/': '服务导航',
  '/troubleshooting/all-nodes-timeout/': '所有节点超时的排查流程',
  '/troubleshooting/subscription-update-failed/': '订阅更新失败怎么办',
  '/clients/clash-subscription-import/': 'Clash 订阅导入教程',
};

/** 根据 "collection/slug" 生成站内 URL */
export function entryUrl(ref: string): string {
  const [collection, ...rest] = ref.split('/');
  const slug = rest.join('/');
  const base = collectionBase[collection ?? ''];
  if (!base || !slug) return '/';
  return `${base}${slug}/`;
}

/** 格式化日期为 YYYY-MM-DD(避免 Invalid Date) */
export function formatDate(d: Date | string | undefined): string {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
