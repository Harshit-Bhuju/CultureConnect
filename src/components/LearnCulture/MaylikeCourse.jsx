import React, { useState, useEffect, useRef } from "react";
import { useSidebar } from "../ui/sidebar";
import { Loader2 } from "lucide-react";
import CourseCard from "../cardlayout/CourseCard";
import API from "../../Configs/ApiEndpoints";

export default function MayLikeCourse() {
  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";
  const observerTarget = useRef(null);

  const [courses, setCourses] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerRow = isCollapsed ? 7 : 6;
  const rowsToShow = 3;
  const initialVisible = itemsPerRow * rowsToShow;

  const [visibleCount, setVisibleCount] = useState(initialVisible);
  const [isAutoLoading, setIsAutoLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const maxAutoLoadRows = 6; // 3 initial + 3 auto-load
  const maxAutoLoadItems = itemsPerRow * maxAutoLoadRows;

  useEffect(() => {
    const fetchMayLike = async () => {
      try {
        setIsLoadingData(true);
        setError(null);

        const response = await fetch(`${API.GET_MAY_LIKE_COURSES}?limit=100`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setCourses(data.courses);
        } else {
          throw new Error(data.error || "Failed to load courses");
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err.message);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchMayLike();
  }, []);

  const loadMore = (isAuto = false) => {
    if (isLoading) return;

    setIsLoading(true);

    setTimeout(() => {
      setVisibleCount((prev) => {
        const newCount = prev + itemsPerRow * rowsToShow;
        if (isAuto && newCount >= maxAutoLoadItems) {
          setIsAutoLoading(false);
        }
        return newCount;
      });
      setIsLoading(false);
    }, 800);
  };

  const handleManualLoadMore = () => {
    loadMore(false);
  };

  useEffect(() => {
    if (!isAutoLoading || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          visibleCount < maxAutoLoadItems &&
          visibleCount < courses.length
        ) {
          loadMore(true);
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [isAutoLoading, isLoading, visibleCount, maxAutoLoadItems, courses.length]);

  useEffect(() => {
    const newInitialVisible = (isCollapsed ? 7 : 6) * rowsToShow;
    setVisibleCount(newInitialVisible);
    setIsAutoLoading(true);
  }, [isCollapsed]);

  if (isLoadingData) {
    return (
      <div className="w-full py-12 px-3 sm:px-6 md:px-10 bg-white">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12 px-3 sm:px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-medium">Error loading courses: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm text-teal-600 hover:text-teal-800 underline font-medium">
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-12 px-3 sm:px-6 md:px-10 bg-white">
      <div className={`mx-auto ${isCollapsed ? "max-w-[1440px]" : "max-w-7xl"}`}>
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            You May Also Like
          </h2>
          <p className="text-gray-500 text-lg">
            Courses handpicked based on your interests
          </p>
        </div>

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${isCollapsed ? "xl:grid-cols-5" : "xl:grid-cols-4"
            }`}>
          {courses.slice(0, visibleCount).map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              teacherId={course.teacherId}
              teacherName={course.teacher_name}
            />
          ))}
        </div>

        {isAutoLoading && visibleCount < courses.length && visibleCount < maxAutoLoadItems && (
          <div ref={observerTarget} className="h-20" />
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
          </div>
        )}

        {!isAutoLoading && visibleCount < courses.length && !isLoading && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleManualLoadMore}
              className="bg-teal-600 text-white px-10 py-3 rounded-full hover:bg-teal-700 transition font-semibold shadow-lg shadow-teal-100">
              Load More Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
