'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  LayoutDashboard,
  PlusCircle,
  FileCheck,
  Users,
  MapPin,
  LogOut,
  Building2,
  LucideIcon,
  Menu,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface User {
  username: string
  role: string
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
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

  const SidebarLink = ({
    href,
    icon: Icon,
    children,
  }: {
    href: string
    icon: LucideIcon
    children: React.ReactNode
  }) => {
    const isActive = pathname === href
    return (
      <Link href={href} className="w-full">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start gap-3 px-4 py-6 text-base font-medium transition-colors',
            isActive
              ? 'bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          )}
        >
          <Icon className="h-5 w-5" />
          {children}
        </Button>
      </Link>
    )
  }

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="p-6 border-b flex items-center gap-3">
        <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
          <Building2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">PerdinPro</h2>
          <p className="text-xs text-gray-500">Sistem Manajemen</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {user?.role === 'PEGAWAI' && (
          <>
            <SidebarLink href="/dashboard/pegawai" icon={LayoutDashboard}>
              Dasbor
            </SidebarLink>
            <SidebarLink href="/dashboard/pegawai/create" icon={PlusCircle}>
              Ajukan Perdin
            </SidebarLink>
          </>
        )}

        {user?.role === 'SDM' && (
          <SidebarLink href="/dashboard/sdm" icon={FileCheck}>
            Daftar Persetujuan
          </SidebarLink>
        )}

        {user?.role === 'ADMIN' && (
          <SidebarLink href="/dashboard/admin" icon={Users}>
            Manajemen Pengguna
          </SidebarLink>
        )}

        {(user?.role === 'ADMIN' || user?.role === 'SDM') && (
          <SidebarLink href="/dashboard/cities" icon={MapPin}>
            Master Kota
          </SidebarLink>
        )}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
            {user?.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.username}</p>
            <p className="text-xs text-gray-500 uppercase truncate">{user?.role}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-3 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </Button>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden p-4 bg-white border-b flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg">PerdinPro</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <div className="flex flex-col h-full">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 bg-white border-r shadow-sm flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-65px)] md:h-screen">
        {children}
      </main>
    </div>
  )
}
