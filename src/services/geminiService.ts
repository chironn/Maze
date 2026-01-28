import type { CastResult, Question } from '../types/divination';
import type { AIHexagramInterpretation, InterpretRequest, InterpretError } from '../types/gemini';

const BFF_ENDPOINT = '/api/interpret';
const BFF_QUESTION_ENDPOINT = '/api/interpret-with-question';

/**
 * 调用 BFF 获取卦象解析
 */
export async function getAIInterpretation(
  castResult: CastResult
): Promise<AIHexagramInterpretation> {
  const requestBody: InterpretRequest = {
    lines: castResult.lines,
    baseHex: castResult.baseHex,
    changedHex: castResult.changedHex,
    moving: castResult.moving,
  };

  const response = await fetch(BFF_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    let errorMessage = `API request failed with status ${response.status}`;

    try {
      const errorData: InterpretError = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // 如果无法解析错误响应，使用默认消息
    }

    throw new Error(errorMessage);
  }

  return await response.json();
}

/**
 * 调用 BFF 获取带问题的卦象解析
 */
export async function getAIInterpretationWithQuestion(
  castResult: CastResult,
  question: Question
): Promise<AIHexagramInterpretation> {
  const requestBody = {
    lines: castResult.lines,
    baseHex: castResult.baseHex,
    changedHex: castResult.changedHex,
    moving: castResult.moving,
    question: question.text,
    category: question.category,
    templateId: question.templateId,
  };

  const response = await fetch(BFF_QUESTION_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    let errorMessage = `API request failed with status ${response.status}`;

    try {
      const errorData: InterpretError = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // 如果无法解析错误响应，使用默认消息
    }

    throw new Error(errorMessage);
  }

  return await response.json();
}
