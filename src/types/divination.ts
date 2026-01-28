// 卜卦算法核心类型
export type LineValue = 6 | 7 | 8 | 9;
export type YinYang = 0 | 1; // 0=阴, 1=阳

export interface CastResult {
  lines: LineValue[];        // 6 个爻值（自下而上）
  baseHex: string;           // 本卦编码（6位二进制）
  changedHex: string;        // 变卦编码
  moving: boolean[];         // 动爻标记
}

// 问事功能相关类型
export type QuestionCategory = 'career' | 'love' | 'health' | 'wealth' | 'study' | 'other';

export interface Question {
  text: string;
  category: QuestionCategory;
  templateId?: string;
}
