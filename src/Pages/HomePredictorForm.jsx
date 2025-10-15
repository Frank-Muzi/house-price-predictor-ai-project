import { useState } from "react";

export default function HomePredictorForm() {
  const [form, setForm] = useState({
    area: "",
    bedrooms: "",
    bathrooms: "",
    floors: "",
    year_built: "",
    location: "",
    condition: "",
    garage: "",
  });
  const [price, setPrice] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleYearBuiltChange = (e) => {
    const currentYear = new Date().getFullYear();
    let value = e.target.value;
    value = value.replace(/\D/g, "").slice(0, 4);

    if (value && (Number(value) < 1900 || Number(value) > currentYear)) {
      e.target.setCustomValidity(
        `Please enter a year between 1900 and ${currentYear}`
      );
    } else {
      e.target.setCustomValidity("");
    }

    setForm({ ...form, year_built: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPrice(null);

    // Manual validation for min values
    if (Number(form.area) < 200) {
      alert("Area must be greater than 200m");
      return;
    }
    if (Number(form.bedrooms) < 1) {
      alert("Bedrooms must be at least 1");
      return;
    }
    if (Number(form.bathrooms) < 1) {
      alert("Bathrooms must be at least 1");
      return;
    }

    try {
      const payload = {
        Area: Number(form.area),
        Bedrooms: Number(form.bedrooms),
        Bathrooms: Number(form.bathrooms),
        Floors: Number(form.floors),
        YearBuilt: Number(form.year_built),
        Location: form.location,
        Condition: form.condition,
        Garage: form.garage,
      };

      const response = await fetch(
        "https://house-price-predictor-ai-project-4.onrender.com/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Prediction failed");

      const data = await response.json();
      setPrice(data.predicted_price ?? data.prediction ?? null);
    } catch (err) {
      setPrice("Error: " + err.message);
    }
  };

  const handleClear = () => {
    setForm({
      area: "",
      bedrooms: "",
      bathrooms: "",
      floors: "",
      year_built: "",
      location: "",
      condition: "",
      garage: "",
    });
    setPrice(null);
  };

  return (
    <>
      <style>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input {
          -moz-appearance: textfield;
        }
        select:invalid {
          color: #888;
        }
      `}</style>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "rgba(255,255,255,0.95)",
          padding: "30px 40px",
          borderRadius: "12px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          width: "40vw",
          maxWidth: "600px",
          minWidth: "320px",
          minHeight: "220px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "18px", fontSize: "2rem" }}>
          Discover Your Home’s True Value Instantly
        </h2>

        {/* Numeric inputs as text for free typing */}
        {["area", "bedrooms", "bathrooms", "floors"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            value={form[field]}
            onChange={handleChange}
            required
            style={{
              height: "48px",
              fontSize: "1.2rem",
              padding: "0 16px",
              borderRadius: "7px",
              border: "1px solid #ccc",
            }}
          />
        ))}

        {/* Year Built */}
        <input
          type="text"
          name="year_built"
          placeholder="Year Built"
          value={form.year_built}
          onChange={handleYearBuiltChange}
          required
          inputMode="numeric"
          style={{
            height: "48px",
            fontSize: "1.2rem",
            padding: "0 16px",
            borderRadius: "7px",
            border: "1px solid #ccc",
          }}
        />

        {/* Dropdowns */}
        <select name="location" value={form.location} onChange={handleChange} required style={{ height: "48px", fontSize: "1.2rem", padding: "0 16px", borderRadius: "7px", border: "1px solid #ccc" }}>
          <option value="" disabled hidden>Select Location</option>
          <option value="Rural">Rural</option>
          <option value="Urban">Urban</option>
        </select>

        <select name="condition" value={form.condition} onChange={handleChange} required style={{ height: "48px", fontSize: "1.2rem", padding: "0 16px", borderRadius: "7px", border: "1px solid #ccc" }}>
          <option value="" disabled hidden>Select Condition</option>
          <option value="Fair">Good</option>
          <option value="Poor">Excellent</option>
        </select>

        <select name="garage" value={form.garage} onChange={handleChange} required style={{ height: "48px", fontSize: "1.2rem", padding: "0 16px", borderRadius: "7px", border: "1px solid #ccc" }}>
          <option value="" disabled hidden>Select Garage Option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        {/* Clear Form Button */}
        <button type="button" onClick={handleClear} style={{ padding: "6px", fontSize: "0.8rem", borderRadius: "7px", border: "none", backgroundColor: "#ccc", color: "white", fontWeight: "bold", cursor: "pointer", marginTop: "8px", alignSelf: "center" }}>Clear Form</button>

        {/* Predict Button */}
        <button type="submit" style={{ padding: "16px", fontSize: "1.25rem", borderRadius: "7px", border: "none", backgroundColor: "#888888", color: "white", fontWeight: "bold", cursor: "pointer", marginTop: "8px" }}>Predict</button>

        {price && (
          <p style={{ marginTop: "20px", fontWeight: "bold", fontSize: "20px", background: "rgba(255,255,255,0.85)", padding: "10px 20px", borderRadius: "8px" }}>
            Predicted Price: R {typeof price === "number" ? price.toLocaleString() : price}
          </p>
        )}
      </form>
    </>
  );
}
