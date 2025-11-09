import { i18n } from '@/i18n'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'

function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchComments(postId, page = 1, size = 20) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments?page=${page}&size=${size}`)
  if (!response.ok) {
    const message = await safeParseError(response)
    throw new Error(message)
  }
  return await response.json()
}

export async function createComment(postId, payload, token) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(token)
    },
    body: JSON.stringify(payload)
  })
  if (!response.ok) {
    const message = await safeParseError(response)
    throw new Error(message)
  }
  return await response.json()
}

export async function deleteComment(postId, commentId, token) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      ...authHeader(token)
    }
  })

  if (!response.ok) {
    const message = await safeParseError(response)
    throw new Error(message)
  }
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
