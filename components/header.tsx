"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, Search, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/components/cart-provider"
import { CartSheet } from "@/components/cart-sheet"
import { useCartIcon } from "@/components/cart-icon-context"
import { SearchDialog } from "@/components/search-dialog"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()
  const { cart } = useCart()
  const { cartIconRef, isHighlighted, showNavbar, setShowNavbar } = useCartIcon()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Detectar scroll para cambiar el estilo de la navbar y ocultarla/mostrarla
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const isHomePage = pathname === "/"

      // Umbral de scroll diferente para la página de inicio
      const scrollThreshold = isHomePage ? 400 : 100
      const isScrolled = currentScrollY > scrollThreshold

      // Determinar si debemos ocultar la navbar
      const shouldHide = currentScrollY > 100 && currentScrollY > lastScrollY

      setScrolled(isScrolled)

      // Solo actualizamos el estado hidden si showNavbar es false
      // Si showNavbar es true, siempre mantenemos la barra visible
      if (!showNavbar) {
        // En la página de inicio, aplicamos un retraso
        if (isHomePage) {
          if (shouldHide && currentScrollY > 400) {
            setHidden(true)
          } else {
            setHidden(false)
          }
        } else {
          // En otras páginas, ocultamos inmediatamente
          setHidden(shouldHide)
        }
      } else {
        setHidden(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [lastScrollY, showNavbar, pathname])

  // Efecto para sincronizar el estado hidden con showNavbar
  useEffect(() => {
    if (showNavbar) {
      setHidden(false)
    }
  }, [showNavbar])

  // Efecto para resetear showNavbar cuando el usuario hace scroll
  useEffect(() => {
    const handleScroll = () => {
      const isHomePage = pathname === "/"
      // En la página de inicio, esperamos más tiempo antes de permitir que la barra se oculte
      const timeout = isHomePage ? 1000 : 300
      setShowNavbar(false)
    }

    let timeout: NodeJS.Timeout
    const debouncedHandleScroll = () => {
      clearTimeout(timeout)
      timeout = setTimeout(handleScroll, pathname === "/" ? 1000 : 300)
    }

    window.addEventListener("scroll", debouncedHandleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", debouncedHandleScroll)
      clearTimeout(timeout)
    }
  }, [setShowNavbar, pathname])

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300",
          scrolled ? "bg-white" : "bg-transparent",
          hidden ? "-translate-y-full" : "translate-y-0",
          "pt-1 pb-1",
        )}
      >
        <div className="container px-4 md:px-6 flex h-10 items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2 bg-transparent hover:bg-transparent h-7 w-7"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className={cn("h-4 w-4", scrolled ? "text-black" : "text-black")} />
            <span className="sr-only">Toggle menu</span>
          </Button>
          {/* Menú izquierdo */}
          <div className="hidden md:flex items-center gap-5 text-xs">
            <Link
              href="/"
              className={cn(pathname === "/" ? "font-medium" : "text-muted-foreground", scrolled ? "" : "text-black")}
            >
              Inicio
            </Link>
            <Link
              href="/tienda"
              className={cn(
                pathname.startsWith("/tienda") ? "font-medium" : "text-muted-foreground",
                scrolled ? "" : "text-black",
              )}
            >
              Tienda
            </Link>
          </div>
          {/* Logo centrado absolutamente */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Link href="/">
              <Image
                src="/images/ubara-logo.webp"
                alt="Ubara logo"
                width={180}
                height={48}
                className="object-contain h-12 w-auto"
                priority
              />
            </Link>
          </div>
          {/* Menú derecho */}
          <div className="hidden md:flex items-center gap-5 text-xs ml-auto">
            <Link
              href="/nosotros"
              className={cn(
                pathname === "/nosotros" ? "font-medium" : "text-muted-foreground",
                scrolled ? "" : "text-black",
              )}
            >
              Nosotros
            </Link>
            <Link
              href="/contacto"
              className={cn(
                pathname === "/contacto" ? "font-medium" : "text-muted-foreground",
                scrolled ? "" : "text-black",
              )}
            >
              Contacto
            </Link>
          </div>
          {/* Iconos de búsqueda y carrito */}
          <div className="flex items-center gap-1 ml-auto md:ml-0">
            <Button 
              variant="ghost" 
              size="icon" 
              className="bg-transparent hover:bg-transparent h-7 w-7"
              onClick={() => setSearchOpen(true)}
            >
              <Search className={cn("h-3.5 w-3.5", scrolled ? "text-black" : "text-black")} />
              <span className="sr-only">Buscar</span>
            </Button>
            <CartSheet>
              <SheetTrigger asChild>
                <Button
                  ref={cartIconRef}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "relative bg-transparent hover:bg-transparent h-7 w-7 transition-all",
                    isHighlighted && "cart-icon-highlight",
                  )}
                >
                  <ShoppingBag className={cn("h-3.5 w-3.5", scrolled ? "text-black" : "text-black")} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-black text-white text-[8px] flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                  <span className="sr-only">Abrir carrito</span>
                </Button>
              </SheetTrigger>
            </CartSheet>
          </div>
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-6 text-base">
              <Link
                href="/"
                className={pathname === "/" ? "font-medium" : "text-muted-foreground"}
                onClick={() => setMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/tienda"
                className={pathname.startsWith("/tienda") ? "font-medium" : "text-muted-foreground"}
                onClick={() => setMobileMenuOpen(false)}
              >
                Tienda
              </Link>
              <Link
                href="/nosotros"
                className={pathname === "/nosotros" ? "font-medium" : "text-muted-foreground"}
                onClick={() => setMobileMenuOpen(false)}
              >
                Nosotros
              </Link>
              <Link
                href="/contacto"
                className={pathname === "/contacto" ? "font-medium" : "text-muted-foreground"}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contacto
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
