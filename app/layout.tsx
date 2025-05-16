// Server imports
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LayoutClient } from "./layout-client"
import { createClient } from "@/utils/supabase/server"

// Define the Inter font with Latin subset
const inter = Inter({ subsets: ["latin"] })

// Function to fetch metadata from the database
async function getMetadata() {
  const supabase = await createClient()
  const { data } = await supabase.from('site_config').select('store_name, store_description').single()
  return data || { store_name: 'Ubara', store_description: 'Cuadros Texturizados' }
}

// Function to generate metadata for the page
export async function generateMetadata(): Promise<Metadata> {
  const { store_name, store_description } = await getMetadata()
  
  return {
    title: store_name,
    description: store_description,
    //icons: {
    //  icon: "/favicon.ico",
    //},
  }
}

// Root layout component that wraps the entire application
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}
