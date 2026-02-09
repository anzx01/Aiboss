import fs from 'fs';
import path from 'path';
import { Agent } from '../agents/types';

/**
 * Agent 配置服务
 * 负责加载和管理数字员工配置
 */
class AgentService {
  private agents: Map<string, Agent> = new Map();
  private agentsDir: string;

  constructor() {
    this.agentsDir = path.join(__dirname, '../agents');
    this.loadAgents();
  }

  /**
   * 加载所有 Agent 配置文件
   */
  private loadAgents(): void {
    const agentFiles = [
      'business-analyst.json',
      'copywriter.json',
      'project-assistant.json'
    ];

    for (const file of agentFiles) {
      try {
        const filePath = path.join(this.agentsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const agent: Agent = JSON.parse(content);

        // 添加 created_at 字段
        agent.created_at = new Date();

        this.agents.set(agent.id, agent);
        console.log(`✅ Loaded agent: ${agent.name}`);
      } catch (error) {
        console.error(`❌ Failed to load agent from ${file}:`, error);
      }
    }
  }

  /**
   * 获取所有 Agent
   */
  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  /**
   * 根据 ID 获取单个 Agent
   */
  getAgentById(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  /**
   * 检查 Agent 是否存在
   */
  agentExists(id: string): boolean {
    return this.agents.has(id);
  }

  /**
   * 重新加载所有 Agent（用于开发环境热更新）
   */
  reloadAgents(): void {
    this.agents.clear();
    this.loadAgents();
  }
}

// 导出单例
export const agentService = new AgentService();
