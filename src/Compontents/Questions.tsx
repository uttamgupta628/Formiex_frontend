import { useEffect, useRef, useState } from 'react'
import { LuPlus, LuMinus } from 'react-icons/lu'

// 👇 Apne sawal-jawab yahan badlein
const faqs = [
  {
    q: 'Does it leave a white cast?',
    a: 'No. Silk Flow is made to leave no white cast.',
  },
  {
    q: 'Which skin types is it for?',
    a: 'All skin types.',
  },
  {
    q: 'How much should I apply?',
    a: 'Apply generously on cleansed face and neck 15 minutes before sun exposure. Reapply every 2 to 3 hours.',
  },
  {
    q: 'Should I patch test first?',
    a: 'Yes. A patch test is recommended before first use. Stop using it if irritation occurs.',
  },
  {
    q: 'How should I store it?',
    a: 'Store below 25°C. Do not freeze. Keep away from direct sunlight.',
  },
  {
    q: 'Why can the color change over time?',
    a: 'Formulations that contain plant extracts tend to change color over time.The products efficacy remains unchanged. ',
  },


]

function Questions() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  // Ek se zyada card ek saath khule reh sakte hain (screenshot jaisa). Shuru mein pehle 2 khule.
  const [openIds, setOpenIds] = useState<number[]>([0, 1])

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

  const toggle = (i: number) =>
    setOpenIds((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    )

  return (
    <>
      {/* ===== Animations (sirf is component ke liye) ===== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&family=Roboto:wght@400;500&display=swap');

        @keyframes qs-fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .qs-fade-up { animation: qs-fade-up 0.7s ease-out both; }
        .qs-poppins { font-family: 'Poppins', sans-serif; }
        .qs-roboto  { font-family: 'Roboto', sans-serif; }

        @media (prefers-reduced-motion: reduce) {
          .qs-fade-up { animation: none; opacity: 1; }
        }
      `}</style>

      <section
        ref={ref}
        id="faq"
        className="bg-[#fcf6f5] px-4 py-12 sm:px-6 sm:py-16 lg:py-20"
      >
        {/* ===== Heading ===== */}
        <h2
          className={`qs-poppins text-center text-4xl font-normal text-[#1c1718] sm:text-5xl lg:text-[64px] ${
            visible ? 'qs-fade-up' : 'opacity-0'
          }`}
        >
          Questions
        </h2>

        {/* ===== Accordion ===== */}
        <div className="mx-auto mt-10 flex max-w-215 flex-col gap-4 sm:mt-14">
          {faqs.map((item, i) => {
            const isOpen = openIds.includes(i)
            return (
              <div
                key={item.q}
                className={`relative overflow-hidden rounded-xl border bg-white transition-all duration-500 ${
                  isOpen
                    ? 'border-[#ecd3d8] shadow-[0_14px_30px_-10px_rgba(184,107,119,0.35)]'
                    : 'border-[#eee6e6] shadow-sm hover:-translate-y-0.5 hover:border-[#ecd3d8] hover:shadow-md'
                } ${visible ? 'qs-fade-up' : 'opacity-0'}`}
                style={{ animationDelay: `${200 + i * 120}ms` }}
              >
                {/* Left pink bar (sirf open card par) */}
                <span
                  className={`absolute bottom-5 left-0 top-5 w-1 origin-center rounded-full bg-[#b86b77] transition-all duration-500 ${
                    isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
                  }`}
                />

                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-btn-${i}`}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-9 sm:py-6"
                >
                  <span className="qs-roboto text-base font-medium text-[#1c1718] sm:text-[20px]">
                    {item.q}
                  </span>

                  {/* Gol button */}
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl transition-all duration-300 sm:h-[54px] sm:w-[54px] sm:text-2xl ${
                      isOpen
                        ? 'rotate-180 bg-[#b86b77] text-white'
                        : 'rotate-0 bg-[#f3e3e6] text-[#b86b77] hover:bg-[#b86b77] hover:text-white'
                    }`}
                  >
                    {isOpen ? <LuMinus /> : <LuPlus />}
                  </span>
                </button>

                {/* Answer (smooth height animation) */}
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p
                      className={`qs-roboto px-5 pb-6 text-[15px] leading-relaxed text-[#4a4244] transition-all duration-500 sm:px-9 sm:pb-8 sm:text-[18px] ${
                        isOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
                      }`}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}

export default Questions