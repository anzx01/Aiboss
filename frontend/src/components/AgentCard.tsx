import Link from 'next/link';
import { Agent } from '@/types';
import Button from './Button';

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  return (
    <div className="border border-gray-border bg-white p-8 flex flex-col gap-6 hover:shadow-lg transition-shadow">
      {/* Icon */}
      <div className="w-14 h-14 border border-gray-border bg-gray-bg flex items-center justify-center">
        <span className="text-3xl">{agent.avatar}</span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold font-display text-gray-dark">
        {agent.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-secondary leading-relaxed">
        {agent.description}
      </p>

      {/* Price */}
      <div className="flex items-center gap-2">
        <span className="text-base font-semibold font-display text-gray-dark">
          {agent.price_label}
        </span>
        <span className="px-2 py-1 bg-success text-white text-xs font-medium">
          MVP 免费
        </span>
      </div>

      {/* CTA */}
      <Link href={`/agents/${agent.id}`}>
        <Button variant="secondary" fullWidth>
          雇佣 TA
        </Button>
      </Link>
    </div>
  );
}
