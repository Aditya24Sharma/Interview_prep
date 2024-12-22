'use client'

import RetrySession from "../components/RetrySession";
import { useSearchParams } from "next/navigation";

export default function RetrySessionPage(){
    const searchParams = useSearchParams();
    const questionset_id = searchParams.get('questionset_id');
    return <RetrySession questionset_id = {questionset_id}/>
}