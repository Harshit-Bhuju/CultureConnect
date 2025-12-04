// src/components/Common/LazyImage.jsx
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function LazyImage({ src, alt, className, height, width, placeholder }) {
  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      className={className}
      height={height}
      width={width}
      effect="blur"
      placeholderSrc={placeholder}
    />
  );
}
