from fastapi import FastAPI
import json
from utils import save_questions, query, feeback

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
    return