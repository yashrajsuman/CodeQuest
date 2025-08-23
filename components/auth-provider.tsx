"use client"

import type React from "react"

import { AuthContext, useAuthLogic } from "@/hooks/use-auth"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthLogic()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
