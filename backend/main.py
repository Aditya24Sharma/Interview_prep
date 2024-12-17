from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from utils import save_questions, query, feeback, get_user_answer, get_questions, combine_ua_questions, save_feedbacks

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

@app.post("/newInterview")
async def newInterview(data: newInterview):
    jobTitle = data.jobTitle
    description = data.description
    YOE = data.yearsExperience
    prompt = f'title: {jobTitle}, description: {description}, years of experience: {YOE}'
    # prompt = f'title: {job_title}, position: {position}  '
    response = query(prompt)
    print('Query response')
    print(response)
    response_json = json.loads(response)
    save_questions(jobTitle, description, YOE,  response_json)
    return {"message": response_json}

# @app.get("/query")
# def read_root():
#     job_title = 'Front end developer'
#     position= 'intern'
#     prompt = f'title: {job_title}, position: {position}  '
#     response = query(prompt)
#     print('Query response')
#     print(response)
#     response_json = json.loads(response)
#     save_questions(job_title, position, response_json)
    # return {"message": response_json}

@app.get("/check_ans")
def check_ans():
    questionset_id = "1c859987-509a-419e-af47-4104827210ae"
    formatted_user_ans = combine_ua_questions(questionset_id)
    ans_feedback = feeback(formatted_user_ans)
    ans_feedback_json = json.loads(ans_feedback)
    save_feedbacks(questionset_id, ans_feedback_json)
    return {"answer_feedback": ans_feedback_json}