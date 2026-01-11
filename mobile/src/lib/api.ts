import axios from 'axios'
import { env } from '~/env/env'
import { getToken } from '~/storage/token-storage'

export const api = axios.create({
  baseURL: env.EXPO_PUBLIC_SERVER_BASE_URL,
})

api.interceptors.request.use(
  async request => {
    const token = await getToken()

    if (token) {
      request.headers = request.headers ?? {}
      request.headers.Authorization = `Bearer ${token}`
    }

    return request
  },
  error => Promise.reject(error)
)
