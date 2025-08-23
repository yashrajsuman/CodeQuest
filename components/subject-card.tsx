"use client"

import type React from "react"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlayCircle, Trophy, Clock, Lock, Sparkles } from "lucide-react"

interface SubjectCardProps {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  progress: number
  totalTopics: number
  completedTopics: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  estimatedTime: string
  isLocked?: boolean
}

export function SubjectCard({
  id,
  title,
  description,
  icon,
  progress,
  totalTopics,
  completedTopics,
  difficulty,
  estimatedTime,
  isLocked = false,
}: SubjectCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "Intermediate":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "Advanced":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const isCompleted = completedTopics === totalTopics

  return (
    <Card
      className={`group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 relative overflow-hidden transform hover:scale-[1.02] ${
        isLocked ? "opacity-60" : ""
      } ${isCompleted ? "ring-2 ring-yellow-500/20" : ""}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {isCompleted && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent animate-pulse" />
      )}

      {isCompleted && (
        <div className="absolute top-2 right-2 animate-bounce">
          <Sparkles className="h-4 w-4 text-yellow-500" />
        </div>
      )}

      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-lg transition-all duration-300 ${
                isLocked
                  ? "bg-muted text-muted-foreground"
                  : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-3"
              }`}
            >
              {isLocked ? <Lock className="h-5 w-5" /> : icon}
            </div>
            <div>
              <CardTitle
                className={`text-lg transition-all duration-300 ${
                  isCompleted
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent"
                    : "group-hover:text-primary"
                }`}
              >
                {title}
              </CardTitle>
              <CardDescription className="mt-1 group-hover:text-foreground/80 transition-colors duration-300">
                {description}
              </CardDescription>
            </div>
          </div>
          {isCompleted && (
            <div className="animate-pulse">
              <Trophy className="h-5 w-5 text-yellow-500 drop-shadow-sm" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {completedTopics}/{totalTopics} topics
            </span>
          </div>
          <div className="relative">
            <Progress value={progress} className="h-2 transition-all duration-500" />
            {progress > 50 && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-sm opacity-50" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge
              variant="outline"
              className={`${getDifficultyColor(difficulty)} transition-all duration-300 group-hover:scale-105`}
            >
              {difficulty}
            </Badge>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">
              <Clock className="h-4 w-4" />
              <span>{estimatedTime}</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          {isLocked ? (
            <Button disabled className="w-full opacity-50">
              <Lock className="h-4 w-4 mr-2" />
              Locked
            </Button>
          ) : (
            <Button
              asChild
              className={`w-full transition-all duration-300 group-hover:shadow-lg ${
                isCompleted
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                  : "group-hover:bg-primary group-hover:text-primary-foreground"
              }`}
            >
              <Link href={`/subjects/${id}`}>
                <PlayCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                {isCompleted ? "Review & Practice" : progress > 0 ? "Continue Learning" : "Start Learning"}
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
