/**
 * Agent 类型定义
 * 每个数字员工的完整结构
 */

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  description: string;
  suitable_scenarios: string[];
  unsuitable_scenarios: string[];
  system_prompt: string;
  workflow_steps: string[];
  input_schema: InputSchema;
  output_schema: OutputSchema;
  output_template: string;
  price_label: string;
  estimated_time: string;
  created_at: Date;
}

export interface InputSchema {
  type: 'object';
  properties: Record<string, InputField>;
  required: string[];
}

export interface InputField {
  type: 'string' | 'number' | 'boolean' | 'select';
  label: string;
  description?: string;
  placeholder?: string;
  options?: string[];
  default?: any;
}

export interface OutputSchema {
  type: 'object';
  properties: Record<string, OutputField>;
}

export interface OutputField {
  type: 'string' | 'array' | 'object';
  description: string;
}

export interface Task {
  id: string;
  agent_id: string;
  session_id: string;
  input_data: Record<string, any>;
  output_data: Record<string, any> | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  created_at: Date;
  completed_at?: Date;
  execution_time?: number;
}

export interface Session {
  id: string;
  fingerprint: string;
  created_at: Date;
  last_active_at: Date;
}
