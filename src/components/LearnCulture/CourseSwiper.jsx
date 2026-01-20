import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CourseCard from "../cardlayout/CourseCard";

const CourseSwiper = () => {
  const scrollRef = useRef(null);

  const courses = [
    {
      id: 1,
      title: "Complete Web Design: from Figma to Webflow to Freelancing",
      teacher_name: "Vako Shvili",
      description:
        "3 in 1 Course: Learn to design websites with Figma, build with Webflow, and make a living freelancing.",
      average_rating: 4.7,
      enrolled_students: "16,741",
      price: 1499,
      image:
        "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800",
      badge: "Bestseller",
      teacherId: 1,
    },
    {
      id: 2,
      title: "Master Traditional Nepali Dance",
      teacher_name: "Maya Tamang",
      description:
        "Learn authentic Nepali folk dances with expert guidance and cultural insights.",
      average_rating: 4.8,
      enrolled_students: "8,234",
      price: 1999,
      image:
        "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800",
      teacherId: 1,
    },
    {
      id: 3,
      title: "Madal Playing for Beginners",
      teacher_name: "Rajesh Maharjan",
      description:
        "Master the traditional Nepali drum with step-by-step lessons from basic to advanced.",
      average_rating: 4.6,
      enrolled_students: "5,421",
      price: 2499,
      image:
        "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800",
      teacherId: 1,
    },
    {
      id: 4,
      title: "Traditional Thangka Painting",
      teacher_name: "Karma Lama",
      description:
        "Learn the ancient art of Thangka painting with traditional techniques and modern applications.",
      average_rating: 4.9,
      enrolled_students: "3,156",
      price: 3999,
      image:
        "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800",
      badge: "Popular",
      teacherId: 1,
    },
    {
      id: 5,
      title: "Nepali Folk Songs Masterclass",
      teacher_name: "Sita Gurung",
      description:
        "Discover and master beautiful Nepali folk songs with vocal training and cultural context.",
      average_rating: 4.7,
      enrolled_students: "6,892",
      price: 1799,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
      teacherId: 1,
    },
    {
      id: 6,
      title: "Advanced React & TypeScript",
      teacher_name: "John Anderson",
      description:
        "Build scalable applications with React 18, TypeScript, and modern development practices.",
      average_rating: 4.8,
      enrolled_students: "12,456",
      price: 1999,
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
      teacherId: 1,
    },
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Popular Courses
        </h2>
        <p className="text-gray-500">
          Explore our most loved courses and start learning today
        </p>
      </div>

      <div className="relative group">
        {/* Navigation Buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-gray-50 hover:shadow-xl hover:scale-110 opacity-0 group-hover:opacity-100">
          <ChevronLeft size={24} className="text-gray-700" />
        </button>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-gray-50 hover:shadow-xl hover:scale-110 opacity-0 group-hover:opacity-100">
          <ChevronRight size={24} className="text-gray-700" />
        </button>

        {/* Swiper Container */}
        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}>
          <div className="flex gap-6 pb-4">
            {courses.map((course) => (
              <div key={course.id} className="flex-shrink-0 w-80">
                <CourseCard
                  course={course}
                  teacherId={course.teacherId}
                  teacherName={course.teacher_name}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSwiper;
