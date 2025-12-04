import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 text-center">
      <div className="rounded-full bg-gray-100 p-6 mb-6">
        <FileQuestion className="h-12 w-12 text-gray-500" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <Link href="/dashboard">
        <Button>Kembali ke Dasbor</Button>
      </Link>
    </div>
  )
}
