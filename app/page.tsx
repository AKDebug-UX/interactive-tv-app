"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import DashboardLayout from "@/components/DashboardLayout"
import Link from "next/link"

// Category type definition
type Category = {
  id: number
  img: string
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
      <div className="max-w-full mx-auto">
        <div className="space-y-12">
          {/* Main Content */}
          <div className="flex w-full justify-between gap-16">
            {/* Dice Section */}
            <div className="flex scene w-[350px] h-[350px] perspective-1000 justify-center items-start cursor-pointer" onClick={rollDice}>
              {isRolling ? (
                <video
                  autoPlay
                  loop
                  src="/Dice video.mp4"
                  className={`w-[350px] h-[270px] border-2 border-black bg-white dice-face ${!isRolling ? "z-10" : ""}`}
                />

              ) : (
                <Image src={selectedImage} alt="Dice Face" width={350} height={350} className="border-2 border-black" />
              )}
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-3 w-full items-center justify-center gap-12">
              {categories.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/qa-game?id=${category.id}&&name=${category.name}`}
                  className={"w-[250px] h-[250px] aspect-square relative p-8 text-center font-bold text-3xl whitespace-pre-line"}
                >
                  <Image src={`img/${category.img}`} alt="Dice Face" fill className="" />
                </Link>
              ))}
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
    img: "Morse_Code.png",
    name: "MORSE CODE",
    color: "bg-[#E535E5]",
  },
  {
    id: 2,
    img: "Phonetic_Alphabet.png",
    name: "PHONETIC ALPHABET",
    color: "bg-[#35E5E5]",
  },
  {
    id: 3,
    img: "Voice_Procedure.png",
    name: "VOICE PROCEDURE",
    color: "bg-[#FFD700]"
  },
  {
    id: 4,
    img: "Radio.jpg",
    name: "RADIO",
    color: "bg-[#FF1493]",
  },
  {
    id: 5,
    img: "Recieve_Orders.png",
    name: "RECEIVE ORDERS",
    color: "bg-[#4CAF50]",
  },
  {
    id: 6,
    img: "Spare.jpg",
    name: "SPARE",
    color: "bg-[#4CAF50]",
  },
]