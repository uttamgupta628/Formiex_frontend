import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LuMinus, LuPlus, LuTrash2 } from 'react-icons/lu'
import { useCart } from '../context/CartContext'
import { useProducts } from '../hooks/useProducts'
import { useShippingFor } from '../hooks/useShipping'
import { ShopStyles } from '../Compontents/shopShared'
import { formatPrice, primaryBtn } from '../lib/shop'

function Cart() {
  const { items, subtotal, setQty, remove, syncWith } = useCart()
  const { products, live } = useProducts()
  const { shipping } = useShippingFor(subtotal)

  // refresh prices from the live catalog
  useEffect(() => {
    if (live) syncWith(products)
  }, [live, products, syncWith])

  return (
    <section className="sh-roboto min-h-[70vh] bg-white pb-16 pt-8 sm:pb-20 sm:pt-12">
      <ShopStyles />
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-[72px]">
        <h1 className="sh-poppins sh-fade-up text-4xl font-medium text-black sm:text-5xl lg:text-[64px]">Your cart</h1>

        {items.length === 0 ? (
          <div className="mt-12">
            <p className="text-lg text-[#5d5557]">Your cart is currently empty.</p>
            <Link to="/catalog" className={`${primaryBtn} mt-6 max-w-xs`}>
              CONTINUE SHOPPING
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px] lg:gap-16">
            <ul className="divide-y divide-black/10 border-y border-black/10">
              {items.map((i) => (
                <li key={i.productId} className="flex gap-4 py-6 sm:gap-6">
                  <div className="h-24 w-24 shrink-0 overflow-hidden bg-[#f1ece9] sm:h-32 sm:w-32">
                    <img src={i.img} alt={i.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="sh-poppins text-lg font-medium text-black sm:text-xl">{i.name}</h2>
                        <p className="mt-1 text-base text-[#5d5557]">{formatPrice(i.price)}</p>
                      </div>
                      <p className="text-base font-medium text-black sm:text-lg">{formatPrice(i.price * i.qty)}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border border-black">
                        <button
                          type="button"
                          aria-label={`Decrease ${i.name} quantity`}
                          onClick={() => setQty(i.productId, i.qty - 1)}
                          className="px-3 py-2 transition-colors hover:bg-black/5"
                        >
                          <LuMinus />
                        </button>
                        <span className="min-w-10 text-center text-base">{i.qty}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${i.name} quantity`}
                          onClick={() => setQty(i.productId, i.qty + 1)}
                          className="px-3 py-2 transition-colors hover:bg-black/5"
                        >
                          <LuPlus />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(i.productId)}
                        aria-label={`Remove ${i.name}`}
                        className="flex items-center gap-1.5 text-sm text-[#5d5557] underline underline-offset-4 transition-colors hover:text-black"
                      >
                        <LuTrash2 /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit bg-[#eeeceb] p-6 sm:p-8">
              <h2 className="sh-poppins text-2xl font-medium text-black">Order summary</h2>
              <dl className="mt-6 space-y-3 text-base text-black">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Shipping</dt>
                  <dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-black/20 pt-4 text-lg font-semibold">
                  <dt>Total</dt>
                  <dd>{formatPrice(subtotal + shipping)}</dd>
                </div>
              </dl>
              <Link to="/checkout" className={`${primaryBtn} mt-6`}>
                CHECKOUT
              </Link>
              <Link
                to="/catalog"
                className="mt-4 block text-center text-sm text-[#5d5557] underline underline-offset-4 hover:text-black"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}

export default Cart
