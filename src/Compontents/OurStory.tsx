import { useEffect, useRef, useState } from 'react'

// 👇 Image ka outside link yahan paste karein
const STORY_IMG_URL = 'https://res.cloudinary.com/dquki4xol/image/upload/v1793354335/WhatsApp_Image_2026-10-05_at_1.32.55_PM_rommd6.jpg'

// 👇 Apna content yahan badlein
const LABEL = 'OUR STORY'
const HEADING = 'Who Are We?'
const PARAGRAPHS = [
  "Fresio Herbals started with a single question: what if we took the wisdom of traditional herbs and turned it into everyday products you'd be proud to share with the people you love?",
  'Everything we make continues this philosophy: simple, honest essentials that are easy to use and deliver the results to back them up.',
  "We're grateful you share our love for herbal care, and we hope you'll join us on this journey, every step of the way.",
]
const SIGNATURE = 'The Fresio Herbals Team'

function OurStory() {
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
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

        @keyframes os-fade-left {
          from { opacity: 0; transform: translateX(-50px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes os-fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes os-line {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes os-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        .os-fade-left { animation: os-fade-left 0.9s ease-out both; }
        .os-fade-up   { animation: os-fade-up 0.8s ease-out both; }
        .os-line      { animation: os-line 0.8s ease-out both; transform-origin: left; }
        .os-float     { animation: os-float 6s ease-in-out 1.2s infinite; }
        .os-roboto    { font-family: 'Roboto', sans-serif; }
        .os-serif     { font-family: Georgia, 'Times New Roman', serif; }

        @media (prefers-reduced-motion: reduce) {
          .os-fade-left, .os-fade-up, .os-line { animation: none; opacity: 1; }
          .os-float { animation: none; }
        }
      `}</style>

      <section
        ref={ref}
        id="our-story"
        className="os-roboto overflow-hidden bg-[#f6f5f0] px-4 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20"
      >
        <div className="mx-auto grid max-w-[1130px] grid-cols-1 items-center gap-10 md:grid-cols-[0.9fr_1fr] md:gap-12 lg:gap-16">
          {/* ===== Image ===== */}
          <div className={show('os-fade-left')}>
            <div className="os-float mx-auto w-full max-w-[460px] md:max-w-none">
              <div className="group overflow-hidden rounded-[28px] shadow-[0_30px_50px_-20px_rgba(7,44,56,0.35)]">
                <img
                  src={STORY_IMG_URL}
                  alt="Our story"
                  loading="lazy"
                  className="aspect-[428/535] w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* ===== Text ===== */}
          <div>
            {/* Label */}
            <div
              className={`flex items-center gap-3 ${show('os-fade-up')}`}
              style={{ animationDelay: '250ms' }}
            >
              <span
                className={`h-0.5 w-8 bg-[#5fbfa8] ${show('os-line')}`}
                style={{ animationDelay: '450ms' }}
              />
              <span className="text-sm font-bold tracking-[0.2em] text-[#5fbfa8] sm:text-base">
                {LABEL}
              </span>
            </div>

            {/* Heading */}
            <h2
              className={`os-serif mt-4 text-4xl text-[#072c38] sm:text-5xl lg:text-[58px] lg:leading-[1.1] ${show('os-fade-up')}`}
              style={{ animationDelay: '400ms' }}
            >
              {HEADING}
            </h2>

            {/* Paragraphs */}
            <div className="mt-6 space-y-4 sm:mt-8">
              {PARAGRAPHS.map((p, i) => (
                <p
                  key={i}
                  className={`text-[15px] leading-[1.85] text-[#3b4a4f] sm:text-base ${show('os-fade-up')}`}
                  style={{ animationDelay: `${600 + i * 180}ms` }}
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Signature */}
            <p
              className={`os-serif mt-6 text-lg italic text-[#072c38] sm:text-xl ${show('os-fade-up')}`}
              style={{ animationDelay: `${600 + PARAGRAPHS.length * 180}ms` }}
            >
              {SIGNATURE}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default OurStory