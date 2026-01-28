import type { LineValue, CastResult } from '../types/divination';
import { lineToYinYang, isMoving } from './lineCalculator';

/**
 * 构建卦象
 * @param lines 6个爻值（自下而上）
 * @returns 本卦、变卦、动爻信息
 */
export function buildHexagram(lines: LineValue[]): CastResult {
  // 输入参数校验
  if (!Array.isArray(lines)) {
    throw new Error('Invalid input: lines must be an array');
  }

  if (lines.length !== 6) {
    throw new Error(`Invalid lines length: expected 6, got ${lines.length}`);
  }

  // 校验每个爻值
  const validValues: LineValue[] = [6, 7, 8, 9];
  lines.forEach((v, index) => {
    if (!validValues.includes(v)) {
      throw new Error(`Invalid line value at position ${index}: ${v} (expected 6, 7, 8, or 9)`);
    }
  });

  // 本卦：直接映射阴阳
  const base = lines.map(lineToYinYang);

  // 动爻标记
  const moving = lines.map(isMoving);

  // 变卦：动爻进行阴阳反转
  const changed = lines.map((v) => {
    if (v === 6) return 1; // 老阴变阳
    if (v === 9) return 0; // 老阳变阴
    return lineToYinYang(v);
  });

  return {
    lines,
    baseHex: base.join(''),
    changedHex: changed.join(''),
    moving,
  };
}
