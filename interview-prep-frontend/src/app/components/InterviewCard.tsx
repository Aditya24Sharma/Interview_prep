import {Calendar} from 'lucide-react'
import { Star } from 'lucide-react'

interface Interview{
    id: number
    title: string
    date: string
    rating: number
}

export default function InterviewCard({interview}: {interview: Interview}){
    return (
        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-semibold mb-2">{interview.title}</h3>
          <div className='flex items-center text-gray-500 my-3'>
            <Star className="mr-2" size={32}/>
            <span className='text-xl'>{interview.rating}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Calendar className="mr-2" size={32} />
            <span className='text-xl'>{interview.date}</span>
          </div>
        </div>
      )
}

