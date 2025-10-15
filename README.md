HomePredictor is a web application that allows users to predict house prices instantly by entering details like area, bedrooms, bathrooms, floors, year built, location, condition, and garage. The frontend is built in React, and the backend is powered by Flask.

Features

    User-friendly form with numeric validation.
    Year Built restricted between 1900 and the current year.
    Dropdowns for location, condition, and garage.
    Clear Form button to reset inputs.
    Predict button calls backend for real-time predictions.

Dependencies

    Frontend (React)
        Node.js >= 16
        React >= 18
        Install frontend dependencies with: npm install

    Backend (Flask)
        Python >= 3.10
        Flask
        Flask-CORS
        Numpy, Pandas, Scikit-learn (or other ML libraries used for your model)
        Your trained model file (e.g., .pkl)
        Install backend dependencies with: pip install -r requirements.txt

Running the Project

1. Start Backend - cd src\Backend then python app.py
   Make sure your Flask backend is running before using the frontend. The React app communicates with it via /predict.
2. Start Frontend - npm start dev


Usage

    Fill in all required fields in the form.
    Click Predict to see the predicted price.
    Click Clear Form to reset all fields.
    Predictions will only work if the backend server is running.

Deployment

    Deployed frontednt on Vercel.
    Deployed the backend on Render-- https://house-price-predictor-ai-project-4.onrender.com.

