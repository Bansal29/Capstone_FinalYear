from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import HTMLResponse, JSONResponse
from tensorflow.keras.models import load_model
import numpy as np
import cv2
from io import BytesIO
from PIL import Image
import base64

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
model = joblib.load("depression_model.pkl") 

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


# Emotion model for detecting facial expressions
emotion_model = load_model('emotion_model.h5')
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

# Define a more balanced weight system for depression score calculation
emotion_weights = {
    'Angry': 0.8,
    'Disgust': 0.7,
    'Fear': 0.7,
    'Happy': -0.5,    # Positive emotions should lower depression score
    'Sad': 1.0,       # Sadness is a significant indicator of depression
    'Surprise': 0.6,
    'Neutral': 0.3    # Neutrality has a moderate effect
}

# Define the calculate_depression_score function
def calculate_depression_score(emotion_counts):
    # Sum up the weighted emotions to compute a depression score
    depression_score = 0
    total_emotions = sum(emotion_counts.values())  # Total detected emotions

    # Loop over each emotion and apply its weight
    for emotion, count in emotion_counts.items():
        depression_score += emotion_weights.get(emotion, 0) * count

    # Normalize the score between 0 and 10
    return min(max(depression_score / total_emotions, 0), 10) if total_emotions > 0 else 0

# Helper function to preprocess the face image for model prediction
def preprocess_face(face_image):
    face = cv2.resize(face_image, (48, 48))  # Resize to model's expected input
    face = face / 255.0  # Normalize
    face = face.reshape(1, 48, 48, 1)  # Reshape for model
    return face

@app.post("/process_and_predict/")  # Endpoint to process the image and predict emotions
async def process_and_predict(file: UploadFile = File(...)):
    # Read image
    img_bytes = await file.read()
    img = Image.open(BytesIO(img_bytes)).convert('L')  # Convert to grayscale
    img_np = np.array(img)

    # Detect faces using OpenCV
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(img_np, scaleFactor=1.1, minNeighbors=5)

    emotion_counts = {label: 0 for label in emotion_labels}  # Initialize emotion counts
    predictions = []

    # For each detected face, predict the emotion
    for (x, y, w, h) in faces:
        face = img_np[y:y+h, x:x+w]
        preprocessed_face = preprocess_face(face)
        prediction = emotion_model.predict(preprocessed_face)
        emotion = emotion_labels[np.argmax(prediction)]

        # Update the count for the detected emotion
        emotion_counts[emotion] += 1

        # Add the emotion and bounding box to predictions
        predictions.append({"emotion": emotion})

    # Calculate depression score based on emotion counts
    depression_score = calculate_depression_score(emotion_counts)

    # Return emotions and depression score
    response = {
        "emotions": predictions,
        "depression_score": depression_score
    }

    return JSONResponse(response)
