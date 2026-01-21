import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import Loading from "../../../Common/Loading";
import API from "../../../../Configs/ApiEndpoints";

// Import components
import StudentCourseHeader from "./StudentCourseHeader";
import StudentVideoPreview from "./StudentVideoPreview";
import StudentCourseSidebar from "./StudentCourseSidebar";
import CourseContent from "../TeacherCourseDetailPage/CourseContent";

const StudentCourseDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { teacherId, id } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchCourseDetails();
    if (user) {
      checkEnrollmentStatus();
      checkWishlistStatus();
    }
  }, [id, user]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API.GET_COURSE_DETAILS}?course_id=${id}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (data.status === "success" && data.course) {
        const transformedCourse = {
          id: data.course.id,
          title: data.course.course_title,
          description: data.course.description,
          image: data.course.thumbnail,
          price: parseFloat(data.course.price) || 0,
          numVideos: parseInt(data.course.total_videos) || 0,
          duration: `${data.course.duration_weeks} weeks`,
          durationWeeks: parseInt(data.course.duration_weeks) || 0,
          hoursPerWeek: parseInt(data.course.hours_per_week) || 0,
          enrolled_students: parseInt(data.course.enrolled_students) || 0,
          max_students: parseInt(data.course.max_students) || 20,
          level: data.course.skill_level || "Beginner",
          language: data.course.language || "English",
          category: data.course.category || "Dance",
          subcategory: data.course.subcategory || "",
          averageRating: parseFloat(data.course.average_rating) || 0,
          totalReviews: parseInt(data.course.total_reviews) || 0,
          learningSchedule: data.course.learning_schedule || "",
          tags: (() => {
            if (!data.course.tags) return [];
            if (Array.isArray(data.course.tags)) return data.course.tags;
            if (typeof data.course.tags === "string") {
              try {
                const parsed = JSON.parse(data.course.tags);
                return Array.isArray(parsed) ? parsed : [];
              } catch (e) {
                return data.course.tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag.length > 0);
              }
            }
            return [];
          })(),
          teacher: data.teacher
            ? {
                id: data.teacher.id,
                name: data.teacher.name || "Unknown Teacher",
                profile_picture: data.teacher.profile_picture
                  ? `${API.TEACHER_PROFILE_PICTURES}/${data.teacher.profile_picture}`
                  : "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(data.teacher.name || "Teacher"),
                experience_years: parseInt(data.teacher.experience_years) || 0,
                bio: data.teacher.bio || "",
              }
            : null,
          videos: (data.videos || [])
            .map((video, index) => ({
              id: video.id,
              title: video.video_title || `Lesson ${index + 1}`,
              duration: video.duration || "0:00",
              description: video.description || "",
              thumbnail: video.thumbnail
                ? `${API.COURSE_THUMBNAILS}/${video.thumbnail}`
                : data.course.thumbnail
                  ? `${API.COURSE_THUMBNAILS}/${data.course.thumbnail}`
                  : "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
              order: parseInt(video.order_in_course) || index + 1,
              is_intro: video.is_intro || 0,
            }))
            .sort((a, b) => a.order - b.order),
          learningOutcomes: data.course.what_you_will_learn
            ? data.course.what_you_will_learn
                .split("\n")
                .filter((item) => item.trim())
            : [],
          requirements: data.course.requirements
            ? data.course.requirements.split("\n").filter((item) => item.trim())
            : [],
        };

        setCourse(transformedCourse);
      } else {
        toast.error(data.message || "Course not found");
        setCourse(null);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Failed to load course details");
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    try {
      const response = await fetch(`${API.CHECK_ENROLLMENT}?course_id=${id}`, {
        credentials: "include",
      });
      const data = await response.json();
      setIsEnrolled(data.is_enrolled || false);
    } catch (error) {
      console.error("Error checking enrollment:", error);
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch(
        `${API.CHECK_COURSE_WISHLIST}?course_id=${id}`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();
      setIsWishlisted(data.is_wishlisted || false);
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.error("Please login to enroll");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (course.price === 0) {
      try {
        const response = await fetch(API.ENROLL_COURSE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ course_id: id }),
        });
        const data = await response.json();

        if (data.status === "success") {
          toast.success("Successfully enrolled in free course! 🎉");
          setIsEnrolled(true);
          fetchCourseDetails();
        } else {
          toast.error(data.message || "Failed to enroll");
        }
      } catch (error) {
        console.error("Error enrolling:", error);
        toast.error("Failed to enroll");
      }
    } else {
      navigate(`/course/checkout/${teacherId}/${id}`);
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    try {
      const response = await fetch(API.ADD_TO_COURSE_WISHLIST, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          course_id: id,
          action: isWishlisted ? "remove" : "add",
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setIsWishlisted(!isWishlisted);
        toast.success(
          isWishlisted ? "Removed from wishlist" : "Added to wishlist ❤️",
        );
      } else {
        toast.error(data.message || "Failed to update wishlist");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Failed to update wishlist");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Course link copied to clipboard! 🔗");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleBack = () => {
    navigate(`/teacherprofile/${teacherId}`);
  };

  if (loading) {
    return <Loading message="Loading course details..." />;
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Back to Teacher Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition group">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Teacher Profile</span>
        </button>

        {/* Course Header */}
        <StudentCourseHeader course={course} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Preview */}
            <StudentVideoPreview course={course} isEnrolled={isEnrolled} />

            {/* Course Content Tabs */}
            <CourseContent
              course={course}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <StudentCourseSidebar
              course={course}
              isEnrolled={isEnrolled}
              isWishlisted={isWishlisted}
              handleEnroll={handleEnroll}
              handleWishlist={handleWishlist}
              handleShare={handleShare}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourseDetailPage;
