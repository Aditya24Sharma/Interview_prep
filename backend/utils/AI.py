import google.generativeai as genai
from typing import Dict, Any
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv('GOOGLE_API_KEY')
model = genai.GenerativeModel("gemini-1.5-flash")
genai.configure(api_key = api_key  )

def query(prompt: str)->Dict[str, Any]:
    print("Entered Query")
    '''
    {
        "easy":{
                "Question":"...",
                "Answer":"..."
            },
            "medium:{...}
    }
    '''
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
    try:
        print('Prompting Gemini for Questions...')
        response = model.generate_content([
            structured_propmt
        ])
        print('Success: Gemini response for Questions')
        return response.text #response is a json so need to be converted to text for string
    except Exception as e:
        print(f'Error: Gemini Questions Failed: {e}')
        return None


def feeback(user_response: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate detailed feedback and ratings for interview responses.
    
    Args:
        user_response: Dictionary containing questions, correct answers, and user answers
        for each difficulty level.
        
    Returns:
        Dictionary containing detailed feedback, individual ratings, and overall rating.
        
    Raises:
        HTTPException: If response generation or parsing fails
    """
    structured_propmt = f"""
    Analyze the following interview responses : {user_response} and provide detailed feedback and ratings. Return the response in this exact JSON structure, without any markdown formatting:
    {{
        "feedback_set" : {{
            "easy": {{
                "Question": "{user_response.get('easy', {})[0].get('Question', '')}",
                "Answer": "{user_response.get('easy', {})[0].get('Answer', '')}",
                "User_Answer": "{user_response.get('easy', {})[0].get('User_Answer', '')}",
                "Feedback": "<detailed_analysis>",
                "Rating": <score_0_to_5>
            }},
            "medium": {{
                "Question": "{user_response.get('medium', {})[0].get('Question', '')}",
                "Answer": "{user_response.get('medium', {})[0].get('Answer', '')}",
                "User_Answer": "{user_response.get('medium', {})[0].get('User_Answer', '')}",
                "Feedback": "<detailed_analysis>",
                "Rating": <score_0_to_5>
            }},
            "hard": {{
                "Question": "{user_response.get('hard', {})[0].get('Question', '')}",
                "Answer": "{user_response.get('hard', {})[0].get('Answer', '')}",
                "User_Answer": "{user_response.get('hard', {})[0].get('User_Answer', '')}",
                "Feedback": "<detailed_analysis>",
                "Rating": <score_0_to_5>
            }}
        }},
        "Overall_Rating": <average_score>,
        "Summary_Feedback": "<overall_performance_analysis>"
    }}

    Evaluation Guidelines:

    1. Feedback Analysis (For each answer):
       - Compare the user's answer against the correct answer
       - Identify key concepts that were correctly addressed
       - Point out important missing elements
       - Suggest specific improvements
       - Provide examples where relevant
       - Keep feedback constructive and actionable
       - Try to limit the feedback to 2-3 lines

    2. Rating Scale (0-5):
       0 = Completely incorrect or irrelevant
       1 = Major misconceptions, minimal correct elements
       2 = Partial understanding but significant gaps
       3 = Good understanding with some missing elements
       4 = Very good answer with minor omissions
       5 = Excellent, complete, and accurate answer

    3. Overall Rating Calculation:
       - Calculate weighted average of individual ratings
       - Weight distribution: Hard (40%), Medium (35%), Easy (25%)
       - Round to one decimal place

    4. Summary Feedback Requirements:
       - Highlight strongest areas
       - Identify patterns in weaknesses
       - Provide actionable improvement suggestions
       - Keep tone constructive and encouraging

    Important:
    - Ensure all feedback is specific and actionable
    - Focus on knowledge gaps and areas for improvement
    - Maintain professional and constructive tone
    - Provide concrete examples for improvement
    - Consider technical accuracy and completeness

    RESPONSE FORMAT REQUIREMENTS:
    1. Provide ONLY the JSON object
    2. Do NOT include markdown code blocks (```)
    3. Do NOT include any explanatory text
    4. Do NOT include any formatting
    5. Start directly with the opening curly brace {{
    6. End directly with the closing curly brace }}
    """
    print("Prompting Gemini for feedback")
    try:
        response = model.generate_content([
            structured_propmt
        ])
        print("Success: Gemini response for feedback")
        return response.text
    except Exception as e:
        print(f"Error in Gemini response for feedback: {e}")
        return None 