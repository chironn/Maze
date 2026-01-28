import { castLine } from './coinCaster';
import { buildHexagram } from './hexagramBuilder';
import type { CastResult } from '../types/divination';

/**
 * 执行完整的卜卦流程
 * @returns 卦象结果
 */
export function castHexagram(): CastResult {
  // 投掷6次，生成6个爻值（自下而上）
  const lines = Array.from({ length: 6 }, () => castLine());

  // 构建卦象
  return buildHexagram(lines);
}

// 导出所有模块
export { castLine } from './coinCaster';
export { lineToYinYang, isMoving } from './lineCalculator';
export { buildHexagram } from './hexagramBuilder';
