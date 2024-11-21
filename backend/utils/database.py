from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()

supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_APIKEY')

#Initialize Supabase Client
supabase: Client  = create_client(supabase_url, supabase_key)


'''
table: questions
Columns: id, job_title, position, difficulty, question, answer
'''

def save_questions(job_title, position, questions):
    """
    Save generated questions and answers to the database.
    
    :param job_title: Title of the job (e.g., "Front-end Developer")
    :param position: Position for the job (e.g., "Intern")
    :param questions: List of dictionaries containing questions and answers
    """
    data = []
    if not questions:
        print('No questions to save')
        return 
    
    #Since questions is a json we cannot loop so converint it to list
    for difficulty, qa in questions.items(): 
        data.append({
            "job_title": job_title,
            "position": position,
            "difficulty": difficulty,
            "question": qa["Question"],
            "answer": qa["Answer"]
            })
        
    try:
        response = supabase.table("questions").insert(data).execute()
        print('Saved')
        return response
    except Exception as e:
        print(f"Error saving questions: {e}")
        return None
 