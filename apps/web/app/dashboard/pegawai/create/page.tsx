'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { City } from '@perdinpro/types'

import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

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
  const [totalDays, setTotalDays] = useState(0)

  useEffect(() => {
    const fetchCities = async () => {
      const res = await api('/master/cities')
      if (res.ok) {
        setCities(await res.json())
      }
    }
    fetchCities()
  }, [])

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)

      if (end >= start) {
        const diffTime = Math.abs(end.getTime() - start.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
        setTotalDays(diffDays)
      } else {
        setTotalDays(0)
      }
    } else {
      setTotalDays(0)
    }
  }, [formData.startDate, formData.endDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (formData.originCityId === formData.destCityId) {
      toast.error('Kota asal dan tujuan tidak boleh sama')
      return
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error('Tanggal pulang tidak boleh sebelum tanggal berangkat')
      return
    }

    setLoading(true)
    try {
      const res = await api('/perdin', {
        method: 'POST',
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success('Pengajuan berhasil dibuat')
        router.push('/dashboard/pegawai')
      } else {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Gagal membuat pengajuan')
      }
    } catch (error: unknown) {
      console.error(error)
      const message = error instanceof Error ? error.message : 'Gagal mengajukan perdin'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <Button
        variant="ghost"
        className="mb-6 pl-0 hover:pl-0 hover:bg-transparent text-gray-500 hover:text-gray-900"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali ke Daftar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Ajukan Perjalanan Dinas</CardTitle>
          <CardDescription>
            Isi formulir di bawah ini untuk mengajukan permohonan perjalanan dinas baru.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="purpose">Keterangan / Maksud Perjalanan</Label>
              <Textarea
                id="purpose"
                required
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                placeholder="Jelaskan maksud dan tujuan perjalanan dinas secara detail..."
                className="w-full min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Kota Asal</Label>
                <Select
                  onValueChange={(val) => setFormData({ ...formData, originCityId: val })}
                  value={formData.originCityId}
                >
                  <SelectTrigger className="w-full">
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
                  <SelectTrigger className="w-full">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate">Tanggal Berangkat</Label>
                <Input
                  id="startDate"
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full"
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
                  className="w-full"
                />
              </div>
            </div>

            {/* Total Days Display */}
            <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Total Durasi Perjalanan:</span>
              <span className="text-lg font-bold text-primary">
                {totalDays > 0 ? `${totalDays} Hari` : '-'}
              </span>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Batal
              </Button>
              <Button type="submit" disabled={loading} className="min-w-[120px]">
                {loading ? 'Menyimpan...' : 'Ajukan Perdin'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
