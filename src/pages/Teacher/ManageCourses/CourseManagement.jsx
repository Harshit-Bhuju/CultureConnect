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
import API from "../../../Configs/ApiEndpoints";
import { toast } from "react-hot-toast";
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
  const [stockFilter, setStockFilter] = useState("Published"); // Hardcoded to Published for this view
  const [priceFilter, setPriceFilter] = useState("All pricing");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const priceOptions = ["All pricing", "Paid", "Free"];


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
          ? true
          : course.status.toLowerCase() === stockFilter.toLowerCase();

      const matchesPrice =
        priceFilter === "All pricing"
          ? true
          : priceFilter === "Paid"
            ? course.price > 0
            : course.price === 0;

      return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
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
    if (!selectedCourse) return;

    try {
      const response = await fetch(
        `${API.DELETE_COURSE}?course_id=${selectedCourse.id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Course deleted successfully");
        setCourses((prev) => prev.filter((c) => c.id !== selectedCourse.id));
      } else {
        toast.error(data.message || "Failed to delete course");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting");
    } finally {
      setShowDeleteModal(false);
      setSelectedCourse(null);
    }
  };

  const handleViewCourse = (course) => {
    navigate(`/courses/${teacherId}/${course.id}`);
  };

  const handleNavigateToEdit = (course) => {
    navigate(`/teacher/courses/edit/${teacherId}/${course.id}`);
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
          stockFilter={null}
          setStockFilter={null}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          categories={categories}
          sortOptions={sortOptions}
          stockOptions={null} // Remove options to hide dropdown
          priceOptions={priceOptions}
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
