const FALLBACK_API_URL = 'http://localhost:8000'

export const API_URL = (import.meta.env.VITE_API_URL || FALLBACK_API_URL).trim().replace(/\/+$/, '')

const parseResponseBody = async (response) => {
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  return text ? { message: text } : null
}

export const apiRequest = async (path, { method = 'GET', token, body, headers = {} } = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const payload = await parseResponseBody(response)

  if (!response.ok) {
    const error = new Error(
      payload?.error || payload?.msg || payload?.message || `Error HTTP ${response.status}`,
    )
    error.status = response.status
    error.payload = payload
    throw error
  }

  return payload
}
