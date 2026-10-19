# 麦森错题本

小学错题整理应用。使用 React Native、Expo SDK 58、TypeScript，同一份代码支持 Android、iOS，附带网页预览。

## 本地运行

使用 Node.js 24（见 `.nvmrc`）：

```sh
nvm install
nvm use
npm ci
npm run start
```

手机使用兼容 SDK 58 的 Expo Go 扫码；独立安装包由 GitHub Actions 构建。网页预览：`npm run web`。

```sh
npm run check
npm run export:web
```

## 已实现

- 首页七个区域，原稿同款图标、头像和狐狸；顶部连续场景整图、任务卡整图，题数动态叠加，最终圆角由样式控制。
- 一至六年级与数学/语文/英语切换，界面导航文案为中文。
- 相机/相册收录，题目、知识点、答案编辑录入；原生端将照片复制到应用持久目录。
- 豆包内容复制粘贴导入（没有接豆包 API，也没有自动识别图片）。
- 错题搜索、掌握状态筛选、详情、复习与本地统计。每天更新复习队列。
- 按掌握状态推荐组卷；支持自选题目、附参考答案、照片题；原生端导出/分享 PDF，网页端调用打印对话框。
- 本机持久化保存；首次启动提供明确标注的示例题。

当前没有远端后端、账号、跨设备同步、OCR 或大模型自动讲题服务。界面明确显示本地录入方式。原生相机、打印和 Sideloadly 安装仍需真机验收。

## GitHub 打包

代码仓库：<https://github.com/lenxeon/error-book>。在 **Actions → Build Android and iOS → Run workflow** 选择 `main` 手动构建；推送 `v*` 标签也会启动同一流程。一个运行会并行生成 Android 与 iOS 安装包。

流程先做类型检查、数据逻辑测试和网页导出，再分别生成：

| 下载产物 | 用途 |
| --- | --- |
| `maisen-android-apk` | Actions 运行页的 Artifacts 下载项，解压后得到 Release APK，可安装到 Android；使用临时生成的测试签名，适合个人测试 |
| `maisen-ios-unsigned-ipa` | Actions 运行页的 Artifacts 下载项，解压得到 `maisen-unsigned.ipa`，交给 Sideloadly 重新签名安装 |

iOS 在 `macos-26` + Xcode 26.4.1 上生成 **iphoneos 真机 Release** 产物，关闭构建期签名，检查 JS bundle 后封装 `Payload/*.app`。每次都会先清掉上次的 IPA 封装，避免旧文件混入。不依赖 EAS 云端构建，不需要在 GitHub 配置 Apple ID。由 Sideloadly 在你的电脑上处理安装签名。GitHub Actions 的原生构建尚未实际运行，因此目前还没有已生成并验收的安装包。

Expo SDK 58 的 iOS 最低版本为 16.4。完整兼容要求见 [Expo 官方说明](https://docs.expo.dev/versions/latest/)。GitHub 的构建镜像见 [macOS 26 runner](https://github.com/actions/runner-images/blob/main/images/macos/macos-26-Readme.md)，安装工具见 [Sideloadly](https://sideloadly.io/)。Actions 产物保留 14 天，需在有效期内下载保存。

素材拆解、质感约束与提示词见 [docs/design-handoff.md](docs/design-handoff.md)。
