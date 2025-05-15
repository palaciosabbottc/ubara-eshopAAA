export interface Metrics {
  pageVisits: number
  whatsappClicks: {
    total: number
    byProduct: Record<string, number>
  }
  productViews: Record<string, number>
}

// Función para inicializar las métricas si no existen
export function initializeMetrics(): Metrics {
  if (typeof window === "undefined") {
    return {
      pageVisits: 0,
      whatsappClicks: {
        total: 0,
        byProduct: {},
      },
      productViews: {},
    }
  }

  const storedMetrics = localStorage.getItem("ubara-metrics")
  if (storedMetrics) {
    try {
      return JSON.parse(storedMetrics)
    } catch (error) {
      console.error("Error parsing metrics from localStorage:", error)
    }
  }

  // Valores iniciales
  const initialMetrics: Metrics = {
    pageVisits: Math.floor(Math.random() * 1000) + 500, // Valor inicial aleatorio para demo
    whatsappClicks: {
      total: Math.floor(Math.random() * 100) + 20, // Valor inicial aleatorio para demo
      byProduct: {
        "plato-circular": Math.floor(Math.random() * 20) + 5,
        "vaso-palo": Math.floor(Math.random() * 15) + 3,
        "florero-pequeno": Math.floor(Math.random() * 10) + 2,
        "bowl-pequeno": Math.floor(Math.random() * 8) + 1,
      },
    },
    productViews: {
      "plato-circular": Math.floor(Math.random() * 200) + 50,
      "vaso-palo": Math.floor(Math.random() * 180) + 40,
      "plato-oval": Math.floor(Math.random() * 150) + 30,
      "plato-filo": Math.floor(Math.random() * 120) + 25,
      "florero-pequeno": Math.floor(Math.random() * 100) + 20,
      "florero-mediano": Math.floor(Math.random() * 90) + 15,
      "taza-cafe": Math.floor(Math.random() * 80) + 10,
      "bowl-pequeno": Math.floor(Math.random() * 70) + 5,
    },
  }

  localStorage.setItem("ubara-metrics", JSON.stringify(initialMetrics))
  return initialMetrics
}

// Función para incrementar las visitas a la página
export function incrementPageVisits(): void {
  if (typeof window === "undefined") return

  const metrics = initializeMetrics()
  metrics.pageVisits += 1
  localStorage.setItem("ubara-metrics", JSON.stringify(metrics))
}

// Función para incrementar las vistas de un producto
export function incrementProductViews(productId: string): void {
  if (typeof window === "undefined") return

  const metrics = initializeMetrics()
  metrics.productViews[productId] = (metrics.productViews[productId] || 0) + 1
  localStorage.setItem("ubara-metrics", JSON.stringify(metrics))
}

// Función para incrementar los clics en el botón de WhatsApp
export function incrementWhatsappClicks(productId?: string): void {
  if (typeof window === "undefined") return

  const metrics = initializeMetrics()
  metrics.whatsappClicks.total += 1

  if (productId) {
    metrics.whatsappClicks.byProduct[productId] = (metrics.whatsappClicks.byProduct[productId] || 0) + 1
  }

  localStorage.setItem("ubara-metrics", JSON.stringify(metrics))
}

// Función para obtener los productos más visitados
export function getTopViewedProducts(limit = 5): { id: string; views: number }[] {
  const metrics = initializeMetrics()

  return Object.entries(metrics.productViews)
    .map(([id, views]) => ({ id, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit)
}

// Función para obtener los productos con más clics en WhatsApp
export function getTopWhatsappProducts(limit = 5): { id: string; clicks: number }[] {
  const metrics = initializeMetrics()

  return Object.entries(metrics.whatsappClicks.byProduct)
    .map(([id, clicks]) => ({ id, clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, limit)
}

// Función para obtener todas las métricas
export function getMetrics(): Metrics {
  return initializeMetrics()
}
