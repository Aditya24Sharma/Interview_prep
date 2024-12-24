from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
import logging 

load_dotenv()

logging.getLogger('passlib').setLevel(logging.ERROR)

# Create a new instance of the CryptContext class
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#constants
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

async def hash_password(password:str) -> str:
    '''
    Hashes a plain text password using bcrypt
    Args:
        password (str): The plain text password
    Returns:
        str: The hashed password
    '''
    return pwd_context.hash(password)

def verify_password(plain_password:str, hashed_password:str) -> bool:
    '''
    Verifies a plain text password against a hashed password
    Args:
        plain_password (str): The plain text password
        hashed_password (str): The hashed password
    Returns:
        bool: True if the passwords match, False otherwise
    '''
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours = 1)) -> str:
    '''
    Creates a JWT for user authentication
    Args:
        data(dict): The payload to encode in the token (e.g., user_id)
        expires_delta(timedelta): The token expiration time. 
    Returns:
        str: The generated JWT.
    '''
    to_encode = data.copy()
    expire = datetime.now() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm = ALGORITHM)

def decode_access_token(token:str) -> dict:
    '''
    Decodes and verifies a JWT.
    Args:
        token(str): The JWT to decode.
    Returns:
        dict: The decoded payload if valid
    '''
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms = [ALGORITHM])
        return payload
    except JWTError as e:
        print(f'Token decode erro: {e}')
        return None