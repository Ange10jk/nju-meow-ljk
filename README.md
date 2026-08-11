# 🐱 南雍猫札

南京大学鼓楼校区流浪猫图鉴微信小程序。

「南雍猫札」由南京大学未闻喵名团队开发，旨在记录南京大学鼓楼校区的流浪猫信息。这里每一只猫都有自己的名字、故事和关系，它们见证了南大人的青春，也值得被记录、被看见。

## ✨ 功能

- **猫咪图鉴** — 按花色分类浏览所有猫咪，查看详细信息（性别、性格、外貌、绝育状况等）
- **校园地图** — 在地图上查看猫咪常在的活动区域，一键跳转详情
- **关系图谱** — 可视化展示部分猫咪之间的家族与社交关系
- **管理后台** — 管理员可添加、编辑猫咪信息，上传照片

## 🛠 技术栈

- **框架：** 微信原生小程序
- **后端：** 阿里云 MPServerless（原微信云开发，已迁移）
- **图表：** ECharts（echarts-for-weixin）
- **语言：** JavaScript（CommonJS）

## 📁 项目结构

```
├── miniprogram/               # 小程序主体
│   ├── pages/
│   │   ├── catsindex/         # 首页 · 猫咪图鉴
│   │   ├── catsmap/           # 校园地图
│   │   ├── catdetail/         # 猫咪详情
│   │   ├── catschart/         # 关系图谱
│   │   ├── about/             # 关于页
│   │   ├── addcat/            # 添加猫咪（管理员）
│   │   └── editcat/           # 编辑猫咪（管理员）
│   ├── utils/
│   │   ├── cache.js           # 本地缓存工具
│   │   └── ec-canvas/         # ECharts Canvas 组件
│   ├── images/                # 图标与猫咪图片
│   ├── app.js                 # 应用入口
│   ├── app.json               # 应用配置
│   └── config.example.js      # 配置模板
├── project.config.json        # 微信开发者工具配置
└── package.json
```

## 🚀 本地开发

### 前置要求

- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 阿里云 MPServerless 服务空间（[开通地址](https://help.aliyun.com/document_detail/126644.html)）

### 步骤

1. **克隆仓库**

```bash
git clone git@github.com:qqj12345/nju-meow.git
cd nju-meow
```

2. **安装依赖**

```bash
npm install
```

3. **配置密钥**

```bash
cp miniprogram/config.example.js miniprogram/config.js
```

编辑 `miniprogram/config.js`，填入你在阿里云 MPServerless 控制台获取的 `spaceId`、`clientSecret` 等信息。

4. **替换 CDN 域名**

代码中的图片 URL 包含空间专属 CDN 域名（`mp-e82f2171-c791-4569-bc40-f35d3a76b4f7.cdn.bspapp.com`），全局搜索替换为你的 `cdnBase` 值。

5. **导入项目**

打开微信开发者工具，导入项目目录，选择 `miniprogram/` 作为小程序根目录。

6. **配置数据集合**

在阿里云 MPServerless 控制台创建以下数据库集合：
- `catsinfo` — 猫咪信息
- `admin` — 管理员用户

### 数据模型

`catsinfo` 集合字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | String | 猫咪名称（主键） |
| `color` | String | 花色（橘猫/狸花/奶牛/三花/纯色/玳瑁） |
| `gender` | String | 性别 |
| `status` | String | 状态（在校/已领养/送医/失踪/喵星） |
| `personality` | String | 性格描述 |
| `appearance` | String | 外貌描述 |
| `birth` | String | 出生日期 |
| `activity_range` | String | 活动区域 |
| `is_neutured` | String | 是否绝育 |
| `nickname` | String | 昵称 |
| `location` | Number | 活动区域编号 |
| `latitude` | Number | 地图坐标纬度 |
| `longtitude` | Number | 地图坐标经度 |
| `image_id` | String | 图片格式（默认 jpg） |

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！详见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 📄 许可证

本项目基于 MIT 协议开源，详见 [LICENSE](./LICENSE)。

## 👥 开发团队

- [@qqj12345](https://github.com/qqj12345)（姜子骞）
- [@Ange10jk](https://github.com/Ange10jk)（罗靖凯）
- 王子璇

## 🙏 鸣谢

- 最初整理猫咪图片和信息的群友们
- 宠物之家提供猫咪照片的群友
- 所有关心和爱护南大猫咪的同学们
