"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { AdminLayout } from "@/components/admin-layout"
import { useAdmin } from "@/components/admin-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Plus, Search, Star, Pencil, Trash2, GripVertical } from "lucide-react"
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { SortableItem } from "@/components/sortable-item"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { supabase } from "@/lib/supabase"

export default function AdminProductsPage() {
  const { products: initialProducts, updateProduct, deleteProduct, loadProducts } = useAdmin()
  const [products, setProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Update local state when initialProducts changes
  useEffect(() => {
    setProducts(initialProducts)
  }, [initialProducts])

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
        distance: 10,
      },
    })
  )

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setProducts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        const newArray = arrayMove(items, oldIndex, newIndex)
        
        // Update display_order for all items
        return newArray.map((item, index) => ({
          ...item,
          display_order: index
        }))
      })
      setHasUnsavedChanges(true)
    }
  }

  // Función para recargar productos
  const reloadProducts = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error reloading products:', error)
      toast({
        title: "Error",
        description: "No se pudieron recargar los productos.",
        variant: "destructive",
      })
      return
    }

    setProducts(data || [])
    setIsLoading(false)
  }

  const handleSaveOrder = async () => {
    try {
      setIsLoading(true)
      // Update all products with their new display_order
      await Promise.all(
        products.map((product) =>
          updateProduct(product.id, { display_order: product.display_order })
        )
      )
      
      // Reload products in the AdminProvider to update the global state
      await loadProducts()
      
      setHasUnsavedChanges(false)
      toast({
        title: "Orden guardado",
        description: "El nuevo orden de los productos ha sido guardado correctamente.",
      })
    } catch (error) {
      console.error('Error saving product order:', error)
      toast({
        title: "Error",
        description: "No se pudo guardar el orden de los productos.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Productos</h1>
          <div className="flex gap-2">
            {hasUnsavedChanges && (
              <Button 
                onClick={handleSaveOrder} 
                variant="outline"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </span>
                ) : "Guardar orden"}
              </Button>
            )}
            <Link href="/admin/productos/nuevo">
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo producto
              </Button>
            </Link>
          </div>
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

          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={filteredProducts.map(p => p.id)} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-1 gap-4">
                {filteredProducts.map((product) => (
                  <SortableItem key={product.id} id={product.id}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="cursor-move">
                            <GripVertical className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="h-12 w-12 relative flex-shrink-0">
                            <Image
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                            <p className="mt-1 text-sm text-gray-500 truncate">{product.category}</p>
                            <p className="mt-1 text-sm font-medium">${product.price.toFixed(2)}</p>
                            <p className="mt-1 text-sm text-gray-500">Stock: {product.stock}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleFeatured(product.id, product.featured)}
                              className={product.featured ? "text-yellow-500" : "text-gray-400"}
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                            <Link href={`/admin/productos/editar/${product.id}`}>
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(product.id)}
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
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
            <AlertDialogAction onClick={handleConfirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster />
    </AdminLayout>
  )
}
