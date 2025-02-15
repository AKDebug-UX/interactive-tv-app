"use client"

import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"


function QuePerDice() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [isRolling, setIsRolling] = useState(false)
  const [showQuestion, setShowQuestion] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(questionBank[0])
  const [usedQuestions, setUsedQuestions] = useState<Set<number>>(new Set())

  // Reset used questions when all have been shown
  useEffect(() => {
    if (usedQuestions.size === questionBank.length) {
      setUsedQuestions(new Set())
    }
  }, [usedQuestions])




  return (
    <div className="h-screen w-full bg-[#f5f5f5] md:p-6 items-center justify-center aspect-square">
      <div className="mx-auto">

        <div className="flex flex-col md:flex-row gap-8">
          {/* Dice Section */}
          <div className="flex scene w-[300px] h-[300px] perspective-1000 justify-center items-start cursor-pointer">
            <Image src={`/dice/dice-face-${id}.png`} alt="Dice Face" width={350} height={350} className="border-2 border-black" />
          </div>

          {/* Question Section */}
          <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-02-11%20at%2020.44.39_3590e32a.jpg-BEynDjbxVOxr6Q3LvtsAipvIcloaqB.jpeg"
                alt="Military Communications Logo"
                width={80}
                height={80}
                className="rounded-lg"
              />
              <h1 className="text-2xl md:text-4xl font-bold text-[#1a237e] whitespace-pre-line">"{name}"</h1>
              <div className="w-20 h-20 bg-[#4a5f31] flex items-center justify-center text-white font-mono">CIS</div>
            </div>

            <div className="p-6">
              {showQuestion && (
                <div className="space-y-4">
                  <div className="font-bold md:w-[80%] text-center text-xl">Q: {currentQuestion.question}</div>
                  <div className="text-yellow-400 md:text-5xl mt-8 font-bold p-4 text-center">VOICE PROCEDURE</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Exercise Footer */}
        <div className="flex items-center justify-between mt-[6rem]">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-[#4a5f31] flex items-center justify-center text-white font-mono text-sm">
              CIS
            </div>
            <span className="text-5xl font-bold text-[#1a237e]">EXERCISE &apos;ROGER SO FAR&apos;</span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href={"/"}
            className="bg-[#4a5f31] hover:bg-[#3d4f28] text-white px-8 py-4 text-xl"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
const WithSuspense = () => (
  <Suspense>
    <QuePerDice />
  </Suspense>
);

export default WithSuspense;

// Voice procedure questions bank
const questionBank = [
  {
    question: "What PROWORD would you use to indicate an error in transmission?",
    answer: "CORRECTION",
  },
  {
    question: "What PROWORD indicates the end of a message?",
    answer: "OVER",
  },
  {
    question: "If you wanted to send some numbers, what PROWORD would you use before the first number?",
    answer: "FIGURES",
  },
  {
    question: "What PROWORD would you use to verify the accuracy of a message?",
    answer: "VERIFY",
  },
  {
    question: "What PROWORD means 'I must pause for a few seconds'?",
    answer: "WAIT",
  },
  {
    question: "What PROWORD would you use to indicate message received and understood?",
    answer: "ROGER",
  },
  {
    question: "What PROWORD would you use to indicate priority message?",
    answer: "PRIORITY",
  },
  {
    question: "What PROWORD indicates the message needs to be relayed?",
    answer: "RELAY",
  },
  {
    question: "What PROWORD would you use to request repetition of a message?",
    answer: "SAY AGAIN",
  },
  {
    question: "What PROWORD indicates you're ready to receive a message?",
    answer: "SEND",
  },
  {
    question: "What PROWORD would you use to spell out difficult words?",
    answer: "I SPELL",
  },
  {
    question: "What PROWORD indicates the end of conversation?",
    answer: "OUT",
  },
]

const diceImages = [
  "/dice-face-1.png",
  "/dice-face-2.png",
  "/dice-face-3.png",
  "/dice-face-4.png",
  "/dice-face-5.png",
  "/dice-face-6.png",
]