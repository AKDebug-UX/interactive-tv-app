"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


export default function UploadQuestionModal() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [category, setCategory] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    if (!question || options.some((opt) => opt === "") || !correctAnswer) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    const newQuestion = {
      question,
      category,
      options: options.map((text, index) => ({ id: String.fromCharCode(97 + index), text })),
      correctAnswerId: correctAnswer,
    };

    try {
      const response = await fetch("/api/questions", {  // ✅ Now using "/api/questions"
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuestion),
      });

      const data = await response.json();

      if (response.ok) {
        resetForm();
        alert("upload question successfully");
      } else {
        setError(data.message || "Failed to upload question.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const resetForm = () => {
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
  };

  return (
    <section className="w-[500px] mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1>Upload New Question</h1>
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
          <Label className="text-right">
            Category
          </Label>
          <Input
            id={`category`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-start gap-4">
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
      <Button type="submit" onClick={handleSubmit} disabled={loading}>
        {loading ? "Uploading..." : "Upload Question"}
      </Button>
    </section>
  );
}
