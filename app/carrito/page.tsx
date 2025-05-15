"use client"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { Trash2 } from "lucide-react"
import { formatPrice } from "@/lib/format"
import { incrementWhatsappClicks } from "@/lib/metrics-supabase"

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()

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

  if (cart.length === 0) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 pt-24 py-12">
          <div className="container px-4 md:px-6">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-2xl font-medium mb-4">Tu carrito</h1>
              <p className="mb-8">Tu carrito está vacío</p>
              <Link href="/tienda">
                <Button variant="outline" className="rounded-none border-black text-black">
                  Continuar comprando
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 pt-24 py-12">
        <div className="container px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-medium mb-8">Tu carrito</h1>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="border-b pb-4 mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 py-4 border-b">
                      <div className="w-24 h-24 relative flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg?height=96&width=96"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-muted-foreground text-sm">{formatPrice(item.price)}</p>

                        <div className="flex items-center gap-4 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="h-8 w-8 rounded-none border-black text-black"
                          >
                            -
                          </Button>
                          <span>{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 rounded-none border-black text-black"
                          >
                            +
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center py-4">
                  <Link href="/tienda">
                    <Button variant="link" className="p-0 text-black underline underline-offset-4 hover:no-underline">
                      Continuar comprando
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={clearCart} className="rounded-none border-black text-black">
                    Vaciar carrito
                  </Button>
                </div>
              </div>

              <div className="bg-[#f9f9f9] p-6">
                <h2 className="text-lg font-medium mb-4">Resumen</h2>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>A coordinar por WhatsApp</span>
                  </div>
                </div>
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                </div>
                <Button onClick={handleCheckout} className="w-full rounded-none bg-black text-white hover:bg-black/90">
                  Proceder al pago vía WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
