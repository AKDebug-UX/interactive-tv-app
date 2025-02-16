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
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [name]);


  return (
    <div className="w-full flex mb-12 items-center justify-center">
      {!loading ?
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
            <div className="mt-16">
              <Link href="/" className="bg-[#4a5f31] hover:bg-[#3d4f28] text-white px-8 py-4 text-xl">
                Back to Home
              </Link>
            </div>
          </div>

          <div className="flex flex-col w-[70%] items-center justify-between space-x-8">
            {/* <div className="flex items-center space-x-8">
              <div className="w-[250px] h-20 relative flex items-center justify-center">
                <Image src={`img/CiS_ACF_CCF_Banner_Kings_Crown.png`} alt="Dice Face" fill className="" />
              </div>
              <span className="text-5xl text-black font-bold">"ROGER SO FAR"</span>
              <div className="w-16 h-16 relative flex items-center justify-center">
                <Image src={`img/CiS_Badge.png`} alt="Dice Face" fill className="" />
              </div>
            </div> */}

            <div className="p-6 mt-4">
              {currentQuestion ? (
                <div className="font-bold md:w-[80%] mx-auto text-center text-3xl">
                  Q: {currentQuestion.question}
                  {/* <ul className="flex gap-6 justify-between mt-4 text-lg">
                    {currentQuestion.options.map((option) => (
                      <li key={option.id} className="mt-2">
                        {option.text}
                      </li>
                    ))}
                  </ul> */}
                </div>
              ) : (
                <p className="text-lg">No questions available for this category.</p>
              )}
            </div>
            {currentQuestion && (
              <>
                {/* {showAnswer && (
                  <div className="mt-4 text-2xl font-semibold text-gray-800">
                    A: {currentQuestion.options.find(opt => opt.id === currentQuestion.correctAnswerId)?.text}
                  </div>
                )} */}
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="mt-4 text-2xl font-semibold text-gray-800"
                >
                  {showAnswer ? <>A: {currentQuestion.options.find(opt => opt.id === currentQuestion.correctAnswerId)?.text}</> : "Show Answer"}
                </button>
              </>
            )}

            <span
              className="text-6xl text-[#FFD700] mt-20 font-bold"
              style={{
                textShadow: "2px 2px 0px black, -2px 2px 0px black, 2px -2px 0px black, -2px -2px 0px black"
              }}
            >
              "{name}"
            </span>

          </div>
        </div>
        :
        <div className='flex items-center justify-center h-screen'>
          <div className='animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary' />
        </div>
      }
    </div>
  );
}

const WithSuspense = (): JSX.Element => (
  <Suspense>
    <QuePerDice />
  </Suspense>
);

export default WithSuspense;
