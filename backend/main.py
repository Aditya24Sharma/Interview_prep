from fastapi import FastAPI
import json
import google.generativeai as genai
from dotenv import load_dotenv
import os
from utils import save_questions

app = FastAPI()

load_dotenv()

api_key = os.getenv('GOOGLE_API_KEY')


def query(prompt):
    '''
    {
        "easy":{
                "Question":"...",
                "Answer":"..."
            },
            "medium:{...}
    }
    '''
    model = genai.GenerativeModel("gemini-1.5-flash")
    genai.configure(api_key = api_key  )
    structured_propmt = f"""
        Generate an new set of technical interview question following this exact JSON structure, without any markdown formatting or array wrapping:
        {{
            "easy": {{
                "Question": "your_question_here",
                "Answer": "your_answer_here"
            }},
            "medium": {{
                "Question": "your_question_here",
                "Answer": "your_answer_here"
            }},
            "hard": {{
                "Question": "your_question_here",
                "Answer": "your_answer_here"
            }}
        }}

        Additional requirements:
        1. Provide the response as pure JSON without code blocks or markdown
        2. Give relevant questions that might appear in actual technical interview for the respective positions 
        3. Ensure all answers are properly escaped for JSON
        4. Do not provide any Examples inside any answers. 
        5. Make questions and answers relevant to the following context:

        {prompt}
        """
    
    response = model.generate_content([
        structured_propmt
    ])
    return response.text #response is a json so need to be converted to text for string


@app.get("/")
def read_root():
    job_title = 'Front end developer'
    position= 'intern'
    prompt = f'title: {job_title}, position: {position} '
    response = query(prompt)
    print(response)
    json_obj = json.loads(response)
    save_questions(job_title, position, json_obj)
    return {"message": json_obj}