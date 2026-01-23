import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import Loading from "../../../Common/Loading";
import API from "../../../../Configs/ApiEndpoints";
// Import separate components
import CourseHeader from "./CourseHeader";
import CourseStats from "./CourseStats";
import VideoPlayer from "./VideoPlayer";
import CourseContent from "./CourseContent";
import CourseSidebar from "./CourseSidebar";

import useTeacherAnalytics from "../../../../hooks/useTeacherAnalytics";

const TeacherCourseDetailPage = () => {
  const navigate = useNavigate();
  const { teacherId, id } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

  // Fetch analytics data specifically for this course
  const { recentEnrollments, loading: analyticsLoading } = useTeacherAnalytics(
    "Until now",
    teacherId,
    id,
  );

  useEffect(() => {
    // Check authorization
    if (user?.teacher_id && user.teacher_id !== parseInt(teacherId)) {
      toast.error("Unauthorized access");
      navigate(`/teacher/manageclasses/${user.teacher_id}`);
      return;
    }

    if (!user?.teacher_id) {
      toast.error("No teacher account found");
      navigate("/teacher-registration");
      return;
    }

    fetchCourseDetails();
  }, [id, teacherId, user, navigate]);

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
        // Transform PHP data to match component structure
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
          max_students: parseInt(data.course.max_students) || 20,
          enrolled_students: parseInt(data.course.enrolled_students) || 0,
          level: data.course.skill_level || "Beginner",
          language: data.course.language || "English",
          category: data.course.category || "Dance",
          subcategory: data.course.subcategory || "",
          status: data.course.status === "published" ? "Active" : "Draft",
          totalRevenue: parseFloat(data.course.total_revenue) || 0,
          averageRating: parseFloat(data.course.average_rating) || 0,
          totalReviews: parseInt(data.course.total_reviews) || 0,
          completionRate: parseInt(data.course.completion_rate) || 0,
          createdAt: data.course.created_at,
          tags: (() => {
            // Handle tags - can be JSON array or comma-separated string
            if (!data.course.tags) return [];

            // If it's already an array from API, use it
            if (Array.isArray(data.course.tags)) {
              return data.course.tags;
            }

            // If it's a string, try to parse as JSON first
            if (typeof data.course.tags === "string") {
              try {
                const parsed = JSON.parse(data.course.tags);
                return Array.isArray(parsed) ? parsed : [];
              } catch (e) {
                // If JSON parse fails, treat as comma-separated string
                return data.course.tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag.length > 0);
              }
            }

            return [];
          })(),
          learningSchedule: data.course.learning_schedule || "",
          videos: (data.videos || [])
            .map((video, index) => ({
              id: video.id,
              title: video.video_title || `Lesson ${index + 1}`,
              duration: video.duration || "0:00",
              description: video.description || "",
              videoUrl: video.video_filename
                ? `${API.COURSE_VIDEOS}/${video.video_filename}`
                : null,
              thumbnail: video.thumbnail
                ? `${API.COURSE_THUMBNAILS}/${video.thumbnail}`
                : data.course.thumbnail
                  ? `${API.COURSE_THUMBNAILS}/${data.course.thumbnail}`
                  : "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
              order: parseInt(video.order_in_course) || index + 1,
              views: parseInt(video.views) || 0,
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
          reviews: data.reviews || [],
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

  const handleShare = async () => {
    const url = `${window.location.origin}/courses/${teacherId}/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Course link copied to clipboard! 🔗");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handlePublish = async () => {
    try {
      const response = await fetch(API.UPDATE_COURSE_STATUS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          course_id: id,
          status: "published",
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Course published successfully! ✅");
        setCourse({ ...course, status: "Active" });
        fetchCourseDetails();
      } else {
        toast.error(data.message || "Failed to publish course");
      }
    } catch (error) {
      console.error("Error publishing course:", error);
      toast.error("Failed to publish course");
    }
  };

  const handleDraft = async () => {
    try {
      const response = await fetch(API.UPDATE_COURSE_STATUS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          course_id: id,
          status: "draft",
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Course moved to drafts! 📝");
        setCourse({ ...course, status: "Draft" });
        fetchCourseDetails();
      } else {
        toast.error(data.message || "Failed to move to draft");
      }
    } catch (error) {
      console.error("Error updating course status:", error);
      toast.error("Failed to update course status");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Course not found
          </h2>
          <p className="text-gray-600 mb-4">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition group">
          <ArrowLeft className="w-5 h-5" />
          Back to Courses
        </button>

        {/* Course Header */}
        <CourseHeader course={course} />

        {/* Course Stats */}
        <CourseStats course={course} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <VideoPlayer
              course={course}
              selectedVideoIndex={selectedVideoIndex}
              setSelectedVideoIndex={setSelectedVideoIndex}
            />

            {/* Course Content Tabs */}
            <CourseContent
              course={course}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              user={user}
              teacherId={teacherId}
              enrollments={recentEnrollments}
              enrollmentsLoading={analyticsLoading}
              onRefresh={fetchCourseDetails}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CourseSidebar
              course={course}
              teacherId={teacherId}
              handleShare={handleShare}
              handlePublish={handlePublish}
              handleDraft={handleDraft}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCourseDetailPage;
