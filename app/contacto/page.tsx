"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react"
import { useSiteConfig } from "@/components/site-config-provider"

export default function ContactoPage() {
  const { config, isLoading } = useSiteConfig()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulación de envío de formulario
    setTimeout(() => {
      toast({
        title: "Mensaje enviado",
        description: "Gracias por contactarnos. Te responderemos a la brevedad.",
      })
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
      setIsSubmitting(false)
    }, 1500)
  }

  const handleWhatsAppClick = () => {
    // Remove any non-numeric characters from phone number
    const cleanPhone = config.contact_phone.replace(/\D/g, '')
    window.open(`https://wa.me/${cleanPhone}`, '_blank')
  }

  if (isLoading) {
    return null
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 pt-24 pb-12">
        <div className="container px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-medium mb-8">Contacto</h1>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Información de contacto */}
              <div className="md:col-span-1">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-medium mb-6">Información</h2>

                    <div className="space-y-6">
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                        <div>
                          <h3 className="text-sm font-medium">Email</h3>
                          <p className="text-sm text-muted-foreground">{config.contact_email}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                        <div>
                          <h3 className="text-sm font-medium">Teléfono</h3>
                          <p className="text-sm text-muted-foreground">{config.contact_phone}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                        <div>
                          <h3 className="text-sm font-medium">Dirección</h3>
                          <p className="text-sm text-muted-foreground">{config.address}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
                        <div>
                          <h3 className="text-sm font-medium">Horario</h3>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {config.business_hours?.replace(/\\n/g, '\n')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Formulario de contacto */}
              <div className="md:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-medium">Envíanos un mensaje</h2>
                      <Button
                        onClick={handleWhatsAppClick}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Mapa - Comentado para uso futuro
            <div className="mt-12">
              <h2 className="text-lg font-medium mb-4">Ubicación</h2>
              <div className="aspect-video w-full bg-gray-100 relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.0097341479!2d-70.63310492426508!3d-33.44290997499106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c59f3b7b5a15%3A0x7f1889d3a5a68571!2sAv.%20Italia%2C%20Providencia%2C%20Regi%C3%B3n%20Metropolitana%2C%20Chile!5e0!3m2!1ses!2s!4v1715612400000!5m2!1ses!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
            */}
          </div>
        </div>
      </div>

      <Footer />
      <Toaster />
    </main>
  )
}
