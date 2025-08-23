"use client"

import type React from "react"

import { RouteGuard } from "./route-guard"

interface PublicRouteProps {
  children: React.ReactNode
}

export function PublicRoute({ children }: PublicRouteProps) {
  return <RouteGuard requireAuth={false}>{children}</RouteGuard>
}
