"use client"

import type React from "react"

import { RouteGuard } from "./route-guard"

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ children, redirectTo = "/login" }: ProtectedRouteProps) {
  return (
    <RouteGuard requireAuth={true} redirectTo={redirectTo}>
      {children}
    </RouteGuard>
  )
}
