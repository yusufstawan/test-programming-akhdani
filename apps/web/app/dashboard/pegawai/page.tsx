"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AuthGuard from "@/components/auth-guard"

interface Perdin {
  id: string
  purpose: string
  startDate: string
  endDate: string
  totalDays: number
  originCity: {
    name: string
  }
  destCity: {
    name: string
  }
  status: string
  totalAllowance: number
}

export default function PegawaiDashboard() {
  const [perdins, setPerdins] = useState<Perdin[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPerdins = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:8080/perdin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.ok) {
          const data = await res.json()
          setPerdins(data)
        }
      } catch (error) {
        console.error("Failed to fetch perdins", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPerdins()
  }, [])

  if (loading) return <div>Loading data...</div>

  return (
    <AuthGuard allowedRoles={['PEGAWAI', 'SDM', 'ADMIN']}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Riwayat Perjalanan Dinas</h1>
          <Link href="/dashboard/pegawai/create">
            <Button>+ Ajukan Perdin</Button>
          </Link>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tujuan</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Durasi</TableHead>
                <TableHead>Kota Asal</TableHead>
                <TableHead>Kota Tujuan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Uang Saku</TableHead>
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
                    <TableCell className="font-medium">{perdin.purpose}</TableCell>
                    <TableCell>
                      {new Date(perdin.startDate).toLocaleDateString()} - {new Date(perdin.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{perdin.totalDays} Hari</TableCell>
                    <TableCell>{perdin.originCity.name}</TableCell>
                    <TableCell>{perdin.destCity.name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        perdin.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        perdin.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {perdin.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {/* Simple formatting, assuming IDR for now as per PRD mostly */}
                      Rp {perdin.totalAllowance.toLocaleString('id-ID')}
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
