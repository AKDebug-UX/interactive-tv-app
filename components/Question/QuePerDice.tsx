"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Option {
  id: string;
  text: string;
}

interface Question {
  question: string;
  options: Option[];
  correctAnswerId: string;
}

type Category = string;

function getRandomQuestion(questions: Question[]): Question | null {
  if (questions.length === 0) return null;
  return questions[Math.floor(Math.random() * questions.length)];
}

function QuePerDice(): JSX.Element {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "1";
  const name = searchParams.get("name") ?? "Unknown";
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch("/api/questions");
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          const groupedQuestions: Record<Category, Question[]> = {};

          data.data.forEach((q: { category: string; question: string; options: Option[]; correctAnswerId: string }) => {
            if (!groupedQuestions[q.category]) groupedQuestions[q.category] = [];
            groupedQuestions[q.category].push({
              question: q.question,
              options: q.options,
              correctAnswerId: q.correctAnswerId,
            });
          });

          setCategories(Object.keys(groupedQuestions));
          setSelectedCategory(name);
          setQuestions(groupedQuestions[name] || []);
          setCurrentQuestion(getRandomQuestion(groupedQuestions[name] || []));
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }
    fetchQuestions();
  }, [name]);

  const handleNextQuestion = () => {
    setCurrentQuestion(getRandomQuestion(questions));
    setShowAnswer(false);
  };

  return (
    <div className="mt-12 w-full bg-[#f5f5f5] md:p-6 flex items-center justify-center">
      <div className="mx-auto text-center">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="scene w-[300px] h-[300px] flex justify-center items-start cursor-pointer">
            <Image
              src={`/dice/dice-face-${id}.png`}
              alt="Dice Face"
              width={350}
              height={350}
              className="border-2 border-black"
            />
          </div>
          <div className="w-full">
            <h1 className="text-2xl md:text-4xl font-bold text-[#1a237e]">"{name}"</h1>
            <div className="p-6 mt-4">
              {currentQuestion ? (
                <div className="font-bold md:w-[80%] mx-auto text-center text-xl">
                  Q: {currentQuestion.question}
                  <ul className="flex gap-6 justify-between mt-4 text-lg">
                    {currentQuestion.options.map((option) => (
                      <li key={option.id} className="mt-2">
                        {option.text}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-lg">No questions available for this category.</p>
              )}
            </div>
            {currentQuestion && (
              <>
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="mt-4 bg-blue-500 hover:bg-blue-700 text-white px-6 py-3 text-lg"
                >
                  {showAnswer ? "Hide Answer" : "Show Answer"}
                </button>
                {showAnswer && (
                  <div className="mt-4 text-lg font-semibold text-gray-800">
                    Correct Answer: {currentQuestion.options.find(opt => opt.id === currentQuestion.correctAnswerId)?.text}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="mt-8">
          <Link href="/" className="bg-[#4a5f31] hover:bg-[#3d4f28] text-white px-8 py-4 text-xl">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

const WithSuspense = (): JSX.Element => (
  <Suspense>
    <QuePerDice />
  </Suspense>
);

export default WithSuspense;
