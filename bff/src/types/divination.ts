export type LineValue = 6 | 7 | 8 | 9;

export interface CastResult {
  lines: LineValue[];
  baseHex: string;
  changedHex: string;
  moving: boolean[];
}

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

// 问事功能相关类型
export type QuestionCategory = 'career' | 'love' | 'health' | 'wealth' | 'study' | 'other';

export interface QuestionContext {
  question: string;
  category: QuestionCategory;
  templateId?: string;
}

export type InterpretWithQuestionRequest = CastResult & QuestionContext;
