"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import { Edit, Plus, Trash } from "lucide-react"

interface Question {
  id: string
  _id: string
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
  const [isEditing, setIsEditing] = useState(false)

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
    setIsEditing(true)
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
    setOptions([""])
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
      id: currentQuestion?._id,
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
    setOptions([""])
    setCategory("")
    setCorrectAnswer("")
    setCurrentQuestion(null)
    setIsEditing(true) // Changed this to true to show the form
  }

  const handleDelete = async (questionId: string) => {
    if (!questionId) return

    if (window.confirm("Are you sure you want to delete this question?")) {
      setLoading(true)
      setError("")

      try {
        const response = await fetch(`/api/questions?id=${questionId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          alert("Question deleted successfully")
          await fetchQuestions()
          resetForm()
        } else {
          const data = await response.json()
          setError(data.message || "Failed to delete question.")
        }
      } catch (err) {
        console.error("Error deleting question:", err)
        setError("An error occurred. Please try again.")
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <section className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex w-full justify-between mb-6">
        <h1 className="text-2xl font-bold mb-6">Question Manager</h1>
        <Button onClick={resetForm} className="bg-black text-white hover:text-black mb-4">
          <Plus className="mr-2 h-4 w-4" /> New Question
        </Button>
      </div>

      <div className="mb-6">
        {isEditing && (
          <div className="grid gap-4 py-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="question" className="text-right">
                Question
              </Label>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="col-span-3"
                spellCheck="false"
                autoCapitalize="off"
              />
            </div>
            {options.map((option, index) => (
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
            ))}
            {options.length < 4 && (
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-start-2 col-span-3">
                  <Button onClick={addOption} variant="outline">
                    Add Option {String.fromCharCode(65 + options.length)}
                  </Button>
                </div>
              </div>
            )}
            {options.length > 1 && (
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-start-2 col-span-3">
                  <Button
                    onClick={removeAllOptions}
                    variant="outline"
                    className="bg-red-100 hover:bg-red-200 text-red-600"
                  >
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

            <div className="flex justify-end mt-4">
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : currentQuestion ? "Update Question" : "Add Question"}
              </Button>
            </div>
          </div>
        )}


        <div className="grid gap-3">
          {questions.map((q) => (
            <div key={q._id} className="flex w-full items-center justify-between py-2 px-4 border rounded-md">
              <span className="truncate mr-4 w-[50%]">{q.question}</span>
              <div className="flex">
                <Button
                  onClick={() => {
                    setCurrentQuestion(q)
                    populateForm(q)
                  }}
                  className="mr-2"
                  variant="outline"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button onClick={() => handleDelete(q._id)} variant="outline" className="text-red-500">
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        <Link href="/" className="bg-[#4a5f31] hover:bg-[#3d4f28] text-white px-8 py-2 text-md rounded-md">
          Back to Home
        </Link>
      </div>
    </section>
  )
}

