"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { AnimatedCounter } from "@/components/animated-counter"
import { Coins, Zap, Trophy, Target, Sparkles } from "lucide-react"

interface GameHUDProps {
  currentXP?: number
  currentCoins?: number
  sessionProgress?: number
  topicTitle?: string
}

export function GameHUD({ currentXP = 0, currentCoins = 0, sessionProgress = 0, topicTitle }: GameHUDProps) {
  const { user } = useAuth()

  if (!user) return null

  const totalXP = user.xp + currentXP
  const totalCoins = user.coins + currentCoins
  const xpToNextLevel = user.level * 1000 - totalXP
  const xpProgress = ((totalXP % 1000) / 1000) * 100

  return (
    <Card className="sticky top-4 z-10 border-2 border-primary/20 bg-card/95 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 shadow-lg hover:shadow-xl animate-in slide-in-from-top duration-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 group">
            <Target className="h-5 w-5 text-primary group-hover:animate-pulse" />
            <span className="font-semibold bg-gradient-to-r from-foreground to-primary bg-clip-text group-hover:text-transparent transition-all duration-300">
              {topicTitle || "Game Arena"}
            </span>
            <Sparkles className="h-4 w-4 text-accent animate-pulse opacity-70" />
          </div>
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
          >
            Level {user.level}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 bg-muted/50 rounded-lg p-2 hover:bg-primary/5 hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="p-1 rounded-full bg-primary/10 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
              <Zap className="h-4 w-4 text-primary group-hover:text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium">
                  <AnimatedCounter value={totalXP} />
                </span>
                {currentXP > 0 && (
                  <span className="text-xs text-green-500 font-medium animate-in slide-in-from-right duration-300">
                    +{currentXP}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">XP</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-muted/50 rounded-lg p-2 hover:bg-yellow-500/5 hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="p-1 rounded-full bg-yellow-500/10 group-hover:bg-yellow-500 group-hover:scale-110 transition-all duration-300">
              <Coins className="h-4 w-4 text-yellow-500 group-hover:text-white group-hover:animate-bounce" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium">
                  <AnimatedCounter value={totalCoins} />
                </span>
                {currentCoins > 0 && (
                  <span className="text-xs text-green-500 font-medium animate-in slide-in-from-right duration-300 delay-100">
                    +{currentCoins}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">Coins</div>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Level {user.level}</span>
            <span>{xpToNextLevel} XP to next level</span>
          </div>
          <div className="relative">
            <Progress value={xpProgress} className="h-2 transition-all duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-sm opacity-50 animate-pulse" />
          </div>
        </div>

        {sessionProgress > 0 && (
          <div className="space-y-2 animate-in slide-in-from-bottom duration-500 delay-200">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Session Progress</span>
              <span className="font-medium text-primary">
                <AnimatedCounter value={sessionProgress} suffix="%" />
              </span>
            </div>
            <div className="relative">
              <Progress value={sessionProgress} className="h-2 bg-accent/20" />
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-purple-500 to-accent rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${sessionProgress}%` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse rounded-full" />
            </div>
          </div>
        )}

        {user.badges.length > 0 && (
          <div className="flex items-center space-x-2 mt-4 p-2 bg-accent/10 rounded-lg hover:bg-accent/20 transition-all duration-300 cursor-pointer group animate-in slide-in-from-bottom duration-500 delay-300">
            <div className="p-1 rounded-full bg-accent/20 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
              <Trophy className="h-4 w-4 text-accent group-hover:text-white group-hover:animate-bounce" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">Latest Badge</div>
              <div className="text-sm font-medium bg-gradient-to-r from-accent to-primary bg-clip-text group-hover:text-transparent transition-all duration-300">
                {user.badges[user.badges.length - 1]}
              </div>
            </div>
            <Sparkles className="h-3 w-3 text-accent animate-pulse opacity-60" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
