'use client'

import {useState, useEffect} from 'react'
// import {useSearchParams} from 'next/navigation'

// Dummy data - replace with actual data from your backend
const feedbackData = {
  jobTitle: "Frontend Developer",
  jobDescription: "We are looking for a skilled frontend developer with experience in React and modern JavaScript.",
  yearsOfExperience: "3",
  overallFeedback: "You demonstrated a good understanding of frontend development concepts. There's room for improvement in some areas, but overall, your performance was commendable.",
  overallRating: 2,
  questions: [
    {
      id: 1,
      question: "What is the difference between 'let' and 'const' in JavaScript?",
      userAnswer: "Let allows reassignment, const doesn't. Both are block-scoped.",
      feedbackAnswer: "Good explanation of the basic difference. You could have mentioned that const still allows mutation of objects and arrays.",
      correctAnswer: "'let' allows reassignment and is block-scoped. 'const' doesn't allow reassignment but is also block-scoped. However, for const, the contents of objects and arrays can still be modified.",
      rating: 4
    },
    {
      id: 2,
      question: "Explain the concept of closures in JavaScript.",
      userAnswer: "Closures are functions that remember the environment they were created in.",
      feedbackAnswer: "This is a basic definition. It would be better to explain how closures can access variables from their outer scope.",
      correctAnswer: "A closure is the combination of a function and the lexical environment within which that function was declared. This environment consists of any local variables that were in-scope at the time the closure was created. Closures allow a function to access variables from an outer function even after the outer function has returned.",
      rating: 3
    },
    {
      id: 3,
      question: "What are the advantages of using React hooks?",
      userAnswer: "Hooks make it easier to reuse stateful logic between components and simplify complex components.",
      feedbackAnswer: "Good points. You could have mentioned how hooks can replace class components and lifecycle methods.",
      correctAnswer: "React hooks offer several advantages: 1) They allow you to use state and other React features without writing a class. 2) They promote the reuse of stateful logic between components. 3) They help in breaking complex components into smaller functions based on what pieces are related. 4) They provide a more direct API to React concepts like props, state, context, refs and lifecycle.",
      rating: 4
    }
  ]
}

interface FeedbackData{
  feedback_id: string; 
  feedbackset_id:string;
  question_id: string;
  difficulty: string;
  question: string;
  answer: string;
  user_answer: string;
  feedback: string;
  rating: number;
}

type feedbackSessionProp ={
  questionset_id: string | null;
}

export default function FeedbackSession({questionset_id}: feedbackSessionProp) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [summaryFeedback, setSummaryFeedback] = useState('');
  const [overallRating, setOverallRating] = useState(0);
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);

  useEffect(() => {
    async function fetchReviewData() {
      if (!questionset_id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://127.0.0.1:8000/review?questionset_id=${questionset_id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setJobTitle(data.job_title);
        setJobDescription(data.description);
        setYearsOfExperience(data.YOE);
        setSummaryFeedback(data.summary_feedback);
        setOverallRating(data.overall_rating);
        setFeedbacks(data.feedbacks);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        console.error("Error retrieving review data", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReviewData();
  }, [questionset_id]); // Only re-run if questionset_id changes

  const getColorClass = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-800'
    if (rating >= 3) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Interview Feedback</h1>
        <p>Loading feedback...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Interview Feedback</h1>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Interview Feedback</h1>
        <p>No feedback available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Interview Feedback</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Job Details</h2>
        {/* JobTitle -> feedbackData.jobTitle */}
        <p><strong>Title:</strong> {jobTitle}</p>
        <p><strong>Description:</strong> {jobDescription}</p>
        <p><strong>Years of Experience:</strong> {yearsOfExperience}</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overall Feedback</h2>
        <p className="mb-4">{summaryFeedback}</p>
        <div className="flex items-center">
          <span className="mr-2">Overall Rating:</span>
          <span className={`px-2 py-1 rounded ${getColorClass(overallRating)}`}>
            {overallRating}/5
          </span>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Question Feedback</h2>
        
        <nav className="flex mb-6">
          {feedbacks.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`mr-2 px-4 py-2 rounded ${
                currentQuestion === index
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Question {index + 1}
            </button>
          ))}
        </nav>

        <div>
          <h3 className="text-xl font-semibold mb-2">
            Question {currentQuestion + 1}:
          </h3>
          <p className="mb-4">{feedbacks[currentQuestion].question}</p>
          
          <div className="mb-4">
            <h4 className="font-semibold">Your Answer:</h4>
            <p className="bg-blue-50 text-blue-800 p-3 rounded">{feedbacks[currentQuestion].user_answer}</p>
          </div>
          
          <div className="mb-4">
            <h4 className="font-semibold">Feedback:</h4>
            <p className="bg-yellow-50 text-yellow-800 p-3 rounded">{feedbacks[currentQuestion].feedback}</p>
          </div>
          
          <div className="mb-4">
            <h4 className="font-semibold">Correct Answer:</h4>
            <p className="bg-green-50 text-green-800 p-3 rounded">{feedbacks[currentQuestion].answer}</p>
          </div>
          
          <div className="flex items-center">
            <span className="mr-2">Question Rating:</span>
            <span className={`px-2 py-1 rounded ${getColorClass(feedbacks[currentQuestion].rating)}`}>
              {feedbackData.questions[currentQuestion].rating}/5
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

