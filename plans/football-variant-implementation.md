# 全球足球新闻监控（Global Football Monitor）——技术实施计划

> 创建时间：2026-04-19
> 状态：待实施

---

## 一、项目背景

将 World Monitor 改造为**全球足球新闻实时监控平台**。核心是**地图 + 新闻流**，保留原有的工程架构能力和技术基础设施。

### 需求约束

- **保留**：双地图引擎（3D Globe + 2D DeckGL）、工程架构（多变体、i18n、认证、桌面端、Docker 等）
- **屏蔽不删除**：原有业务面板（军事、金融、气候、供应链等）通过配置开关隐藏，代码全部保留
- **新建不修改**：足球新闻面板、AI 简报面板采用新建代码方式，不修改原有组件
- **数据来源**：自有 REST JSON API（后续提供示例数据），同时保留原项目 RSS/数据源获取能力
- **地图视觉**：暂不定制，保持原有深色主题
- **面板布局**：沿用原项目的面板布局体系

---

## 二、核心思路

采用项目已有的**变体（Variant）机制**作为改造载体——新增一个 `football` 变体。原项目的配置驱动架构天然支持"同一代码库、不同功能组合"，只需在配置层注册新变体，定义它包含哪些面板和图层，即可实现"屏蔽但不删除"的目标。

---

## 三、实施阶段

### 阶段一：注册 `football` 变体（基础设施）

**目标**：让项目识别并支持 `football` 这个新变体，能正常启动并显示空白界面。

| 改动点 | 文件 | 内容 |
|--------|------|------|
| 变体解析 | `src/config/variant.ts` | 新增 `'football'` 合法值，新增 `football.` 子域名匹配 |
| 变体元数据 | `src/config/variant-meta.ts` | 新增 `football: VariantMeta`（标题、描述、SEO 关键词） |
| 变体切换器 UI | `src/app/panel-layout.ts` | 在 header 变体切换器和移动端菜单中增加 football 入口 |

**验证标准**：本地访问 `?variant=football` 或设置 localStorage 后，页面能正常加载，显示空白地图 + 空面板区。

---

### 阶段二：配置 `football` 变体的面板与图层（屏蔽原有业务）

**目标**：`football` 变体只显示地图，隐藏所有原有业务面板和图层。

| 改动点 | 文件 | 内容 |
|--------|------|------|
| 面板注册 | `src/config/panels.ts` | 新增 `FOOTBALL_PANELS`（仅含 `map`），新增 `FOOTBALL_MAP_LAYERS`（全部关闭），注册到 `VARIANT_DEFAULTS` |
| 图层定义 | `src/config/map-layer-definitions.ts` | `MapVariant` 类型扩展 `'football'`，新增 `VARIANT_LAYER_ORDER.football`（空数组或仅基础图层） |
| 默认值解析 | `src/config/panels.ts` | 在 `DEFAULT_MAP_LAYERS` / `MOBILE_DEFAULT_MAP_LAYERS` 的三元链中加入 `football` 分支 |

**验证标准**：`football` 变体下，地图全屏展示，无任何业务面板和图层干扰。切换回 `full` 变体，一切恢复正常。

---

### 阶段三：对接足球新闻 REST API（数据层）

**目标**：新建独立的数据获取模块，对接后端 API，不修改原有数据管道。

| 改动点 | 文件 | 内容 |
|--------|------|------|
| API 客户端 | **新建** `src/services/football-api-client.ts` | 封装对 REST API 的调用，返回类型化数据 |
| 数据类型 | **新建** `src/types/football.ts` | 定义足球新闻的 TypeScript 类型（标题、时间、地理位置等） |
| 数据加载 | `src/app/data-loader.ts` | 新增 `loadFootballNews()` 方法，仅在 `football` 变体下执行 |
| 启动集成 | `src/App.ts` | 在数据加载阶段调用足球数据加载，加入刷新调度 |

**数据流**：后端 API → `football-api-client` → `data-loader` → 分发给面板和地图

**验证标准**：浏览器控制台能看到从 API 获取到的数据，数据格式正确解析。

---

### 阶段四：新建足球新闻面板（展示层 - 新闻）

**目标**：新建独立的足球新闻面板组件，展示新闻列表。

| 改动点 | 文件 | 内容 |
|--------|------|------|
| 新闻面板 | **新建** `src/components/FootballNewsPanel.ts` | 继承 `Panel` 基类，展示足球新闻列表（标题、时间、来源等） |
| 面板注册 | `src/config/panels.ts` | `FOOTBALL_PANELS` 中新增此面板的配置 |
| 面板实例化 | `src/app/panel-layout.ts` | 在变体条件分支中实例化 `FootballNewsPanel` |
| 数据分发 | `src/app/data-loader.ts` | 将加载的新闻数据推送到面板实例 |

**验证标准**：新闻面板显示在地图旁侧，正确渲染新闻列表。

---

### 阶段五：地图新闻标注 + 面板联动（展示层 - 地图）

**目标**：新闻地理位置在地图上可视化，面板与地图双向联动。

| 改动点 | 文件 | 内容 |
|--------|------|------|
| 地图标注 | `src/components/DeckGLMap.ts` / `GlobeMap.ts` | 新增 `setFootballNews()` 方法，用 ScatterplotLayer 渲染新闻点 |
| 图层配置 | `src/config/map-layer-definitions.ts` | 注册 `footballNews` 图层定义，`football` 变体默认启用 |
| 联动逻辑 | **新建** `src/services/football-map-sync.ts` | 点击面板新闻 → 地图定位；点击地图标注 → 面板高亮滚动 |
| 数据推送 | `src/app/data-loader.ts` | 新闻数据同时推送到面板和地图 |

**验证标准**：地图上显示新闻地理标注，点击标注/新闻能互相定位。

---

### 阶段六：新建 AI 简报面板（展示层 - AI）

**目标**：复用项目已有的 LLM 集成，生成足球新闻 AI 摘要。

| 改动点 | 文件 | 内容 |
|--------|------|------|
| AI 简报面板 | **新建** `src/components/FootballBriefPanel.ts` | 继承 `Panel` 基类，展示 AI 生成的足球新闻摘要 |
| AI 调用 | **新建** `src/services/football-brief-service.ts` | 调用项目已有的 LLM 管道，传入足球新闻数据生成摘要 |
| 面板注册 | 同阶段四 | `FOOTBALL_PANELS` 中新增此面板 |

**验证标准**：AI 简报面板显示由 LLM 生成的足球新闻摘要。

---

### 阶段七：多语言 & 收尾

**目标**：补充国际化文案，整体打磨。

| 改动点 | 文件 | 内容 |
|--------|------|------|
| 中文文案 | `src/locales/zh/translation.json` | 新增足球面板相关的翻译 key |
| 英文文案 | `src/locales/en/translation.json` | 同上 |
| 其他语言 | 其他 19 个语言文件 | 优先用英文兜底，后续逐步补充 |
| 构建脚本 | `package.json` | 新增 `build:football` 构建命令 |

---

## 四、文件变更总览

### 新建文件（不修改原有业务逻辑代码）

```
src/
  types/football.ts                        # 足球数据类型定义
  services/football-api-client.ts          # REST API 客户端
  services/football-map-sync.ts            # 面板-地图联动逻辑
  services/football-brief-service.ts       # AI 简报服务
  components/FootballNewsPanel.ts          # 新闻面板
  components/FootballBriefPanel.ts         # AI 简报面板
```

### 需修改的配置文件（仅扩展，不删除原有内容）

```
src/config/variant.ts                      # +football 变体解析
src/config/variant-meta.ts                 # +football 元数据
src/config/panels.ts                       # +FOOTBALL_PANELS / +FOOTBALL_MAP_LAYERS
src/config/map-layer-definitions.ts        # +football 图层
src/app/panel-layout.ts                    # +football 面板实例化
src/app/data-loader.ts                     # +足球数据加载
src/App.ts                                 # +football 初始化分支
package.json                               # +build:football 脚本
```

---

## 五、难度评估

| 阶段 | 难度 | 风险点 |
|------|------|--------|
| 一：变体注册 | 低 | 无，纯配置扩展 |
| 二：面板/图层屏蔽 | 低 | 无，纯配置 |
| 三：数据对接 | **中** | 依赖 API 示例数据来精确定义类型映射 |
| 四：新闻面板 | 中 | 需理解 Panel 基类的生命周期，但新建代码风险低 |
| 五：地图联动 | **中高** | DeckGLMap 6600+ 行，需找准注入点 |
| 六：AI 简报 | 中 | 复用已有 LLM 管道，主要工作是 prompt 设计 |
| 七：多语言收尾 | 低 | 纯文案工作 |

---

## 六、前置依赖

- [x] 需求调研完成
- [ ] API 示例 JSON 响应（阶段三启动前需要提供）
- [x] 屏蔽策略确认：配置开关
- [x] 面板布局确认：沿用原项目
- [x] 地图视觉确认：暂不定制
