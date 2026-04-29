import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Request interceptor: attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('auth-storage')
    if (stored) {
      try {
        const { state } = JSON.parse(stored)
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`
        }
      } catch {
        // ignore parse errors
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// --- Auth ---
export const authAPI = {
  register: (data) => apiClient.post('/api/auth/register', data),
  login: (data) => apiClient.post('/api/auth/login', data),
  forgotPassword: (email) => apiClient.post('/api/auth/forgot-password', { email }),
}

// --- Products ---
export const productsAPI = {
  getAll: (params) => apiClient.get('/api/products', { params }),
  getById: (id) => apiClient.get(`/api/products/${id}`),
}

// --- Cart ---
export const cartAPI = {
  add: (data) => apiClient.post('/api/cart/add', data),
}

// --- Orders ---
export const ordersAPI = {
  create: (data) => apiClient.post('/api/orders/create', data),
  getById: (id) => apiClient.get(`/api/orders/${id}`),
  getMyOrders: () => apiClient.get('/api/orders/my'),
}

// --- Payment ---
export const paymentAPI = {
  process: (data) => apiClient.post('/api/payment/process', data),
}

export default apiClient
