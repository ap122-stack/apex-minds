import React, { createContext, useContext, useState } from 'react'

export interface CartItem {
  id: string
  name: string
  type: string
  sessions: number
  priceCents: number
  tutorId?: string
  tutorName?: string
}

export interface SelectedBooking {
  slots: string[]
  subjectType: string
  sessionCount: number
  tutorId?: string
  tutorName?: string
}

interface AppContextValue {
  cart: CartItem[]
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  selectedBooking: SelectedBooking | null
  setSelectedBooking: React.Dispatch<React.SetStateAction<SelectedBooking | null>>
  isPricingOpen: boolean
  setIsPricingOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedBooking, setSelectedBooking] = useState<SelectedBooking | null>(null)
  const [isPricingOpen, setIsPricingOpen] = useState(false)

  function addToCart(item: CartItem) {
    setCart(prev => {
      const exists = prev.find(i => i.id === item.id)
      if (exists) return prev
      return [...prev, item]
    })
  }

  function removeFromCart(id: string) {
    setCart(prev => prev.filter(i => i.id !== id))
  }

  function clearCart() { setCart([]) }

  return (
    <AppContext.Provider value={{
      cart, setCart, addToCart, removeFromCart, clearCart,
      selectedBooking, setSelectedBooking,
      isPricingOpen, setIsPricingOpen,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
