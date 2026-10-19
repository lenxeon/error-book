# 首页拆解与素材规范

唯一视觉基准：`ui/错题本3.png` 内的手机屏幕。右侧为放大说明，左侧说明文字与手机外框不属于应用界面。

## 需要图像的区域

| 区域 | 图像 | 实现方式 |
| --- | --- | --- |
| 顶部导航 | 男孩头像 | 复用原稿；代码裁成圆形 |
| 顶部整图 | 连续天空、男孩、狐狸、学校、描边标题与宣传语 | `home-top-unified-v2.png` 整图；上方叠加原生品牌、头像、年级和消息入口 |
| 核心入口 | 相机、机器人、错题本、打印机 | 使用原稿 atlas 对应图像区域，保留原稿原有质感 |
| 今日任务 | 清单、铅笔、植物、标题、副标题及开始学习按钮 | `task-whole-v2.png` 整图；仅题数徽标动态叠加，整张卡保留点击行为 |
| 学情分析 | 狐狸与灯泡 | 复用原稿；数据条、标题、提醒全部由组件绘制 |
| 最近错题 | 作业缩略图 | 示例使用原稿图像，用户数据使用实际收录照片 |
| 底部导航及消息 | 首页、书本、统计、人像、铃铛 | 原生 SVG 线条图标，无 emoji |

## 用户明确的视觉约束

- 柔和卡通插画，轻阴影和克制的体积感。
- 禁止强镜面高光、亮面塑料、金属反光、过度锐化或毛发写实化。
- 长图必须是完整矩形，最终圆角由样式处理。
- 2026-10-19 追加要求：顶部背景与横幅合成整图；任务卡除题数外整体出图，因此标题、宣传语、任务文案与视觉按钮允许包含在这两张素材内。
- React Native 中由 `borderRadius` / `overflow: hidden` 等样式控制最终外观，对应网页里的 CSS。
- 原稿四个功能小图优先直接复用，避免 AI 重绘改变材质和轮廓。

原稿 atlas 为 `assets/images/design-atlas.png`，由 `src/components/DesignArt.tsx` 在组件层定位显示；没有改写用户原始图。当前只能使用设计稿内的位图分辨率，若后续提供独立源素材，可替换 atlas 得到更清晰的高倍屏效果。小图不是重新生成的高光版本。

当前入口为 `App.tsx` → `src/screens/Home.tsx`。页面已合并最新布局、中文文案、矩形横幅和动态数据，临时副本已清理。

桌面图标 `assets/icon.png` 由代码矢量源 `assets/icon.svg` 导出，使用柔和色块，不使用高光塑料材质。

当前使用 `assets/images/home-top-unified-v2.png` 和 `assets/images/task-whole-v2.png`，由内置 imagegen 以原始设计稿为参考生成。旧版 `hero-matte.png` 保留作对照，不再被首页引用。首次生成的高光小图没有被应用引用。

顶部使用单个 3:2 背景，品牌行高度与整图宽度同比变化，下方点击区域直接覆盖场景，没有第二块天空背景或拼接边界。副标题为普通文本，不带下拉箭头；右上角圆头像与浅色年级胶囊是唯一的年级/学科切换入口。

任务卡显示比例为 3.55:1，保留图片比例、居中裁切；使用明确的图片宽高，避免绝对定位背景导致只显示左上角。按钮约占卡片宽度三分之一，文字、插画与按钮均来自同一张图；右上角题数来自实际复习队列。整张卡可点击，保持足够触摸面积，并提供完整的中文无障碍标签。

本轮完整提示词见 [image-prompts-v2.json](image-prompts-v2.json)。

## 旧版无字横幅提示词（已替换）

```text
Use case: precise-object-edit. Edit the supplied original small banner minimally.
Preserve its soft matte illustrated look EXACTLY: same flat soft shaded surfaces,
same gentle contrast, original character faces, colors, composition and softness.
Do NOT add glossy 3D rendering, specular reflections, shine, bloom, sharp edges,
plastic finish or fur texture. Remove ALL text (both Chinese headlines at left,
yellow button slogan and ABC letters on the book). Fill their areas with continuation
of the blue sky / green field illustration. Remove the yellow button entirely.
Fill the bottom white curved strip with the original green plants/ground.
Keep the boy and fox at RIGHT, leave the LEFT half mostly blue sky for native headline.
Output a full bleed RECTANGULAR 2:1 landscape banner, sharp square 90 degree corners,
illustration reaches ALL four edges, no rounded corners, no white corners, no UI,
no text, no buttons. Do not change anything else.
```

## 文案修正

| 原稿 | 当前 |
| --- | --- |
| 麦森英语 | 麦森错题本 |
| 让每个孩子，爱上英语 | 让每一道错题，成为进步 |
| 四年级上册 · 英语 / Unit 2 My School | 根据用户选择展示年级、学科与错题掌握进度 |
| 书本 ABC | 空白图案书本，无英文装饰字 |

“英语”作为可选学科名称保留；导航、功能、提示语没有英文 UI 文案。

## 交付边界

本轮没有 Figma/原始分层素材，只有设计稿位图。目标是保持布局、配色、比例、图标和整体风格接近；生成横幅与原稿存在细节差异，不能声称像素完全一致。原生字体、安全区和文字缩放也需要真机对照验收。
