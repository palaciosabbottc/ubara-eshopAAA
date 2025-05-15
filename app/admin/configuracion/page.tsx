"use client"

import type React from "react"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function AdminSettingsPage() {
  const [storeSettings, setStoreSettings] = useState({
    storeName: "Ubara",
    storeDescription: "Cerámica artesanal",
    contactEmail: "info@ubara.com",
    contactPhone: "+1234567890",
    address: "Calle Principal 123, Ciudad",
  })

  const [socialMedia, setSocialMedia] = useState({
    instagram: "ubara_ceramica",
    facebook: "ubaraceramica",
    twitter: "",
    pinterest: "",
  })

  const handleStoreSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setStoreSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSocialMedia((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveSettings = () => {
    // In a real app, this would save to a database
    localStorage.setItem("ubara-store-settings", JSON.stringify(storeSettings))
    toast({
      title: "Configuración guardada",
      description: "Los cambios han sido guardados correctamente.",
    })
  }

  const handleSaveSocialMedia = () => {
    // In a real app, this would save to a database
    localStorage.setItem("ubara-social-media", JSON.stringify(socialMedia))
    toast({
      title: "Redes sociales actualizadas",
      description: "Los cambios han sido guardados correctamente.",
    })
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
                    <Label htmlFor="storeName">Nombre de la tienda</Label>
                    <Input
                      id="storeName"
                      name="storeName"
                      value={storeSettings.storeName}
                      onChange={handleStoreSettingsChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Email de contacto</Label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={storeSettings.contactEmail}
                      onChange={handleStoreSettingsChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="storeDescription">Descripción de la tienda</Label>
                  <Textarea
                    id="storeDescription"
                    name="storeDescription"
                    value={storeSettings.storeDescription}
                    onChange={handleStoreSettingsChange}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPhone">Teléfono de contacto</Label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      value={storeSettings.contactPhone}
                      onChange={handleStoreSettingsChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      name="address"
                      value={storeSettings.address}
                      onChange={handleStoreSettingsChange}
                    />
                  </div>
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
