# 阶段 0:项目审计记录

日期:2026-08-04

## 检查结果

| 检查项 | 结果 |
| --- | --- |
| 当前目录文件 | 空目录,无任何文件 |
| Git 仓库 | 不存在(`git status` 报 not a git repository) |
| 旧技术栈 | 目录内无旧代码;项目记忆显示此前为 Vite+React SPA + react-snap 预渲染,现已被清空 |
| 旧 URL | 无法从目录导出(旧文件已不存在);旧路由结构为 /review/:slug、/tutorial/:slug、/category/:keyword |
| 已有内容 | 无 |
| package.json | 不存在 |
| 备份需求 | 无(无文件可备份) |
| 破坏性风险 | 无 |

## 环境

- Node.js v24.12.0(满足 Astro 5 要求)
- npm 11.6.2
- Windows 11,PowerShell / Git Bash

## 旧 URL 映射决定

旧站为 SPA 预渲染站,目录已清空,无法枚举全部旧 URL。处理策略:

- 在 `public/_redirects` 中为已知旧路由模式建立映射:`/review/:slug` → `/reviews/`、`/tutorial/:slug` → `/clients/`、`/category/:keyword` → `/directory/`(301,按前缀落到对应新栏目页,不统一重定向到首页)。
- 其余未知旧 URL 返回正常 404。
- 记录于 docs/redirect-map.csv。

## 结论

目录为空,直接进入阶段 1:Astro 项目初始化。
