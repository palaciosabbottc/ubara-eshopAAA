"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import type { Product, Collection } from "@/lib/types"

interface AdminContextType {
  // Auth
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void

  // Products
  products: Product[]
  addProduct: (product: Omit<Product, "id" | "created_at" | "updated_at">) => Promise<void>
  updateProduct: (id: string, product: Partial<Omit<Product, "id" | "created_at" | "updated_at">>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>

  // Collections
  collections: Collection[]
  addCollection: (collection: Omit<Collection, "id" | "created_at" | "updated_at">) => Promise<void>
  updateCollection: (id: string, collection: Partial<Omit<Collection, "id" | "created_at" | "updated_at">>) => Promise<void>
  deleteCollection: (id: string) => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<Collection[]>([])

  // Check auth status and load data on mount
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session)
      if (session) {
        loadProducts()
        loadCollections()
      }
    })

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session)
      if (session) {
        loadProducts()
        loadCollections()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load products from Supabase
  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error loading products:', error)
      return
    }
    
    setProducts(data)
  }

  // Load collections from Supabase
  const loadCollections = async () => {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error loading collections:', error)
      return
    }
    
    setCollections(data)
  }

  // Auth functions
  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Error logging in:', error.message)
      return false
    }

    return true
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error logging out:', error.message)
    }
    setIsAuthenticated(false)
    setProducts([])
    setCollections([])
  }

  // Product functions
  const addProduct = async (product: Omit<Product, "id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single()

    if (error) {
      console.error('Error adding product:', error)
      return
    }

    setProducts(prev => [data, ...prev])
  }

  const updateProduct = async (id: string, product: Partial<Omit<Product, "id" | "created_at" | "updated_at">>) => {
    const { error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)

    if (error) {
      console.error('Error updating product:', error)
      return
    }

    setProducts(prev => prev.map(item => item.id === id ? { ...item, ...product } : item))
  }

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting product:', error)
      return
    }

    setProducts(prev => prev.filter(item => item.id !== id))
  }

  // Collection functions
  const addCollection = async (collection: Omit<Collection, "id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase
      .from('collections')
      .insert([collection])
      .select()
      .single()

    if (error) {
      console.error('Error adding collection:', error)
      return
    }

    setCollections(prev => [data, ...prev])
  }

  const updateCollection = async (id: string, collection: Partial<Omit<Collection, "id" | "created_at" | "updated_at">>) => {
    const { error } = await supabase
      .from('collections')
      .update(collection)
      .eq('id', id)

    if (error) {
      console.error('Error updating collection:', error)
      return
    }

    setCollections(prev => prev.map(item => item.id === id ? { ...item, ...collection } : item))
  }

  const deleteCollection = async (id: string) => {
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting collection:', error)
      return
    }

    setCollections(prev => prev.filter(item => item.id !== id))
  }

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        collections,
        addCollection,
        updateCollection,
        deleteCollection,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
