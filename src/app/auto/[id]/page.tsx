"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Vehicle, SiteSettings } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, Calendar, Fuel, Gauge, Settings, User, MapPin, Phone } from "lucide-react"
import WhatsAppIcon from "@/components/WhatsAppIcon"
import Link from "next/link"
import AdminNavButton from "@/components/AdminNavButton"
import HeroBanner from "@/components/HeroBanner"

export default function AutoPage() {
  const { id } = useParams()
  const router = useRouter()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState<string>("")

  useEffect(() => {
    async function fetchVehicle() {
      try {
        const [vehicleRes, settingsRes] = await Promise.all([
          supabase.from('vehicles').select('*').eq('id', id).single(),
          supabase.from('site_settings').select('*').eq('id', 1).single()
        ])
        
        if (vehicleRes.error) throw vehicleRes.error
        setVehicle(vehicleRes.data)
        setMainImage(vehicleRes.data.fotos[0] || "/placeholder.png")

        if (!settingsRes.error && settingsRes.data) {
          setSiteSettings(settingsRes.data as SiteSettings)
        }
      } catch (err) {
        console.error("Error fetching vehicle:", err)
      } finally {
        setLoading(false)
      }
    }
    
    if (id) fetchVehicle()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D60006]"></div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Vehículo no encontrado</h1>
        <p className="text-zinc-500 mb-6">El vehículo que buscas ya no está disponible o el enlace es incorrecto.</p>
        <Button onClick={() => router.push("/")} className="bg-[#D60006] hover:bg-[#b00005]">
          Volver al catálogo
        </Button>
      </div>
    )
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })

  const currentUrl = typeof window !== "undefined" ? window.location.href : ""
  const wppText = encodeURIComponent(`Me interesa este vehiculo: ${currentUrl}`)

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      {/* Global Header */}
      <header className="bg-white relative z-40 shadow-sm border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <img src="/logo11auto.jpg" alt="Automotora Juan Logo" className="h-12 sm:h-16 w-auto object-contain transition-transform hover:scale-105" />
          </a>
          <div className="hidden sm:flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-base font-semibold text-zinc-600">
              <MapPin size={20} className="text-[#D60006]" />
              <span>Agraciada 1668 Salto, Uy.</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={24} className="text-[#D60006]" />
              <div className="flex flex-col font-bold text-sm sm:text-base text-zinc-800 leading-tight gap-0.5">
                <a href="https://wa.me/59898388560" target="_blank" rel="noopener noreferrer" className="hover:text-[#D60006] transition-colors">
                  098 388 560
                </a>
                <a href="https://wa.me/59891057513" target="_blank" rel="noopener noreferrer" className="hover:text-[#D60006] transition-colors">
                  091 057 513
                </a>
              </div>
              <AdminNavButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <HeroBanner settings={siteSettings} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Volver al listado
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Columna Izquierda: Galería */}
          <div className="w-full lg:w-3/5 flex flex-col gap-4">
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-200 shadow-md relative flex items-center justify-center">
              {/* Fondo borroso */}
              <img
                src={mainImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-60 blur-2xl scale-110"
              />
              {/* Imagen principal sin recorte */}
              <img
                src={mainImage}
                alt={`${vehicle.marca} ${vehicle.modelo}`}
                className="relative z-10 w-full h-full object-contain drop-shadow-xl"
              />
              <Badge className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-white border-none shadow-lg text-sm px-3 py-1">
                {vehicle.tipo}
              </Badge>
              {vehicle.estado === 'vendido' && (
                <Badge variant="destructive" className="absolute top-4 left-4 font-bold text-sm px-3 py-1 shadow-lg">
                  VENDIDO
                </Badge>
              )}
            </div>
            
            {/* Thumbnails */}
            {vehicle.fotos.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar">
                {vehicle.fotos.map((foto, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(foto)}
                    className={`relative w-24 h-24 shrink-0 rounded-xl overflow-hidden snap-start transition-all duration-300 ${
                      mainImage === foto 
                        ? 'ring-4 ring-[#D60006] ring-offset-2 scale-[0.98]' 
                        : 'opacity-60 hover:opacity-100 hover:scale-[1.02]'
                    }`}
                  >
                    <img src={foto} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Columna Derecha: Info */}
          <div className="w-full lg:w-2/5 flex flex-col">
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6 md:p-8">
              <h2 className="text-3xl md:text-4xl font-black text-zinc-900 leading-none tracking-tight mb-2">
                {vehicle.marca} <span className="text-zinc-500 font-medium">{vehicle.modelo}</span>
              </h2>
              
              <div className="text-4xl md:text-5xl font-bold text-[#D60006] mt-4 mb-8 tracking-tighter">
                {formatter.format(vehicle.precio)}
              </div>

              <div className="grid grid-cols-2 gap-y-8 gap-x-6 py-8 border-y border-zinc-100 mb-8">
                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Año</p>
                  <p className="font-semibold text-lg text-zinc-900 flex items-center gap-2"><Calendar size={20} className="text-[#D60006]"/> {vehicle.anio}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Kilómetros</p>
                  <p className="font-semibold text-lg text-zinc-900 flex items-center gap-2"><Gauge size={20} className="text-[#D60006]"/> {vehicle.kilometraje.toLocaleString()} km</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Combustible</p>
                  <p className="font-semibold text-lg text-zinc-900 flex items-center gap-2"><Fuel size={20} className="text-[#D60006]"/> {vehicle.combustible}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Transmisión</p>
                  <p className="font-semibold text-lg text-zinc-900 flex items-center gap-2"><Settings size={20} className="text-[#D60006]"/> {vehicle.transmision}</p>
                </div>
                {vehicle.dueno && (
                  <div className="col-span-2">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Dueño</p>
                    <p className="font-semibold text-lg text-zinc-900 flex items-center gap-2"><User size={20} className="text-[#D60006]"/> {vehicle.dueno}</p>
                  </div>
                )}
              </div>

              {/* Removed description from here to put it below */}

              <div className="sticky bottom-4 pt-4 mt-auto bg-white">
                <a href={`https://wa.me/59898388560?text=${wppText}`} target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="w-full h-16 text-lg font-bold bg-green-500 hover:bg-green-600 text-white shadow-xl shadow-green-500/20 transition-all hover:-translate-y-1 rounded-xl">
                    <WhatsAppIcon size={24} className="mr-3" />
                    Consultar por WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Full width Description & Equipamiento section */}
        <div className="mt-8 lg:mt-12 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-zinc-100">
          {vehicle.otros && (
            <div className="mb-10 pb-10 border-b border-zinc-100">
              <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                <Check size={22} className="text-[#D60006]" /> Equipamiento / Otros
              </h3>
              <p className="text-zinc-600 leading-relaxed whitespace-pre-wrap pl-8 text-base">
                {vehicle.otros}
              </p>
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold text-zinc-900 mb-4">Descripción general</h3>
            <p className="text-zinc-600 leading-relaxed whitespace-pre-wrap text-base">
              {vehicle.descripcion || 'Sin descripción adicional.'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Estilos para ocultar scrollbar en los thumbnails */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  )
}
