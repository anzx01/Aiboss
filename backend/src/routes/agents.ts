import { Router, Request, Response } from 'express';
import { agentService } from '../services/agent.service';

const router = Router();

/**
 * GET /api/agents
 * 获取所有数字员工列表
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const agents = agentService.getAllAgents();

    // 返回简化的 Agent 信息（不包含 system_prompt 等内部信息）
    const publicAgents = agents.map(agent => ({
      id: agent.id,
      name: agent.name,
      avatar: agent.avatar,
      description: agent.description,
      suitable_scenarios: agent.suitable_scenarios,
      unsuitable_scenarios: agent.unsuitable_scenarios,
      input_schema: agent.input_schema,
      price_label: agent.price_label,
      estimated_time: agent.estimated_time
    }));

    res.json(publicAgents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

/**
 * GET /api/agents/:id
 * 获取单个数字员工详情
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const agent = agentService.getAgentById(id);

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // 返回简化的 Agent 信息
    const publicAgent = {
      id: agent.id,
      name: agent.name,
      avatar: agent.avatar,
      description: agent.description,
      suitable_scenarios: agent.suitable_scenarios,
      unsuitable_scenarios: agent.unsuitable_scenarios,
      input_schema: agent.input_schema,
      price_label: agent.price_label,
      estimated_time: agent.estimated_time
    };

    res.json(publicAgent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
});

export default router;
