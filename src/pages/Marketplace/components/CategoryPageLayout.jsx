import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
  Loader2,
} from "lucide-react";
import Card from "../../../components/cardLayout/Card";
import API from "../../../Configs/ApiEndpoints";

const CategoryPageLayout = ({ category, title, description, showAudienceFilter = false }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Filters State
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [priceInput, setPriceInput] = useState({ min: "", max: "" }); // Local state for typing
  const [priceError, setPriceError] = useState(""); // Validation error
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedAudience, setSelectedAudience] = useState(null); // null means "All"

  // Pagination from API
  const [pagination, setPagination] = useState({
    total_items: 0,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  });

  // Audience options for cultural-clothes
  const audienceOptions = [
    { value: null, label: "All" },
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
    { value: "boy", label: "Boys" },
    { value: "girl", label: "Girls" },
  ];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
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
        if (selectedRating) params.append("min_rating", selectedRating);
        if (selectedAudience) params.append("audience", selectedAudience);

        const response = await fetch(
          `${API.GET_CATEGORY_PRODUCTS}?${params.toString()}`,
          { credentials: "include" }
        );
        const data = await response.json();

        if (data.success) {
          setProducts(data.products);
          setPagination(data.pagination);
        } else {
          setError(data.error || "Failed to load products");
        }
      } catch (err) {
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, sortBy, currentPage, priceRange, selectedRating, selectedAudience, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [priceRange, selectedRating, selectedAudience, sortBy]);

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
    setSelectedRating(null);
    setSelectedAudience(null);
    setCurrentPage(1);
  };

  // Apply price filter with validation
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

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-red-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100">
      <div className="max-w-[1440px] mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar - Refined & Aesthetic */}
          <aside className="hidden lg:block w-72 flex-shrink-0 space-y-8 self-start sticky top-24 pr-4">
            {/* Audience Filter - Only for cultural-clothes */}
            {showAudienceFilter && (
              <div>
                <h3 className="font-bold text-gray-900 mb-5 text-sm uppercase tracking-wider border-l-4 border-red-600 pl-3">
                  Shop For
                </h3>
                <div className="flex flex-wrap gap-2">
                  {audienceOptions.map((option) => (
                    <button
                      key={option.value || "all"}
                      onClick={() => setSelectedAudience(option.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedAudience === option.value
                        ? "bg-red-600 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200"
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Filter */}
            <div>
              <h3 className="font-bold text-gray-900 mb-5 text-sm uppercase tracking-wider border-l-4 border-red-600 pl-3">
                Price Range
              </h3>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  step="100"
                  min="0"
                  className="w-full p-3 bg-gray-50 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-none transition-all placeholder-gray-400"
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
                <span className="text-gray-300 font-light">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  step="100"
                  min="0"
                  className="w-full p-3 bg-gray-50 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-none transition-all placeholder-gray-400"
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
                className="mt-3 w-full py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Apply Price
              </button>
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
                        selectedRating === rating ? null : rating
                      );
                    }}
                    className="flex items-center gap-3 w-full group hover:bg-red-50 p-2 rounded-lg transition-all -ml-2"
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedRating === rating
                        ? "bg-red-600 border-red-600"
                        : "border-gray-300 group-hover:border-red-400"
                        }`}
                    >
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
                  {pagination.total_items}
                </span>{" "}
                {pagination.total_items === 1 ? "result" : "results"}
              </span>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400 font-medium">
                  Sort by:
                </span>
                <div className="relative group">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-gray-50 pl-4 pr-10 py-2.5 rounded-full text-sm font-semibold text-gray-900 border-none focus:ring-2 focus:ring-black cursor-pointer hover:bg-gray-100 transition-colors"
                  >
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
            {products.length > 0 ? (
              <div className="grid grid-cols-4 min-[540px]:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-4">
                {products.map((product) => (
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
                  className="px-8 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-shadow shadow-lg shadow-red-200 font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination - Red Theme */}
            {pagination.total_pages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-3">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.has_prev}
                  className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-full hover:border-red-600 hover:text-red-600 transition-all disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-400"
                >
                  <ChevronLeft size={20} />
                </button>

                {Array.from(
                  { length: pagination.total_pages },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-11 h-11 flex items-center justify-center rounded-full text-sm font-bold transition-all ${currentPage === page
                      ? "bg-red-600 text-white shadow-md shadow-red-200 scale-110"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.has_next}
                  className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-full hover:border-red-600 hover:text-red-600 transition-all disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-400"
                >
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
