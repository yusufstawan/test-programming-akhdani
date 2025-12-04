'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { City } from '@repo/types'

export default function CreatePerdinPage() {
  const router = useRouter()
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    purpose: '',
    startDate: '',
    endDate: '',
    originCityId: '',
    destCityId: '',
  })

  useEffect(() => {
    const fetchCities = async () => {
      const res = await api('/master/cities')
      if (res.ok) {
        setCities(await res.json())
      }
    }
    fetchCities()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (formData.originCityId === formData.destCityId) {
      alert('Kota asal dan tujuan tidak boleh sama')
      return
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      alert('Tanggal pulang tidak boleh sebelum tanggal berangkat')
      return
    }

    setLoading(true)
    try {
      const res = await api('/perdin', {
        method: 'POST',
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to create perdin')
      }

      router.push('/dashboard/pegawai')
    } catch (error: unknown) {
      console.error(error)
      const message = error instanceof Error ? error.message : 'Gagal mengajukan perdin'
      alert(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Ajukan Perjalanan Dinas</h1>

      <form onSubmit={handleSubmit} className="space-y-6 border p-6 rounded-lg bg-white shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="purpose">Maksud & Tujuan</Label>
          <Input
            id="purpose"
            required
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            placeholder="Contoh: Meeting dengan klien X"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Tanggal Berangkat</Label>
            <Input
              id="startDate"
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">Tanggal Pulang</Label>
            <Input
              id="endDate"
              type="date"
              required
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Kota Asal</Label>
            <Select
              onValueChange={(val) => setFormData({ ...formData, originCityId: val })}
              value={formData.originCityId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kota Asal" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Kota Tujuan</Label>
            <Select
              onValueChange={(val) => setFormData({ ...formData, destCityId: val })}
              value={formData.destCityId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kota Tujuan" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Ajukan Perdin'}
          </Button>
        </div>
      </form>
    </div>
  )
}
