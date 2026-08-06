# 设计系统

全部定义在 `src/styles/global.css` 顶部的 CSS 变量中。组件样式一律引用变量,不写死数值。

## 定位

品牌化简白、专业知识博客、轻科技感、阅读优先、内容密度适中。

明确避免的方向:SaaS 销售首页、加密货币项目页、霓虹色工具站、只有大按钮的推广落地页、过度圆角和留白的模板站、所有卡片外观完全相同的组件堆砌页。

## 色彩

| 变量 | 浅色值 | 用途 |
| --- | --- | --- |
| `--color-brand` | `#2563EB` | 品牌主色、链接、主按钮 |
| `--color-brand-soft` | `#EFF6FF` | 激活态背景、信息提示底色 |
| `--color-heading` | `#0F172A` | 标题 |
| `--color-text` | `#334155` | 正文 |
| `--color-muted` | `#64748B` | 次要文字、元信息 |
| `--color-bg` | `#FFFFFF` | 页面背景 |
| `--color-bg-soft` | `#F8FAFC` | 分区背景、卡片底色 |
| `--color-border` | `#E2E8F0` | 边框、分隔线 |
| `--color-success` | `#15803D` | 已核实、优点、成功提示 |
| `--color-warning` | `#B45309` | 待更新、限制、注意提示 |
| `--color-danger` | `#B91C1C` | 风险提示、已停止运营 |

深色模式通过 `html[data-theme='dark']` 覆盖同一组变量,不需要改任何组件样式。默认浅色,用户切换后写入 `localStorage`,并在 `<head>` 中用内联脚本尽早应用以避免闪烁。

**状态不只靠颜色传达。** 数据状态徽章同时有文字标签(「已核实」「示例展示」),优点/限制两栏有独立标题,不依赖读者辨色。

## 字体与排版

中文系统字体栈,不加载外部字体:

```
-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans CJK SC', sans-serif
```

字号从 `--text-xs`(0.8125rem)到 `--text-4xl`(2.5rem)。正文 `1rem`,文章正文放大到 `1.0625rem`。

行高三档:`--leading-tight`(1.3,标题)、`--leading-normal`(1.6,卡片与表格)、`--leading-loose`(1.85,正文)。中文正文行高偏大是刻意的,密排中文可读性会明显下降。

## 宽度

- `--width-content: 72ch` —— 文章正文行宽。中文按这个宽度约 36 到 40 字一行,是比较舒适的区间。
- `--width-wide: 1140px` —— 首页、栏目页的容器宽度。

文章页用 `.page-with-sidebar` 做两栏:正文 `minmax(0, 1fr)` + 侧栏 `280px`,1000px 以下合并为单栏,侧栏从 sticky 变为静态流。

## 间距与圆角

间距用 `--space-1`(0.25rem)到 `--space-10`(4rem)的阶梯。圆角三档:`--radius-sm`(6px,按钮、徽章)、`--radius`(10px,卡片)、`--radius-lg`(14px)。阴影只有两级,且只在 hover 时出现。

## 断点

| 宽度 | 变化 |
| --- | --- |
| ≤ 1000px | 侧栏并入主列,目录默认折叠 |
| ≤ 900px | 桌面导航隐藏,移动导航按钮显示;4 列与 3 列网格降为 2 列 |
| ≤ 600px | 所有网格降为单列;上一篇/下一篇改为纵向堆叠 |

## 组件外观差异化

不同用途的卡片有可辨识的差异,不是同一个样式复用到底:

- 普通卡片(`.card`)—— 边框 + hover 时边框变蓝加阴影
- 风险卡片(`.risk-card`)—— 左侧 3px 红色竖条
- 优点/限制两栏(`.pc-pros` / `.pc-cons`)—— 顶部 3px 色条,绿色与橙色区分
- 提示框(`.notice-*`)—— 左侧 4px 竖条 + 对应色系底色,四种语义各不相同
- 更新记录时间线 —— 左侧竖线 + 圆点

## 交互状态

- 所有可点击元素有 hover 状态;按钮另有 `:active` 的 1px 下沉。
- 焦点状态统一为 `outline: 2px solid var(--color-brand)` + 2px 偏移,使用 `:focus-visible` 以免鼠标点击时出现轮廓。
- `prefers-reduced-motion: reduce` 时,所有动画和过渡缩短到 0.01ms,`scroll-behavior` 改回 `auto`。

## 可访问性约定

- 页面结构用语义标签:`header` / `nav` / `main` / `article` / `aside` / `footer`。
- 每页只有一个 H1,标题层级不跳级。`audit:seo` 会检查 H1 数量。
- 跳过导航链接是页面第一个可聚焦元素,平时用 `left: -9999px` 移出视口,获得焦点时归位。
- 导航当前项用 `aria-current="page"`,移动导航按钮用 `aria-expanded` 并支持 Esc 关闭。
- 表格有 `<th scope>`,包在 `.table-wrap` 中,该容器有 `tabindex="0"` 和 `role="region"`,键盘用户可以聚焦后滚动。
- 重要文字不放进 CSS 伪元素。
- 组件在数据为空时不渲染(`{items.length > 0 && ...}`),不产生空白卡片或空容器。

## 不使用的效果

持续循环动画、自动播放音视频、遮挡正文的弹窗、进入视口时的位移动画。这类效果对以查阅为主的内容站是负担而非增益,尤其是用户正在排查故障的时候。
