import axios from 'axios'
import type { Session } from '../types/domain'

const SESSION_KEY = 'agora.session'
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/v1', timeout: 20_000 })

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem(SESSION_KEY)
  if (raw) {
    const session = JSON.parse(raw) as Session
    config.headers.Authorization = `Bearer ${session.token}`
    if (session.accountId) config.headers['X-Account-Id'] = session.accountId
  }
  return config
})

api.interceptors.response.use((response) => response, (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    localStorage.removeItem(SESSION_KEY)
    if (location.pathname !== '/login') location.assign('/login')
  }
  return Promise.reject(error)
})

export function errorMessage(error: unknown): string {
  if (axios.isAxiosError<{ error?: { message?: string } }>(error)) return error.response?.data?.error?.message ?? error.message
  return error instanceof Error ? error.message : 'Request failed'
}

export { SESSION_KEY }
