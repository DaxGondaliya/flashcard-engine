"use client"
import { motion } from "framer-motion"

interface FlashcardProps {
  question: string
  answer: string
  isFlipped: boolean
  onFlip: () => void
}

export default function Flashcard({ question, answer, isFlipped, onFlip }: FlashcardProps) {
  // Sound effect for card flip
  const playFlipSound = () => {
    const audio = new Audio("/flip-sound.mp3")
    audio.volume = 0.3
    audio.play().catch((e) => console.log("Audio play failed:", e))
  }

  const handleFlip = () => {
    playFlipSound()
    onFlip()
  }

  return (
    <div className="w-full max-w-md h-64 md:h-80 cursor-pointer perspective-1000" onClick={handleFlip}>
      <motion.div
        className="relative w-full h-full preserve-3d transition-transform duration-500"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Front side (Question) */}
        <div className="absolute w-full h-full backface-hidden rounded-xl p-6 flex flex-col justify-center items-center text-center bg-card/95 backdrop-blur-sm shadow-lg dark:shadow-slate-700/30 border border-primary/10">
          <h3 className="text-xl font-semibold mb-4">Question</h3>
          <p className="text-lg">{question}</p>
          <div className="mt-6 text-sm text-muted-foreground">Click to flip</div>
        </div>

        {/* Back side (Answer) */}
        <div className="absolute w-full h-full backface-hidden rounded-xl p-6 flex flex-col justify-center items-center text-center bg-card/95 backdrop-blur-sm shadow-lg dark:shadow-slate-700/30 border border-primary/10 rotate-y-180">
          <h3 className="text-xl font-semibold mb-4">Answer</h3>
          <p className="text-lg">{answer}</p>
          <div className="mt-6 text-sm text-muted-foreground">Click to flip back</div>
        </div>
      </motion.div>
    </div>
  )
}
