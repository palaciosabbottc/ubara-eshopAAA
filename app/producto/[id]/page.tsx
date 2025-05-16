"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { ShoppingBag, Minus, Plus } from "lucide-react"
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
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
      image: product.images[selectedImageIndex] || "/placeholder.svg",
      quantity,
    })

    // Iniciar la animación
    startAnimation()
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 pt-24 pb-12">
        <div className="container px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={product?.images[selectedImageIndex] || "/placeholder.svg"}
                    alt={product?.name || ""}
                    fill
                    className="object-cover"
                  />
                </div>
                {product?.images.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {product.images.map((image, index) => (
                      <div
                        key={index}
                        className={`aspect-square relative bg-gray-100 rounded-md overflow-hidden cursor-pointer ${
                          selectedImageIndex === index ? "ring-2 ring-black" : ""
                        }`}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} - Imagen ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div>
                <h1 className="text-2xl font-medium mb-4">{product?.name}</h1>
                <p className="text-lg font-medium mb-4">{formatPrice(product?.price || 0)}</p>
                <p className="text-muted-foreground mb-6">{product?.description}</p>

                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center border border-gray-200">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    ref={addToCartButtonRef}
                    onClick={handleAddToCart}
                    className="flex-1"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Agregar al carrito
                  </Button>
                </div>
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
