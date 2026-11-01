import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  LuMail,
  LuPhone,
  LuClock,
  LuMapPin,
  LuSearch,
  LuChevronDown,
  LuSend,
  LuCheck,
} from 'react-icons/lu'
import { api } from '../lib/api'

// 👇 Apni details yahan badlein
const cards = [
  {
    icon: LuMail,
    title: 'Email us',
    lines: ['sales@fresioherbals.com'],
    href: 'mailto:sales@fresioherbals.com',
  },
  {
    icon: LuPhone,
    title: 'Call us',
    lines: ['+91-6351897987'],
    href: 'tel:+916351897987',
  },
  {
    icon: LuClock,
    title: 'Customer service',
    lines: ['Mon-Sat, 9am-7pm EST.'],
    href: undefined,
  },
  {
    icon: LuMapPin,
    title: 'Visit us',
    lines: [
      'S.No. 1782, Beside Mango Hotel Mukut nagar, above HDFC Bank Savli main road, Near Manjusar GIDC. Vadodara, Gujarat - 391775',
    ],
    href: undefined,
  },
]

const topics = [
  'Order & delivery',
  'Returns & refunds',
  'Product questions',
  'Payments',
  'Something else',
]

// Section screen par aate hi animation chalane ke liye chhota hook
function useInView<T extends HTMLElement>(threshold = 0.15) {
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

function Contact() {
  const [heroRef, heroVisible] = useInView<HTMLElement>(0.1)
  const [cardsRef, cardsVisible] = useInView<HTMLDivElement>(0.1)
  const [formRef, formVisible] = useInView<HTMLElement>(0.1)

  const [query, setQuery] = useState('')
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState('')

  const q = query.trim().toLowerCase()
  const filtered = cards.filter((c) =>
    q ? `${c.title} ${c.lines.join(' ')}`.toLowerCase().includes(q) : true
  )

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>
    setSendError('')
    try {
      await api.contact(data)
      setSent(true)
      form.reset()
      setTimeout(() => setSent(false), 4000)
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Could not send your message. Please try again.')
    }
  }

  const show = (v: boolean, anim: string) => (v ? anim : 'opacity-0')

  const field =
    'w-full rounded-2xl border border-white/80 bg-white px-5 py-3.5 text-base text-[#072c38] outline-none transition-all duration-300 placeholder:text-[#072c38]/40 focus:border-[#5fbfa8] focus:ring-4 focus:ring-[#5fbfa8]/30 sm:py-4'
  const label = 'mb-2 block text-sm font-bold text-[#072c38]'

  return (
    <>
      {/* ===== Animations (sirf is component ke liye) ===== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

        @keyframes hc-fade-up {
          from { opacity: 0; transform: translateY(35px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hc-fade-left {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes hc-fade-right {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes hc-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(14px, 18px) scale(1.05); }
        }
        @keyframes hc-pop {
          0%   { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .hc-fade-up    { animation: hc-fade-up 0.8s ease-out both; }
        .hc-fade-left  { animation: hc-fade-left 0.9s ease-out both; }
        .hc-fade-right { animation: hc-fade-right 0.9s ease-out both; }
        .hc-float      { animation: hc-float 9s ease-in-out infinite; }
        .hc-float-slow { animation: hc-float 12s ease-in-out infinite reverse; }
        .hc-pop        { animation: hc-pop 0.35s ease-out both; }
        .hc-roboto     { font-family: 'Roboto', sans-serif; }
        .hc-serif      { font-family: Georgia, 'Times New Roman', serif; }

        @media (prefers-reduced-motion: reduce) {
          .hc-fade-up, .hc-fade-left, .hc-fade-right, .hc-pop { animation: none; opacity: 1; }
          .hc-float, .hc-float-slow { animation: none; }
        }
      `}</style>

      <div id="contact" className="hc-roboto">
        {/* ================= HERO ================= */}
        <section
          ref={heroRef}
          className="relative overflow-hidden bg-[#9ea2a2] px-4 pb-32 pt-12 text-center sm:px-8 sm:pb-36 sm:pt-16 lg:pb-40"
        >
          {/* Decorative circles */}
          <div className="relative mx-auto max-w-[930px]">
            <h1
              className={`hc-serif text-4xl text-white sm:text-6xl lg:text-[72px] ${show(heroVisible, 'hc-fade-up')}`}
            >
              Need Help?
            </h1>
            <p
              className={`mt-4 text-base text-white/80 sm:text-xl ${show(heroVisible, 'hc-fade-up')}`}
              style={{ animationDelay: '150ms' }}
            >
              Search our help topics or get in touch. We&apos;re happy to help.
            </p>

            {/* Search */}
            <div
              className={`mt-8 sm:mt-10 ${show(heroVisible, 'hc-fade-up')}`}
              style={{ animationDelay: '300ms' }}
            >
              <label className="flex items-center gap-4 rounded-full bg-white px-6 py-4 shadow-lg transition-shadow duration-300 focus-within:shadow-2xl focus-within:ring-4 focus-within:ring-[#5fbfa8]/40 sm:px-9 sm:py-5">
                <LuSearch className="shrink-0 text-2xl text-[#5d6b70]" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for answers..."
                  aria-label="Search for answers"
                  className="w-full bg-transparent text-base text-[#072c38] outline-none placeholder:text-[#5d6b70] sm:text-lg"
                />
              </label>
            </div>
          </div>
        </section>

        {/* ================= CONTACT CARDS ================= */}
        <div
          ref={cardsRef}
          className="relative -mt-24 px-4 pb-14 sm:-mt-28 sm:px-8 sm:pb-16 lg:-mt-32 lg:px-10"
          style={{ background: 'linear-gradient(to bottom, transparent 50%, #f4f2ed 50%)' }}
        >
          <div className="mx-auto grid max-w-282.5 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map(({ icon: Icon, title, lines, href }, i) => {
              const body = (
                <>
                  <span className="flex h-17 w-17 items-center justify-center rounded-[22px] bg-[#5fbfa8]/20 text-[28px] text-[#5fbfa8] transition-all duration-500 group-hover/card:-rotate-6 group-hover/card:scale-110 group-hover/card:bg-[#5fbfa8] group-hover/card:text-white">
                    <Icon />
                  </span>
                  <h3 className="mt-6 text-lg font-bold text-[#072c38]">{title}</h3>
                  {lines.map((l) => (
                    <p key={l} className="mt-3 text-base leading-[1.75] text-[#3b4a4f] sm:text-lg">
                      {l}
                    </p>
                  ))}
                </>
              )

              const cls =
                'group/card flex h-full min-h-[200px] flex-col rounded-[32px] border border-black/10 bg-[#9ea2a2] p-7 shadow-[0_24px_40px_-24px_rgba(7,44,56,0.35)] transition-all duration-500 hover:-translate-y-2 hover:border-[#5fbfa8] hover:shadow-[0_30px_50px_-22px_rgba(95,191,168,0.6)] sm:min-h-[260px]'

              return (
                <div
                  key={title}
                  className={show(cardsVisible, 'hc-fade-up')}
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  {href ? (
                    <a href={href} className={cls}>
                      {body}
                    </a>
                  ) : (
                    <div className={cls}>{body}</div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Search mein kuch na mile to */}
          {filtered.length === 0 && (
            <p className="hc-pop mx-auto max-w-md rounded-2xl bg-white p-6 text-center text-[#072c38] shadow-md">
              &quot;{query}&quot; ke liye kuch nahi mila.{' '}
              <a href="#help-form" className="font-bold text-[#2f8f78] underline underline-offset-4">
                Humein message bhejein
              </a>
            </p>
          )}
        </div>

        {/* ================= FORM ================= */}
        <section
          ref={formRef}
          id="help-form"
          className="bg-white px-4 py-14 sm:px-8 sm:py-20 lg:px-10"
        >
          <div className="mx-auto grid max-w-[1130px] grid-cols-1 gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
            {/* Left text */}
            <div className={`lg:pt-4 ${show(formVisible, 'hc-fade-left')}`}>
              <h2 className="hc-serif text-4xl text-[#072c38] sm:text-5xl lg:text-[56px]">
                Still need help?
              </h2>
              <p className="mt-6 max-w-[540px] text-base leading-[1.95] text-[#3b4a4f] sm:text-xl">
                Send us a message and our team will get back to you as soon as
                possible. Please include your order number if your question is
                about an order.
              </p>
            </div>

            {/* Form card */}
            <form
              onSubmit={handleSubmit}
              className={`rounded-[32px] bg-[#9ea2a2] p-6 shadow-[0_30px_60px_-30px_rgba(7,44,56,0.45)] sm:rounded-[40px] sm:p-10 ${show(formVisible, 'hc-fade-right')}`}
              style={{ animationDelay: '200ms' }}
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                <div>
                  <label htmlFor="hc-name" className={label}>Name</label>
                  <input id="hc-name" name="name" type="text" required className={field} />
                </div>
                <div>
                  <label htmlFor="hc-email" className={label}>Email</label>
                  <input id="hc-email" name="email" type="email" required className={field} />
                </div>
                <div>
                  <label htmlFor="hc-phone" className={label}>Phone (optional)</label>
                  <input id="hc-phone" name="phone" type="tel" className={field} />
                </div>
                <div>
                  <label htmlFor="hc-order" className={label}>Order number (optional)</label>
                  <input id="hc-order" name="order" type="text" className={field} />
                </div>
              </div>

              <div className="mt-5 sm:mt-6">
                <label htmlFor="hc-topic" className={label}>Topic</label>
                <div className="relative">
                  <select
                    id="hc-topic"
                    name="topic"
                    defaultValue={topics[0]}
                    className={`${field} cursor-pointer appearance-none pr-12`}
                  >
                    {topics.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                  <LuChevronDown className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[#072c38]" />
                </div>
              </div>

              <div className="mt-5 sm:mt-6">
                <label htmlFor="hc-message" className={label}>Message</label>
                <textarea
                  id="hc-message"
                  name="message"
                  required
                  rows={7}
                  className={`${field} resize-y`}
                />
              </div>

              <button
                type="submit"
                className="group/btn mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#072c38] text-lg font-bold text-white
                  transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0b4152] hover:shadow-xl active:scale-[0.98] sm:h-[80px]"
              >
                Send message
                <LuSend className="transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-1" />
              </button>

              {sendError && (
                <p role="alert" className="hc-pop mt-4 text-center font-medium text-[#072c38]">
                  {sendError}
                </p>
              )}

              {sent && (
                <p
                  role="status"
                  className="hc-pop mt-4 flex items-center justify-center gap-2 text-center font-medium text-[#072c38]"
                >
                  <LuCheck className="text-xl" /> Message bhej diya gaya! Hum jaldi reply karenge.
                </p>
              )}
            </form>
          </div>
        </section>
      </div>
    </>
  )
}

export default Contact