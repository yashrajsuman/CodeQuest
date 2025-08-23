export interface User {
  id: string
  email: string
  name: string
  level: number
  coins: number
  xp: number
  badges: string[]
  avatar?: string
  createdAt: string
  lastLoginAt: string
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: "light" | "dark" | "system"
  notifications: boolean
  soundEffects: boolean
  autoSave: boolean
}

export interface Subject {
  id: string
  title: string
  description: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  estimatedTime: string
  totalTopics: number
  isLocked: boolean
  prerequisites: string[]
  rewards: {
    xp: number
    coins: number
    badges: string[]
  }
}

export interface Topic {
  id: string
  subjectId: string
  title: string
  description: string
  difficulty: "Easy" | "Medium" | "Hard"
  estimatedTime: string
  xpReward: number
  coinReward: number
  isLocked: boolean
  prerequisites: string[]
  content: {
    theory: string
    examples: string[]
    keyPoints: string[]
  }
  quiz: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  question: string
  type: "yes-no" | "multiple-choice" | "drag-drop"
  options?: string[]
  correctAnswer: string | number | string[]
  explanation: string
  difficulty: "Easy" | "Medium" | "Hard"
}

export interface UserProgress {
  userId: string
  subjectId: string
  topicId: string
  status: "not-started" | "in-progress" | "completed"
  progress: number
  completedAt?: string
  attempts: number
  bestScore: number
  timeSpent: number
  lastAccessedAt: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  type: "progress" | "streak" | "score" | "special"
  requirements: {
    condition: string
    value: number
  }
  rewards: {
    xp: number
    coins: number
  }
  isSecret: boolean
}

export interface LearningSession {
  id: string
  userId: string
  topicId: string
  startedAt: string
  completedAt?: string
  xpEarned: number
  coinsEarned: number
  score: number
  timeSpent: number
  activities: SessionActivity[]
}

export interface SessionActivity {
  type: "theory" | "practice" | "quiz"
  startedAt: string
  completedAt: string
  score?: number
  attempts?: number
}
