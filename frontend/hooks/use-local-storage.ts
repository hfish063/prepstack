"use client";

export function useLocalStorage<T>() {
  const setItem = (key: string, value: T) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  };

  const getItem = (key: string) => {
    try {
      const item = window.localStorage.getItem(key);

      if (!item) {
        return undefined as T;
      }

      return JSON.parse(item) as T;
    } catch (e) {
      console.error(e);
    }
  };

  const removeItem = (key: string) => {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.error(e);
    }
  };

  const clearItems = () => {
    try {
      window.localStorage.clear();
    } catch (e) {
      console.error(e);
    }
  };

  return { setItem, getItem, removeItem, clearItems };
}
