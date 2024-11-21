from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()

supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_APIKEY')

#Initialize Supabase Client
supabase: Client  = create_client(supabase_url, supabase_key)

def to_question_set(job_title, position, question_set):
    """
    :param job_title: Title of the job (e.g., "Front-end Developer")
    :param position: Position for the job (e.g., "Intern")
    :param questions: List of dictionaries containing questions and answers

    CREATE TABLE Question_set (
    questionset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_title TEXT NOT NULL,
    position TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
    );
    """
    if not question_set:
        print('No questions_set to save')
        return
    
    data = [{
        "job_title": job_title,
        "position": position,
    }]

    try: 
        response = supabase.table("question_set").insert(data).execute()
        if response.data: #this takes the lastest row that we created
            questionset_id = response.data[0]["questionset_id"]
            print("Question_set Saved")
            to_question(questionset_id, question_set)
        else: 
            print("Error: No data returned after insertion")

    except Exception as e:
        print(f"Error Saving Question_set: {e}")
    
    


def to_question(set_id, question_set):
    """
    CREATE TABLE Question (
    question_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    questionset_id UUID REFERENCES Question_set(questionset_id) ON DELETE CASCADE,
    difficulty TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL
    );
    """
    data = []
    if not question_set:
        print("No Question to save")
    
    for difficulty, qna in question_set.items():
        data.append({
            "questionset_id": set_id,
            "difficulty": difficulty,
            "question" : qna['Question'],
            "answer" : qna["Answer"]
        })

    try: 
        supabase.table("question").insert(data).execute()
        print('Questions Saved')
        
    except Exception as e:
        print(f"Error Saving Question: {e}")
