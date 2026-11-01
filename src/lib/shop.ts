// Small helpers shared by the Cart / Checkout / Order pages (same look as the Catalog page).
export const formatPrice = (n: number) =>
  `Rs. ${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export const inputCls =
  'w-full border border-black bg-white px-4 py-3.5 text-base text-black outline-none transition-all duration-300 placeholder:text-black/40 focus:ring-2 focus:ring-black/30'
export const labelCls = 'mb-2 block text-sm font-medium text-black'
export const primaryBtn =
  'sh-poppins flex w-full items-center justify-center gap-2 bg-black px-6 py-4 text-base font-semibold tracking-wide text-white transition-colors duration-300 hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-50'
