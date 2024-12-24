from fastapi import FastAPI, Query, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from typing import List
from pydantic import BaseModel
from datetime import datetime
import json
from utils import save_questions, query, feeback, get_user_answer, get_questions, combine_ua_questions, save_feedbacks, get_latest_questions, save_user_answers, feedbackReview, get_all_feedbacks, get_questions_from_set_id, update_user_answer, create_access_token, get_users, verify_password, check_username, set_user, hash_password
import bcrypt

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials = True,
    allow_methods=['*'],
    allow_headers=['*'],
)

class newInterview(BaseModel):
    jobTitle: str
    description: str
    yearsExperience: str

class frontendQuestions(BaseModel):
    answer: str
    difficulty: str
    id: str
    question: str

class userAnswer(BaseModel):
    questionset_id: str
    QnA:List[frontendQuestions]

@app.post("/newInterview")
async def newInterview(data: newInterview):
    '''
    A new interview question set created with the propmt given by the user
    '''
    jobTitle = data.jobTitle
    description = data.description
    YOE = data.yearsExperience
    prompt = f'title: {jobTitle}, description: {description}, years of experience: {YOE}'
    response = query(prompt)
    # print('Query response')
    # print(response)
    response_json = json.loads(response)
    save_questions(jobTitle, description, YOE,  response_json)
    return {"message": response_json}

@app.get("/latest_questions")
def latest_questions():
    '''
    Gets the latest question set from the db
    Called immediately after the user gives the details for the job
    '''
    response = get_latest_questions()
    return response

@app.post("/user_answers")
async def user_answers(data: userAnswer):
    '''
    Saves the user answer to db
    Calls Check_ans function to check the answers
    '''
    questionset_id = data.questionset_id
    QnA = data.QnA
    print('Good till here')
    await save_user_answers(questionset_id, QnA)
    await check_ans(questionset_id)

async def check_ans(questionset_id):
    '''
    Checks the user answers with gemini and saves it to db
    '''
    formatted_user_ans = combine_ua_questions(questionset_id)
    ans_feedback = feeback(formatted_user_ans)
    ans_feedback_json = json.loads(ans_feedback)
    save_feedbacks(questionset_id, ans_feedback_json)

@app.get("/review")
def review(questionset_id: str = Query(..., description="The id of the questionset to fetched")):
    '''
    Gets the review of the user answers
    '''
    print(questionset_id)
    questionset_id = questionset_id
    response = feedbackReview(questionset_id)
    return response


@app.get("/past_interviews")
def past_interviews():
    '''
    Gets the past interviews
    '''
    def date_handler(obj):
        print('Formatting date')
        date_obj = datetime.fromisoformat(obj)
        formatted_date = date_obj.strftime("%b %d %Y")
        return formatted_date

    response = get_all_feedbacks()
    card = [] #
    for r in response:
        carddata = {}
        carddata['questionset_id'] = r['questionset_id']
        carddata['job_title'] = r['job_title']
        carddata['overall_rating'] = r['overall_rating']
        carddata['date'] = date_handler(r['created_at'])
        card.append(carddata)

    return card

@app.get("/retry")
def retry(questionset_id: str = Query(..., description="The id of the questionset to fetched")):
    '''
    Retry previous questions
    '''
    print(questionset_id)
    questions = get_questions_from_set_id([questionset_id]) #A list with dict
    result = {}
    result['question_setid'] = questionset_id
    result['questions'] = []
    for q in questions:
        q_id = q['question_id']
        ques = q['question']
        diff = q['difficulty']
        collective = {
            'id': q_id,
            'question': ques,
            'difficulty': diff,
            'answer': '',
        }
        result['questions'].append(collective)

    return result
    
@app.post("/update_answer")
async def update_answer(data: userAnswer):
    '''
    Updates the user answer to db
    '''
    questionset_id = data.questionset_id
    QnA = data.QnA
    await update_user_answer(questionset_id, QnA)
    await check_ans(questionset_id)

@app.post("/signup")
async def signup(username:str, email:str, password: str):
    """
    Handle user signup
    Expects a username, email and password
    """
    if check_username(username):
        raise HTTPException(status_code=400, detail="Username already exists")
    
    hashed_password = await hash_password(password)
    set_user(username, email, hashed_password)
    return {"message": "User created successfully"}


@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Handle user login.
    Expects form_data with 'username' (or 'email') and 'password'.
    Returns a JWT if credentials are valid.
    """
    user = get_users(form_data.username)
    if not user or not verify_password(form_data.password,user['password_hash']):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token = create_access_token(data = {"userId": user['user_id']})

    return {"access_token": access_token, "token_type":"bearer"}


 
    
