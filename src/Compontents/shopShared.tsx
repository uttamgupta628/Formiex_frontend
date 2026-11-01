// Shared styles for the Cart / Checkout / Order pages (same look as the Catalog page).
export function ShopStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Roboto:wght@400;500;700&display=swap');
      @keyframes sh-fade-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      .sh-fade-up { animation: sh-fade-up 0.7s ease-out both; }
      .sh-poppins { font-family: 'Poppins', sans-serif; }
      .sh-roboto  { font-family: 'Roboto', sans-serif; }
      @media (prefers-reduced-motion: reduce) { .sh-fade-up { animation: none; } }
    `}</style>
  )
}
