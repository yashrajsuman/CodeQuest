"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { GameHUD } from "@/components/game-hud"
import { QuizPanel } from "@/components/quiz-panel"
import { ArrayVisualization } from "@/components/array-visualization"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"
import { AuthProvider } from "@/components/auth-provider"
import { useAuth } from "@/hooks/use-auth"
import { ArrowLeft, Play, BookOpen, Trophy, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

// Mock data for different topics
const topicData = {
  "data-structures": {
    arrays: {
      title: "Arrays",
      description: "Learn about static and dynamic arrays, indexing, and basic operations",
      content:
        "Arrays are one of the most fundamental data structures in computer science. They store elements in contiguous memory locations, allowing for efficient random access using indices.",
      quiz: [
        {
          id: "1",
          question: "Are arrays stored in contiguous memory locations?",
          type: "yes-no" as const,
          correctAnswer: "yes",
          explanation:
            "Yes, arrays store elements in contiguous memory locations, which allows for efficient random access using indices.",
        },
        {
          id: "2",
          question: "What is the time complexity of accessing an element in an array by index?",
          type: "multiple-choice" as const,
          options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
          correctAnswer: 0,
          explanation:
            "Accessing an element by index in an array is O(1) because we can directly calculate the memory address.",
        },
        {
          id: "3",
          question: "Can arrays in most programming languages change size after creation?",
          type: "yes-no" as const,
          correctAnswer: "no",
          explanation:
            "In most programming languages, traditional arrays have a fixed size that cannot be changed after creation. Dynamic arrays (like vectors or lists) can resize.",
        },
      ],
    },
    "linked-lists": {
      title: "Linked Lists",
      description: "Understand singly and doubly linked lists, insertion, and deletion",
      content:
        "Linked lists are linear data structures where elements are stored in nodes, and each node contains data and a reference to the next node.",
      quiz: [
        {
          id: "1",
          question: "Do linked lists store elements in contiguous memory?",
          type: "yes-no" as const,
          correctAnswer: "no",
          explanation:
            "No, linked lists store elements in nodes that can be scattered throughout memory, connected by pointers.",
        },
      ],
    },
  },
  "computer-networks": {
    "osi-model": {
      title: "OSI Model",
      description: "Understand the 7-layer network model and its functions",
      content:
        "The OSI (Open Systems Interconnection) model is a conceptual framework that describes how network protocols interact and work together to provide network services.",
      quiz: [
        {
          id: "1",
          question: "Does the OSI model have 7 layers?",
          type: "yes-no" as const,
          correctAnswer: "yes",
          explanation:
            "Yes, the OSI model consists of 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application.",
        },
      ],
    },
  },
}

function GameArenaContent() {
  const params = useParams()
  const router = useRouter()
  const { updateUserProgress } = useAuth()
  const [currentSection, setCurrentSection] = useState<"learn" | "practice" | "quiz">("learn")
  const [sessionXP, setSessionXP] = useState(0)
  const [sessionCoins, setSessionCoins] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const subjectId = params.subject as string
  const topicId = params.topic as string

  const topic =
    topicData[subjectId as keyof typeof topicData]?.[topicId as keyof (typeof topicData)[keyof typeof topicData]]

  if (!topic) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 md:ml-72 p-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Topic Not Found</h1>
            <p className="text-muted-foreground mb-6">The topic you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/subjects">Back to Subjects</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const handlePracticeComplete = (earnedXP: number, earnedCoins: number) => {
    setSessionXP((prev) => prev + earnedXP)
    setSessionCoins((prev) => prev + earnedCoins)
    setCurrentSection("quiz")
  }

  const handleQuizComplete = (score: number, earnedXP: number, earnedCoins: number) => {
    const totalXP = sessionXP + earnedXP
    const totalCoins = sessionCoins + earnedCoins

    setSessionXP(totalXP)
    setSessionCoins(totalCoins)

    // Update user progress
    updateUserProgress(totalXP, totalCoins, score === topic.quiz.length ? [`${topic.title} Master`] : [])
    setIsCompleted(true)
  }

  const getSessionProgress = () => {
    if (currentSection === "learn") return 33
    if (currentSection === "practice") return 66
    if (currentSection === "quiz" || isCompleted) return 100
    return 0
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 md:ml-72">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <Button variant="ghost" asChild>
                <Link href={`/subjects/${subjectId}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to {subjectId.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </Link>
              </Button>

              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold">{topic.title}</h1>
                  <p className="text-muted-foreground mt-2">{topic.description}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex space-x-2">
              <Button
                variant={currentSection === "learn" ? "default" : "outline"}
                onClick={() => setCurrentSection("learn")}
                disabled={isCompleted}
              >
                Learn
              </Button>
              <Button
                variant={currentSection === "practice" ? "default" : "outline"}
                onClick={() => setCurrentSection("practice")}
                disabled={isCompleted}
              >
                Practice
              </Button>
              <Button
                variant={currentSection === "quiz" ? "default" : "outline"}
                onClick={() => setCurrentSection("quiz")}
                disabled={isCompleted}
              >
                Quiz
              </Button>
            </div>

            {/* Content Sections */}
            {currentSection === "learn" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Learn: {topic.title}</span>
                  </CardTitle>
                  <CardDescription>Understand the core concepts and theory</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">{topic.content}</p>

                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <h4 className="font-medium text-primary mb-2">Key Points</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Arrays provide O(1) random access to elements</li>
                      <li>• Elements are stored in contiguous memory locations</li>
                      <li>• Fixed size in most programming languages</li>
                      <li>• Efficient for mathematical operations and algorithms</li>
                    </ul>
                  </div>

                  <Button onClick={() => setCurrentSection("practice")} className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Start Practice
                  </Button>
                </CardContent>
              </Card>
            )}

            {currentSection === "practice" && topicId === "arrays" && (
              <ArrayVisualization onComplete={handlePracticeComplete} />
            )}

            {currentSection === "practice" && topicId !== "arrays" && (
              <Card>
                <CardHeader>
                  <CardTitle>Interactive Practice</CardTitle>
                  <CardDescription>Practice with {topic.title} concepts</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Practice Coming Soon</h3>
                  <p className="text-muted-foreground mb-6">
                    Interactive practice for {topic.title} is under development.
                  </p>
                  <Button onClick={() => setCurrentSection("quiz")}>Skip to Quiz</Button>
                </CardContent>
              </Card>
            )}

            {currentSection === "quiz" && !isCompleted && (
              <QuizPanel
                questions={topic.quiz}
                onComplete={handleQuizComplete}
                title={`${topic.title} Knowledge Check`}
              />
            )}

            {isCompleted && (
              <Card className="border-2 border-green-500/20 bg-green-500/5">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center space-x-2 text-green-600">
                    <Trophy className="h-6 w-6" />
                    <span>Topic Completed!</span>
                  </CardTitle>
                  <CardDescription>Congratulations on mastering {topic.title}</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="flex justify-center space-x-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">+{sessionXP}</div>
                      <div className="text-sm text-muted-foreground">XP Earned</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">+{sessionCoins}</div>
                      <div className="text-sm text-muted-foreground">Coins Earned</div>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <Button asChild>
                      <Link href={`/subjects/${subjectId}`}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Back to Topics
                      </Link>
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/dashboard")}>
                      Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar HUD */}
          <div className="lg:col-span-1">
            <GameHUD
              currentXP={sessionXP}
              currentCoins={sessionCoins}
              sessionProgress={getSessionProgress()}
              topicTitle={topic.title}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GameArenaPage() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <GameArenaContent />
      </ProtectedRoute>
    </AuthProvider>
  )
}
