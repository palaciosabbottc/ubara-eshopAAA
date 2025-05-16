"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import type { Collection } from "@/lib/types"

export default function Home() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCollections()
  }, [])

  const loadCollections = async () => {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3)

    if (error) {
      console.error('Error loading collections:', error)
      return
    }

    setCollections(data || [])
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="w-full h-screen relative">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-new.png"
            alt="Cerámica Ubara"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        {/* Header */}
        <Header />

        {/* Hero Content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4">
              <h1 className="text-xl font-normal mb-0">nueva</h1>
              <h1 className="text-xl font-normal">colección</h1>
            </div>
            <p className="text-sm text-muted-foreground mb-4">cerámica</p>
            <Link href="/tienda">
              <span className="inline-block font-bold text-black hover:opacity-70 transition-opacity border-b border-black pb-1">
                shop
              </span>
            </Link>
          </div>
        </div>
      </section>

      <div className="flex-1">
        {/* Featured Products Section */}
        <section className="w-full py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-2xl mx-auto text-center mb-24">
            <p className="text-base text-gray-600">
                ubara es el arte de la búsqueda de la
                <br />
                belleza en la imperfección
                <br />
                ubara es wabi-sabi  
              </p>
              <div className="w-48 h-px bg-gray-300 mx-auto mt-6"></div>
            </div>

            <div className="max-w-5xl mx-auto">
              <h2 className="text-lg font-medium mb-6">
                nueva colección
              </h2>
              <ProductGrid category="featured" limit={4} showAddToCart={true} />
            </div>
          </div>
        </section>

        {/* Brand Story Section */}
        <section className="w-full py-12 bg-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=400&width=500&text=Historia"
                    alt="Nuestra Historia"
                    width={500}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="max-w-xl">
                  <p className="text-base text-gray-600 mb-8">
                    Lo que comenzó como un hobby y una forma de pasar el tiempo, se convirtió en una verdadera pasión.
                  </p>
                  <Link href="/nosotros" className="inline-block">
                    <h2 className="text-base font-normal hover:opacity-70 transition-opacity">
                      nuestra historia
                      <div className="w-48 h-px bg-black mt-2"></div>
                    </h2>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Collections Section */}
        <section className="w-full py-12 bg-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-lg font-medium mb-6">
                todas las colecciones
              </h2>

              {loading ? (
                <div className="text-center py-12">Cargando colecciones...</div>
              ) : collections.length === 0 ? (
                <div className="text-center py-12">No hay colecciones disponibles</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* First collection (6 columns) */}
                  {collections[0] && (
                    <div className="md:col-span-6">
                      <Link href={`/coleccion/${collections[0].id}`} className="group">
                        <div className="relative overflow-hidden">
                          <Image
                            src={collections[0].image || "/placeholder.svg?height=500&width=500"}
                            alt={collections[0].name}
                            width={500}
                            height={500}
                            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute bottom-4 left-4">
                            <h3 className="text-sm font-medium bg-white/80 px-2 py-1">{collections[0].name}</h3>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}

                  {/* Right column with 2 collections (6 columns) */}
                  <div className="md:col-span-6 flex flex-col gap-4">
                    {/* Second collection */}
                    {collections[1] && (
                      <div>
                        <Link href={`/coleccion/${collections[1].id}`} className="group">
                          <div className="relative overflow-hidden">
                            <Image
                              src={collections[1].image || "/placeholder.svg?height=240&width=500"}
                              alt={collections[1].name}
                              width={500}
                              height={240}
                              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute bottom-4 left-4">
                              <h3 className="text-sm font-medium bg-white/80 px-2 py-1">{collections[1].name}</h3>
                            </div>
                          </div>
                        </Link>
                      </div>
                    )}

                    {/* Third collection */}
                    {collections[2] && (
                      <div>
                        <Link href={`/coleccion/${collections[2].id}`} className="group">
                          <div className="relative overflow-hidden">
                            <Image
                              src={collections[2].image || "/placeholder.svg?height=240&width=500"}
                              alt={collections[2].name}
                              width={500}
                              height={240}
                              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute bottom-4 left-4">
                              <h3 className="text-sm font-medium bg-white/80 px-2 py-1">{collections[2].name}</h3>
                            </div>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
