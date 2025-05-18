"use client"

import type React from "react"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface NewCardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deckId: string
  onAddCard: (deckId: string, card: any) => void
}

export function NewCardDialog({ open, onOpenChange, deckId, onAddCard }: NewCardDialogProps) {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!question.trim()) {
      setError("Question is required")
      return
    }

    if (!answer.trim()) {
      setError("Answer is required")
      return
    }

    const newCard = {
      id: uuidv4(),
      question: question.trim(),
      answer: answer.trim(),
      level: 0,
      nextReview: Date.now(),
      notes: "",
      flagged: false,
    }

    onAddCard(deckId, newCard)
    onOpenChange(false)

    // Reset form
    setQuestion("")
    setAnswer("")
    setError("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Card</DialogTitle>
            <DialogDescription>Create a new flashcard for your deck.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., What is the capital of France?"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="e.g., Paris"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Card</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
