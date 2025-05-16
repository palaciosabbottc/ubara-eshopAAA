"use client"

import type React from "react"
import { CartProvider } from "@/components/cart-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { AdminProvider } from "@/components/admin-provider"
import { CartIconProvider } from "@/components/cart-icon-context"
import { SiteConfigProvider } from "@/components/site-config-provider"
import Script from "next/script"
import { Toaster } from "@/components/ui/toaster"

export function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="light">
        <AdminProvider>
          <SiteConfigProvider>
            <CartProvider>
              <CartIconProvider>{children}</CartIconProvider>
              <Toaster />
            </CartProvider>
          </SiteConfigProvider>
        </AdminProvider>
      </ThemeProvider>

      {/* Script for parallax effect */}
      <Script id="parallax-script">
        {`
          document.addEventListener('mousemove', (e) => {
            document.querySelectorAll("[data-parallax]").forEach((shift) => {
              const position = shift.getAttribute("data-parallax")
              const x = (window.innerWidth - e.pageX * position) / 90
              const y = (window.innerHeight - e.pageY * position) / 90

              shift.style.transform = \`translateX(\${x}px) translateY(\${y}px)\`
            })
          })
        `}
      </Script>

      {/* Script for tracking page visits */}
      <Script id="page-visit-tracker">
        {`
          (function() {
            try {
              // Only run in browser
              if (typeof window !== 'undefined') {
                // Increment page visits in Supabase
                fetch('/api/metrics/increment-page-visit', {
                  method: 'POST',
                }).catch(error => {
                  console.error('Error tracking page visit:', error);
                });
              }
            } catch (error) {
              console.error('Error tracking page visit:', error);
            }
          })();
        `}
      </Script>
    </>
  )
} 