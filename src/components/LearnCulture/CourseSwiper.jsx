import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Mousewheel } from "swiper/modules";
import CourseCard from "../cardlayout/CourseCard";
import API from "../../Configs/ApiEndpoints";

const CourseSwiper = () => {
  const swiperRef = useRef(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const response = await fetch(`${API.GET_POPULAR_COURSES}?limit=10`, {
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setCourses(data.courses);
        }
      } catch (err) {
        console.error("Failed to fetch popular courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  const handlePrev = () => {
    if (swiperRef.current) swiperRef.current.slidePrev();
  };

  const handleNext = () => {
    if (swiperRef.current) swiperRef.current.slideNext();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    );
  }

  if (courses.length === 0) return null;

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
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-gray-50 hover:shadow-xl hover:scale-110 opacity-0 group-hover:opacity-100">
          <ChevronLeft size={24} className="text-gray-700" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-gray-50 hover:shadow-xl hover:scale-110 opacity-0 group-hover:opacity-100">
          <ChevronRight size={24} className="text-gray-700" />
        </button>

        {/* Swiper Container */}
        <div className="relative">
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            modules={[Mousewheel]}
            mousewheel={{ forceToAxis: true }}
            spaceBetween={24}
            loop={courses.length > 4}
            grabCursor
            breakpoints={{
              1280: { slidesPerView: 4 },
              1024: { slidesPerView: 3 },
              768: { slidesPerView: 2 },
              0: { slidesPerView: 1 },
            }}
            className="pb-4">
            {courses.map((course) => (
              <SwiperSlide key={course.id}>
                <div className="flex justify-center">
                  <div className="w-80">
                    <CourseCard
                      course={course}
                      teacherId={course.teacherId}
                      teacherName={course.teacher_name}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default CourseSwiper;
