import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  HiOutlineUserCircle,
  HiOutlineSearch,
  HiOutlineShoppingBag,
  HiChevronDown,
  HiMenuAlt3,
  HiX,
} from 'react-icons/hi'
import { useCart } from '../context/CartContext'

// 👇 Announcement bar ka text
const ANNOUNCEMENT = 'Daily UV protection for all skin types'

// 👇 Apna outside logo link yahan paste karein (khali '' rakhne par text logo dikhega)
const LOGO_URL =
  'https://res.cloudinary.com/dquki4xol/image/upload/v1793341643/WhatsApp_Image_2026-10-01_at_6.40.04_PM_lzwm2l.jpg'
const BRAND_NAME = 'FORMIEX'

type NavLink = {
  label: string
  href: string
  activePaths?: string[]
  children?: { label: string; href: string }[]
}

const navLinks: NavLink[] = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT US', href: '/about' },
  {
    label: 'SHOP',
    href: '/catalog',
    activePaths: ['/sunscreen', '/moisturizer'],
    children: [
      { label: 'All Products', href: '/catalog' },
      { label: 'Sunscreen', href: '/sunscreen' },
      { label: 'Moisturizer', href: '/moisturizer' },
    ],
  },
  { label: 'CATALOG', href: '/catalog' },
  { label: 'CONTACT', href: '/contact' },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false) // mobile accordion
  const [scrolled, setScrolled] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)
  const { count: cartCount } = useCart()

  const { pathname } = useLocation()

  // Active link URL se pata chalta hai
  const isActive = (link: NavLink) =>
    link.activePaths
      ? link.activePaths.includes(pathname)
      : link.href === '/'
        ? pathname === '/'
        : pathname.startsWith(link.href)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Page badalte hi mobile menu band ho jaye
  useEffect(() => {
    setOpen(false)
    setShopOpen(false)
  }, [pathname])

  const marqueeItems = Array.from({ length: 8 })
  const showImageLogo = LOGO_URL && !logoFailed

  return (
    <>
      {/* ===== Animations (sirf is component ke liye) ===== */}
      <style>{`
        @keyframes nav-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes nav-slide-down {
          from { opacity: 0; transform: translateY(-100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes nav-fade-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes nav-drop {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-marquee    { animation: nav-marquee 25s linear infinite; }
        .nav-slide-down { animation: nav-slide-down 0.6s ease-out both; }
        .nav-fade-in    { animation: nav-fade-in 0.5s ease-out both; }
        .nav-drop       { animation: nav-drop 0.25s ease-out both; }

        .nav-bar:hover .nav-marquee { animation-play-state: paused; }

        @media (prefers-reduced-motion: reduce) {
          .nav-marquee, .nav-slide-down, .nav-fade-in, .nav-drop { animation: none; }
        }
      `}</style>

      <header className="nav-slide-down sticky top-0 z-50">
        {/* ===== Top announcement bar (scrolling) ===== */}
        <div className="nav-bar overflow-hidden bg-black text-white">
          <div className="nav-marquee flex w-max py-2.5 sm:py-3">
            {[0, 1].map((set) => (
              <div key={set} className="flex shrink-0" aria-hidden={set === 1}>
                {marqueeItems.map((_, i) => (
                  <span
                    key={i}
                    className="whitespace-nowrap px-8 text-xs font-medium tracking-wide sm:px-14 sm:text-sm lg:px-[60px]"
                  >
                    {ANNOUNCEMENT}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ===== Main navbar ===== */}
        <nav
          className={`bg-white transition-shadow duration-300 ${
            scrolled ? 'shadow-lg' : 'shadow-none'
          }`}
        >
          <div className="mx-auto grid max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-4 py-3 sm:px-6 lg:px-10 lg:py-4">
            {/* ===== Logo (left) ===== */}
            <Link to="/" className="group flex items-center justify-self-start">
              {showImageLogo ? (
                <img
                  src={LOGO_URL}
                  alt={BRAND_NAME}
                  onError={() => setLogoFailed(true)}
                  className="h-8 w-auto max-w-[170px] object-contain transition-transform duration-300 group-hover:scale-105 sm:h-9 sm:max-w-[200px] lg:h-10 lg:max-w-[240px]"
                />
              ) : (
                <span className="text-2xl font-semibold tracking-[0.15em] text-black transition-transform duration-300 group-hover:scale-105 sm:text-3xl lg:text-[34px]">
                  {BRAND_NAME}
                </span>
              )}
            </Link>

            {/* ===== Desktop links (center) ===== */}
            <ul className="hidden items-center gap-8 lg:flex xl:gap-12">
              {navLinks.map((link, i) => (
                <li
                  key={link.label}
                  className="nav-fade-in group/menu relative"
                  style={{ animationDelay: `${i * 80 + 300}ms` }}
                >
                  <Link
                    to={link.href}
                    className={`relative flex items-center gap-1.5 py-2 text-[15px] font-medium text-black transition-colors duration-300
                      after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:bg-black after:transition-all after:duration-300
                      ${
                        isActive(link)
                          ? 'after:w-full'
                          : 'after:w-0 hover:after:w-full'
                      }`}
                  >
                    {link.label}
                    {link.children && (
                      <HiChevronDown className="text-base transition-transform duration-300 group-hover/menu:rotate-180" />
                    )}
                  </Link>

                  {/* Dropdown */}
                  {link.children && (
                    <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-hover/menu:visible group-hover/menu:opacity-100">
                      <ul className="nav-drop min-w-[180px] rounded-md border border-black/10 bg-white py-2 shadow-xl">
                        {link.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              to={child.href}
                              className="block px-5 py-2 text-sm text-black transition-all duration-200 hover:bg-black/5 hover:pl-7"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {/* ===== Right icons ===== */}
            <div className="col-start-3 flex items-center gap-3 justify-self-end text-black sm:gap-5">
              <Link
                to="/account"
                aria-label="Account"
                className="hidden text-[32px] transition-transform duration-300 hover:scale-110 sm:block"
              >
                <HiOutlineUserCircle />
              </Link>

              <button
                type="button"
                aria-label="Search"
                className="text-[26px] transition-transform duration-300 hover:rotate-12 hover:scale-110 sm:text-[30px]"
              >
                <HiOutlineSearch />
              </button>

              <Link
                to="/cart"
                aria-label="Cart"
                className="relative text-[26px] transition-transform duration-300 hover:scale-110 sm:text-[30px]"
              >
                <HiOutlineShoppingBag />
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[11px] font-bold text-white">
                  {cartCount}
                </span>
              </Link>

              {/* Hamburger (mobile/tablet) */}
              <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
                aria-expanded={open}
                className="text-3xl transition-transform duration-300 active:scale-90 lg:hidden"
              >
                <span
                  className={`block transition-transform duration-300 ${
                    open ? 'rotate-90' : 'rotate-0'
                  }`}
                >
                  {open ? <HiX /> : <HiMenuAlt3 />}
                </span>
              </button>
            </div>
          </div>

          {/* ===== Mobile menu (smooth open/close) ===== */}
          <div
            className={`grid transition-[grid-template-rows] duration-500 ease-in-out lg:hidden ${
              open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="overflow-hidden">
              <ul className="flex flex-col border-t border-black/10 px-4 pb-4 pt-2 sm:px-6">
                {navLinks.map((link, i) => (
                  <li
                    key={link.label}
                    className={`border-b border-black/5 transition-all duration-500 ${
                      open ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                    }`}
                    style={{ transitionDelay: open ? `${i * 60}ms` : '0ms' }}
                  >
                    {link.children ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setShopOpen(!shopOpen)}
                          aria-expanded={shopOpen}
                          className="flex w-full items-center justify-between py-3 text-base font-medium text-black"
                        >
                          <span
                            className={
                              isActive(link) ? 'underline underline-offset-8' : ''
                            }
                          >
                            {link.label}
                          </span>
                          <HiChevronDown
                            className={`text-xl transition-transform duration-300 ${
                              shopOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <div
                          className={`grid transition-[grid-template-rows] duration-300 ${
                            shopOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                          }`}
                        >
                          <ul className="overflow-hidden pl-4">
                            {link.children.map((child) => (
                              <li key={child.label}>
                                <Link
                                  to={child.href}
                                  onClick={() => setOpen(false)}
                                  className="block py-2.5 text-sm text-black/80 transition-colors hover:text-black"
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <Link
                        to={link.href}
                        onClick={() => setOpen(false)}
                        className={`block py-3 text-base font-medium text-black ${
                          isActive(link) ? 'underline underline-offset-8' : ''
                        }`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
                {/* Mobile par account link (top icons mein chhupa hai) */}
                <li className="sm:hidden">
                  <Link
                    to="/account"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 py-3 text-base font-medium text-black"
                  >
                    <HiOutlineUserCircle className="text-2xl" /> ACCOUNT
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}

export default Navbar