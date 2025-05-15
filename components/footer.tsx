import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t py-12 bg-white">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div>
            <h3 className="text-sm font-medium mb-4">navegar</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/tienda">colecciones</Link>
              </li>
              <li>
                <Link href="/nosotros">nosotros</Link>
              </li>
              <li>
                <Link href="/contacto">contacto</Link>
              </li>
              <li>
                <Link href="/faq">faq</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4">soporte</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/envios">envíos & entregas</Link>
              </li>
              <li>
                <Link href="/cambios">cambios & devoluciones</Link>
              </li>
              <li>
                <Link href="/terminos">términos & condiciones</Link>
              </li>
              <li>
                <Link href="/faq">faq</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4">social</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  instagram
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4">contacto</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="mailto:info@ubara.com">info@ubara.com</a>
              </li>
              <li>
                <a href="tel:+123456789">+1 (234) 567-89</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Ubara. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
