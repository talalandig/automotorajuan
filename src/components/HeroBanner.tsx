"use client"

import { useState, useEffect } from "react"
import { SiteSettings } from "@/types"

export default function HeroBanner({ settings }: { settings: SiteSettings | null }) {
  const images = settings?.banner_images?.length ? settings.banner_images : ["/banner_ultimo.jpg"]
  const autoplay = settings ? settings.banner_autoplay : true
  
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoplay || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(interval)
  }, [autoplay, images.length])

  return (
    <div className="relative w-full overflow-hidden border-b border-zinc-200 bg-zinc-100 flex items-center justify-center">
      {/* Desktop Banner (hidden on mobile) */}
      {images.map((img, idx) => (
        <img
          key={`desktop-${idx}`}
          src={img}
          alt={`Banner Desktop ${idx + 1}`}
          className={`hidden sm:block w-full h-auto max-h-[420px] object-cover object-top transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? "opacity-100 relative z-10" : "opacity-0 absolute inset-0 z-0"
          }`}
        />
      ))}

      {/* Mobile Banner (hidden on desktop) */}
      <img
        src="/movil1banner.jpg"
        alt="Banner Móvil"
        className="sm:hidden w-full h-auto object-cover object-top relative z-10"
      />

      {/* Navigation Dots (only if more than 1 image) */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-20 hidden sm:flex justify-center gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentIndex ? "bg-white scale-125" : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Ir a la imagen ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
