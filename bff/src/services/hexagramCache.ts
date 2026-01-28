import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { AIHexagramInterpretation } from '../types/divination.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface HexagramData {
  id: number;
  hexCode: string;
  name: { zh: string };
  judgement: { zh: string };
  image: { zh: string };
  summary?: { zh: string };
  lines: Array<{ zh: string }>;
}

interface HexagramsFile {
  hexagrams: HexagramData[];
}

// 加载本地卦象数据
const hexagramsPath = path.join(__dirname, '../data/hexagrams.json');
const hexagramsData: HexagramsFile = JSON.parse(fs.readFileSync(hexagramsPath, 'utf-8'));

// 构建 hexCode -> 卦象数据 的映射
const hexagramMap = new Map<string, HexagramData>();
for (const hex of hexagramsData.hexagrams) {
  hexagramMap.set(hex.hexCode, hex);
}

/**
 * 从本地缓存获取卦象基础解释（无动爻）
 */
export function getCachedInterpretation(
  baseHex: string,
  moving: boolean[]
): AIHexagramInterpretation | null {
  const hexagram = hexagramMap.get(baseHex);
  if (!hexagram) return null;

  // 获取动爻位置
  const movingLineNumbers = moving
    .map((isMoving, index) => (isMoving ? index + 1 : -1))
    .filter(num => num !== -1);

  // 构建返回结构
  const result: AIHexagramInterpretation = {
    name: { zh: hexagram.name.zh },
    judgement: { zh: hexagram.judgement.zh },
    image: { zh: hexagram.image.zh },
    summary: { zh: hexagram.summary?.zh || '' },
    lines: movingLineNumbers.map(lineNum => ({
      lineNumber: lineNum,
      zh: hexagram.lines[lineNum - 1]?.zh || '',
    })),
  };

  return result;
}

/**
 * 检查缓存是否有效（有中文内容）
 */
export function isCacheValid(baseHex: string): boolean {
  const hexagram = hexagramMap.get(baseHex);
  return !!(hexagram?.judgement?.zh && hexagram.judgement.zh.length > 10);
}
