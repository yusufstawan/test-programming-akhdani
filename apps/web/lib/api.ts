const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>
}

export const api = async (endpoint: string, options: FetchOptions = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const config = {
    ...options,
    headers,
  }

  const response = await fetch(`${API_URL}${endpoint}`, config)

  return response
}
