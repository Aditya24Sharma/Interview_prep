'use client'

import { ArrowLeft } from 'lucide-react';
import {useState, useEffect} from 'react';
import Link from 'next/link'


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
        const response = await fetch(`http://127.0.0.1:8000/review?questionset_id=${questionset_id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
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
    <div className="container mx-auto px-4">
      <Link href = {'/'}>
        <button className="mb-4 inline-flex items-center py-2 border border-transparent text-xl font-medium text-gray-700 focus:outline-none hover:underline hover:text-blue-900">
          <ArrowLeft className="mr-2 h-5 w-5" size={32} />
          Back to Dashboard
        </button>
      </Link>
      <h1 className="text-4xl font-bold mb-6">Interview Feedback</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-3xl font-semibold mb-4">Job Details</h2>
        {/* JobTitle -> feedbackData.jobTitle */}
        <p className='text-xl'><strong>Title:</strong> {jobTitle}</p>
        <p className='text-xl'><strong>Description:</strong> {jobDescription}</p>
        <p className='text-xl'><strong>Years of Experience:</strong> {yearsOfExperience}</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-3xl font-semibold mb-4">Overall Feedback</h2>
        <p className="mb-4 text-xl">{summaryFeedback}</p>
        <div className="flex items-center text-xl">
          <span className="mr-2">Overall Rating:</span>
          <span className={`px-2 py-1 rounded ${getColorClass(overallRating)}`}>
            {overallRating}/5
          </span>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-3xl font-semibold mb-4">Questions</h2>
        
        <nav className="flex mb-6">
          {feedbacks.map((_, index) => (
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

        <div>
          <p className="mb-4 text-2xl"><strong>{feedbacks[currentQuestion].question}</strong></p>
          
          <div className="mb-4 text-xl">
            <h4 className="font-semibold">Your Answer:</h4>
            <p className="bg-blue-50 text-blue-800 p-3 rounded">{feedbacks[currentQuestion].user_answer}</p>
          </div>
          
          <div className="mb-4 text-xl">
            <h4 className="font-semibold">Feedback:</h4>
            <p className="bg-yellow-50 text-yellow-800 p-3 rounded">{feedbacks[currentQuestion].feedback}</p>
          </div>
          
          <div className="mb-4 text-xl">
            <h4 className="font-semibold">Correct Answer:</h4>
            <p className="bg-green-50 text-green-800 p-3 rounded">{feedbacks[currentQuestion].answer}</p>
          </div>
          
          <div className="flex items-center text-xl">
            <span className="mr-2">Question Rating:</span>
            <span className={`px-2 py-1 rounded ${getColorClass(feedbacks[currentQuestion].rating)}`}>
              {feedbacks[currentQuestion].rating}/5
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

