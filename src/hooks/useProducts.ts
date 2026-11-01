import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { fallbackProducts, type Product } from '../data/products'

const STORAGE_KEY = 'fmx_products_v1'

function readCache(): Product[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Product[]) : null
  } catch {
    return null
  }
}

// Shared across every component on the page: one request, remembered between page loads.
let cache: Product[] | null = readCache()
let inflight: Promise<Product[]> | null = null

function load(): Promise<Product[]> {
  if (!inflight) {
    inflight = api
      .products()
      .then((list) => {
        cache = list
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
        } catch {
          /* storage unavailable – fine */
        }
        return list
      })
      .finally(() => {
        // allow a fresh fetch on the next page visit
        setTimeout(() => (inflight = null), 30_000)
      })
  }
  return inflight
}

/** Live products from the backend. `live` is true once the server has answered. */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>(cache ?? fallbackProducts)
  const [live, setLive] = useState(false)

  useEffect(() => {
    let alive = true
    load()
      .then((list) => {
        if (!alive) return
        setProducts(list)
        setLive(true)
      })
      .catch(() => {
        /* keep cached / fallback products */
      })
    return () => {
      alive = false
    }
  }, [])

  return { products, live }
}
