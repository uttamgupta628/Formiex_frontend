import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { LuArrowRight } from 'react-icons/lu'
import { useProducts } from '../hooks/useProducts'

const formatPrice = (n: number) =>
  `Rs. ${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

function BestSellers() {
  const { products } = useProducts()
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  // Section screen par aate hi animation start hoga
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* ===== Animations (sirf is component ke liye) ===== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Roboto:wght@400;500&display=swap');

        @keyframes bs-fade-up {
          from { opacity: 0; transform: translateY(35px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bs-fade-left {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .bs-fade-up   { animation: bs-fade-up 0.8s ease-out both; }
        .bs-fade-left { animation: bs-fade-left 0.8s ease-out both; }
        .bs-poppins   { font-family: 'Poppins', sans-serif; }
        .bs-roboto    { font-family: 'Roboto', sans-serif; }

        @media (prefers-reduced-motion: reduce) {
          .bs-fade-up, .bs-fade-left { animation: none; opacity: 1; }
        }
      `}</style>

      <section ref={ref} id="best-sellers" className="bg-white py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-[72px]">
          {/* ===== Heading row ===== */}
          <div className="flex items-end justify-between gap-4">
            <h2
              className={`bs-poppins text-3xl font-medium text-black sm:text-4xl lg:text-[44px] ${
                visible ? 'bs-fade-left' : 'opacity-0'
              }`}
            >
              Best sellers
            </h2>

            {/* View all -> Catalog page */}
            <Link
              to="/catalog"
              className={`bs-roboto group/all mb-1 inline-flex items-center gap-1.5 border-b-2 border-black pb-0.5 text-base text-black transition-all duration-300 hover:gap-3 sm:text-lg ${
                visible ? 'bs-fade-up' : 'opacity-0'
              }`}
              style={{ animationDelay: '200ms' }}
            >
              View all
              <LuArrowRight className="text-base opacity-0 transition-all duration-300 group-hover/all:opacity-100" />
            </Link>
          </div>

          {/* ===== Products ===== */}
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p, i) => (
              <article
                key={p.id}
                className={`group flex flex-col ${visible ? 'bs-fade-up' : 'opacity-0'}`}
                style={{ animationDelay: `${300 + i * 150}ms` }}
              >
                {/* Image (hover par doosri image) */}
                <Link
                  to="/catalog"
                  aria-label={p.name}
                  className="relative block aspect-square overflow-hidden bg-[#f1ece9]"
                >
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
                </Link>

                {/* Name + description */}
                <h3 className="bs-poppins mt-5 text-xl font-medium text-black sm:text-2xl">
                  {p.name}
                </h3>
                <p className="bs-roboto mt-2 text-base leading-snug text-[#5d5557] sm:text-lg">
                  {p.desc}
                </p>

                {/* SHOP + price bar */}
                <Link
                  to="/catalog"
                  className="bs-poppins relative mt-6 flex items-center justify-between overflow-hidden bg-[#eeeceb] px-5 py-4 text-black sm:px-6 sm:py-5"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 origin-left scale-x-0 bg-black transition-transform duration-500 ease-out group-hover:scale-x-100"
                  />
                  <span className="relative z-10 text-lg font-semibold tracking-wide transition-colors duration-300 group-hover:text-white">
                    SHOP
                  </span>
                  <span className="bs-roboto relative z-10 text-base text-[#5d5557] transition-colors duration-300 group-hover:text-white sm:text-lg">
                    {formatPrice(p.price)}
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default BestSellers