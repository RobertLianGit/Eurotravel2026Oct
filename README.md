# 欧洲历史旅行手册

一个面向欧洲 14 日旅行的互动式历史旅行网站：每天一页，包含路线、历史故事卡、可编辑的口播提示词，以及一个可以在现场记录和改写故事的工作台。

## GitHub Pages

项目已包含 `.github/workflows/deploy.yml`。将代码推送到 `main` 分支后，GitHub Actions 会自动构建静态站点并发布到 GitHub Pages。

首次使用时，在仓库 `Settings → Pages` 中将 Source 设置为 `GitHub Actions`。

当前目标仓库：`RobertLianGit/Eurotravel2026Oct`

## 本地预览

```bash
npm install
npm run dev
```

页面主入口位于 `app/page.tsx`，样式位于 `app/globals.css`。口播修改会保存在浏览器本机，不需要登录或后端数据库；后续可以继续把读书笔记、真实酒店和交通信息添加进每日数据结构。

## 验证

```bash
npm run build
npm test
```
