# Interview Prep

## **Overview**
The **Interview Prep** is a comprehensive tool designed to help users prepare for job interviews efficiently. With features like tailored interview questions, feedback mechanisms, and user management, this app is your one-stop solution for interview preparation.

## **Features**
- **User Authentication:**
  - Login and logout functionality using JWT for secure sessions.

- **Question Bank:**
  - AI-powered question generation based on job title and position.
  - Question-answer storage for easy access later.

- **Feedback Mechanism:**
  - Submit answers and receive AI-generated feedback.
  - View past responses and feedback history.

- **Responsive Design:**
  - Fully responsive interface, compatible with all devices.

## **Technologies Used**
### **Frontend:**
- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** Tailwind CSS
- **State Management:** React Context API

### **Backend:**
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/)
- **Authentication:** OAuth2 with JWT
- **Database:** PostgreSQL

## **Installation Instructions**
### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/interview-prep-dashboard.git
cd interview-prep-dashboard
```

### **2. Setup Backend**
1. Navigate to the backend folder.
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Add environment variables (`.env` file):
   ```env
   GOOGLE_API_KEY = your_googleapi_key
   SECRET_KEY = your_secret_key
   DATABASE_URL = your_database_url
   ```
5. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```

### **3. Setup Frontend**
1. Navigate to the frontend folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000  # Update with live URL after deployment
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### **4. Run the Application**
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:8000/docs](http://localhost:8000/docs) (FastAPI Swagger Documentation)

## **Usage**
1. **Login:** Access your account securely.
2. **Dashboard:** View personalized interview questions.
3. **Answer Submission:** Submit answers and receive feedback.
4. **History:** View past questions and feedback.
5. **Logout:** Securely end your session.

## **Contributing**
Contributions are welcome! Feel free to fork this repository and submit pull requests.

## **License**
This project is licensed under the MIT License. See the `LICENSE` file for details.

Any feedbacks would be highly appreciated!

