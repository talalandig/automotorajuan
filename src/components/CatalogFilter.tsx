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
    <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="flex items-center gap-2 text-zinc-500 font-medium w-full sm:w-auto">
        <Filter size={18} /> Filtros
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <select 
          value={currentTipo} 
          onChange={(e) => handleFilterChange('tipo', e.target.value)}
          className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D60006] text-zinc-700 font-medium"
        >
          <option value="">Todos los tipos</option>
          <option value="Auto">Auto</option>
          <option value="Camioneta">Camioneta</option>
          <option value="Moto">Moto</option>
        </select>
        
        <select 
          value={currentAnio} 
          onChange={(e) => handleFilterChange('anio', e.target.value)}
          className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D60006] text-zinc-700 font-medium"
        >
          <option value="">Cualquier año</option>
          {uniqueYears.map(y => (
            <option key={y} value={String(y)}>{y}</option>
          ))}
        </select>

        <select 
          value={currentKm} 
          onChange={(e) => handleFilterChange('km', e.target.value)}
          className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D60006] text-zinc-700 font-medium"
        >
          <option value="">Kilometraje</option>
          <option value="0-55000">0 - 55.000 km</option>
          <option value="55000-85000">55.000 - 85.000 km</option>
          <option value="85000-100000">85.000 - 100.000 km</option>
          <option value="100000-">100.000 km o más</option>
        </select>

        {(currentTipo || currentAnio || currentKm) && (
          <button 
            onClick={handleClear} 
            className="px-6 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-medium rounded-lg transition-colors text-sm text-center"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  )
}
