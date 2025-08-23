"use client"

import { useState, useEffect } from "react"
import { dataManager } from "@/lib/data-manager"
import type { Achievement } from "@/lib/types"
import { useAuth } from "./use-auth"

export function useAchievements() {
  const { user, updateUserProgress } = useAuth()
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([])
  const [showAchievementModal, setShowAchievementModal] = useState(false)

  const checkForNewAchievements = () => {
    if (!user) return

    const achievements = dataManager.checkAndAwardAchievements(user.id)

    if (achievements.length > 0) {
      // Award XP and coins for achievements
      const totalXP = achievements.reduce((acc, achievement) => acc + achievement.rewards.xp, 0)
      const totalCoins = achievements.reduce((acc, achievement) => acc + achievement.rewards.coins, 0)
      const newBadges = achievements.map((achievement) => achievement.title)

      updateUserProgress(totalXP, totalCoins, newBadges)
      setNewAchievements(achievements)
      setShowAchievementModal(true)
    }
  }

  const dismissAchievements = () => {
    setNewAchievements([])
    setShowAchievementModal(false)
  }

  useEffect(() => {
    // Check for achievements when user changes
    if (user) {
      checkForNewAchievements()
    }
  }, [user]) // Check when user changes

  return {
    newAchievements,
    showAchievementModal,
    checkForNewAchievements,
    dismissAchievements,
  }
}
