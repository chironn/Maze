import type { LineValue, Question } from '../types/divination';

export interface HistoryRecord {
  id: string;
  ts: number;
  lines: LineValue[];
  baseHex: string;
  changedHex: string;
  lang: 'zh' | 'en';
  note?: string;
  // 问事功能扩展字段
  mode?: 'cast' | 'question';
  question?: Question;
}

export interface HistoryStore {
  version: number;
  records: HistoryRecord[];
}
