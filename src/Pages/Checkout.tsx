import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useCustomer } from '../context/CustomerContext'
import { api } from '../lib/api'
import { ShopStyles } from '../Compontents/shopShared'
import { formatPrice, inputCls, labelCls, primaryBtn } from '../lib/shop'
import { useShippingFor } from '../hooks/useShipping'

function Checkout() {
  const { items, subtotal, clear } = useCart()
  const { customer } = useCustomer()
  const navigate = useNavigate()
  const { settings, shipping } = useShippingFor(subtotal)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (items.length === 0 && !busy) return <Navigate to="/cart" replace />

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>
    setBusy(true)
    setError('')
    try {
      const res = await api.createOrder({
        items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        customer: { name: f.name, email: f.email, phone: f.phone },
        shippingAddress: { line1: f.line1, line2: f.line2, city: f.city, state: f.state, pincode: f.pincode },
        notes: f.notes,
      })
      clear()
      navigate(`/order/${res.order.orderNumber}?token=${res.accessToken}`, { replace: true, state: { payment: res.payment } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not place your order.')
      setBusy(false)
    }
  }

  const upiOff = settings && !settings.upiEnabled

  return (
    <section className="sh-roboto min-h-[70vh] bg-white pb-16 pt-8 sm:pb-20 sm:pt-12">
      <ShopStyles />
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-[72px]">
        <h1 className="sh-poppins sh-fade-up text-4xl font-medium text-black sm:text-5xl lg:text-[64px]">Checkout</h1>

        <form key={customer?.id ?? 'guest'} onSubmit={onSubmit} className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px] lg:gap-16">
          <div className="space-y-10">
            <fieldset>
              <legend className="sh-poppins mb-5 text-2xl font-medium text-black">Contact</legend>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="co-name" className={labelCls}>Full name</label>
                  <input id="co-name" name="name" required autoComplete="name" defaultValue={customer?.name} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="co-email" className={labelCls}>Email</label>
                  <input id="co-email" name="email" type="email" required autoComplete="email" defaultValue={customer?.email} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="co-phone" className={labelCls}>Phone</label>
                  <input id="co-phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel" defaultValue={customer?.phone} className={inputCls} />
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend className="sh-poppins mb-5 text-2xl font-medium text-black">Shipping address</legend>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="co-l1" className={labelCls}>Address</label>
                  <input id="co-l1" name="line1" required autoComplete="address-line1" defaultValue={customer?.address.line1} className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="co-l2" className={labelCls}>Apartment, suite, landmark (optional)</label>
                  <input id="co-l2" name="line2" autoComplete="address-line2" defaultValue={customer?.address.line2} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="co-city" className={labelCls}>City</label>
                  <input id="co-city" name="city" required autoComplete="address-level2" defaultValue={customer?.address.city} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="co-state" className={labelCls}>State</label>
                  <input id="co-state" name="state" required autoComplete="address-level1" defaultValue={customer?.address.state} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="co-pin" className={labelCls}>Pincode</label>
                  <input
                    id="co-pin"
                    name="pincode"
                    required
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength={6}
                    title="6-digit pincode"
                    autoComplete="postal-code"
                    defaultValue={customer?.address.pincode}
                    className={inputCls}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="co-notes" className={labelCls}>Order notes (optional)</label>
                  <textarea id="co-notes" name="notes" rows={3} maxLength={500} className={`${inputCls} resize-y`} />
                </div>
              </div>
            </fieldset>

            <div>
              <h2 className="sh-poppins mb-3 text-2xl font-medium text-black">Payment</h2>
              <p className="border border-black/20 bg-[#eeeceb] p-5 text-base text-black">
                Pay securely with <strong>UPI</strong> (Google Pay, PhonePe, Paytm, BHIM or any UPI app). You&apos;ll
                see the QR code and payment details on the next step.
              </p>
            </div>
          </div>

          <aside className="h-fit bg-[#eeeceb] p-6 sm:p-8">
            <h2 className="sh-poppins text-2xl font-medium text-black">Order summary</h2>
            <ul className="mt-6 space-y-4">
              {items.map((i) => (
                <li key={i.productId} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 bg-[#f1ece9]">
                    <img src={i.img} alt="" className="h-full w-full object-cover" />
                    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[11px] font-bold text-white">
                      {i.qty}
                    </span>
                  </div>
                  <span className="flex-1 text-base text-black">{i.name}</span>
                  <span className="text-base text-black">{formatPrice(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-3 border-t border-black/20 pt-5 text-base text-black">
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

            {upiOff && (
              <p role="alert" className="mt-5 text-sm text-red-700">
                Online payment is temporarily unavailable. Please <Link to="/contact" className="underline">contact us</Link>.
              </p>
            )}
            {error && (
              <p role="alert" className="mt-5 text-sm text-red-700">
                {error}
              </p>
            )}

            <button type="submit" disabled={busy || !!upiOff} className={`${primaryBtn} mt-6`}>
              {busy ? 'PLACING ORDER…' : `PAY WITH UPI · ${formatPrice(subtotal + shipping)}`}
            </button>
            <Link to="/cart" className="mt-4 block text-center text-sm text-[#5d5557] underline underline-offset-4 hover:text-black">
              Back to cart
            </Link>
          </aside>
        </form>
      </div>
    </section>
  )
}

export default Checkout