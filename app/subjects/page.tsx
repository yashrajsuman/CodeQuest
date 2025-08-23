"use client"

import { Sidebar } from "@/components/sidebar"
import { SubjectCard } from "@/components/subject-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/protected-route"
import { AuthProvider } from "@/components/auth-provider"
import { useState } from "react"
import { Search, Filter, Database, Network, Code, Brain, BookOpen } from "lucide-react"

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
    category: "Core CS",
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
    category: "Systems",
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
    category: "Core CS",
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
    category: "AI/ML",
  },
]

const categories = ["All", "Core CS", "Systems", "AI/ML"]
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]

function SubjectsContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")

  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch =
      subject.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || subject.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || subject.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 md:ml-72 p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">All Subjects</h1>
          <p className="text-muted-foreground">Explore our comprehensive computer science curriculum.</p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Find Your Next Subject</span>
            </CardTitle>
            <CardDescription>Search and filter subjects by category and difficulty</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty</label>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((difficulty) => (
                    <Button
                      key={difficulty}
                      variant={selectedDifficulty === difficulty ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDifficulty(difficulty)}
                    >
                      {difficulty}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {filteredSubjects.length} Subject{filteredSubjects.length !== 1 ? "s" : ""}
            </h2>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {selectedCategory !== "All" && (
                  <Badge variant="secondary" className="mr-2">
                    {selectedCategory}
                  </Badge>
                )}
                {selectedDifficulty !== "All" && <Badge variant="secondary">{selectedDifficulty}</Badge>}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSubjects.map((subject) => (
              <SubjectCard key={subject.id} {...subject} />
            ))}
          </div>

          {filteredSubjects.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No subjects found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

export default function SubjectsPage() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <SubjectsContent />
      </ProtectedRoute>
    </AuthProvider>
  )
}
