'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface User {
  username: string
  role: string
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(userData))
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    // Clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'

    router.push('/login')
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-100 p-6 border-r">
        <div className="mb-8">
          <h2 className="text-xl font-bold">Perdin App</h2>
          <p className="text-sm text-gray-500">Welcome, {user?.username}</p>
          <p className="text-xs text-gray-400 uppercase">{user?.role}</p>
        </div>

        <nav className="flex flex-col gap-2">
          {user?.role === 'PEGAWAI' && (
            <>
              <Link href="/dashboard/pegawai">
                <Button variant="ghost" className="w-full justify-start">
                  Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/pegawai/create">
                <Button variant="ghost" className="w-full justify-start">
                  Ajukan Perdin
                </Button>
              </Link>
            </>
          )}

          {user?.role === 'SDM' && (
            <Link href="/dashboard/sdm">
              <Button variant="ghost" className="w-full justify-start">
                Approval List
              </Button>
            </Link>
          )}

          {user?.role === 'ADMIN' && (
            <Link href="/dashboard/admin">
              <Button variant="ghost" className="w-full justify-start">
                User Management
              </Button>
            </Link>
          )}

          <div className="mt-8">
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
