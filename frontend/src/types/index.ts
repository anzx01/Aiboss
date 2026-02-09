export interface Agent {
  id: string;
  name: string;
  avatar: string;
  description: string;
  suitable_scenarios: string[];
  unsuitable_scenarios: string[];
  input_schema: InputSchema;
  price_label: string;
  estimated_time: string;
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

export interface Task {
  id: string;
  agent_id: string;
  input_data: Record<string, any>;
  output_data: Record<string, any> | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  execution_time?: number;
  created_at: string;
  completed_at?: string;
}

export interface TaskCreateRequest {
  agent_id: string;
  input_data: Record<string, any>;
}

export interface TaskCreateResponse {
  task_id: string;
  status: string;
  output_data: any;
  execution_time: number;
  created_at: string;
  completed_at: string;
}
