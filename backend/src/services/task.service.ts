import { PrismaClient, TaskStatus } from '@prisma/client';
import { agentService } from './agent.service';
import { promptService } from './prompt.service';
import { llmService } from './llm.service';

const prisma = new PrismaClient();

/**
 * 任务管理服务
 * 负责创建、执行和查询任务
 */
class TaskService {
  /**
   * 创建并执行任务
   * @param agentId Agent ID
   * @param inputData 用户输入数据
   * @param sessionId Session ID
   * @returns 任务结果
   */
  async createAndExecuteTask(
    agentId: string,
    inputData: Record<string, any>,
    sessionId: string
  ): Promise<any> {
    const startTime = Date.now();

    // 1. 验证 Agent 是否存在
    const agent = agentService.getAgentById(agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }

    // 2. 验证用户输入
    const validation = promptService.validateInput(agent, inputData);
    if (!validation.valid) {
      throw new Error(`输入验证失败: ${validation.errors.join(', ')}`);
    }

    // 3. 创建任务记录
    const task = await prisma.task.create({
      data: {
        agent_id: agentId,
        session_id: sessionId,
        input_data: inputData,
        status: TaskStatus.PROCESSING
      }
    });

    try {
      // 4. 组装 Prompt
      const prompt = promptService.assemblePrompt(agent, inputData);

      // 5. 调用 LLM
      const llmResponse = await llmService.callLLM(prompt);

      // 6. 解析响应
      const outputData = llmService.parseJSONResponse(llmResponse);

      // 7. 更新任务状态
      const executionTime = Date.now() - startTime;
      const completedTask = await prisma.task.update({
        where: { id: task.id },
        data: {
          status: TaskStatus.COMPLETED,
          output_data: outputData,
          completed_at: new Date(),
          execution_time: executionTime
        }
      });

      console.log(`✅ Task ${task.id} completed in ${executionTime}ms`);

      return completedTask;
    } catch (error) {
      // 8. 处理错误
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      await prisma.task.update({
        where: { id: task.id },
        data: {
          status: TaskStatus.FAILED,
          error_message: errorMessage
        }
      });

      console.error(`❌ Task ${task.id} failed:`, errorMessage);

      throw error;
    }
  }

  /**
   * 获取任务详情
   * @param taskId 任务 ID
   * @returns 任务详情
   */
  async getTask(taskId: string): Promise<any> {
    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    return task;
  }

  /**
   * 获取用户的任务历史
   * @param sessionId Session ID
   * @param limit 返回数量限制
   * @returns 任务列表
   */
  async getUserTasks(sessionId: string, limit: number = 20): Promise<any[]> {
    const tasks = await prisma.task.findMany({
      where: { session_id: sessionId },
      orderBy: { created_at: 'desc' },
      take: limit
    });

    return tasks;
  }

  /**
   * 获取任务统计信息
   * @param sessionId Session ID
   * @returns 统计信息
   */
  async getTaskStats(sessionId: string): Promise<any> {
    const [total, completed, failed, avgExecutionTime] = await Promise.all([
      prisma.task.count({ where: { session_id: sessionId } }),
      prisma.task.count({
        where: { session_id: sessionId, status: TaskStatus.COMPLETED }
      }),
      prisma.task.count({
        where: { session_id: sessionId, status: TaskStatus.FAILED }
      }),
      prisma.task.aggregate({
        where: {
          session_id: sessionId,
          status: TaskStatus.COMPLETED,
          execution_time: { not: null }
        },
        _avg: { execution_time: true }
      })
    ]);

    return {
      total,
      completed,
      failed,
      pending: total - completed - failed,
      avgExecutionTime: avgExecutionTime._avg.execution_time || 0
    };
  }
}

// 导出单例
export const taskService = new TaskService();
