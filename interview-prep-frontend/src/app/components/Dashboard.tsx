'use client'
import InterviewCard from './InterviewCard'
import NewInterviewForm from './NewInterviewForm'
import { useState, useEffect } from 'react'
import { PlusCircle } from 'lucide-react'

interface InterviewDate{
  questionset_id : string;
  job_title : string;
  overall_rating: number;
  date: string;
}

export default function Dashboard(){
    const [showNewInterviewForm, setShowNewInterviewForm] = useState(false)
    const [pastInterviews, setPastInterviews] = useState<InterviewDate[]>([])

    useEffect(() => {
        async function fetchPastInterviews(){
            try{
                const response = await fetch("http://127.0.0.1:8000/past_interviews");
                if(!response.ok){
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPastInterviews(data);
            }catch(error){
                console.error("Error retrieving past interviews", error);
            };
          };
          fetchPastInterviews();
        },[])


      return (
        <div className="space-y-6">
          {/* <NewInterviewForm/> */}
          {showNewInterviewForm && (
            <NewInterviewForm onClose={() => setShowNewInterviewForm(false)} />
        )}
          <div>
            <h2 className="text-3xl font-semibold mb-4">Past Interviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastInterviews.map((interview, index) => (
                <InterviewCard key={index} interview={interview} />
              ))}
            </div>
          </div>
          <div className="flex justify-center items-center">
            <button className="mt-20 bg-blue-500 hover:bg-blue-600 text-white text-2xl font-bold py-2 px-4 rounded-lg inline-flex items-center"
            onClick={()=> setShowNewInterviewForm(true)}>
              <PlusCircle className="mr-2" size={24} />
              <span>New Interview</span>
            </button>
          </div>
        </div>
      )
}