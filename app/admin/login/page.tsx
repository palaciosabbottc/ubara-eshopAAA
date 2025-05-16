"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAdmin } from "@/components/admin-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, isAuthenticated } = useAdmin()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin")
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        router.push("/admin")
      } else {
        setError("Credenciales inválidas. Inténtalo de nuevo.")
      }
    } catch (err) {
      setError("Ocurrió un error al iniciar sesión. Inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  // Si está autenticado, no renderizamos nada mientras se realiza la redirección
  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Acceso Administrador</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa tus credenciales para acceder al panel de administración
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                placeholder="admin@example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </div>

          <div className="text-center">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              Volver a la tienda
            </Link>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Para fines de demostración, usa:</p>
          <p className="font-medium">Usuario: admin</p>
          <p className="font-medium">Contraseña: admin123</p>
        </div>
      </div>
    </div>
  )
}
