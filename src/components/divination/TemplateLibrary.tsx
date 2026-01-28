import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { questionTemplates } from '../../data/questionTemplates';
import type { QuestionCategory } from '../../types/divination';

const shuffleArray = <T,>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

interface Props {
  category: QuestionCategory;
  onSelect: (template: string) => void;
}

export function TemplateLibrary({ category, onSelect }: Props) {
  const [templates, setTemplates] = useState<string[]>([]);

  const refreshTemplates = () => {
    const categoryTemplates = questionTemplates[category] || [];
    setTemplates(shuffleArray(categoryTemplates).slice(0, 3));
  };

  useEffect(() => {
    refreshTemplates();
  }, [category]);

  if (templates.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      <p className="text-xs text-gray-500">参考问题（点击填充）</p>
      <AnimatePresence mode="wait">
        <motion.div
          key={templates.join('')}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="space-y-2"
        >
          {templates.map((template, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(template)}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              · {template}
            </button>
          ))}
        </motion.div>
      </AnimatePresence>
      <button
        type="button"
        onClick={refreshTemplates}
        className="text-sm text-primary hover:underline"
      >
        换一批
      </button>
    </div>
  );
}
