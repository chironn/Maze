import type { LineValue } from '../types/divination';

/**
 * 投掷三枚铜钱，生成单爻值
 * 规则：正面=3，反面=2
 * 总和：6=老阴（动爻）| 7=少阳 | 8=少阴 | 9=老阳（动爻）
 */
export function castLine(): LineValue {
  const coins = new Uint8Array(3);
  crypto.getRandomValues(coins);

  const sum =
    (coins[0] & 1 ? 3 : 2) +
    (coins[1] & 1 ? 3 : 2) +
    (coins[2] & 1 ? 3 : 2);

  return sum as LineValue; // 6/7/8/9
}
