'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import AuthGuard from '@/components/auth-guard'
import { Perdin } from '@perdinpro/types'

export default function SDMDashboard() {
  const [perdins, setPerdins] = useState<Perdin[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPerdins = async () => {
    try {
      const res = await api('/perdin')
      if (res.ok) {
        const data = await res.json()
        setPerdins(data)
      }
    } catch (error) {
      console.error('Failed to fetch perdins', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPerdins()
  }, [])

  const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await api(`/perdin/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        fetchPerdins() // Refresh list
        toast.success('Status berhasil diperbarui')
      } else {
        toast.error('Gagal memperbarui status')
      }
    } catch (error) {
      console.error(error)
      toast.error('Terjadi kesalahan saat memperbarui status')
    }
  }

  if (loading) return <div>Memuat data...</div>

  return (
    <AuthGuard allowedRoles={['SDM', 'ADMIN']}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Daftar Persetujuan Perdin</h1>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pegawai</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead>Tujuan</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Durasi</TableHead>
                <TableHead>Jarak (km)</TableHead>
                <TableHead>Rute</TableHead>
                <TableHead className="text-right">Uang Saku</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {perdins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10 text-gray-500">
                    Belum ada data perjalanan dinas.
                  </TableCell>
                </TableRow>
              ) : (
                perdins.map((perdin) => (
                  <TableRow key={perdin.id}>
                    <TableCell className="font-medium">{perdin.user?.username}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={perdin.purpose}>
                      {perdin.purpose}
                    </TableCell>
                    <TableCell>{perdin.destCity?.name}</TableCell>
                    <TableCell>
                      {new Date(perdin.startDate).toLocaleDateString('id-ID')} -{' '}
                      {new Date(perdin.endDate).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>{perdin.totalDays} Hari</TableCell>
                    <TableCell>{Math.round(perdin.distance).toLocaleString('id-ID')} km</TableCell>
                    <TableCell>
                      {perdin.originCity?.name} ➝ {perdin.destCity?.name}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(perdin.totalAllowance, perdin.destCity?.isOverseas)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          perdin.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : perdin.status === 'REJECTED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {perdin.status === 'APPROVED'
                          ? 'Disetujui'
                          : perdin.status === 'REJECTED'
                            ? 'Ditolak'
                            : 'Menunggu Persetujuan'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {perdin.status === 'PENDING' && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => handleStatusUpdate(perdin.id, 'APPROVED')}
                          >
                            Setujui
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleStatusUpdate(perdin.id, 'REJECTED')}
                          >
                            Tolak
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AuthGuard>
  )
}
