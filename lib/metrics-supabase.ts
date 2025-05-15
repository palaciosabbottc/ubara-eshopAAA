import { supabase } from "@/lib/supabase"

export interface Metrics {
  pageVisits: number
  whatsappClicks: {
    total: number
    byProduct: Record<string, number>
  }
  productViews: Record<string, number>
}

// Función para incrementar las visitas a la página
export async function incrementPageVisits(): Promise<void> {
  const today = new Date().toISOString().split('T')[0]

  // Intentar actualizar el contador del día actual
  const { data: existingData, error: selectError } = await supabase
    .from('page_visits')
    .select('visits')
    .eq('date', today)
    .single()

  if (selectError && selectError.code !== 'PGRST116') { // PGRST116 es "no se encontraron resultados"
    console.error('Error checking page visits:', selectError)
    return
  }

  if (existingData) {
    // Actualizar el contador existente
    const { error: updateError } = await supabase
      .from('page_visits')
      .update({ visits: existingData.visits + 1 })
      .eq('date', today)

    if (updateError) {
      console.error('Error updating page visits:', updateError)
    }
  } else {
    // Crear un nuevo registro para el día
    const { error: insertError } = await supabase
      .from('page_visits')
      .insert({ date: today, visits: 1 })

    if (insertError) {
      console.error('Error inserting page visits:', insertError)
    }
  }
}

// Función para incrementar las vistas de un producto
export async function incrementProductViews(productId: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0]

  // Intentar actualizar el contador del día actual
  const { data: existingData, error: selectError } = await supabase
    .from('product_views')
    .select('views')
    .eq('product_id', productId)
    .eq('date', today)
    .single()

  if (selectError && selectError.code !== 'PGRST116') {
    console.error('Error checking product views:', selectError)
    return
  }

  if (existingData) {
    // Actualizar el contador existente
    const { error: updateError } = await supabase
      .from('product_views')
      .update({ views: existingData.views + 1 })
      .eq('product_id', productId)
      .eq('date', today)

    if (updateError) {
      console.error('Error updating product views:', updateError)
    }
  } else {
    // Crear un nuevo registro para el día
    const { error: insertError } = await supabase
      .from('product_views')
      .insert({ product_id: productId, date: today, views: 1 })

    if (insertError) {
      console.error('Error inserting product views:', insertError)
    }
  }
}

// Función para incrementar los clics en el botón de WhatsApp
export async function incrementWhatsappClicks(productId?: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0]

  // Incrementar el total de clics
  const { data: existingTotal, error: selectTotalError } = await supabase
    .from('whatsapp_clicks')
    .select('clicks')
    .eq('date', today)
    .is('product_id', null)
    .single()

  if (selectTotalError && selectTotalError.code !== 'PGRST116') {
    console.error('Error checking total whatsapp clicks:', selectTotalError)
    return
  }

  if (existingTotal) {
    // Actualizar el contador total existente
    const { error: updateError } = await supabase
      .from('whatsapp_clicks')
      .update({ clicks: existingTotal.clicks + 1 })
      .eq('date', today)
      .is('product_id', null)

    if (updateError) {
      console.error('Error updating total whatsapp clicks:', updateError)
    }
  } else {
    // Crear un nuevo registro para el total del día
    const { error: insertError } = await supabase
      .from('whatsapp_clicks')
      .insert({ date: today, clicks: 1 })

    if (insertError) {
      console.error('Error inserting total whatsapp clicks:', insertError)
    }
  }

  // Si se proporciona un ID de producto, incrementar también sus clics
  if (productId) {
    const { data: existingProduct, error: selectProductError } = await supabase
      .from('whatsapp_clicks')
      .select('clicks')
      .eq('product_id', productId)
      .eq('date', today)
      .single()

    if (selectProductError && selectProductError.code !== 'PGRST116') {
      console.error('Error checking product whatsapp clicks:', selectProductError)
      return
    }

    if (existingProduct) {
      // Actualizar el contador existente del producto
      const { error: updateError } = await supabase
        .from('whatsapp_clicks')
        .update({ clicks: existingProduct.clicks + 1 })
        .eq('product_id', productId)
        .eq('date', today)

      if (updateError) {
        console.error('Error updating product whatsapp clicks:', updateError)
      }
    } else {
      // Crear un nuevo registro para el producto en este día
      const { error: insertError } = await supabase
        .from('whatsapp_clicks')
        .insert({ product_id: productId, date: today, clicks: 1 })

      if (insertError) {
        console.error('Error inserting product whatsapp clicks:', insertError)
      }
    }
  }
}

// Función para obtener el total de visitas a la página
export async function getPageVisits(): Promise<number> {
  const { data, error } = await supabase
    .from('page_visits')
    .select('visits')
    .order('date', { ascending: false })

  if (error) {
    console.error('Error getting page visits:', error)
    return 0
  }

  return data?.reduce((total, row) => total + row.visits, 0) || 0
}

// Función para obtener el total de clics en WhatsApp
export async function getWhatsappClicksTotal(): Promise<number> {
  const { data, error } = await supabase
    .from('whatsapp_clicks')
    .select('clicks')
    .is('product_id', null)
    .order('date', { ascending: false })

  if (error) {
    console.error('Error getting whatsapp clicks:', error)
    return 0
  }

  return data?.reduce((total, row) => total + row.clicks, 0) || 0
}

// Función para obtener los productos más visitados
export async function getTopViewedProducts(limit = 5): Promise<{ id: string; views: number }[]> {
  const { data, error } = await supabase
    .from('product_views')
    .select('product_id, views')
    .order('date', { ascending: false })

  if (error) {
    console.error('Error getting top viewed products:', error)
    return []
  }

  // Agrupar vistas por producto
  const productViews = data.reduce((acc, row) => {
    acc[row.product_id] = (acc[row.product_id] || 0) + row.views
    return acc
  }, {} as Record<string, number>)

  // Convertir a array y ordenar
  return Object.entries(productViews)
    .map(([id, views]) => ({ id, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit)
}

// Función para obtener los productos con más clics en WhatsApp
export async function getTopWhatsappProducts(limit = 5): Promise<{ id: string; clicks: number }[]> {
  const { data, error } = await supabase
    .from('whatsapp_clicks')
    .select('product_id, clicks')
    .not('product_id', 'is', null)
    .order('date', { ascending: false })

  if (error) {
    console.error('Error getting top whatsapp products:', error)
    return []
  }

  // Agrupar clics por producto
  const productClicks = data.reduce((acc, row) => {
    acc[row.product_id] = (acc[row.product_id] || 0) + row.clicks
    return acc
  }, {} as Record<string, number>)

  // Convertir a array y ordenar
  return Object.entries(productClicks)
    .map(([id, clicks]) => ({ id, clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, limit)
}

// Función para obtener todas las métricas
export async function getMetrics(): Promise<Metrics> {
  const [pageVisits, whatsappTotal, topProducts, topWhatsappProducts] = await Promise.all([
    getPageVisits(),
    getWhatsappClicksTotal(),
    getTopViewedProducts(),
    getTopWhatsappProducts(),
  ])

  const productViews = topProducts.reduce((acc, { id, views }) => {
    acc[id] = views
    return acc
  }, {} as Record<string, number>)

  const whatsappByProduct = topWhatsappProducts.reduce((acc, { id, clicks }) => {
    acc[id] = clicks
    return acc
  }, {} as Record<string, number>)

  return {
    pageVisits,
    whatsappClicks: {
      total: whatsappTotal,
      byProduct: whatsappByProduct,
    },
    productViews,
  }
} 