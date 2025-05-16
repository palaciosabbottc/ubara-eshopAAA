// Server imports
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LayoutClient } from "./layout-client"
import { headers } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

const inter = Inter({ subsets: ["latin"] })

async function getMetadata() {
  const supabase = createServerComponentClient({ cookies })
  const { data } = await supabase.from('site_config').select('store_name, store_description').single()
  return data || { store_name: 'Ubara', store_description: 'Cerámica Artesanal' }
}

export async function generateMetadata(): Promise<Metadata> {
  const { store_name, store_description } = await getMetadata()
  
  return {
    title: store_name,
    description: store_description,
    icons: {
      icon: "/favicon.ico",
    },
  }
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
