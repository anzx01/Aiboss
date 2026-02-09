import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { sessionMiddleware } from './middleware/session';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import agentsRouter from './routes/agents';
import tasksRouter from './routes/tasks';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '3600000'), // 1 hour
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '20'),
  message: '请求过于频繁，请稍后再试'
});

app.use('/api/', limiter);

// Session 中间件
app.use(sessionMiddleware);

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API 路由
app.use('/api/agents', agentsRouter);
app.use('/api/tasks', tasksRouter);

// 404 处理
app.use(notFoundHandler);

// 错误处理
app.use(errorHandler);

// 启动服务器
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 AI Boss Backend Server');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🤖 LLM Model: ${process.env.OPENAI_MODEL || 'gpt-4o-mini'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('📋 Available endpoints:');
  console.log('  GET  /health');
  console.log('  GET  /api/agents');
  console.log('  GET  /api/agents/:id');
  console.log('  POST /api/tasks');
  console.log('  GET  /api/tasks/:id');
  console.log('  GET  /api/tasks');
  console.log('');
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  process.exit(0);
});


