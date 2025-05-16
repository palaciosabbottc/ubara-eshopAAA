import { supabase } from "./supabase"
import type { SiteConfig } from "./types"

export async function getSiteConfig(): Promise<SiteConfig | null> {
  const { data, error } = await supabase
    .from('site_config')
    .select('*')
    .single()

  if (error) {
    console.error('Error fetching site config:', error)
    return null
  }

  return data
}

export async function updateSiteConfig(config: Partial<SiteConfig>): Promise<boolean> {
  const { error } = await supabase
    .from('site_config')
    .update(config)
    .eq('id', 1) // We'll always use ID 1 as there's only one configuration

  if (error) {
    console.error('Error updating site config:', error)
    return false
  }

  return true
}

// Default configuration
export const defaultConfig: SiteConfig = {
  store_name: "Ubara",
  store_description: "Cerámica Artesanal",
  contact_email: "info@ubara.com",
  contact_phone: "+56 9 1234 5678",
  address: "Av. Italia 1234, Providencia, Santiago, Chile",
  business_hours: "Lunes a Viernes: 10:00 - 19:00\nSábado: 11:00 - 16:00",
  social_media: {
    instagram: "ubara_ceramica",
    facebook: "ubaraceramica",
    twitter: "",
    pinterest: ""
  }
} 