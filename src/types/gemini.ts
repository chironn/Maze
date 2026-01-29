/**
 * AI 返回的卦象解析结构
 */
export interface AIHexagramInterpretation {
  name: {
    zh: string;
  };
  judgement: {
    zh: string;
  };
  image: {
    zh: string;
  };
  summary: {
    zh: string;
  };
  lines: Array<{
    lineNumber: number;
    zh: string;
  }>;
}

/**
 * Hook 状态管理
 */
export interface GeminiState {
  data: AIHexagramInterpretation | null;
  loading: boolean;
  error: string | null;
}

/**
 * BFF API 请求类型
 */
export interface InterpretRequest {
  lines: number[];
  baseHex: string;
  changedHex: string;
  moving: boolean[];
}

/**
 * BFF API 响应类型
 */
export interface InterpretResponse extends AIHexagramInterpretation {}

/**
 * BFF API 错误响应
 */
export interface InterpretError {
  error: string;
  message: string;
}
