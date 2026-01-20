import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
} from "lucide-react";
import CourseCard from "../../../components/cardlayout/CourseCard";

const CourseCategoryPageLayout = ({ title, description, courses }) => {
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Filters State
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedLevels, setSelectedLevels] = useState([]);

  // Filter Options
  const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"];

  // 1. Filter Logic
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Price Filter
      const price =
        typeof course.price === "string"
          ? parseFloat(course.price.replace(/[^0-9.]/g, ""))
          : course.price;

      const min = priceRange.min ? parseFloat(priceRange.min) : 0;
      const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
      if (price < min || price > max) return false;

      // Rating Filter
      const rating = course.average_rating || course.rating || 0;
      if (selectedRating && rating < selectedRating) return false;

      // Level Filter
      if (selectedLevels.length > 0) {
        if (!course.level || !selectedLevels.includes(course.level)) {
          return false;
        }
      }

      return true;
    });
  }, [courses, priceRange, selectedRating, selectedLevels]);

  // 2. Sort Logic
  const sortedCourses = useMemo(() => {
    const list = [...filteredCourses];
    if (sortBy === "price-low") {
      return list.sort((a, b) => {
        const priceA =
          typeof a.price === "string"
            ? parseFloat(a.price.replace(/[^0-9.]/g, ""))
            : a.price;
        const priceB =
          typeof b.price === "string"
            ? parseFloat(b.price.replace(/[^0-9.]/g, ""))
            : b.price;
        return priceA - priceB;
      });
    }
    if (sortBy === "price-high") {
      return list.sort((a, b) => {
        const priceA =
          typeof a.price === "string"
            ? parseFloat(a.price.replace(/[^0-9.]/g, ""))
            : a.price;
        const priceB =
          typeof b.price === "string"
            ? parseFloat(b.price.replace(/[^0-9.]/g, ""))
            : b.price;
        return priceB - priceA;
      });
    }
    if (sortBy === "rating") {
      return list.sort(
        (a, b) =>
          (b.average_rating || b.rating || 0) -
          (a.average_rating || a.rating || 0),
      );
    }
    if (sortBy === "popular") {
      return list.sort((a, b) => {
        const studentsA =
          typeof a.enrolled_students === "string"
            ? parseInt(a.enrolled_students.replace(/[^0-9]/g, ""))
            : a.enrolled_students;
        const studentsB =
          typeof b.enrolled_students === "string"
            ? parseInt(b.enrolled_students.replace(/[^0-9]/g, ""))
            : b.enrolled_students;
        return (studentsB || 0) - (studentsA || 0);
      });
    }
    return list;
  }, [filteredCourses, sortBy]);

  // 3. Pagination Logic
  const totalPages = Math.ceil(sortedCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCourses = sortedCourses.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleLevel = (level) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setPriceRange({ min: "", max: "" });
    setSelectedRating(null);
    setSelectedLevels([]);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          {/* Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0 space-y-8 self-start sticky top-24 pr-4">
            {/* Price Filter */}
            <div>
              <h3 className="font-bold text-gray-900 mb-5 text-sm uppercase tracking-wider border-l-4 border-teal-600 pl-3">
                Course Price
              </h3>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full p-3 bg-gray-50 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all placeholder-gray-400"
                  value={priceRange.min}
                  onChange={(e) => {
                    setPriceRange({ ...priceRange, min: e.target.value });
                    setCurrentPage(1);
                  }}
                />
                <span className="text-gray-300 font-light">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full p-3 bg-gray-50 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all placeholder-gray-400"
                  value={priceRange.max}
                  onChange={(e) => {
                    setPriceRange({ ...priceRange, max: e.target.value });
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="font-bold text-gray-900 mb-5 text-sm uppercase tracking-wider border-l-4 border-teal-600 pl-3">
                Minimum Rating
              </h3>
              <div className="space-y-3">
                {[4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => {
                      setSelectedRating(
                        selectedRating === rating ? null : rating,
                      );
                      setCurrentPage(1);
                    }}
                    className="flex items-center gap-3 w-full group hover:bg-teal-50 p-2 rounded-xl transition-all -ml-2">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        selectedRating === rating
                          ? "bg-teal-600 border-teal-600"
                          : "border-gray-300 group-hover:border-teal-400"
                      }`}>
                      {selectedRating === rating && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < rating ? "currentColor" : "none"}
                          className={
                            i < rating ? "text-yellow-400" : "text-gray-200"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-teal-700 font-medium">
                      & Up
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Level Filter */}
            <div>
              <h3 className="font-bold text-gray-900 mb-5 text-sm uppercase tracking-wider border-l-4 border-teal-600 pl-3">
                Difficulty Level
              </h3>
              <div className="space-y-3">
                {levels.map((level) => (
                  <label
                    key={level}
                    className="flex items-center gap-3 cursor-pointer group">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        selectedLevels.includes(level)
                          ? "bg-teal-600 border-teal-600"
                          : "border-gray-300 group-hover:border-teal-400"
                      }`}>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedLevels.includes(level)}
                        onChange={() => toggleLevel(level)}
                      />
                      {selectedLevels.includes(level) && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                      {level}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Header */}
            <div className="mb-10 pl-4 lg:pl-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold mb-4">
                EXPLORE MASTERCLASSES
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
                {title}
              </h1>
              <p className="text-gray-500 text-lg max-w-2xl font-medium">
                {description}
              </p>
            </div>

            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-6 border-b border-gray-100 pl-4 lg:pl-0 pr-4 lg:pr-0">
              <span className="text-gray-500 font-medium">
                Showing{" "}
                <span className="text-black font-bold">
                  {sortedCourses.length}
                </span>{" "}
                master-led courses
              </span>

              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <span className="text-sm text-gray-400 font-medium">
                  Sort by:
                </span>
                <div className="relative group">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-gray-50 pl-4 pr-10 py-2.5 rounded-full text-sm font-semibold text-gray-900 border-none focus:ring-2 focus:ring-teal-500 cursor-pointer hover:bg-gray-100 transition-colors">
                    <option value="newest">Newest Arrivals</option>
                    <option value="popular">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            {currentCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                {currentCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    teacherId={course.teacherId || 1}
                    teacherName={course.teacher_name || "Verified Guru"}
                  />
                ))}
              </div>
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-24">
                <div className="text-center py-24">
                  <h3 className="text-gray-900 font-bold text-xl mb-2">
                    No courses match your filters
                  </h3>
                  <p className="text-gray-500 mb-8">
                    Try clearing your filters to discover more cultural
                    masterclasses.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-8 py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-all font-semibold shadow-md">
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-full hover:border-teal-600 hover:text-teal-600 transition-all disabled:opacity-30">
                  <ChevronLeft size={20} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-12 h-12 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                        currentPage === page
                          ? "bg-teal-600 text-white shadow-lg shadow-teal-100 scale-110"
                          : "bg-white text-gray-600 hover:bg-teal-50 border border-transparent"
                      }`}>
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-full hover:border-teal-600 hover:text-teal-600 transition-all disabled:opacity-30">
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CourseCategoryPageLayout;
