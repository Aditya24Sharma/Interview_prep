'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Dummy data for questions and answers

interface Questions{
  answer: string;
  difficulty: string;
  id: string;
  question: string; 
}

export default function InterviewSession() {

  const [questionset_id, setQuestionset_id] = useState()
  const [questions, setQuestions] = useState<Questions[]>([])

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState(questions.map(q => q.answer))

  const [timeElapsed, setTimeElapsed] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchLatestQuestions = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/latest_questions");

        const data = await response.json();
        setQuestionset_id(data.question_setid)
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(""));
        console.log('Question_setid', data.question_setid)
        console.log('Questions', data.questions)
      } catch (error) {
        console.error("Error retrieving questions", error);
      }};
      fetchLatestQuestions();
    }, [])


  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = e.target.value
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const combine_QnA = () =>{
    questions.map((item, index)=>(
      item.answer = answers[index]
    ))
  }

  const handleSubmit = async() => {
    console.log('Submitted answers:', answers)
    console.log('Questionset id:', questionset_id)
    console.log('Questions: ', questions)
    try{
      console.log('Sending the user answers to backend')
      combine_QnA()
      console.log('Combined QnA')
      console.log(questions)
      const backenddata = {
        'questionset_id': questionset_id,
        'QnA': questions,
      }
      await fetch("http://127.0.0.1:8000/user_answers",{
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
        },
        body: JSON.stringify(backenddata)
      }
    )
    }catch(error){
      console.error("Error in saving user answers", error)
    };

    router.push(`/feedback-session?questionset_id=${questionset_id}`)
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
        {/* dummyQuestions.map */}
        {questions.map((item, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestion(index)}
            className={`mr-2 px-4 py-2 rounded-lg text-xl ${
              currentQuestion === index
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {item.difficulty}
          </button>
        ))}
      </nav>
      <div className="mb-6">
        <p className="mb-4 text-2xl">{questions.length > 0 ? questions[currentQuestion].question: "Loading"}</p>
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
        {currentQuestion < questions.length - 1 ? (
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

