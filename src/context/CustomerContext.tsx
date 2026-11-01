import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, getCustomerToken, setCustomerToken, type Customer } from '../lib/api'

type CustomerContextValue = {
  customer: Customer | null
  loading: boolean // true while checking a saved session on page load
  login: (email: string, password: string) => Promise<void>
  register: (data: { name: string; email: string; phone?: string; password: string }) => Promise<void>
  logout: () => void
  setCustomer: (c: Customer) => void
}

const CustomerContext = createContext<CustomerContextValue | null>(null)

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(() => !!getCustomerToken())

  useEffect(() => {
    if (!getCustomerToken()) return
    api
      .me()
      .then(setCustomer)
      .catch(() => setCustomerToken(null))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.login(email, password)
    setCustomerToken(res.token)
    setCustomer(res.customer)
  }, [])

  const register = useCallback(async (data: { name: string; email: string; phone?: string; password: string }) => {
    const res = await api.register(data)
    setCustomerToken(res.token)
    setCustomer(res.customer)
  }, [])

  const logout = useCallback(() => {
    setCustomerToken(null)
    setCustomer(null)
  }, [])

  const value = useMemo(() => ({ customer, loading, login, register, logout, setCustomer }), [customer, loading, login, register, logout])
  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCustomer() {
  const ctx = useContext(CustomerContext)
  if (!ctx) throw new Error('useCustomer must be used inside <CustomerProvider>')
  return ctx
}