import OpenAI from 'openai';

/**
 * LLM 调用服务
 * 负责调用 OpenAI API 并处理响应
 */
class LLMService {
  private client: OpenAI;
  private model: string;
  private maxTokens: number;
  private timeout: number = 30000; // 30 秒超时

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    this.client = new OpenAI({
      apiKey,
      timeout: this.timeout
    });

    this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    this.maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS || '4000');
  }

  /**
   * 调用 LLM API
   * @param prompt 组装好的 Prompt
   * @param options 可选配置
   * @returns LLM 响应内容
   */
  async callLLM(
    prompt: string,
    options?: {
      temperature?: number;
      maxRetries?: number;
    }
  ): Promise<string> {
    const temperature = options?.temperature ?? 0.7;
    const maxRetries = options?.maxRetries ?? 1;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🤖 Calling LLM (attempt ${attempt + 1}/${maxRetries + 1})...`);

        const response = await this.client.chat.completions.create({
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature,
          max_tokens: this.maxTokens
        });

        const content = response.choices[0]?.message?.content;

        if (!content) {
          throw new Error('LLM returned empty response');
        }

        console.log(`✅ LLM call successful`);
        return content;
      } catch (error) {
        lastError = error as Error;
        console.error(`❌ LLM call failed (attempt ${attempt + 1}):`, error);

        // 如果不是最后一次尝试，等待后重试
        if (attempt < maxRetries) {
          await this.sleep(1000 * (attempt + 1)); // 递增等待时间
        }
      }
    }

    // 所有重试都失败
    throw new Error(`LLM call failed after ${maxRetries + 1} attempts: ${lastError?.message}`);
  }

  /**
   * 解析 JSON 响应
   * @param content LLM 返回的内容
   * @returns 解析后的 JSON 对象
   */
  parseJSONResponse(content: string): any {
    try {
      // 尝试提取 JSON 代码块
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }

      // 尝试直接解析
      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse JSON response:', content);
      throw new Error('LLM 返回的内容不是有效的 JSON 格式');
    }
  }

  /**
   * 睡眠函数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 获取当前配置
   */
  getConfig() {
    return {
      model: this.model,
      maxTokens: this.maxTokens,
      timeout: this.timeout
    };
  }
}

// 导出单例
export const llmService = new LLMService();
