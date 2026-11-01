export type Product = {
  id: string
  slug?: string
  name: string
  desc: string
  price: number
  category: string // 'sunscreen' | 'moisturizer' | anything added from the admin panel
  img: string
  hoverImg: string
  inStock?: boolean
  stock?: number
}

// Offline fallback only – the live catalog comes from the backend (see hooks/useProducts.ts).
// Shown instantly on a first visit so the page never looks empty while the API responds.
export const fallbackProducts: Product[] = [
  {
    id: 'fallback-1',
    name: 'Cloud Melt',
    desc: 'Daily Barrier Moisturizer with SPF 50 PA++++',
    price: 3000,
    category: 'moisturizer',
    img: 'https://res.cloudinary.com/dquki4xol/image/upload/v1793354092/WhatsApp_Image_2026-10-05_at_1.54.19_PM_e3hqk5.jpg',
    hoverImg:
      'https://res.cloudinary.com/dquki4xol/image/upload/v1793347518/WhatsApp_Image_2026-10-05_at_1.51.43_PM_x42g5v.jpg',
  },
  {
    id: 'fallback-2',
    name: 'SkinFlow',
    desc: 'Airlight Daily UV Protection | SPF 50 PA++++',
    price: 2500,
    category: 'sunscreen',
    img: 'https://res.cloudinary.com/dquki4xol/image/upload/v1793354335/WhatsApp_Image_2026-10-05_at_1.32.55_PM_rommd6.jpg',
    hoverImg:
      'https://res.cloudinary.com/dquki4xol/image/upload/v1793354340/WhatsApp_Image_2026-10-05_at_1.36.52_PM_j4cygw.jpg',
  },
]

export const isRealProductId = (id: string) => /^[a-f0-9]{24}$/i.test(id)
