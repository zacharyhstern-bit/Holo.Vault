import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const BagCtx = createContext(null)
export const useBag = () => useContext(BagCtx)

const KEY = 'holo-vault-bag'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    const items = raw ? JSON.parse(raw) : []
    return Array.isArray(items) ? items : []
  } catch {
    return []
  }
}

/**
 * Shopping bag state. Items are remembered in this browser between visits.
 * Each item: { id, name, price, hue, kind, label, stock, qty }
 */
export function BagProvider({ children }) {
  const [items, setItems] = useState(load)
  const [open, setOpen] = useState(false)
  const [pulse, setPulse] = useState(0) // bumps whenever something is added

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      /* storage unavailable — bag still works for this visit */
    }
  }, [items])

  const add = useCallback((p) => {
    if (!p) return
    setItems((list) => {
      const found = list.find((i) => i.id === p.id)
      const max = p.stock ?? Infinity
      if (found) return list.map((i) => (i.id === p.id ? { ...i, qty: Math.min(i.qty + 1, max) } : i))
      const label = p.label ?? (p.grader ? `${p.grader} ${p.grade}` : p.grade)
      return [...list, { ...p, label, qty: 1 }]
    })
    setPulse((n) => n + 1)
  }, [])

  const setQty = useCallback((id, qty) => {
    setItems((list) =>
      list
        .map((i) => (i.id === id ? { ...i, qty: Math.min(Math.max(qty, 0), i.stock ?? Infinity) } : i))
        .filter((i) => i.qty > 0)
    )
  }, [])

  const remove = useCallback((id) => setItems((list) => list.filter((i) => i.id !== id)), [])
  const clear = useCallback(() => setItems([]), [])

  const value = useMemo(() => {
    const count = items.reduce((n, i) => n + i.qty, 0)
    const subtotal = items.reduce((n, i) => n + i.qty * i.price, 0)
    return { items, count, subtotal, add, setQty, remove, clear, open, setOpen, pulse }
  }, [items, add, setQty, remove, clear, open, pulse])

  return <BagCtx.Provider value={value}>{children}</BagCtx.Provider>
}
