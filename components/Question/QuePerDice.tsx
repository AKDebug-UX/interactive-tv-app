"use client"

import { useState, useEffect, Suspense, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface Option {
  id: string
  text: string
}

interface Question {
  question: string
  options: Option[]
  correctAnswerId: string
  category?: string
}

type Category = string

function getRandomQuestion(questions: Question[], askedQuestions: Set<string>): Question | null {
  const availableQuestions = questions.filter((q) => !askedQuestions.has(q.question))
  if (availableQuestions.length === 0) return null
  return availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
}

function QuePerDice(): JSX.Element {
  const searchParams = useSearchParams()
  const id = searchParams.get("id") ?? "1"
  const name = searchParams.get("name") ?? "Unknown"
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category>("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set())
  const [showAnswer, setShowAnswer] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [timeLeft, setTimeLeft] = useState<number>(30)
  const [timerActive, setTimerActive] = useState<boolean>(false)

  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    return () => {
      audioContextRef.current?.close()
    }
  }, [])

  const playSound = useCallback((frequency: number, duration: number) => {
    if (audioContextRef.current) {
      const oscillator = audioContextRef.current.createOscillator()
      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
      const gainNode = audioContextRef.current.createGain()
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime)
      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)
      oscillator.start()
      oscillator.stop(audioContextRef.current.currentTime + duration)
    }
  }, [])

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch("/api/questions")
        const data = await res.json()
        if (data.success && data.data.length > 0) {
          const groupedQuestions: Record<Category, Question[]> = {}
          data.data.forEach((q: { category: string; question: string; options: Option[]; correctAnswerId: string }) => {
            if (!groupedQuestions[q.category]) groupedQuestions[q.category] = []
            groupedQuestions[q.category].push(q)
          })
          setCategories(Object.keys(groupedQuestions))
          setSelectedCategory(name)
          setQuestions(groupedQuestions[name] || [])
          setAskedQuestions(new Set())
          setCurrentQuestion(getRandomQuestion(groupedQuestions[name] || [], new Set()))
        }

        // Store in cache for offline use
        if ("caches" in window) {
          const cache = await caches.open("api-cache")
          await cache.put(
            "/api/questions",
            new Response(JSON.stringify(data), {
              headers: { "Content-Type": "application/json" },
            }),
          )
        }
      } catch (error) {
        console.error("Error fetching questions:", error)

        // Try to get from cache if network request fails
        if ("caches" in window) {
          try {
            const cache = await caches.open("api-cache")
            const cachedResponse = await cache.match("/api/questions")

            if (cachedResponse) {
              const cachedData = await cachedResponse.json()
              if (cachedData.success && cachedData.data.length > 0) {
                const groupedQuestions: Record<Category, Question[]> = {}
                cachedData.data.forEach(
                  (q: { category: string; question: string; options: Option[]; correctAnswerId: string }) => {
                    if (!groupedQuestions[q.category]) groupedQuestions[q.category] = []
                    groupedQuestions[q.category].push(q)
                  },
                )
                setCategories(Object.keys(groupedQuestions))
                setSelectedCategory(name)
                setQuestions(groupedQuestions[name] || [])
                setAskedQuestions(new Set())
                setCurrentQuestion(getRandomQuestion(groupedQuestions[name] || [], new Set()))
              }
            }
          } catch (cacheError) {
            console.error("Error fetching from cache:", cacheError)
          }
        }
      } finally {
        setLoading(false)
        setTimeout(() => {
          setTimerActive(true)
        }, 500) // Ensure UI loads first before starting timer
      }
    }
    fetchQuestions()
  }, [name])

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
        playSound(840, 0.1)
      }, 1000)
      return () => clearTimeout(timerId)
    } else if (timeLeft === 0) {
      setTimerActive(false)
      playSound(880, 0.5)
    }
  }, [timerActive, timeLeft, playSound])

  const handleContinue = () => {
    setShowAnswer(false)
    const nextQuestion = getRandomQuestion(questions, askedQuestions)
    if (nextQuestion) {
      setAskedQuestions((prev) => new Set([...prev, nextQuestion.question]))
      setCurrentQuestion(nextQuestion)
      setTimeLeft(30)
      setTimerActive(true)
    }
  }

  return (
    <div className="w-full flex mb-12 items-center justify-center">
      {!loading ? (
        <div className="flex flex-col md:flex-row w-full gap-16 items-center">
          <div className="mx-auto text-center">
            <div className="scene w-[300px] h-[300px] flex justify-center items-start cursor-pointer">
              <Image
                src={`/dice/dice-face-${id}.png`}
                alt="Dice Face"
                width={350}
                height={350}
                className="border-2 border-black"
              />
            </div>
            <div className="mt-4 text-2xl font-bold">{timerActive ? `Time left: ${timeLeft}s` : "Time's up!"}</div>
            <div className="mt-4">
              <button
                onClick={handleContinue}
                className="bg-[#4a5f31] hover:bg-[#3d4f28] text-white px-4 py-2 text-lg rounded"
              >
                {timerActive ? "Skip" : "Next Question"}
              </button>
            </div>
            <div className="mt-16">
              <Link href="/" className="bg-[#4a5f31] hover:bg-[#3d4f28] text-white px-8 py-4 text-xl">
                Back to Home
              </Link>
            </div>
          </div>

          <div className="flex flex-col w-[70%] items-center justify-between space-x-8">
            <div className="p-6 mt-4 w-full">
              {currentQuestion ? (
                <div className="font-bold md:w-[80%] mx-auto text-center">
                  <h2 className="text-3xl mb-6">Q: {currentQuestion.question}</h2>
                  {currentQuestion.options.length > 1 && (
                    <ul className="text-left text-xl">
                      {currentQuestion.options.map((option) => (
                        <li
                          key={option.id}
                          className={`p-2 text-sm rounded ${showAnswer && option.id === currentQuestion.correctAnswerId ? "bg-green-200" : ""}`}
                        >
                          {option.id.toUpperCase()}. {option.text}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <p className="text-lg">No questions available for this category.</p>
              )}
            </div>
            {currentQuestion && (
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="mt-4 text-2xl font-semibold text-gray-800 bg-yellow-200 px-4 py-2 rounded"
              >
                {showAnswer ? "Hide Answer" : "Show Answer"}
              </button>
            )}
            {currentQuestion && showAnswer && (
              <div className="mt-4 text-2xl font-semibold text-green-600">
                Ans: {currentQuestion.options.find((opt) => opt.id === currentQuestion.correctAnswerId)?.text}
              </div>
            )}

            <span
              className="text-6xl text-[#FFD700] mt-20 font-bold"
              style={{
                textShadow: "2px 2px 0px black, -2px 2px 0px black, 2px -2px 0px black, -2px -2px 0px black",
              }}
            >
              "{name}"
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary" />
        </div>
      )}
    </div>
  )
}

export default function WithSuspense() {
  return (
    <Suspense fallback={<>Loading...</>}>
      <QuePerDice />
    </Suspense>
  )
}
