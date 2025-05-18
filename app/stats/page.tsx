"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Award, Calendar, Target } from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getXpLevel } from "@/lib/utils"

export default function StatsPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    streak: 0,
    totalCards: 0,
    masteredCards: 0,
    xpPoints: 0,
    reviewHistory: [] as any[],
    reviewGoal: 10,
  })
  const [achievements, setAchievements] = useState<any[]>([])

  // Generate sample review history data if none exists
  const generateSampleData = () => {
    const today = new Date()
    const data = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

      data.push({
        date: dateStr,
        correct: Math.floor(Math.random() * 8) + 2,
        incorrect: Math.floor(Math.random() * 5),
      })
    }

    return data
  }

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem("flashcard-stats")
    if (savedStats) {
      const parsedStats = JSON.parse(savedStats)

      // If no review history, generate sample data
      if (!parsedStats.reviewHistory) {
        parsedStats.reviewHistory = generateSampleData()
      }

      setStats(parsedStats)

      // Generate achievements based on stats
      const achievementsList = [
        {
          id: "streak-3",
          name: "Consistent Learner",
          description: "Maintain a 3-day streak",
          icon: "🔥",
          unlocked: parsedStats.streak >= 3,
          progress: Math.min(100, (parsedStats.streak / 3) * 100),
        },
        {
          id: "streak-7",
          name: "Weekly Warrior",
          description: "Maintain a 7-day streak",
          icon: "🏆",
          unlocked: parsedStats.streak >= 7,
          progress: Math.min(100, (parsedStats.streak / 7) * 100),
        },
        {
          id: "mastery-10",
          name: "Knowledge Builder",
          description: "Master 10 flashcards",
          icon: "🧠",
          unlocked: parsedStats.masteredCards >= 10,
          progress: Math.min(100, (parsedStats.masteredCards / 10) * 100),
        },
        {
          id: "xp-1000",
          name: "XP Collector",
          description: "Earn 1000 XP points",
          icon: "⭐",
          unlocked: parsedStats.xpPoints >= 1000,
          progress: Math.min(100, (parsedStats.xpPoints / 1000) * 100),
        },
        {
          id: "cards-50",
          name: "Card Enthusiast",
          description: "Create 50 flashcards",
          icon: "📚",
          unlocked: parsedStats.totalCards >= 50,
          progress: Math.min(100, (parsedStats.totalCards / 50) * 100),
        },
      ]

      setAchievements(achievementsList)
    } else {
      // Initialize with sample data
      const sampleStats = {
        streak: 0,
        totalCards: 10,
        masteredCards: 0,
        xpPoints: 0,
        reviewHistory: generateSampleData(),
        reviewGoal: 10,
      }
      setStats(sampleStats)
      localStorage.setItem("flashcard-stats", JSON.stringify(sampleStats))
    }
  }, [])

  // Calculate mastery percentage
  const masteryPercentage = stats.totalCards > 0 ? Math.round((stats.masteredCards / stats.totalCards) * 100) : 0

  // Data for pie chart
  const masteryData = [
    { name: "Mastered", value: stats.masteredCards, color: "#10b981" },
    { name: "Learning", value: stats.totalCards - stats.masteredCards, color: "#6366f1" },
  ]

  // Data for heatmap (activity by day)
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const activityData = daysOfWeek.map((day) => {
    return {
      day,
      activity: Math.floor(Math.random() * 10),
    }
  })

  // Get XP level information
  const { level, nextLevel, progress } = getXpLevel(stats.xpPoints)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => router.push("/")} className="hover:bg-primary/10">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            Your Stats
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-md dark:shadow-slate-800/30 bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-amber-500">🔥</span> Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.streak} days</div>
            </CardContent>
          </Card>

          <Card className="shadow-md dark:shadow-slate-800/30 bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-blue-500">📚</span> Total Cards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalCards}</div>
            </CardContent>
          </Card>

          <Card className="shadow-md dark:shadow-slate-800/30 bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-emerald-500">🧠</span> Mastery Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-500">{masteryPercentage}%</div>
            </CardContent>
          </Card>

          <Card className="shadow-md dark:shadow-slate-800/30 bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-purple-500">⭐</span> XP Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-500">Level {level}</div>
              <div className="text-xs text-muted-foreground mt-1">{stats.xpPoints} XP total</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="charts" className="mb-8">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Card className="shadow-md dark:shadow-slate-800/30 bg-card/50 backdrop-blur-sm border-primary/10">
                <CardHeader>
                  <CardTitle>Mastery Progress</CardTitle>
                  <CardDescription>Cards mastered vs. still learning</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={masteryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {masteryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [`${value} cards`, ""]}
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-md dark:shadow-slate-800/30 bg-card/50 backdrop-blur-sm border-primary/10">
                <CardHeader>
                  <CardTitle>Daily Performance</CardTitle>
                  <CardDescription>Correct vs. incorrect answers</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer
                    config={{
                      correct: {
                        label: "Correct",
                        color: "hsl(142.1 76.2% 36.3%)",
                      },
                      incorrect: {
                        label: "Incorrect",
                        color: "hsl(346.8 77.2% 49.8%)",
                      },
                    }}
                  >
                    <AreaChart
                      accessibilityLayer
                      data={stats.reviewHistory}
                      margin={{
                        left: 0,
                        right: 8,
                        top: 8,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="incorrect"
                        stackId="1"
                        stroke="var(--color-incorrect)"
                        fill="var(--color-incorrect)"
                        fillOpacity={0.4}
                      />
                      <Area
                        type="monotone"
                        dataKey="correct"
                        stackId="1"
                        stroke="var(--color-correct)"
                        fill="var(--color-correct)"
                        fillOpacity={0.4}
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-md dark:shadow-slate-800/30 bg-card/50 backdrop-blur-sm border-primary/10 mb-8">
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Cards reviewed by day of week</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData}>
                    <XAxis dataKey="day" />
                    <YAxis hide />
                    <Tooltip
                      formatter={(value: number) => [`${value} cards reviewed`, ""]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar dataKey="activity" radius={[4, 4, 0, 0]}>
                      {activityData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.activity > 5 ? "#10b981" : "#6366f1"}
                          fillOpacity={0.3 + entry.activity / 20}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-0">
            <Card className="shadow-md dark:shadow-slate-800/30 bg-card/50 backdrop-blur-sm border-primary/10 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Previous Progress
                </CardTitle>
                <CardDescription>Your detailed learning history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {stats.reviewHistory &&
                    stats.reviewHistory
                      .slice()
                      .reverse()
                      .map((day: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-primary/5"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="font-medium">{day.date}</span>
                          </div>
                          <div className="flex gap-6">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium text-green-500">Correct: {day.correct}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium text-red-500">Incorrect: {day.incorrect}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium">Total: {day.correct + day.incorrect}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  {(!stats.reviewHistory || stats.reviewHistory.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                      No review history available yet. Start reviewing cards to track your progress!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-md dark:shadow-slate-800/30 bg-card/50 backdrop-blur-sm border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Daily Goal Progress
                  </CardTitle>
                  <CardDescription>Your progress towards your daily review goal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center py-4">
                    <div className="text-2xl font-bold mb-2">
                      {stats.reviewHistory.length > 0
                        ? stats.reviewHistory[stats.reviewHistory.length - 1].correct +
                          stats.reviewHistory[stats.reviewHistory.length - 1].incorrect
                        : 0}{" "}
                      / {stats.reviewGoal}
                    </div>
                    <div className="w-full max-w-xs bg-primary/10 rounded-full h-4 mb-4">
                      <div
                        className="bg-primary h-4 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            ((stats.reviewHistory.length > 0
                              ? stats.reviewHistory[stats.reviewHistory.length - 1].correct +
                                stats.reviewHistory[stats.reviewHistory.length - 1].incorrect
                              : 0) /
                              stats.reviewGoal) *
                              100,
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {stats.reviewHistory.length > 0 &&
                      stats.reviewHistory[stats.reviewHistory.length - 1].correct +
                        stats.reviewHistory[stats.reviewHistory.length - 1].incorrect >=
                        stats.reviewGoal
                        ? "Daily goal completed! 🎉"
                        : "Keep going to reach your daily goal!"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md dark:shadow-slate-800/30 bg-card/50 backdrop-blur-sm border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M12 2v20" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    XP Progress
                  </CardTitle>
                  <CardDescription>Your progress towards the next level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center py-4">
                    <div className="text-2xl font-bold mb-2">Level {level}</div>
                    <div className="w-full max-w-xs bg-primary/10 rounded-full h-4 mb-4">
                      <div
                        className="bg-gradient-to-r from-primary to-purple-500 h-4 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {Math.round(progress)}% to Level {nextLevel}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="mt-0">
            <Card className="shadow-md dark:shadow-slate-800/30 bg-card/50 backdrop-blur-sm border-primary/10 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Your Achievements
                </CardTitle>
                <CardDescription>Track your learning milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border ${
                        achievement.unlocked ? "bg-primary/10 border-primary/20" : "bg-muted/50 border-muted"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{achievement.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                          <div className="w-full bg-background/50 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                achievement.unlocked ? "bg-primary" : "bg-muted-foreground/30"
                              }`}
                              style={{ width: `${achievement.progress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-right mt-1">{achievement.progress}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="text-center text-sm text-muted-foreground mt-12">Made by Dax Gondaliya</footer>
      </div>
    </div>
  )
}
