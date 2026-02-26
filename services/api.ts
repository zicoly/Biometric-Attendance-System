import axios from 'axios'
// import { API_BASE_URL } from '@env'
import { getToken, clearAuth } from '../utils/secureStore'

const api = axios.create({
  baseURL: process.env.EXPO_API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor
api.interceptors.request.use(async (config) => {
  const token = await getToken()
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await clearAuth()
      // Navigation to login happens via auth state change
    }
    return Promise.reject(error)
  }
)

export default api