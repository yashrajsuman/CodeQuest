"use client"

import { Sidebar } from "@/components/sidebar"
import { TopicCard } from "@/components/topic-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"
import { AuthProvider } from "@/components/auth-provider"
import { ArrowLeft, BookOpen, Clock, Trophy, Target } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock data - in a real app, this would come from an API
const subjectData = {
  "data-structures": {
    title: "Data Structures",
    description: "Master the fundamental building blocks of computer science",
    icon: <BookOpen className="h-6 w-6" />,
    progress: 65,
    totalTopics: 12,
    completedTopics: 8,
    estimatedTime: "4-6 weeks",
    topics: [
      {
        id: "arrays",
        title: "Arrays",
        description: "Learn about static and dynamic arrays, indexing, and basic operations",
        icon: <Target className="h-5 w-5" />,
        difficulty: "Easy" as const,
        estimatedTime: "30 min",
        xpReward: 100,
        coinReward: 50,
        isCompleted: true,
        isLocked: false,
        progress: 100,
      },
      {
        id: "linked-lists",
        title: "Linked Lists",
        description: "Understand singly and doubly linked lists, insertion, and deletion",
        icon: <Target className="h-5 w-5" />,
        difficulty: "Medium" as const,
        estimatedTime: "45 min",
        xpReward: 150,
        coinReward: 75,
        isCompleted: true,
        isLocked: false,
        progress: 100,
      },
      {
        id: "stacks",
        title: "Stacks",
        description: "Master LIFO data structure with push, pop, and peek operations",
        icon: <Target className="h-5 w-5" />,
        difficulty: "Easy" as const,
        estimatedTime: "25 min",
        xpReward: 100,
        coinReward: 50,
        isCompleted: false,
        isLocked: false,
        progress: 60,
      },
      {
        id: "queues",
        title: "Queues",
        description: "Learn FIFO data structure and its various implementations",
        icon: <Target className="h-5 w-5" />,
        difficulty: "Easy" as const,
        estimatedTime: "25 min",
        xpReward: 100,
        coinReward: 50,
        isCompleted: false,
        isLocked: false,
        progress: 0,
      },
      {
        id: "trees",
        title: "Binary Trees",
        description: "Explore tree structures, traversals, and binary search trees",
        icon: <Target className="h-5 w-5" />,
        difficulty: "Hard" as const,
        estimatedTime: "60 min",
        xpReward: 200,
        coinReward: 100,
        isCompleted: false,
        isLocked: true,
        progress: 0,
      },
      {
        id: "graphs",
        title: "Graphs",
        description: "Understand graph representations, traversals, and algorithms",
        icon: <Target className="h-5 w-5" />,
        difficulty: "Hard" as const,
        estimatedTime: "75 min",
        xpReward: 250,
        coinReward: 125,
        isCompleted: false,
        isLocked: true,
        progress: 0,
      },
    ],
  },
  "computer-networks": {
    title: "Computer Networks",
    description: "Learn networking protocols, architecture, and communication",
    icon: <BookOpen className="h-6 w-6" />,
    progress: 30,
    totalTopics: 10,
    completedTopics: 3,
    estimatedTime: "3-4 weeks",
    topics: [
      {
        id: "osi-model",
        title: "OSI Model",
        description: "Understand the 7-layer network model and its functions",
        icon: <Target className="h-5 w-5" />,
        difficulty: "Easy" as const,
        estimatedTime: "40 min",
        xpReward: 120,
        coinReward: 60,
        isCompleted: true,
        isLocked: false,
        progress: 100,
      },
      {
        id: "tcp-ip",
        title: "TCP/IP Protocol",
        description: "Learn about the internet protocol suite and packet transmission",
        icon: <Target className="h-5 w-5" />,
        difficulty: "Medium" as const,
        estimatedTime: "50 min",
        xpReward: 150,
        coinReward: 75,
        isCompleted: false,
        isLocked: false,
        progress: 40,
      },
      {
        id: "routing",
        title: "Routing Algorithms",
        description: "Explore how data finds its path across networks",
        icon: <Target className="h-5 w-5" />,
        difficulty: "Hard" as const,
        estimatedTime: "60 min",
        xpReward: 200,
        coinReward: 100,
        isCompleted: false,
        isLocked: false,
        progress: 0,
      },
    ],
  },
}

function SubjectDetailContent() {
  const params = useParams()
  const subjectId = params.id as string
  const subject = subjectData[subjectId as keyof typeof subjectData]

  if (!subject) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 md:ml-72 p-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Subject Not Found</h1>
            <p className="text-muted-foreground mb-6">The subject you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/subjects">Back to Subjects</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 md:ml-72 p-6 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/subjects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Subjects
            </Link>
          </Button>

          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">{subject.icon}</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{subject.title}</h1>
              <p className="text-muted-foreground mt-2">{subject.description}</p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span>Your Progress</span>
            </CardTitle>
            <CardDescription>Track your learning journey through this subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{subject.progress}%</div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {subject.completedTopics}/{subject.totalTopics}
                </div>
                <div className="text-sm text-muted-foreground">Topics</div>
              </div>
              <div className="text-center flex items-center justify-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">{subject.estimatedTime}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium">
                  {subject.completedTopics}/{subject.totalTopics} topics completed
                </span>
              </div>
              <Progress value={subject.progress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Topics Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Topics</h2>
            <Badge variant="outline" className="text-sm">
              {subject.topics.length} topics available
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {subject.topics.map((topic) => (
              <TopicCard key={topic.id} {...topic} subjectId={subjectId} />
            ))}
          </div>
        </div>

        {/* Learning Path */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Learning Path</CardTitle>
            <CardDescription>Follow this sequence for optimal learning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subject.topics.map((topic, index) => (
                <div key={topic.id} className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      topic.isCompleted
                        ? "bg-green-500 text-white"
                        : topic.progress > 0
                          ? "bg-primary text-primary-foreground"
                          : topic.isLocked
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/10 text-primary"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{topic.title}</div>
                    <div className="text-sm text-muted-foreground">{topic.description}</div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      topic.difficulty === "Easy"
                        ? "border-green-500/20 text-green-600"
                        : topic.difficulty === "Medium"
                          ? "border-yellow-500/20 text-yellow-600"
                          : "border-red-500/20 text-red-600"
                    }
                  >
                    {topic.difficulty}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function SubjectDetailPage() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <SubjectDetailContent />
      </ProtectedRoute>
    </AuthProvider>
  )
}
