import { useEffect, useState } from 'react'
import { api, type StoreSettings } from '../lib/api'

/** Store settings + the shipping fee that applies to a given subtotal. */
export function useShippingFor(subtotal: number) {
  const [settings, setSettings] = useState<StoreSettings | null>(null)
  useEffect(() => {
    api.settings().then(setSettings).catch(() => {})
  }, [])
  const shipping = !settings ? 0 : settings.freeShippingAbove > 0 && subtotal >= settings.freeShippingAbove ? 0 : settings.shippingFee
  return { settings, shipping }
}
