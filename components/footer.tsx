"use client"

import Link from "next/link"
import { useSiteConfig } from "@/components/site-config-provider"

export function Footer() {
  const { config, isLoading } = useSiteConfig()

  if (isLoading) {
    return null
  }

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
              {config.social_media.instagram && (
                <li>
                  <a
                    href={`https://instagram.com/${config.social_media.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    instagram
                  </a>
                </li>
              )}
              {config.social_media.facebook && (
                <li>
                  <a
                    href={`https://facebook.com/${config.social_media.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    facebook
                  </a>
                </li>
              )}
              {config.social_media.twitter && (
                <li>
                  <a
                    href={`https://twitter.com/${config.social_media.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    twitter
                  </a>
                </li>
              )}
              {config.social_media.pinterest && (
                <li>
                  <a
                    href={`https://pinterest.com/${config.social_media.pinterest}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    pinterest
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4">contacto</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href={`mailto:${config.contact_email}`}>{config.contact_email}</a>
              </li>
              <li>
                <a href={`tel:${config.contact_phone}`}>{config.contact_phone}</a>
              </li>
              <li>{config.address}</li>
              {config.business_hours.split('\n').map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {config.store_name}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
