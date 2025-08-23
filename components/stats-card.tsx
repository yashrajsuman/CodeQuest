"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { ReactNode } from "react"

interface StatsCardProps {
  title: string
  value: string | number | ReactNode
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function StatsCard({ title, value, description, icon: Icon, trend }: StatsCardProps) {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          {title}
        </CardTitle>
        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
          <Icon className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-2xl font-bold group-hover:scale-105 transition-transform duration-300 bg-gradient-to-r from-foreground to-primary bg-clip-text group-hover:text-transparent">
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 group-hover:text-foreground/70 transition-colors duration-300">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center mt-2 space-x-1">
            <div
              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                trend.isPositive
                  ? "bg-green-500/10 text-green-500 group-hover:bg-green-500/20"
                  : "bg-red-500/10 text-red-500 group-hover:bg-red-500/20"
              }`}
            >
              {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
            </div>
            <span className="text-xs text-muted-foreground">from last week</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
