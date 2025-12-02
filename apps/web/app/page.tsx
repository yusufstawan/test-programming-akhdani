import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-blue-50 to-white text-center p-4">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-blue-900">
          Sistem Informasi Perjalanan Dinas
        </h1>
        <p className="text-xl text-gray-600">
          Kelola pengajuan, persetujuan, dan pelaporan perjalanan dinas pegawai dengan mudah dan efisien.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/login">
            <Button size="lg" className="px-8">
              Login ke Dashboard
            </Button>
          </Link>
        </div>
      </div>
      
      <footer className="absolute bottom-4 text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Test Programming Akhdani. All rights reserved.
      </footer>
    </div>
  )
}
