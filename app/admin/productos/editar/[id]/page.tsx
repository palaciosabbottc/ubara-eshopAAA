"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { AdminLayout } from "@/components/admin-layout"
import { useAdmin } from "@/components/admin-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Upload } from "lucide-react"
import { uploadImage, deleteImage } from "@/lib/storage"

export default function AdminEditProductPage() {
  const { products, updateProduct } = useAdmin()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    images: ["/placeholder.svg?height=400&width=400"],
    stock: "0",
    featured: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notFound, setNotFound] = useState(false)

  // Load product data
  useEffect(() => {
    const product = products.find((p) => p.id === productId)

    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        images: product.images,
        stock: product.stock.toString(),
        featured: product.featured || false,
      })
    } else {
      setNotFound(true)
    }
  }, [productId, products])

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

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))

    // Clear error when field is edited
    if (errors.category) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.category
        return newErrors
      })
    }
  }

  const handleFeaturedChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, featured: checked }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio"
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es obligatoria"
    }

    if (!formData.price.trim()) {
      newErrors.price = "El precio es obligatorio"
    } else if (isNaN(Number.parseFloat(formData.price)) || Number.parseFloat(formData.price) <= 0) {
      newErrors.price = "El precio debe ser un número positivo"
    }

    if (!formData.category.trim()) {
      newErrors.category = "La categoría es obligatoria"
    }

    if (!formData.stock.trim()) {
      newErrors.stock = "El stock es obligatorio"
    } else if (isNaN(Number.parseInt(formData.stock)) || Number.parseInt(formData.stock) < 0) {
      newErrors.stock = "El stock debe ser un número positivo"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await updateProduct(productId, {
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        category: formData.category,
        images: formData.images,
        stock: Number.parseInt(formData.stock),
        featured: formData.featured,
      })

      router.push("/admin/productos")
    } catch (error) {
      console.error("Error updating product:", error)
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
      // Delete the old image if it exists and it's not a placeholder
      if (formData.images[0] && !formData.images[0].includes("placeholder")) {
        await deleteImage(formData.images[0])
      }

      const imageUrl = await uploadImage(file, "products")
      if (imageUrl) {
        setFormData((prev) => ({
          ...prev,
          images: [imageUrl],
        }))
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Error al subir la imagen. Por favor intenta de nuevo.")
    }
  }

  if (notFound) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900">Producto no encontrado</h1>
          </div>
          <p className="text-gray-500">El producto que estás buscando no existe o ha sido eliminado.</p>
          <Button onClick={() => router.push("/admin/productos")} className="mt-4">
            Volver a productos
          </Button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">Editar producto</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nombre del producto</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        name="description"
                        rows={5}
                        value={formData.description}
                        onChange={handleChange}
                        className={errors.description ? "border-red-500" : ""}
                      />
                      {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="price">Precio ($)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.price}
                          onChange={handleChange}
                          className={errors.price ? "border-red-500" : ""}
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                      </div>

                      <div>
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                          id="stock"
                          name="stock"
                          type="number"
                          min="0"
                          value={formData.stock}
                          onChange={handleChange}
                          className={errors.stock ? "border-red-500" : ""}
                        />
                        {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
                      </div>

                      <div>
                        <Label htmlFor="category">Categoría</Label>
                        <Select value={formData.category} onValueChange={handleCategoryChange}>
                          <SelectTrigger id="category" className={errors.category ? "border-red-500" : ""}>
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="platos">Platos</SelectItem>
                            <SelectItem value="vasos">Vasos</SelectItem>
                            <SelectItem value="floreros">Floreros</SelectItem>
                            <SelectItem value="bowls">Bowls</SelectItem>
                            <SelectItem value="decoracion">Decoración</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="featured" checked={formData.featured} onCheckedChange={handleFeaturedChange} />
                      <Label htmlFor="featured">Destacar en la página principal</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardContent className="p-6">
                  <Label>Imagen del producto</Label>
                  <div className="mt-2 flex flex-col items-center">
                    <div className="relative w-full h-48 mb-4 bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={formData.images[0] || "/placeholder.svg"}
                        alt="Vista previa"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <Button type="button" variant="outline" onClick={() => document.getElementById("imageInput")?.click()} className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Cambiar imagen
                    </Button>
                    <input
                      id="imageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-2">Formatos recomendados: JPG, PNG. Tamaño máximo: 2MB</p>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6">
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
