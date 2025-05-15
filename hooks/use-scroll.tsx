"use client"

import { useState, useEffect } from "react"

interface ScrollInfo {
  scrollY: number
  scrollDirection: "up" | "down" | null
  isAtTop: boolean
  isInHeroSection: boolean
}

export function useScroll(heroSectionHeight = 600): ScrollInfo {
  const [scrollInfo, setScrollInfo] = useState<ScrollInfo>({
    scrollY: 0,
    scrollDirection: null,
    isAtTop: true,
    isInHeroSection: true,
  })

  useEffect(() => {
    let lastScrollY = window.scrollY

    const updateScrollInfo = () => {
      const currentScrollY = window.scrollY
      const direction = currentScrollY > lastScrollY ? "down" : "up"
      const isAtTop = currentScrollY < 10
      // Actualizado para coincidir con el nuevo umbral de 200px
      const isInHeroSection = currentScrollY < heroSectionHeight - 200

      setScrollInfo({
        scrollY: currentScrollY,
        scrollDirection: direction,
        isAtTop,
        isInHeroSection,
      })

      lastScrollY = currentScrollY
    }

    // Update on mount
    updateScrollInfo()

    window.addEventListener("scroll", updateScrollInfo)
    return () => {
      window.removeEventListener("scroll", updateScrollInfo)
    }
  }, [heroSectionHeight])

  return scrollInfo
}
