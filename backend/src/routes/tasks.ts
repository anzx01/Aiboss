import { Router, Request, Response } from 'express';
import { taskService } from '../services/task.service';

const router = Router();

/**
 * POST /api/tasks
 * 创建并执行新任务
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { agent_id, input_data } = req.body;
    const session = (req as any).session;

    // 验证请求参数
    if (!agent_id) {
      return res.status(400).json({ error: 'agent_id is required' });
    }

    if (!input_data || typeof input_data !== 'object') {
      return res.status(400).json({ error: 'input_data is required and must be an object' });
    }

    // 创建并执行任务
    const task = await taskService.createAndExecuteTask(
      agent_id,
      input_data,
      session.id
    );

    res.json({
      task_id: task.id,
      status: task.status,
      output_data: task.output_data,
      execution_time: task.execution_time,
      created_at: task.created_at,
      completed_at: task.completed_at
    });
  } catch (error) {
    console.error('Error creating task:', error);
    const message = error instanceof Error ? error.message : 'Failed to create task';
    res.status(500).json({ error: message });
  }
});

/**
 * GET /api/tasks/:id
 * 获取任务详情
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await taskService.getTask(id);

    res.json({
      id: task.id,
      agent_id: task.agent_id,
      input_data: task.input_data,
      output_data: task.output_data,
      status: task.status,
      error_message: task.error_message,
      execution_time: task.execution_time,
      created_at: task.created_at,
      completed_at: task.completed_at
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch task';
    res.status(404).json({ error: message });
  }
});

/**
 * GET /api/tasks
 * 获取用户任务历史
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const limit = parseInt(req.query.limit as string) || 20;

    const tasks = await taskService.getUserTasks(session.id, limit);

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

/**
 * GET /api/tasks/stats
 * 获取任务统计信息
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const stats = await taskService.getTaskStats(session.id);

    res.json(stats);
  } catch (error) {
    console.error('Error fetching task stats:', error);
    res.status(500).json({ error: 'Failed to fetch task stats' });
  }
});

export default router;
