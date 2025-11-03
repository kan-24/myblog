import { i18n } from '@/i18n'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'

/**
 * @param {Record<string, any>} payload
 */
export async function createPost(payload) {
  const response = await fetch(`${API_BASE_URL}/posts`, {
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

export async function fetchPosts() {
  const response = await fetch(`${API_BASE_URL}/posts`)

  if (!response.ok) {
    const message = await safeParseError(response)
    throw new Error(message)
  }

  return await response.json()
}

/**
 * @param {string} id
 * @param {Record<string, any>} payload
 */
export async function updatePost(id, payload) {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'PUT',
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

/**
 * @param {string} id
 * @param {boolean} liked
 */
export async function togglePostLike(id, liked) {
  const response = await fetch(`${API_BASE_URL}/posts/${id}/likes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ liked })
  })

  if (!response.ok) {
    const message = await safeParseError(response)
    throw new Error(message)
  }

  return await response.json()
}

/**
 * @param {string} id
 */
export async function deletePost(id) {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'DELETE'
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
