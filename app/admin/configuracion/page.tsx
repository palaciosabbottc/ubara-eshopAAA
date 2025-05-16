"use client"

import type React from "react"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useSiteConfig } from "@/components/site-config-provider"

export default function AdminSettingsPage() {
  const { config, updateConfig, isLoading } = useSiteConfig()
  const [storeSettings, setStoreSettings] = useState({
    store_name: "",
    store_description: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    business_hours: "",
  })

  const [socialMedia, setSocialMedia] = useState({
    instagram: "",
    facebook: "",
    twitter: "",
    pinterest: "",
  })

  useEffect(() => {
    if (!isLoading) {
      setStoreSettings({
        store_name: config.store_name,
        store_description: config.store_description,
        contact_email: config.contact_email,
        contact_phone: config.contact_phone,
        address: config.address,
        business_hours: config.business_hours,
      })
      setSocialMedia(config.social_media)
    }
  }, [config, isLoading])

  const handleStoreSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setStoreSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSocialMedia((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveSettings = async () => {
    const success = await updateConfig(storeSettings)
    if (success) {
    toast({
      title: "Configuración guardada",
      description: "Los cambios han sido guardados correctamente.",
    })
    } else {
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios. Por favor intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleSaveSocialMedia = async () => {
    const success = await updateConfig({ social_media: socialMedia })
    if (success) {
    toast({
      title: "Redes sociales actualizadas",
      description: "Los cambios han sido guardados correctamente.",
    })
    } else {
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios. Por favor intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Cargando configuración...</h1>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Configuración</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de la tienda</CardTitle>
              <CardDescription>Configura la información básica de tu tienda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="store_name">Nombre de la tienda</Label>
                    <Input
                      id="store_name"
                      name="store_name"
                      value={storeSettings.store_name}
                      onChange={handleStoreSettingsChange}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Se usa en metadatos para SEO, pie de página y título de las páginas
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="contact_email">Email de contacto</Label>
                    <Input
                      id="contact_email"
                      name="contact_email"
                      type="email"
                      value={storeSettings.contact_email}
                      onChange={handleStoreSettingsChange}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Se muestra en la página de contacto y pie de página
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="store_description">Descripción de la tienda</Label>
                  <Textarea
                    id="store_description"
                    name="store_description"
                    value={storeSettings.store_description}
                    onChange={handleStoreSettingsChange}
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Se utiliza en la página principal y en metadatos para SEO
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_phone">Teléfono de contacto</Label>
                    <Input
                      id="contact_phone"
                      name="contact_phone"
                      value={storeSettings.contact_phone}
                      onChange={handleStoreSettingsChange}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Se usa para WhatsApp en el carrito y en la página de contacto
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      name="address"
                      value={storeSettings.address}
                      onChange={handleStoreSettingsChange}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Se muestra en la página de contacto y pie de página
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="business_hours">Horario de atención</Label>
                  <Textarea
                    id="business_hours"
                    name="business_hours"
                    value={storeSettings.business_hours}
                    onChange={handleStoreSettingsChange}
                    rows={2}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Se muestra en la página de contacto. Usa saltos de línea para formatear el horario
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>Guardar cambios</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Redes sociales</CardTitle>
              <CardDescription>Configura los enlaces a tus redes sociales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        @
                      </span>
                      <Input
                        id="instagram"
                        name="instagram"
                        value={socialMedia.instagram}
                        onChange={handleSocialMediaChange}
                        className="rounded-l-none"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Solo el nombre de usuario, sin @ (ejemplo: ubara_cuadros)
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="facebook">Facebook</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        facebook.com/
                      </span>
                      <Input
                        id="facebook"
                        name="facebook"
                        value={socialMedia.facebook}
                        onChange={handleSocialMediaChange}
                        className="rounded-l-none"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Solo el nombre de usuario o página (ejemplo: ubaracuadros)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="twitter">Twitter</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        @
                      </span>
                      <Input
                        id="twitter"
                        name="twitter"
                        value={socialMedia.twitter}
                        onChange={handleSocialMediaChange}
                        className="rounded-l-none"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Solo el nombre de usuario, sin @ (dejar vacío si no se usa)
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="pinterest">Pinterest</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        pinterest.com/
                      </span>
                      <Input
                        id="pinterest"
                        name="pinterest"
                        value={socialMedia.pinterest}
                        onChange={handleSocialMediaChange}
                        className="rounded-l-none"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Solo el nombre de usuario (dejar vacío si no se usa)
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSocialMedia}>Guardar cambios</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </AdminLayout>
  )
}
