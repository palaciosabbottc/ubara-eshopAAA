"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getSiteConfig, updateSiteConfig, defaultConfig } from "@/lib/site-config"
import type { SiteConfig } from "@/lib/types"

interface SiteConfigContextType {
  config: SiteConfig
  updateConfig: (newConfig: Partial<SiteConfig>) => Promise<boolean>
  isLoading: boolean
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined)

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    const data = await getSiteConfig()
    if (data) {
      setConfig(data)
    }
    setIsLoading(false)
  }

  const updateConfig = async (newConfig: Partial<SiteConfig>): Promise<boolean> => {
    const success = await updateSiteConfig(newConfig)
    if (success) {
      setConfig(prev => ({ ...prev, ...newConfig }))
    }
    return success
  }

  return (
    <SiteConfigContext.Provider value={{ config, updateConfig, isLoading }}>
      {children}
    </SiteConfigContext.Provider>
  )
}

export function useSiteConfig() {
  const context = useContext(SiteConfigContext)
  if (context === undefined) {
    throw new Error("useSiteConfig must be used within a SiteConfigProvider")
  }
  return context
} 