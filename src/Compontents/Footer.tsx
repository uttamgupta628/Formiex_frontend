import { useEffect, useRef, useState, type FormEvent } from 'react'
import { api } from '../lib/api'
import {
  LuMessageSquareMore,
  LuPhone,
  LuNavigation,
  LuMapPin,
  LuBadgeCheck,
  LuArrowRight,
} from 'react-icons/lu'

// 👇 Apni details yahan badlein
const BRAND = 'beauty'
const MSME_TEXT =
  'Registered under the Micro, Small and Medium Enterprises Development (MSMED) Act, 2006 - Section 15 | Udyam Registration No.: UDYAM-UP-29-0204490'

const info = [
  {
    icon: LuMessageSquareMore,
    title: 'Customer Service',
    lines: ['Mon-Sat, 9am-7pm EST.'],
  },
  {
    icon: LuPhone,
    title: 'Call Us',
    lines: ['+91-9319742875'],
    href: 'tel:+919319742875',
  },
  {
    icon: LuNavigation,
    title: 'Get in Touch',
    lines: ['dhee30041992@gmail.com'],
    href: 'mailto:dhee30041992@gmail.com',
  },
  {
    icon: LuMapPin,
    title: 'Address',
    lines: ['Apsara Complex, Block 1,', 'Ghaziabad, pin code - 201005'],
  },
]

function Footer() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Footer screen par aate hi animation start hoga
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

  const anim = (i: number) => ({
    className: visible ? 'ft-fade-up' : 'opacity-0',
    style: { animationDelay: `${i * 120}ms` },
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    try {
      await api.subscribe(email.trim())
      setStatus('success')
      setEmail('')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not subscribe, please try again.')
      setStatus('error')
    }
    setTimeout(() => setStatus('idle'), 3500)
  }

  return (
    <>
      {/* ===== Animations (sirf is component ke liye) ===== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

        @keyframes ft-fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ft-line {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes ft-pop {
          0%   { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .ft-fade-up { animation: ft-fade-up 0.7s ease-out both; }
        .ft-line    { animation: ft-line 1s ease-out both; transform-origin: left; }
        .ft-pop     { animation: ft-pop 0.3s ease-out both; }
        .ft-roboto  { font-family: 'Roboto', sans-serif; }
        .ft-serif   { font-family: Georgia, 'Times New Roman', serif; }

        @media (prefers-reduced-motion: reduce) {
          .ft-fade-up, .ft-line, .ft-pop { animation: none; opacity: 1; }
        }
      `}</style>

      <footer ref={ref} id="contact" className="ft-roboto bg-[#9ea2a2] text-white">
        <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-8 lg:px-10 lg:pt-16">
          {/* ===== Info cards ===== */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {info.map(({ icon: Icon, title, lines, href }, i) => {
              const body = (
                <>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 text-[#1b1b1b] transition-all duration-300 group-hover/item:-translate-y-1 group-hover/item:bg-white group-hover/item:shadow-lg">
                    <Icon className="text-[24px]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-lg font-bold leading-tight">{title}</p>
                    <div className="mt-1.5 space-y-0.5 text-[15px] font-medium leading-relaxed text-white/90">
                      {lines.map((l) => (
                        <p key={l} className="break-words">
                          {l}
                        </p>
                      ))}
                    </div>
                  </div>
                </>
              )

              return (
                <div key={title} className={anim(i).className} style={anim(i).style}>
                  {href ? (
                    <a href={href} className="group/item flex items-start gap-4">
                      {body}
                    </a>
                  ) : (
                    <div className="group/item flex items-start gap-4">{body}</div>
                  )}
                </div>
              )
            })}
          </div>

          {/* ===== MSME registration box ===== */}
          <div
            className={`mt-10 flex items-start gap-3 rounded-2xl bg-white/10 p-4 sm:items-center sm:p-5 ${anim(4).className}`}
            style={anim(4).style}
          >
            <LuBadgeCheck className="mt-0.5 shrink-0 text-2xl text-[#1b1b1b] sm:mt-0" />
            <p className="text-sm font-medium leading-relaxed text-white/90 sm:text-[15px]">
              {MSME_TEXT}
            </p>
          </div>

          {/* ===== Divider ===== */}
          <div
            className={`mt-10 h-px bg-white/25 ${visible ? 'ft-line' : 'opacity-0'}`}
            style={{ animationDelay: '600ms' }}
          />

          {/* ===== Newsletter ===== */}
          <div
            className={`grid grid-cols-1 items-center gap-6 py-10 lg:grid-cols-[1fr_1.4fr] lg:gap-12 ${anim(6).className}`}
            style={anim(6).style}
          >
            <div>
              <h2 className="ft-serif text-3xl font-bold sm:text-4xl">
                Join Our Newsletter
              </h2>
              <p className="mt-2 text-[15px] font-medium text-white/85">
                Get skincare tips, new launches and special offers in your inbox.
              </p>
            </div>

            <div>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  aria-label="Email address"
                  className="h-14 w-full rounded-full bg-white/20 px-6 text-base font-medium text-white placeholder-white/75 outline-none
                    transition-all duration-300 focus:bg-white/30 focus:ring-2 focus:ring-white/70 sm:flex-1"
                />
                <button
                  type="submit"
                  className="group/btn inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-8 text-base font-bold text-[#0c1f2b]
                    transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0c1f2b] hover:text-white hover:shadow-xl active:scale-95"
                >
                  Sign Up
                  <LuArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                </button>
              </form>

              {status === 'success' && (
                <p className="ft-pop mt-3 pl-2 text-sm font-medium" role="status">
                  Thank you for subscribing! 🎉
                </p>
              )}
              {status === 'error' && (
                <p className="ft-pop mt-3 pl-2 text-sm font-medium" role="alert">
                  {errorMsg}
                </p>
              )}
            </div>
          </div>

          {/* ===== Divider ===== */}
          <div
            className={`h-px bg-white/25 ${visible ? 'ft-line' : 'opacity-0'}`}
            style={{ animationDelay: '900ms' }}
          />

          {/* ===== Bottom bar ===== */}
          <div
            className={`flex flex-col items-center justify-between gap-2 py-6 text-sm font-medium sm:flex-row sm:text-base ${anim(8).className}`}
            style={anim(8).style}
          >
            <a
              href="#search"
              className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
            >
              Search
            </a>
            <p className="text-white/90">
              © {new Date().getFullYear()} {BRAND}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer