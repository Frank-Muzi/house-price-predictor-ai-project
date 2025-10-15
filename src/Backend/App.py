from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import os 

app = Flask(__name__)
CORS(app)



# --- Load trained pipeline (preprocessing + model) ---
with open("house_model.pkl", "rb") as f:
    model = pickle.load(f)

# --- Expected columns --- 
# (you can adjust if your training pipeline uses different names)
NUMERIC_FEATURES = ["Area", "Bedrooms", "Bathrooms", "Floors", "YearBuilt"]
CATEGORICAL_FEATURES = ["Location", "Condition", "Garage"]

# --- Map legacy condition values ---
CONDITION_MAP = {
    "Excellent": "New",
    "Fair": "Good",
    "Good": "Needs Renovation"
}

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        # Convert to DataFrame
        input_df = pd.DataFrame([data])

        # --- Ensure numeric columns are numbers ---
        for col in NUMERIC_FEATURES:
            if col in input_df.columns:
                input_df[col] = pd.to_numeric(input_df[col], errors="coerce")
            else:
                input_df[col] = 0  # fallback if missing

        # --- Map Condition values if needed ---
        if "Condition" in input_df.columns:
            input_df["Condition"] = input_df["Condition"].replace(CONDITION_MAP)

        # --- Fill missing categorical columns ---
        for col in CATEGORICAL_FEATURES:
            if col not in input_df.columns:
                input_df[col] = "Unknown"

        # Debug logs
        print("Incoming JSON:", data)
        print("Prepared DataFrame for prediction:")
        print(input_df)

        # --- Predict ---
        prediction = model.predict(input_df)
        return jsonify({"predicted_price": float(prediction[0])})

    except Exception as e:
        print("Prediction error:", e)
        return jsonify({"error": str(e)}), 500


@app.route('/')
def home():
    return jsonify({"message": "Backend is running!"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
