'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Dummy data for questions and answers
const dummyQuestions = [
  {
    id: 1,
    question: "What is the difference between 'let' and 'const' in JavaScript?",
    answer: ""
  },
  {
    id: 2,
    question: "Explain the concept of closures in JavaScript.",
    answer: ""
  },
  {
    id: 3,
    question: "What are the advantages of using React hooks?",
    answer: ""
  }
]

export default function InterviewSession() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState(dummyQuestions.map(q => q.answer))
  const [timeElapsed, setTimeElapsed] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = e.target.value
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < dummyQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    console.log(dummyQuestions)
    console.log(answers);
    // Here you would typically send the answers to your backend
    console.log('Submitted answers:', answers)
    // Navigate back to dashboard or to a results page
    router.push('/')
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Interview Session</h1>
        <div className="text-2xl font-semibold">
          Time: {formatTime(timeElapsed)}
        </div>
      </div>

      <nav className="flex mb-6">
        {dummyQuestions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestion(index)}
            className={`mr-2 px-4 py-2 rounded-lg text-xl ${
              currentQuestion === index
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Question {index + 1}
          </button>
        ))}
      </nav>

      <div className="mb-6">
        {/* <h2 className="text-xl font-semibold mb-2">
          Question {currentQuestion + 1}:
        </h2> */}
        <p className="mb-4 text-2xl">{dummyQuestions[currentQuestion].question}</p>
        <textarea
          value={answers[currentQuestion]}
          onChange={handleAnswerChange}
          className="w-full h-40 p-2 border border-gray-300 rounded text-xl"
          placeholder="Type your answer here..."
        />
      </div>

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="text-xl px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        {currentQuestion < dummyQuestions.length - 1 ? (
          <button
            onClick={handleNext}
            className="text-xl px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="text-xl px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  )
}

