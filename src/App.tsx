import { useEffect } from 'react'
import { Routes, Route, Outlet, useLocation } from 'react-router-dom'

import Navbar from './Compontents/Navbar'
import Footer from './Compontents/Footer'

import Home from './Pages/Home'
import AboutUs from './Pages/AboutUs'
import Contact from './Pages/Contact'
import Catalog from './Pages/Catalog'
import Sunscreen from './Pages/Sunscreen'
import Moisturizer from './Pages/Moisturizer'
import Cart from './Pages/Cart'
import Checkout from './Pages/Checkout'
import Order from './Pages/Order'
import Account from './Pages/Account'

// Page badalte hi sabse upar scroll kare
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

// Navbar + Footer har page par common
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/sunscreen" element={<Sunscreen />} />
        <Route path="/moisturizer" element={<Moisturizer />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/account" element={<Account />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:orderNumber" element={<Order />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}

export default App