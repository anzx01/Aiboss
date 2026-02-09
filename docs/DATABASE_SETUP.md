# 数据库设置详细指南

本指南将详细说明如何为 AI Boss 项目设置数据库。我们推荐使用 Supabase PostgreSQL，因为它提供免费套餐、自动备份和易于管理的界面。

---

## 目录

1. [使用 Supabase（推荐）](#使用-supabase推荐)
2. [使用本地 PostgreSQL](#使用本地-postgresql)
3. [验证数据库设置](#验证数据库设置)
4. [常见问题排查](#常见问题排查)

---

## 使用 Supabase（推荐）

### 步骤 1：创建 Supabase 账号

1. 访问 [https://supabase.com](https://supabase.com)
2. 点击右上角的 **"Start your project"** 或 **"Sign Up"**
3. 使用 GitHub 账号登录（推荐）或使用邮箱注册

### 步骤 2：创建新项目

1. 登录后，点击 **"New Project"** 按钮
2. 填写项目信息：
   - **Name**：输入项目名称，例如 `aiboss` 或 `ai-boss-production`
   - **Database Password**：设置一个强密码（至少 12 位，包含大小写字母、数字和特殊字符）
     - ⚠️ **重要**：请妥善保存此密码，后续无法查看
   - **Region**：选择离你最近的区域
     - 中国用户推荐：`Southeast Asia (Singapore)` 或 `Northeast Asia (Tokyo)`
     - 其他地区：选择最近的数据中心
   - **Pricing Plan**：选择 **Free** 免费套餐（足够 MVP 使用）

3. 点击 **"Create new project"** 按钮
4. 等待 1-2 分钟，Supabase 会自动创建数据库实例

### 步骤 3：获取数据库连接字符串

1. 项目创建完成后，点击左侧菜单的 **"Project Settings"**（齿轮图标）
2. 在左侧子菜单中选择 **"Database"**
3. 向下滚动到 **"Connection string"** 部分
4. 选择 **"Connection pooling"** 标签页（不是 "URI" 标签页）
   - ⚠️ **重要**：必须使用 Connection pooling，否则会出现连接错误
5. 在 **"Connection string"** 下拉菜单中选择 **"Session mode"**
6. 复制显示的连接字符串，格式类似：
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-x-region.pooler.supabase.com:6543/postgres
   ```
7. 将 `[YOUR-PASSWORD]` 替换为你在步骤 2 中设置的数据库密码
8. 在连接字符串末尾添加 `?pgbouncer=true` 参数，最终格式：
   ```
   postgresql://postgres.xxxxx:your-password@aws-x-region.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

### 步骤 4：配置后端环境变量

1. 打开 `backend/.env` 文件（如果不存在则创建）
2. 将获取的连接字符串填入 `DATABASE_URL`：

```env
# 数据库配置 - Supabase
# 使用 Pooler 连接（端口 6543），添加 pgbouncer=true 参数避免 prepared statement 错误
DATABASE_URL="postgresql://postgres.xxxxx:your-password@aws-x-region.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### 步骤 5：创建数据库表

#### 方法 A：使用 Supabase SQL Editor（推荐）

1. 返回 Supabase 项目主页
2. 点击左侧菜单的 **"SQL Editor"**
3. 点击 **"New query"** 按钮
4. 将以下 SQL 代码粘贴到编辑器中：

```sql
-- ============================================
-- AI Boss 数据库初始化脚本
-- ============================================

-- 1. 创建 TaskStatus 枚举类型
-- 用于定义任务的状态：待处理、处理中、已完成、失败
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- 2. 创建 sessions 表
-- 用于存储用户会话信息（基于浏览器指纹识别）
CREATE TABLE IF NOT EXISTS "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,                    -- 会话唯一标识符
    "fingerprint" TEXT NOT NULL UNIQUE,                -- 浏览器指纹（用于识别用户）
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,      -- 创建时间
    "last_active_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP   -- 最后活跃时间
);

-- 3. 创建 tasks 表
-- 用于存储用户提交的任务及其执行结果
CREATE TABLE IF NOT EXISTS "tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,                    -- 任务唯一标识符
    "agent_id" TEXT NOT NULL,                          -- 数字员工 ID（如 business-analyst）
    "session_id" TEXT NOT NULL,                        -- 关联的会话 ID
    "input_data" JSONB NOT NULL,                       -- 用户输入的任务数据（JSON 格式）
    "output_data" JSONB,                               -- AI 生成的输出结果（JSON 格式）
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',  -- 任务状态
    "error_message" TEXT,                              -- 错误信息（如果任务失败）
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,      -- 创建时间
    "completed_at" TIMESTAMP(3),                       -- 完成时间
    "execution_time" INTEGER,                          -- 执行时长（毫秒）

    -- 外键约束：任务必须关联到一个有效的会话
    -- ON DELETE CASCADE：删除会话时自动删除相关任务
    CONSTRAINT "tasks_session_id_fkey" FOREIGN KEY ("session_id")
        REFERENCES "sessions"("id") ON DELETE CASCADE
);

-- 4. 创建索引以提升查询性能
-- 索引 1：按会话 ID 查询任务（用于获取用户的所有任务）
CREATE INDEX IF NOT EXISTS "tasks_session_id_idx" ON "tasks"("session_id");

-- 索引 2：按数字员工 ID 查询任务（用于统计各员工的使用情况）
CREATE INDEX IF NOT EXISTS "tasks_agent_id_idx" ON "tasks"("agent_id");

-- 索引 3：按任务状态查询（用于监控待处理/失败的任务）
CREATE INDEX IF NOT EXISTS "tasks_status_idx" ON "tasks"("status");

-- ============================================
-- 初始化完成
-- ============================================
```

5. 点击右下角的 **"Run"** 按钮（或按 `Ctrl+Enter` / `Cmd+Enter`）
6. 等待执行完成，应该看到 **"Success. No rows returned"** 消息
7. 如果看到错误信息，请参考 [常见问题排查](#常见问题排查) 部分

#### 方法 B：使用 Prisma CLI

如果你更喜欢使用命令行工具：

```bash
cd backend
npx prisma db push
```

⚠️ **注意**：使用此方法前，请确保 `backend/.env` 中的 `DATABASE_URL` 已正确配置。

### 步骤 6：验证表创建成功

1. 在 Supabase 左侧菜单中点击 **"Table Editor"**
2. 你应该看到两个表：
   - `sessions`：会话表
   - `tasks`：任务表
3. 点击每个表，查看列结构是否正确

---

## 使用本地 PostgreSQL

如果你想在本地开发环境使用 PostgreSQL：

### 步骤 1：安装 PostgreSQL

#### Windows

1. 下载 PostgreSQL 安装程序：[https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. 运行安装程序，推荐版本：PostgreSQL 14 或更高
3. 安装过程中设置 `postgres` 用户的密码（请记住此密码）
4. 默认端口：5432（保持默认即可）

#### macOS

使用 Homebrew 安装：

```bash
brew install postgresql@14
brew services start postgresql@14
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 步骤 2：创建数据库

```bash
# 登录 PostgreSQL
psql -U postgres

# 创建数据库
CREATE DATABASE aiboss;

# 退出
\q
```

### 步骤 3：配置环境变量

编辑 `backend/.env` 文件：

```env
# 本地 PostgreSQL 连接
DATABASE_URL="postgresql://postgres:your-password@localhost:5432/aiboss"
```

将 `your-password` 替换为你的 PostgreSQL 密码。

### 步骤 4：初始化数据库

```bash
cd backend
npx prisma db push
```

---

## 验证数据库设置

### 方法 1：使用 Prisma Studio

Prisma Studio 是一个可视化数据库管理工具：

```bash
cd backend
npx prisma studio
```

浏览器会自动打开 `http://localhost:5555`，你可以查看和编辑数据库内容。

### 方法 2：测试后端连接

1. 启动后端服务：

```bash
cd backend
npm run dev
```

2. 如果看到以下输出，说明数据库连接成功：

```
Server running on http://localhost:3001
Database connected successfully
```

3. 测试 API 端点：

```bash
# 获取所有数字员工
curl http://localhost:3001/api/agents
```

应该返回 3 个数字员工的 JSON 数据。

### 方法 3：直接查询数据库

#### Supabase

1. 在 Supabase 项目中打开 **"SQL Editor"**
2. 运行以下查询：

```sql
-- 查看所有表
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- 查看 sessions 表结构
\d sessions

-- 查看 tasks 表结构
\d tasks
```

#### 本地 PostgreSQL

```bash
psql -U postgres -d aiboss

-- 查看所有表
\dt

-- 查看 sessions 表结构
\d sessions

-- 查看 tasks 表结构
\d tasks
```

---

## 常见问题排查

### 问题 1：`prepared statement "s0" already exists`

**原因**：使用了 Supabase 的直接连接（端口 5432）而不是 Pooler 连接（端口 6543）。

**解决方案**：

1. 确保使用 **Connection pooling** 连接字符串（端口 6543）
2. 在连接字符串末尾添加 `?pgbouncer=true` 参数

正确格式：
```
postgresql://postgres.xxxxx:password@aws-x-region.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### 问题 2：`Can't reach database server`

**原因**：网络连接问题或连接字符串错误。

**解决方案**：

1. 检查网络连接是否正常
2. 确认连接字符串中的密码是否正确
3. 确认 Supabase 项目状态是否为 "Active"
4. 尝试在 Supabase 项目设置中重置数据库密码

### 问题 3：`type "TaskStatus" already exists`

**原因**：枚举类型已经存在，重复执行了创建脚本。

**解决方案**：

这不是错误，可以忽略。如果想重新创建，先删除：

```sql
-- 删除表（会同时删除所有数据）
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;

-- 删除枚举类型
DROP TYPE IF EXISTS "TaskStatus";

-- 然后重新执行创建脚本
```

### 问题 4：`relation "tasks" does not exist`

**原因**：数据库表未创建成功。

**解决方案**：

1. 确认是否正确执行了 SQL 创建脚本
2. 在 Supabase Table Editor 中检查表是否存在
3. 重新执行步骤 5 的 SQL 脚本

### 问题 5：Prisma 连接超时

**原因**：数据库连接池配置不当或网络延迟。

**解决方案**：

在 `backend/prisma/schema.prisma` 中调整连接池设置：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")

  // 添加连接池配置
  relationMode = "prisma"
}
```

或在 `.env` 中添加连接池参数：

```env
DATABASE_URL="postgresql://...?pgbouncer=true&connection_limit=10&pool_timeout=20"
```

### 问题 6：权限错误 `permission denied`

**原因**：数据库用户权限不足。

**解决方案**（仅适用于本地 PostgreSQL）：

```sql
-- 授予所有权限
GRANT ALL PRIVILEGES ON DATABASE aiboss TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
```

Supabase 用户无需担心此问题，默认已有完整权限。

---

## 数据库维护

### 备份数据库

#### Supabase

Supabase 免费套餐提供 7 天自动备份。手动备份：

1. 打开 **"Database"** → **"Backups"**
2. 点击 **"Create backup"**

#### 本地 PostgreSQL

```bash
# 导出数据库
pg_dump -U postgres aiboss > backup.sql

# 恢复数据库
psql -U postgres aiboss < backup.sql
```

### 清空数据库

⚠️ **警告**：此操作会删除所有数据，无法恢复！

```sql
-- 删除所有任务
TRUNCATE TABLE tasks CASCADE;

-- 删除所有会话（会同时删除关联的任务）
TRUNCATE TABLE sessions CASCADE;
```

### 查看数据库统计

```sql
-- 查看任务总数
SELECT COUNT(*) FROM tasks;

-- 查看各状态任务数量
SELECT status, COUNT(*)
FROM tasks
GROUP BY status;

-- 查看各数字员工的使用次数
SELECT agent_id, COUNT(*)
FROM tasks
GROUP BY agent_id
ORDER BY COUNT(*) DESC;

-- 查看平均执行时间
SELECT agent_id, AVG(execution_time) as avg_time_ms
FROM tasks
WHERE status = 'COMPLETED'
GROUP BY agent_id;
```

---

## 下一步

数据库设置完成后，请继续：

1. [启动后端服务](../README.md#5-启动后端服务)
2. [启动前端服务](../README.md#8-启动前端服务)
3. [测试完整功能](../README.md#验证功能)

如有其他问题，请查看 [项目主 README](../README.md) 或提交 [Issue](https://github.com/anzx01/Aiboss/issues)。
