import { Request, Response, NextFunction } from 'express';
import { sessionService } from '../services/session.service';

/**
 * Session 中间件
 * 自动获取或创建用户 Session
 */
export async function sessionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userAgent = req.headers['user-agent'] || 'unknown';
    const ip = req.ip || req.socket.remoteAddress || 'unknown';

    // 生成指纹
    const fingerprint = sessionService.generateFingerprint(userAgent, ip);

    // 获取或创建 Session
    const session = await sessionService.getOrCreateSession(fingerprint);

    // 将 Session 附加到 Request 对象
    (req as any).session = session;

    next();
  } catch (error) {
    console.error('Session middleware error:', error);
    res.status(500).json({
      error: 'Failed to initialize session'
    });
  }
}
