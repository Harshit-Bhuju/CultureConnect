import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, GraduationCap } from "lucide-react";
import API from "../../Configs/ApiEndpoints";

const TeacherSpotlight = () => {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSuggestedTeachers();
  }, []);

  const fetchSuggestedTeachers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API.GET_SUGGESTED_TEACHERS, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setTeachers(data.teachers || []);
      } else {
        setError(data.error || "Failed to load teachers");
      }
    } catch (err) {
      console.error("Fetch suggested teachers error:", err);
      setError("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 bg-gray-50 px-3 sm:px-6 md:px-10">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[280px] md:w-[320px] bg-white rounded-xl p-4 animate-pulse flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (teachers.length === 0) {
    return null;
  }

  return (
    <div className="py-8 px-3 sm:px-6 md:px-10">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          Suggested Instructors
        </h2>
        <p className="text-sm text-gray-500">Learn from master practitioners</p>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="flex overflow-x-auto gap-4 pb-4 md:pb-0 scrollbar-hide snap-x">
        {teachers.map((teacher) => (
          <Link
            key={teacher.id}
            to={`/teacherprofile/${teacher.id}`}
            className="flex-shrink-0 w-[280px] md:w-[320px] snap-start bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-shadow hover:shadow-md flex items-center gap-4 group">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-gray-200 shrink-0">
              <img
                src={`${API.TEACHER_PROFILE_PICTURES}/${teacher.profile_picture}`}
                alt={teacher.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1544717305-27a734ef1904?q=80&w=2070&auto=format&fit=crop";
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 truncate text-sm md:text-base group-hover:text-teal-600 transition-colors">
                {teacher.name}
              </h3>
              <p className="text-xs text-gray-500 mb-1">{teacher.specialty}</p>

              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-0.5 text-yellow-500 font-medium">
                  <Star size={12} fill="currentColor" /> {teacher.rating}
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">{teacher.courses} Courses</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">
                  {teacher.total_students.toLocaleString()} Students
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TeacherSpotlight;
