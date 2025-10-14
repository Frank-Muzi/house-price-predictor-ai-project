# Imports
import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.model_selection import KFold, cross_val_score, GridSearchCV
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, OrdinalEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import HistGradientBoostingRegressor
import pickle

# Config
RANDOM_STATE = 42
TARGET = "Price"
DROP = ["Id"]

DATASET_PATH = "./house_data.csv"
df = pd.read_csv(DATASET_PATH)

# Remap Condition values to match desired order
if "Condition" in df.columns:
    df["Condition"] = df["Condition"].replace({
        "Excellent": "New",
        "Fair": "Good",
        "Good": "Good",
        "Poor": "Needs Renovation"
    })

# Drop unwanted columns
df = df.drop(columns=[c for c in DROP if c in df.columns])

# Prepare features + target
y = df[TARGET]
X = df.drop(columns=[TARGET])

# Auto-detect numeric and categorical features
num_features = X.select_dtypes(include=['number']).columns.tolist()
cat_features = X.select_dtypes(exclude=['number']).columns.tolist()

print("Numeric features:", num_features)
print("Categorical features:", cat_features)

# Ordinal Encoding for ordered categorical features
ordinal_transformers = []

if "Condition" in X.columns:
    condition_order = [["Needs Renovation", "Good", "New"]]
    ordinal_transformers.append(("Condition", OrdinalEncoder(categories=condition_order), ["Condition"]))
    cat_features.remove("Condition")

if "location" in X.columns:
    location_order = [["Rural", "Downtown", "Suburban", "Urban"]]
    ordinal_transformers.append(("location", OrdinalEncoder(categories=location_order), ["location"]))
    cat_features.remove("location")

if "garage" in X.columns:
    garage_order = [["None", "Carport", "Garage"]]
    ordinal_transformers.append(("garage", OrdinalEncoder(categories=garage_order), ["garage"]))
    cat_features.remove("garage")

# Preprocessing
numeric_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

categorical_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("onehot", OneHotEncoder(handle_unknown="ignore"))
])

preprocessor = ColumnTransformer(
    transformers=[
        ("num", numeric_transformer, num_features),
        ("cat", categorical_transformer, cat_features),
    ] + ordinal_transformers
)

# Fit preprocessor to get feature names
preprocessor.fit(X)
feature_names = preprocessor.get_feature_names_out()

# Build monotonic constraints aligned with transformed features
monotonic_cst = []
for f in feature_names:
    f_lower = f.lower()
    if "area" in f_lower or "bedrooms" in f_lower or "bathrooms" in f_lower or "floors" in f_lower or "yearbuilt" in f_lower:
        monotonic_cst.append(1)
    else:
        monotonic_cst.append(0)

print("\nMonotonic constraints length:", len(monotonic_cst))
print("Feature names:", feature_names)
print("Constraints:", monotonic_cst)

# Pipeline with model
regressor = HistGradientBoostingRegressor(
    random_state=RANDOM_STATE,
    monotonic_cst=monotonic_cst
)

model_pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("regressor", regressor)
])

# Cross-validation setup
kf = KFold(n_splits=10, shuffle=True, random_state=RANDOM_STATE)

# Baseline cross-validation metrics
rmse_scores = -cross_val_score(model_pipeline, X, y, cv=kf, scoring="neg_root_mean_squared_error")
mae_scores = -cross_val_score(model_pipeline, X, y, cv=kf, scoring="neg_mean_absolute_error")
r2_scores = cross_val_score(model_pipeline, X, y, cv=kf, scoring="r2")

print("\n📊 Cross-validation results:")
print("RMSE per fold:", rmse_scores)
print("Mean RMSE:", rmse_scores.mean())
print("MAE per fold:", mae_scores)
print("Mean MAE:", mae_scores.mean())
print("R² per fold:", r2_scores)
print("Mean R²:", r2_scores.mean())

# Hyperparameter tuning
param_grid = {
    "regressor__max_depth": [None, 10, 20],
    "regressor__learning_rate": [0.05, 0.1, 0.2],
    "regressor__max_iter": [200, 500]
}

grid = GridSearchCV(
    model_pipeline,
    param_grid,
    cv=kf,
    scoring="neg_root_mean_squared_error",
    n_jobs=-1
)

grid.fit(X, y)

print("\n✅ Best parameters:", grid.best_params_)
print("Best CV RMSE:", -grid.best_score_)

# Save full pipeline (preprocessing + best model)
best_pipeline = grid.best_estimator_

with open("house_model.pkl", "wb") as f:
    pickle.dump(best_pipeline, f)

print("\n💾 Full pipeline saved to house_model.pkl (preprocessing + model)")