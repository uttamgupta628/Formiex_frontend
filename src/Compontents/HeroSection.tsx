import { useCallback, useEffect, useRef, useState } from 'react'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

// 👇 Dono background images ke outside links yahan paste karein
const SLIDES = [
  { img: 'https://res.cloudinary.com/dquki4xol/image/upload/v1793364535/WhatsApp_Image_2026-10-01_at_10.44.45_PM_xie9a0.jpg', alt: 'Hero banner 1' },
  { img: 'https://res.cloudinary.com/dquki4xol/image/upload/v1793364535/WhatsApp_Image_2026-10-01_at_10.57.34_PM_ndqlnf.jpg', alt: 'Hero banner 2' },
]

// 👇 Kitne milliseconds baad slide badle (5000 = 5 second)
const INTERVAL = 3000

function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStart = useRef<number | null>(null)

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), [])
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length),
    []
  )

  // Auto slide (hover par ruk jata hai, current badalne par timer reset hota hai)
  useEffect(() => {
    if (paused) return
    const id = setTimeout(next, INTERVAL)
    return () => clearTimeout(id)
  }, [current, paused, next])

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return
    const dx = e.changedTouches[0].clientX - touchStart.current
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)()
    touchStart.current = null
  }

  return (
    <>
      {/* ===== Animations (sirf is component ke liye) ===== */}
      <style>{`
        @keyframes hs-zoom {
          from { transform: scale(1.15); }
          to   { transform: scale(1); }
        }
        @keyframes hs-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes hs-progress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .hs-zoom     { animation: hs-zoom ${INTERVAL + 1500}ms ease-out both; }
        .hs-fade     { animation: hs-fade 1.2s ease-out both; }
        .hs-progress { animation: hs-progress ${INTERVAL}ms linear both; transform-origin: left; }

        @media (prefers-reduced-motion: reduce) {
          .hs-zoom, .hs-fade, .hs-progress { animation: none; }
        }
      `}</style>

      <section
        id="home"
        className="hs-fade relative isolate h-[260px] w-full overflow-hidden bg-[#9ea2a2] sm:h-[380px] md:h-[460px] lg:h-[560px] xl:h-[620px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-roledescription="carousel"
        aria-label="Hero banner"
      >
        {/* ===== Slides (crossfade) ===== */}
        {SLIDES.map((s, i) => {
          const active = i === current
          return (
            <div
              key={i}
              role="img"
              aria-label={s.alt}
              aria-hidden={!active}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                active ? 'z-10 opacity-100' : 'z-0 opacity-0'
              }`}
            >
              {/* key badalne se zoom animation har baar dobara chalta hai */}
              <div
                key={active ? `on-${current}` : `off-${i}`}
                className={`absolute inset-0 bg-cover bg-[70%_center] bg-no-repeat sm:bg-center ${
                  active ? 'hs-zoom' : ''
                }`}
                style={{ backgroundImage: `url(${s.img})` }}
              />
            </div>
          )
        })}

        {/* ===== Arrows ===== */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-xl text-black shadow-md backdrop-blur
            transition-all duration-300 hover:scale-110 hover:bg-white active:scale-95 sm:left-5 sm:h-12 sm:w-12 sm:text-2xl"
        >
          <LuChevronLeft />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-xl text-black shadow-md backdrop-blur
            transition-all duration-300 hover:scale-110 hover:bg-white active:scale-95 sm:right-5 sm:h-12 sm:w-12 sm:text-2xl"
        >
          <LuChevronRight />
        </button>

        {/* ===== Dots ===== */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:bottom-6">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === current}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                i === current ? 'w-8 bg-white' : 'w-2.5 bg-white/60 hover:bg-white'
              }`}
            />
          ))}
        </div>

        {/* ===== Progress bar (niche patli line) ===== */}
        {!paused && (
          <span
            key={`p-${current}`}
            aria-hidden="true"
            className="hs-progress absolute bottom-0 left-0 z-20 h-1 w-full bg-white/70"
          />
        )}
      </section>
    </>
  )
}

export default HeroSection