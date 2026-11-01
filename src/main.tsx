import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { CartProvider } from './context/CartContext'
import { CustomerProvider } from './context/CustomerContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CustomerProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </CustomerProvider>
    </BrowserRouter>
  </StrictMode>,
)