# 阶段一详细实施方案：注册 `football` 变体

> 创建时间：2026-04-19
> 状态：待实施

---

## 子任务总览

| # | 子任务 | 涉及文件 | 难度 |
|---|--------|----------|------|
| 1.1 | 变体解析——`variant.ts` 增加 `football` 合法值 | `src/config/variant.ts` | 低 |
| 1.2 | 变体元数据——`variant-meta.ts` 增加 `football` 条目 | `src/config/variant-meta.ts` | 低 |
| 1.3 | 变体切换器——桌面端 header 增加 football 入口 | `src/app/panel-layout.ts` | 低 |
| 1.4 | 变体切换器——移动端菜单增加 football 按钮 | `src/app/panel-layout.ts` | 低 |
| 1.5 | 多语言——新增翻译 key | `src/locales/*/translation.json` | 低 |

---

## 子任务 1.1：变体解析——`variant.ts`

**文件**：`src/config/variant.ts`（共 33 行）

**当前逻辑**：`SITE_VARIANT` 通过三级优先级解析——构建时环境变量 → Tauri 桌面端 localStorage → Web 子域名匹配。其中有两处白名单校验，列出了所有合法变体名。

**改动内容**：

| 位置 | 当前代码 | 改为 |
|------|----------|------|
| 第 15 行 | `if (stored === 'tech' \|\| stored === 'full' \|\| stored === 'finance' \|\| stored === 'happy' \|\| stored === 'commodity')` | 条件末尾追加 `\|\| stored === 'football'` |
| 第 22 行（子域名匹配块） | `if (h.startsWith('commodity.')) return 'commodity';` | 在其后新增 `if (h.startsWith('football.')) return 'football';` |
| 第 27 行 | 同第 15 行的白名单校验 | 同样追加 `\|\| stored === 'football'` |

**验证**：在浏览器 localStorage 中设置 `worldmonitor-variant` 为 `football`，刷新后 `SITE_VARIANT` 应解析为 `'football'`。

---

## 子任务 1.2：变体元数据——`variant-meta.ts`

**文件**：`src/config/variant-meta.ts`（共 131 行）

**当前逻辑**：`VARIANT_META` 对象为每个变体定义了 SEO 信息（title、description、keywords、url、siteName 等）。

**改动内容**：在 `commodity` 条目之后（第 129 行 `}` 前），新增：

```ts
football: {
  title: 'Football Monitor - Global Football News Dashboard',
  description: 'Real-time global football news dashboard with live match events, transfer news, and football intelligence from around the world.',
  keywords: 'football news, soccer news, global football, match tracker, football monitor, transfer news, football intelligence, live scores, football map',
  url: 'https://football.worldmonitor.app/',
  siteName: 'Football Monitor',
  shortName: 'FootballMonitor',
  subject: 'Global Football News and Intelligence',
  classification: 'Football Dashboard, Sports News Aggregator',
  categories: ['news', 'sports'],
  features: [
    'Real-time football news',
    'Global match tracking',
    'Football news map',
    'AI-powered briefings',
  ],
},
```

**验证**：`VARIANT_META.football` 可正常访问，字段完整。

---

## 子任务 1.3：桌面端 Header 变体切换器

**文件**：`src/app/panel-layout.ts`

**当前逻辑**：`variant-switcher` 区域按顺序渲染 5 个变体按钮（full → tech → finance → commodity → happy），每个由 `<a>` 标签 + 图标 + 文字构成，用 `variant-divider` 分隔。

**改动内容**：在 happy 按钮闭合标签 `</a>` 之后，`` })()}</div> `` 之前，新增：

```html
<span class="variant-divider"></span>
<a href="${vHref('football', 'https://football.worldmonitor.app')}"
   class="variant-option ${SITE_VARIANT === 'football' ? 'active' : ''}"
   data-variant="football"
   ${vTarget('football')}
   title="${t('header.football')}${SITE_VARIANT === 'football' ? ` ${t('common.currentVariant')}` : ''}">
  <span class="variant-icon">⚽</span>
  <span class="variant-label">${t('header.football')}</span>
</a>
```

**验证**：Header 变体切换栏出现第 6 个"Football"按钮，图标为 ⚽。

---

## 子任务 1.4：移动端菜单变体按钮

**文件**：`src/app/panel-layout.ts`

**当前逻辑**：`variants` 数组定义了移动端菜单中显示的变体列表，每项包含 `key`、`icon`、`label`。

**改动内容**：在 `{ key: 'happy', icon: '☀️', label: 'Good News' }` 之后追加：

```ts
{ key: 'football', icon: '⚽', label: t('header.football') },
```

**验证**：移动端菜单底部出现 "Football ⚽" 选项，点击可切换。

---

## 子任务 1.5：多语言翻译 key

**文件**：所有 `src/locales/*/translation.json`

**改动内容**：在每个语言文件的 `header` 区域新增 `football` 翻译 key：

| 语言 | key | value |
|------|-----|-------|
| `en` | `header.football` | `"Football"` |
| `zh` | `header.football` | `"足球"` |
| 其他 19 种语言 | `header.football` | 先用 `"Football"` 兜底，后续逐步补充 |

**验证**：切换到不同语言时，变体切换器和移动菜单中的 Football 标签正确显示对应语言文案。

---

## 验证清单（阶段一整体）

- [ ] localStorage 设置 `worldmonitor-variant` 为 `football`，刷新后 `SITE_VARIANT` 为 `'football'`
- [ ] 页面 Header 变体切换器显示 ⚽ Football 按钮，且当前选中状态正确
- [ ] 点击 Football 按钮能切换到 football 变体
- [ ] 移动端菜单显示 Football 选项
- [ ] `VARIANT_META.football` 各字段正确
- [ ] 切换回 full 变体，原项目功能完全不受影响
- [ ] TypeScript 编译无报错
