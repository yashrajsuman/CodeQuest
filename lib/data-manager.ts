"use client"

import type { User, UserProgress, Achievement, LearningSession } from "./types"

class DataManager {
  private static instance: DataManager
  private readonly STORAGE_KEYS = {
    USERS: "codequest-users",
    CURRENT_USER: "codequest-user",
    USER_PROGRESS: "codequest-progress",
    ACHIEVEMENTS: "codequest-achievements",
    SESSIONS: "codequest-sessions",
    SUBJECTS: "codequest-subjects",
    TOPICS: "codequest-topics",
  }

  private constructor() {}

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager()
    }
    return DataManager.instance
  }

  private isClient(): boolean {
    return typeof window !== "undefined" && typeof localStorage !== "undefined"
  }

  // User Management
  saveUser(user: User): void {
    if (!this.isClient()) return

    try {
      const users = this.getUsers()
      const existingIndex = users.findIndex((u) => u.id === user.id)

      if (existingIndex >= 0) {
        users[existingIndex] = { ...user, lastLoginAt: new Date().toISOString() }
      } else {
        users.push(user)
      }

      localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users))
      localStorage.setItem(this.STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
    } catch (error) {
      console.error("Failed to save user:", error)
    }
  }

  getUsers(): User[] {
    if (!this.isClient()) return []

    try {
      const users = localStorage.getItem(this.STORAGE_KEYS.USERS)
      return users ? JSON.parse(users) : []
    } catch (error) {
      console.error("Failed to get users:", error)
      return []
    }
  }

  getCurrentUser(): User | null {
    if (!this.isClient()) return null

    try {
      const user = localStorage.getItem(this.STORAGE_KEYS.CURRENT_USER)
      return user ? JSON.parse(user) : null
    } catch (error) {
      console.error("Failed to get current user:", error)
      return null
    }
  }

  clearCurrentUser(): void {
    if (!this.isClient()) return
    localStorage.removeItem(this.STORAGE_KEYS.CURRENT_USER)
  }

  // Progress Management
  saveUserProgress(progress: UserProgress): void {
    if (!this.isClient()) return

    try {
      const allProgress = this.getUserProgress(progress.userId)
      const existingIndex = allProgress.findIndex(
        (p) => p.subjectId === progress.subjectId && p.topicId === progress.topicId,
      )

      if (existingIndex >= 0) {
        allProgress[existingIndex] = { ...progress, lastAccessedAt: new Date().toISOString() }
      } else {
        allProgress.push({ ...progress, lastAccessedAt: new Date().toISOString() })
      }

      const progressData = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.USER_PROGRESS) || "{}")
      progressData[progress.userId] = allProgress

      localStorage.setItem(this.STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progressData))
    } catch (error) {
      console.error("Failed to save user progress:", error)
    }
  }

  getUserProgress(userId: string): UserProgress[] {
    if (!this.isClient()) return []

    try {
      const progressData = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.USER_PROGRESS) || "{}")
      return progressData[userId] || []
    } catch (error) {
      console.error("Failed to get user progress:", error)
      return []
    }
  }

  getTopicProgress(userId: string, subjectId: string, topicId: string): UserProgress | null {
    const progress = this.getUserProgress(userId)
    return progress.find((p) => p.subjectId === subjectId && p.topicId === topicId) || null
  }

  getSubjectProgress(userId: string, subjectId: string): UserProgress[] {
    const progress = this.getUserProgress(userId)
    return progress.filter((p) => p.subjectId === subjectId)
  }

  // Session Management
  startLearningSession(userId: string, topicId: string): LearningSession {
    if (!this.isClient()) return {} as LearningSession

    const session: LearningSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      topicId,
      startedAt: new Date().toISOString(),
      xpEarned: 0,
      coinsEarned: 0,
      score: 0,
      timeSpent: 0,
      activities: [],
    }

    try {
      const sessions = this.getLearningSessionsForUser(userId)
      sessions.push(session)

      const allSessions = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.SESSIONS) || "{}")
      allSessions[userId] = sessions

      localStorage.setItem(this.STORAGE_KEYS.SESSIONS, JSON.stringify(allSessions))
    } catch (error) {
      console.error("Failed to start learning session:", error)
    }

    return session
  }

  completeLearningSession(sessionId: string, xpEarned: number, coinsEarned: number, score: number): void {
    if (!this.isClient()) return

    try {
      const allSessions = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.SESSIONS) || "{}")

      for (const userId in allSessions) {
        const sessions = allSessions[userId]
        const sessionIndex = sessions.findIndex((s: LearningSession) => s.id === sessionId)

        if (sessionIndex >= 0) {
          sessions[sessionIndex] = {
            ...sessions[sessionIndex],
            completedAt: new Date().toISOString(),
            xpEarned,
            coinsEarned,
            score,
            timeSpent: Date.now() - new Date(sessions[sessionIndex].startedAt).getTime(),
          }

          localStorage.setItem(this.STORAGE_KEYS.SESSIONS, JSON.stringify(allSessions))
          break
        }
      }
    } catch (error) {
      console.error("Failed to complete learning session:", error)
    }
  }

  getLearningSessionsForUser(userId: string): LearningSession[] {
    if (!this.isClient()) return []

    try {
      const allSessions = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.SESSIONS) || "{}")
      return allSessions[userId] || []
    } catch (error) {
      console.error("Failed to get learning sessions:", error)
      return []
    }
  }

  // Achievement Management
  checkAndAwardAchievements(userId: string): Achievement[] {
    if (!this.isClient()) return []

    const user = this.getCurrentUser()
    const progress = this.getUserProgress(userId)
    const sessions = this.getLearningSessionsForUser(userId)
    const newAchievements: Achievement[] = []

    if (!user) return newAchievements

    // Check for various achievement conditions
    const completedTopics = progress.filter((p) => p.status === "completed").length
    const totalXP = user.xp
    const perfectScores = sessions.filter((s) => s.score === 100).length

    // Achievement: First Steps
    if (completedTopics >= 1 && !user.badges.includes("First Steps")) {
      newAchievements.push({
        id: "first-steps",
        title: "First Steps",
        description: "Complete your first topic",
        icon: "🎯",
        type: "progress",
        requirements: { condition: "topics_completed", value: 1 },
        rewards: { xp: 50, coins: 25 },
        isSecret: false,
      })
    }

    // Achievement: Knowledge Seeker
    if (completedTopics >= 5 && !user.badges.includes("Knowledge Seeker")) {
      newAchievements.push({
        id: "knowledge-seeker",
        title: "Knowledge Seeker",
        description: "Complete 5 topics",
        icon: "📚",
        type: "progress",
        requirements: { condition: "topics_completed", value: 5 },
        rewards: { xp: 100, coins: 50 },
        isSecret: false,
      })
    }

    // Achievement: Perfect Score
    if (perfectScores >= 3 && !user.badges.includes("Perfectionist")) {
      newAchievements.push({
        id: "perfectionist",
        title: "Perfectionist",
        description: "Get perfect scores on 3 quizzes",
        icon: "⭐",
        type: "score",
        requirements: { condition: "perfect_scores", value: 3 },
        rewards: { xp: 150, coins: 75 },
        isSecret: false,
      })
    }

    return newAchievements
  }

  // Statistics and Analytics
  getUserStatistics(userId: string) {
    if (!this.isClient()) return null

    const progress = this.getUserProgress(userId)
    const sessions = this.getLearningSessionsForUser(userId)
    const user = this.getCurrentUser()

    if (!user) return null

    const completedTopics = progress.filter((p) => p.status === "completed").length
    const inProgressTopics = progress.filter((p) => p.status === "in-progress").length
    const totalTimeSpent = sessions.reduce((acc, session) => acc + session.timeSpent, 0)
    const averageScore = sessions.length > 0 ? sessions.reduce((acc, s) => acc + s.score, 0) / sessions.length : 0
    const currentStreak = this.calculateCurrentStreak(sessions)

    return {
      user: {
        level: user.level,
        xp: user.xp,
        coins: user.coins,
        badges: user.badges.length,
      },
      progress: {
        completedTopics,
        inProgressTopics,
        totalTopics: completedTopics + inProgressTopics,
        completionRate: completedTopics > 0 ? (completedTopics / (completedTopics + inProgressTopics)) * 100 : 0,
      },
      performance: {
        averageScore: Math.round(averageScore),
        totalTimeSpent,
        currentStreak,
        totalSessions: sessions.length,
      },
    }
  }

  private calculateCurrentStreak(sessions: LearningSession[]): number {
    if (!this.isClient()) return 0

    if (sessions.length === 0) return 0

    const completedSessions = sessions
      .filter((s) => s.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())

    let streak = 0
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    for (const session of completedSessions) {
      const sessionDate = new Date(session.completedAt!)
      sessionDate.setHours(0, 0, 0, 0)

      const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff === streak) {
        streak++
      } else if (daysDiff === streak + 1) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  // Data Export/Import for future backend integration
  exportUserData(userId: string) {
    if (!this.isClient()) return {}

    return {
      user: this.getCurrentUser(),
      progress: this.getUserProgress(userId),
      sessions: this.getLearningSessionsForUser(userId),
      statistics: this.getUserStatistics(userId),
      exportedAt: new Date().toISOString(),
    }
  }

  importUserData(data: any): boolean {
    if (!this.isClient()) return false

    try {
      if (data.user) this.saveUser(data.user)
      if (data.progress) {
        data.progress.forEach((p: UserProgress) => this.saveUserProgress(p))
      }
      return true
    } catch (error) {
      console.error("Failed to import user data:", error)
      return false
    }
  }

  // Clear all data (for testing/reset)
  clearAllData(): void {
    if (!this.isClient()) return

    Object.values(this.STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  }
}

export const dataManager = DataManager.getInstance()
