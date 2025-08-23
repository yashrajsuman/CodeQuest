"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/hooks/use-auth"
import { BookOpen, Home, TrendingUp, Award, LogOut, Menu, X, Coins, Zap, User, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Subjects", href: "/subjects", icon: BookOpen },
  { name: "Progress", href: "/progress", icon: TrendingUp },
  { name: "Badges", href: "/badges", icon: Award },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  if (!user) return null

  const xpToNextLevel = user.level * 1000 - user.xp
  const xpProgress = ((user.xp % 1000) / 1000) * 100

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden hover:scale-110 transition-all duration-200 bg-background/80 backdrop-blur-sm border"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative">
          {isOpen ? (
            <X className="h-5 w-5 animate-in spin-in-180 duration-200" />
          ) : (
            <Menu className="h-5 w-5 animate-in fade-in duration-200" />
          )}
        </div>
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-72 bg-sidebar border-r border-sidebar-border transform transition-all duration-300 ease-out md:translate-x-0 shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-sidebar-border animate-in slide-in-from-top duration-500">
            <div className="flex items-center space-x-2 mb-6 group">
              <div className="relative">
                <BookOpen className="h-6 w-6 text-sidebar-primary transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <Zap className="h-3 w-3 text-accent absolute -top-1 -right-1 animate-pulse" />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-sidebar-primary via-purple-500 to-accent bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                CodeQuest
              </h1>
            </div>

            <div className="space-y-4 animate-in slide-in-from-left duration-700 delay-200">
              <div className="flex items-center space-x-3 group">
                <Avatar className="h-12 w-12 border-2 border-sidebar-primary group-hover:border-accent transition-all duration-300 group-hover:scale-105">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground group-hover:bg-accent transition-colors duration-300">
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate group-hover:text-accent transition-colors duration-300">
                    {user.name}
                  </p>
                  <p className="text-xs text-sidebar-foreground/70">Level {user.level}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 bg-sidebar-accent rounded-lg p-2 hover:bg-yellow-500/10 hover:scale-105 transition-all duration-300 cursor-pointer group">
                  <Coins className="h-4 w-4 text-yellow-500 group-hover:animate-bounce" />
                  <span className="text-sm font-medium text-sidebar-accent-foreground">{user.coins}</span>
                </div>
                <div className="flex items-center space-x-2 bg-sidebar-accent rounded-lg p-2 hover:bg-sidebar-primary/10 hover:scale-105 transition-all duration-300 cursor-pointer group">
                  <Zap className="h-4 w-4 text-sidebar-primary group-hover:animate-pulse" />
                  <span className="text-sm font-medium text-sidebar-accent-foreground">{user.xp} XP</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-sidebar-foreground/70">
                  <span>Level {user.level}</span>
                  <span>{xpToNextLevel} XP to next level</span>
                </div>
                <div className="relative">
                  <Progress value={xpProgress} className="h-2 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-sidebar-primary/20 to-accent/20 rounded-full blur-sm opacity-50" />
                </div>
              </div>

              {user.badges.length > 0 && (
                <div className="flex items-center space-x-2 animate-in slide-in-from-right duration-500 delay-300">
                  <Award className="h-4 w-4 text-accent animate-pulse" />
                  <Badge
                    variant="secondary"
                    className="text-xs hover:scale-105 transition-transform duration-200 cursor-pointer"
                  >
                    {user.badges[user.badges.length - 1]}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <div
                  key={item.name}
                  className="animate-in slide-in-from-left duration-500"
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg scale-105"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-105 hover:shadow-md",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-sidebar-primary to-accent opacity-90 animate-pulse" />
                    )}

                    <div className="flex items-center space-x-3 relative z-10">
                      <item.icon
                        className={cn(
                          "h-5 w-5 transition-all duration-300",
                          isActive ? "scale-110" : "group-hover:scale-110 group-hover:rotate-12",
                        )}
                      />
                      <span>{item.name}</span>
                    </div>

                    {isActive && <ChevronRight className="h-4 w-4 relative z-10 animate-pulse" />}
                  </Link>
                </div>
              )
            })}
          </nav>

          <div className="p-4 border-t border-sidebar-border animate-in slide-in-from-bottom duration-500 delay-700">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-red-500/10 hover:text-red-500 hover:scale-105 transition-all duration-300 group"
              onClick={logout}
            >
              <LogOut className="h-5 w-5 mr-3 group-hover:animate-bounce" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
