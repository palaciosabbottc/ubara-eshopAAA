"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useCartIcon } from "@/components/cart-icon-context"

interface UseCartAnimationProps {
  buttonRef: React.RefObject<HTMLButtonElement>
}

export function useCartAnimation({ buttonRef }: UseCartAnimationProps) {
  const { cartIconRef, highlightCartIcon, setShowNavbar } = useCartIcon()
  const [animating, setAnimating] = useState(false)
  const [animationPosition, setAnimationPosition] = useState({ top: 0, left: 0 })
  const [showOverlay, setShowOverlay] = useState(false)
  const [overlayPosition, setOverlayPosition] = useState({ x: "50%", y: "50px" })

  // Función para iniciar la animación
  const startAnimation = () => {
    // Asegurarse de que la barra de navegación esté visible
    setShowNavbar(true)

    // Obtener la posición del botón
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const startPosition = {
        top: buttonRect.top + buttonRect.height / 2,
        left: buttonRect.left + buttonRect.width / 2,
      }
      setAnimationPosition(startPosition)
    }

    // Activar animación
    setAnimating(true)

    // Destacar el icono del carrito
    highlightCartIcon()

    // Mostrar overlay para guiar la mirada
    if (cartIconRef.current) {
      const cartRect = cartIconRef.current.getBoundingClientRect()
      setOverlayPosition({
        x: `${cartRect.left + cartRect.width / 2}px`,
        y: `${cartRect.top + cartRect.height / 2}px`,
      })
      setShowOverlay(true)

      // Ocultar overlay después de la animación
      setTimeout(() => {
        setShowOverlay(false)
      }, 1000)
    }

    // Resetear la animación después de completarse
    setTimeout(() => {
      setAnimating(false)
    }, 1000)
  }

  // Animación del producto al carrito
  useEffect(() => {
    if (animating && cartIconRef.current) {
      const cartRect = cartIconRef.current.getBoundingClientRect()
      const endPosition = {
        top: cartRect.top + cartRect.height / 2,
        left: cartRect.left + cartRect.width / 2,
      }

      const animationElement = document.querySelector(".cart-animation") as HTMLElement
      if (animationElement) {
        // Posición inicial
        animationElement.style.top = `${animationPosition.top}px`
        animationElement.style.left = `${animationPosition.left}px`

        // Animación
        animationElement.animate(
          [
            {
              top: `${animationPosition.top}px`,
              left: `${animationPosition.left}px`,
              opacity: 1,
              transform: "scale(1)",
            },
            {
              top: `${endPosition.top}px`,
              left: `${endPosition.left}px`,
              opacity: 0,
              transform: "scale(0.5)",
            },
          ],
          {
            duration: 800,
            easing: "ease-out",
            fill: "forwards",
          },
        )
      }
    }
  }, [animating, animationPosition, cartIconRef])

  return {
    animating,
    showOverlay,
    overlayPosition,
    startAnimation,
  }
}
