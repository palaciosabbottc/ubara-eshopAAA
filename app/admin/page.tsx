"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AdminLayout } from "@/components/admin-layout"
import { useAdmin } from "@/components/admin-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, BarChart2, MessageSquare } from "lucide-react"
import { getMetrics, getTopViewedProducts, getTopWhatsappProducts } from "@/lib/metrics-supabase"
import { supabase } from "@/lib/supabase"

export default function AdminDashboardPage() {
  const { products: adminProducts, collections } = useAdmin()
  const [metrics, setMetrics] = useState({
    pageVisits: 0,
    whatsappClicks: { total: 0 },
    topProducts: [] as { id: string; name: string; views: number }[],
    topWhatsappProducts: [] as { id: string; name: string; clicks: number }[],
  })

  // Cargar métricas
  useEffect(() => {
    loadMetrics()
  }, [])

  const loadMetrics = async () => {
    try {
      const allMetrics = await getMetrics()

      // Obtener los nombres de los productos para las métricas
      const { data: productsData } = await supabase
        .from('products')
        .select('id, name')

      const productsMap = (productsData || []).reduce((acc, product) => {
        acc[product.id] = product.name
        return acc
      }, {} as Record<string, string>)

      // Obtener los productos más vistos con sus nombres
      const topViewedProducts = await getTopViewedProducts(5)
      const topProducts = topViewedProducts.map((item) => ({
        id: item.id,
        name: productsMap[item.id] || item.id,
        views: item.views,
      }))

      // Obtener los productos con más clics en WhatsApp con sus nombres
      const topWhatsappProducts = await getTopWhatsappProducts(5)
      const topWhatsappWithNames = topWhatsappProducts.map((item) => ({
        id: item.id,
        name: productsMap[item.id] || item.id,
        clicks: item.clicks,
      }))

      setMetrics({
        pageVisits: allMetrics.pageVisits,
        whatsappClicks: { total: allMetrics.whatsappClicks.total },
        topProducts,
        topWhatsappProducts: topWhatsappWithNames,
      })
    } catch (error) {
      console.error('Error loading metrics:', error)
    }
  }

  const stats = [
    {
      name: "Productos",
      value: adminProducts.length,
      icon: BarChart2,
      href: "/admin/productos",
      color: "bg-blue-100 text-blue-800",
    },
    {
      name: "Colecciones",
      value: collections.length,
      icon: BarChart2,
      href: "/admin/colecciones",
      color: "bg-green-100 text-green-800",
    },
    {
      name: "Visitas",
      value: metrics.pageVisits,
      icon: Eye,
      href: "#",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      name: "Clics WhatsApp",
      value: metrics.whatsappClicks.total,
      icon: MessageSquare,
      href: "#",
      color: "bg-purple-100 text-purple-800",
    },
  ]

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

        <div className="mt-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Link key={stat.name} href={stat.href}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">{stat.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-semibold">{stat.value}</div>
                      <div className={`p-2 rounded-full ${stat.color}`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Productos más visitados */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Productos más visitados</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {metrics.topProducts.map((product, index) => (
                <li key={product.id}>
                  <div className="px-4 py-4 flex items-center sm:px-6">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div className="flex items-center">
                        <div className="font-medium text-gray-900 truncate flex items-center">
                          <span className="text-gray-500 mr-2">#{index + 1}</span>
                          <span>{product.name}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <Eye className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <p>{product.views} visitas</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Productos con más clics en WhatsApp */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Productos más pedidos por WhatsApp</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {metrics.topWhatsappProducts.map((product, index) => (
                <li key={product.id}>
                  <div className="px-4 py-4 flex items-center sm:px-6">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div className="flex items-center">
                        <div className="font-medium text-gray-900 truncate flex items-center">
                          <span className="text-gray-500 mr-2">#{index + 1}</span>
                          <span>{product.name}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <MessageSquare className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <p>{product.clicks} clics</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Acciones rápidas</h2>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/admin/productos/nuevo">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <BarChart2 className="h-6 w-6 text-blue-800" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Añadir producto</h3>
                      <p className="text-sm text-gray-500">Crear un nuevo producto en la tienda</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/colecciones/nueva">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-full">
                      <BarChart2 className="h-6 w-6 text-green-800" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Añadir colección</h3>
                      <p className="text-sm text-gray-500">Crear una nueva colección de productos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Eye className="h-6 w-6 text-purple-800" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Ver tienda</h3>
                      <p className="text-sm text-gray-500">Visitar la tienda como cliente</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
