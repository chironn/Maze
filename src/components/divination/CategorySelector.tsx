import { type QuestionCategory } from '../../types/divination';

const CATEGORIES: Array<{ id: QuestionCategory; label: string }> = [
  { id: 'career', label: '事业' },
  { id: 'love', label: '感情' },
  { id: 'health', label: '健康' },
  { id: 'wealth', label: '财运' },
  { id: 'study', label: '学业' },
  { id: 'other', label: '其他' },
];

interface Props {
  selected: QuestionCategory;
  onSelect: (category: QuestionCategory) => void;
}

export function CategorySelector({ selected, onSelect }: Props) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-gray-700">问题类别</legend>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
              ${
                selected === id
                  ? 'bg-primary text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
            aria-pressed={selected === id}
          >
            {label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
