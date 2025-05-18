"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EditDeckDialog } from "@/components/edit-deck-dialog"
import { NewCardDialog } from "@/components/new-card-dialog"

interface DeckListProps {
  decks: any[]
  setDecks: (decks: any[]) => void
}

export function DeckList({ decks, setDecks }: DeckListProps) {
  const [editDeckId, setEditDeckId] = useState<string | null>(null)
  const [addCardToDeckId, setAddCardToDeckId] = useState<string | null>(null)

  const handleDeleteDeck = (deckId: string) => {
    const updatedDecks = decks.filter((deck) => deck.id !== deckId)
    setDecks(updatedDecks)
    localStorage.setItem("flashcard-decks", JSON.stringify(updatedDecks))

    // Update total cards count
    const totalCardCount = updatedDecks.reduce((sum, deck) => sum + deck.cards.length, 0)
    const stats = JSON.parse(localStorage.getItem("flashcard-stats") || "{}")
    localStorage.setItem(
      "flashcard-stats",
      JSON.stringify({
        ...stats,
        totalCards: totalCardCount,
      }),
    )
  }

  const handleUpdateDeck = (updatedDeck: any) => {
    const updatedDecks = decks.map((deck) => (deck.id === updatedDeck.id ? updatedDeck : deck))
    setDecks(updatedDecks)
    localStorage.setItem("flashcard-decks", JSON.stringify(updatedDecks))
  }

  const handleAddCard = (deckId: string, newCard: any) => {
    const updatedDecks = decks.map((deck) => {
      if (deck.id === deckId) {
        // Add the new card to this deck
        return {
          ...deck,
          cards: [...deck.cards, newCard],
        }
      }
      return deck
    })

    setDecks(updatedDecks)
    localStorage.setItem("flashcard-decks", JSON.stringify(updatedDecks))

    // Update total cards count
    const totalCardCount = updatedDecks.reduce((sum, deck) => sum + deck.cards.length, 0)
    const stats = JSON.parse(localStorage.getItem("flashcard-stats") || "{}")
    localStorage.setItem(
      "flashcard-stats",
      JSON.stringify({
        ...stats,
        totalCards: totalCardCount,
      }),
    )
  }

  const getDueCardCount = (cards: any[]) => {
    const now = Date.now()
    return cards.filter((card) => card.nextReview <= now).length
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {decks.map((deck) => {
        const dueCards = getDueCardCount(deck.cards)

        return (
          <Card
            key={deck.id}
            className="shadow-md dark:shadow-slate-800/30 bg-card/50 backdrop-blur-sm border-primary/10"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{deck.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditDeckId(deck.id)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit Deck
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAddCardToDeckId(deck.id)}>
                      <Plus className="mr-2 h-4 w-4" /> Add Card
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteDeck(deck.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" /> Delete Deck
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>{deck.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm mb-1">
                <span>Total Cards:</span>
                <span className="font-medium">{deck.cards.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Cards Due:</span>
                <span className={`font-medium ${dueCards > 0 ? "text-primary" : ""}`}>{dueCards}</span>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Link href={`/review?deck=${deck.id}`} className="flex-1">
                <Button className="w-full" variant={dueCards > 0 ? "default" : "outline"} disabled={dueCards === 0}>
                  {dueCards > 0 ? "Review Now" : "No Cards Due"}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        )
      })}

      {editDeckId && (
        <EditDeckDialog
          open={!!editDeckId}
          onOpenChange={() => setEditDeckId(null)}
          deck={decks.find((d) => d.id === editDeckId)}
          onUpdateDeck={handleUpdateDeck}
        />
      )}

      {addCardToDeckId && (
        <NewCardDialog
          open={!!addCardToDeckId}
          onOpenChange={() => setAddCardToDeckId(null)}
          deckId={addCardToDeckId}
          onAddCard={handleAddCard}
        />
      )}
    </div>
  )
}
