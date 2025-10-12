// src/components/Loading.jsx
import React from "react";

const Loading = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
      <p className="text-lg">{message}</p>
    </div>
  </div>
);

export default Loading;
