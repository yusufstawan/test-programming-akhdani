'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import AuthGuard from '@/components/auth-guard'
import { City } from '@repo/types'

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCity, setEditingCity] = useState<City | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    province: '',
    island: '',
    isOverseas: 'false',
  })

  const fetchCities = async () => {
    try {
      const res = await api('/master/cities')
      if (res.ok) {
        const data = await res.json()
        setCities(data)
      }
    } catch (error) {
      console.error('Failed to fetch cities', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCities()
  }, [])

  const handleOpenDialog = (city?: City) => {
    if (city) {
      setEditingCity(city)
      setFormData({
        name: city.name,
        latitude: city.latitude.toString(),
        longitude: city.longitude.toString(),
        province: city.province,
        island: city.island,
        isOverseas: city.isOverseas.toString(),
      })
    } else {
      setEditingCity(null)
      setFormData({
        name: '',
        latitude: '',
        longitude: '',
        province: '',
        island: '',
        isOverseas: 'false',
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      isOverseas: formData.isOverseas === 'true',
    }

    try {
      let res
      if (editingCity) {
        res = await api(`/master/cities/${editingCity.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        })
      } else {
        res = await api('/master/cities', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }

      if (res.ok) {
        fetchCities()
        setIsDialogOpen(false)
        toast.success(editingCity ? 'City updated successfully' : 'City created successfully')
      } else {
        toast.error('Failed to save city')
      }
    } catch (error) {
      console.error('Error saving city', error)
      toast.error('Error saving city')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this city?')) return

    try {
      const res = await api(`/master/cities/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchCities()
        toast.success('City deleted successfully')
      } else {
        toast.error('Failed to delete city')
      }
    } catch (error) {
      console.error('Error deleting city', error)
      toast.error('Error deleting city')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <AuthGuard allowedRoles={['ADMIN', 'SDM']}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Master Data Kota</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>Tambah Kota</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCity ? 'Edit Kota' : 'Tambah Kota'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Kota</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Provinsi</Label>
                  <Input
                    id="province"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="island">Pulau</Label>
                  <Input
                    id="island"
                    value={formData.island}
                    onChange={(e) => setFormData({ ...formData, island: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isOverseas">Luar Negeri?</Label>
                  <Select
                    value={formData.isOverseas}
                    onValueChange={(val) => setFormData({ ...formData, isOverseas: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Tidak</SelectItem>
                      <SelectItem value="true">Ya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="submit">Simpan</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Kota</TableHead>
                <TableHead>Provinsi</TableHead>
                <TableHead>Pulau</TableHead>
                <TableHead>Luar Negeri</TableHead>
                <TableHead>Koordinat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cities.map((city) => (
                <TableRow key={city.id}>
                  <TableCell className="font-medium">{city.name}</TableCell>
                  <TableCell>{city.province}</TableCell>
                  <TableCell>{city.island}</TableCell>
                  <TableCell>{city.isOverseas ? 'Ya' : 'Tidak'}</TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {city.latitude}, {city.longitude}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog(city)}>
                      Ubah
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(city.id)}
                    >
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AuthGuard>
  )
}
