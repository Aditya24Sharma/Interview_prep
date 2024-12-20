'use client'

import { useSearchParams } from 'next/navigation'
import FeedbackSession from '../components/FeedbackSession'

export default function FeedbackSessionPage() {
  const searchParams = useSearchParams(); 
  const questionset_id = searchParams.get('questionset_id');
  console.log(questionset_id)
  return <FeedbackSession questionset_id = {questionset_id}/>
}