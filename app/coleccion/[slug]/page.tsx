"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { supabase } from "@/lib/supabase"
import type { Collection, Product } from "@/lib/types"

export default function CollectionPage() {
  const params = useParams()
  const id = params.slug as string // We keep the param name as slug for now to avoid route changes
  const [collection, setCollection] = useState<Collection | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCollection() {
      // Get the collection
      const { data: collectionData, error: collectionError } = await supabase
        .from('collections')
        .select('*')
        .eq('id', id)
        .single()

      if (collectionError) {
        console.error('Error loading collection:', collectionError)
        setLoading(false)
        return
      }

      if (!collectionData) {
        setLoading(false)
        return
      }

      setCollection(collectionData)

      // Get the products in this collection
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .in('id', collectionData.product_ids || [])

      if (productsError) {
        console.error('Error loading products:', productsError)
        setLoading(false)
        return
      }

      setProducts(productsData || [])
      setLoading(false)
    }

    loadCollection()
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 pt-24 flex items-center justify-center">
          <p>Cargando...</p>
        </div>
        <Footer />
      </main>
    )
  }

  if (!collection) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 pt-24 flex items-center justify-center">
          <p>Colección no encontrada</p>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 pt-24 pb-12">
        <div className="container px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-medium mb-2">{collection.name}</h1>
            <p className="text-muted-foreground mb-8">{collection.description}</p>

            {products.length > 0 ? (
              <div className="mt-8">
                <ProductGrid products={products} showAddToCart={true} />
              </div>
            ) : (
              <p className="text-center py-12 text-muted-foreground">No hay productos en esta colección.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
