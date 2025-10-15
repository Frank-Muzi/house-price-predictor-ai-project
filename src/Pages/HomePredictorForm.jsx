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

    // Only allow 4 numeric digits
    value = value.replace(/\D/g, "").slice(0, 4);

    // Validate year range
    if (value && (Number(value) < 1900 || Number(value) > currentYear)) {
      e.target.setCustomValidity(`Please enter a year between 1900 and ${currentYear}`);
    } else {
      e.target.setCustomValidity("");
    }

    setForm({ ...form, year_built: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPrice(null);

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

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Prediction failed");

      const data = await response.json();
      setPrice(data.predicted_price ?? data.prediction ?? null);
    } catch (err) {
      setPrice("Error: " + err.message);
    }
  };

  // New function to clear the form
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
      {/* Remove spinner arrows for all number inputs */}
      <style>{`
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
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
        <h2
          style={{
            textAlign: "center",
            marginBottom: "18px",
            fontSize: "2rem",
          }}
        >
          Discover Your Home’s True Value Instantly
        </h2>

        {/* Numeric inputs */}
        {["area", "bedrooms", "bathrooms", "floors"].map((field) => (
          <input
            key={field}
            type="number"
            name={field}
            min={0}
            placeholder={field
              .replace("_", " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())}
            value={form[field]}
            onChange={handleChange}
            required
            onWheel={(e) => e.target.blur()}
            style={{
              height: "48px",
              fontSize: "1.2rem",
              padding: "0 16px",
              borderRadius: "7px",
              border: "1px solid #ccc",
              appearance: "none",
              MozAppearance: "textfield",
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
          onWheel={(e) => e.target.blur()}
          style={{
            height: "48px",
            fontSize: "1.2rem",
            padding: "0 16px",
            borderRadius: "7px",
            border: "1px solid #ccc",
            appearance: "none",
            MozAppearance: "textfield",
          }}
        />

        {/* Dropdowns */}
        <select
          name="location"
          value={form.location}
          onChange={handleChange}
          required
          style={{
            height: "48px",
            fontSize: "1.2rem",
            padding: "0 16px",
            borderRadius: "7px",
            border: "1px solid #ccc",
          }}
        >
          <option value="" disabled hidden>
            Select Location
          </option>
          <option value="Rural">Rural</option>
          <option value="Urban">Urban</option>
        </select>

        <select
          name="condition"
          value={form.condition}
          onChange={handleChange}
          required
          style={{
            height: "48px",
            fontSize: "1.2rem",
            padding: "0 16px",
            borderRadius: "7px",
            border: "1px solid #ccc",
          }}
        >
          <option value="" disabled hidden>
            Select Condition
          </option>
          <option value="Excellent">Excellent</option>
          <option value="Good">Good</option>
        </select>

        <select
          name="garage"
          value={form.garage}
          onChange={handleChange}
          required
          style={{
            height: "48px",
            fontSize: "1.2rem",
            padding: "0 16px",
            borderRadius: "7px",
            border: "1px solid #ccc",
          }}
        >
          <option value="" disabled hidden>
            Select Garage Option
          </option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        {/* Clear Form Button */}
        <button
          type="button"
          onClick={handleClear}
          style={{
            padding: "6px",
            fontSize: "0.8rem",
            borderRadius: "7px",
            border: "none",
            backgroundColor: "#ccc",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "8px",
            alignSelf: "center",
          }}
        >
          Clear Form
        </button>

        {/* Predict Button */}
        <button
          type="submit"
          style={{
            padding: "16px",
            fontSize: "1.25rem",
            borderRadius: "7px",
            border: "none",
            backgroundColor: "#888888",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "8px",
          }}
        >
          Predict
        </button>

        {price && (
          <p
            style={{
              marginTop: "20px",
              fontWeight: "bold",
              fontSize: "20px",
              background: "rgba(255,255,255,0.85)",
              padding: "10px 20px",
              borderRadius: "8px",
            }}
          >
            Predicted Price: R{" "}
            {typeof price === "number"
              ? price.toLocaleString()
              : price}
          </p>
        )}
      </form>
    </>
  );
}
