import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { isRealProductId, type Product } from '../data/products'

export type CartItem = { productId: string; name: string; price: number; img: string; qty: number }

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  add: (p: Product, qty?: number) => boolean
  setQty: (productId: string, qty: number) => void
  remove: (productId: string) => void
  clear: () => void
  syncWith: (products: Product[]) => void
}

const STORAGE_KEY = 'fmx_cart_v1'
const MAX_QTY = 20
const CartContext = createContext<CartContextValue | null>(null)

function read(): CartItem[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? parsed.filter((i) => isRealProductId(i?.productId) && i.qty > 0) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(read)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* ignore */
    }
  }, [items])

  // keep the cart in sync across browser tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => e.key === STORAGE_KEY && setItems(read())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const add = useCallback((p: Product, qty = 1) => {
    if (!isRealProductId(p.id)) return false // offline fallback product – can't be ordered
    setItems((prev) => {
      const found = prev.find((i) => i.productId === p.id)
      if (found) return prev.map((i) => (i.productId === p.id ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) } : i))
      return [...prev, { productId: p.id, name: p.name, price: p.price, img: p.img, qty: Math.min(MAX_QTY, qty) }]
    })
    return true
  }, [])

  const setQty = useCallback((productId: string, qty: number) => {
    setItems((prev) =>
      prev.flatMap((i) => (i.productId !== productId ? [i] : qty < 1 ? [] : [{ ...i, qty: Math.min(MAX_QTY, qty) }])),
    )
  }, [])

  const remove = useCallback((productId: string) => setItems((prev) => prev.filter((i) => i.productId !== productId)), [])
  const clear = useCallback(() => setItems([]), [])

  // refresh names/prices from the live catalog and drop products that no longer exist
  const syncWith = useCallback((products: Product[]) => {
    setItems((prev) => {
      const next = prev.flatMap((i) => {
        const p = products.find((x) => x.id === i.productId)
        if (!p || p.inStock === false) return []
        return [{ ...i, name: p.name, price: p.price, img: p.img }]
      })
      return JSON.stringify(next) === JSON.stringify(prev) ? prev : next
    })
  }, [])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.price * i.qty, 0),
      add,
      setQty,
      remove,
      clear,
      syncWith,
    }),
    [items, add, setQty, remove, clear, syncWith],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
