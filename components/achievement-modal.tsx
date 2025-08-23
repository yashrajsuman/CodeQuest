"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedCounter } from "@/components/animated-counter"
import type { Achievement } from "@/lib/types"
import { Trophy, Star, Coins, Sparkles, PartyPopper } from "lucide-react"
import { useEffect, useState } from "react"

interface AchievementModalProps {
  achievements: Achievement[]
  isOpen: boolean
  onClose: () => void
}

export function AchievementModal({ achievements, isOpen, onClose }: AchievementModalProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen && achievements.length > 0) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, achievements.length])

  if (achievements.length === 0) return null

  const totalXP = achievements.reduce((acc, achievement) => acc + achievement.rewards.xp, 0)
  const totalCoins = achievements.reduce((acc, achievement) => acc + achievement.rewards.coins, 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md relative overflow-hidden">
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-500 rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            />
            <div
              className="absolute top-0 right-1/4 w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="absolute top-1/4 left-1/3 w-1 h-1 bg-accent rounded-full animate-ping"
              style={{ animationDelay: "0.4s" }}
            />
            <div
              className="absolute top-1/4 right-1/3 w-1 h-1 bg-green-500 rounded-full animate-ping"
              style={{ animationDelay: "0.6s" }}
            />
            <div
              className="absolute top-1/2 left-1/5 w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.8s" }}
            />
            <div
              className="absolute top-1/2 right-1/5 w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"
              style={{ animationDelay: "1s" }}
            />
          </div>
        )}

        <DialogHeader className="relative z-10">
          <DialogTitle className="flex items-center justify-center space-x-2 text-center animate-in zoom-in duration-500">
            <div className="relative">
              <Trophy className="h-6 w-6 text-yellow-500 animate-bounce" />
              <Sparkles className="h-3 w-3 text-accent absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 bg-clip-text text-transparent">
              Achievement{achievements.length > 1 ? "s" : ""} Unlocked!
            </span>
            <PartyPopper className="h-5 w-5 text-primary animate-pulse" />
          </DialogTitle>
          <DialogDescription className="text-center animate-in slide-in-from-bottom duration-700 delay-200">
            Congratulations on your amazing progress!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 relative z-10">
          {achievements.map((achievement, index) => (
            <Card
              key={achievement.id}
              className="border-2 border-yellow-500/20 bg-yellow-500/5 hover:border-yellow-500/40 hover:bg-yellow-500/10 transition-all duration-300 hover:scale-105 animate-in slide-in-from-left duration-500"
              style={{ animationDelay: `${300 + index * 200}ms` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl animate-bounce" style={{ animationDelay: `${500 + index * 200}ms` }}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-600 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                      >
                        <Star className="h-3 w-3 mr-1 animate-pulse" />
                        +<AnimatedCounter value={achievement.rewards.xp} /> XP
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500 hover:text-white transition-all duration-300 hover:scale-110"
                      >
                        <Coins className="h-3 w-3 mr-1 animate-bounce" />
                        +<AnimatedCounter value={achievement.rewards.coins} />
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="text-center p-4 bg-gradient-to-r from-muted/50 via-primary/5 to-muted/50 rounded-lg border border-primary/20 animate-in slide-in-from-bottom duration-700 delay-500">
            <div className="text-sm text-muted-foreground mb-2 flex items-center justify-center space-x-1">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>Total Rewards</span>
              <Sparkles className="h-4 w-4 animate-pulse" />
            </div>
            <div className="flex justify-center space-x-6">
              <div className="flex items-center space-x-1 group">
                <div className="p-1 rounded-full bg-primary/10 group-hover:bg-primary transition-all duration-300">
                  <Star className="h-4 w-4 text-primary group-hover:text-primary-foreground" />
                </div>
                <span className="font-semibold text-primary text-lg">
                  +<AnimatedCounter value={totalXP} duration={1500} /> XP
                </span>
              </div>
              <div className="flex items-center space-x-1 group">
                <div className="p-1 rounded-full bg-yellow-500/10 group-hover:bg-yellow-500 transition-all duration-300">
                  <Coins className="h-4 w-4 text-yellow-500 group-hover:text-white" />
                </div>
                <span className="font-semibold text-yellow-600 text-lg">
                  +<AnimatedCounter value={totalCoins} duration={1500} /> Coins
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-primary via-purple-500 to-accent hover:from-primary/90 hover:via-purple-500/90 hover:to-accent/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-in slide-in-from-bottom duration-700 delay-700"
          >
            <Trophy className="h-4 w-4 mr-2 animate-bounce" />
            Continue Learning
            <Sparkles className="h-4 w-4 ml-2 animate-pulse" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
