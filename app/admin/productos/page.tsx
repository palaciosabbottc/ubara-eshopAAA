"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { AdminLayout } from "@/components/admin-layout"
import { useAdmin } from "@/components/admin-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Plus, Search, Star, Pencil, Trash2 } from "lucide-react"

export default function AdminProductsPage() {
  const { products, updateProduct, deleteProduct } = useAdmin()
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleToggleFeatured = async (id: string, currentFeatured: boolean | undefined) => {
    await updateProduct(id, { featured: !currentFeatured })
  }

  const handleDeleteClick = (id: string) => {
    setDeleteProductId(id)
  }

  const handleConfirmDelete = async () => {
    if (deleteProductId) {
      await deleteProduct(deleteProductId)
      setDeleteProductId(null)
    }
  }

  const handleCancelDelete = () => {
    setDeleteProductId(null)
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Productos</h1>
          <Link href="/admin/productos/nuevo">
            <Button className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo producto
            </Button>
          </Link>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-full max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Buscar productos..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="relative h-24 w-24 flex-shrink-0">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleFeatured(product.id, product.featured)}
                          className={product.featured ? "text-yellow-500" : "text-gray-400"}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 truncate">{product.category}</p>
                      <p className="mt-1 text-sm font-medium">${product.price.toFixed(2)}</p>
                      <p className="mt-1 text-sm text-gray-500">Stock: {product.stock}</p>
                      <div className="mt-2 flex space-x-2">
                        <Link href={`/admin/productos/editar/${product.id}`}>
                          <Button variant="outline" size="sm" className="flex items-center">
                            <Pencil className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(product.id)}
                          className="flex items-center text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El producto será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  )
}
