"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"
import DashboardLayout from "@/components/DashboardLayout"

// Category type definition
type Category = {
  id: string
  name: string
  color: string
  questions: Array<{
    question: string
    answer: string
  }>
}

// Categories data
const categories: Category[] = [
  {
    id: "morse",
    name: "MORSE\nCODE",
    color: "bg-[#E535E5]", // Purple
    questions: [
      {
        question: "What is the Morse code for SOS?",
        answer: "... --- ...",
      },
      // Add more Morse code questions
    ],
  },
  {
    id: "phonetic",
    name: "PHONETIC\nALPHABET",
    color: "bg-[#35E5E5]", // Blue
    questions: [
      {
        question: "What is the phonetic alphabet for 'B'?",
        answer: "BRAVO",
      },
      // Add more phonetic alphabet questions
    ],
  },
  {
    id: "voice",
    name: "VOICE\nPROCEDURE",
    color: "bg-[#FFD700]", // Yellow
    questions: [
      {
        question: "What PROWORD would you use to indicate an error in transmission?",
        answer: "CORRECTION",
      },
      // Add more voice procedure questions
    ],
  },
  {
    id: "radio",
    name: "RADIO",
    color: "bg-[#FF1493]", // Pink
    questions: [
      {
        question: "What is the standard radio check response format?",
        answer: "ROGER, [STRENGTH] [READABILITY]",
      },
      // Add more radio questions
    ],
  },
  {
    id: "orders1",
    name: "RECEIVE\nORDERS",
    color: "bg-[#4CAF50]", // Green
    questions: [
      {
        question: "What are the 5 components of a Warning Order?",
        answer: "Situation, Mission, Execution, Service Support, Command & Signal",
      },
      // Add more orders questions
    ],
  },
  {
    id: "orders2",
    name: "RECEIVE\nORDERS",
    color: "bg-[#4CAF50]", // Green
    questions: [
      {
        question: "What is the correct format for acknowledging orders?",
        answer: "WILCO - Will Comply, or CANNOT COMPLY - State Reason",
      },
      // Add more orders questions
    ],
  },
]

export default function TrainingGame() {
  const [diceValue, setDiceValue] = useState(1)
  const [isRolling, setIsRolling] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<{ question: string; answer: string } | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)

  // Generate dots for the dice face
  const generateDots = (value: number) => {
    const dots = []
    for (let i = 0; i < value; i++) {
      dots.push(<div key={i} className="w-12 h-12 bg-black rounded-full" />)
    }
    return dots
  }

  const rollDice = () => {
    if (isRolling) return
    setIsRolling(true)
    const audio = new Audio("/dice-roll.mp3")
    audio.play()

    setTimeout(() => {
      const newValue = Math.floor(Math.random() * 6) + 1
      setDiceValue(newValue)
      setIsRolling(false)
    }, 1000)
  }

  const selectCategory = (category: Category) => {
    setSelectedCategory(category)
    const randomIndex = Math.floor(Math.random() * category.questions.length)
    setCurrentQuestion(category.questions[randomIndex])
    setShowAnswer(false)
  }

  const handleBack = () => {
    setSelectedCategory(null)
    setCurrentQuestion(null)
    setShowAnswer(false)
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f5f5f5] p-8">
        <div className="max-w-full mx-auto">
          {!selectedCategory ? (
            <>
              <div className="flex w-full space-y-8 gap-8">
                {/* Dice Section */}
                <div className="flex items-start">
                  <div className="bg-white border-2 border-black p-4 w-[300px]">
                    <div className="text-sm text-gray-600 mb-2">Online-Stopwatch</div>
                    <motion.div
                      className="w-[250px] h-[250px] border-2 border-black p-4 grid grid-cols-3 gap-2 cursor-pointer"
                      animate={isRolling ? { rotate: 360 } : {}}
                      transition={{ duration: 0.5 }}
                      onClick={rollDice}
                    >
                      {generateDots(diceValue)}
                    </motion.div>
                  </div>
                </div>

                {/* Categories Grid */}
                <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-8">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => selectCategory(category)}
                      className={cn(
                        category.color,
                        "h-[200px] relative p-8 text-center font-bold text-2xl whitespace-pre-line",
                      )}
                    >
                      {/* CIS corners */}
                      <div className="absolute top-2 left-2 bg-[#4a5f31] text-white text-xs p-1">CIS</div>
                      <div className="absolute top-2 right-2 bg-[#4a5f31] text-white text-xs p-1">CIS</div>
                      <div className="absolute bottom-2 left-2 bg-[#4a5f31] text-white text-xs p-1">CIS</div>
                      <div className="absolute bottom-2 right-2 bg-[#4a5f31] text-white text-xs p-1">CIS</div>
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-8">
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 bg-[#4a5f31] flex items-center justify-center">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-02-11%20at%2020.44.39_faea61c3.jpg-JRDMhlr1qIEyKwyXKaedhDE7s6avn9.jpeg"
                      alt="CIS Logo"
                      width={80}
                      height={80}
                      className="rounded-lg"
                    />
                  </div>
                  <span className="text-4xl font-bold text-[#1a237e]">EXERCISE &apos;ROGER SO FAR&apos;</span>
                </div>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-02-11%20at%2020.44.39_faea61c3.jpeg-JRDMhlr1qIEyKwyXKaedhDE7s6avn9.jpeg"
                  alt="Communications Information Systems"
                  width={100}
                  height={100}
                  className="rounded-lg"
                />
              </div>
            </>
          ) : (
            // Question Screen
            <div className="h-screen flex flex-col items-center justify-center p-8">
              <div className={cn(selectedCategory.color, "w-full max-w-4xl p-12 rounded-lg text-center space-y-8")}>
                <h2 className="text-4xl font-bold mb-8">{selectedCategory.name}</h2>
                {currentQuestion && (
                  <>
                    <div className="text-3xl font-bold mb-8">{currentQuestion.question}</div>
                    {showAnswer && (
                      <div className="text-3xl font-bold p-4 bg-white/90 rounded">{currentQuestion.answer}</div>
                    )}
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setShowAnswer(!showAnswer)}
                        className="bg-white px-8 py-4 rounded-lg text-xl font-bold"
                      >
                        {showAnswer ? "Hide Answer" : "Reveal Answer"}
                      </button>
                      <button onClick={handleBack} className="bg-white px-8 py-4 rounded-lg text-xl font-bold">
                        Back to Categories
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

