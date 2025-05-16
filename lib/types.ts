export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  stock: number
  featured?: boolean
  display_order?: number
  created_at?: string
  updated_at?: string
}

export interface Collection {
  id: string
  name: string
  description: string
  image: string
  product_ids: string[]
  display_order?: number
  created_at?: string
  updated_at?: string
}

export interface SiteConfig {
  id?: string
  store_name: string
  store_description: string
  contact_email: string
  contact_phone: string
  address: string
  business_hours: string
  social_media: {
    instagram: string
    facebook: string
    twitter: string
    pinterest: string
  }
  created_at?: string
  updated_at?: string
} 