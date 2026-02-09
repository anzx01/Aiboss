'use client';

import { useState } from 'react';
import { Agent, InputField } from '@/types';
import Button from './Button';

interface DynamicFormProps {
  agent: Agent;
  onSubmit: (data: Record<string, any>) => void;
  loading?: boolean;
}

export default function DynamicForm({ agent, onSubmit, loading = false }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // 清除该字段的错误
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 检查必填字段
    agent.input_schema.required.forEach((key) => {
      if (!formData[key] || formData[key].trim() === '') {
        const field = agent.input_schema.properties[key];
        newErrors[key] = `${field.label} 是必填项`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const renderField = (key: string, field: InputField) => {
    const value = formData[key] || '';
    const error = errors[key];
    const isRequired = agent.input_schema.required.includes(key);

    return (
      <div key={key} className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-dark">
          {field.label}
          {isRequired && <span className="text-primary ml-1">*</span>}
        </label>

        {field.description && (
          <p className="text-xs text-gray-secondary">{field.description}</p>
        )}

        {field.type === 'select' ? (
          <select
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className="border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-gray-dark"
            disabled={loading}
          >
            <option value="">请选择...</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : field.type === 'number' ? (
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(key, parseFloat(e.target.value))}
            placeholder={field.placeholder}
            className="border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-gray-dark"
            disabled={loading}
          />
        ) : (
          <textarea
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="border border-gray-border px-4 py-3 text-sm focus:outline-none focus:border-gray-dark resize-none"
            disabled={loading}
          />
        )}

        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {Object.entries(agent.input_schema.properties).map(([key, field]) =>
        renderField(key, field)
      )}

      <Button type="submit" disabled={loading} fullWidth>
        {loading ? '处理中...' : '提交任务'}
      </Button>
    </form>
  );
}
