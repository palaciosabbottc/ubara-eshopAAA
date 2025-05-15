"use client"

import type React from "react"
import { CartProvider } from "@/components/cart-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { AdminProvider } from "@/components/admin-provider"
import { CartIconProvider } from "@/components/cart-icon-context"
import Script from "next/script"
import { Toaster } from "@/components/ui/toaster"

export function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="light">
        <AdminProvider>
          <CartProvider>
            <CartIconProvider>{children}</CartIconProvider>
            <Toaster />
          </CartProvider>
        </AdminProvider>
      </ThemeProvider>

      {/* Script for parallax effect */}
      <Script id="parallax-effect">
        {`
          document.addEventListener('DOMContentLoaded', () => {
            const updateParallax = () => {
              const elements = document.querySelectorAll('[data-parallax]');
              
              elements.forEach(element => {
                const speed = parseFloat(element.getAttribute('data-parallax') || '0');
                const rect = element.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                
                // Check if element is in viewport
                if (rect.top < viewportHeight && rect.bottom > 0) {
                  const scrolled = window.pageYOffset;
                  const parallaxDist = scrolled * speed;
                  const skewAngle = (parallaxDist * 0.025) % 360;
                  
                  element.style.transform = \`translate3d(0, \${parallaxDist}px, 0)\`;
                }
              });
            }
            
            // Initial update
            updateParallax();
            
            // Update on scroll
            window.addEventListener('scroll', updateParallax);
            
            // Update on resize
            window.addEventListener('resize', updateParallax);
          });
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