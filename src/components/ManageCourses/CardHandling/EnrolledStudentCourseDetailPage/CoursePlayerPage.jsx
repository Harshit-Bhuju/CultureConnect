import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../../../Configs/ApiEndpoints";
import Loading from "../../../Common/Loading";

// Import components
import CoursePlayerHeader from "./CoursePlayerHeader";
import VideoPlayerSection from "./VideoPlayerSection";
import LessonTabsSection from "./LessonTabsSection";
import LessonNavigation from "./LessonNavigation";
import ProgressStatsCard from "./ProgressStatsCard";
import CurriculumSidebar from "./CurriculumSidebar";
import CourseReviewForm from "../Reviews/CourseReviewForm";
import DeleteReviewModal from "../Reviews/DeleteReviewModal";
import { useAuth } from "../../../../context/AuthContext";

export default function CoursePlayerPage() {
  const { teacherId, id: courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [videoProgress, setVideoProgress] = useState({}); // Map of videoId -> timestamp
  const [activeTab, setActiveTab] = useState("description");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { user } = useAuth();

  // Review states (Only for new reviews)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    checkEnrollment();
  }, [courseId]);

  useEffect(() => {
    if (isEnrolled) {
      fetchCourseData();
    }
  }, [courseId, isEnrolled]);

  const checkEnrollment = async () => {
    try {
      const response = await fetch(
        `${API.CHECK_ENROLLMENT}?course_id=${courseId}`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();

      if (data.is_enrolled || data.isEnrolled) {
        setIsEnrolled(true);
      } else {
        toast.error("You are not enrolled in this course");
        navigate(`/courses/${teacherId}/${courseId}`);
      }
    } catch (error) {
      console.error("Error checking enrollment:", error);
      toast.error("Failed to verify enrollment");
      navigate(`/courses/${teacherId}/${courseId}`);
    }
  };

  // Fetch course data and progress
  const fetchCourseData = async () => {
    try {
      setLoading(true);

      // Parallel fetch for course details and progress
      const [courseRes, progressRes] = await Promise.all([
        fetch(`${API.GET_COURSE_DETAILS}?course_id=${courseId}`, {
          credentials: "include",
        }),
        fetch(`${API.GET_STUDENT_PROGRESS}?course_id=${courseId}`, {
          credentials: "include",
        }),
      ]);

      const courseData = await courseRes.json();
      const progressData = await progressRes.json();

      if (courseData.status === "success" && courseData.course) {
        // Transform course data
        const transformedCourse = {
          ...courseData.course,
          videos: (courseData.videos || [])
            .map((video) => ({
              id: video.id,
              video_title: video.video_title,
              description: video.description || video.video_description || "",
              duration: video.duration,
              thumbnail: video.thumbnail,
              video_filename: video.video_filename,
              order_in_course: video.order_in_course || 0,
            }))
            .sort((a, b) => a.order_in_course - b.order_in_course),
          // Add extra fields needed for tabs
          learningOutcomes: courseData.course.what_you_will_learn
            ? courseData.course.what_you_will_learn
              .split("\n")
              .filter((item) => item.trim())
            : [],
          requirements: courseData.course.requirements
            ? courseData.course.requirements
              .split("\n")
              .filter((item) => item.trim())
            : [],
          learningSchedule: courseData.course.learning_schedule || "",
          hoursPerWeek: parseInt(courseData.course.hours_per_week) || 0,
          durationWeeks: parseInt(courseData.course.duration_weeks) || 0,
          numVideos: parseInt(courseData.course.total_videos) || 0,
          level: courseData.course.skill_level || "Beginner",
          language: courseData.course.language || "English",
          averageRating: parseFloat(courseData.course.average_rating) || 0,
          totalReviews: parseInt(courseData.course.total_reviews) || 0,
          reviews: courseData.reviews || [],
        };

        setCourse(transformedCourse);

        // Set completed videos and progress
        if (progressData.status === "success") {
          setCompletedVideos(progressData.completed_videos || []);

          const progressMap = {};
          if (progressData.progress_data) {
            progressData.progress_data.forEach((p) => {
              progressMap[p.video_id] = p.timestamp;
            });
          }
          setVideoProgress(progressMap);
        }

        // Find first video to play
        if (transformedCourse.videos.length > 0) {
          setActiveVideo(transformedCourse.videos[0]);
        }
      } else {
        toast.error("Course access denied or not found");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Failed to load learning environment");
    } finally {
      setLoading(false);
    }
  };

  const toggleVideoCompletion = async (videoId) => {
    const isCompleted = !completedVideos.includes(videoId);

    // Optimistic update
    setCompletedVideos((prev) =>
      isCompleted ? [...prev, videoId] : prev.filter((id) => id !== videoId),
    );

    try {
      await fetch(API.MARK_VIDEO_COMPLETED, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          course_id: courseId,
          video_id: videoId,
          completed: isCompleted,
        }),
      });
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Failed to save progress");
      // Revert on error
      setCompletedVideos((prev) =>
        isCompleted ? prev.filter((id) => id !== videoId) : [...prev, videoId],
      );
    }
  };

  const calculateProgress = () => {
    if (!course || !course.total_videos) return 0;
    const progress = (completedVideos.length / course.total_videos) * 100;
    return Math.round(progress);
  };

  const handleVideoSelect = (video) => {
    setActiveVideo(video);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousLesson = () => {
    const currentVideos = course.videos || [];
    const currentIndex = currentVideos.findIndex(
      (v) => v.id === activeVideo?.id,
    );
    if (currentIndex > 0) {
      setActiveVideo(currentVideos[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextLesson = () => {
    const currentVideos = course.videos || [];
    const currentIndex = currentVideos.findIndex(
      (v) => v.id === activeVideo?.id,
    );
    if (currentIndex < currentVideos.length - 1) {
      setActiveVideo(currentVideos[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const openReviewForm = () => {
    setReviewRating(0);
    setReviewText("");
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (reviewRating === 0 || reviewText.trim().length < 10) return;

    try {
      setIsSubmittingReview(true);
      const formData = new FormData();
      formData.append("course_id", courseId);
      formData.append("rating", reviewRating);
      formData.append("comment", reviewText.trim());

      const response = await fetch(API.SUBMIT_COURSE_REVIEW, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Review submitted!");
        setIsReviewModalOpen(false);
        fetchCourseData(); // Refresh to show new review
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Review submission error:", error);
      toast.error("An error occurred");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading || !isEnrolled)
    return <Loading message="Entering classroom..." />;
  if (!course) return null;

  const currentVideos = course.videos || [];
  const currentIndex = currentVideos.findIndex((v) => v.id === activeVideo?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      {/* Header */}
      <CoursePlayerHeader
        course={course}
        teacherId={teacherId}
        courseId={courseId}
        progress={calculateProgress()}
        completedVideos={completedVideos.length}
        totalVideos={course.total_videos}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Video & Tabs (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <VideoPlayerSection
              activeVideo={activeVideo}
              course={course}
              completedVideos={completedVideos}
              toggleVideoCompletion={toggleVideoCompletion}
              currentIndex={currentIndex}
              totalVideos={currentVideos.length}
              savedTimestamp={videoProgress[activeVideo?.id] || 0}
            />

            {/* Lesson Tabs */}
            <LessonTabsSection
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              activeVideo={{
                ...activeVideo,
                course: course,
                user: user,
                openReviewForm,
              }}
              onRefresh={fetchCourseData}
            />

            {/* Lesson Navigation */}
            <LessonNavigation
              currentIndex={currentIndex}
              totalVideos={currentVideos.length}
              onPrevious={handlePreviousLesson}
              onNext={handleNextLesson}
            />
          </div>

          {/* Right Column - Sidebar (1/3 width) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress Stats */}
            <ProgressStatsCard
              progress={calculateProgress()}
              completedVideos={completedVideos.length}
              totalVideos={course.total_videos}
            />

            {/* Course Curriculum */}
            <div className="lg:sticky lg:top-24">
              <CurriculumSidebar
                videos={currentVideos}
                activeVideo={activeVideo}
                completedVideos={completedVideos}
                onVideoSelect={handleVideoSelect}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Review Modals */}
      <CourseReviewForm
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        course={course}
        reviewRating={reviewRating}
        setReviewRating={setReviewRating}
        reviewText={reviewText}
        setReviewText={setReviewText}
        isSubmitting={isSubmittingReview}
        handleSubmitReview={handleSubmitReview}
      />
    </div>
  );
}
