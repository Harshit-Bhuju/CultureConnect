import React from "react";
import "./ParallaxSection.css";

const ParallaxSection = ({
  title = "CultureConnect",
  subtitle = "Discover",
  backgroundImage,
  height = "400px",
  className = "",
}) => {
  return (
    <section className={`parallax-section ${className}`}>
      <div
        className="parallax-container"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          height: height,
        }}
      >
        <div className="video-overlay">
          <div className="caption">
            <h3>{subtitle}</h3>
            <h1>{title}</h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParallaxSection;