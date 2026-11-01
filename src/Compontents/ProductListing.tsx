import { useEffect, useMemo, useRef, useState } from 'react'
import { LuChevronDown, LuCheck } from 'react-icons/lu'
import type { Product } from '../data/products'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
const sortOptions = [
  { value: 'az', label: 'Alphabetically, A-Z' },
  { value: 'za', label: 'Alphabetically, Z-A' },
  { value: 'low', label: 'Price, low to high' },
  { value: 'high', label: 'Price, high to low' },
]

const formatPrice = (n: number) =>
  `Rs. ${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

type Props = {
  title: string
  category?: Product['category'] // khali = saare products
}

function ProductListing({ title, category }: Props) {
  const { products: allProducts } = useProducts()
  const cart = useCart()
  const [sort, setSort] = useState('az')
  const [toast, setToast] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setMounted(true)
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
    }
  }, [])

  const sorted = useMemo(() => {
    const list = allProducts.filter((p) => !category || p.category === category)
    switch (sort) {
      case 'za':
        return list.sort((a, b) => b.name.localeCompare(a.name))
      case 'low':
        return list.sort((a, b) => a.price - b.price)
      case 'high':
        return list.sort((a, b) => b.price - a.price)
      default:
        return list.sort((a, b) => a.name.localeCompare(b.name))
    }
  }, [sort, category, allProducts])

  const addToCart = (p: Product) => {
    if (p.inStock === false) setToast(`${p.name} is out of stock`)
    else if (cart.add(p)) setToast(`${p.name} added to cart`)
    else setToast('Store is loading, please try again in a moment')
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2500)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Roboto:wght@400;500&display=swap');

        @keyframes ct-fade-up {
          from { opacity: 0; transform: translateY(35px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ct-fade-left {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes ct-toast {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
        .ct-fade-up   { animation: ct-fade-up 0.8s ease-out both; }
        .ct-fade-left { animation: ct-fade-left 0.8s ease-out both; }
        .ct-toast     { animation: ct-toast 0.35s ease-out both; }
        .ct-poppins   { font-family: 'Poppins', sans-serif; }
        .ct-roboto    { font-family: 'Roboto', sans-serif; }

        @media (prefers-reduced-motion: reduce) {
          .ct-fade-up, .ct-fade-left, .ct-toast { animation: none; opacity: 1; }
        }
      `}</style>

      <section className="ct-roboto min-h-[70vh] bg-white pb-16 pt-8 sm:pb-20 sm:pt-12">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-[72px]">
          {/* Heading */}
          <h1
            className={`ct-poppins text-4xl font-medium text-black sm:text-5xl lg:text-[64px] ${
              mounted ? 'ct-fade-left' : 'opacity-0'
            }`}
          >
            {title}
          </h1>

          {/* Count + Sort */}
          <div
            className={`mt-8 flex flex-col gap-4 sm:mt-12 sm:flex-row sm:items-center sm:justify-between lg:mt-16 ${
              mounted ? 'ct-fade-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '150ms' }}
          >
            <p className="text-base text-[#5d5557] sm:text-lg">
              {sorted.length} {sorted.length === 1 ? 'product' : 'products'}
            </p>

            <div className="flex items-center gap-3">
              <label htmlFor="ct-sort" className="text-base text-black sm:text-lg">
                Sort by
              </label>
              <div className="relative">
                <select
                  id="ct-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-12 min-w-[200px] cursor-pointer appearance-none border border-black bg-white pl-4 pr-10 text-base text-black outline-none
                    transition-all duration-300 hover:bg-black/[0.03] focus:ring-2 focus:ring-black/30 sm:h-[58px] sm:min-w-[275px] sm:pl-6 sm:text-lg"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <LuChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xl text-black" />
              </div>
            </div>
          </div>

          {/* Products grid */}
          {sorted.length === 0 ? (
            <p className="mt-16 text-center text-lg text-[#5d5557]">
              Is category mein abhi koi product nahi hai.
            </p>
          ) : (
            <div
              key={`${sort}-${category ?? 'all'}`}
              className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
            >
              {sorted.map((p, i) => (
                <article
                  key={p.id}
                  className={`group flex flex-col ${mounted ? 'ct-fade-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${250 + i * 150}ms` }}
                >
                  <div className="relative aspect-square overflow-hidden bg-[#f1ece9]">
                    <img
                      src={p.img}
                      alt={p.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-0"
                    />
                    <img
                      src={p.hoverImg}
                      alt={`${p.name} - alternate view`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full scale-110 object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-100"
                    />
                  </div>

                  <h2 className="ct-poppins mt-5 text-xl font-medium text-black transition-colors duration-300 group-hover:text-[#b86b77] sm:text-2xl">
                    {p.name}
                  </h2>
                  <p className="mt-2 text-base leading-snug text-[#5d5557] sm:text-lg">
                    {p.desc}
                  </p>

                  <button
                    type="button"
                    onClick={() => addToCart(p)}
                    aria-label={`Add ${p.name} to cart`}
                    className="ct-poppins mt-6 flex w-full items-center justify-between bg-[#eeeceb] px-5 py-4 text-left transition-colors duration-300
                      hover:bg-[#dcdad6] sm:px-6 sm:py-5"
                  >
                    <span className="text-lg font-semibold tracking-wide text-black">SHOP</span>
                    <span className="ct-roboto text-base text-[#5d5557] sm:text-lg">
                      {formatPrice(p.price)}
                    </span>
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>

        {toast && (
          <div
            role="status"
            className="ct-toast fixed bottom-6 left-1/2 z-50 flex items-center gap-2 rounded-full bg-[#1c1718] px-5 py-3 text-sm text-white shadow-2xl sm:text-base"
          >
            <LuCheck className="text-lg text-[#5fbfa8]" />
            {toast}
          </div>
        )}
      </section>
    </>
  )
}

export default ProductListing