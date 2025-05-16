"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useCartAnimation } from "@/hooks/use-cart-animation"
import { formatPrice } from "@/lib/format"
import type { Product } from "@/lib/types"
import styles from "@/styles/product-carousel.module.css"

interface ProductCarouselProps {
  products: Product[]
  showAddToCart?: boolean
  autoplayDelay?: number
}

export function ProductCarousel({ 
  products, 
  showAddToCart = true,
  autoplayDelay = 4000
}: ProductCarouselProps) {
  const { addToCart } = useCart()
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [currentImages, setCurrentImages] = useState<Record<string, number>>({})
  const [activeProductId, setActiveProductId] = useState<string | null>(null)
  const addToCartButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const { animating, showOverlay, overlayPosition, startAnimation } = useCartAnimation({
    buttonRef: {
      current: activeProductId ? addToCartButtonRefs.current[activeProductId] : null
    } as React.RefObject<HTMLButtonElement>
  })

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "center",
      containScroll: "trimSnaps",
      dragFree: true,
      slidesToScroll: 1,
      skipSnaps: false,
    },
    [
      Autoplay({
        delay: autoplayDelay,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
      })
    ]
  )

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setPrevBtnEnabled(emblaApi.canScrollPrev())
    setNextBtnEnabled(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
  }, [emblaApi, onSelect])

  const getQuantity = (productId: string) => {
    return quantities[productId] || 1
  }

  const increaseQuantity = (productId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }))
  }

  const decreaseQuantity = (productId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) - 1),
    }))
  }

  const getCurrentImage = (productId: string, images: string[]) => {
    return images[currentImages[productId] || 0] || "/placeholder.svg"
  }

  const nextImage = (e: React.MouseEvent, productId: string, images: string[]) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImages(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % images.length
    }))
  }

  const handleAddToCart = (product: Product, event: React.MouseEvent) => {
    const quantity = getQuantity(product.id)
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "/placeholder.svg",
      quantity,
    })

    setActiveProductId(product.id)

    startAnimation()

    setQuantities((prev) => ({
      ...prev,
      [product.id]: 1,
    }))
  }

  return (
    <div className={styles.embla}>
      <div className={styles.embla__viewport} ref={emblaRef}>
        <div className={styles.embla__container}>
          {products.map((product) => (
            <div key={product.id} className={styles.embla__slide}>
              <div className={styles.embla__slide__inner}>
                <div className="group relative">
                  <Link href={`/producto/${product.id}`} className="block">
                    <div className="aspect-square relative overflow-hidden mb-3">
                      <Image
                        src={getCurrentImage(product.id, product.images)}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.images.length > 1 && (
                        <button
                          onClick={(e) => nextImage(e, product.id, product.images)}
                          className="absolute bottom-2 right-2 bg-white/80 hover:bg-white rounded-full p-1.5 transition-colors"
                        >
                          <div className="text-xs font-medium">
                            {(currentImages[product.id] || 0) + 1}/{product.images.length}
                          </div>
                        </button>
                      )}
                    </div>
                    <h3 className="text-sm font-medium">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
                  </Link>

                  {showAddToCart && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center border border-gray-200">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={(e) => {
                              e.preventDefault()
                              decreaseQuantity(product.id)
                            }}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{getQuantity(product.id)}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={(e) => {
                              e.preventDefault()
                              increaseQuantity(product.id)
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          ref={(el) => {
                            if (el) {
                              addToCartButtonRefs.current[product.id] = el
                            }
                          }}
                          variant="outline"
                          size="sm"
                          className="rounded-none text-xs"
                          onClick={(e) => {
                            e.preventDefault()
                            handleAddToCart(product, e)
                          }}
                        >
                          Añadir
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        className={`${styles.embla__button} ${styles.embla__button__prev}`}
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
        aria-label="Previous products"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        className={`${styles.embla__button} ${styles.embla__button__next}`}
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
        aria-label="Next products"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Elemento de animación */}
      {animating && (
        <div className="cart-animation">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">
            <ShoppingBag className="h-4 w-4" />
          </div>
        </div>
      )}

      {/* Overlay para guiar la mirada */}
      <div
        className={`cart-attention-overlay ${showOverlay ? "active" : ""}`}
        style={
          {
            "--cart-x": overlayPosition.x,
            "--cart-y": overlayPosition.y,
          } as React.CSSProperties
        }
      ></div>
    </div>
  )
} 