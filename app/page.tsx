"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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

const categories: Category[] = [
  {
    id: "morse",
    name: "MORSE\nCODE",
    color: "bg-[#E535E5]",
    questions: [
      {
        question: "What is the Morse code for SOS?",
        answer: "... --- ...",
      },
    ],
  },
  {
    id: "phonetic",
    name: "PHONETIC\nALPHABET",
    color: "bg-[#35E5E5]",
    questions: [
      {
        question: "What is the phonetic alphabet for 'B'?",
        answer: "BRAVO",
      },
    ],
  },
  {
    id: "voice",
    name: "VOICE\nPROCEDURE",
    color: "bg-[#FFD700]",
    questions: [
      {
        question: "What PROWORD would you use to indicate an error in transmission?",
        answer: "CORRECTION",
      },
    ],
  },
  {
    id: "radio",
    name: "RADIO",
    color: "bg-[#FF1493]",
    questions: [
      {
        question: "What is the standard radio check response format?",
        answer: "ROGER, [STRENGTH] [READABILITY]",
      },
    ],
  },
  {
    id: "orders",
    name: "RECEIVE\nORDERS",
    color: "bg-[#4CAF50]",
    questions: [
      {
        question: "What are the 5 components of a Warning Order?",
        answer: "Situation, Mission, Execution, Service Support, Command & Signal",
      },
    ],
  },
  {
    id: "spare",
    name: "SPARE",
    color: "bg-[#4CAF50]",
    questions: [
      {
        question: "Editable spare question slot",
        answer: "Editable spare answer slot",
      },
    ],
  },
]

export default function TrainingGame() {
  const [diceValue, setDiceValue] = useState(1)
  const [isRolling, setIsRolling] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<{ question: string; answer: string } | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)

  const rollDice = () => {
    if (isRolling) return
    setIsRolling(true)
    const audio = new Audio("/dice-roll.mp3")
    audio.play()

    setTimeout(() => {
      const newValue = Math.floor(Math.random() * 6) + 1
      setDiceValue(newValue)
      setIsRolling(false)
    }, 800)
  }

  const getDiceDots = (value: number) => {
    const dots = []
    if (value === 1 || value === 3 || value === 5) dots.push(1) // center
    if (value >= 2) dots.push(2, 3) // top right, bottom left
    if (value >= 4) dots.push(4, 5) // top left, bottom right
    if (value === 6) dots.push(6, 7) // middle left, middle right
    return dots
  }

  const generateDots = (value: number) => {
    const dots = []
    for (let i = 0; i < value; i++) {
      dots.push(<div key={i} className="flex w-14 h-14 p-4 m-auto text-center bg-black rounded-full items-center justify-center" />)
    }
    return dots
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
      <div className="min-h-screen bg-white">
        <div className="max-w-[3840px] mx-auto p-8">
          {!selectedCategory ? (
            // Main Game Screen
            <div className="space-y-12">
              {/* Title */}
              <div className="text-center">
                <h1 className="text-6xl font-bold">&quot;ROGER SO FAR&quot;</h1>
              </div>

              {/* Main Content */}
              <div className="flex justify-between gap-3">
                {/* Dice Section */}
                <div className="flex scene w-[300px] h-[300px] perspective-1000 justify-center items-start cursor-pointer" onClick={rollDice}>
                  {isRolling ? (
                    <video autoPlay loop
                      src="/Dice Number 6.mp4"
                      className={`w-full h-full border-2 border-black bg-white dice-face ${!isRolling ? "z-10" : ""}`}
                    />
                  ) : (
                    <div
                      className={`w-full h-full border-2 border-black mx-auto grid ${diceValue === 1 ? "grid-cols-1" : "grid-cols-2"}`}
                      onClick={rollDice}
                    >
                      {generateDots(diceValue)}
                    </div>
                  )}
                </div>

                {/* Categories Grid */}
                <div className="w-[70%] grid grid-cols-3 gap-8">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => selectCategory(category)}
                      className={cn(
                        category.color,
                        "aspect-square relative p-8 text-center font-bold text-3xl whitespace-pre-line",
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
              <div className="flex items-center justify-between mt-12">
                <div className="flex items-center space-x-8">
                  <div className="w-32 h-32 bg-[#4a5f31] flex items-center justify-center">
                    <span className="text-white text-4xl">CIS</span>
                  </div>
                  <span className="text-6xl font-bold">EXERCISE &apos;ROGER SO FAR&apos;</span>
                </div>

              </div>
            </div>
          ) : (

            // Question Screen
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-screen flex flex-col items-center justify-center"
              >
                <div className={cn(selectedCategory.color, "w-[800px] aspect-square p-16 text-center space-y-8")}>
                  <h2 className="text-4xl font-bold mb-12">{selectedCategory.name}</h2>
                  {currentQuestion && (
                    <>
                      <div className="text-3xl font-bold mb-12">{currentQuestion.question}</div>
                      {showAnswer && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-3xl font-bold p-8 bg-white/90"
                        >
                          {currentQuestion.answer}
                        </motion.div>
                      )}
                      <div className="flex justify-center space-x-8 mt-12">
                        <button
                          onClick={() => setShowAnswer(!showAnswer)}
                          className="bg-white px-12 py-6 text-2xl font-bold"
                        >
                          {showAnswer ? "Hide Answer" : "Reveal Answer"}
                        </button>
                        <button onClick={handleBack} className="bg-white px-12 py-6 text-2xl font-bold">
                          Back
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

