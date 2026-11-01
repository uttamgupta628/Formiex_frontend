import { useEffect, useRef, useState } from 'react'

// 👇 Apne steps yahan badlein
const steps = [
  {
    title: 'Cleanse',
    desc: 'Start with a cleansed face and neck.',
  },
  {
    title: 'Apply generously',
    desc: 'Apply 15 minutes before sun exposure.',
  },
  {
    title: 'Reapply',
    desc: 'Reapply every 2 to 3 hours. Use daily for best protection.',
  },
]

function HowToUse() {
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
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&family=Roboto:wght@400;500;700&display=swap');

        @keyframes hu-fade-up {
          from { opacity: 0; transform: translateY(35px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hu-pop {
          0%   { opacity: 0; transform: scale(0.3); }
          70%  { transform: scale(1.12); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes hu-line {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes hu-ring {
          0%   { box-shadow: 0 0 0 0 rgba(184,107,119,0.55); }
          100% { box-shadow: 0 0 0 16px rgba(184,107,119,0); }
        }
        .hu-fade-up { animation: hu-fade-up 0.8s ease-out both; }
        .hu-pop     { animation: hu-pop 0.6s cubic-bezier(.34,1.56,.64,1) both; }
        .hu-line    { animation: hu-line 0.9s ease-out both; transform-origin: left; }
        .hu-poppins { font-family: 'Poppins', sans-serif; }
        .hu-roboto  { font-family: 'Roboto', sans-serif; }

        /* Hover par circle ke charo taraf ring phailti hai */
        .hu-step:hover .hu-circle { animation: hu-ring 0.8s ease-out; }

        @media (prefers-reduced-motion: reduce) {
          .hu-fade-up, .hu-pop, .hu-line { animation: none; opacity: 1; }
          .hu-step:hover .hu-circle { animation: none; }
        }
      `}</style>

      <section
        ref={ref}
        id="how-to-use"
        className="bg-[#9ea2a2] px-4 py-12 sm:px-8 sm:py-16 lg:px-[72px] lg:py-20"
      >
        <div className="mx-auto max-w-[1600px]">
          {/* ===== Heading ===== */}
          <h2
            className={`hu-poppins text-center text-4xl font-normal text-[#1c1718] sm:text-5xl lg:text-[64px] ${
              visible ? 'hu-fade-up' : 'opacity-0'
            }`}
          >
            How to use
          </h2>

          {/* ===== Steps ===== */}
          <div className="mx-auto mt-10 grid max-w-md grid-cols-1 gap-10 sm:mt-14 lg:mt-16 lg:max-w-none lg:grid-cols-3 lg:gap-8">
            {steps.map((step, i) => (
              <div key={step.title} className="hu-step group relative flex flex-col items-center">
                {/* Line jo agle circle tak jati hai (sirf desktop) */}
                {i < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={`absolute left-1/2 top-9 hidden h-0.5 w-[calc(100%+2rem)] bg-[#c4677b] lg:block ${
                      visible ? 'hu-line' : 'opacity-0'
                    }`}
                    style={{ animationDelay: `${500 + i * 500}ms` }}
                  />
                )}

                {/* Number circle */}
                <span
                  className={`hu-circle hu-roboto relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#b86b77] text-3xl font-bold text-white shadow-[0_10px_25px_-8px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-110 ${
                    visible ? 'hu-pop' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${300 + i * 500}ms` }}
                >
                  {i + 1}
                </span>

                {/* Card */}
                <div
                  className={`mt-8 flex min-h-47.5 w-full flex-col items-center rounded-lg bg-white px-6 py-9 text-center shadow-[0_20px_40px_-20px_rgba(0,0,0,0.35)]
                    transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_28px_50px_-18px_rgba(184,107,119,0.6)] sm:px-8 lg:min-h-57 ${
                      visible ? 'hu-fade-up' : 'opacity-0'
                    }`}
                  style={{ animationDelay: `${450 + i * 500}ms` }}
                >
                  <h3 className="hu-poppins text-xl font-medium text-[#1c1718] transition-colors duration-300 group-hover:text-[#b86b77] sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="hu-roboto mt-4 text-base leading-[1.9] text-[#6b6366] sm:text-lg">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default HowToUse