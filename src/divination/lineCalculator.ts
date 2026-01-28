import type { LineValue, YinYang } from '../types/divination';

/**
 * 将爻值转换为阴阳
 * 7/9 = 阳(1), 6/8 = 阴(0)
 */
export function lineToYinYang(value: LineValue): YinYang {
  return (value === 7 || value === 9) ? 1 : 0;
}

/**
 * 判断是否为动爻
 * 6/9 = 动爻
 */
export function isMoving(value: LineValue): boolean {
  return value === 6 || value === 9;
}
