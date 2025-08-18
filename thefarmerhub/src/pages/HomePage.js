// src/pages/HomePage.js
import React from "react";

import WeatherWidget from "../components/WeatherWidget";

import TrainingTutorials from "./TrainingTutorials"; // import component

const HomePage = () => {
  return (
    <div className="container mt-4">
      {/* Weather Section */}
      <div className="row mb-4">
        <div className="col-md-12">
          <WeatherWidget />
        </div>
      </div>

      {/* Training Tutorials Section (added below weather) */}
      <div className="row">
        <div className="col-md-12">
          <TrainingTutorials />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
