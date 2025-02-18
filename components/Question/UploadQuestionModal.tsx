"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"

interface Question {
  id: string
  question: string
  category: string
  options: { id: string; text: string }[]
  correctAnswerId: string
}

export default function QuestionManager() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState<string[]>([""])
  const [category, setCategory] = useState("")
  const [correctAnswer, setCorrectAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchQuestions()
  }, [])

  async function fetchQuestions() {
    setLoading(true)
    try {
      const res = await fetch("/api/questions")
      const data = await res.json()
      if (data.success && data.data.length > 0) {
        setQuestions(data.data)
        setCurrentQuestion(data.data[0])
        populateForm(data.data[0])
      }
    } catch (error) {
      console.error("Error fetching questions:", error)
      setError("Failed to fetch questions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const populateForm = (question: Question) => {
    setQuestion(question.question)
    setOptions(question.options.map((opt) => opt.text))
    setCategory(question.category)
    setCorrectAnswer(question.correctAnswerId)
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, ""])
    }
  }

  const removeAllOptions = () => {
    setOptions([])
    setCorrectAnswer("")
  }

  const handleSubmit = async () => {
    if (!question || options.length === 0 || options.some((opt) => opt === "") || !correctAnswer || !category) {
      setError("Please fill in all fields and add at least one option.")
      return
    }

    setLoading(true)
    setError("")

    const updatedQuestion = {
      id: currentQuestion?.id,
      question,
      category,
      options: options.map((text, index) => ({ id: String.fromCharCode(97 + index), text })),
      correctAnswerId: correctAnswer,
    }

    try {
      const response = await fetch("/api/questions", {
        method: currentQuestion ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedQuestion),
      })

      const data = await response.json()

      if (response.ok) {
        alert(currentQuestion ? "Question updated successfully" : "Question uploaded successfully")
        await fetchQuestions()
        resetForm()
      } else {
        setError(data.message || "Failed to save question.")
      }
    } catch (err) {
      console.error("Error saving question:", err)
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setQuestion("")
    setOptions([])
    setCategory("")
    setCorrectAnswer("")
    setCurrentQuestion(null)
  }

  return (
    <section className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Question Manager</h1>

      <div className="mb-6">
        <Label htmlFor="questionSelect">Select Question to Edit:</Label>
        <select
          id="questionSelect"
          className="w-full border rounded-md p-2 mt-1"
          onChange={(e) => {
            const selected = questions.find((q) => q.id === e.target.value)
            if (selected) {
              setCurrentQuestion(selected)
              populateForm(selected)
            }
          }}
          value={currentQuestion?.id || ""}
        >
          <option value="">Select a question</option>
          {questions.map((q) => (
            <option key={q.id} value={q.id}>
              {q.question.substring(0, 50)}...
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 py-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="question" className="text-right">
            Question
          </Label>
          <Input id="question" value={question} onChange={(e) => setQuestion(e.target.value)} className="col-span-3" />
        </div>
        {options.length > 0 ? (
          options.map((option, index) => (
            <div key={index} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={`option-${index}`} className="text-right">
                Option {String.fromCharCode(65 + index)}
              </Label>
              <Input
                id={`option-${index}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="col-span-3"
              />
            </div>
          ))
        ) : (
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-start-2 col-span-3">
              <p className="text-gray-500 italic">No options added yet.</p>
            </div>
          </div>
        )}
        {options.length < 4 && (
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-start-2 col-span-3">
              <Button onClick={addOption} variant="outline">
                Add Option {String.fromCharCode(65 + options.length)}
              </Button>
            </div>
          </div>
        )}
        {options.length > 0 && (
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-start-2 col-span-3">
              <Button onClick={removeAllOptions} variant="outline" className="bg-red-100 hover:bg-red-200 text-red-600">
                Remove All Options
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Category</Label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="col-span-3 border rounded-md p-2"
          >
            <option value="">Select a category</option>
            <option value="MORSE CODE">MORSE CODE</option>
            <option value="PHONETIC ALPHABET">PHONETIC ALPHABET</option>
            <option value="VOICE PROCEDURE">VOICE PROCEDURE</option>
            <option value="RADIO">RADIO</option>
            <option value="RECEIVE ORDERS">RECEIVE ORDERS</option>
            <option value="GENERAL KNOWLEDGE">GENERAL KNOWLEDGE</option>
          </select>
        </div>

        <div className="grid grid-cols-4 items-start gap-4">
          <Label className="text-right">Correct Answer</Label>
          <RadioGroup value={correctAnswer} onValueChange={setCorrectAnswer} className="col-span-3">
            {options.length > 0 ? (
              options.map((_, index) => {
                const value = String.fromCharCode(97 + index)
                return (
                  <div key={value} className="flex items-center space-x-2">
                    <RadioGroupItem value={value} id={`answer-${value}`} />
                    <Label htmlFor={`answer-${value}`}>Option {value.toUpperCase()}</Label>
                  </div>
                )
              })
            ) : (
              <p className="text-gray-500 italic">No options available.</p>
            )}
          </RadioGroup>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        <Link href="/" className="bg-[#4a5f31] hover:bg-[#3d4f28] text-white px-8 py-2 text-md rounded-md">
          Back to Home
        </Link>
        <div>
          <Button
            className="border hover:bg-[#3d4f28] text-black hover:text-white px-8 py-2 text-md rounded-md mr-2"
            onClick={resetForm}
          >
            New Question
          </Button>
          <Button
            className="border hover:bg-[#3d4f28] text-black hover:text-white px-8 py-2 text-md rounded-md"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : currentQuestion ? "Update Question" : "Upload Question"}
          </Button>
        </div>
      </div>
    </section>
  )
}

