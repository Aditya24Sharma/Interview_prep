import {Calendar} from 'lucide-react'
import { Star } from 'lucide-react'

interface Interview{
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
        </div>
      )
}

