"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { AdminLayout } from "@/components/admin-layout"
import { useAdmin } from "@/components/admin-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreVertical, Edit, Trash, Package, GripVertical } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { SortableItem } from "@/components/sortable-item"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function AdminCollectionsPage() {
  const { collections: initialCollections, products, deleteCollection, updateCollection, loadCollections } = useAdmin()
  const [collections, setCollections] = useState(initialCollections)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteCollectionId, setDeleteCollectionId] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Update local state when initialCollections changes
  useEffect(() => {
    setCollections(initialCollections)
  }, [initialCollections])

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

  // Filter collections based on search term
  const filteredCollections = collections.filter(
    (collection) =>
      collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Function to count products in a collection
  const getProductCount = (product_ids: string[] = []) => {
    return product_ids.length
  }

  const handleDeleteClick = (id: string) => {
    setDeleteCollectionId(id)
  }

  const handleConfirmDelete = () => {
    if (deleteCollectionId) {
      deleteCollection(deleteCollectionId)
      setDeleteCollectionId(null)
    }
  }

  const handleCancelDelete = () => {
    setDeleteCollectionId(null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setCollections((items) => {
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

  const handleSaveOrder = async () => {
    try {
      setIsLoading(true)
      // Update all collections with their new display_order
      await Promise.all(
        collections.map((collection) =>
          updateCollection(collection.id, { display_order: collection.display_order })
        )
      )
      
      // Reload collections in the AdminProvider to update the global state
      await loadCollections()
      
      setHasUnsavedChanges(false)
      toast({
        title: "Orden guardado",
        description: "El nuevo orden de las colecciones ha sido guardado correctamente.",
      })
    } catch (error) {
      console.error('Error saving collection order:', error)
      toast({
        title: "Error",
        description: "No se pudo guardar el orden de las colecciones.",
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
          <h1 className="text-2xl font-semibold text-gray-900">Colecciones</h1>
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
            <Link href="/admin/colecciones/nueva">
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Nueva colección
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
                placeholder="Buscar colecciones..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 bg-white rounded-md border">
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <SortableContext items={filteredCollections.map(c => c.id)} strategy={verticalListSortingStrategy}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead></TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Productos</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCollections.map((collection) => (
                      <SortableItem key={collection.id} id={collection.id} as="tr">
                        <TableCell>
                          <div className="cursor-move">
                            <GripVertical className="h-5 w-5 text-gray-400" />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{collection.name}</TableCell>
                        <TableCell>{collection.description}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            <Package className="h-3 w-3 mr-1" />
                            {getProductCount(collection.product_ids)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <Link href={`/admin/colecciones/editar/${collection.id}`}>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(collection.id)}
                                className="text-red-600"
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </SortableItem>
                    ))}
                  </TableBody>
                </Table>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>

      <AlertDialog open={!!deleteCollectionId} onOpenChange={() => setDeleteCollectionId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La colección será eliminada permanentemente.
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
