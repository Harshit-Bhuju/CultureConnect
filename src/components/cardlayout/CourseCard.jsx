import React from "react";
import {  PlayCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../Configs/ApiEndpoints";
import CultureConnectLogo from "../../assets/logo/cultureconnect__fav.png";
const CourseCard = ({ product, teacherId }) => {
  const navigate = useNavigate();
  
  const {
    id,
    title,
    image,
    price,
    video_count,
    duration,
    enrolled_students,
  } = product;

  const isFree = price === 0;

  const handleCardClick = () => {
    navigate(`/courses/${teacherId}/${id}`);
  };

  // Get full image URL
  const getImageUrl = () => {
    if (!image || image === 'default-course-thumbnail.jpg') {
      return CultureConnectLogo;
    }
    // If image already has http/https, return as is
    if (image.startsWith('http')) {
      return image;
    }
    // Otherwise, construct full path
    return `${API.COURSE_THUMBNAILS}/${image}`;
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 max-w-sm cursor-pointer"
    >
      {/* Compact Image Section */}
      <div className="relative h-40 overflow-hidden bg-gray-100">
        <img
          src={getImageUrl()}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Course+Image';
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />       
      </div>

      {/* Compact Content Section */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-base text-gray-800 line-clamp-2 leading-snug min-h-[2.5rem]">
          {title}
        </h3>

        {/* Compact Info Row */}
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <PlayCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>{video_count || 0} videos</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            <span>{duration || 'Self-paced'}</span>
          </div>
        </div>

        {/* Enrollment count if available */}
        {enrolled_students > 0 && (
          <div className="text-xs text-gray-500">
            {enrolled_students} student{enrolled_students !== 1 ? 's' : ''} enrolled
          </div>
        )}

        {/* Price & CTA - Compact */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <span className="text-xl font-bold text-gray-800">
              {isFree ? "Free" : `Rs ${price}`}
            </span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md hover:from-orange-600 hover:to-red-600 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
          >
            View Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;