"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface UploadQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (question: any) => void
  categoryId: string
}

export default function UploadQuestionModal({ isOpen, onClose, onUpload, categoryId }: UploadQuestionModalProps) {
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState(["", "", "", ""])
  const [correctAnswer, setCorrectAnswer] = useState("")

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = () => {
    const newQuestion = {
      id: Date.now(), // This should be generated on the server in a real application
      question,
      options: options.map((text, index) => ({ id: String.fromCharCode(97 + index), text })),
      correctAnswerId: correctAnswer,
    }
    onUpload(newQuestion)
    resetForm()
  }

  const resetForm = () => {
    setQuestion("")
    setOptions(["", "", "", ""])
    setCorrectAnswer("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload New Question</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="question" className="text-right">
              Question
            </Label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="col-span-3"
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Correct Answer</Label>
            <RadioGroup value={correctAnswer} onValueChange={setCorrectAnswer} className="col-span-3">
              {["a", "b", "c", "d"].map((value) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={value} id={`answer-${value}`} />
                  <Label htmlFor={`answer-${value}`}>Option {value.toUpperCase()}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Upload Question
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

