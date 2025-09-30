
import React from "react";
import { Routes, Route } from "react-router-dom";
import Predict from "./Pages/HomePredictorForm";
import Home from "./Pages/home";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/predict" element={<Predict />} />
    </Routes>
  );
}

export default App;