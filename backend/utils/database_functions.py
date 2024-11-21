from .database import to_question_set

def save_questions(job_title, position, questions):
    """
    Calls to_questionset -> Calls to_question
    """
    to_question_set(job_title, position, questions)
    return None
 

def save_feedbacks(job_title, position, feedbacks):
    return

