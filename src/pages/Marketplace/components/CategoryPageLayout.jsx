import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
} from "lucide-react";
import Card from "../../../components/cardLayout/Card";

const CategoryPageLayout = ({ title, description, products }) => {
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Filters State
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);

  // Filter Options
  const conditions = ["New", "Like New", "Used - Good", "Vintage"];
  const availability = ["In Stock", "Made to Order"];

  // 1. Filter Logic - NOW FULLY FUNCTIONAL
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Price Filter
      const min = priceRange.min ? parseFloat(priceRange.min) : 0;
      const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
      if (product.price < min || product.price > max) return false;

      // Rating Filter
      if (selectedRating && product.rating < selectedRating) return false;

      // Condition Filter - Now properly implemented
      if (selectedConditions.length > 0) {
        if (
          !product.condition ||
          !selectedConditions.includes(product.condition)
        ) {
          return false;
        }
      }

      // Availability Filter - Now properly implemented
      if (selectedAvailability.length > 0) {
        if (
          !product.availability ||
          !selectedAvailability.includes(product.availability)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    products,
    priceRange,
    selectedRating,
    selectedConditions,
    selectedAvailability,
  ]);

  // 2. Sort Logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === "price-low") return list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") return list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") return list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [filteredProducts, sortBy]);

  // 3. Pagination Logic
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = sortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleCondition = (condition) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition],
    );
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const toggleAvailability = (item) => {
    setSelectedAvailability((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item],
    );
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const clearAllFilters = () => {
    setPriceRange({ min: "", max: "" });
    setSelectedRating(null);
    setSelectedConditions([]);
    setSelectedAvailability([]);
    setCurrentPage(1);
  };

  return (
    <div className="bg-gray-100">
      <div className="max-w-[1440px] mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar - Refined & Aesthetic */}
          <aside className="hidden lg:block w-72 flex-shrink-0 space-y-8 self-start sticky top-24 pr-4">
            {/* Price Filter */}
            <div>
              <h3 className="font-bold text-gray-900 mb-5 text-sm uppercase tracking-wider border-l-4 border-red-600 pl-3">
                Price Range
              </h3>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full p-3 bg-gray-50 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-none transition-all placeholder-gray-400"
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
                  className="w-full p-3 bg-gray-50 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-none transition-all placeholder-gray-400"
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
              <h3 className="font-bold text-gray-900 mb-5 text-sm uppercase tracking-wider border-l-4 border-red-600 pl-3">
                Customer Rating
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
                    className="flex items-center gap-3 w-full group hover:bg-red-50 p-2 rounded-lg transition-all -ml-2">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        selectedRating === rating
                          ? "bg-red-600 border-red-600"
                          : "border-gray-300 group-hover:border-red-400"
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
                            i < rating
                              ? "text-yellow-400 drop-shadow-sm"
                              : "text-gray-200"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-red-700 font-medium">
                      & Up
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Condition Filter */}
            <div>
              <h3 className="font-bold text-gray-900 mb-5 text-sm uppercase tracking-wider border-l-4 border-red-600 pl-3">
                Condition
              </h3>
              <div className="space-y-3">
                {conditions.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-3 cursor-pointer group">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        selectedConditions.includes(item)
                          ? "bg-red-600 border-red-600"
                          : "border-gray-300 group-hover:border-red-400"
                      }`}>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedConditions.includes(item)}
                        onChange={() => toggleCondition(item)}
                      />
                      {selectedConditions.includes(item) && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability Filter - NOW ADDED */}
            <div>
              <h3 className="font-bold text-gray-900 mb-5 text-sm uppercase tracking-wider border-l-4 border-red-600 pl-3">
                Availability
              </h3>
              <div className="space-y-3">
                {availability.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-3 cursor-pointer group">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        selectedAvailability.includes(item)
                          ? "bg-red-600 border-red-600"
                          : "border-gray-300 group-hover:border-red-400"
                      }`}>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedAvailability.includes(item)}
                        onChange={() => toggleAvailability(item)}
                      />
                      {selectedAvailability.includes(item) && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Category Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
              <p className="text-gray-500">{description}</p>
            </div>

            {/* Top Bar - Clean & Modern */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-6 border-b border-gray-100">
              <span className="text-gray-500 font-medium tracking-wide">
                Showing{" "}
                <span className="text-black font-bold">
                  {sortedProducts.length}
                </span>{" "}
                {sortedProducts.length === 1 ? "result" : "results"}
              </span>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400 font-medium">
                  Sort by:
                </span>
                <div className="relative group">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-gray-50 pl-4 pr-10 py-2.5 rounded-full text-sm font-semibold text-gray-900 border-none focus:ring-2 focus:ring-black cursor-pointer hover:bg-gray-100 transition-colors">
                    <option value="newest">Newest Arrivals</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Best Rating</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {currentProducts.length > 0 ? (
              <div className="grid grid-cols-4 min-[540px]:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-4">
                {currentProducts.map((product) => (
                  <div key={product.id} className="group">
                    <Card product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32">
                <h3 className="text-gray-900 font-medium text-xl mb-2">
                  No matching products
                </h3>
                <p className="text-gray-500 mb-8">
                  Adjust your filters to discover more cultural treasures.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-8 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-shadow shadow-lg shadow-red-200 font-medium">
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination - Red Theme */}
            {totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-3">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-full hover:border-red-600 hover:text-red-600 transition-all disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-400">
                  <ChevronLeft size={20} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-11 h-11 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                        currentPage === page
                          ? "bg-red-600 text-white shadow-md shadow-red-200 scale-110"
                          : "bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                      }`}>
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-full hover:border-red-600 hover:text-red-600 transition-all disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-400">
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

export default CategoryPageLayout;
