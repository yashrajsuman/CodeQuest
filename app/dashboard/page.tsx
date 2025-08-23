"use client"

import { Sidebar } from "@/components/sidebar"
import { SubjectCard } from "@/components/subject-card"
import { StatsCard } from "@/components/stats-card"
import { AnimatedCounter } from "@/components/animated-counter"
import { FloatingParticles } from "@/components/floating-particles"
import { ProgressRing } from "@/components/progress-ring"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"
import { AchievementModal } from "@/components/achievement-modal"
import { useAuth } from "@/hooks/use-auth"
import { useAchievements } from "@/hooks/use-achievements"
import { useProgress } from "@/hooks/use-progress"
import {
  Database,
  Network,
  Code,
  Brain,
  TrendingUp,
  Target,
  Clock,
  Award,
  Calendar,
  BookOpen,
  Sparkles,
} from "lucide-react"

const subjects = [
  {
    id: "data-structures",
    title: "Data Structures",
    description: "Master arrays, linked lists, trees, and more",
    icon: <Database className="h-5 w-5" />,
    progress: 65,
    totalTopics: 12,
    completedTopics: 8,
    difficulty: "Intermediate" as const,
    estimatedTime: "4-6 weeks",
  },
  {
    id: "computer-networks",
    title: "Computer Networks",
    description: "Learn networking protocols and architecture",
    icon: <Network className="h-5 w-5" />,
    progress: 30,
    totalTopics: 10,
    completedTopics: 3,
    difficulty: "Beginner" as const,
    estimatedTime: "3-4 weeks",
  },
  {
    id: "algorithms",
    title: "Algorithms",
    description: "Sorting, searching, and optimization techniques",
    icon: <Code className="h-5 w-5" />,
    progress: 0,
    totalTopics: 15,
    completedTopics: 0,
    difficulty: "Advanced" as const,
    estimatedTime: "6-8 weeks",
    isLocked: true,
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    description: "Introduction to ML concepts and applications",
    icon: <Brain className="h-5 w-5" />,
    progress: 0,
    totalTopics: 20,
    completedTopics: 0,
    difficulty: "Advanced" as const,
    estimatedTime: "8-10 weeks",
    isLocked: true,
  },
]

function DashboardContent() {
  const { user } = useAuth()
  const { getUserStatistics } = useProgress()
  const { newAchievements, showAchievementModal, dismissAchievements } = useAchievements()

  if (!user) return null

  const stats = getUserStatistics()
  const totalProgress = subjects.reduce((acc, subject) => acc + subject.progress, 0) / subjects.length
  const completedSubjects = subjects.filter((subject) => subject.progress === 100).length
  const activeSubjects = subjects.filter((subject) => subject.progress > 0 && subject.progress < 100).length

  return (
    <>
      <FloatingParticles />

      <div className="flex min-h-screen bg-background relative z-10">
        <Sidebar />

        <main className="flex-1 md:ml-72 p-6 space-y-8">
          <div className="space-y-2 animate-in fade-in-0 slide-in-from-top-4 duration-700">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Welcome back, {user.name}!
            </h1>
            <p className="text-muted-foreground flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span>Continue your learning journey and unlock new achievements.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-100">
              <StatsCard
                title="Overall Progress"
                value={<AnimatedCounter value={Math.round(totalProgress)} suffix="%" />}
                description="Across all subjects"
                icon={TrendingUp}
                trend={{ value: 12, isPositive: true }}
              />
            </div>
            <div className="animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-200">
              <StatsCard
                title="Active Subjects"
                value={<AnimatedCounter value={activeSubjects} />}
                description="Currently learning"
                icon={Target}
                trend={{ value: 1, isPositive: true }}
              />
            </div>
            <div className="animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-300">
              <StatsCard
                title="Study Streak"
                value={
                  stats?.performance.currentStreak ? (
                    <>
                      <AnimatedCounter value={stats.performance.currentStreak} /> days
                    </>
                  ) : (
                    "0 days"
                  )
                }
                description="Keep it up!"
                icon={Clock}
                trend={{ value: 15, isPositive: true }}
              />
            </div>
            <div className="animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-400">
              <StatsCard
                title="Badges Earned"
                value={<AnimatedCounter value={user.badges.length} />}
                description="Total achievements"
                icon={Award}
              />
            </div>
          </div>

          <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-500">
            <Card className="hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Learning Progress</span>
                  <ProgressRing progress={totalProgress} size={80} />
                </CardTitle>
                <CardDescription>Your overall mastery across all subjects</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-600">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>Your latest learning milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-all duration-200 hover:scale-[1.02] cursor-pointer">
                    <div className="p-2 rounded-full bg-primary/10 animate-pulse">
                      <Award className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Earned "Array Master" badge</p>
                      <p className="text-xs text-muted-foreground">Completed all array challenges</p>
                    </div>
                    <Badge variant="secondary" className="animate-in fade-in-0 slide-in-from-right-2">
                      2 hours ago
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-all duration-200 hover:scale-[1.02] cursor-pointer">
                    <div className="p-2 rounded-full bg-green-500/10">
                      <BookOpen className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Completed "Linked Lists" topic</p>
                      <p className="text-xs text-muted-foreground">Data Structures course</p>
                    </div>
                    <Badge variant="secondary">1 day ago</Badge>
                  </div>

                  <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-all duration-200 hover:scale-[1.02] cursor-pointer">
                    <div className="p-2 rounded-full bg-blue-500/10">
                      <Network className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Started "OSI Model" lesson</p>
                      <p className="text-xs text-muted-foreground">Computer Networks course</p>
                    </div>
                    <Badge variant="secondary">2 days ago</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-700">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Subjects</h2>
              <Button variant="outline" className="hover:scale-105 transition-transform duration-200 bg-transparent">
                View All
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {subjects.map((subject, index) => (
                <div
                  key={subject.id}
                  className={`animate-in fade-in-0 slide-in-from-bottom-4 duration-700`}
                  style={{ animationDelay: `${800 + index * 100}ms` }}
                >
                  <SubjectCard {...subject} />
                </div>
              ))}
            </div>
          </div>

          <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-1000">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Jump back into your learning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    className="h-20 flex-col space-y-2 bg-transparent hover:bg-primary/5 hover:scale-105 transition-all duration-200 group"
                    variant="outline"
                  >
                    <Target className="h-6 w-6 group-hover:text-primary transition-colors" />
                    <span>Daily Challenge</span>
                  </Button>
                  <Button
                    className="h-20 flex-col space-y-2 bg-transparent hover:bg-primary/5 hover:scale-105 transition-all duration-200 group"
                    variant="outline"
                  >
                    <BookOpen className="h-6 w-6 group-hover:text-primary transition-colors" />
                    <span>Resume Last Topic</span>
                  </Button>
                  <Button
                    className="h-20 flex-col space-y-2 bg-transparent hover:bg-primary/5 hover:scale-105 transition-all duration-200 group"
                    variant="outline"
                  >
                    <Award className="h-6 w-6 group-hover:text-primary transition-colors" />
                    <span>View Achievements</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Achievement Modal */}
      <AchievementModal achievements={newAchievements} isOpen={showAchievementModal} onClose={dismissAchievements} />
    </>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
