# 个人版使用说明

## 一条命令启动

```bash
pnpm personal:dev
```

该命令会持续编译扩展，等 `extension/manifest.json` 就绪后自动启动 Chromium，并加载当前开发版。浏览器配置保存在仓库的 `chromium-web-ext-profile/` 中，登录状态会在后续启动时保留。按 `Ctrl+C` 可同时停止浏览器加载器和开发编译。

## 同步官方更新

```bash
git fetch upstream
git rebase upstream/main
pnpm install
pnpm lint
pnpm typecheck
git push --force-with-lease origin personal/favorites-drag-drop
```

拖放功能集中在收藏页：拖动视频卡片左上角的手柄到右侧收藏夹即可移动；拖动期间页面底部会出现取消收藏区域。批量管理模式下，拖动任意已选视频会处理全部已选视频。
