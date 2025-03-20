import { useState, useEffect } from 'react';

export function useSessionStorage<T>(key: string, initialValue: T) {
  // 状态初始化为传入的初始值
  const [value, setValue] = useState<T>(initialValue);

  // 从 sessionStorage 读取数据
  useEffect(() => {
    try {
      const item = sessionStorage.getItem(key);
      if (item) {
        setValue(JSON.parse(item));
      }
    } catch (error) {
      console.error('从 sessionStorage 读取数据失败:', error);
    }
  }, [key]);

  // 当数据更新时，保存到 sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('保存数据到 sessionStorage 失败:', error);
    }
  }, [key, value]);

  return [value, setValue] as const;
} 