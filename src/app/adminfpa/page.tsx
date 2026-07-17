"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Vehicle } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import AdminForm from "@/components/AdminForm"
import BannerSettings from "@/components/BannerSettings"
import { LogOut, Plus, Trash2, Edit, Car, Settings, Globe, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [activeTab, setActiveTab] = useState<'vehiculos' | 'configuracion'>('vehiculos')
  const [hideSold, setHideSold] = useState(true)

  const loadVehicles = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false })
    if (data) setVehicles(data)
    setLoading(false)
  }

  useEffect(() => {
    loadVehicles()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este vehículo?")) {
      await supabase.from('vehicles').delete().eq('id', id)
      loadVehicles()
    }
  }

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setIsModalOpen(true)
  }

  const handleNew = () => {
    setEditingVehicle(null)
    setIsModalOpen(true)
  }

  const toggleEstado = async (vehicle: Vehicle) => {
    const nuevoEstado = vehicle.estado === 'disponible' ? 'vendido' : 'disponible'
    await supabase.from('vehicles').update({ estado: nuevoEstado }).eq('id', vehicle.id)
    loadVehicles()
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Panel de Control</h1>
            <p className="text-zinc-500">Gestiona tus vehículos y configuración</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link href="/" className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100">
                <Globe className="mr-2" size={18} /> Ver Web
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="mr-2" size={18} /> Salir
            </Button>
          </div>
        </header>

        {/* Tabs nav */}
        <div className="flex gap-4 mb-6 border-b border-zinc-200">
          <button 
            onClick={() => setActiveTab('vehiculos')}
            className={`pb-3 font-semibold text-sm transition-colors flex items-center gap-2 border-b-2 ${activeTab === 'vehiculos' ? 'border-[#D60006] text-[#D60006]' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}
          >
            <Car size={18} /> Vehículos
          </button>
          <button 
            onClick={() => setActiveTab('configuracion')}
            className={`pb-3 font-semibold text-sm transition-colors flex items-center gap-2 border-b-2 ${activeTab === 'configuracion' ? 'border-[#D60006] text-[#D60006]' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}
          >
            <Settings size={18} /> Configuración de Página
          </button>
        </div>

        {activeTab === 'vehiculos' ? (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <Button onClick={handleNew} className="bg-[#D60006] hover:bg-[#a30005] w-full sm:w-auto">
                <Plus className="mr-2" size={18} /> Nuevo Auto
              </Button>
              <label className="flex items-center justify-center gap-2 text-sm font-medium text-zinc-700 cursor-pointer bg-white px-4 py-2.5 sm:py-2 rounded-lg border border-zinc-200 shadow-sm w-full sm:w-auto">
                <input 
                  type="checkbox" 
                  checked={hideSold} 
                  onChange={(e) => setHideSold(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-300 text-[#D60006] focus:ring-[#D60006]"
                />
                Ocultar vendidos en el listado
              </label>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-zinc-500">Cargando catálogo...</div>
              ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-500 bg-zinc-50 uppercase border-b border-zinc-200">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Vehículo</th>
                      <th className="px-6 py-4 font-semibold">Precio</th>
                      <th className="px-6 py-4 font-semibold">Tipo</th>
                      <th className="px-6 py-4 font-semibold">Estado</th>
                      <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(hideSold ? vehicles.filter(v => v.estado !== 'vendido') : vehicles).map((v) => (
                      <tr key={v.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-zinc-900">{v.marca} {v.modelo}</div>
                          <div className="text-zinc-500">{v.anio} • {v.kilometraje} km</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-zinc-700">USD {v.precio}</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline">{v.tipo}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={() => toggleEstado(v)} className="focus:outline-none">
                            <Badge className={v.estado === 'disponible' ? 'bg-green-100 text-green-700 hover:bg-green-200 border-none' : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300 border-none'}>
                              {v.estado.toUpperCase()}
                            </Badge>
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Link href={`/auto/${v.id}`} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-zinc-800" title="Ver publicación">
                              <ExternalLink size={18} />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(v)} className="text-[#D60006]" title="Editar">
                            <Edit size={18} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(v.id)} className="text-red-600" title="Eliminar">
                            <Trash2 size={18} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {(hideSold ? vehicles.filter(v => v.estado !== 'vendido') : vehicles).length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                          No hay vehículos para mostrar en esta vista.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          </div>
        ) : (
          <BannerSettings />
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingVehicle ? 'Editar Vehículo' : 'Agregar Nuevo Vehículo'}</DialogTitle>
          </DialogHeader>
          <AdminForm 
            vehicle={editingVehicle} 
            onSuccess={() => { setIsModalOpen(false); loadVehicles(); }} 
            onCancel={() => setIsModalOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
