import type { GeminiState } from '../../types/gemini';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ErrorMessage } from './ErrorMessage';

interface AIInterpretationProps {
  state: GeminiState;
  onRetry: () => void;
}

export function AIInterpretation({ state, onRetry }: AIInterpretationProps) {
  if (state.loading) {
    return (
      <div className="p-6">
        <LoadingSkeleton />
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="p-6">
        <ErrorMessage message={state.error} onRetry={onRetry} />
      </div>
    );
  }

  if (!state.data) {
    return null;
  }

  const { name, judgement, image, summary, lines } = state.data;

  return (
    <div className="space-y-6">
      {/* 卦名 - 居中大标题 */}
      <div className="text-center pt-4">
        <h2 className="text-3xl font-bold text-primary">{name.zh}</h2>
      </div>

      {/* 解卦 - 白话总结，突出显示 */}
      {summary && (
        <div className="p-5 bg-primary/10 rounded-apple border-l-4 border-primary">
          <h3 className="font-semibold text-primary mb-2">解卦</h3>
          <p className="leading-relaxed text-text text-lg">{summary.zh}</p>
        </div>
      )}

      {/* 卦辞 */}
      <div className="bg-white/50 rounded-apple p-5">
        <h3 className="font-semibold text-accent mb-2">卦辞</h3>
        <p className="leading-relaxed text-text">{judgement.zh}</p>
      </div>

      {/* 象曰 */}
      <div className="bg-white/50 rounded-apple p-5">
        <h3 className="font-semibold text-accent mb-2">象曰</h3>
        <p className="leading-relaxed text-text">{image.zh}</p>
      </div>

      {/* 动爻 */}
      {lines && lines.length > 0 && (
        <div className="bg-white/50 rounded-apple p-5">
          <h3 className="font-semibold text-accent mb-3">动爻</h3>
          <div className="space-y-3">
            {lines.map((line) => (
              <div key={line.lineNumber} className="pl-4 border-l-2 border-primary/40">
                <span className="font-medium text-primary">第{line.lineNumber}爻</span>
                <p className="mt-1 leading-relaxed text-text">{line.zh}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
