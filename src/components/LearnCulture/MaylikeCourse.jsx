import React, { useState, useEffect, useRef } from "react";
import { Star, Loader2 } from "lucide-react";
import CourseCard from "../cardlayout/CourseCard";

export default function MayLikeCourse() {
  const observerTarget = useRef(null);

  const [courses, setCourses] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerRow = 4; // 4 courses per row for better spacing
  const rowsToShow = 2;
  const initialVisible = itemsPerRow * rowsToShow;

  const [visibleCount, setVisibleCount] = useState(initialVisible);
  const [isAutoLoading, setIsAutoLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const maxAutoLoadRows = 4; // 2 initial + 2 auto-load
  const maxAutoLoadItems = itemsPerRow * maxAutoLoadRows;

  // Fetch popular courses - Replace with your API endpoint
  useEffect(() => {
    const fetchPopularCourses = async () => {
      try {
        setIsLoadingData(true);
        setError(null);

        // Simulate API call - Replace with your actual endpoint
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data - Replace with actual API response
        const mockCourses = [
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
            title: "Sarangi: The Soul of Nepal",
            teacher_name: "Ganesh Rasaili",
            description:
              "Learn to play the traditional Nepali Sarangi from master musicians.",
            average_rating: 4.8,
            enrolled_students: "4,567",
            price: 2999,
            image:
              "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800",
            teacherId: 1,
          },
          {
            id: 7,
            title: "Classical Newari Dance Forms",
            teacher_name: "Indira Shakya",
            description:
              "Explore the elegant movements and cultural significance of classical Newari dance.",
            average_rating: 4.9,
            enrolled_students: "2,890",
            price: 3499,
            image:
              "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800",
            badge: "New",
            teacherId: 1,
          },
          {
            id: 8,
            title: "Dhime: Traditional Drum Mastery",
            teacher_name: "Prakash Shrestha",
            description:
              "Master the powerful sounds of the Dhime drum used in traditional festivals.",
            average_rating: 4.7,
            enrolled_students: "3,234",
            price: 2199,
            image:
              "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800",
            teacherId: 1,
          },
          {
            id: 9,
            title: "Paubha Painting Techniques",
            teacher_name: "Lok Chitrakar",
            description:
              "Learn the intricate art of traditional Paubha painting with expert guidance.",
            average_rating: 4.8,
            enrolled_students: "1,987",
            price: 4499,
            image:
              "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800",
            teacherId: 1,
          },
          {
            id: 10,
            title: "Lakhe Dance: Mask & Movement",
            teacher_name: "Bishal Maharjan",
            description:
              "Discover the mystical Lakhe dance tradition and its cultural importance.",
            average_rating: 4.6,
            enrolled_students: "2,456",
            price: 2799,
            image:
              "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
            teacherId: 1,
          },
          {
            id: 11,
            title: "Traditional Pottery Workshop",
            teacher_name: "Ram Prajapati",
            description:
              "Create authentic Nepali pottery using traditional wheel techniques.",
            average_rating: 4.7,
            enrolled_students: "3,678",
            price: 1999,
            image:
              "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800",
            teacherId: 1,
          },
          {
            id: 12,
            title: "Deuda Dance Fundamentals",
            teacher_name: "Kamala Bhandari",
            description:
              "Learn the energetic Far Western folk dance with authentic movements.",
            average_rating: 4.8,
            enrolled_students: "4,123",
            price: 1599,
            image:
              "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800",
            teacherId: 1,
          },
        ];

        setCourses(mockCourses);
        setIsLoadingData(false);

        // Uncomment below when using real API
        /*
        const response = await fetch('YOUR_API_ENDPOINT');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setCourses(data.courses);
        } else {
          throw new Error(data.error || "Failed to load courses");
        }
        */
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err.message);
        setIsLoadingData(false);
      }
    };

    fetchPopularCourses();
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

  // Intersection Observer for auto-loading
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
  }, [
    isAutoLoading,
    isLoading,
    visibleCount,
    maxAutoLoadItems,
    courses.length,
  ]);

  // Show loading state
  if (isLoadingData) {
    return (
      <div className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-medium">
              Error loading courses: {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm text-red-600 hover:text-red-800 underline font-medium">
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (courses.length === 0) {
    return (
      <div className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            You May Also Like
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center">
            <p className="text-gray-600 text-lg">
              No courses available at the moment
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            You May Also Like
          </h2>
          <p className="text-gray-500 text-lg">
            Courses handpicked based on your interests
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.slice(0, visibleCount).map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              teacherId={course.teacherId}
              teacherName={course.teacher_name}
            />
          ))}
        </div>

        {/* Observer Target for Auto-loading */}
        {isAutoLoading &&
          visibleCount < courses.length &&
          visibleCount < maxAutoLoadItems && (
            <div ref={observerTarget} className="h-20" />
          )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
          </div>
        )}

        {/* Load More Button */}
        {!isAutoLoading && visibleCount < courses.length && !isLoading && (
          <div className="flex justify-center mt-10">
            <button
              onClick={handleManualLoadMore}
              className="bg-teal-600 text-white px-8 py-3 rounded-full hover:bg-teal-700 transition-colors font-semibold shadow-md hover:shadow-lg">
              Load More Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
