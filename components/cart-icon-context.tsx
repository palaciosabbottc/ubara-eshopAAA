"use client"

import type React from "react"

import { createContext, useContext, useRef, useState, type ReactNode } from "react"

interface CartIconContextType {
  cartIconRef: React.RefObject<HTMLButtonElement>
  highlightCartIcon: () => void
  isHighlighted: boolean
  showNavbar: boolean
  setShowNavbar: (show: boolean) => void
}

const CartIconContext = createContext<CartIconContextType | undefined>(undefined)

export function CartIconProvider({ children }: { children: ReactNode }) {
  const cartIconRef = useRef<HTMLButtonElement>(null)
  const [isHighlighted, setIsHighlighted] = useState(false)
  const [showNavbar, setShowNavbar] = useState(true)

  const highlightCartIcon = () => {
    setIsHighlighted(true)
    // Asegurarse de que la barra de navegación esté visible
    setShowNavbar(true)

    setTimeout(() => {
      setIsHighlighted(false)
    }, 3000)
  }

  return (
    <CartIconContext.Provider
      value={{
        cartIconRef,
        highlightCartIcon,
        isHighlighted,
        showNavbar,
        setShowNavbar,
      }}
    >
      {children}
    </CartIconContext.Provider>
  )
}

export function useCartIcon() {
  const context = useContext(CartIconContext)
  if (context === undefined) {
    throw new Error("useCartIcon must be used within a CartIconProvider")
  }
  return context
}
