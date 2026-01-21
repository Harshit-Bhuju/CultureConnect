import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Header from "../../../components/ManageCourses/Layout_And_Components/Header";
import StatsCards from "../../../components/ManageCourses/Layout_And_Components/StatsCards";
import Filters from "../../../components/ManageCourses/Filter/Filters";
import CourseGrid from "../../../components/ManageCourses/CourseDisplay/CourseGrid";
import CourseList from "../../../components/ManageCourses/CourseDisplay/CourseList";
import DeleteCourseModal from "../../../components/ManageCourses/Modals/DeleteCourseModal";
import useTeacherCourses from "../../../hooks/useTeacherCourses";
import {
  categories,
  sortOptions,
} from "../../../components/ManageCourses/Data/data";

const CourseManagement = () => {
  const navigate = useNavigate();
  const { teacherId } = useParams();
  const { user } = useAuth();

  const { courses, stats, loading, error, setCourses } =
    useTeacherCourses(teacherId);

  const [viewMode, setViewMode] = useState("grid"); // Default to grid to match ProductManagement
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [sortOption, setSortOption] = useState("Latest");
  const [stockFilter, setStockFilter] = useState("All Status"); // Using stockFilter name to match Filters.jsx, but it maps to status options
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Derived filters
  const stockOptions = [
    // Mapped to status for courses
    "All Status",
    "Active",
    "Draft",
    "Under Review",
    "Rejected",
  ];

  const filteredCourses = courses
    .filter((course) => {
      const matchesSearch = (course.title || course.courseTitle)
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "All Categories" ||
        course.category === categoryFilter;
      const matchesStatus =
        stockFilter === "All Status"
          ? course.status !== "Draft" && course.status !== "draft" // Check lowercase too just in case
          : course.status === stockFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOption === "Latest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOption === "Oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortOption === "Recently Updated") {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
      return 0;
    });

  const handleDeleteCourse = async () => {
    // Mock delete for now, connect to API later
    if (!selectedCourse) return;
    console.log("Deleting course", selectedCourse.id);

    // Simulate delete
    setCourses((prev) => prev.filter((c) => c.id !== selectedCourse.id));
    setShowDeleteModal(false);
    setSelectedCourse(null);
  };

  const handleViewCourse = (course) => {
    navigate(`/courses/${teacherId}/${course.id}`);
  };

  const handleNavigateToEdit = (course) => {
    navigate(`/teacher/classes/edit/${teacherId}/${course.id}`);
  };

  const openDeleteModal = (course) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="px-8 py-6 max-w-7xl mx-auto">
        <StatsCards
          totalCourses={stats.totalCourses}
          activeCourses={stats.activeCourses}
          draftCourses={stats.draftCourses || 0} // Ensure this prop exists in hook or mock
          totalRevenue={stats.totalRevenue || 0} // Ensure this prop exists
        />

        <Filters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          sortOption={sortOption}
          setSortOption={setSortOption}
          stockFilter={stockFilter} // Passing status options as stock filter
          setStockFilter={setStockFilter}
          categories={categories}
          sortOptions={sortOptions}
          stockOptions={stockOptions}
          filteredCount={filteredCourses.length}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {viewMode === "grid" ? (
          <CourseGrid
            courses={filteredCourses}
            onView={handleViewCourse}
            onEdit={handleNavigateToEdit}
            onDelete={openDeleteModal}
          />
        ) : (
          <CourseList
            courses={filteredCourses}
            onView={handleViewCourse}
            onEdit={handleNavigateToEdit}
            onDelete={openDeleteModal}
          />
        )}
      </div>

      {showDeleteModal && selectedCourse && (
        <DeleteCourseModal
          course={selectedCourse}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDeleteCourse}
        />
      )}
    </div>
  );
};

export default CourseManagement;
