"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import DashboardLayout from "@/components/DashboardLayout"
import Link from "next/link"

// Category type definition
type Category = {
  id: number
  name: string
  color: string
}

export default function TrainingGame() {
  const [selectedImage, setSelectedImage] = useState(diceImages[0])
  const [isRolling, setIsRolling] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<{ question: string; answer: string } | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)


  const rollDice = () => {
    setIsRolling(true)
    const audio = new Audio("/dice-roll.mp3")
    audio.play()

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * diceImages.length)
      setSelectedImage(diceImages[randomIndex])
      setIsRolling(false)
    }, 800)
  }


  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        <div className="max-w-full mx-auto p-8">
          <div className="space-y-12">
            {/* Main Content */}
            <div className="flex w-full justify-between gap-16">
              {/* Dice Section */}
              <div className="flex scene w-[320px] h-[320px] perspective-1000 justify-center items-start cursor-pointer" onClick={rollDice}>
                {isRolling ? (
                  <video autoPlay loop
                    src="/Dice Number 6.mp4"
                    className={`w-[320px] h-[250px] border-2 border-black bg-white dice-face ${!isRolling ? "z-10" : ""}`}
                  />
                ) : (
                  <Image src={selectedImage} alt="Dice Face" width={350} height={350} className="border-2 border-black" />
                )}
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-3 w-full items-center justify-center gap-8">
                {categories.map((category, index) => (
                  <Link
                    key={category.id}
                    href={`/qa-game?id=${category.id}&&name=${category.name}`}
                    className={cn(
                      category.color,
                      "w-[80%] h-[200px] aspect-square relative p-8 text-center font-bold text-3xl whitespace-pre-line",
                    )}
                  >
                    {/* CIS corners */}
                    <div className="absolute top-2 left-2 bg-[#4a5f31] text-white text-xs p-1">CIS</div>
                    <div className="absolute top-2 right-2 bg-[#4a5f31] text-white text-xs p-1">CIS</div>
                    <div className="absolute bottom-2 left-2 bg-[#4a5f31] text-white text-xs p-1">CIS</div>
                    <div className="absolute bottom-2 right-2 bg-[#4a5f31] text-white text-xs p-1">CIS</div>
                    {category.name}
                  </Link>
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
        </div>
      </div>
    </DashboardLayout>
  )
}


const diceImages = [
  "/dice/dice-face-1.png",
  "/dice/dice-face-2.png",
  "/dice/dice-face-3.png",
  "/dice/dice-face-4.png",
  "/dice/dice-face-5.png",
  "/dice/dice-face-6.png",
]
const categories: Category[] = [
  {
    id: 1,
    name: "MORSE CODE",
    color: "bg-[#E535E5]",
  },
  {
    id: 2,
    name: "PHONETIC ALPHABET",
    color: "bg-[#35E5E5]",
  },
  {
    id: 3,
    name: "VOICE PROCEDURE",
    color: "bg-[#FFD700]"
  },
  {
    id: 4,
    name: "RADIO",
    color: "bg-[#FF1493]",
  },
  {
    id: 5,
    name: "RECEIVE ORDERS",
    color: "bg-[#4CAF50]",
  },
  {
    id: 6,
    name: "SPARE",
    color: "bg-[#4CAF50]",
  },
]