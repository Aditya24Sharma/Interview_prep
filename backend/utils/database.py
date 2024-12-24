from supabase import create_client, Client
from typing import List,Dict, Any
from dotenv import load_dotenv
import os

load_dotenv()

supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_APIKEY')

#Initialize Supabase Client
supabase: Client  = create_client(supabase_url, supabase_key)

def to_question_set(job_title, description, YOE,  question_set):
    """
    :param job_title: Title of the job (e.g., "Front-end Developer")
    :param description: Description of the Job Positions
    :param YOE: years of experience
    :param questions: List of dictionaries containing questions and answers

    CREATE TABLE Question_set (
    questionset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_title TEXT NOT NULL,
    description TEXT NOT NULL,
    YOE numeric NOT NULL
    created_at TIMESTAMP DEFAULT now()
    );
    """
    if not question_set:
        print('No questions_set to save')
        return
    
    data = [{
        "job_title": job_title,
        "description": description,
        "YOE": YOE,
    }]

    try: 
        response = supabase.table("question_set").insert(data).execute()
        print("Question_set Saved")
        if response.data: #this takes the lastest row that we created
            questionset_id = response.data[0]["questionset_id"]
            to_question(questionset_id, question_set)
        else: 
            print("Error: No data returned after insertion")

    except Exception as e:
        print(f"Error Saving Question_set: {e}")
    

def get_latest_questionsetid():
    try:
        response = supabase.table("question_set").select('*').order('created_at', desc=True).limit(1).execute()
        data = response.data
        # print(f'Retrieved questions set id: {data[0]['questionset_id']}')
        id = data[0]['questionset_id']
        return id
    except Exception as e:
        print(f'Failed to get latest questions set id: {e}')

def get_questions_from_set_id(set_ids: List[str]):
    try:
        response = supabase.table("question").select("*").in_("questionset_id",set_ids).execute()
        print("Questions successfully fetched from id")
        return response.data
    except Exception as e:
        print(f"Error fetching questions: {e}")
        return None


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
        print('Saving Questions')
        supabase.table("question").insert(data).execute()
        print('Questions Saved')
        
    except Exception as e:
        print(f"Error Saving Question: {e}")

def set_user_response(data):
    try:
        supabase.table("user_answers").insert(data).execute()
        print('Success: Saved user answers to Supabase')
    except Exception as e:
        print(f'Error while setting user_response to Supabase: {e}')

def get_user_answer(questionset_id):

    """
    CREATE TABLE User_answers (
    user_answer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    questionset_id  UUID REFERENCES Question_set(questionset_id) on delete CASCADE,
    question_id UUID REFERENCES Question(question_id) on delete CASCADE,
    user_answer Text NOT NULL,
    submitted_at timestamp default NOW()
    )
    """
    try: 
        response = supabase.table('user_answers').select("*").eq("questionset_id", questionset_id).execute()
        # if response.error:
        #     print(f"Error fetching user answers: {response.error.message}")
        #     return None
        print("User Response successfully accessed")
        return response.data
    except Exception as e:
        print(f"Error in get_user_answers: {e}")
        return None
    


def get_questions(question_ids: List[str]):
    """
    CREATE TABLE Question (
    question_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    questionset_id UUID REFERENCES Question_set(questionset_id) ON DELETE CASCADE,
    difficulty TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL
    );
    """
    try:
        response = supabase.table("question").select("*").in_("question_id",question_ids).execute()
        print("Questions successfully fetched")
        return response.data
    except Exception as e:
        print(f"Error fetching questions: {e}")
        return None


def get_question_set(questionset_id):
    '''
    CREATE TABLE Question_set (
    questionset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_title TEXT NOT NULL,
    position TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
    );
    '''
    try: 
        response = supabase.table("question_set").select("*").eq("questionset_id", questionset_id).execute()
        print("Success: Question_set Retrived")
        return response.data
    except Exception as e:
        print(f"Error: Question_set Retrival : {e}")
        return None

def get_feedbackset(questionset_id):
    """
    CREATE TABLE Feedback_set (
    feedbackset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    questionset_id UUID REFERENCES Question_set(questionset_id) ON DELETE CASCADE,
    job_title TEXT NOT NULL,
    overall_rating NUMERIC,
    summary_feedback TEXT
    );
    """
    try:
        response = supabase.table("feedback_set").select("*").eq("questionset_id", questionset_id).execute()
        print("Success: Feedback_set Retrived")
        return response.data
    except Exception as e:
        print(f"Error: Feedback_set Retrival : {e}")
        return None

def set_feedbackset(questionset_id, job_title, feedbacks):
    """
    CREATE TABLE Feedback_set (
    feedbackset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    questionset_id UUID REFERENCES Question_set(questionset_id) ON DELETE CASCADE,
    job_title TEXT NOT NULL,
    overall_rating NUMERIC,
    summary_feedback TEXT
    );

    feedbacks : {
        "feedback_set":{
            "easy":{
                "Question": {...},
                "Answer":{...},
                "user_Answer":{...},
                "Feedback":{...},
                "Rating": {.}
                },
            "medium":{...}
        }
        "Overall_Rating":{.},
        "Summary_Feedback":{...}
    }
    """
    if not set_feedbackset:
        print("No Feedback sets to save")
    
    feedback_set = feedbacks["feedback_set"]
    overall_rating = feedbacks["Overall_Rating"]
    summary_feedback = feedbacks["Summary_Feedback"]
    
    data = [{
        "questionset_id": questionset_id,
        "job_title":job_title,
        "overall_rating":overall_rating,
        "summary_feedback": summary_feedback,
    }]

    try: 
        response = supabase.table('feedback_set').insert(data).execute()
        print("Saved: Feedback Set")
        if response.data:
            feedbackset_id = response.data[0]["feedbackset_id"]
            set_feedbacks(questionset_id, feedbackset_id, feedback_set)
        return response
    except Exception as e:
        print(f"Error: Feedback Set Could not be saved: {e}")
        return None

def get_feedbacks(feedbackset_id):
    """
    CREATE TABLE Feedback (
    feedback_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feedbackset_id UUID REFERENCES Feedback_set(feedbackset_id) ON DELETE CASCADE,
    question_id UUID REFERENCES Question(question_id) ON DELETE CASCADE,
    difficulty TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    user_answer TEXT NOT NULL,
    feedback TEXT,
    rating NUMERIC
    );
    """
    try:
        response = supabase.table("feedback").select("*").eq("feedbackset_id", feedbackset_id).execute()
        print("Success: Feedbacks Retrived")
        return response.data
    except Exception as e:
        print(f"Error: Feedbacks Retrival : {e}")
        return None

def get_all_feedbacks():
    print("Fetching all feedbacks")
    try:
        response = supabase.table("feedback_set").select("*").execute()
        print("Success: All Feedbacks Retrived")
        return response.data
    except Exception as e:
        print(f"Error: All Feedbacks Retrival : {e}")
        return None

def set_feedbacks(questionset_id, feedbackset_id, feedbacks):
    """
    CREATE TABLE Feedback (
    feedback_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feedbackset_id UUID REFERENCES Feedback_set(feedbackset_id) ON DELETE CASCADE,
    question_id UUID REFERENCES Question(question_id) ON DELETE CASCADE,
    difficulty TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    user_answer TEXT NOT NULL,
    feedback TEXT,
    rating NUMERIC
    );
    """
    if not feedbacks:
        print("No feedbacks to save")
    data = []

    question_response = supabase.table("question").select("*").eq("questionset_id",questionset_id).execute()
    questions = question_response.data
    # print(questions)
    question_detail = {}
    for q in questions:
        question_detail[q['difficulty']] = q['question_id']

    for difficulty, feedback in feedbacks.items():
        data.append({
            "feedbackset_id" : feedbackset_id,
            "question_id" : question_detail[difficulty],
            "difficulty": difficulty,
            "question": feedback['Question'],
            "answer": feedback['Answer'],
            "user_answer": feedback["User_Answer"],
            "feedback": feedback['Feedback'],
            "rating": feedback['Rating']
        })
    
    try:
        print('Saving: Feedbacks')
        response = supabase.table('feedback').insert(data).execute()
        print('Saved: feedbacks')
        return response
    except Exception as e:
        print(f'Error: Saving Feedbacks : {e}')
        return None
    
def update_user_response(data):
    try:
        for d in data:
            supabase.table('user_answers').update(
                {"user_answer":d['user_answer']}
            ).eq("questionset_id", d['questionset_id']).eq("question_id", d['question_id']).execute()

        print('Success: Updated user answers to Supabase')
    except Exception as e:
        print(f'Error while updating user_response to Supabase: {e}')

async def delete_feedback_set(questionset_id):
    try:
        supabase.table('feedback_set').delete().eq("questionset_id", questionset_id).execute()
        print('Success: Deleted feedback set')
    except Exception as e:
        print(f'Error while deleting feedback set: {e}')


def get_users(username: str):
    print('Fetching users...')
    try:
        response = supabase.table('users').select('*').eq('username', username).execute()
        users = response.data
        if not users or len(users) == 0:
            return None
        return users[0]
    except Exception as e:
        print(f'Error while fetching users: {e}')
        return None

def check_username(username: str):
    print('Checking username...')
    try:
        response = supabase.table('users').select('username').eq('username', username).execute()
        users = response.data
        if not users or len(users) == 0:
            return False
        return True
    except Exception as e:
        print(f'Error while checking username: {e}')
        return None
    
def set_user(username:str, email:str, password: str):
    '''
    Sets the user to the database
    username(str), email(str), password(str)[hashed_password]
    '''
    print('Saving user to db...')
    data = [{
        "username": username,
        "email": email,
        "password_hash": password
    }]
    try:
        response = supabase.table('users').insert(data).execute()
        print('User saved to db')
        return response
    except Exception as e:
        print(f'Error while saving user: {e}')
        return None