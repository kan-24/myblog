const PREFIX = 'blogx:'

export function getStorage(key, fallback) {
  const value = window.localStorage.getItem(`${PREFIX}${key}`)
  if (!value) return fallback
  try {
    return JSON.parse(value)
  } catch (error) {
    console.warn('Failed to parse storage value', error)
    return fallback
  }
}

export function setStorage(key, value) {
  window.localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value))
}

export function removeStorage(key) {
  window.localStorage.removeItem(`${PREFIX}${key}`)
}
