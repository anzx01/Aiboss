import { Request, Response, NextFunction } from 'express';

/**
 * 错误处理中间件
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', error);

  // 默认错误响应
  const statusCode = (error as any).statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
}

/**
 * 404 处理中间件
 */
export function notFoundHandler(
  req: Request,
  res: Response
): void {
  res.status(404).json({
    error: 'Not Found',
    path: req.path
  });
}
