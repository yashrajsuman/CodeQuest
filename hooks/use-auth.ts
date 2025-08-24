"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { dataManager } from "@/lib/data-manager"
import type { User, UserPreferences } from "@/lib/types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  updateUserProgress: (xp: number, coins: number, badges?: string[]) => void
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function useAuthLogic(): AuthContextType {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing user in localStorage
    const savedUser = dataManager.getCurrentUser()
    if (savedUser) {
      setUser(savedUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user exists
    const users = dataManager.getUsers()
    const existingUser = users.find((u: any) => u.email === email && u.password === password)

    if (existingUser) {
      const { password: _, ...userWithoutPassword } = existingUser
      const updatedUser = {
        ...userWithoutPassword,
        lastLoginAt: new Date().toISOString(),
      }

      setUser(updatedUser)
      dataManager.saveUser({ ...updatedUser, password }) // Save with password for future logins
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const users = dataManager.getUsers()
    const existingUser = users.find((u: any) => u.email === email)

    if (existingUser) {
      setIsLoading(false)
      return false
    }

    // Create new user with enhanced data structure
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      level: 1,
      coins: 100,
      xp: 0,
      badges: ["Welcome"],
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      preferences: {
        theme: "dark",
        notifications: true,
        soundEffects: true,
        autoSave: true,
      },
    }

    // Save user with password for authentication
    dataManager.saveUser({ ...newUser, password })

    setUser(newUser)
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    dataManager.clearCurrentUser()
  }

  const updateUserProgress = (xp: number, coins: number, badges?: string[]) => {
    if (!user) return

    const updatedUser: User = {
      ...user,
      xp: user.xp + xp,
      coins: user.coins + coins,
      level: Math.floor((user.xp + xp) / 1000) + 1,
      badges: badges ? [...user.badges, ...badges] : user.badges,
    }

    setUser(updatedUser)
    dataManager.saveUser({ ...updatedUser, password: (dataManager.getCurrentUser() as any)?.password })

    // Update in users array for authentication
    const users = dataManager.getUsers()
    const userIndex = users.findIndex((u: any) => u.id === user.id)
    if (userIndex !== -1) {
      const userWithPassword = users.find((u: any) => u.id === user.id)
      if (userWithPassword) {
        const updatedUserWithPassword = { ...updatedUser, password: userWithPassword.password }
        users[userIndex] = updatedUserWithPassword
        localStorage.setItem("codequest-users", JSON.stringify(users))
      }
    }
  }

  const updateUserPreferences = (preferences: Partial<UserPreferences>) => {
    if (!user) return

    const updatedUser: User = {
      ...user,
      preferences: { ...user.preferences, ...preferences },
    }

    setUser(updatedUser)
    dataManager.saveUser({ ...updatedUser, password: (dataManager.getCurrentUser() as any)?.password })
  }

  return {
    user,
    login,
    signup,
    logout,
    updateUserProgress,
    updateUserPreferences,
    isLoading,
  }
}

export { AuthContext }
