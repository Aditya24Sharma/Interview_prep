'use client'
import InterviewCard from './InterviewCard'
import NewInterviewForm from './NewInterviewForm'
import { useState } from 'react'
import { PlusCircle } from 'lucide-react'

export default function Dashboard(){
    const [showNewInterviewForm, setShowNewInterviewForm] = useState(false)
    const pastInterviews = [
        { id: 1, title: 'Frontend Developer', date: 'Dec14', rating: 4 },
        { id: 2, title: 'Full Stack Engineer',date: 'Dec13', rating: 3 },
        { id: 3, title: 'React Developer', date: 'Dec15', rating: 3.5 },
      ]
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Interview Prep Dashboard</h1>
            <button className=" bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-2 px-4 rounded-lg inline-flex items-center"
            onClick={()=> setShowNewInterviewForm(true)}>
              <PlusCircle className="mr-2" size={24} />
              <span>New Interview</span>
            </button>
          </div>
          {/* <NewInterviewForm/> */}
          {showNewInterviewForm && (
            <NewInterviewForm onClose={() => setShowNewInterviewForm(false)} />
        )}
          <div>
            <h2 className="text-3xl font-semibold mb-4">Past Interviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastInterviews.map((interview) => (
                <InterviewCard key={interview.id} interview={interview} />
              ))}
            </div>
          </div>
        </div>
      )
}