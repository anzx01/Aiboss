import { Agent } from '../agents/types';

/**
 * Prompt 组装服务
 * 负责将 Agent 配置和用户输入组装成最终的 Prompt
 */
class PromptService {
  /**
   * 组装最终的 Prompt
   * @param agent Agent 配置
   * @param inputData 用户输入数据
   * @returns 组装好的 Prompt
   */
  assemblePrompt(agent: Agent, inputData: Record<string, any>): string {
    const parts: string[] = [];

    // 1. System Prompt（角色定义）
    parts.push('# 角色定义');
    parts.push(agent.system_prompt);
    parts.push('');

    // 2. Workflow 规则（执行步骤）
    if (agent.workflow_steps && agent.workflow_steps.length > 0) {
      parts.push('# 工作流程');
      agent.workflow_steps.forEach((step, index) => {
        parts.push(`${index + 1}. ${step}`);
      });
      parts.push('');
    }

    // 3. 用户输入（表单数据）
    parts.push('# 用户输入');
    for (const [key, value] of Object.entries(inputData)) {
      if (value) {
        const field = agent.input_schema.properties[key];
        const label = field?.label || key;
        parts.push(`**${label}**: ${value}`);
      }
    }
    parts.push('');

    // 4. 输出格式约束
    parts.push('# 输出要求');
    parts.push(agent.output_template);

    return parts.join('\n');
  }

  /**
   * 验证用户输入是否符合 Schema
   * @param agent Agent 配置
   * @param inputData 用户输入数据
   * @returns 验证结果
   */
  validateInput(
    agent: Agent,
    inputData: Record<string, any>
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 检查必填字段
    for (const requiredField of agent.input_schema.required) {
      if (!inputData[requiredField] || inputData[requiredField].trim() === '') {
        const field = agent.input_schema.properties[requiredField];
        errors.push(`${field.label} 是必填项`);
      }
    }

    // 检查字段类型
    for (const [key, value] of Object.entries(inputData)) {
      if (!value) continue;

      const field = agent.input_schema.properties[key];
      if (!field) {
        errors.push(`未知字段: ${key}`);
        continue;
      }

      // 类型检查
      if (field.type === 'number' && typeof value !== 'number') {
        errors.push(`${field.label} 必须是数字`);
      }

      // Select 选项检查
      if (field.type === 'select' && field.options) {
        if (!field.options.includes(value)) {
          errors.push(`${field.label} 的值必须是: ${field.options.join(', ')}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// 导出单例
export const promptService = new PromptService();
