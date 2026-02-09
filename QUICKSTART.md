# 🚀 AI Boss - 快速开始指南

## 📋 前置要求

- Node.js 18+
- PostgreSQL 14+
- OpenAI API Key

## 🔧 安装步骤

### 1. 克隆项目

```bash
git clone https://github.com/anzx01/Aiboss.git
cd aiboss
```

### 2. 配置后端

```bash
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入你的配置：
# - DATABASE_URL: PostgreSQL 连接字符串
# - OPENAI_API_KEY: OpenAI API 密钥
# - 其他配置保持默认即可

# 初始化数据库
npx prisma generate
npx prisma migrate dev

# 启动后端服务
npm run dev
```

后端将运行在 `http://localhost:3001`

### 3. 配置前端

```bash
cd ../frontend

# 安装依赖
npm install

# 配置环境变量
cp .env.local.example .env.local
# 默认配置已经指向 http://localhost:3001，无需修改

# 启动前端服务
npm run dev
```

前端将运行在 `http://localhost:3000`

## ✅ 验证安装

1. 打开浏览器访问 `http://localhost:3000`
2. 你应该能看到 AI Boss 首页
3. 点击任意数字员工卡片
4. 填写表单并提交
5. 查看 AI 生成的结果

## 🎯 测试示例

### 测试商业分析师

1. 访问首页，点击"AI 商业分析师"
2. 填写表单：
   - **想法描述**: "一个帮助独立开发者管理多个项目的 SaaS 工具"
   - **所属行业**: "SaaS"
   - **目标用户**: "独立开发者"
3. 点击"提交任务"
4. 等待 20-30 秒
5. 查看结构化的商业分析报告

### 测试文案助理

1. 访问首页，点击"AI 市场文案助理"
2. 填写表单：
   - **产品介绍**: "一款帮助团队协作的项目管理工具"
   - **使用场景**: "官网首页"
   - **文案风格**: "理性专业"
3. 点击"提交任务"
4. 查看 3 套不同的文案方案

### 测试项目助理

1. 访问首页，点击"AI 项目助理"
2. 填写表单：
   - **目标描述**: "在 2 周内完成一个个人博客网站的开发和上线"
   - **时间限制**: "2 周"
3. 点击"提交任务"
4. 查看详细的任务清单和时间规划

## 🐛 常见问题

### 后端启动失败

**问题**: `OPENAI_API_KEY is not set`
**解决**: 确保 `backend/.env` 文件中配置了有效的 OpenAI API Key

**问题**: 数据库连接失败
**解决**:
1. 确保 PostgreSQL 正在运行
2. 检查 `DATABASE_URL` 配置是否正确
3. 尝试手动连接数据库测试

### 前端无法连接后端

**问题**: API 请求失败
**解决**:
1. 确保后端服务正在运行（`http://localhost:3001`）
2. 检查 `frontend/.env.local` 中的 `NEXT_PUBLIC_API_URL` 配置
3. 检查浏览器控制台的错误信息

### LLM 调用超时

**问题**: 任务执行超过 30 秒
**解决**:
1. 检查网络连接
2. 尝试使用更快的模型（如 gpt-3.5-turbo）
3. 简化输入内容

## 📚 下一步

- 阅读 [PRD 文档](./prd.md) 了解产品设计
- 阅读 [开发计划](./DEVELOPMENT_PLAN.md) 了解技术架构
- 查看 [API 文档](./docs/api.md) 了解接口详情
- 自定义 Agent 配置文件添加新的数字员工

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
