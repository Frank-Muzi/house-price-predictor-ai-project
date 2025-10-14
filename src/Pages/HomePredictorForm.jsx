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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPrice(null);

    try {
      // Convert numeric inputs to numbers
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

  return (
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

      {/* Numeric inputs */}
        {["area", "bedrooms", "bathrooms", "floors", "year_built"].map((field) => (
          <input
            key={field}
            type="number"
            name={field}
            min={0}
            {...(field === "year_built" ? { pattern: "\\d{4}", minLength: 4, maxLength: 4 } : {})}
            placeholder={field.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            value={form[field]}
            onChange={handleChange}
            required
            style={{ height: "48px", fontSize: "1.2rem", padding: "0 16px", borderRadius: "7px" }}
          />
        ))}
      {/* Location */}
      <select
        name="location"
        value={form.location}
        onChange={handleChange}
        required
        style={{ height: "48px", fontSize: "1.2rem", padding: "0 16px", borderRadius: "7px" }}
      >
        <option value="">Location</option>
        <option value="Urban">Rural</option>
        <option value="Suburban">Urban</option>
      </select>

      {/* Condition */}
      <select
        name="condition"
        value={form.condition}
        onChange={handleChange}
        required
        style={{ height: "48px", fontSize: "1.2rem", padding: "0 16px", borderRadius: "7px" }}
      >
        <option value="">Condition</option>
        <option value="New">Excellent</option>
        <option value="Good">Good</option>
      </select>

      {/* Garage */}
      <select
        name="garage"
        value={form.garage}
        onChange={handleChange}
        required
        style={{ height: "48px", fontSize: "1.2rem", padding: "0 16px", borderRadius: "7px" }}
      >
        <option value="">Garage</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>

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
          marginTop: "16px",
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
          Predicted Price: R {typeof price === "number" ? price.toLocaleString() : price}
        </p>
      )}
    </form>
  );
}
