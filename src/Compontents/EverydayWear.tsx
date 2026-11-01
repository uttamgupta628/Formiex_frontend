import { useEffect, useRef, useState } from 'react'
import { LuShieldPlus, LuWaves, LuSparkles, LuLeaf } from 'react-icons/lu'

const features = [
  {
    icon: LuShieldPlus,
    title: 'Broad spectrum protection',
    desc: 'SPF 50 PA++++ for everyday sun exposure.',
  },
  {
    icon: LuWaves,
    title: 'Lightweight and non-greasy',
    desc: 'Spreads easily and feels comfortable all day.',
  },
  {
    icon: LuSparkles,
    title: 'No white cast',
    desc: 'Blends in without a chalky finish.',
  },
  {
    icon: LuLeaf,
    title: 'Gentle, fragrance free, vegan',
    desc: 'Dermatologically recommended and cruelty free.',
  },
]

function EverydayWear() {
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

  return (
    <>
      {/* ===== Animations (sirf is component ke liye) ===== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&family=Roboto:wght@400&display=swap');

        @keyframes ew-fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ew-fade-up  { animation: ew-fade-up 0.8s ease-out both; }
        .ew-poppins  { font-family: 'Poppins', sans-serif; }
        .ew-roboto   { font-family: 'Roboto', sans-serif; }

        @media (prefers-reduced-motion: reduce) {
          .ew-fade-up { animation: none; opacity: 1; }
        }
      `}</style>

      <section ref={ref} className="bg-[#fcf6f5] py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-[72px]">
          {/* ===== Heading ===== */}
          <h2
            className={`ew-poppins text-center text-3xl font-medium text-[#2a1f21] sm:text-4xl lg:text-[44px] ${
              visible ? 'ew-fade-up' : 'opacity-0'
            }`}
          >
            Made for everyday wear
          </h2>

          {/* ===== Features ===== */}
          <div className="mt-10 grid grid-cols-1 gap-10 sm:mt-14 sm:grid-cols-2 sm:gap-x-8 lg:mt-20 lg:grid-cols-4 lg:gap-x-12">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className={`group text-center ${visible ? 'ew-fade-up' : 'opacity-0'}`}
                style={{ animationDelay: `${200 + i * 150}ms` }}
              >
                {/* Top line (pink chhoti, hover par poori) */}
                <div className="relative h-0.5 w-full bg-[#dcd6d6]">
                  <span className="absolute left-0 top-0 h-full w-[22%] bg-[#c4677b] transition-all duration-500 group-hover:w-full" />
                </div>

                {/* Icon circle */}
                <div className="mx-auto mt-12 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[#f3e3e6] text-[#c4677b] transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-105 group-hover:bg-[#c4677b] group-hover:text-white sm:h-[100px] sm:w-[100px] lg:h-[114px] lg:w-[114px]">
                  <Icon className="text-[34px] transition-transform duration-500 group-hover:rotate-[360deg] sm:text-[40px]" />
                </div>

                {/* Title */}
                <h3 className="ew-poppins mx-auto mt-8 max-w-[300px] text-xl font-medium leading-snug text-[#2a1f21] sm:text-[22px]">
                  {title}
                </h3>

                {/* Description */}
                <p className="ew-roboto mx-auto mt-3 max-w-[300px] text-base leading-[1.9] text-[#5d5557]">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default EverydayWear