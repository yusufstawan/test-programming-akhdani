"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/login")
      return
    }

    const user = JSON.parse(userData)
    
    if (!allowedRoles.includes(user.role)) {
      // Redirect to their appropriate dashboard if unauthorized
      if (user.role === "PEGAWAI") {
        router.push("/dashboard/pegawai")
      } else if (user.role === "SDM") {
        router.push("/dashboard/sdm")
      } else if (user.role === "ADMIN") {
        router.push("/dashboard/admin")
      } else {
        router.push("/login")
      }
    } else {
      setAuthorized(true)
    }
  }, [router, allowedRoles])

  if (!authorized) {
    return <div className="flex h-screen items-center justify-center">Checking access...</div>
  }

  return <>{children}</>
}
