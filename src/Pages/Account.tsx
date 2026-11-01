import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useCustomer } from '../context/CustomerContext'
import { api, type MyOrder } from '../lib/api'
import { ShopStyles } from '../Compontents/shopShared'
import { formatPrice, inputCls, labelCls, primaryBtn } from '../lib/shop'

const secondaryBtn =
  'sh-poppins inline-flex items-center justify-center border border-black px-6 py-3 text-sm font-semibold tracking-wide text-black transition-colors duration-300 hover:bg-black hover:text-white disabled:opacity-50'

const statusLabel = (o: MyOrder) => {
  if (o.orderStatus === 'cancelled') return 'Cancelled'
  if (o.paymentStatus === 'pending' || o.paymentStatus === 'failed') return 'Payment pending'
  if (o.paymentStatus === 'submitted') return 'Verifying payment'
  return o.orderStatus.charAt(0).toUpperCase() + o.orderStatus.slice(1)
}

function Account() {
  const { customer, loading } = useCustomer()

  return (
    <section className="sh-roboto min-h-[70vh] bg-white pb-16 pt-8 sm:pb-20 sm:pt-12">
      <ShopStyles />
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
        {loading ? <p className="text-[#5d5557]">Loading your account…</p> : customer ? <Profile /> : <AuthForms />}
      </div>
    </section>
  )
}

/* ------------------------- Sign in / Create account ------------------------- */

function AuthForms() {
  const { login, register } = useCustomer()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>
    setBusy(true)
    setError('')
    try {
      if (mode === 'login') await login(f.email, f.password)
      else await register({ name: f.name, email: f.email, phone: f.phone, password: f.password })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="sh-poppins sh-fade-up text-4xl font-medium text-black sm:text-5xl">{mode === 'login' ? 'Sign in' : 'Create account'}</h1>
      <p className="mt-3 text-base text-[#5d5557]">
        {mode === 'login' ? 'Welcome back! Sign in to see your orders and checkout faster.' : 'Save your details and track all your orders in one place.'}
      </p>

      <form key={mode} onSubmit={submit} className="mt-8 space-y-5">
        {mode === 'register' && (
          <div>
            <label htmlFor="ac-name" className={labelCls}>Full name</label>
            <input id="ac-name" name="name" required autoComplete="name" className={inputCls} />
          </div>
        )}
        <div>
          <label htmlFor="ac-email" className={labelCls}>Email</label>
          <input id="ac-email" name="email" type="email" required autoComplete="email" className={inputCls} />
        </div>
        {mode === 'register' && (
          <div>
            <label htmlFor="ac-phone" className={labelCls}>Phone (optional)</label>
            <input id="ac-phone" name="phone" type="tel" autoComplete="tel" className={inputCls} />
          </div>
        )}
        <div>
          <label htmlFor="ac-pass" className={labelCls}>Password{mode === 'register' && ' (min. 8 characters)'}</label>
          <input id="ac-pass" name="password" type="password" required minLength={mode === 'register' ? 8 : 1} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} className={inputCls} />
        </div>
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className={primaryBtn}>
          {busy ? 'PLEASE WAIT…' : mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
        </button>
      </form>

      <p className="mt-6 text-center text-base text-[#5d5557]">
        {mode === 'login' ? "New to Formiex? " : 'Already have an account? '}
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login')
            setError('')
          }}
          className="text-black underline underline-offset-4"
        >
          {mode === 'login' ? 'Create an account' : 'Sign in'}
        </button>
      </p>
    </div>
  )
}

/* ------------------------------- Profile ------------------------------- */

function Profile() {
  const { customer, logout, setCustomer } = useCustomer()
  const [orders, setOrders] = useState<MyOrder[] | null>(null)
  const [ordersError, setOrdersError] = useState('')

  useEffect(() => {
    api.myOrders().then(setOrders).catch((e) => setOrdersError(e.message))
  }, [])

  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  if (!customer) return null

  const saveProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>
    setSaving(true)
    setMsg(null)
    try {
      setCustomer(await api.updateMe({ name: f.name, phone: f.phone, address: { line1: f.line1, line2: f.line2, city: f.city, state: f.state, pincode: f.pincode } }))
      setMsg({ ok: true, text: 'Your details have been saved.' })
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : 'Could not save your details' })
    } finally {
      setSaving(false)
    }
  }

  const a = customer.address

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm tracking-wide text-[#5d5557]">MY ACCOUNT</p>
          <h1 className="sh-poppins sh-fade-up text-4xl font-medium text-black sm:text-5xl">Hi, {customer.name.split(' ')[0]}</h1>
          <p className="mt-2 text-base text-[#5d5557]">{customer.email}</p>
        </div>
        <button type="button" onClick={logout} className={secondaryBtn}>SIGN OUT</button>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
        {/* ----- orders ----- */}
        <div>
          <h2 className="sh-poppins text-2xl font-medium text-black">My orders</h2>
          {ordersError && <p className="mt-4 text-sm text-red-700">{ordersError}</p>}
          {!orders && !ordersError && <p className="mt-4 text-[#5d5557]">Loading orders…</p>}
          {orders && orders.length === 0 && (
            <div className="mt-4 bg-[#eeeceb] p-6">
              <p className="text-base text-black">You haven&apos;t placed any orders yet.</p>
              <Link to="/catalog" className={`${primaryBtn} mt-4 max-w-xs`}>START SHOPPING</Link>
            </div>
          )}
          {orders && orders.length > 0 && (
            <ul className="mt-4 divide-y divide-black/10 border-y border-black/10">
              {orders.map((o) => (
                <li key={o.orderNumber}>
                  <Link to={`/order/${o.orderNumber}?token=${o.accessToken}`} className="flex flex-wrap items-center justify-between gap-3 py-5 transition-colors hover:bg-black/[0.02]">
                    <div>
                      <p className="sh-poppins text-base font-medium text-black">{o.orderNumber}</p>
                      <p className="mt-1 text-sm text-[#5d5557]">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} ·{' '}
                        {o.items.map((i) => `${i.name} × ${i.qty}`).join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-medium text-black">{formatPrice(o.total)}</p>
                      <p className="mt-1 text-sm text-[#5d5557]">{statusLabel(o)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ----- details ----- */}
        <div className="space-y-10">
          <form onSubmit={saveProfile} key={customer.id + customer.createdAt + a.line1 + customer.name}>
            <h2 className="sh-poppins text-2xl font-medium text-black">My details</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="pf-name" className={labelCls}>Full name</label>
                <input id="pf-name" name="name" required defaultValue={customer.name} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="pf-phone" className={labelCls}>Phone</label>
                <input id="pf-phone" name="phone" type="tel" defaultValue={customer.phone} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="pf-l1" className={labelCls}>Address</label>
                <input id="pf-l1" name="line1" defaultValue={a.line1} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="pf-l2" className={labelCls}>Apartment, suite, landmark</label>
                <input id="pf-l2" name="line2" defaultValue={a.line2} className={inputCls} />
              </div>
              <div>
                <label htmlFor="pf-city" className={labelCls}>City</label>
                <input id="pf-city" name="city" defaultValue={a.city} className={inputCls} />
              </div>
              <div>
                <label htmlFor="pf-state" className={labelCls}>State</label>
                <input id="pf-state" name="state" defaultValue={a.state} className={inputCls} />
              </div>
              <div>
                <label htmlFor="pf-pin" className={labelCls}>Pincode</label>
                <input id="pf-pin" name="pincode" inputMode="numeric" pattern="\d{6}|" maxLength={6} defaultValue={a.pincode} className={inputCls} />
              </div>
            </div>
            {msg && (
              <p role="status" className={`mt-4 text-sm ${msg.ok ? 'text-black' : 'text-red-700'}`}>{msg.text}</p>
            )}
            <button type="submit" disabled={saving} className={`${primaryBtn} mt-5 sm:max-w-xs`}>{saving ? 'SAVING…' : 'SAVE DETAILS'}</button>
            <p className="mt-3 text-sm text-[#5d5557]">Your saved address is filled in automatically at checkout.</p>
          </form>

          <PasswordForm />
        </div>
      </div>
    </>
  )
}

function PasswordForm() {
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const f = Object.fromEntries(new FormData(form).entries()) as Record<string, string>
    setBusy(true)
    setMsg(null)
    try {
      await api.changePassword(f.current, f.next)
      setMsg({ ok: true, text: 'Password updated.' })
      form.reset()
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : 'Could not update password' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit}>
      <h2 className="sh-poppins text-2xl font-medium text-black">Change password</h2>
      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="pw-cur" className={labelCls}>Current password</label>
          <input id="pw-cur" name="current" type="password" required autoComplete="current-password" className={inputCls} />
        </div>
        <div>
          <label htmlFor="pw-new" className={labelCls}>New password (min. 8 characters)</label>
          <input id="pw-new" name="next" type="password" required minLength={8} autoComplete="new-password" className={inputCls} />
        </div>
      </div>
      {msg && <p role="status" className={`mt-4 text-sm ${msg.ok ? 'text-black' : 'text-red-700'}`}>{msg.text}</p>}
      <button type="submit" disabled={busy} className={`${secondaryBtn} mt-5`}>{busy ? 'UPDATING…' : 'UPDATE PASSWORD'}</button>
    </form>
  )
}

export default Account