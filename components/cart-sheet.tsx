"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { formatPrice } from "@/lib/format"
import { incrementWhatsappClicks } from "@/lib/metrics-supabase"

interface CartSheetProps {
  children: ReactNode
}

export function CartSheet({ children }: CartSheetProps) {
  const { cart, updateQuantity, removeFromCart } = useCart()

  const subtotal = cart.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)

  const handleCheckout = async () => {
    try {
      // Registrar clic en WhatsApp
      await incrementWhatsappClicks()

      // Número de WhatsApp (reemplaza con tu número real)
      const phoneNumber = "1234567890" // Formato: código de país + número sin símbolos

      // Crear el mensaje con la información del pedido
      let message = "¡Hola! Me gustaría realizar el siguiente pedido:\n\n"

      // Añadir productos al mensaje
      for (const item of cart) {
        message += `• ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}\n`

        // Registrar clic en WhatsApp para este producto
        await incrementWhatsappClicks(item.id)
      }

      // Añadir total
      message += `\nTotal: ${formatPrice(subtotal)}`

      // Añadir mensaje adicional
      message += "\n\nPor favor, quisiera confirmar este pedido. ¡Gracias!"

      // Codificar el mensaje para URL
      const encodedMessage = encodeURIComponent(message)

      // Crear la URL de WhatsApp
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

      // Redirigir a WhatsApp
      window.open(whatsappUrl, "_blank")
    } catch (error) {
      console.error('Error registering WhatsApp clicks:', error)
    }
  }

  return (
    <Sheet>
      {children}
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Tu carrito</SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-muted-foreground mb-4">Tu carrito está vacío</p>
            <Link href="/tienda">
              <Button variant="outline" className="rounded-none border-black text-black">
                Continuar comprando
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto py-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 border-b">
                  <div className="w-20 h-20 relative flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg?height=80&width=80"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <p className="text-muted-foreground text-sm">{formatPrice(item.price)}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="h-6 w-6 rounded-none border-black text-black"
                      >
                        -
                      </Button>
                      <span className="text-sm">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-6 w-6 rounded-none border-black text-black"
                      >
                        +
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-red-500 h-6 w-6"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between mb-4">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="space-y-2">
                <Link href="/carrito">
                  <Button className="w-full rounded-none bg-black text-white hover:bg-black/90">Ver carrito</Button>
                </Link>

                <Button
                  onClick={handleCheckout}
                  className="w-full rounded-none bg-green-600 text-white hover:bg-green-700"
                >
                  Pedir por WhatsApp
                </Button>
              </div>

              <Link href="/tienda">
                <Button
                  variant="link"
                  className="w-full mt-2 text-black underline underline-offset-4 hover:no-underline"
                >
                  Continuar comprando
                </Button>
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
