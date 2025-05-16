"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/lib/types"

export default function TiendaPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading products:', error)
      return
    }

    setProducts(data || [])
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 pt-24 pb-12">
        <div className="container px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-medium mb-8">Tienda</h1>
            {loading ? (
              <div className="text-center py-12">Cargando productos...</div>
            ) : (
              <ProductGrid products={products} showAddToCart={true} />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
