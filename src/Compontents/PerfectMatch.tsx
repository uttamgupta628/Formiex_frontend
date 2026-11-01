import { useCallback, useEffect, useRef, useState } from 'react'
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu'

// 👇 Har card ki image ka outside link aur naam yahan badlein
const items = [
  { name: 'Centella', img:'https://res.cloudinary.com/dquki4xol/image/upload/v1793354335/WhatsApp_Image_2026-10-05_at_1.32.55_PM_rommd6.jpg', href: '#shop' },
  { name: 'Centella', img:'https://res.cloudinary.com/dquki4xol/image/upload/v1793357904/WhatsApp_Image_2026-10-05_at_1.35.45_PM_basrbm.jpg', href: '#shop' },
  { name: 'Centella', img:'https://res.cloudinary.com/dquki4xol/image/upload/v1793354092/WhatsApp_Image_2026-10-05_at_1.54.19_PM_e3hqk5.jpg', href: '#shop' },
  { name: 'Niacinamide', img: 'https://res.cloudinary.com/dquki4xol/image/upload/v1793354335/WhatsApp_Image_2026-10-05_at_1.32.55_PM_rommd6.jpg', href: '#shop' },
  { name: 'Hyaluronic Acid', img: 'https://res.cloudinary.com/dquki4xol/image/upload/v1793354092/WhatsApp_Image_2026-10-05_at_1.54.19_PM_e3hqk5.jpg', href: '#shop' },
  { name: 'Green Tea', img: 'https://res.cloudinary.com/dquki4xol/image/upload/v1793354340/WhatsApp_Image_2026-10-05_at_1.36.52_PM_j4cygw.jpg', href: '#shop' },
  { name: 'Rice', img: 'https://res.cloudinary.com/dquki4xol/image/upload/v1793347518/WhatsApp_Image_2026-10-05_at_1.51.43_PM_x42g5v.jpg', href: '#shop' },
]

function PerfectMatch() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  // Drag-to-scroll ke liye
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false })

  // Section screen par aate hi animation start hoga
  useEffect(() => {
    const el = sectionRef.current
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

  const updateEdges = useCallback(() => {
    const t = trackRef.current
    if (!t) return
    setAtStart(t.scrollLeft <= 4)
    setAtEnd(t.scrollLeft + t.clientWidth >= t.scrollWidth - 4)
  }, [])

  useEffect(() => {
    updateEdges()
    window.addEventListener('resize', updateEdges)
    return () => window.removeEventListener('resize', updateEdges)
  }, [updateEdges])

  // Ek card ki width + gap ke hisaab se slide
  const slide = (dir: 1 | -1) => {
    const t = trackRef.current
    if (!t) return
    const card = t.querySelector<HTMLElement>('[data-card]')
    const step = card ? card.offsetWidth + 21 : t.clientWidth * 0.8

    // End par aakar aage dabane par wapas shuru par jao (loop)
    if (dir === 1 && atEnd) {
      t.scrollTo({ left: 0, behavior: 'smooth' })
      return
    }
    if (dir === -1 && atStart) {
      t.scrollTo({ left: t.scrollWidth, behavior: 'smooth' })
      return
    }
    t.scrollBy({ left: step * dir, behavior: 'smooth' })
  }

  // Mouse drag
  const onMouseDown = (e: React.MouseEvent) => {
    const t = trackRef.current
    if (!t) return
    drag.current = { active: true, startX: e.pageX, scrollLeft: t.scrollLeft, moved: false }
    t.classList.add('pm-dragging')
  }
  const onMouseMove = (e: React.MouseEvent) => {
    const t = trackRef.current
    if (!t || !drag.current.active) return
    const dx = e.pageX - drag.current.startX
    if (Math.abs(dx) > 5) drag.current.moved = true
    t.scrollLeft = drag.current.scrollLeft - dx
  }
  const endDrag = () => {
    drag.current.active = false
    trackRef.current?.classList.remove('pm-dragging')
  }
  // Drag ke baad galti se link na khul jaye
  const onCardClick = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault()
      drag.current.moved = false
    }
  }

  return (
    <>
      {/* ===== Animations (sirf is component ke liye) ===== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&display=swap');

        @keyframes pm-fade-up {
          from { opacity: 0; transform: translateY(35px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pm-slide-in {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .pm-fade-up  { animation: pm-fade-up 0.8s ease-out both; }
        .pm-slide-in { animation: pm-slide-in 0.8s ease-out both; }
        .pm-serif    { font-family: 'Playfair Display', Georgia, serif; }

        /* Scrollbar chhupao */
        .pm-track { scrollbar-width: none; -ms-overflow-style: none; scroll-snap-type: x mandatory; cursor: grab; }
        .pm-track::-webkit-scrollbar { display: none; }
        .pm-track.pm-dragging { cursor: grabbing; scroll-snap-type: none; scroll-behavior: auto; }
        .pm-card { scroll-snap-align: start; }

        @media (prefers-reduced-motion: reduce) {
          .pm-fade-up, .pm-slide-in { animation: none; opacity: 1; }
        }
      `}</style>

      <section
        ref={sectionRef}
        id="perfect-match"
        className="overflow-hidden bg-[#fdfcfb] py-10 sm:py-14 lg:py-16"
      >
        {/* ===== Heading ===== */}
        <h2
          className={`pm-serif px-4 text-center text-3xl text-[#1c1718] sm:text-4xl lg:text-[44px] ${
            visible ? 'pm-fade-up' : 'opacity-0'
          }`}
        >
          Find Your Perfect Match
        </h2>

        {/* ===== Carousel ===== */}
        <div className="relative mt-8 sm:mt-12 lg:mt-14">
          <div
            ref={trackRef}
            onScroll={updateEdges}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            className={`pm-track flex gap-[21px] overflow-x-auto scroll-smooth ${
              visible ? 'pm-slide-in' : 'opacity-0'
            }`}
            style={{ animationDelay: '250ms' }}
          >
            {items.map((item) => (
              <a
                key={item.name}
                data-card
                href={item.href}
                onClick={onCardClick}
                draggable={false}
                className="pm-card group relative block aspect-[357/536] w-[72vw] shrink-0 overflow-hidden bg-[#ece5df] sm:w-[44vw] md:w-[32vw] lg:w-[calc((100vw-84px)/5)] lg:max-w-[378px]"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  loading="lazy"
                  draggable={false}
                  className="h-full w-full select-none object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />
                {/* Halka dark layer sirf hover par, taaki text saaf dikhe */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/25"
                />
                <span className="pm-serif absolute inset-x-0 top-1/2 -translate-y-1/2 px-3 text-center text-2xl text-white transition-transform duration-500 group-hover:-translate-y-[60%] sm:text-[32px]">
                  {item.name}
                </span>
              </a>
            ))}
          </div>

          {/* ===== Arrows ===== */}
          <button
            type="button"
            onClick={() => slide(-1)}
            aria-label="Previous"
            className={`absolute left-0 top-1/2 flex h-[60px] w-[56px] -translate-y-1/2 items-center justify-center bg-white/95 text-2xl text-black shadow-md
              transition-all duration-300 hover:bg-black hover:text-white active:scale-95 sm:h-[76px] sm:w-[57px] ${
                visible ? 'pm-fade-up' : 'opacity-0'
              }`}
            style={{ animationDelay: '600ms' }}
          >
            <LuArrowLeft />
          </button>
          <button
            type="button"
            onClick={() => slide(1)}
            aria-label="Next"
            className={`absolute right-0 top-1/2 flex h-[60px] w-[56px] -translate-y-1/2 items-center justify-center bg-white/95 text-2xl text-black shadow-md
              transition-all duration-300 hover:bg-black hover:text-white active:scale-95 sm:h-[76px] sm:w-[57px] ${
                visible ? 'pm-fade-up' : 'opacity-0'
              }`}
            style={{ animationDelay: '600ms' }}
          >
            <LuArrowRight />
          </button>
        </div>
      </section>
    </>
  )
}

export default PerfectMatch