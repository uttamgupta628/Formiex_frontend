import { useEffect, useRef, useState } from 'react'

// 👇 Product image ka outside link yahan paste karein
const PRODUCT_IMG_URL = 'https://res.cloudinary.com/dquki4xol/image/upload/v1793347518/WhatsApp_Image_2026-10-05_at_1.51.43_PM_x42g5v.jpg'

// 👇 Apna content yahan badlein
const LABEL = 'SPF 50 PA++++'
const PARAGRAPHS = [
  'A lightweight daily sunscreen for face and neck. It absorbs without a white cast and suits all skin types.',
  'Choose a product for this section in the theme editor.',
]

function ProductFeature() {
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
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const show = (anim: string) => (visible ? anim : 'opacity-0')

  return (
    <>
      {/* ===== Animations (sirf is component ke liye) ===== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&family=Poppins:wght@400;500&display=swap');

        @keyframes pf-fade-left {
          from { opacity: 0; transform: translateX(-50px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pf-fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pf-line-grow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes pf-frame {
          from { opacity: 0; transform: translate(-16px, 16px); }
          to   { opacity: 1; transform: translate(0, 0); }
        }
        .pf-fade-left { animation: pf-fade-left 0.9s ease-out both; }
        .pf-fade-up   { animation: pf-fade-up 0.8s ease-out both; }
        .pf-line      { animation: pf-line-grow 0.8s ease-out both; transform-origin: left; }
        .pf-frame     { animation: pf-frame 1s ease-out both; }
        .pf-roboto    { font-family: 'Roboto', sans-serif; }
        .pf-poppins   { font-family: 'Poppins', sans-serif; }

        @media (prefers-reduced-motion: reduce) {
          .pf-fade-left, .pf-fade-up, .pf-line, .pf-frame { animation: none; opacity: 1; }
        }
      `}</style>

      <section
        ref={ref}
        id="product"
        className="overflow-hidden bg-[#fcf6f5] py-10 sm:py-14 lg:py-16"
      >
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-10 px-4 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-[76px]">
          {/* ===== Image ===== */}
          <div className={`relative mx-auto w-full max-w-140 lg:mx-0 lg:max-w-195 ${show('pf-fade-left')}`}>
            {/* Offset line frame (peeche, right + top) */}
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute -right-4 top-6 hidden h-full w-full border-r border-t border-[#2a1f21]/40 sm:block lg:-right-7 lg:top-7 ${show('pf-frame')}`}
              style={{ animationDelay: '500ms' }}
            />

            <div className="group relative overflow-hidden shadow-[0_20px_50px_-20px_rgba(60,40,45,0.35)]">
              <img
                src={PRODUCT_IMG_URL}
                alt="Product"
                loading="lazy"
                className="aspect-4/5 w-full object-cover transition-transform duration-1200 ease-out group-hover:scale-105 lg:aspect-[780/740]"
              />
            </div>
          </div>

          {/* ===== Text ===== */}
          <div className="mx-auto w-full max-w-[600px] lg:mx-0 lg:pl-8">
            {/* Label with line */}
            <div className={`flex items-center gap-5 ${show('pf-fade-up')}`} style={{ animationDelay: '300ms' }}>
              <span
                className={`h-0.5 w-14 bg-[#b86b77] sm:w-[60px] ${show('pf-line')}`}
                style={{ animationDelay: '500ms' }}
              />
              <span className="pf-poppins text-lg font-medium tracking-wide text-[#b86b77] sm:text-[22px]">
                {LABEL}
              </span>
            </div>

            {/* Paragraphs */}
            <div className="pf-roboto mt-7 space-y-6 sm:mt-9">
              {PARAGRAPHS.map((p, i) => (
                <p
                  key={i}
                  className={`text-base leading-[1.9] text-[#1c1718] sm:text-lg lg:text-[21px] lg:leading-[2.05] ${show('pf-fade-up')}`}
                  style={{ animationDelay: `${550 + i * 200}ms` }}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ProductFeature