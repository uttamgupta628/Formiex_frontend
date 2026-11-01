// In dev, Vite proxies /api to the backend (see vite.config.ts).
// In production set VITE_API_URL to e.g. https://formiex-api.onrender.com/api
// Accepts VITE_API_URL with or without the trailing /api (e.g. http://localhost:5000 or http://localhost:5000/api)
const RAW = ((import.meta.env.VITE_API_URL as string | undefined) || '').trim().replace(/\/+$/, '')
const BASE = RAW ? (RAW.endsWith('/api') ? RAW : `${RAW}/api`) : '/api'

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

const TOKEN_KEY = 'fmx_customer_token'
export const getCustomerToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}
export const setCustomerToken = (t: string | null) => {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* storage unavailable */
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response
  try {
    // signed-in customers are recognised automatically (guests simply send no token)
    const headers = new Headers(init.headers)
    const token = getCustomerToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
    res = await fetch(`${BASE}${path}`, { ...init, headers })
  } catch {
    throw new ApiError('Could not reach the server. Please check your connection and try again.', 0)
  }
  const data = await res.json().catch(() => ({}))
  if (res.status === 401 && path.startsWith('/customers/') && !path.startsWith('/customers/login') && !path.startsWith('/customers/register')) {
    setCustomerToken(null) // expired session
  }
  if (!res.ok) throw new ApiError(data?.message || 'Something went wrong. Please try again.', res.status)
  return data as T
}

const json = (body: unknown, method = 'POST'): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

/* ---------- Types ---------- */

export type PaymentInfo = {
  method: 'upi'
  upiId: string
  payeeName: string
  amount: number
  upiLink: string
  qr: string
  instructions: string
}

export type OrderItem = { name: string; price: number; qty: number; img?: string }

export type Order = {
  orderNumber: string
  items: OrderItem[]
  customer: { name: string; email: string; phone: string }
  shippingAddress: { line1: string; line2?: string; city: string; state: string; pincode: string }
  subtotal: number
  shipping: number
  total: number
  orderStatus: 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  trackingNumber?: string
  payment: { method: string; status: 'pending' | 'submitted' | 'paid' | 'failed'; utr?: string }
  createdAt: string
}

export type StoreSettings = {
  storeName: string
  shippingFee: number
  freeShippingAbove: number
  upiEnabled: boolean
}

export type Address = { line1: string; line2: string; city: string; state: string; pincode: string }
export type Customer = { id: string; name: string; email: string; phone: string; address: Address; createdAt: string }
export type MyOrder = {
  orderNumber: string
  accessToken: string
  total: number
  itemCount: number
  items: { name: string; qty: number }[]
  orderStatus: Order['orderStatus']
  paymentStatus: Order['payment']['status']
  createdAt: string
}

export type CheckoutPayload = {
  items: { productId: string; qty: number }[]
  customer: { name: string; email: string; phone: string }
  shippingAddress: { line1: string; line2?: string; city: string; state: string; pincode: string }
  notes?: string
}

/* ---------- Endpoints ---------- */

export const api = {
  products: () => request<import('../data/products').Product[]>('/products'),
  settings: () => request<StoreSettings>('/settings/public'),
  createOrder: (payload: CheckoutPayload) =>
    request<{ order: Order; accessToken: string; payment: PaymentInfo }>('/orders', json(payload)),
  getOrder: (orderNumber: string, token: string) =>
    request<{ order: Order; payment?: PaymentInfo }>(`/orders/${encodeURIComponent(orderNumber)}?token=${encodeURIComponent(token)}`),
  submitPayment: (orderNumber: string, token: string, utr: string, screenshot?: File | null) => {
    const form = new FormData()
    form.append('token', token)
    form.append('utr', utr)
    if (screenshot) form.append('screenshot', screenshot)
    return request<{ order: Order }>(`/orders/${encodeURIComponent(orderNumber)}/payment`, { method: 'POST', body: form })
  },
  register: (data: { name: string; email: string; phone?: string; password: string }) =>
    request<{ token: string; customer: Customer }>('/customers/register', json(data)),
  login: (email: string, password: string) => request<{ token: string; customer: Customer }>('/customers/login', json({ email, password })),
  me: () => request<Customer>('/customers/me'),
  updateMe: (data: { name?: string; phone?: string; address?: Address }) => request<Customer>('/customers/me', json(data, 'PUT')),
  changePassword: (currentPassword: string, newPassword: string) => request<{ ok: true }>('/customers/password', json({ currentPassword, newPassword }, 'PUT')),
  myOrders: () => request<MyOrder[]>('/customers/me/orders'),
  contact: (data: Record<string, string>) => request<{ ok: true }>('/contact', json(data)),
  subscribe: (email: string) => request<{ ok: true }>('/subscribe', json({ email })),
}