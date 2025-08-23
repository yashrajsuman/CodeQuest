"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, BookOpen, Zap } from "lucide-react"

interface RouteGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function RouteGuard({ children, requireAuth = false, redirectTo }: RouteGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      setIsInitialized(true)

      if (requireAuth && !user) {
        router.push(redirectTo || "/login")
        return
      }

      if (!requireAuth && user) {
        const publicOnlyRoutes = ["/login", "/signup"]
        if (publicOnlyRoutes.includes(pathname)) {
          router.push("/dashboard")
          return
        }
      }
    }
  }, [user, isLoading, requireAuth, router, pathname, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="relative">
              <BookOpen className="h-8 w-8 text-primary animate-float" />
              <Zap className="h-4 w-4 text-accent absolute -top-1 -right-1 animate-pulse-glow" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CodeQuest
            </h1>
          </div>
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (isInitialized) {
    if (requireAuth && !user) {
      return null
    }

    if (!requireAuth && user && ["/login", "/signup"].includes(pathname)) {
      return null
    }
  }

  return <>{children}</>
}
