from fastapi import FastAPI

import google.generativeai as genai
from dotenv import load_dotenv
import os

app = FastAPI()

# load_dotenv()

# api_key = os.getenv('GOOGLE_API_KEY')

# genai.configure(api_key = api_key  )

# model = genai.GenerativeModel("gemini-1.5-flash")
# prompt = """Generate a easy level question for the following job description:
# Title: Front-end Developer
# Position: Intern
# Skills: ReactJs, JavaScript, UI, NextJs
# Also provide a good answer for this. 
# """
# response = model.generate_content([
#     prompt
# ])

# print(response.text)

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}