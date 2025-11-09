import { i18n } from '@/i18n'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'

function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/**
 * @param {Record<string, any>} payload
 * @param {string} token
 */
export async function createPost(payload, token) {
  const response = await fetch(`${API_BASE_URL}/posts`, {
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

export async function fetchPosts(page = 1, size = 20) {
  const searchParams = new URLSearchParams({ page: String(page), size: String(size) })
  const response = await fetch(`${API_BASE_URL}/posts?${searchParams.toString()}`)

  if (!response.ok) {
    const message = await safeParseError(response)
    throw new Error(message)
  }

  return await response.json()
}

export async function fetchPostById(id) {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`)

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
export async function updatePost(id, payload, token) {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'PUT',
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

/**
 * @param {string} id
 * @param {string} token
 */
export async function likePost(id, token) {
  const response = await fetch(`${API_BASE_URL}/posts/${id}/likes`, {
    method: 'POST',
    headers: {
      ...authHeader(token)
    }
  })

  if (!response.ok) {
    const message = await safeParseError(response)
    throw new Error(message)
  }

  return await response.json()
}

/**
 * @param {string} id
 * @param {string} token
 */
export async function unlikePost(id, token) {
  const response = await fetch(`${API_BASE_URL}/posts/${id}/likes`, {
    method: 'DELETE',
    headers: {
      ...authHeader(token)
    }
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
export async function deletePost(id, token) {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
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
