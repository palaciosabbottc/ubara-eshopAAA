"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCarousel } from "@/components/product-carousel"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import type { Collection, Product } from "@/lib/types"

export default function Home() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [showHeroText, setShowHeroText] = useState(false)

  useEffect(() => {
    loadCollections()
    loadFeaturedProducts()
    // Mostrar textos del hero después de 2 segundos o al hacer scroll
    const timer = setTimeout(() => setShowHeroText(true), 2000)
    const handleScroll = () => setShowHeroText(true)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const loadCollections = async () => {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(3)

    if (error) {
      console.error('Error loading collections:', error)
      return
    }

    setCollections(data || [])
    setLoading(false)
  }

  const loadFeaturedProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(8)

    if (error) {
      console.error('Error loading featured products:', error)
      return
    }

    setProducts(data || [])
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="w-full h-screen relative">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            src="https://res.cloudinary.com/dkrveiujc/video/upload/v1747683094/kmyjjqokdpjxvus1z5lm.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          
        </div>

        {/* Header */}
        <Header />

        {/* Hero Content */}
        <div className="relative h-full flex items-center justify-center z-10">
          <div
            className={`text-center transition-all duration-[2500ms] ease-out
              ${showHeroText ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}
            `}
            style={{ textShadow: '0 2px 16px rgba(0,0,0,0.7)' }}
          >
            <div className="mb-4">
              <h1 className="text-xl font-normal mb-0">nueva</h1>
              <h1 className="text-xl font-normal">colección</h1>
            </div>
            <p className="text-sm text-gray-800 mb-4">cuadros texturizados</p>
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
              <ProductCarousel 
                products={products}
                showAddToCart={true}
                itemsPerView={4}
                autoplayDelay={5000}
              />
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