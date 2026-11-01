import { useEffect, useRef, useState } from 'react'

// 👇 Logo ka outside link (khali '' rakhne par "FORMIEX" text logo dikhega)
const LOGO_URL = ''
const BRAND_NAME = 'FORMIEX'

// 👇 Apna content yahan badlein
const MISSION_TITLE = 'Our Mission'
const MISSION_PARAGRAPHS = [
  'We create herbal products that fit naturally into your routine, are gentle on you, and are always effective.',
  'We believe healthy habits blended with traditional self-care rituals can enrich your daily life.',
]
const CTA_TITLE = 'Ready to try Fresio Herbals?'
const CTA_SUB = 'Explore our range of herbal essentials.'

// Section screen par aate hi animation chalane ke liye chhota hook
function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)
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
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, visible] as const
}

function Mission() {
  const [topRef, topVisible] = useInView<HTMLElement>(0.2)
  const [ctaRef, ctaVisible] = useInView<HTMLElement>(0.3)
  const [logoFailed, setLogoFailed] = useState(false)

  const show = (v: boolean, anim: string) => (v ? anim : 'opacity-0')
  const showImageLogo = LOGO_URL && !logoFailed

  return (
    <>
      {/* ===== Animations (sirf is component ke liye) ===== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');

        @keyframes ms-fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ms-zoom-in {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes ms-line {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .ms-fade-up { animation: ms-fade-up 0.8s ease-out both; }
        .ms-zoom-in { animation: ms-zoom-in 0.9s ease-out both; }
        .ms-line    { animation: ms-line 0.8s ease-out both; transform-origin: center; }
        .ms-roboto  { font-family: 'Roboto', sans-serif; }
        .ms-serif   { font-family: Georgia, 'Times New Roman', serif; }

        @media (prefers-reduced-motion: reduce) {
          .ms-fade-up, .ms-zoom-in, .ms-line { animation: none; opacity: 1; }
        }
      `}</style>

      <div className="ms-roboto">
        {/* ================= MISSION (white) ================= */}
        <section
          ref={topRef}
          id="mission"
          className="bg-white px-4 py-12 text-center sm:px-8 sm:py-16 lg:py-20"
        >
          <div className="mx-auto max-w-[760px]">
            {/* Logo */}
            <div className={show(topVisible, 'ms-zoom-in')}>
              {showImageLogo ? (
                <img
                  src={LOGO_URL}
                  alt={BRAND_NAME}
                  onError={() => setLogoFailed(true)}
                  className="mx-auto h-9 w-auto max-w-[260px] object-contain sm:h-11 lg:h-12"
                />
              ) : (
                <span className="inline-block text-3xl font-semibold tracking-[0.18em] text-black sm:text-4xl lg:text-[44px]">
                  {BRAND_NAME}
                </span>
              )}
            </div>

            {/* Heading */}
            <h2
              className={`ms-serif mt-8 text-3xl text-[#072c38] sm:mt-10 sm:text-4xl lg:text-[40px] ${show(topVisible, 'ms-fade-up')}`}
              style={{ animationDelay: '250ms' }}
            >
              {MISSION_TITLE}
            </h2>

            {/* Chhoti line heading ke neeche */}
            <span
              aria-hidden="true"
              className={`mx-auto mt-4 block h-0.5 w-14 bg-[#5fbfa8] ${show(topVisible, 'ms-line')}`}
              style={{ animationDelay: '500ms' }}
            />

            {/* Paragraphs */}
            <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
              {MISSION_PARAGRAPHS.map((p, i) => (
                <p
                  key={i}
                  className={`text-sm leading-[1.9] text-[#3b4a4f] sm:text-[15px] ${show(topVisible, 'ms-fade-up')}`}
                  style={{ animationDelay: `${600 + i * 200}ms` }}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* ================= CTA (grey) ================= */}
        <section
          ref={ctaRef}
          id="cta"
          className="relative isolate mb-10 overflow-hidden bg-[#9ea2a2] px-4 py-14 text-center sm:px-8 sm:py-20 lg:py-24"
        >
          <div className="mx-auto max-w-[760px]">
            <h2
              className={`ms-serif text-3xl text-white sm:text-4xl lg:text-[44px] ${show(ctaVisible, 'ms-fade-up')}`}
            >
              {CTA_TITLE}
            </h2>
            <p
              className={`mt-4 text-sm text-white/75 sm:text-base ${show(ctaVisible, 'ms-fade-up')}`}
              style={{ animationDelay: '200ms' }}
            >
              {CTA_SUB}
            </p>
          </div>
        </section>
      </div>
    </>
  )
}

export default Mission