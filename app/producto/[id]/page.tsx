"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { ShoppingBag } from "lucide-react"
import { useCartAnimation } from "@/hooks/use-cart-animation"
import { formatPrice } from "@/lib/format"
import { incrementProductViews } from "@/lib/metrics-supabase"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/lib/types"

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const addToCartButtonRef = useRef<HTMLButtonElement>(null)

  // Usar el hook de animación del carrito
  const { animating, showOverlay, overlayPosition, startAnimation } = useCartAnimation({
    buttonRef: addToCartButtonRef as React.RefObject<HTMLButtonElement>,
  })

  // Load product data
  useEffect(() => {
    loadProduct()
  }, [productId])

  const loadProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (error) {
      console.error('Error loading product:', error)
      setLoading(false)
      return
    }

    setProduct(data)
    setLoading(false)

    // Registrar vista de producto usando la nueva implementación
    if (data) {
      try {
        await incrementProductViews(data.id)
      } catch (error) {
        console.error('Error incrementing product views:', error)
      }
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 pt-24 flex items-center justify-center">
          <p>Cargando producto...</p>
        </div>
        <Footer />
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 pt-24 flex items-center justify-center">
          <p>Producto no encontrado</p>
        </div>
        <Footer />
      </main>
    )
  }

  const handleAddToCart = () => {
    // Añadir al carrito
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "/placeholder.svg",
      quantity,
    })

    // Iniciar la animación
    startAnimation()
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 pt-24 py-12">
        <div className="container px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-medium mb-2">{product.name}</h1>
                <p className="text-lg mb-6">{formatPrice(product.price)}</p>
                <p className="text-muted-foreground mb-8">{product.description}</p>

                <div className="flex items-center gap-4 mb-6">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="rounded-none border-black text-black"
                  >
                    -
                  </Button>
                  <span>{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="rounded-none border-black text-black"
                  >
                    +
                  </Button>
                </div>

                <Button
                  ref={addToCartButtonRef}
                  onClick={handleAddToCart}
                  className="rounded-none bg-black text-white hover:bg-black/90"
                >
                  Agregar al carrito
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

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
    </main>
  )
}
