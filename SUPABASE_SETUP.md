# 🔧 Supabase 数据库配置指南

## 步骤 1: 获取 Supabase 连接字符串

### 1.1 登录 Supabase
1. 访问 https://supabase.com
2. 点击 "Sign In" 登录（如果没有账号，先注册）

### 1.2 创建项目（如果还没有）
1. 点击 "New Project"
2. 填写项目信息：
   - **Name**: `aiboss`
   - **Database Password**: 设置一个强密码（**务必记住！**）
   - **Region**: 选择离你最近的区域（如 `Northeast Asia (Tokyo)` 或 `Southeast Asia (Singapore)`）
3. 点击 "Create new project"
4. 等待项目创建完成（约 2 分钟）

### 1.3 获取连接字符串
1. 项目创建完成后，点击左侧菜单的 **"Project Settings"**（齿轮图标 ⚙️）
2. 点击 **"Database"** 标签
3. 向下滚动找到 **"Connection string"** 部分
4. 选择 **"URI"** 模式（不是 Session mode）
5. 复制显示的连接字符串

**连接字符串格式：**
```
postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

或者：
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

**重要提示：**
- `[YOUR-PASSWORD]` 需要替换为你创建项目时设置的密码
- 如果密码包含特殊字符（如 `@`, `#`, `$`, `%` 等），需要进行 URL 编码：
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`
  - `&` → `%26`

## 步骤 2: 更新环境变量

### 2.1 编辑 `backend/.env` 文件

将 `DATABASE_URL` 替换为你的 Supabase 连接字符串：

```env
# 数据库配置 - Supabase
DATABASE_URL="postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?schema=public"

# LLM API 配置 - DeepSeek
OPENAI_API_KEY="sk-c5b96f7c1554461d9930edf30c849b3d"
OPENAI_BASE_URL="https://api.deepseek.com"
OPENAI_MODEL="deepseek-chat"
OPENAI_MAX_TOKENS=4000

# 服务器配置
PORT=3001
NODE_ENV="development"

# Session 配置
SESSION_SECRET="your-super-secret-session-key-change-this-in-production"

# CORS 配置
CORS_ORIGIN="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=20
```

**注意：**
- 确保连接字符串末尾有 `?schema=public`
- 如果使用 Pooler 连接（端口 6543），性能会更好
- 如果使用直连（端口 5432），连接数有限制

### 2.2 同时更新 `backend/.env.local` 文件

保持两个文件同步，以便不同环境使用。

## 步骤 3: 测试连接

### 3.1 生成 Prisma Client
```bash
cd backend
npx prisma generate
```

### 3.2 推送数据库 Schema
```bash
npx prisma db push
```

**预期输出：**
```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "postgres", schema "public" at "aws-0-ap-southeast-1.pooler.supabase.com:6543"

🚀  Your database is now in sync with your Prisma schema. Done in 2.5s

✔ Generated Prisma Client (v5.22.0) to .\node_modules\@prisma\client in 89ms
```

### 3.3 查看数据库表（可选）
```bash
npx prisma studio
```

这会打开一个浏览器界面，你可以看到创建的表：
- `User`
- `Agent`
- `Task`

## 步骤 4: 在 Supabase 控制台查看

1. 回到 Supabase 项目
2. 点击左侧菜单的 **"Table Editor"**
3. 你应该能看到 Prisma 创建的表

## 常见问题

### Q1: 连接超时或无法连接
**解决方案：**
- 检查网络连接
- 确认 Supabase 项目状态是 "Active"
- 尝试使用直连端口（5432）而不是 Pooler（6543）

### Q2: 密码错误
**解决方案：**
- 在 Supabase 项目设置中重置数据库密码
- 确保密码中的特殊字符已进行 URL 编码

### Q3: Schema 不存在
**解决方案：**
- 确保连接字符串末尾有 `?schema=public`
- 或者在 Prisma schema 中指定 schema

## 下一步

配置完成后，你可以：
1. 启动后端服务：`npm run dev`
2. 启动前端服务：`cd ../frontend && npm run dev`
3. 访问应用：http://localhost:3000

---

**需要帮助？**
如果遇到问题，请提供：
1. 错误信息
2. 你使用的连接字符串（隐藏密码）
3. Supabase 项目区域
