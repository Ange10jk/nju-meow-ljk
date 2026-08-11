# 南雍猫札 · 开源准备计划

## 概述

本文档列出了在将「南雍猫札」微信小程序开源之前需要完成的各项工作，按优先级分为四个阶段。

---

## 阶段一：安全与隐私（开源前必须完成）

### 1.1 移除硬编码密钥

**当前问题：** `miniprogram/app.js` 第 10-13 行直接硬编码了阿里云 MPServerless 的敏感凭证。

**修复方案：**
- 创建 `miniprogram/config.example.js` 作为模板文件，包含占位符
- 将真实配置移至 `miniprogram/config.js`（该文件加入 `.gitignore`）
- 修改 `app.js` 从 `config.js` 导入配置
- 在 README 中说明开发者需复制 `config.example.js` → `config.js` 并填入自己的密钥

**受影响文件：**
- `miniprogram/app.js:10-13` — clientSecret / spaceId / appId / endpoint

### 1.2 轮换阿里云凭证

开源前到阿里云 MPServerless 控制台生成新的 `clientSecret`，使旧密钥失效。

### 1.3 创建 `.gitignore`

**当前问题：** 项目完全没有 `.gitignore`，导致 `node_modules`（3819+ 文件）被 Git 追踪。

**需忽略的内容：**
```
# 依赖
node_modules/
miniprogram/miniprogram_npm/

# 密钥配置
miniprogram/config.js

# IDE
.idea/
*.swp
*.swo

# 系统文件
.DS_Store
Thumbs.db

# 微信开发者工具
*.zip
```

### 1.4 从 Git 历史中清除 node_modules

即使添加了 `.gitignore`，已追踪的文件仍在历史中。需要：
```bash
git rm -r --cached node_modules/
git rm -r --cached cloudfunctions/quickstartFunctions/node_modules/
git rm -r --cached miniprogram/miniprogram_npm/
```
在新仓库中重新初始化或使用干净分支推送。

---

## 阶段二：项目文档（开源标配）

### 2.1 创建 README.md

需要包含：
- 项目名称与简介（南雍猫札 — 南京大学鼓楼校区流浪猫图鉴小程序）
- 功能截图（首页图鉴、地图、关系图、猫咪详情）
- 技术栈（微信原生小程序 + 阿里云 MPServerless + ECharts）
- 本地开发指南
  - 克隆仓库
  - 注册阿里云 MPServerless
  - 配置 `config.js`
  - 微信开发者工具导入
- 数据模型说明（`catsinfo` 集合字段）
- 鸣谢

### 2.2 选择并添加 LICENSE

推荐 **MIT** — 允许自由使用、修改、分发，限制最少。

### 2.3 创建 CONTRIBUTING.md

包含：
- 如何提交 Issue（Bug 报告、功能建议）
- 如何提交 PR（分支命名、commit 规范）
- 代码风格要求

### 2.4 创建 CHANGELOG.md

记录各版本的变更。

---

## 阶段三：代码清理

> **原则：** 只清理死代码和冗余注释，不修改任何现有业务逻辑。

### 3.1 `addcat.js` — 重复函数定义（死代码）

**位置：** `addcat.js:154-183`

`processImages` 方法被定义了两次（第 154 行和第 172 行），第二个定义覆盖第一个，导致第一个定义永远不会被执行。

**修复：** 删除第一个 `processImages` 定义（第 154-170 行），保留第二个（第 172-183 行）。行为完全不变。

### 3.2 清理注释掉的旧代码

迁移到阿里云后遗留了大量被注释的微信云开发代码，开源时应清理：

| 文件 | 行号 | 内容 |
|------|------|------|
| `app.js` | 18-29 | `wx.cloud.init()` 初始化代码 |
| `catsindex.js` | 27-37 | `wx.cloud.callFunction` 云函数调用 |
| `catsmap.js` | 58-61 | `wx.cloud.callFunction` 云函数调用 |
| `catdetail.js` | 129 | 旧的 CDN URL 注释 |
| `catsmap.js` | 152 | 旧的 CDN URL 注释 |
| `about.wxml` | 1-7 | 旧的验证模板 `wx:if="{{verify1/2}}"` |

### 3.3 清理 console.log 调试日志

**位置：** 所有 JS 文件，约 30+ 处

开发调试日志在开源版本中应清理。注意保留 `.catch(console.error)` 这类错误处理日志。

### 3.4 移除未使用的变量

- `editcat.js:1` — `var _id = "1"`，声明后从未使用
- `addcat.js:1` — `var _id = "1"`，声明后从未使用

### 3.5 移除闲置文件

- `miniprogram/envList.js` — 模板残留，内容为空数组，未被任何地方引用
- `uploadCloudFunction.sh` — 包含未替换的 `${placeholders}`，不可直接使用
- `cloudfunctions/` — 云函数已废弃（页面现在直接通过阿里云 SDK 查询 `catsinfo` 集合），可考虑移除

### 3.6 已知但暂不修改的问题（备忘）

以下问题涉及现有逻辑或数据库结构，**本轮不做修改**，后续版本可考虑：

| 问题 | 位置 | 说明 |
|------|------|------|
| `Math.random()` 坐标 | `addcat.js:54-55` | 新增猫时经纬度使用随机数，是现有业务逻辑 |
| `longtitude` 拼写 | 全文 & 数据库字段 | 应为 `longitude`，但改动会牵连数据库 |
| `Date()` 写法 | `editcat.js:123`, `addcat.js:114` | `Date()` 返回字符串，`new Date()` 返回对象，当前写法可能是有意为之 |
| `wx.cloud` Verify 死代码 | `catschart.js`, `about.js` | `wx.cloud.init()` 未调用，这些 `.catch` 兜底逻辑实为当前正常运行路径 |
| 搜索页 404 | `catsindex.wxml` | 搜索入口指向不存在的 `/pages/search/search`，可能预留后续开发 |

---

## 阶段四：开源规范补充

### 4.1 统一变量声明风格

全文混用 `var` 和 `const`/`let`，建议将 `for (var i = 0; ...)` 统一改为 `let`，不改变运行逻辑。

### 4.2 图片版权确认

`miniprogram/images/` 中约 16 张猫咪图片：
- 确认所有图片的版权/授权，特别是来自"宠物之家群友"的照片
- 文件命名不统一（有的用 `.jpeg`，有的用 `.jpg`），可后续整理

### 4.3 关于页个人信息确认

`about.wxml` 中包含开发团队成员和鸣谢者的真实姓名，需确认相关人员同意公开。

---

## 处理顺序建议

```
阶段一（安全）
  ├── 1.1 抽取密钥配置    ← 最先做
  ├── 1.2 轮换阿里云凭证
  ├── 1.3 创建 .gitignore
  └── 1.4 清理 Git 追踪

阶段二（文档）
  ├── 2.1 README.md
  ├── 2.2 LICENSE
  ├── 2.3 CONTRIBUTING.md
  └── 2.4 CHANGELOG.md

阶段三（代码清理）
  ├── 3.1 重复函数定义
  ├── 3.2 清理注释旧代码
  ├── 3.3 清理 console.log
  ├── 3.4 移除未使用变量
  └── 3.5 移除闲置文件

阶段四（规范补充）
  ├── 4.1 统一变量声明
  ├── 4.2 图片版权确认
  └── 4.3 个人信息确认
```

---

> **最后更新：** 2026-08-11
