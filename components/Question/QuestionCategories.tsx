"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import UploadQuestionModal from "./UploadQuestionModal"

interface Option {
  id: string
  text: string
}

interface Question {
  id: number
  question: string
  options: Option[]
  correctAnswerId: string
}

interface Category {
  id: string
  name: string
  color: string
  questions: Question[]
}

const categories: Category[] = [
  {
    id: "history",
    name: "History",
    color: "bg-red-100 hover:bg-red-200 text-red-700",
    questions: [
      {
        id: 1,
        question: "Who was the first President of the United States?",
        options: [
          { id: "a", text: "George Washington" },
          { id: "b", text: "Thomas Jefferson" },
          { id: "c", text: "John Adams" },
          { id: "d", text: "Benjamin Franklin" },
        ],
        correctAnswerId: "a",
      },
      {
        id: 2,
        question: "In which year did World War II end?",
        options: [
          { id: "a", text: "1943" },
          { id: "b", text: "1944" },
          { id: "c", text: "1945" },
          { id: "d", text: "1946" },
        ],
        correctAnswerId: "c",
      },
    ],
  },
  {
    id: "science",
    name: "Science",
    color: "bg-green-100 hover:bg-green-200 text-green-700",
    questions: [
      {
        id: 1,
        question: "What is the chemical symbol for gold?",
        options: [
          { id: "a", text: "Au" },
          { id: "b", text: "Ag" },
          { id: "c", text: "Fe" },
          { id: "d", text: "Cu" },
        ],
        correctAnswerId: "a",
      },
      {
        id: 2,
        question: "What is the largest planet in our solar system?",
        options: [
          { id: "a", text: "Earth" },
          { id: "b", text: "Mars" },
          { id: "c", text: "Jupiter" },
          { id: "d", text: "Saturn" },
        ],
        correctAnswerId: "c",
      },
    ],
  },
  {
    id: "geography",
    name: "Geography",
    color: "bg-yellow-100 hover:bg-yellow-200 text-yellow-700",
    questions: [
      {
        id: 1,
        question: "What is the capital of France?",
        options: [
          { id: "a", text: "Paris" },
          { id: "b", text: "Rome" },
          { id: "c", text: "London" },
          { id: "d", text: "Berlin" },
        ],
        correctAnswerId: "a",
      },
      {
        id: 2,
        question: "Which is the largest ocean on Earth?",
        options: [
          { id: "a", text: "Atlantic Ocean" },
          { id: "b", text: "Indian Ocean" },
          { id: "c", text: "Arctic Ocean" },
          { id: "d", text: "Pacific Ocean" },
        ],
        correctAnswerId: "d",
      },
    ],
  },
  {
    id: "literature",
    name: "Literature",
    color: "bg-purple-100 hover:bg-purple-200 text-purple-700",
    questions: [
      {
        id: 1,
        question: "Who wrote 'Romeo and Juliet'?",
        options: [
          { id: "a", text: "William Shakespeare" },
          { id: "b", text: "Jane Austen" },
          { id: "c", text: "Charles Dickens" },
          { id: "d", text: "Leo Tolstoy" },
        ],
        correctAnswerId: "a",
      },
      {
        id: 2,
        question: "What's the name of the first Harry Potter book?",
        options: [
          { id: "a", text: "Harry Potter and the Chamber of Secrets" },
          { id: "b", text: "Harry Potter and the Prisoner of Azkaban" },
          { id: "c", text: "Harry Potter and the Goblet of Fire" },
          { id: "d", text: "Harry Potter and the Philosopher's Stone" },
        ],
        correctAnswerId: "d",
      },
    ],
  },
  {
    id: "sports",
    name: "Sports",
    color: "bg-blue-100 hover:bg-blue-200 text-blue-700",
    questions: [
      {
        id: 1,
        question: "In which sport would you perform a slam dunk?",
        options: [
          { id: "a", text: "Basketball" },
          { id: "b", text: "Soccer" },
          { id: "c", text: "Tennis" },
          { id: "d", text: "Golf" },
        ],
        correctAnswerId: "a",
      },
      {
        id: 2,
        question: "How many players are there in a soccer team?",
        options: [
          { id: "a", text: "10" },
          { id: "b", text: "11" },
          { id: "c", text: "12" },
          { id: "d", text: "13" },
        ],
        correctAnswerId: "b",
      },
    ],
  },
]

export default function QuestionCategories() {
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const { toast } = useToast()

  const selectCategory = (category: Category) => {
    setCurrentCategory(category)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowAnswer(false)
    setScore(0)
    setShowScore(false)
  }

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId)
    if (!currentCategory) return

    const currentQuestion = currentCategory.questions[currentQuestionIndex]
    const isCorrect = answerId === currentQuestion.correctAnswerId
    const audio = new Audio(isCorrect ? "" : "/raspberry.mp3")
    audio.play()

    if (isCorrect) {
      setScore(score + 1)
    }

    toast({
      title: isCorrect ? "Correct!" : "Incorrect",
      description: isCorrect
        ? "Great job!"
        : `The correct answer was: ${currentQuestion.options.find((opt) => opt.id === currentQuestion.correctAnswerId)?.text}`,
      variant: isCorrect ? "default" : "destructive",
    })

    setShowAnswer(true)
  }

  const handleUploadQuestion = (newQuestion: Question) => {
    if (currentCategory) {
      const updatedCategory = {
        ...currentCategory,
        questions: [...currentCategory.questions, newQuestion],
      }
      setCurrentCategory(updatedCategory)
      // In a real application, you'd want to update this in your backend as well
    }
    setIsModalOpen(false)
  }

  const resetQuiz = () => {
    setCurrentCategory(null)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowAnswer(false)
    setScore(0)
    setShowScore(false)
  }

  const previousQuestion = () => {
    setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
    setSelectedAnswer(null)
    setShowAnswer(false)
  }

  const nextQuestion = () => {
    if (!currentCategory) return
    if (currentQuestionIndex === currentCategory.questions.length - 1) {
      setShowScore(true)
      return
    }
    setCurrentQuestionIndex(currentQuestionIndex + 1)
    setSelectedAnswer(null)
    setShowAnswer(false)
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Question Categories</CardTitle>
        <Button variant="outline" size="icon" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {!currentCategory ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {categories.map((category) => (
              <Button
                key={category.id}
                className={`${category.color} font-semibold py-2 px-4 rounded-lg text-sm`}
                onClick={() => selectCategory(category)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        ) : showScore ? (
          <Card>
            <CardHeader>
              <CardTitle className={`text-2xl p-2 font-bold ${currentCategory.color}`}>Quiz Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xl">
                Your score: {score} out of {currentCategory.questions.length}
              </p>
              <Progress value={(score / currentCategory.questions.length) * 100} className="w-full h-4" />
              <p className="text-lg">
                {score === currentCategory.questions.length
                  ? "Perfect score! Congratulations!"
                  : score > currentCategory.questions.length / 2
                    ? "Great job! Keep it up!"
                    : "Good effort! Try again to improve your score."}
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={resetQuiz} className="w-full">
                Back to Categories
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className={`text-lg p-2 font-semibold ${currentCategory.color}`}>
                {currentCategory.name} - Question {currentQuestionIndex + 1}/{currentCategory.questions.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold mb-4">{currentCategory.questions[currentQuestionIndex].question}</p>
              <RadioGroup
                value={selectedAnswer || ""}
                onValueChange={handleAnswerSelect}
                className="space-y-2"
                disabled={showAnswer}
              >
                {currentCategory.questions[currentQuestionIndex].options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id}>{option.text}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={previousQuestion} disabled={currentQuestionIndex === 0} variant="outline">
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button onClick={nextQuestion} disabled={!showAnswer} variant="outline">
                {currentQuestionIndex === currentCategory.questions.length - 1 ? "Finish" : "Next"}{" "}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}
      </CardContent>
      {currentCategory && !showScore && (
        <CardFooter>
          <Button onClick={resetQuiz} variant="ghost">
            Back to Categories
          </Button>
        </CardFooter>
      )}
      <UploadQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUploadQuestion}
        categoryId={currentCategory?.id || ""}
      />
    </Card>
  )
}

