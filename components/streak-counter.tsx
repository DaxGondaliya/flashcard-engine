"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface StreakCounterProps {
  streak: number
}

export default function StreakCounter({ streak }: StreakCounterProps) {
  const [animate, setAnimate] = useState(false)
  const [prevStreak, setPrevStreak] = useState(streak)

  useEffect(() => {
    if (streak > prevStreak) {
      setAnimate(true)
      setTimeout(() => setAnimate(false), 1000)
    }
    setPrevStreak(streak)
  }, [streak, prevStreak])

  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[...Array(Math.min(5, streak))].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 1 }}
            animate={animate && i === Math.min(4, streak - 1) ? { scale: [1, 1.5, 1] } : {}}
            transition={{ duration: 0.5 }}
            className="text-amber-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
          </motion.div>
        ))}
      </div>
      <span className="font-medium">{streak} day streak</span>
    </div>
  )
}
