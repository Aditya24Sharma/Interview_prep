import {Calendar, RotateCcw, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { Star } from 'lucide-react'

interface Interview{
    questionset_id: string
    job_title: string
    overall_rating: number
    date: string
}

export default function InterviewCard({interview}: {interview: Interview}){
    return (
        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-semibold mb-2">{interview.job_title}</h3>
          <div className='flex items-center my-3'>
            <Star className="mr-2 fill-yellow-500 text-yellow-500" size={32}/>
            <span className='text-xl text-black'>{interview.overall_rating}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="mr-2 text-red-800" size={32} />
            <span className='text-xl'>{interview.date}</span>
          </div>
          <div className="flex justify-between mt-6">
          <Link href={`/retry-session?questionset_id=${interview.questionset_id}`} passHref>
            <button className="flex text-xl items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
              <RotateCcw size={24} className="mr-2" />
              Retry
            </button>
          </Link>
          <Link href={`/feedback-session?questionset_id=${interview.questionset_id}`} passHref>
            <button className="flex text-xl items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
              <MessageCircle size={24} className="mr-2" />
              Feedback
            </button>
          </Link>
        </div>
        </div>
      )
}

