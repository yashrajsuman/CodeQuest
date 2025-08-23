"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PasswordStrength } from "@/components/password-strength"
import { PublicRoute } from "@/components/public-route"
import { AuthProvider } from "@/components/auth-provider"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, BookOpen, Zap, CheckCircle } from "lucide-react"

function SignupContent() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signup } = useAuth()
  const router = useRouter()

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      return "Please fill in all fields"
    }

    if (password !== confirmPassword) {
      return "Passwords do not match"
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters long"
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)

    const success = await signup(email, password, name)

    if (success) {
      router.push("/dashboard")
    } else {
      setError("An account with this email already exists")
    }

    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="relative">
              <BookOpen className="h-8 w-8 text-primary animate-float" />
              <Zap className="h-4 w-4 text-accent absolute -top-1 -right-1 animate-pulse-glow" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CodeQuest
            </h1>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Join CodeQuest</h2>
            <p className="text-muted-foreground">Start your interactive learning adventure</p>
          </div>
        </div>

        {/* Signup Form */}
        <Card className="border-2 border-border/50 shadow-2xl backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create account</CardTitle>
            <CardDescription className="text-center">Enter your information to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                  required
                />
                <PasswordStrength password={password} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11"
                  required
                />
                {confirmPassword && password === confirmPassword && (
                  <div className="flex items-center space-x-2 text-green-500">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Passwords match</span>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/login" className="text-primary hover:text-accent transition-colors font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <AuthProvider>
      <PublicRoute>
        <SignupContent />
      </PublicRoute>
    </AuthProvider>
  )
}
