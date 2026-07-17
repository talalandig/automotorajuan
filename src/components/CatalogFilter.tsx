"use client"

import { Filter } from "lucide-react"
import { useRouter } from "next/navigation"

interface CatalogFilterProps {
  currentTipo: string
  currentAnio: string
  currentKm: string
  uniqueYears: number[]
}

export default function CatalogFilter({ currentTipo, currentAnio, currentKm, uniqueYears }: CatalogFilterProps) {
  const router = useRouter()

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams()
    
    // Maintain existing query params while updating the new one
    if (key === 'tipo' && value) params.set('tipo', value)
    else if (key !== 'tipo' && currentTipo) params.set('tipo', currentTipo)
    
    if (key === 'anio' && value) params.set('anio', value)
    else if (key !== 'anio' && currentAnio) params.set('anio', currentAnio)

    if (key === 'km' && value) params.set('km', value)
    else if (key !== 'km' && currentKm) params.set('km', currentKm)

    router.push(`/?${params.toString()}`, { scroll: false })
  }

  const handleClear = () => {
    router.push('/', { scroll: false })
  }

  return (
    <div className="bg-white p-3 sm:p-4 rounded-xl border border-zinc-200 shadow-sm mb-8 flex flex-row gap-2 sm:gap-4 items-center justify-between">
      <div className="flex items-center gap-2 text-zinc-500 font-medium shrink-0">
        <Filter size={18} /> <span className="hidden sm:inline">Filtros</span>
      </div>
      <div className="grid grid-cols-3 sm:flex sm:flex-row gap-1.5 sm:gap-3 w-full sm:w-auto">
        <select 
          value={currentTipo} 
          onChange={(e) => handleFilterChange('tipo', e.target.value)}
          className="w-full px-1 sm:px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D60006] text-zinc-700 font-medium text-center sm:text-left"
        >
          <option value="">Tipo</option>
          <option value="Auto">Auto</option>
          <option value="Camioneta">Camioneta</option>
          <option value="Moto">Moto</option>
        </select>
        
        <select 
          value={currentAnio} 
          onChange={(e) => handleFilterChange('anio', e.target.value)}
          className="w-full px-1 sm:px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D60006] text-zinc-700 font-medium text-center sm:text-left"
        >
          <option value="">Año</option>
          {uniqueYears.map(y => (
            <option key={y} value={String(y)}>{y}</option>
          ))}
        </select>

        <select 
          value={currentKm} 
          onChange={(e) => handleFilterChange('km', e.target.value)}
          className="w-full px-1 sm:px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D60006] text-zinc-700 font-medium text-center sm:text-left"
        >
          <option value="">Kilómetros</option>
          <option value="0-55000">0 - 55k</option>
          <option value="55000-85000">55k - 85k</option>
          <option value="85000-100000">85k - 100k</option>
          <option value="100000-">100k+</option>
        </select>

        {(currentTipo || currentAnio || currentKm) && (
          <button 
            onClick={handleClear} 
            className="col-span-3 sm:col-span-1 w-full px-6 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-medium rounded-lg transition-colors text-xs sm:text-sm text-center"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  )
}
