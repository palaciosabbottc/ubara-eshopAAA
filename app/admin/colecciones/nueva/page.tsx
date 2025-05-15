"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { AdminLayout } from "@/components/admin-layout"
import { useAdmin } from "@/components/admin-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { uploadImage } from "@/lib/storage"

export default function AdminNewCollectionPage() {
  const { addCollection, products } = useAdmin()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "/placeholder.svg?height=400&width=400",
    product_ids: [] as string[],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleProductToggle = (productId: string) => {
    setFormData((prev) => {
      const product_ids = [...prev.product_ids]
      if (product_ids.includes(productId)) {
        return { ...prev, product_ids: product_ids.filter((id) => id !== productId) }
      } else {
        return { ...prev, product_ids: [...product_ids, productId] }
      }
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio"
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es obligatoria"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      addCollection({
        name: formData.name,
        description: formData.description,
        image: formData.image,
        product_ids: formData.product_ids,
      })

      router.push("/admin/colecciones")
    } catch (error) {
      console.error("Error adding collection:", error)
      setIsSubmitting(false)
    }
  }

  // Replace the simulated image upload with real upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      alert("La imagen no debe superar los 2MB")
      return
    }

    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona una imagen válida")
      return
    }

    try {
      const imageUrl = await uploadImage(file, "collections")
      if (imageUrl) {
        setFormData((prev) => ({
          ...prev,
          image: imageUrl,
        }))
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Error al subir la imagen. Por favor intenta de nuevo.")
    }
  }

  // Get selected products
  const selectedProducts = products.filter((product) => formData.product_ids.includes(product.id))

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/colecciones">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Nueva colección</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
              </div>

              <div>
                <Label>Imagen</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="h-32 w-32 relative">
                    <Image
                      src={formData.image}
                      alt="Collection preview"
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <Button type="button" variant="outline" onClick={() => document.getElementById("imageInput")?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Subir imagen
                  </Button>
                </div>
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <Card className="mt-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Seleccionar productos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                      {products.map((product) => (
                        <div key={product.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`product-${product.id}`}
                            checked={formData.product_ids.includes(product.id)}
                            onCheckedChange={() => handleProductToggle(product.id)}
                          />
                          <div className="flex items-center flex-1 min-w-0">
                            <div className="h-8 w-8 relative flex-shrink-0 mr-2">
                              <Image
                                src={product.images[0] || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <Label htmlFor={`product-${product.id}`} className="text-sm cursor-pointer truncate">
                              {product.name}
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <div className="mt-6">
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Guardando..." : "Guardar colección"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
