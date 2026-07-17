"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Vehicle } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ImageUploader, { ImageItem } from "./ImageUploader"

export default function AdminForm({ vehicle, onSuccess, onCancel }: { vehicle?: Vehicle | null, onSuccess: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false)
  const [imageItems, setImageItems] = useState<ImageItem[]>([])
  
  const [formData, setFormData] = useState({
    marca: vehicle?.marca || "",
    modelo: vehicle?.modelo || "",
    anio: vehicle?.anio || new Date().getFullYear(),
    precio: vehicle?.precio || "",
    kilometraje: vehicle?.kilometraje || "",
    combustible: vehicle?.combustible || "Nafta",
    transmision: vehicle?.transmision || "Manual",
    tipo: vehicle?.tipo || "Auto",
    descripcion: vehicle?.descripcion || "",
    estado: vehicle?.estado || "disponible",
    otros: vehicle?.otros || "",
    dueno: vehicle?.dueno || "omitir",
    fotosExistentes: vehicle?.fotos || []
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSelect = (name: string, value: string | null) => {
    if (value) setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Upload new photos and preserve order
      const finalUrls: string[] = []
      
      for (const item of imageItems) {
        if (item.type === "url" && item.url) {
          finalUrls.push(item.url)
        } else if (item.type === "file" && item.file) {
          const fileExt = item.file.name.split('.').pop()
          const fileName = `${Math.random()}.${fileExt}`
          const filePath = `${fileName}`
          
          const { error: uploadError } = await supabase.storage
            .from('autos-fotos')
            .upload(filePath, item.file)
            
          if (uploadError) throw uploadError
          
          const { data: { publicUrl } } = supabase.storage
            .from('autos-fotos')
            .getPublicUrl(filePath)
            
          finalUrls.push(publicUrl)
        }
      }

      // 2. Save vehicle
      const dataToSave = {
        marca: formData.marca,
        modelo: formData.modelo,
        anio: parseInt(String(formData.anio)),
        precio: parseFloat(String(formData.precio)),
        kilometraje: parseInt(String(formData.kilometraje)),
        combustible: formData.combustible,
        transmision: formData.transmision,
        tipo: formData.tipo,
        descripcion: formData.descripcion,
        estado: formData.estado,
        otros: formData.otros,
        dueno: formData.dueno === "omitir" ? "" : formData.dueno,
        fotos: finalUrls
      }

      if (vehicle) {
        const { error } = await supabase.from('vehicles').update(dataToSave).eq('id', vehicle.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('vehicles').insert([dataToSave])
        if (error) throw error
      }

      onSuccess()
    } catch (error: any) {
      alert("Error al guardar: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Marca</label>
          <Input required name="marca" list="marcas-list" value={formData.marca} onChange={handleChange} placeholder="Ej: Volkswagen, Suzuki..." />
          <datalist id="marcas-list">
            <option value="Volkswagen" />
            <option value="Suzuki" />
            <option value="Toyota" />
            <option value="Fiat" />
            <option value="Peugeot" />
            <option value="Chevrolet" />
            <option value="Nissan" />
            <option value="Renault" />
            <option value="Ford" />
            <option value="Hyundai" />
            <option value="Citroën" />
            <option value="Honda" />
            <option value="BMW" />
            <option value="Mercedes-Benz" />
          </datalist>
        </div>
        <div>
          <label className="text-sm font-medium">Modelo</label>
          <Input required name="modelo" value={formData.modelo} onChange={handleChange} />
        </div>
        <div>
          <label className="text-sm font-medium">Año</label>
          <Input required type="number" name="anio" value={formData.anio} onChange={handleChange} />
        </div>
        <div>
          <label className="text-sm font-medium">Precio (USD)</label>
          <Input required type="number" name="precio" value={formData.precio} onChange={handleChange} />
        </div>
        <div>
          <label className="text-sm font-medium">Kilómetros</label>
          <Input required type="number" name="kilometraje" value={formData.kilometraje} onChange={handleChange} />
        </div>
        <div>
          <label className="text-sm font-medium">Dueños</label>
          <Select value={formData.dueno} onValueChange={(v) => handleSelect("dueno", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Único dueño">Único dueño</SelectItem>
              <SelectItem value="Segundo dueño">Segundo dueño</SelectItem>
              <SelectItem value="omitir">Omitir</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Tipo</label>
          <Select value={formData.tipo} onValueChange={(v) => handleSelect("tipo", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Auto">Auto</SelectItem>
              <SelectItem value="Camioneta">Camioneta</SelectItem>
              <SelectItem value="Moto">Moto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Combustible</label>
          <Select value={formData.combustible} onValueChange={(v) => handleSelect("combustible", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Nafta">Nafta</SelectItem>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="Eléctrico">Eléctrico</SelectItem>
              <SelectItem value="Híbrido">Híbrido</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Transmisión</label>
          <Select value={formData.transmision} onValueChange={(v) => handleSelect("transmision", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Manual">Manual</SelectItem>
              <SelectItem value="Automática">Automática</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Estado</label>
          <Select value={formData.estado} onValueChange={(v) => handleSelect("estado", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="disponible">Disponible</SelectItem>
              <SelectItem value="vendido">Vendido</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Otros detalles / Equipamiento</label>
          <Textarea name="otros" value={formData.otros} onChange={handleChange} className="h-20" placeholder="Ej: Aire acondicionado, Dirección hidráulica..." />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Descripción Principal</label>
          <Textarea required name="descripcion" value={formData.descripcion} onChange={handleChange} className="h-32" />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block mb-2">Fotos del Vehículo</label>
        <ImageUploader 
          initialImages={formData.fotosExistentes} 
          onChange={(items) => setImageItems(items)} 
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Vehículo"}
        </Button>
      </div>
    </form>
  )
}
