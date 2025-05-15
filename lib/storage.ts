import { supabase } from "./supabase"

const BUCKET_NAME = "images"

export async function uploadImage(file: File, folder: "products" | "collections"): Promise<string | null> {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Error uploading image:', error)
      return null
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName)

    return publicUrl
  } catch (error) {
    console.error('Error in uploadImage:', error)
    return null
  }
}

export async function deleteImage(url: string): Promise<boolean> {
  try {
    // Extract the file path from the URL
    const urlObj = new URL(url)
    const filePath = urlObj.pathname.split(`/${BUCKET_NAME}/`)[1]

    if (!filePath) {
      console.error('Invalid file path')
      return false
    }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (error) {
      console.error('Error deleting image:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in deleteImage:', error)
    return false
  }
} 