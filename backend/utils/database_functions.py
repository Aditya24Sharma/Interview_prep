from .database import to_question_set, get_user_answer, get_questions, get_question_set, set_feedbackset

def save_questions(job_title, description,YOE, questions):
    """
    Calls to_questionset -> Calls to_question
    """
    print('Saving Questions...')
    to_question_set(job_title, description, YOE, questions)
    return None
 
# def save_questions(job_title, position, questions):
#     """
#     Calls to_questionset -> Calls to_question
#     """
#     print('Saving Questions...')
#     to_question_set(job_title, position, questions)
#     return None
 


def save_feedbacks(questionset_id, feedbacks):
    print('Saving Feedback...')
    question_set = get_question_set(questionset_id)[0]
    job_title = question_set['job_title']
    position = question_set['position']
    set_feedbackset(questionset_id,job_title, position, feedbacks)
    return

def combine_ua_questions(questionset_id):
    """
    return: 
    "easy": [
        {
            "question": "What is the difference between == and === in JavaScript?",
            "correct_answer": "== checks for value equality, while === checks for value and type equality.",
            "user_answer": "There is no difference between both the operators, they are the same thing."
        }
    ],
    """
    user_answers = get_user_answer(questionset_id)
    question_id = [ua['question_id'] for ua in user_answers]
    questions = get_questions(question_id)
    questions_map = {q["question_id"]: q for q in questions}
    user_responses = {}
    for ua in user_answers:
        question_details = questions_map.get(ua["question_id"], {})
        difficulty = question_details.get("difficulty", "unknown")
        
        # Ensure difficulty is a key in the user_responses dictionary
        if difficulty not in user_responses:
            user_responses[difficulty] = []

        user_responses[difficulty].append({
            "question": question_details.get("question", "Unknown"),
            "correct_answer": question_details.get("answer", "Unknown"),
            "user_answer": ua["user_answer"]
        })

    return user_responses

