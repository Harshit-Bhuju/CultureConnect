import React, { useState, useEffect, useRef } from "react";
import useProducts from "./useProducts";
import "./Carousel.css";
export default function Carousel() {
  const [showDetail, setShowDetail] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef(null);
  const listRef = useRef(null);
  const autoSlideRef = useRef(null);
  const products = useProducts();

  const showSlider = (type) => {
    if (isAnimating) return;

    setIsAnimating(true);
    const carousel = carouselRef.current;
    const list = listRef.current;
    const items = list.querySelectorAll(".item");

    carousel.classList.remove("next", "prev");

    if (type === "next") {
      list.appendChild(items[0]);
      carousel.classList.add("next");
    } else {
      list.prepend(items[items.length - 1]);
      carousel.classList.add("prev");
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  };



  const handleBack = () => {
    setShowDetail(false);
  };

  const handleSideClick = (e) => {
    if (showDetail) return;

    const rect = carouselRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const middleX = rect.width / 2;

    if (clickX < middleX) {
      showSlider("prev");
    } else {
      showSlider("next");
    }
  };

  useEffect(() => {
    if (!showDetail) {
      autoSlideRef.current = setInterval(() => {
        showSlider("next");
      }, 5000);
    }

    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
    };
  }, [showDetail, isAnimating]);

   const reorderedProducts = products.length > 0 
    ? [products[products.length - 1], ...products.slice(0, -1)] 
    : products;


  return (
    <div
      className={`carousel  ${showDetail ? "showDetail" : ""}`}
      ref={carouselRef}
      onClick={handleSideClick}>
      <div className="list" ref={listRef}>
        {reorderedProducts.map((product) => (
          <div className="item" key={product.position}>
            <img src={product.image} alt={product.topic} />
            <div className="introduce">
              <div className="title">{product.title}</div>
              <div className="topic">{product.topic}</div>
              <div className="des ">{product.description}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="arrows top-1/3">
        <button
          id="prev"
          onClick={() => showSlider("prev")}
          disabled={isAnimating}>
          &lt;
        </button>
        <button
          id="next"
          onClick={() => showSlider("next")}
          disabled={isAnimating}>
          &gt;
        </button>
        <button id="back" onClick={handleBack}>
          See All ↗
        </button>
      </div>
    </div>
  );
}
