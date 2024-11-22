from fastapi import FastAPI
import json
from utils import save_questions, query, feeback, get_user_answer, get_questions, combine_ua_questions

app = FastAPI()

@app.get("/query")
def read_root():
    job_title = 'Front end developer'
    position= 'intern'
    prompt = f'title: {job_title}, position: {position} '
    response = query(prompt)
    # print(response)
    json_obj = json.loads(response)
    save_questions(job_title, position, json_obj)
    return {"message": json_obj}

@app.get("/check_ans")
def check_ans():
    questionset_id = "1c859987-509a-419e-af47-4104827210ae"
    formatted_user_ans = combine_ua_questions(questionset_id)
    return {"user_answer": formatted_user_ans}