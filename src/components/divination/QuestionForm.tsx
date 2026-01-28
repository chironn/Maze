import { useState } from 'react';
import { motion } from 'framer-motion';
import { CategorySelector } from './CategorySelector';
import { TemplateLibrary } from './TemplateLibrary';
import type { Question, QuestionCategory } from '../../types/divination';

interface Props {
  onSubmit: (question: Question) => void;
  onCancel: () => void;
}

export function QuestionForm({ onSubmit, onCancel }: Props) {
  const [category, setCategory] = useState<QuestionCategory>('career');
  const [text, setText] = useState('');
  const [error, setError] = useState(false);

  const remainingChars = 200 - text.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (text.trim().length === 0) {
      setError(true);
      return;
    }

    if (text.length > 200) {
      setError(true);
      return;
    }

    onSubmit({ text: text.trim(), category });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setError(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CategorySelector selected={category} onSelect={setCategory} />

      <div>
        <label htmlFor="question-text" className="block text-sm font-medium text-gray-700 mb-2">
          您的问题
        </label>
        <motion.div animate={{ x: error ? [-5, 5, -5, 0] : 0 }} transition={{ duration: 0.3 }}>
          <textarea
            id="question-text"
            value={text}
            onChange={handleTextChange}
            placeholder="请输入您想问的问题..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            aria-invalid={error}
            aria-describedby="char-count"
          />
        </motion.div>
        <div id="char-count" className="mt-1 flex justify-between text-xs" aria-live="polite">
          <span className={error ? 'text-red-500' : 'text-gray-500'}>
            {error ? '问题不能为空且不超过200字' : '请认真思考后提问'}
          </span>
          <span className={remainingChars < 0 ? 'text-red-500' : 'text-gray-500'}>
            剩余 {remainingChars} 字
          </span>
        </div>
      </div>

      <TemplateLibrary category={category} onSelect={setText} />

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          取消
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          disabled={text.trim().length === 0 || text.length > 200}
        >
          卜问一卦
        </button>
      </div>
    </form>
  );
}
