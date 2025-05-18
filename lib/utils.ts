import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Motivational quotes for streak milestones
const motivationalQuotes = [
  "Consistency is the key to mastery! Keep going!",
  "Your brain is getting stronger with every review!",
  "You're building neural pathways that will last a lifetime!",
  "Knowledge compounds like interest - you're investing wisely!",
  "Small steps every day lead to massive results over time!",
  "You're in the top 1% of learners who stick with it!",
  "Your future self will thank you for the habits you're building now!",
  "The difference between ordinary and extraordinary is that little 'extra' you're putting in!",
  "Success is the sum of small efforts repeated day in and day out!",
  "Every card you review is a brick in the foundation of your knowledge!",
]

export function getRandomMotivationalQuote(): string {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length)
  return motivationalQuotes[randomIndex]
}

// XP level calculation
export function getXpLevel(xp: number) {
  // Level formula: Each level requires 20% more XP than the previous level
  // Level 1: 0-100 XP
  // Level 2: 101-220 XP
  // Level 3: 221-364 XP
  // etc.

  if (xp <= 0) return { level: 0, nextLevel: 1, progress: 0 }

  let level = 0
  let xpForCurrentLevel = 0
  let xpForNextLevel = 100

  while (xp >= xpForNextLevel) {
    level++
    xpForCurrentLevel = xpForNextLevel
    xpForNextLevel = Math.floor(xpForNextLevel * 1.2) + 100
  }

  const progress = ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100

  return {
    level: level + 1,
    nextLevel: level + 2,
    progress,
  }
}
