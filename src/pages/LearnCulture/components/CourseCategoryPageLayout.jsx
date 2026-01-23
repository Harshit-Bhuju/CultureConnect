import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
  Loader2,
} from "lucide-react";
import CourseCard from "../../../components/cardlayout/CourseCard";
import API from "../../../Configs/ApiEndpoints";

const CourseCategoryPageLayout = ({ category, title, description }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Filters State
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [priceInput, setPriceInput] = useState({ min: "", max: "" });
  const [priceError, setPriceError] = useState("");
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("all");

  // Pagination from API
  const [pagination, setPagination] = useState({
    total_items: 0,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  });

  const levelOptions = [
    { value: "all", label: "All Levels" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          category: category,
          sort: sortBy,
          page: currentPage,
          per_page: itemsPerPage,
        });

        if (priceRange.min) params.append("min_price", priceRange.min);
        if (priceRange.max) params.append("max_price", priceRange.max);
        if (selectedRatings.length > 0)
          params.append("ratings", selectedRatings.join(","));
        if (selectedLevel !== "all") params.append("level", selectedLevel);

        const response = await fetch(
          `${API.GET_CATEGORY_COURSES}?${params.toString()}`,
          { credentials: "include" },
        );
        const data = await response.json();

        if (data.success) {
          setCourses(data.courses);
          setPagination(data.pagination);
        } else {
          setError(data.error || "Failed to load courses");
        }
      } catch (err) {
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchCourses();
  }, [
    category,
    sortBy,
    currentPage,
    priceRange,
    selectedRatings,
    selectedLevel,
    itemsPerPage,
  ]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [priceRange, selectedRatings, selectedLevel, sortBy]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.total_pages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const clearAllFilters = () => {
    setPriceRange({ min: "", max: "" });
    setPriceInput({ min: "", max: "" });
    setPriceError("");
    setSelectedRatings([]);
    setSelectedLevel("all");
    setCurrentPage(1);
  };

  const applyPriceFilter = () => {
    const minVal = priceInput.min ? parseFloat(priceInput.min) : null;
    const maxVal = priceInput.max ? parseFloat(priceInput.max) : null;

    // Validation: only min provided without max
    if (minVal !== null && maxVal === null) {
      setPriceError("Please enter a maximum price");
      return;
    }

    // Validation: max < min
    if (minVal !== null && maxVal !== null && maxVal < minVal) {
      setPriceError("Maximum price cannot be less than minimum");
      return;
    }

    // Clear error
    setPriceError("");

    // If only max provided, auto-set min to 0
    if (minVal === null && maxVal !== null) {
      setPriceInput({ min: "0", max: priceInput.max });
      setPriceRange({ min: "0", max: priceInput.max });
    } else {
      setPriceRange({ ...priceInput });
    }
  };

  const handlePriceKeyDown = (e) => {
    if (e.key === "Enter") {
      applyPriceFilter();
    }
  };

  const toggleRating = (rating) => {
    setSelectedRatings((prev) => {
      const isSelected = prev.includes(rating);
      let newRatings;
      if (isSelected) {
        newRatings = prev.filter((r) => r !== rating);
      } else {
        newRatings = [...prev, rating];
      }

      // If any ratings are selected, automatically sort by rating
      if (newRatings.length > 0) {
        setSortBy("rating");
      }

      return newRatings;
    });
  };

  if (initialLoading) {
    return (
      <div className="bg-white min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1440px] mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0 space-y-8 self-start sticky top-24 pr-4">
            {/* Level Filter */}
            <div>
              <h3 className="font-bold text-gray-900 mb-5 text-sm uppercase tracking-wider border-l-4 border-teal-600 pl-3">
                Experience Level
              </h3>
              <div className="flex flex-wrap gap-2">
                {levelOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedLevel(option.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedLevel === option.value
                        ? "bg-teal-600 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-teal-50 hover:text-teal-600 border border-gray-200"
                    }`}>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="font-bold text-gray-900 mb-5 text-sm uppercase tracking-wider border-l-4 border-teal-600 pl-3">
                Course Price
              </h3>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  step="100"
                  min="0"
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  value={priceInput.min}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || parseFloat(val) >= 0) {
                      setPriceInput({ ...priceInput, min: val });
                      setPriceError("");
                    }
                  }}
                  onKeyDown={handlePriceKeyDown}
                />
                <span className="text-gray-400 font-light">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  step="100"
                  min="0"
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  value={priceInput.max}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || parseFloat(val) >= 0) {
                      setPriceInput({ ...priceInput, max: val });
                      setPriceError("");
                    }
                  }}
                  onKeyDown={handlePriceKeyDown}
                />
              </div>
              {priceError && (
                <p className="text-xs text-red-500 mt-2">{priceError}</p>
              )}
              <button
                onClick={applyPriceFilter}
                className="mt-3 w-full py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">
                Apply Price
              </button>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="font-bold text-gray-900 mb-5 text-sm uppercase tracking-wider border-l-4 border-teal-600 pl-3">
                Course Rating
              </h3>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center gap-3 w-full group hover:bg-teal-50 p-2 rounded-xl transition-all -ml-2 cursor-pointer">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={selectedRatings.includes(rating)}
                        onChange={() => toggleRating(rating)}
                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded checked:bg-teal-600 checked:border-teal-600 transition-all cursor-pointer"
                      />
                      <Check
                        size={12}
                        className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                      />
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
                    <span className="text-sm text-gray-600 group-hover:text-teal-700 font-medium ml-auto">
                      {rating} Star{rating > 1 ? "s" : ""}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold mb-4">
                EXPLORE TRADITIONS
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                {title}
              </h1>
              <p className="text-gray-500 text-lg max-w-2xl">{description}</p>
            </div>

            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-6 border-b border-gray-100">
              <span className="text-gray-500 font-medium tracking-wide">
                Showing{" "}
                <span className="text-black font-bold">
                  {pagination.total_items}
                </span>{" "}
                {pagination.total_items === 1 ? "course" : "courses"}
              </span>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400 font-medium">
                  Sort by:
                </span>
                <div className="relative group">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-100 pl-4 pr-10 py-2.5 rounded-full text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-teal-500 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
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
            <div className="relative min-h-[400px]">
              {loading && !initialLoading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-xl">
                  <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
                </div>
              )}

              {error ? (
                <div className="text-center py-20">
                  <p className="text-red-600 mb-4 font-medium">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-all">
                    Retry
                  </button>
                </div>
              ) : courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      teacherId={course.teacherId}
                      teacherName={course.teacher_name}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-32">
                  <h3 className="text-gray-900 font-bold text-xl mb-2">
                    No matching courses
                  </h3>
                  <p className="text-gray-500 mb-8">
                    Try adjusting your filters to find your perfect masterclass.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-8 py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-shadow shadow-lg shadow-teal-100 font-semibold">
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-3">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.has_prev}
                  className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-full hover:border-teal-600 hover:text-teal-600 transition-all disabled:opacity-30">
                  <ChevronLeft size={20} />
                </button>

                {Array.from(
                  { length: pagination.total_pages },
                  (_, i) => i + 1,
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-11 h-11 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                      currentPage === page
                        ? "bg-teal-600 text-white shadow-lg shadow-teal-100 scale-110"
                        : "bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                    }`}>
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.has_next}
                  className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-full hover:border-teal-600 hover:text-teal-600 transition-all disabled:opacity-30">
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
