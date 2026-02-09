'use client';

import { useEffect, useState } from 'react';
import { Agent } from '@/types';
import { api } from '@/lib/api';
import AgentCard from '@/components/AgentCard';
import Button from '@/components/Button';

export default function HomePage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const data = await api.getAgents();
      setAgents(data);
    } catch (err) {
      console.error('Failed to load agents:', err);
      setError('加载失败，请刷新页面重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-semibold font-display text-gray-dark tracking-tight">
            像雇人一样雇 AI 干活
          </h1>
          <p className="text-lg text-gray-secondary max-w-2xl">
            选择数字 AI 员工，提交任务，获得标准化交付物。不是聊天工具，而是真正的 AI 外包公司。
          </p>
          <div className="flex gap-4">
            <Button size="lg">开始使用</Button>
            <Button variant="outline" size="lg">
              了解更多
            </Button>
          </div>
        </div>
      </section>

      {/* Agents Section */}
      <section id="agents" className="py-16 lg:py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-3 mb-12 text-center">
            <h2 className="text-4xl font-semibold font-display text-gray-dark tracking-tight">
              选择您的数字 AI 员工
            </h2>
            <p className="text-base text-gray-secondary">
              每个 AI 员工都有明确的专业领域，提供标准化的交付物
            </p>
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-secondary">加载中...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <Button onClick={loadAgents} className="mt-4">
                重试
              </Button>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-24 px-6 lg:px-12 bg-gray-bg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-3 mb-12 text-center">
            <h2 className="text-4xl font-semibold font-display text-gray-dark tracking-tight">
              为什么选择 AI Boss
            </h2>
            <p className="text-base text-gray-secondary">
              不是聊天工具，而是真正的 AI 外包公司
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-border p-8 flex flex-col gap-4">
              <h3 className="text-lg font-semibold font-display text-gray-dark">
                🎯 任务导向
              </h3>
              <p className="text-sm text-gray-secondary leading-relaxed">
                不需要反复调试 Prompt，直接提交任务，获得标准化交付物。
              </p>
            </div>

            <div className="bg-white border border-gray-border p-8 flex flex-col gap-4">
              <h3 className="text-lg font-semibold font-display text-gray-dark">
                💰 透明定价
              </h3>
              <p className="text-sm text-gray-secondary leading-relaxed">
                明确的价格标签，按任务付费，没有隐藏费用。
              </p>
            </div>

            <div className="bg-white border border-gray-border p-8 flex flex-col gap-4">
              <h3 className="text-lg font-semibold font-display text-gray-dark">
                ⚡ 快速交付
              </h3>
              <p className="text-sm text-gray-secondary leading-relaxed">
                30 秒内完成大部分任务，结构化输出可直接使用。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-semibold font-display text-gray-dark tracking-tight">
            准备好开始了吗？
          </h2>
          <p className="text-base text-gray-secondary">
            选择一个数字 AI 员工，立即体验标准化的 AI 劳务服务
          </p>
          <Button size="lg">免费开始使用</Button>
        </div>
      </section>
    </div>
  );
}
