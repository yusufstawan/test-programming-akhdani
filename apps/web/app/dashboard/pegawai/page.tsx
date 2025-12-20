'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
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

export default function PegawaiDashboard() {
  const [perdins, setPerdins] = useState<Perdin[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

    fetchPerdins()
  }, [])

  if (loading) return <div>Memuat data...</div>

  return (
    <AuthGuard allowedRoles={['PEGAWAI', 'SDM', 'ADMIN']}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Daftar Perjalanan Dinas</h1>
          <Link href="/dashboard/pegawai/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Buat Pengajuan Baru
            </Button>
          </Link>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tujuan</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Durasi</TableHead>
                <TableHead>Jarak (km)</TableHead>
                <TableHead>Rute</TableHead>
                <TableHead className="text-right">Uang Saku</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {perdins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                    Belum ada data perjalanan dinas.
                  </TableCell>
                </TableRow>
              ) : (
                perdins.map((perdin) => (
                  <TableRow key={perdin.id}>
                    <TableCell className="font-medium">{perdin.destCity?.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={perdin.purpose}>
                      {perdin.purpose}
                    </TableCell>
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
                      {formatCurrency(perdin.totalAllowance, perdin.destCity?.isOverseas)}
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
