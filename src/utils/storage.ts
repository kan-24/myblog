const PREFIX = 'blogx:';

export function getStorage<T>(key: string, fallback: T): T {
  const value = window.localStorage.getItem(`${PREFIX}${key}`);
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn('Failed to parse storage value', error);
    return fallback;
  }
}

export function setStorage<T>(key: string, value: T) {
  window.localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
}

export function removeStorage(key: string) {
  window.localStorage.removeItem(`${PREFIX}${key}`);
}
