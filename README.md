# 🤖 AI Boss - 数字 AI 劳务市场

> 像雇人一样雇 AI 干活

一个可以「像雇人一样雇 AI 干活」的 Web 应用。用户选择数字 AI 员工，提交任务，获得标准化交付物。

**本质定位**：AI 外包公司（不是聊天工具，不是 AI 工具集合）

![AI Boss 首页](./screenshots/homepage.png)

---

## ✨ 核心特性

- 🎯 **任务导向**：不是聊天，而是直接交付结果
- 👔 **专业化角色**：每个 AI 员工都有明确的专业领域
- 📋 **标准化输出**：结构化的交付物，可直接使用
- 💰 **透明定价**：明确的价格标签，按任务付费
- ⚡ **快速交付**：30 秒内完成大部分任务

---

## 🚀 快速开始

### 前置要求

- Node.js 18+
- PostgreSQL 14+
- OpenAI API Key（或其他 LLM API）

### 安装步骤

#### 1. 克隆项目

```bash
git clone https://github.com/anzx01/Aiboss.git
cd aiboss
```

#### 2. 安装后端依赖

```bash
cd backend
npm install
```

#### 3. 配置后端环境变量

创建 `backend/.env` 文件：

```env
# 数据库配置 - Supabase
# 使用 Pooler 连接，添加 pgbouncer=true 参数避免 prepared statement 错误
DATABASE_URL="postgresql://postgres.xxxxx:password@aws-x-region.pooler.supabase.com:6543/postgres?pgbouncer=true"

# LLM API 配置 - DeepSeek
OPENAI_API_KEY="sk-..."
OPENAI_BASE_URL="https://api.deepseek.com"
OPENAI_MODEL="deepseek-chat"
OPENAI_MAX_TOKENS=4000

# 服务器配置
PORT=3001
NODE_ENV="development"

# Session 配置
SESSION_SECRET="your-super-secret-session-key"

# CORS 配置
CORS_ORIGIN="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=20
```

**注意**：
- 如果使用 Supabase，请确保添加 `?pgbouncer=true` 参数
- 支持 DeepSeek API（兼容 OpenAI 格式）

#### 4. 初始化数据库

> 📖 **详细指南**：完整的数据库设置步骤请查看 [数据库设置详细指南](./docs/DATABASE_SETUP.md)

**快速开始（使用 Supabase）**：

1. 在 [Supabase](https://supabase.com) 创建项目
2. 获取 **Connection pooling** 连接字符串（端口 6543）
3. 在连接字符串末尾添加 `?pgbouncer=true` 参数
4. 在 Supabase SQL Editor 中执行以下 SQL：

```sql
-- 创建 TaskStatus 枚举类型
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- 创建 sessions 表
CREATE TABLE IF NOT EXISTS "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fingerprint" TEXT NOT NULL UNIQUE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_active_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建 tasks 表
CREATE TABLE IF NOT EXISTS "tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agent_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "input_data" JSONB NOT NULL,
    "output_data" JSONB,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "execution_time" INTEGER,
    CONSTRAINT "tasks_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS "tasks_session_id_idx" ON "tasks"("session_id");
CREATE INDEX IF NOT EXISTS "tasks_agent_id_idx" ON "tasks"("agent_id");
CREATE INDEX IF NOT EXISTS "tasks_status_idx" ON "tasks"("status");
```

**使用本地 PostgreSQL**：

```bash
cd backend
npx prisma db push
```

⚠️ **常见问题**：如果遇到 `prepared statement already exists` 错误，请确保使用 Connection pooling 连接并添加 `?pgbouncer=true` 参数。详见 [数据库设置详细指南](./docs/DATABASE_SETUP.md#常见问题排查)。

#### 5. 启动后端服务

```bash
npm run dev
```

后端服务将运行在 `http://localhost:3001`

#### 6. 安装前端依赖

```bash
cd ../frontend
npm install
```

#### 7. 配置前端环境变量

创建 `frontend/.env.local` 文件：

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

#### 8. 启动前端服务

```bash
npm run dev
```

前端服务将运行在 `http://localhost:3000`

---

## 📦 项目结构

```
aiboss/
├── frontend/              # Next.js 前端
│   ├── src/
│   │   ├── app/          # App Router 页面
│   │   ├── components/   # React 组件
│   │   ├── lib/          # 工具函数
│   │   ├── types/        # TypeScript 类型
│   │   └── styles/       # 样式文件
│   └── package.json
│
├── backend/              # Node.js 后端
│   ├── src/
│   │   ├── agents/       # Agent 配置
│   │   ├── routes/       # API 路由
│   │   ├── services/     # 业务逻辑
│   │   ├── models/       # 数据模型
│   │   └── index.ts      # 入口文件
│   ├── prisma/           # 数据库 Schema
│   └── package.json
│
├── docs/                 # 文档
├── prd.md               # 产品需求文档
├── DEVELOPMENT_PLAN.md  # 开发计划
└── README.md            # 项目说明
```

---

## 👥 数字 AI 员工

### 1. AI 商业分析师

**适用场景**：商业想法评估、方案分析

**输入**：
- 想法描述（必填）
- 行业 / 目标用户（可选）

**输出**：
- 结构化分析报告（问题 / 机会 / 风险 / 建议）

**价格**：¥9.9 / 次（MVP 阶段免费）

---

### 2. AI 市场文案助理

**适用场景**：产品文案、推广文案

**输入**：
- 产品介绍
- 使用场景
- 风格选择（理性 / 活泼 / 专业）

**输出**：
- 3 套可直接使用的文案

**价格**：¥6.9 / 次（MVP 阶段免费）

---

### 3. AI 项目助理

**适用场景**：目标拆解、任务规划

**输入**：
- 目标描述
- 时间限制（可选）

**输出**：
- 可执行 To-Do List（含优先级）

**价格**：¥8.9 / 次（MVP 阶段免费）

---

## 🛠️ 技术栈

### 前端
- **框架**：Next.js 14（App Router）
- **UI 库**：Tailwind CSS + shadcn/ui
- **状态管理**：React Context / Zustand
- **表单处理**：React Hook Form + Zod
- **HTTP 客户端**：Axios

### 后端
- **框架**：Node.js + Express
- **语言**：TypeScript
- **数据库**：Supabase PostgreSQL + Prisma ORM
- **LLM**：DeepSeek API（兼容 OpenAI 格式）

### 基础设施
- **前端部署**：Vercel
- **后端部署**：Railway / Render
- **数据库**：Supabase PostgreSQL
- **LLM API**：DeepSeek

---

## 📖 API 文档

### 获取所有数字员工

```http
GET /api/agents
```

**响应**：
```json
[
  {
    "id": "business-analyst",
    "name": "AI 商业分析师",
    "description": "帮你评估商业想法...",
    "price_label": "¥9.9 / 次",
    "suitable_scenarios": ["商业想法评估", "方案分析"],
    "unsuitable_scenarios": ["技术实现", "代码编写"]
  }
]
```

### 创建任务

```http
POST /api/tasks
Content-Type: application/json

{
  "agent_id": "business-analyst",
  "input_data": {
    "idea": "一个 AI 驱动的健身教练应用",
    "industry": "健康科技"
  }
}
```

**响应**：
```json
{
  "task_id": "task_123",
  "status": "processing"
}
```

### 获取任务结果

```http
GET /api/tasks/:id
```

**响应**：
```json
{
  "id": "task_123",
  "status": "completed",
  "output_data": {
    "analysis": "...",
    "opportunities": "...",
    "risks": "...",
    "recommendations": "..."
  },
  "created_at": "2024-01-01T00:00:00Z",
  "completed_at": "2024-01-01T00:00:25Z"
}
```

完整 API 文档请查看 [docs/api.md](./docs/api.md)

---

## 🧪 开发指南

### 运行测试

```bash
# 后端测试
cd backend
npm test

# 前端测试
cd frontend
npm test
```

### 代码规范

```bash
# 后端 Lint
cd backend
npm run lint

# 前端 Lint
cd frontend
npm run lint
```

### 数据库迁移

```bash
cd backend

# 创建新迁移
npx prisma migrate dev --name migration_name

# 应用迁移
npx prisma migrate deploy

# 重置数据库
npx prisma migrate reset
```

---

## 🚀 部署

### 前端部署（Vercel）

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量：
   - `NEXT_PUBLIC_API_URL`
3. 自动部署

### 后端部署（Railway）

1. 创建新项目并连接 GitHub
2. 添加 PostgreSQL 数据库
3. 配置环境变量：
   - `DATABASE_URL`
   - `OPENAI_API_KEY`
   - `SESSION_SECRET`
4. 运行迁移：`npx prisma migrate deploy`
5. 部署

详细部署文档请查看 [docs/deployment.md](./docs/deployment.md)

---

## 📊 开发进度

- [x] PRD 文档
- [x] 开发计划
- [x] 项目初始化
- [x] Agent 定义与 Prompt 工程
- [x] 后端开发（Express + Prisma + DeepSeek API）
- [x] 前端开发（Next.js 14 + Tailwind CSS）
- [x] 数据库配置（Supabase PostgreSQL）
- [x] 完整功能测试
- [ ] 内测发布
- [ ] 公开发布

---

## 🎯 MVP 目标

### 验证假设
1. 用户是否愿意把「具体工作任务」交给 AI 数字员工完成
2. 角色化、定价化、交付导向的 AI 是否比 Chat 更好用
3. 用户对「任务外包」心智模型的接受度

### 成功指标
- 7 天内获得 100+ 独立用户
- 任务完成数 > 200
- 任务完成率 > 85%
- D7 留存率 > 20%
- 重复使用率 > 30%

---

## 🤝 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

---

## 📞 联系方式

- **项目主页**：https://github.com/anzx01/Aiboss
- **问题反馈**：https://github.com/anzx01/Aiboss/issues
- **邮箱**：[your-email@example.com]

---

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Prisma](https://www.prisma.io/) - 数据库 ORM
- [shadcn/ui](https://ui.shadcn.com/) - UI 组件库
- [OpenAI](https://openai.com/) - LLM API

---

> **MVP 判断标准：**
> 不是"像不像平台"，而是"像不像真的能外包活"。

**让我们开始构建吧！** 🚀
