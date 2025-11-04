import { i18n } from '@/i18n'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'

export async function fetchUsers() {
  const response = await fetch(`${API_BASE_URL}/users`)
  if (!response.ok) {
    const message = await safeParseError(response)
    throw new Error(message)
  }
  return await response.json()
}

export async function registerUser(payload) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const message = await safeParseError(response)
    throw new Error(message)
  }

  return await response.json()
}

async function safeParseError(response) {
  try {
    const data = await response.json()
    if (typeof data === 'object' && data && 'message' in data) {
      return String(data.message)
    }
    return response.statusText || i18n.global.t('common.serverError')
  } catch (error) {
    return response.statusText || i18n.global.t('common.serverError')
  }
}

