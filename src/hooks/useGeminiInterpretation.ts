import { useState, useCallback } from 'react';
import type { CastResult } from '../types/divination';
import type { GeminiState } from '../types/gemini';
import { getAIInterpretation } from '../services/geminiService';

/**
 * 管理 AI API 调用状态和缓存
 */
export function useGeminiInterpretation(): [
  GeminiState,
  (castResult: CastResult) => Promise<void>
] {
  const [state, setState] = useState<GeminiState>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchInterpretation = useCallback(async (castResult: CastResult): Promise<void> => {
    setState({ loading: true, data: null, error: null });

    // 缓存键包含动爻信息，避免冲突
    const movingStr = castResult.moving.map(m => (m ? '1' : '0')).join('');
    const cacheKey = `interpretation-${castResult.baseHex}-${castResult.changedHex}-${movingStr}`;

    try {
      // 1. 检查缓存
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        setState({ data: JSON.parse(cachedData), loading: false, error: null });
        return;
      }

      // 2. 调用 BFF API
      const interpretation = await getAIInterpretation(castResult);

      // 3. 保存到缓存
      localStorage.setItem(cacheKey, JSON.stringify(interpretation));

      setState({ data: interpretation, loading: false, error: null });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : '解析失败，请重试';
      setState({ data: null, loading: false, error: errorMessage });
      throw e; // 重新抛出让调用方知道失败了
    }
  }, []);

  return [state, fetchInterpretation];
}
