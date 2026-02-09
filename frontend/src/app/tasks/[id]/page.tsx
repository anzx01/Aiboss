'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Task } from '@/types';
import { api } from '@/lib/api';
import Button from '@/components/Button';

export default function TaskPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadTask();
  }, [params.id]);

  const loadTask = async () => {
    try {
      setLoading(true);
      const data = await api.getTask(params.id);
      setTask(data);
    } catch (err) {
      console.error('Failed to load task:', err);
      setError('加载失败，请返回重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!task?.output_data) return;

    const text = JSON.stringify(task.output_data, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderOutput = (data: any) => {
    if (!data) return null;

    // 如果是商业分析师的输出
    if (data.summary && data.problems) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold font-display text-gray-dark mb-2">
              📝 总结
            </h3>
            <p className="text-sm text-gray-secondary">{data.summary}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold font-display text-gray-dark mb-2">
              ⚠️ 核心问题
            </h3>
            <ul className="space-y-2">
              {data.problems.map((item: string, index: number) => (
                <li key={index} className="text-sm text-gray-secondary">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold font-display text-gray-dark mb-2">
              💡 市场机会
            </h3>
            <ul className="space-y-2">
              {data.opportunities.map((item: string, index: number) => (
                <li key={index} className="text-sm text-gray-secondary">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold font-display text-gray-dark mb-2">
              🚨 潜在风险
            </h3>
            <ul className="space-y-2">
              {data.risks.map((item: string, index: number) => (
                <li key={index} className="text-sm text-gray-secondary">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold font-display text-gray-dark mb-2">
              ✅ 行动建议
            </h3>
            <ul className="space-y-2">
              {data.recommendations.map((item: string, index: number) => (
                <li key={index} className="text-sm text-gray-secondary">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    // 如果是文案助理的输出
    if (data.copies && Array.isArray(data.copies)) {
      return (
        <div className="space-y-6">
          {data.copies.map((copy: any, index: number) => (
            <div key={index} className="border border-gray-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-dark text-white text-xs font-medium">
                  方案 {index + 1}
                </span>
              </div>
              <h3 className="text-xl font-semibold font-display text-gray-dark mb-2">
                {copy.title}
              </h3>
              <p className="text-base text-gray-secondary mb-4">{copy.subtitle}</p>
              <p className="text-sm text-gray-secondary mb-4">{copy.body}</p>
              <div className="pt-4 border-t border-gray-border">
                <span className="text-sm font-medium text-primary">{copy.cta}</span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // 如果是项目助理的输出
    if (data.tasks && Array.isArray(data.tasks)) {
      return (
        <div className="space-y-6">
          {data.summary && (
            <div>
              <h3 className="text-lg font-semibold font-display text-gray-dark mb-2">
                📋 项目概述
              </h3>
              <p className="text-sm text-gray-secondary">{data.summary}</p>
            </div>
          )}

          {data.milestones && (
            <div>
              <h3 className="text-lg font-semibold font-display text-gray-dark mb-2">
                🎯 关键里程碑
              </h3>
              <ul className="space-y-2">
                {data.milestones.map((item: string, index: number) => (
                  <li key={index} className="text-sm text-gray-secondary">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold font-display text-gray-dark mb-4">
              ✅ 任务清单
            </h3>
            <div className="space-y-3">
              {data.tasks.map((task: any) => (
                <div key={task.id} className="border border-gray-border p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-semibold font-display text-gray-dark">
                      {task.id}. {task.title}
                    </h4>
                    <span
                      className={`px-2 py-1 text-xs font-medium ${
                        task.priority === '高'
                          ? 'bg-red-100 text-red-700'
                          : task.priority === '中'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-secondary mb-2">{task.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-secondary">
                    <span>⏱️ {task.estimated_time}</span>
                    {task.dependencies && task.dependencies.length > 0 && (
                      <span>🔗 依赖: {task.dependencies.join(', ')}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 默认 JSON 显示
    return (
      <pre className="bg-gray-bg p-4 text-xs text-gray-dark overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-secondary">加载中...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error || '未找到该任务'}</p>
        <Button onClick={() => router.push('/')}>返回首页</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-bg py-12 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white border border-gray-border p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-semibold font-display text-gray-dark">
              任务结果
            </h1>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 text-sm font-medium ${
                  task.status.toLowerCase() === 'completed'
                    ? 'bg-success text-white'
                    : task.status.toLowerCase() === 'failed'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-dark'
                }`}
              >
                {task.status.toLowerCase() === 'completed'
                  ? '已完成'
                  : task.status.toLowerCase() === 'failed'
                  ? '失败'
                  : '处理中'}
              </span>
            </div>
          </div>

          {task.execution_time && (
            <p className="text-sm text-gray-secondary">
              执行时间: {(task.execution_time / 1000).toFixed(2)} 秒
            </p>
          )}

          {task.error_message && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200">
              <p className="text-sm text-red-700">{task.error_message}</p>
            </div>
          )}
        </div>

        {/* Output */}
        {task.status.toLowerCase() === 'completed' && task.output_data && (
          <div className="bg-white border border-gray-border p-8 mb-8">
            {renderOutput(task.output_data)}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={handleCopy} variant="outline">
            {copied ? '已复制' : '复制结果'}
          </Button>
          <Button onClick={() => router.push(`/agents/${task.agent_id}`)}>
            重新提交
          </Button>
          <Button onClick={() => router.push('/')} variant="outline">
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
}
