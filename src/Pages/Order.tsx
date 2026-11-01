import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { LuCheck, LuCopy, LuClock, LuCircleAlert } from 'react-icons/lu'
import { api, type Order as OrderT, type PaymentInfo } from '../lib/api'
import { ShopStyles } from '../Compontents/shopShared'
import { formatPrice, inputCls, labelCls, primaryBtn } from '../lib/shop'

const STEPS = ['placed', 'confirmed', 'shipped', 'delivered'] as const

function Order() {
  const { orderNumber = '' } = useParams()
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const location = useLocation()

  const [order, setOrder] = useState<OrderT | null>(null)
  const [payment, setPayment] = useState<PaymentInfo | null>((location.state as { payment?: PaymentInfo } | null)?.payment ?? null)
  const [loadError, setLoadError] = useState('')

  const [utr, setUtr] = useState('')
  const [shot, setShot] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')
  const [copied, setCopied] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const refresh = useCallback(async () => {
    try {
      const res = await api.getOrder(orderNumber, token)
      setOrder(res.order)
      setPayment(res.payment ?? null)
      setLoadError('')
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Could not load your order.')
    }
  }, [orderNumber, token])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh()
  }, [refresh])

  // while waiting for the store to verify the payment, check back every 20 seconds
  const waiting = order?.payment.status === 'submitted'
  useEffect(() => {
    if (!waiting) return
    const t = setInterval(refresh, 20_000)
    return () => clearInterval(t)
  }, [waiting, refresh])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setFormError('')
    try {
      const res = await api.submitPayment(orderNumber, token, utr.trim(), shot)
      setOrder(res.order)
      setPayment(null)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not submit your payment details.')
    } finally {
      setBusy(false)
    }
  }

  const copyUpi = async () => {
    if (!payment) return
    try {
      await navigator.clipboard.writeText(payment.upiId)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked – user can select the text manually */
    }
  }

  if (!token || loadError) {
    return (
      <section className="sh-roboto min-h-[60vh] bg-white px-4 py-20 text-center">
        <ShopStyles />
        <h1 className="sh-poppins text-3xl font-medium text-black sm:text-4xl">Order not found</h1>
        <p className="mt-4 text-[#5d5557]">{loadError || 'This order link is incomplete. Please use the link from your order confirmation.'}</p>
        <Link to="/catalog" className={`${primaryBtn} mx-auto mt-8 max-w-xs`}>
          BACK TO SHOP
        </Link>
      </section>
    )
  }

  if (!order) {
    return (
      <section className="sh-roboto min-h-[60vh] bg-white px-4 py-20 text-center text-[#5d5557]">
        <ShopStyles />
        Loading your order…
      </section>
    )
  }

  const cancelled = order.orderStatus === 'cancelled'
  const needsPayment = !cancelled && ['pending', 'failed'].includes(order.payment.status)
  const stepIndex = STEPS.indexOf(order.orderStatus as (typeof STEPS)[number])

  return (
    <section className="sh-roboto min-h-[70vh] bg-white pb-16 pt-8 sm:pb-20 sm:pt-12">
      <ShopStyles />
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
        <p className="text-sm tracking-wide text-[#5d5557]">ORDER</p>
        <h1 className="sh-poppins sh-fade-up break-all text-3xl font-medium text-black sm:text-5xl">{order.orderNumber}</h1>

        {/* ---------- status banner ---------- */}
        {cancelled ? (
          <Banner icon={<LuCircleAlert />} title="Order cancelled" text="This order was cancelled. If you already paid, we'll refund you — please contact us with your order number." />
        ) : order.payment.status === 'paid' ? (
          <Banner icon={<LuCheck />} title="Payment confirmed" text="Thank you! Your payment has been verified and your order is being prepared." />
        ) : order.payment.status === 'submitted' ? (
          <Banner icon={<LuClock />} title="Payment under verification" text={`We've received your transaction ID (${order.payment.utr}). We'll confirm your order as soon as the payment is verified — this page updates automatically.`} />
        ) : order.payment.status === 'failed' ? (
          <Banner icon={<LuCircleAlert />} title="We couldn't verify your payment" text="The transaction ID didn't match a payment in our account. Please double-check it below and submit again, or contact us." />
        ) : (
          <Banner icon={<LuClock />} title="Waiting for your payment" text="Complete the UPI payment below, then enter the transaction ID so we can confirm your order." />
        )}

        {/* ---------- UPI payment ---------- */}
        {needsPayment && payment && (
          <div className="mt-8 grid grid-cols-1 gap-8 border border-black p-6 sm:p-8 md:grid-cols-[auto_1fr]">
            <div className="mx-auto text-center">
              <img src={payment.qr} alt="UPI QR code" className="mx-auto h-56 w-56 sm:h-64 sm:w-64" />
              <p className="mt-2 text-sm text-[#5d5557]">Scan with any UPI app</p>
            </div>
            <div>
              <h2 className="sh-poppins text-2xl font-medium text-black">Pay {formatPrice(payment.amount)}</h2>
              <dl className="mt-4 space-y-2 text-base text-black">
                <div className="flex flex-wrap items-center gap-x-3">
                  <dt className="text-[#5d5557]">UPI ID</dt>
                  <dd className="flex items-center gap-2 font-medium">
                    {payment.upiId}
                    <button type="button" onClick={copyUpi} aria-label="Copy UPI ID" className="text-lg transition-transform hover:scale-110">
                      {copied ? <LuCheck /> : <LuCopy />}
                    </button>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="text-[#5d5557]">Payee</dt>
                  <dd className="font-medium">{payment.payeeName}</dd>
                </div>
              </dl>
              {/* On a phone this opens the user's UPI app with amount + order reference pre-filled */}
              <a href={payment.upiLink} className={`${primaryBtn} mt-6 md:max-w-xs`}>
                OPEN UPI APP
              </a>
              {payment.instructions && <p className="mt-4 text-sm text-[#5d5557]">{payment.instructions}</p>}
            </div>

            <form onSubmit={submit} className="space-y-5 border-t border-black/15 pt-6 md:col-span-2">
              <h3 className="sh-poppins text-xl font-medium text-black">After paying, confirm here</h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="utr" className={labelCls}>UPI transaction ID / UTR (12 digits)</label>
                  <input id="utr" value={utr} onChange={(e) => setUtr(e.target.value)} required minLength={8} maxLength={30} inputMode="text" autoComplete="off" placeholder="e.g. 412345678901" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="shot" className={labelCls}>Payment screenshot (optional)</label>
                  <input
                    id="shot"
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setShot(e.target.files?.[0] ?? null)}
                    className={`${inputCls} file:mr-3 file:border-0 file:bg-[#eeeceb] file:px-3 file:py-1.5 file:text-sm`}
                  />
                </div>
              </div>
              {formError && (
                <p role="alert" className="text-sm text-red-700">
                  {formError}
                </p>
              )}
              <button type="submit" disabled={busy} className={`${primaryBtn} sm:max-w-xs`}>
                {busy ? 'SUBMITTING…' : 'I HAVE PAID'}
              </button>
            </form>
          </div>
        )}

        {needsPayment && !payment && (
          <p className="mt-8 text-[#5d5557]">Loading payment details…</p>
        )}

        {/* ---------- progress ---------- */}
        {!cancelled && order.payment.status === 'paid' && stepIndex >= 0 && (
          <ol className="mt-8 grid grid-cols-4 gap-2 text-center text-sm">
            {STEPS.map((s, i) => (
              <li key={s} className={i <= stepIndex ? 'text-black' : 'text-black/35'}>
                <div className={`mx-auto mb-2 h-1.5 w-full ${i <= stepIndex ? 'bg-black' : 'bg-black/15'}`} />
                <span className="capitalize">{s}</span>
              </li>
            ))}
          </ol>
        )}
        {order.trackingNumber && (
          <p className="mt-4 text-base text-black">
            Tracking number: <strong>{order.trackingNumber}</strong>
          </p>
        )}

        {/* ---------- summary ---------- */}
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="bg-[#eeeceb] p-6">
            <h2 className="sh-poppins text-xl font-medium text-black">Items</h2>
            <ul className="mt-4 space-y-3">
              {order.items.map((i, idx) => (
                <li key={idx} className="flex justify-between gap-4 text-base text-black">
                  <span>
                    {i.name} × {i.qty}
                  </span>
                  <span>{formatPrice(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 border-t border-black/20 pt-4 text-base text-black">
              <div className="flex justify-between"><span>Shipping</span><span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span></div>
              <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>{formatPrice(order.total)}</span></div>
            </div>
          </div>
          <div className="bg-[#eeeceb] p-6 text-base leading-relaxed text-black">
            <h2 className="sh-poppins text-xl font-medium">Shipping to</h2>
            <p className="mt-4">
              {order.customer.name}
              <br />
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
              <br />
              {order.customer.phone} · {order.customer.email}
            </p>
          </div>
        </div>

        <p className="mt-8 text-sm text-[#5d5557]">
          Bookmark this page to check your order status any time. Need help? <Link to="/contact" className="underline">Contact us</Link>.
        </p>
      </div>
    </section>
  )
}

function Banner({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="mt-6 flex gap-4 bg-[#eeeceb] p-5 sm:p-6" role="status">
      <span className="mt-0.5 text-2xl text-black">{icon}</span>
      <div>
        <h2 className="sh-poppins text-lg font-medium text-black">{title}</h2>
        <p className="mt-1 text-base text-[#3b3b3b]">{text}</p>
      </div>
    </div>
  )
}

export default Order
