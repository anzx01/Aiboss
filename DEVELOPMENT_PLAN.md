# 数字 AI 劳务市场 - 详细开发计划

## 📅 项目时间线（8 天 MVP）

```
Day 1-2: Agent 定义 + Prompt 工程
Day 3-5: 后端开发 + LLM 集成
Day 6-7: 前端开发
Day 8: 测试与优化
```

---

## 🎯 Phase 0: 项目初始化（0.5 天）

### 任务清单

- [x] 创建项目目录结构
- [ ] 初始化 Git 仓库
- [ ] 创建 README.md 和开发文档
- [ ] 配置开发环境

### 目录结构

```
aiboss/
├── frontend/              # Next.js 前端
│   ├── src/
│   │   ├── app/          # App Router 页面
│   │   ├── components/   # React 组件
│   │   ├── lib/          # 工具函数
│   │   ├── types/        # TypeScript 类型
│   │   └── styles/       # 样式文件
│   ├── public/           # 静态资源
│   └── package.json
│
├── backend/              # Node.js 后端
│   ├── src/
│   │   ├── agents/       # Agent 配置
│   │   ├── routes/       # API 路由
│   │   ├── services/     # 业务逻辑
│   │   ├── models/       # 数据模型
│   │   ├── utils/        # 工具函数
│   │   └── index.ts      # 入口文件
│   ├── prisma/           # 数据库 Schema
│   └── package.json
│
├── docs/                 # 文档
│   ├── api.md           # API 文档
│   └── deployment.md    # 部署文档
│
├── prd.md               # 产品需求文档
├── DEVELOPMENT_PLAN.md  # 开发计划
└── README.md            # 项目说明
```

---

## 🚀 Phase 1: Agent 定义 + Prompt 工程（Day 1-2）

### 目标
完成 3 个数字员工的 Prompt 设计和测试，确保输出质量稳定。

### 任务清单

#### Day 1: Agent 结构设计

- [ ] **定义 Agent 数据结构**
  - 创建 `backend/src/agents/types.ts`
  - 定义 Agent 接口（参考 PRD 第 6.1 节）
  - 定义 Input/Output Schema

- [ ] **创建 Agent 配置文件**
  - `backend/src/agents/business-analyst.json`
  - `backend/src/agents/copywriter.json`
  - `backend/src/agents/project-assistant.json`

- [ ] **设计 Prompt 模板**
  - System Prompt（角色定义）
  - Workflow 规则（执行步骤）
  - Output Template（输出格式）

#### Day 2: Prompt 测试与优化

- [ ] **测试 Agent 1: AI 商业分析师**
  - 准备 5 个测试用例
  - 调用 LLM API 测试输出
  - 优化 Prompt 直到输出稳定

- [ ] **测试 Agent 2: AI 市场文案助理**
  - 准备 5 个测试用例
  - 测试不同风格的文案输出
  - 确保输出 3 套可用文案

- [ ] **测试 Agent 3: AI 项目助理**
  - 准备 5 个测试用例
  - 测试任务拆解的合理性
  - 确保输出包含优先级

- [ ] **创建 Prompt 测试脚本**
  - `backend/src/scripts/test-prompts.ts`
  - 自动化测试所有 Agent

### 交付物

- ✅ 3 个 Agent 配置文件（JSON）
- ✅ Prompt 测试脚本
- ✅ 测试报告（输出质量评估）

### 验收标准

- 每个 Agent 的输出格式稳定
- 输出内容符合预期（有意义、可用）
- 响应时间 < 30 秒

---

## 🔧 Phase 2: 后端开发（Day 3-5）

### 目标
搭建完整的后端 API，实现核心业务逻辑和 LLM 集成。

### 任务清单

#### Day 3: 项目搭建 + 数据库

- [ ] **初始化后端项目**
  ```bash
  cd backend
  npm init -y
  npm install express typescript @types/node @types/express
  npm install prisma @prisma/client
  npm install dotenv cors
  npm install openai  # 或 @anthropic-ai/sdk
  ```

- [ ] **配置 TypeScript**
  - 创建 `tsconfig.json`
  - 配置编译选项

- [ ] **设计数据库 Schema**
  - 创建 `prisma/schema.prisma`
  - 定义 Agent、Task、Session 模型
  - 运行 `npx prisma migrate dev`

- [ ] **创建数据库种子数据**
  - `prisma/seed.ts`
  - 导入 3 个 Agent 配置

#### Day 4: 核心服务开发

- [ ] **Agent 配置服务**
  - `src/services/agent.service.ts`
  - `getAgents()` - 获取所有 Agent
  - `getAgentById(id)` - 获取单个 Agent

- [ ] **Prompt 组装服务**
  - `src/services/prompt.service.ts`
  - `assemblePrompt(agent, inputData)` - 组装最终 Prompt
  - 实现 PRD 第 6.2 节的组装逻辑

- [ ] **LLM 调用服务**
  - `src/services/llm.service.ts`
  - `callLLM(prompt, options)` - 调用 LLM API
  - 实现重试机制
  - 实现超时处理
  - 实现错误处理

- [ ] **任务管理服务**
  - `src/services/task.service.ts`
  - `createTask(agentId, inputData, sessionId)` - 创建任务
  - `executeTask(taskId)` - 执行任务
  - `getTask(taskId)` - 获取任务结果
  - `getUserTasks(sessionId)` - 获取用户任务历史

#### Day 5: API 路由 + 中间件

- [ ] **创建 API 路由**
  - `src/routes/agents.ts`
    - `GET /api/agents` - 获取所有数字员工
    - `GET /api/agents/:id` - 获取单个数字员工

  - `src/routes/tasks.ts`
    - `POST /api/tasks` - 创建并执行任务
    - `GET /api/tasks/:id` - 获取任务结果
    - `GET /api/tasks` - 获取用户任务历史

- [ ] **创建中间件**
  - `src/middleware/session.ts` - Session 管理
  - `src/middleware/rateLimit.ts` - API 限流
  - `src/middleware/errorHandler.ts` - 错误处理
  - `src/middleware/validation.ts` - 请求验证

- [ ] **集成所有模块**
  - `src/index.ts` - 主入口文件
  - 配置 Express 应用
  - 注册路由和中间件
  - 启动服务器

- [ ] **编写 API 测试**
  - 使用 Postman 或 curl 测试所有端点
  - 创建测试用例文档

### 交付物

- ✅ 完整的后端 API（5 个端点）
- ✅ 数据库 Schema 和迁移文件
- ✅ LLM 集成（可正常调用）
- ✅ API 测试文档

### 验收标准

- 所有 API 端点正常工作
- 可以成功创建任务并获取结果
- LLM 调用稳定（有重试和错误处理）
- 响应时间符合要求

---

## 🎨 Phase 3: 前端开发（Day 6-7）

### 目标
完成 3 个核心页面，实现完整的用户流程。

### 任务清单

#### Day 6: 项目搭建 + 首页

- [ ] **初始化前端项目**
  ```bash
  cd frontend
  npx create-next-app@latest . --typescript --tailwind --app
  npm install @radix-ui/react-* # shadcn/ui 依赖
  npm install react-hook-form zod @hookform/resolvers
  npm install axios
  ```

- [ ] **配置 shadcn/ui**
  ```bash
  npx shadcn-ui@latest init
  npx shadcn-ui@latest add button card input textarea select
  ```

- [ ] **创建基础布局**
  - `src/app/layout.tsx` - 全局布局
  - `src/components/Header.tsx` - 页头
  - `src/components/Footer.tsx` - 页脚

- [ ] **创建类型定义**
  - `src/types/agent.ts` - Agent 类型
  - `src/types/task.ts` - Task 类型
  - `src/lib/api.ts` - API 客户端

- [ ] **开发首页（数字员工列表）**
  - `src/app/page.tsx` - 首页
  - `src/components/AgentCard.tsx` - 员工卡片组件
  - 调用 `GET /api/agents` 获取数据
  - 实现响应式布局（网格）
  - 添加"雇佣 TA"按钮

#### Day 7: 任务提交页 + 结果页

- [ ] **开发任务提交页**
  - `src/app/agents/[id]/page.tsx` - 任务提交页
  - `src/components/TaskForm.tsx` - 动态表单组件
  - 根据 Agent 的 input_schema 生成表单
  - 使用 React Hook Form + Zod 验证
  - 添加示例填充功能
  - 实现提交和 Loading 状态

- [ ] **开发结果展示页**
  - `src/app/tasks/[id]/page.tsx` - 结果页
  - `src/components/TaskResult.tsx` - 结果展示组件
  - 结构化展示输出内容
  - 添加复制按钮
  - 添加"重新提交"按钮

- [ ] **开发任务历史页（可选）**
  - `src/app/tasks/page.tsx` - 历史列表
  - `src/components/TaskList.tsx` - 任务列表组件

- [ ] **错误处理和边界情况**
  - 创建 `src/app/error.tsx` - 错误页面
  - 创建 `src/app/loading.tsx` - 加载状态
  - 添加 Toast 通知组件

- [ ] **样式优化**
  - 统一配色方案
  - 添加动画效果
  - 移动端适配测试

### 交付物

- ✅ 3 个核心页面（首页、提交页、结果页）
- ✅ 可复用的 React 组件
- ✅ 完整的用户流程
- ✅ 响应式设计

### 验收标准

- 用户可以完整走完流程（浏览 → 提交 → 查看结果）
- 表单验证正常工作
- 移动端显示正常
- 加载和错误状态有友好提示

---

## 🧪 Phase 4: 测试与优化（Day 8）

### 目标
进行全面测试，修复 Bug，优化用户体验。

### 任务清单

#### 上午：功能测试

- [ ] **端到端测试**
  - 测试完整用户流程（3 个 Agent）
  - 测试各种输入情况
  - 测试错误处理

- [ ] **边界情况测试**
  - 空输入
  - 超长输入
  - 特殊字符
  - 网络错误
  - LLM 超时

- [ ] **性能测试**
  - 测试页面加载速度
  - 测试 API 响应时间
  - 测试并发请求

#### 下午：优化和修复

- [ ] **Bug 修复**
  - 修复测试中发现的问题
  - 优化错误提示文案

- [ ] **性能优化**
  - 优化图片加载
  - 添加 API 缓存
  - 优化 Prompt（减少 Token）

- [ ] **用户体验优化**
  - 优化加载动画
  - 优化表单交互
  - 添加使用提示

#### 晚上：准备发布

- [ ] **创建部署配置**
  - `vercel.json` - 前端部署配置
  - `Dockerfile` - 后端容器化（可选）
  - 环境变量文档

- [ ] **编写文档**
  - 更新 README.md
  - 创建 API 文档
  - 创建部署文档

- [ ] **邀请内测用户**
  - 准备 5-10 个测试账号
  - 发送邀请邮件
  - 准备反馈收集表单

### 交付物

- ✅ 测试报告
- ✅ Bug 修复列表
- ✅ 部署配置文件
- ✅ 完整文档

### 验收标准

- 所有核心功能正常工作
- 没有严重 Bug
- 性能指标达标
- 文档完整

---

## 📦 技术实现细节

### 后端技术栈

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "typescript": "^5.3.3",
    "@prisma/client": "^5.7.1",
    "prisma": "^5.7.1",
    "openai": "^4.20.1",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.1.5",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.5",
    "@types/cors": "^2.8.17",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.2"
  }
}
```

### 前端技术栈

```json
{
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.3",
    "tailwindcss": "^3.4.0",
    "react-hook-form": "^7.49.2",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.3",
    "axios": "^1.6.2",
    "@radix-ui/react-*": "latest"
  }
}
```

### 环境变量

#### 后端 `.env`
```env
# 数据库
DATABASE_URL="postgresql://user:password@localhost:5432/aiboss"

# LLM API
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4o-mini"

# 服务器
PORT=3001
NODE_ENV="development"

# Session
SESSION_SECRET="your-secret-key"
```

#### 前端 `.env.local`
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

---

## 🚀 部署计划

### 前端部署（Vercel）

1. 连接 GitHub 仓库
2. 配置环境变量
3. 自动部署

### 后端部署（Railway）

1. 创建新项目
2. 连接 GitHub 仓库
3. 配置环境变量
4. 添加 PostgreSQL 数据库
5. 部署

### 数据库（Railway PostgreSQL）

1. 在 Railway 创建 PostgreSQL 实例
2. 运行 Prisma 迁移
3. 运行种子数据

---

## 📊 开发进度追踪

### Week 1 Checklist

#### Day 1
- [ ] Agent 数据结构设计
- [ ] 创建 3 个 Agent 配置文件
- [ ] 设计 Prompt 模板

#### Day 2
- [ ] 测试所有 Agent 的 Prompt
- [ ] 优化输出质量
- [ ] 创建测试脚本

#### Day 3
- [ ] 初始化后端项目
- [ ] 配置数据库
- [ ] 创建数据模型

#### Day 4
- [ ] 开发核心服务（Agent、Prompt、LLM、Task）
- [ ] 实现业务逻辑

#### Day 5
- [ ] 创建 API 路由
- [ ] 实现中间件
- [ ] API 测试

#### Day 6
- [ ] 初始化前端项目
- [ ] 开发首页
- [ ] 创建基础组件

#### Day 7
- [ ] 开发任务提交页
- [ ] 开发结果展示页
- [ ] 样式优化

#### Day 8
- [ ] 全面测试
- [ ] Bug 修复
- [ ] 准备发布

---

## 🎯 成功标准

### 技术指标
- ✅ 所有 API 端点正常工作
- ✅ 前端页面无报错
- ✅ 数据库连接稳定
- ✅ LLM 调用成功率 > 95%

### 功能指标
- ✅ 用户可以完整走完流程
- ✅ 3 个 Agent 都能正常工作
- ✅ 输出质量符合预期
- ✅ 错误处理完善

### 性能指标
- ✅ 首页加载 < 2 秒
- ✅ API 响应 < 500ms
- ✅ AI 执行 < 30 秒

---

## 📝 注意事项

### 开发原则
1. **MVP 优先**：只做必需功能，不过度设计
2. **快速迭代**：先跑通流程，再优化细节
3. **用户导向**：始终从用户角度思考
4. **代码质量**：保持代码简洁、可维护

### 风险控制
1. **LLM 成本**：设置 Token 限制，监控调用次数
2. **API 稳定性**：实现重试和降级机制
3. **数据安全**：不存储敏感信息，加密传输
4. **性能瓶颈**：及时监控，发现问题快速优化

### 后续优化方向
1. 添加更多 Agent
2. 优化 Prompt 质量
3. 增加用户账号系统
4. 实现支付功能
5. 添加数据分析

---

## 🔗 相关文档

- [PRD 文档](./prd.md)
- [README](./README.md)
- [API 文档](./docs/api.md)
- [部署文档](./docs/deployment.md)

---

> **开发口号：**
> "8 天 MVP，快速验证，持续迭代！"
