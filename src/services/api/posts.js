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

async function safeParseError(response) {
  try {
    const data = await response.json()
    if (typeof data === 'object' && data && 'message' in data) {
      return String(data.message)
    }
    return response.statusText || '服务器返回错误'
  } catch (error) {
    return response.statusText || '服务器返回错误'
  }
}
