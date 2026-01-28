import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { castHexagram } from '../../divination';
import { saveRecord } from '../../storage';
import { generateId } from '../../utils';
import { useI18n } from '../../contexts/I18nContext';
import { useGeminiInterpretation } from '../../hooks/useGeminiInterpretation';
import { CoinCanvas } from './CoinCanvas';
import { AIInterpretation } from '../results/AIInterpretation';
import { AskQuestionModal } from './AskQuestionModal';
import { getAIInterpretationWithQuestion } from '../../services/geminiService';
import type { CastResult, Question } from '../../types/divination';
import type { GeminiState } from '../../types/gemini';

type DivinationState = 'idle' | 'divining' | 'revealing' | 'done';

export function DivinationCore() {
  const [state, setState] = useState<DivinationState>('idle');
  const [result, setResult] = useState<CastResult | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const { locale } = useI18n();
  const [geminiState, fetchInterpretation] = useGeminiInterpretation();

  const handleDivine = async (divinationQuestion: Question | null = null) => {
    if (state !== 'idle') return;

    setState('divining');
    const startTime = Date.now();

    // 执行卜卦算法
    const castResult = castHexagram();
    setResult(castResult);
    setQuestion(divinationQuestion);

    // 保存到历史记录
    saveRecord({
      id: generateId(),
      ts: Date.now(),
      lines: castResult.lines,
      baseHex: castResult.baseHex,
      changedHex: castResult.changedHex,
      lang: locale,
      mode: divinationQuestion ? 'question' : 'cast',
      question: divinationQuestion || undefined,
    });

    // 调用 AI 解析，等待结果
    try {
      if (divinationQuestion) {
        // 问事模式：调用专用 API
        const interpretation = await getAIInterpretationWithQuestion(castResult, divinationQuestion);
        // 手动更新状态（因为没有使用 hook）
        geminiState.data = interpretation;
        geminiState.loading = false;
        geminiState.error = null;
      } else {
        // 常规模式：使用现有 hook
        await fetchInterpretation(castResult);
      }

      // 确保至少展示 3 秒动画（一轮完整铜钱落地）
      const elapsed = Date.now() - startTime;
      const minWait = 3000;
      if (elapsed < minWait) {
        await new Promise(resolve => setTimeout(resolve, minWait - elapsed));
      }

      // AI 返回后，显示签筒动画
      setState('revealing');
      // 签筒动画 2 秒后跳转结果页
      await new Promise(resolve => setTimeout(resolve, 2000));
      setState('done');
    } catch {
      setState('done');
    }
  };

  const handleAskConfirm = (confirmedQuestion: Question) => {
    setIsModalOpen(false);
    handleDivine(confirmedQuestion);
  };

  return (
    <div className="flex-1 flex items-center justify-center relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />

      {/* 中心光晕 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* 龟甲 - 可点击 */}
      <TurtleShell
        state={state}
        isHovering={isHovering}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        onClick={() => handleDivine(null)}
      />

      {/* 铜钱动画 - divining 状态持续显示 */}
      <CoinCanvas isActive={state === 'divining'} />

      {/* 入口按钮 - 仅在 idle 状态显示 */}
      {state === 'idle' && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
          <button
            onClick={() => setIsModalOpen(true)}
            aria-label="诚心问事，带着问题进行卜卦"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all font-medium"
          >
            <span className="text-xl" aria-hidden="true">👉</span>
            <span>迷津</span>
          </button>
        </div>
      )}

      {/* 问事模态框 */}
      <AskQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAskConfirm}
      />

      {/* 签筒揭示动画 */}
      <AnimatePresence>
        {state === 'revealing' && geminiState.data && (
          <RevealAnimation hexagramName={geminiState.data.name.zh} />
        )}
      </AnimatePresence>

      {/* 结果展示 */}
      <AnimatePresence>
        {state === 'done' && result && (
          <ResultPanel
            onClose={() => setState('idle')}
            geminiState={geminiState}
            question={question}
            onRetryAI={() => {
              if (result && question) {
                getAIInterpretationWithQuestion(result, question);
              } else if (result) {
                fetchInterpretation(result);
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* 提示文字 - 移除，使用按钮代替 */}

      {/* 加载提示 */}
      {state === 'divining' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-24 text-primary text-sm"
        >
          卦象推演中...
        </motion.p>
      )}
    </div>
  );
}


// 龟甲组件 - 可点击，有悬停光晕
function TurtleShell({
  state,
  isHovering,
  onHoverStart,
  onHoverEnd,
  onClick
}: {
  state: DivinationState;
  isHovering: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}) {
  const isClickable = state === 'idle';

  return (
    <motion.button
      type="button"
      disabled={!isClickable}
      aria-label="点击龟甲开始卜卦"
      className={`relative bg-transparent border-0 p-0 ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onClick={onClick}
      animate={
        state === 'divining'
          ? {
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }
          : state === 'revealing'
          ? { scale: 0.8, opacity: 0.5 }
          : state === 'done'
          ? { scale: 0.6, opacity: 0 }
          : { scale: 1, opacity: 1 }
      }
      transition={
        state === 'divining'
          ? {
              rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
              scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
            }
          : { duration: 0.5 }
      }
    >
      {/* 悬停光晕 */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{
          opacity: isHovering && isClickable ? 1 : 0,
          scale: isHovering && isClickable ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <div 
          className="w-96 h-96 rounded-full blur-2xl"
          style={{ backgroundColor: 'rgba(200, 155, 60, 0.3)' }}
        />
      </motion.div>

      {/* 卜卦中的光晕动画 */}
      {state === 'divining' && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div 
            className="w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: 'rgba(255, 215, 0, 0.4)' }}
          />
        </motion.div>
      )}

      <img
        src="/turtle.png"
        alt="龟甲"
        className="w-80 h-80 object-contain relative z-10 pointer-events-none"
        style={{
          filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))',
          mixBlendMode: 'multiply'
        }}
      />
    </motion.button>
  );
}

// 书卷揭示动画
function RevealAnimation({ hexagramName }: { hexagramName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="absolute inset-0 flex items-center justify-center z-20"
    >
      {/* 书卷容器 */}
      <motion.div
        className="relative"
        initial={{ rotateX: 90 }}
        animate={{ rotateX: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* 书卷主体 */}
        <div 
          className="relative px-12 py-8"
          style={{
            background: 'linear-gradient(180deg, #F5E6D3 0%, #E8D4B8 50%, #D4C4A8 100%)',
            borderRadius: '4px',
            boxShadow: `
              0 4px 20px rgba(0,0,0,0.3),
              inset 0 1px 0 rgba(255,255,255,0.5),
              inset 0 -1px 0 rgba(0,0,0,0.1)
            `,
            minWidth: '200px',
          }}
        >
          {/* 上卷轴 */}
          <div 
            className="absolute -top-3 left-0 right-0 h-6 rounded-full"
            style={{
              background: 'linear-gradient(180deg, #8B7355 0%, #6B5344 50%, #8B7355 100%)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          />
          
          {/* 下卷轴 */}
          <div 
            className="absolute -bottom-3 left-0 right-0 h-6 rounded-full"
            style={{
              background: 'linear-gradient(180deg, #8B7355 0%, #6B5344 50%, #8B7355 100%)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          />

          {/* 纸张纹理 */}
          <div 
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* 卦名内容 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative text-center py-4"
          >
            <p className="text-sm text-amber-700 mb-2">得卦</p>
            <h2 
              className="text-3xl font-bold"
              style={{ 
                color: '#4A3728',
                fontFamily: 'serif',
                textShadow: '1px 1px 0 rgba(255,255,255,0.3)',
              }}
            >
              {hexagramName}
            </h2>
          </motion.div>

          {/* 装饰边框 */}
          <div 
            className="absolute inset-4 border border-amber-700/20 rounded pointer-events-none"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// 结果面板组件
function ResultPanel({
  onClose,
  geminiState,
  question,
  onRetryAI,
}: {
  onClose: () => void;
  geminiState: GeminiState;
  question: Question | null;
  onRetryAI: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="absolute inset-0 bg-background/95 backdrop-blur-apple p-8 overflow-y-auto z-30"
    >
      <button
        onClick={onClose}
        aria-label="关闭结果面板"
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/50 hover:bg-white/70 flex items-center justify-center z-10"
      >
        <span aria-hidden="true">✕</span>
      </button>

      <div className="max-w-2xl mx-auto">
        {question && (
          <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-l-4 border-primary rounded-r-lg">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              问事
            </p>
            <p className="text-lg font-medium text-gray-900">
              {question.text}
            </p>
          </div>
        )}
        <AIInterpretation state={geminiState} onRetry={onRetryAI} />
      </div>
    </motion.div>
  );
}
