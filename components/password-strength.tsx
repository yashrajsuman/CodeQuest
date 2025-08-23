"use client"

import { Progress } from "@/components/ui/progress"

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const getStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    return strength
  }

  const getStrengthText = (strength: number) => {
    if (strength === 0) return { text: "", color: "" }
    if (strength <= 25) return { text: "Weak", color: "text-destructive" }
    if (strength <= 50) return { text: "Fair", color: "text-yellow-500" }
    if (strength <= 75) return { text: "Good", color: "text-blue-500" }
    return { text: "Strong", color: "text-green-500" }
  }

  const strength = getStrength(password)
  const { text, color } = getStrengthText(strength)

  if (!password) return null

  return (
    <div className="space-y-2">
      <Progress value={strength} className="h-2" />
      <p className={`text-sm ${color}`}>Password strength: {text}</p>
    </div>
  )
}
