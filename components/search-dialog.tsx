"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose,
  DialogDescription 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Product, Collection } from "@/lib/types"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const router = useRouter()

  useEffect(() => {
    if (!open) {
      setSearchTerm("")
      setProducts([])
      setCollections([])
    }
  }, [open])

  useEffect(() => {
    async function performSearch() {
      if (searchTerm.length < 2) {
        setProducts([])
        setCollections([])
        return
      }

      const searchLower = searchTerm.toLowerCase()

      // Buscar productos
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${searchLower}%, category.ilike.%${searchLower}%`)
        .limit(5)

      // Buscar colecciones
      const { data: collectionsData } = await supabase
        .from('collections')
        .select('*')
        .or(`name.ilike.%${searchLower}%, description.ilike.%${searchLower}%`)
        .limit(3)

      setProducts(productsData || [])
      setCollections(collectionsData || [])
    }

    const timeoutId = setTimeout(performSearch, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const handleNavigate = (url: string) => {
    router.push(url)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0" showCloseButton={false}>
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="sr-only">Búsqueda</DialogTitle>
          <DialogDescription className="sr-only">
            Busca productos y colecciones en nuestra tienda. Usa el campo de búsqueda para encontrar lo que necesitas.
          </DialogDescription>
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar productos y colecciones..."
              className="pl-10 pr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <DialogClose className="absolute right-1 p-2 hover:bg-gray-100 rounded-sm">
              <X className="h-4 w-4" />
              <span className="sr-only">Cerrar</span>
            </DialogClose>
          </div>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto p-4">
          {collections.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Colecciones</h3>
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                  onClick={() => handleNavigate(`/coleccion/${collection.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleNavigate(`/coleccion/${collection.id}`)}
                >
                  <div>
                    <p className="text-sm font-medium">{collection.name}</p>
                    <p className="text-xs text-gray-500 truncate">{collection.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {products.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Productos</h3>
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center space-x-4 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                  onClick={() => handleNavigate(`/producto/${product.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleNavigate(`/producto/${product.id}`)}
                >
                  <div className="h-12 w-12 relative flex-shrink-0">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                    <p className="text-sm font-medium">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchTerm.length >= 2 && products.length === 0 && collections.length === 0 && (
            <p className="text-center text-gray-500 py-4">No se encontraron resultados</p>
          )}

          {searchTerm.length < 2 && (
            <p className="text-center text-gray-500 py-4">Escribe al menos 2 caracteres para buscar</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 