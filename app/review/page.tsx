"use client"

import { cn } from "@/lib/utils"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import confetti from "canvas-confetti"
import { motion } from "framer-motion"
import { ArrowLeft, Check, Flag, MessageSquare, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Flashcard from "@/components/flashcard"
import StreakCounter from "@/components/streak-counter"
import { getRandomMotivationalQuote } from "@/lib/utils"

// Spaced repetition intervals in milliseconds
const spacedIntervals = [
  1000 * 60 * 5, // 5 minutes
  1000 * 60 * 60 * 24, // 1 day
  1000 * 60 * 60 * 24 * 3, // 3 days
  1000 * 60 * 60 * 24 * 7, // 1 week
  1000 * 60 * 60 * 24 * 14, // 2 weeks
  1000 * 60 * 60 * 24 * 30, // 1 month
]

export default function ReviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const deckId = searchParams.get("deck")

  const [decks, setDecks] = useState<any[]>([])
  const [currentDeck, setCurrentDeck] = useState<any>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [cardsToReview, setCardsToReview] = useState<number[]>([])
  const [progress, setProgress] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showQuote, setShowQuote] = useState(false)
  const [quote, setQuote] = useState("")
  const [reviewComplete, setReviewComplete] = useState(false)
  const [masteredCards, setMasteredCards] = useState(0)
  const [xpPoints, setXpPoints] = useState(0)
  const [showNotes, setShowNotes] = useState(false)
  const [currentNotes, setCurrentNotes] = useState("")
  const [earnedXp, setEarnedXp] = useState(0)

  // Initialize review session
  useEffect(() => {
    // Load decks from localStorage
    const savedDecks = localStorage.getItem("flashcard-decks")
    if (savedDecks) {
      const parsedDecks = JSON.parse(savedDecks)
      setDecks(parsedDecks)

      // If deckId is provided, filter for that deck
      if (deckId) {
        const selectedDeck = parsedDecks.find((deck: any) => deck.id === deckId)
        if (selectedDeck) {
          setCurrentDeck(selectedDeck)
          initializeReviewSession(selectedDeck.cards)
        } else {
          // Deck not found, redirect to home
          router.push("/")
        }
      } else {
        // No specific deck, combine all cards
        const allCards = parsedDecks.flatMap((deck: any) => deck.cards)
        setCurrentDeck({ name: "All Decks", cards: allCards })
        initializeReviewSession(allCards)
      }
    }

    // Load stats from localStorage
    const stats = localStorage.getItem("flashcard-stats")
    if (stats) {
      const parsedStats = JSON.parse(stats)
      setStreak(parsedStats.streak || 0)
      setMasteredCards(parsedStats.masteredCards || 0)
      setXpPoints(parsedStats.xpPoints || 0)
    }
  }, [deckId, router])

  const initializeReviewSession = (cards: any[]) => {
    // Get cards due for review
    const now = Date.now()
    const dueCardIndices = cards
      .map((card: any, index: number) => ({ index, nextReview: card.nextReview }))
      .filter((card: any) => card.nextReview <= now)
      .map((card: any) => card.index)
      .slice(0, 10) // Limit to 10 cards per session

    setCardsToReview(dueCardIndices)

    if (dueCardIndices.length === 0) {
      setReviewComplete(true)
    }
  }

  // Update progress when cards to review changes
  useEffect(() => {
    if (cardsToReview.length > 0) {
      setProgress(Math.round((currentCardIndex / cardsToReview.length) * 100))
    }
  }, [currentCardIndex, cardsToReview.length])

  // Save decks to localStorage whenever they change
  useEffect(() => {
    if (decks.length > 0) {
      localStorage.setItem("flashcard-decks", JSON.stringify(decks))
    }
  }, [decks])

  const handleCardResponse = (knew: boolean) => {
    if (!currentDeck || cardsToReview.length === 0) return

    const cardIndex = cardsToReview[currentCardIndex]
    const updatedDecks = [...decks]

    // Find the deck that contains this card
    let deckIndex: number
    let cardIndexInDeck: number

    if (deckId) {
      // We're reviewing a specific deck
      deckIndex = decks.findIndex((deck) => deck.id === deckId)
      cardIndexInDeck = cardIndex
    } else {
      // We're reviewing all decks, need to find which deck contains this card
      let foundCard = false
      let globalCardIndex = 0
      deckIndex = -1
      cardIndexInDeck = -1

      for (let i = 0; i < decks.length; i++) {
        const deck = decks[i]
        for (let j = 0; j < deck.cards.length; j++) {
          if (globalCardIndex === cardIndex) {
            deckIndex = i
            cardIndexInDeck = j
            foundCard = true
            break
          }
          globalCardIndex++
        }
        if (foundCard) break
      }
    }

    if (deckIndex === -1 || cardIndexInDeck === -1) return

    const card = { ...updatedDecks[deckIndex].cards[cardIndexInDeck] }

    // Update card notes if they were changed
    card.notes = currentNotes

    // Calculate XP earned
    let xpEarned = 0

    if (knew) {
      // User knew the answer, increase level (up to max level)
      card.level = Math.min(card.level + 1, spacedIntervals.length - 1)
      xpEarned = 10 + card.level * 5 // More XP for higher level cards

      // If reached max level, count as mastered
      if (card.level === spacedIntervals.length - 1) {
        setMasteredCards((prev) => {
          const newMastered = prev + 1
          // Update stats in localStorage
          const stats = JSON.parse(localStorage.getItem("flashcard-stats") || "{}")
          localStorage.setItem(
            "flashcard-stats",
            JSON.stringify({
              ...stats,
              masteredCards: newMastered,
            }),
          )
          return newMastered
        })

        // Bonus XP for mastering a card
        xpEarned += 50
      }

      // Check if streak milestone reached
      if (streak === 4 || streak === 9 || streak === 14 || streak === 19 || streak === 29) {
        setQuote(getRandomMotivationalQuote())
        setShowQuote(true)

        // Trigger confetti for streak milestones
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }
    } else {
      // User didn't know, reset level to 0
      card.level = 0
      xpEarned = 5 // Less XP for cards you don't know yet
    }

    // Set next review time based on level
    card.nextReview = Date.now() + spacedIntervals[card.level]

    // Update the card in the deck
    updatedDecks[deckIndex].cards[cardIndexInDeck] = card
    setDecks(updatedDecks)

    // Update XP points
    setXpPoints((prev) => {
      const newXp = prev + xpEarned
      setEarnedXp(xpEarned)

      // Update stats in localStorage
      const stats = JSON.parse(localStorage.getItem("flashcard-stats") || "{}")
      localStorage.setItem(
        "flashcard-stats",
        JSON.stringify({
          ...stats,
          xpPoints: newXp,
        }),
      )

      return newXp
    })

    // Update review history
    updateReviewHistory(knew)

    // Move to next card or end session
    if (currentCardIndex < cardsToReview.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
      setShowNotes(false)

      // Set notes for the next card
      if (currentDeck) {
        const nextCardIndex = cardsToReview[currentCardIndex + 1]
        const nextCard = currentDeck.cards[nextCardIndex]
        if (nextCard) {
          setCurrentNotes(nextCard.notes || "")
        }
      }
    } else {
      // Update streak
      setStreak((prev) => {
        const newStreak = prev + 1
        // Update stats in localStorage
        const stats = JSON.parse(localStorage.getItem("flashcard-stats") || "{}")
        localStorage.setItem(
          "flashcard-stats",
          JSON.stringify({
            ...stats,
            streak: newStreak,
            totalCards: decks.reduce((sum, deck) => sum + deck.cards.length, 0),
          }),
        )
        return newStreak
      })

      setReviewComplete(true)
    }
  }

  const updateReviewHistory = (knew: boolean) => {
    const today = new Date().toDateString()
    const stats = JSON.parse(localStorage.getItem("flashcard-stats") || "{}")
    const reviewHistory = stats.reviewHistory || []

    const todayIndex = reviewHistory.findIndex((item: any) => item.date === today)

    if (todayIndex >= 0) {
      // Update existing entry
      if (knew) {
        reviewHistory[todayIndex].correct += 1
      } else {
        reviewHistory[todayIndex].incorrect += 1
      }
    } else {
      // Create new entry for today
      reviewHistory.push({
        date: today,
        correct: knew ? 1 : 0,
        incorrect: knew ? 0 : 1,
      })
    }

    // Update localStorage
    localStorage.setItem(
      "flashcard-stats",
      JSON.stringify({
        ...stats,
        reviewHistory,
      }),
    )
  }

  const handleFlagCard = () => {
    if (!currentDeck || cardsToReview.length === 0) return

    const cardIndex = cardsToReview[currentCardIndex]
    const updatedDecks = [...decks]

    // Find the deck that contains this card
    let deckIndex: number
    let cardIndexInDeck: number

    if (deckId) {
      // We're reviewing a specific deck
      deckIndex = decks.findIndex((deck) => deck.id === deckId)
      cardIndexInDeck = cardIndex
    } else {
      // We're reviewing all decks, need to find which deck contains this card
      let foundCard = false
      let globalCardIndex = 0
      deckIndex = -1
      cardIndexInDeck = -1

      for (let i = 0; i < decks.length; i++) {
        const deck = decks[i]
        for (let j = 0; j < deck.cards.length; j++) {
          if (globalCardIndex === cardIndex) {
            deckIndex = i
            cardIndexInDeck = j
            foundCard = true
            break
          }
          globalCardIndex++
        }
        if (foundCard) break
      }
    }

    if (deckIndex === -1 || cardIndexInDeck === -1) return

    // Toggle flagged status
    const card = { ...updatedDecks[deckIndex].cards[cardIndexInDeck] }
    card.flagged = !card.flagged

    // Update the card in the deck
    updatedDecks[deckIndex].cards[cardIndexInDeck] = card
    setDecks(updatedDecks)
  }

  const currentCard =
    currentDeck && cardsToReview.length > 0 && currentCardIndex < cardsToReview.length
      ? currentDeck.cards[cardsToReview[currentCardIndex]]
      : null

  // Set notes for the current card when it changes
  useEffect(() => {
    if (currentCard) {
      setCurrentNotes(currentCard.notes || "")
    }
  }, [currentCard])

  // Reset isFlipped when currentCardIndex changes
  useEffect(() => {
    setIsFlipped(false)
  }, [currentCardIndex])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => router.push("/")} className="hover:bg-primary/10">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              {currentDeck && <h2 className="text-lg font-medium">{currentDeck.name}</h2>}
            </div>
            <StreakCounter streak={streak} />
          </div>
        </header>

        {reviewComplete ? (
          <div className="flex flex-col items-center justify-center gap-6 mt-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold mb-4">Review Complete!</h2>
              <p className="text-lg mb-6">Great job! You've completed your review session.</p>

              <div className="flex flex-col items-center mb-8">
                <div className="text-3xl font-bold text-primary mb-2">+{earnedXp} XP</div>
                <p className="text-sm text-muted-foreground">Experience points earned this session</p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={() => router.push("/stats")}
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  View Stats
                </Button>
                <Button variant="outline" onClick={() => router.push("/")}>
                  Back to Home
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setReviewComplete(false)
                    setCurrentCardIndex(0)
                    setIsFlipped(false)
                    setShowNotes(false)
                    initializeReviewSession(currentDeck.cards)
                  }}
                >
                  Review Again
                </Button>
              </div>
            </motion.div>
          </div>
        ) : (
          <>
            {showQuote && (
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                onClick={() => setShowQuote(false)}
              >
                <Card className="max-w-md p-6 m-4 bg-card/95 backdrop-blur-sm">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold mb-4">🎉 Streak Milestone!</h3>
                    <p className="text-lg mb-6">{quote}</p>
                    <Button
                      onClick={() => setShowQuote(false)}
                      className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                    >
                      Continue
                    </Button>
                  </motion.div>
                </Card>
              </div>
            )}

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span>Progress</span>
                <span>
                  {currentCardIndex + 1} of {cardsToReview.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {currentCard && (
              <div className="flex flex-col items-center">
                <div className="w-full max-w-md mb-4 flex justify-end">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleFlagCard}
                          className={cn(
                            "rounded-full",
                            currentCard.flagged ? "text-red-500 bg-red-500/10" : "text-muted-foreground",
                          )}
                        >
                          <Flag className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{currentCard.flagged ? "Unflag this card" : "Flag this card for extra review"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowNotes(!showNotes)}
                          className={cn(
                            "rounded-full ml-2",
                            showNotes ? "text-primary bg-primary/10" : "text-muted-foreground",
                            currentNotes ? "ring-1 ring-primary/30" : "",
                          )}
                        >
                          <MessageSquare className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add notes to this card</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <Flashcard
                  question={currentCard.question}
                  answer={currentCard.answer}
                  isFlipped={isFlipped}
                  onFlip={() => setIsFlipped(!isFlipped)}
                />

                {showNotes && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="w-full max-w-md mt-4"
                  >
                    <Textarea
                      placeholder="Add notes for this card..."
                      className="min-h-[100px]"
                      value={currentNotes}
                      onChange={(e) => setCurrentNotes(e.target.value)}
                    />
                  </motion.div>
                )}

                <div className="flex gap-4 mt-8">
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={() => handleCardResponse(false)}
                    disabled={!isFlipped}
                    className="shadow-lg hover:shadow-xl transition-all"
                  >
                    <X className="mr-2 h-5 w-5" /> Don't Know
                  </Button>
                  <Button
                    variant="default"
                    size="lg"
                    onClick={() => handleCardResponse(true)}
                    disabled={!isFlipped}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Check className="mr-2 h-5 w-5" /> Know
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        <footer className="text-center text-sm text-muted-foreground mt-12">Made by Dax Gondaliya</footer>
      </div>
    </div>
  )
}
