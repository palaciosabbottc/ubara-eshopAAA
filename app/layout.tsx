// Server imports
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { LayoutClient } from "./layout-client"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ubara | Cerámica Artesanal",
  description: "Ubara es el arte de la búsqueda de la belleza en lo imperfecto",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}
