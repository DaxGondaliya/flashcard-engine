"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Brain, LayoutDashboard, Moon, Plus, Sun, Trophy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/components/theme-provider"
import { DeckList } from "@/components/deck-list"
import { NewDeckDialog } from "@/components/new-deck-dialog"
import { RadialProgress } from "@/components/radial-progress"
import { getXpLevel } from "@/lib/utils"

export default function HomePage() {
  const { theme, setTheme } = useTheme()
  const [streak, setStreak] = useState(0)
  const [totalCards, setTotalCards] = useState(0)
  const [masteredCards, setMasteredCards] = useState(0)
  const [xpPoints, setXpPoints] = useState(0)
  const [reviewGoal, setReviewGoal] = useState(10)
  const [reviewsToday, setReviewsToday] = useState(0)
  const [showNewDeckDialog, setShowNewDeckDialog] = useState(false)
  const [decks, setDecks] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("overview")

  const [stats, setStats] = useState<any>({
    streak: 0,
    totalCards: 0,
    masteredCards: 0,
    xpPoints: 0,
    reviewHistory: [],
    reviewGoal: 10,
  })

  useEffect(() => {
    // Load stats from localStorage
    const stats = localStorage.getItem("flashcard-stats")
    if (stats) {
      const parsedStats = JSON.parse(stats)
      setStreak(parsedStats.streak || 0)
      setTotalCards(parsedStats.totalCards || 0)
      setMasteredCards(parsedStats.masteredCards || 0)
      setXpPoints(parsedStats.xpPoints || 0)
      setReviewGoal(parsedStats.reviewGoal || 10)
      setStats(parsedStats)

      // Calculate reviews today
      const today = new Date().toDateString()
      const reviewHistory = parsedStats.reviewHistory || []
      const todayReviews = reviewHistory.find((item: any) => item.date === today)
      setReviewsToday(todayReviews ? todayReviews.correct + todayReviews.incorrect : 0)
    }

    // Load decks from localStorage
    const savedDecks = localStorage.getItem("flashcard-decks")
    if (savedDecks) {
      setDecks(JSON.parse(savedDecks))
    } else {
      // Initialize with a default deck
      const defaultDeck = {
        id: "default",
        name: "General Knowledge",
        description: "Basic facts and information",
        cards: [
          {
            id: 1,
            question: "What is the capital of France?",
            answer: "Paris",
            level: 0,
            nextReview: Date.now(),
            notes: "",
            flagged: false,
          },
          {
            id: 2,
            question: "What is the largest planet in our solar system?",
            answer: "Jupiter",
            level: 0,
            nextReview: Date.now(),
            notes: "",
            flagged: false,
          },
          {
            id: 3,
            question: "What is the chemical symbol for gold?",
            answer: "Au",
            level: 0,
            nextReview: Date.now(),
            notes: "",
            flagged: false,
          },
          {
            id: 4,
            question: "What is the smallest prime number?",
            answer: "2",
            level: 0,
            nextReview: Date.now(),
            notes: "",
            flagged: false,
          },
          {
            id: 5,
            question: "What is the main component of the Earth's atmosphere?",
            answer: "Nitrogen",
            level: 0,
            nextReview: Date.now(),
            notes: "",
            flagged: false,
          },
        ],
      }

      const mathDeck = {
        id: "math",
        name: "Mathematics",
        description: "Math concepts and formulas",
        cards: [
          {
            id: 1,
            question: "What is the formula for the area of a circle?",
            answer: "πr²",
            level: 0,
            nextReview: Date.now(),
            notes: "",
            flagged: false,
          },
          {
            id: 2,
            question: "What is the Pythagorean theorem?",
            answer: "a² + b² = c²",
            level: 0,
            nextReview: Date.now(),
            notes: "",
            flagged: false,
          },
          {
            id: 3,
            question: "What is the derivative of x²?",
            answer: "2x",
            level: 0,
            nextReview: Date.now(),
            notes: "",
            flagged: false,
          },
          {
            id: 4,
            question: "What is the value of π (pi) to 2 decimal places?",
            answer: "3.14",
            level: 0,
            nextReview: Date.now(),
            notes: "",
            flagged: false,
          },
          {
            id: 5,
            question: "What is the formula for the volume of a sphere?",
            answer: "(4/3)πr³",
            level: 0,
            nextReview: Date.now(),
            notes: "",
            flagged: false,
          },
        ],
      }

      const newDecks = [defaultDeck, mathDeck]
      setDecks(newDecks)
      localStorage.setItem("flashcard-decks", JSON.stringify(newDecks))

      // Update total cards count
      const totalCardCount = newDecks.reduce((sum, deck) => sum + deck.cards.length, 0)
      const statsObj = { totalCards: totalCardCount, masteredCards: 0, streak: 0, xpPoints: 0, reviewGoal: 10 }
      localStorage.setItem("flashcard-stats", JSON.stringify(statsObj))
      setTotalCards(totalCardCount)
    }
  }, [])

  const { level, nextLevel, progress } = getXpLevel(xpPoints)

  const handleAddDeck = (newDeck: any) => {
    const updatedDecks = [...decks, newDeck]
    setDecks(updatedDecks)
    localStorage.setItem("flashcard-decks", JSON.stringify(updatedDecks))

    // Update total cards count
    const newTotalCards = totalCards + newDeck.cards.length
    setTotalCards(newTotalCards)

    // Update stats in localStorage
    const stats = JSON.parse(localStorage.getItem("flashcard-stats") || "{}")
    localStorage.setItem(
      "flashcard-stats",
      JSON.stringify({
        ...stats,
        totalCards: newTotalCards,
      }),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 1, delay: 0.5 }}>
              <Brain className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              FlashMaster
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="rounded-full"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2 shadow-lg dark:shadow-slate-800/30 bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">Welcome Back!</CardTitle>
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">Level {level}</span>
                </div>
              </div>
              <CardDescription>Your learning journey continues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm">
                    <span>XP Level Progress</span>
                    <span>{xpPoints} XP</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="text-xs text-muted-foreground text-right">
                    {Math.round(progress)}% to Level {level + 1}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                  <div className="bg-primary/5 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-primary">{streak}</div>
                    <div className="text-xs text-muted-foreground">Day Streak</div>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-primary">{totalCards}</div>
                    <div className="text-xs text-muted-foreground">Total Cards</div>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-primary">{masteredCards}</div>
                    <div className="text-xs text-muted-foreground">Mastered</div>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-primary">{decks.length}</div>
                    <div className="text-xs text-muted-foreground">Decks</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg dark:shadow-slate-800/30 bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Daily Goal</CardTitle>
              <CardDescription>Review {reviewGoal} cards today</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-4">
              <RadialProgress value={Math.min(100, (reviewsToday / reviewGoal) * 100)} size={140} thickness={10}>
                <div className="text-center">
                  <div className="text-3xl font-bold">{reviewsToday}</div>
                  <div className="text-xs text-muted-foreground">of {reviewGoal}</div>
                </div>
              </RadialProgress>

              <Link href="/review" className="w-full mt-6">
                <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                  Start Review <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="decks">My Decks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 gap-6">
              <Card className="shadow-md dark:shadow-slate-800/30 bg-card/50 backdrop-blur-sm border-primary/10">
                <CardHeader>
                  <CardTitle className="text-xl">Previous Progress</CardTitle>
                  <CardDescription>Your recent learning history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.reviewHistory &&
                      stats.reviewHistory.slice(-5).map((day: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span>{day.date}</span>
                          </div>
                          <div className="flex gap-4">
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-green-500">✓ {day.correct}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-red-500">✗ {day.incorrect}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    {(!stats.reviewHistory || stats.reviewHistory.length === 0) && (
                      <div className="text-center py-4 text-muted-foreground">
                        No review history available yet. Start reviewing cards to track your progress!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-md dark:shadow-slate-800/30 bg-card/50 backdrop-blur-sm border-primary/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Brain className="h-5 w-5 text-purple-500" />
                      Spaced Repetition
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Learn efficiently with scientifically-proven spaced repetition algorithm</p>
                  </CardContent>
                </Card>

                <Card className="shadow-md dark:shadow-slate-800/30 bg-card/50 backdrop-blur-sm border-primary/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
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
                        className="text-amber-500"
                      >
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                      </svg>
                      Track Streaks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Build a habit with daily streaks and motivational milestones</p>
                  </CardContent>
                </Card>

                <Card className="shadow-md dark:shadow-slate-800/30 bg-card/50 backdrop-blur-sm border-primary/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <LayoutDashboard className="h-5 w-5 text-blue-500" />
                      Visual Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Monitor your progress with beautiful charts and visualizations</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center mt-4">
                <Link href="/stats">
                  <Button variant="outline">
                    View Detailed Stats <LayoutDashboard className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="decks" className="mt-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Flashcard Decks</h2>
              <Button
                onClick={() => setShowNewDeckDialog(true)}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                <Plus className="mr-2 h-4 w-4" /> New Deck
              </Button>
            </div>

            <DeckList decks={decks} setDecks={setDecks} />
          </TabsContent>
        </Tabs>

        <footer className="text-center text-sm text-muted-foreground mt-12">Made by Dax Gondaliya</footer>
      </div>

      {showNewDeckDialog && (
        <NewDeckDialog open={showNewDeckDialog} onOpenChange={setShowNewDeckDialog} onAddDeck={handleAddDeck} />
      )}
    </div>
  )
}
