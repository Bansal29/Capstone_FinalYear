from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the pre-trained model
model = joblib.load("depression_model.pkl")  # Adjust the path accordingly

class QuizResponse(BaseModel):
    q1: int
    q2: int
    q3: int
    q4: int
    q5: int
    q6: int
    q7: int
    q8: int

@app.post("/quiz/")
async def evaluate_quiz(quiz: QuizResponse):
    responses = [[quiz.q1, quiz.q2, quiz.q3, quiz.q4, quiz.q5, quiz.q6, quiz.q7, quiz.q8]]
    result = model.predict(responses)[0]
    return {"result": "Depressed" if result == 1 else "Not Depressed"}
