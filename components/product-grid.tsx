"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { useCartAnimation } from "@/hooks/use-cart-animation"
import { formatPrice } from "@/lib/format"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/lib/types"

interface ProductGridProps {
  category?: string
  limit?: number
  products?: Product[] // Update type to Product[]
  showAddToCart?: boolean
}

export function ProductGrid({ category, limit, products: initialProducts, showAddToCart = true }: ProductGridProps) {
  const { addToCart } = useCart()
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [activeProductId, setActiveProductId] = useState<string | null>(null)
  const [currentImages, setCurrentImages] = useState<Record<string, number>>({})
  const addToCartButtonRef = useRef<HTMLButtonElement>(null)
  const [products, setProducts] = useState<Product[]>(initialProducts || [])
  const [loading, setLoading] = useState(!initialProducts)

  // Usar el hook de animación del carrito
  const { animating, showOverlay, overlayPosition, startAnimation } = useCartAnimation({
    buttonRef: addToCartButtonRef as React.RefObject<HTMLButtonElement>,
  })

  // Load products from Supabase if not provided
  useEffect(() => {
    if (!initialProducts) {
      loadProducts()
    }
  }, [initialProducts, category])

  const loadProducts = async () => {
    let query = supabase.from('products').select('*')

    if (category === "featured") {
      query = query.eq('featured', true)
    } else if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading products:', error)
      return
    }

    let filteredProducts = data || []
    if (limit) {
      filteredProducts = filteredProducts.slice(0, limit)
    }

    setProducts(filteredProducts)
    setLoading(false)
  }

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

    // Añadir al carrito
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "/placeholder.svg",
      quantity,
    })

    // Guardar referencia al botón actual
    addToCartButtonRef.current = event.currentTarget as HTMLButtonElement

    // Guardar el ID del producto activo
    setActiveProductId(product.id)

    // Iniciar la animación
    startAnimation()

    // Resetear la cantidad a 1
    setQuantities((prev) => ({
      ...prev,
      [product.id]: 1,
    }))
  }

  if (loading) {
    return <div className="text-center py-12">Cargando productos...</div>
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div key={product.id} className="group relative" data-parallax={`${0.05 + index * 0.02}`}>
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
        ))}
      </div>

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
    </>
  )
}
