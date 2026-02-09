'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Agent } from '@/types';
import { api } from '@/lib/api';
import DynamicForm from '@/components/DynamicForm';
import Button from '@/components/Button';

export default function AgentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAgent();
  }, [params.id]);

  const loadAgent = async () => {
    try {
      setLoading(true);
      const data = await api.getAgent(params.id);
      setAgent(data);
    } catch (err) {
      console.error('Failed to load agent:', err);
      setError('加载失败，请返回重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (inputData: Record<string, any>) => {
    if (!agent) return;

    try {
      setSubmitting(true);
      const result = await api.createTask({
        agent_id: agent.id,
        input_data: inputData,
      });

      // 跳转到结果页
      router.push(`/tasks/${result.task_id}`);
    } catch (err) {
      console.error('Failed to create task:', err);
      alert('任务提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-secondary">加载中...</p>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error || '未找到该数字员工'}</p>
        <Button onClick={() => router.push('/')}>返回首页</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-bg py-12 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto">
        {/* Agent Info */}
        <div className="bg-white border border-gray-border p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 border border-gray-border bg-gray-bg flex items-center justify-center flex-shrink-0">
              <span className="text-4xl">{agent.avatar}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-semibold font-display text-gray-dark mb-2">
                {agent.name}
              </h1>
              <p className="text-sm text-gray-secondary mb-4">{agent.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold font-display text-gray-dark">
                  {agent.price_label}
                </span>
                <span className="px-2 py-1 bg-success text-white text-xs font-medium">
                  MVP 免费
                </span>
                <span className="text-xs text-gray-secondary ml-2">
                  预计 {agent.estimated_time}
                </span>
              </div>
            </div>
          </div>

          {/* Scenarios */}
          <div className="mt-6 pt-6 border-t border-gray-border grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold font-display text-gray-dark mb-2">
                ✅ 适用场景
              </h3>
              <ul className="text-xs text-gray-secondary space-y-1">
                {agent.suitable_scenarios.map((scenario, index) => (
                  <li key={index}>• {scenario}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold font-display text-gray-dark mb-2">
                ❌ 不适用场景
              </h3>
              <ul className="text-xs text-gray-secondary space-y-1">
                {agent.unsuitable_scenarios.map((scenario, index) => (
                  <li key={index}>• {scenario}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-border p-8">
          <h2 className="text-xl font-semibold font-display text-gray-dark mb-6">
            提交任务
          </h2>
          <DynamicForm agent={agent} onSubmit={handleSubmit} loading={submitting} />
        </div>
      </div>
    </div>
  );
}
