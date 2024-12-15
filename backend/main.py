from fastapi import FastAPI
import json
from utils import save_questions, query, feeback, get_user_answer, get_questions, combine_ua_questions, save_feedbacks

app = FastAPI()

@app.get("/query")
def read_root():
    job_title = 'Front end developer'
    position= 'intern'
    prompt = f'title: {job_title}, position: {position} '
    response = query(prompt)
    print('Query response')
    print(response)
    response_json = json.loads(response)
    save_questions(job_title, position, response_json)
    return {"message": response_json}

@app.get("/check_ans")
def check_ans():
    questionset_id = "1c859987-509a-419e-af47-4104827210ae"
    formatted_user_ans = combine_ua_questions(questionset_id)
    ans_feedback = feeback(formatted_user_ans)
    ans_feedback_json = json.loads(ans_feedback)
    save_feedbacks(questionset_id, ans_feedback_json)
    return {"answer_feedback": ans_feedback_json}