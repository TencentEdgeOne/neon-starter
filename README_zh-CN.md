# Neon 数据库模板

<p align="center">
  <a href="https://edgeone.ai/pages/new?template=neon-starter">
    <img src="https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg" alt="部署到 EdgeOne Pages" height="40">
  </a>
</p>

一个简单的 Next.js 入门项目，包含 Neon Postgres 数据库和身份验证功能。

## 特性

- 邮箱/密码身份验证
- Neon Postgres 数据库
- 深色模式支持
- 页面访问统计
- 用户统计
- 数据库连接状态

## 快速开始

### 1. 创建 Neon 数据库

1. 前往 [https://console.neon.tech](https://console.neon.tech) 注册账号
2. 创建新项目
3. 复制连接字符串（以 `postgresql://` 开头）

### 2. 配置环境变量

```bash
# 复制示例环境文件
cp .env.example .env

# 编辑 .env 文件，添加 Neon 连接字符串：
DATABASE_URL=postgresql://username:password@host.neon.tech/dbname?sslmode=require
```

### 3. 安装依赖

```bash
pnpm install
```

### 4. 初始化数据库

```bash
# 创建数据库表
pnpm db:init
```

这将创建：
- `users` 表 - 存储用户账户
- `page_visits` 表 - 跟踪页面统计

### 5. 运行开发服务器

```bash
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000)

## 可用脚本

| 命令 | 描述 |
|---------|-------------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm db:init` | 初始化数据库表 |
| `pnpm db:generate` | 生成 Drizzle 迁移 |
| `pnpm db:push` | 推送 schema 变更到数据库 |
| `pnpm db:studio` | 打开 Drizzle Studio（数据库 GUI）|

## 数据库 Schema

模板使用 Drizzle ORM，包含两个表：

### users
| 字段 | 类型 | 描述 |
|--------|------|-------------|
| id | SERIAL | 主键 |
| email | VARCHAR(255) | 用户邮箱（唯一） |
| password_hash | TEXT | Bcrypt 哈希密码 |
| name | VARCHAR(255) | 可选显示名称 |
| created_at | TIMESTAMP | 账户创建时间 |
| updated_at | TIMESTAMP | 最后更新时间 |

### page_visits
| 字段 | 类型 | 描述 |
|--------|------|-------------|
| id | SERIAL | 主键 |
| page | VARCHAR(100) | 页面标识 |
| count | INTEGER | 访问次数 |
| last_visit | TIMESTAMP | 最后访问时间 |

## 部署到 EdgeOne Pages

### 一键部署

[![部署到 EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?template=neon-starter)

点击上方按钮直接将此模板部署到 EdgeOne Pages。

> **注意**：部署后需要在 EdgeOne Pages 控制台配置环境变量。

### 手动部署

1. 推送代码到 Git 仓库
2. 在 EdgeOne Pages 控制台连接仓库
3. 添加环境变量：
   - `DATABASE_URL` - Neon 连接字符串
   - `SESSION_SECRET` - 随机字符串（至少 32 位）
4. 部署

## 环境变量

| 变量 | 描述 | 必填 |
|----------|-------------|----------|
| `DATABASE_URL` | Neon Postgres 连接字符串 | 是 |
| `SESSION_SECRET` | 会话加密密钥（至少 32 位） | 是 |
| `NEXT_PUBLIC_APP_URL` | 应用 URL（默认：http://localhost:3000） | 否 |

## 技术栈

- **框架**: [Next.js 14](https://nextjs.org/) (App Router)
- **数据库**: [Neon Postgres](https://neon.tech/) + [Drizzle ORM](https://orm.drizzle.team/)
- **身份验证**: [iron-session](https://github.com/vvo/iron-session)
- **样式**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **主题**: [next-themes](https://github.com/pacocoursey/next-themes)

## 项目结构

```
neon-starter/
├── app/
│   ├── actions/authActions.ts    # 身份验证 Server Actions
│   ├── api/logout/route.ts       # 登出 API 路由
│   ├── components/
│   │   ├── ui/                   # UI 组件（Card、Button、Input 等）
│   │   ├── header.tsx            # 导航头部
│   │   └── theme-provider.tsx    # 深色模式提供者
│   ├── lib/
│   │   ├── auth.ts               # 会话和密码工具
│   │   ├── db.ts                 # 数据库连接
│   │   └── utils.ts              # 辅助函数
│   ├── login/page.tsx            # 登录页面
│   ├── register/page.tsx         # 注册页面
│   ├── globals.css               # 全局样式
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 首页
├── db/schema.ts                  # 数据库 schema 定义
├── scripts/init-db.ts            # 数据库初始化脚本
├── .env.example                  # 环境变量模板
├── drizzle.config.ts             # Drizzle ORM 配置
├── edgeone.json                  # EdgeOne Pages 部署配置
└── package.json
```

## 故障排除

### 数据库未连接
- 检查 `.env` 文件中的 `DATABASE_URL`
- 确保已创建数据库表：`pnpm db:init`
- 在 [console.neon.tech](https://console.neon.tech) 验证 Neon 数据库状态

### 会话错误
- 确保 `SESSION_SECRET` 至少 32 位字符
- 清除浏览器 Cookie 后重试
