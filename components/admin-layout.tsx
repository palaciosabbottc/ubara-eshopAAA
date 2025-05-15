"use client"

import { type ReactNode, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAdmin } from "@/components/admin-provider"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, FolderOpen, Settings, LogOut, ChevronRight } from "lucide-react"

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, logout } = useAdmin()
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Productos", href: "/admin/productos", icon: Package },
    { name: "Colecciones", href: "/admin/colecciones", icon: FolderOpen },
    { name: "Configuración", href: "/admin/configuracion", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-4">
                  <Link href="/" className="text-xl font-light">
                    ubara
                  </Link>
                  <span className="ml-2 text-xs text-gray-500">admin</span>
                </div>
                <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`${
                          isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                      >
                        <item.icon
                          className={`${
                            isActive ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"
                          } mr-3 flex-shrink-0 h-5 w-5`}
                        />
                        {item.name}
                      </Link>
                    )
                  })}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="flex-shrink-0 w-full group block text-gray-600 hover:text-gray-900"
                >
                  <div className="flex items-center">
                    <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                    <span>Cerrar sesión</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile header */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 flex items-center justify-between shadow">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-light">
                ubara
              </Link>
              <span className="ml-2 text-xs text-gray-500">admin</span>
            </div>

            <div className="flex items-center">
              <Button variant="ghost" onClick={handleLogout} className="mr-2">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Breadcrumb - Mobile */}
          <div className="md:hidden bg-white shadow px-4 py-2 flex items-center text-sm">
            <Link href="/admin" className="text-gray-500 hover:text-gray-700">
              Admin
            </Link>
            {pathname !== "/admin" && (
              <>
                <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
                <span className="text-gray-900 font-medium">
                  {pathname.includes("/productos")
                    ? "Productos"
                    : pathname.includes("/colecciones")
                      ? "Colecciones"
                      : pathname.includes("/configuracion")
                        ? "Configuración"
                        : ""}
                </span>
              </>
            )}
          </div>

          {/* Main content */}
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
