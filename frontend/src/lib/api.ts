import axios from 'axios';
import { Agent, Task, TaskCreateRequest, TaskCreateResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// API 方法
export const api = {
  // 获取所有 Agent
  async getAgents(): Promise<Agent[]> {
    const response = await apiClient.get('/api/agents');
    return response.data;
  },

  // 获取单个 Agent
  async getAgent(id: string): Promise<Agent> {
    const response = await apiClient.get(`/api/agents/${id}`);
    return response.data;
  },

  // 创建并执行任务
  async createTask(data: TaskCreateRequest): Promise<TaskCreateResponse> {
    const response = await apiClient.post('/api/tasks', data);
    return response.data;
  },

  // 获取任务详情
  async getTask(id: string): Promise<Task> {
    const response = await apiClient.get(`/api/tasks/${id}`);
    return response.data;
  },

  // 获取任务历史
  async getTasks(limit: number = 20): Promise<Task[]> {
    const response = await apiClient.get('/api/tasks', {
      params: { limit },
    });
    return response.data;
  },
};

export default apiClient;
