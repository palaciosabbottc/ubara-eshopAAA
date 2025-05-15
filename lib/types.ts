export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  stock: number
  created_at?: string
  updated_at?: string
}

export interface Collection {
  id: string
  name: string
  description: string
  image: string
  product_ids: string[]
  created_at?: string
  updated_at?: string
} 