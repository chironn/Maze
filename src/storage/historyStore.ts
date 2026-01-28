import type { HistoryStore, HistoryRecord } from '../types/storage';
import { STORAGE_KEYS } from './storageKeys';

const MAX_RECORDS = 100;

/**
 * 校验历史记录数据结构
 */
function validateStore(data: any): data is HistoryStore {
  if (!data || typeof data !== 'object') {
    return false;
  }

  if (typeof data.version !== 'number') {
    return false;
  }

  if (!Array.isArray(data.records)) {
    return false;
  }

  return true;
}

/**
 * 加载历史记录
 */
export function loadStore(): HistoryStore {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!data) {
      return { version: 1, records: [] };
    }

    const parsed = JSON.parse(data);

    // 结构校验
    if (!validateStore(parsed)) {
      console.warn('Invalid history store structure, resetting to default');
      return { version: 1, records: [] };
    }

    return parsed;
  } catch (error) {
    console.error('Failed to load history store:', error);
    return { version: 1, records: [] };
  }
}

/**
 * 保存历史记录
 */
export function saveRecord(record: HistoryRecord): void {
  try {
    const store = loadStore();
    store.records.unshift(record);

    // FIFO 删除
    if (store.records.length > MAX_RECORDS) {
      store.records = store.records.slice(0, MAX_RECORDS);
    }

    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(store));
  } catch (error) {
    console.error('Failed to save record:', error);
  }
}

/**
 * 获取所有历史记录
 */
export function getAllRecords(): HistoryRecord[] {
  return loadStore().records;
}

/**
 * 删除指定记录
 */
export function deleteRecord(id: string): void {
  try {
    const store = loadStore();
    store.records = store.records.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(store));
  } catch (error) {
    console.error('Failed to delete record:', error);
  }
}

/**
 * 清空所有历史记录
 */
export function clearAllRecords(): void {
  try {
    const store: HistoryStore = { version: 1, records: [] };
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(store));
  } catch (error) {
    console.error('Failed to clear records:', error);
  }
}
