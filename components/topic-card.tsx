"use client"

import type React from "react"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PlayCircle, CheckCircle, Lock, Star, Clock } from "lucide-react"

interface TopicCardProps {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  difficulty: "Easy" | "Medium" | "Hard"
  estimatedTime: string
  xpReward: number
  coinReward: number
  isCompleted: boolean
  isLocked: boolean
  progress: number
  subjectId: string
}

export function TopicCard({
  id,
  title,
  description,
  icon,
  difficulty,
  estimatedTime,
  xpReward,
  coinReward,
  isCompleted,
  isLocked,
  progress,
  subjectId,
}: TopicCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "Medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "Hard":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-200 border-2 relative overflow-hidden ${
        isCompleted
          ? "border-green-500/50 bg-green-500/5"
          : isLocked
            ? "border-muted bg-muted/20"
            : "hover:border-primary/50"
      }`}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      {/* Completion indicator */}
      {isCompleted && (
        <div className="absolute top-4 right-4 z-10">
          <CheckCircle className="h-6 w-6 text-green-500" />
        </div>
      )}

      {/* Lock indicator */}
      {isLocked && (
        <div className="absolute top-4 right-4 z-10">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
      )}

      <CardHeader className="relative">
        <div className="flex items-start space-x-3">
          <div
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isCompleted
                ? "bg-green-500/10 text-green-500"
                : isLocked
                  ? "bg-muted text-muted-foreground"
                  : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
            }`}
          >
            {icon}
          </div>
          <div className="flex-1">
            <CardTitle
              className={`text-lg transition-colors duration-200 ${
                isCompleted ? "text-green-500" : isLocked ? "text-muted-foreground" : "group-hover:text-primary"
              }`}
            >
              {title}
            </CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* Progress bar for in-progress topics */}
        {progress > 0 && progress < 100 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className={getDifficultyColor(difficulty)}>
              {difficulty}
            </Badge>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{estimatedTime}</span>
            </div>
          </div>
        </div>

        {/* Rewards */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">{xpReward} XP</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-4 w-4 rounded-full bg-yellow-500" />
            <span className="font-medium">{coinReward} coins</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {isLocked ? (
            <Button disabled className="w-full">
              <Lock className="h-4 w-4 mr-2" />
              Locked
            </Button>
          ) : isCompleted ? (
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href={`/game/${subjectId}/${id}`}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Review
              </Link>
            </Button>
          ) : (
            <Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
              <Link href={`/game/${subjectId}/${id}`}>
                <PlayCircle className="h-4 w-4 mr-2" />
                {progress > 0 ? "Continue" : "Start"}
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
