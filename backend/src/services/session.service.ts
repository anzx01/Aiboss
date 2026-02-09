import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

/**
 * Session 管理服务
 * 负责用户会话的创建和管理
 */
class SessionService {
  /**
   * 生成浏览器指纹
   * @param userAgent User Agent
   * @param ip IP 地址
   * @returns 指纹字符串
   */
  generateFingerprint(userAgent: string, ip: string): string {
    const data = `${userAgent}|${ip}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * 获取或创建 Session
   * @param fingerprint 浏览器指纹
   * @returns Session
   */
  async getOrCreateSession(fingerprint: string): Promise<any> {
    // 尝试查找现有 Session
    let session = await prisma.session.findUnique({
      where: { fingerprint }
    });

    // 如果不存在，创建新 Session
    if (!session) {
      session = await prisma.session.create({
        data: { fingerprint }
      });
      console.log(`✅ Created new session: ${session.id}`);
    } else {
      // 更新最后活跃时间
      session = await prisma.session.update({
        where: { id: session.id },
        data: { last_active_at: new Date() }
      });
    }

    return session;
  }

  /**
   * 获取 Session 详情
   * @param sessionId Session ID
   * @returns Session
   */
  async getSession(sessionId: string): Promise<any> {
    const session = await prisma.session.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    return session;
  }

  /**
   * 删除过期的 Session（可选功能）
   * @param daysOld 多少天前的 Session
   */
  async cleanupOldSessions(daysOld: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await prisma.session.deleteMany({
      where: {
        last_active_at: {
          lt: cutoffDate
        }
      }
    });

    console.log(`🧹 Cleaned up ${result.count} old sessions`);
    return result.count;
  }
}

// 导出单例
export const sessionService = new SessionService();
