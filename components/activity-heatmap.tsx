"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function ActivityHeatmap() {
  const [activityData, setActivityData] = useState<any[]>([])

  useEffect(() => {
    // Generate sample activity data
    const today = new Date()
    const data = []

    // Generate data for the last 3 months (12 weeks)
    for (let week = 0; week < 12; week++) {
      for (let day = 0; day < 7; day++) {
        const date = new Date(today)
        date.setDate(date.getDate() - (week * 7 + (6 - day)))

        // Random activity level (0-4)
        // Higher probability of activity in recent weeks
        const recencyFactor = 1 - (week / 12) * 0.7
        const randomValue = Math.random() * recencyFactor
        let activityLevel = 0

        if (randomValue > 0.7) activityLevel = 4
        else if (randomValue > 0.5) activityLevel = 3
        else if (randomValue > 0.3) activityLevel = 2
        else if (randomValue > 0.15) activityLevel = 1

        data.push({
          date: date.toISOString().split("T")[0],
          day,
          week,
          activity: activityLevel,
        })
      }
    }

    setActivityData(data)
  }, [])

  const getActivityColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-primary/10"
      case 1:
        return "bg-primary/30"
      case 2:
        return "bg-primary/50"
      case 3:
        return "bg-primary/70"
      case 4:
        return "bg-primary"
      default:
        return "bg-primary/10"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-end mb-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-primary/10"></div>
          <div className="w-3 h-3 rounded-sm bg-primary/30"></div>
          <div className="w-3 h-3 rounded-sm bg-primary/50"></div>
          <div className="w-3 h-3 rounded-sm bg-primary/70"></div>
          <div className="w-3 h-3 rounded-sm bg-primary"></div>
          <span>More</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[auto_1fr] gap-2">
        <div className="flex flex-col justify-between text-xs text-muted-foreground pt-6 pb-1">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>

        <div className="grid grid-cols-12 gap-1">
          {Array.from({ length: 12 }).map((_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const dataPoint = activityData.find((d) => d.week === weekIndex && d.day === dayIndex)
                return (
                  <motion.div
                    key={`${weekIndex}-${dayIndex}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: (weekIndex * 7 + dayIndex) * 0.005 }}
                    className={`w-full aspect-square rounded-sm ${dataPoint ? getActivityColor(dataPoint.activity) : "bg-primary/10"}`}
                    title={dataPoint ? `${formatDate(dataPoint.date)}: ${dataPoint.activity} activities` : ""}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
        <span>12 weeks ago</span>
        <span>Today</span>
      </div>
    </div>
  )
}
