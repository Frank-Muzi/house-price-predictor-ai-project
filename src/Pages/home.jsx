


import HomePredictorForm from "./HomePredictorForm";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";

export default function Home() {
  // Background image slider logic for hero/predict section
  const bgImages = [
    "/101495134_preview-b192d3b7d4b04188a014754b9ffa6f79.jpg",
    "/SBP2556_dimension_property_QP-scaled.jpg"
  ];
  const [bgIndex, setBgIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [bgImages.length]);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      {/* Hero / Predictor Section with background slider */}
      <section
        id="hero-section"
        style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "40px",
          backgroundImage: `url('${bgImages[bgIndex]}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transition: "background-image 1s ease-in-out",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>🏠 House Price Predictor</h1>
        <p style={{
          fontSize: "1.2rem",
          marginBottom: "30px",
          backgroundColor: "#e8ebf0",
          color: "#101010ff",
          fontWeight: 600,
          padding: "16px 24px",
          borderRadius: "8px",
          display: "inline-block",
          boxShadow: "0 2px 8px rgba(0,0,0,0.10)"
        }}>
          Enter house details and predict its price in South African Rands.
        </p>
        {/* Add a wrapper div for scrolling to the form */}
        <div id="predict-section">
          <HomePredictorForm />
        </div>
      </section>

      {/* About Section */}
      <section
        id="about-section"
        style={{
          padding: "40px",
          textAlign: "center",
          backgroundColor: "#e8ebf0",
        }}
      >
        <h2 style={{ fontSize: "1.8rem", marginBottom: "15px" }}>About</h2>
        <p style={{ fontSize: "1rem", maxWidth: "600px", margin: "0 auto" }}>
          This system uses Machine Learning to predict house prices based on key features
          such as area, bedrooms, bathrooms, floors, year built, location, condition, and garage.
          It is designed to give users an estimate of property values in South Africa.
        </p>
      </section>
      <footer style={{
      width: "100%",
      background: "#888888",
      color: "#fff",
      padding: "24px 0 12px 0",
      textAlign: "center",
      fontSize: "1rem",
      letterSpacing: "0.5px",
      marginTop: "auto",
      boxShadow: "0 -2px 8px rgba(0,0,0,0.07)"
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <span style={{ fontWeight: 600 }}>
          © 2025 House Price Predictor
        </span>
        <span style={{ marginLeft: 12, color: "#bbb", fontWeight: 400 }}>
          | Powered by AI & Machine Learning for South African property insights
        </span>
      </div>
    </footer>
    </div>
  );
}
