# 🔍 AI Boss - 安装验证指南

本指南帮助你验证 AI Boss 项目是否正确安装和配置。

## ✅ 验证清单

### 1. 环境检查

```bash
# 检查 Node.js 版本（需要 18+）
node --version

# 检查 npm 版本
npm --version

# 检查 PostgreSQL 是否运行
psql --version
```

### 2. 后端验证

#### 2.1 依赖安装检查

```bash
cd backend

# 检查依赖是否安装
ls node_modules | wc -l  # 应该有 100+ 个包

# 检查关键依赖
npm list openai express prisma typescript
```

#### 2.2 环境变量检查

```bash
cd backend

# 检查 .env.local 文件是否存在
ls -la .env.local

# 验证必需的环境变量
cat .env.local | grep -E "DATABASE_URL|OPENAI_API_KEY|OPENAI_BASE_URL"
```

**必需的环境变量：**
- `DATABASE_URL`: PostgreSQL 连接字符串
- `OPENAI_API_KEY`: DeepSeek API Key
- `OPENAI_BASE_URL`: https://api.deepseek.com
- `OPENAI_MODEL`: deepseek-chat
- `PORT`: 3001
- `SESSION_SECRET`: 随机字符串

#### 2.3 数据库检查

```bash
cd backend

# 生成 Prisma Client
npx prisma generate

# 检查数据库连接
npx prisma db push

# 查看数据库表
npx prisma studio
```

**预期结果：**
- Prisma Client 生成成功
- 数据库连接成功
- 创建了 `User`, `Agent`, `Task` 表

#### 2.4 Agent 配置检查

```bash
cd backend

# 检查 Agent 配置文件
ls -la src/agents/

# 验证 JSON 格式
cat src/agents/business-analyst.json | jq .
cat src/agents/copywriter.json | jq .
cat src/agents/project-assistant.json | jq .
```

**预期结果：**
- 3 个 Agent 配置文件存在
- JSON 格式正确
- 包含 `id`, `name`, `description`, `input_schema`, `prompt_template` 等字段

#### 2.5 启动后端服务

```bash
cd backend

# 启动开发服务器
npm run dev
```

**预期输出：**
```
🤖 LLM Service initialized with base URL: https://api.deepseek.com
📝 Using model: deepseek-chat
🚀 Server running on http://localhost:3001
```

**测试 API：**
```bash
# 测试健康检查
curl http://localhost:3001/health

# 测试获取 Agents
curl http://localhost:3001/api/agents
```

### 3. 前端验证

#### 3.1 依赖安装检查

```bash
cd frontend

# 检查依赖是否安装
ls node_modules | wc -l  # 应该有 200+ 个包

# 检查关键依赖
npm list next react react-dom axios
```

#### 3.2 环境变量检查

```bash
cd frontend

# 检查 .env.local 文件
cat .env.local
```

**必需的环境变量：**
- `NEXT_PUBLIC_API_URL`: http://localhost:3001

#### 3.3 启动前端服务

```bash
cd frontend

# 启动开发服务器
npm run dev
```

**预期输出：**
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
- Ready in 2.5s
```

**测试前端：**
- 打开浏览器访问 http://localhost:3000
- 应该看到 AI Boss 首页
- 应该看到 3 个数字员工卡片

### 4. 端到端测试

#### 4.1 测试商业分析师

1. 访问 http://localhost:3000
2. 点击 "AI 商业分析师" 卡片
3. 填写表单：
   - **想法描述**: "一个帮助独立开发者管理多个项目的 SaaS 工具"
   - **所属行业**: "SaaS"
   - **目标用户**: "独立开发者"
4. 点击 "提交任务"
5. 等待 20-30 秒
6. 应该看到结构化的商业分析报告

**预期结果：**
- 任务提交成功
- 跳转到任务结果页
- 显示分析报告（总结、核心问题、市场机会、潜在风险、行动建议）

#### 4.2 测试文案助理

1. 访问首页，点击 "AI 市场文案助理"
2. 填写表单：
   - **产品介绍**: "一款帮助团队协作的项目管理工具"
   - **使用场景**: "官网首页"
   - **文案风格**: "理性专业"
3. 点击 "提交任务"
4. 应该看到 3 套不同的文案方案

**预期结果：**
- 任务提交成功
- 显示 3 套文案（标题、副标题、正文、CTA）

#### 4.3 测试项目助理

1. 访问首页，点击 "AI 项目助理"
2. 填写表单：
   - **目标描述**: "在 2 周内完成一个个人博客网站的开发和上线"
   - **时间限制**: "2 周"
3. 点击 "提交任务"
4. 应该看到详细的任务清单和时间规划

**预期结果：**
- 任务提交成功
- 显示任务清单（任务 ID、标题、描述、优先级、预计时间、依赖关系）

## 🐛 常见问题排查

### 问题 1: 后端启动失败 - OPENAI_API_KEY is not set

**原因**: 环境变量未配置

**解决方案**:
```bash
cd backend
cp .env.example .env.local
# 编辑 .env.local，填入你的 DeepSeek API Key
```

### 问题 2: 数据库连接失败

**原因**: PostgreSQL 未运行或连接字符串错误

**解决方案**:
```bash
# 检查 PostgreSQL 是否运行
pg_isready

# 测试连接
psql -h localhost -U user -d aiboss

# 修改 DATABASE_URL
# 格式: postgresql://user:password@localhost:5432/aiboss?schema=public
```

### 问题 3: 前端无法连接后端

**原因**: 后端未启动或 CORS 配置错误

**解决方案**:
```bash
# 1. 确保后端正在运行
curl http://localhost:3001/health

# 2. 检查前端环境变量
cat frontend/.env.local

# 3. 检查浏览器控制台错误
```

### 问题 4: LLM 调用失败

**原因**: API Key 无效或网络问题

**解决方案**:
```bash
# 1. 验证 API Key
curl https://api.deepseek.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"

# 2. 检查网络连接
ping api.deepseek.com

# 3. 查看后端日志
cd backend
npm run dev
# 观察 LLM 调用日志
```

### 问题 5: Prisma 迁移失败

**原因**: 数据库权限或 schema 冲突

**解决方案**:
```bash
cd backend

# 重置数据库
npx prisma migrate reset

# 重新生成 Client
npx prisma generate

# 应用迁移
npx prisma db push
```

## 📊 性能基准

### 后端性能

- **Agent 列表查询**: < 50ms
- **任务创建**: < 100ms
- **LLM 调用**: 15-30 秒（取决于 DeepSeek API）
- **任务查询**: < 50ms

### 前端性能

- **首页加载**: < 2 秒
- **Agent 详情页**: < 1 秒
- **任务结果页**: < 1 秒

### 数据库性能

- **Agent 查询**: < 10ms
- **Task 插入**: < 20ms
- **Task 更新**: < 20ms

## ✅ 验证完成

如果所有测试都通过，恭喜你！AI Boss 已经正确安装和配置。

**下一步：**
1. 阅读 [PRD 文档](./prd.md) 了解产品设计
2. 阅读 [开发计划](./DEVELOPMENT_PLAN.md) 了解技术架构
3. 查看 [API 文档](./docs/api.md) 了解接口详情
4. 自定义 Agent 配置文件添加新的数字员工

## 🚀 开始使用

```bash
# 启动后端
cd backend && npm run dev

# 启动前端（新终端）
cd frontend && npm run dev

# 访问应用
open http://localhost:3000
```

**祝你使用愉快！** 🎉
