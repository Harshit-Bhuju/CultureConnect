import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Edit,
  TrendingUp,
  DollarSign,
  Users,
  PlayCircle,
  Clock,
  Eye,
  Share2,
  BookOpen,
  CheckCircle,
  Star
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import Loading from "../../../components/Common/Loading";
import API from "../../../Configs/ApiEndpoints";


const TeacherCourseDetailPage = () => {
  const navigate = useNavigate();
  const { teacherId, id } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Check authorization
    if (user?.teacher_id && user.teacher_id !== parseInt(teacherId)) {
      toast.error('Unauthorized access');
      navigate(`/teacher/manageclasses/${user.teacher_id}`);
      return;
    }

    if (!user?.teacher_id) {
      toast.error('No teacher account found');
      navigate('/teacher-registration');
      return;
    }

    fetchCourseDetails();
  }, [id, teacherId, user, navigate]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API.GET_COURSE_DETAILS}?course_id=${id}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.status === 'success' && data.course) {
        // Transform PHP data to match component structure
        const transformedCourse = {
          id: data.course.id,
          title: data.course.course_title,
          description: data.course.description,
          image: data.course.thumbnail
            ? `${API.COURSE_THUMBNAILS}/${data.course.thumbnail}`
            : "https://i.ytimg.com/vi/EcvPBRM405k/maxresdefault.jpg",
          price: parseFloat(data.course.price) || 0,
          numVideos: parseInt(data.course.total_videos) || 0,
          duration: `${data.course.duration_weeks} weeks`,
          max_students: parseInt(data.course.max_students) || 20,
          enrolled_students: parseInt(data.course.enrolled_students) || 0,
          level: data.course.skill_level || 'Beginner',
          language: data.course.language || 'English',
          category: data.course.category || 'Dance',
          subcategory: data.course.subcategory || '',
          status: data.course.status === 'published' ? 'Active' : 'Draft',
          totalRevenue: parseFloat(data.course.total_revenue) || 0,
          averageRating: parseFloat(data.course.average_rating) || 0,
          totalReviews: parseInt(data.course.total_reviews) || 0,
          completionRate: parseInt(data.course.completion_rate) || 0,
          createdAt: data.course.created_at,
          videos: (data.videos || []).map((video, index) => ({
            id: video.id,
            title: video.video_title || `Lesson ${index + 1}`,
            duration: video.duration || "0:00",
            description: video.description || "",
            // ✅ FIXED: Use COURSE_THUMBNAILS for video thumbnails
            thumbnail: video.thumbnail
              ? `${API.COURSE_THUMBNAILS}/${video.thumbnail}`
              : data.course.thumbnail
                ? `${API.COURSE_THUMBNAILS}/${data.course.thumbnail}`
                : "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
            order: parseInt(video.order_in_course) || index + 1,
            views: parseInt(video.views) || 0,
            is_intro: video.is_intro || 0
          })).sort((a, b) => a.order - b.order),
          learningOutcomes: data.course.what_you_will_learn
            ? data.course.what_you_will_learn.split('\n').filter(item => item.trim())
            : [],
          requirements: data.course.requirements
            ? data.course.requirements.split('\n').filter(item => item.trim())
            : []
        };

        setCourse(transformedCourse);
      } else {
        toast.error(data.message || 'Course not found');
        setCourse(null);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course details');
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          course_id: id,
          status: 'published'
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        toast.success("Course published successfully! ✅");
        setCourse({ ...course, status: "Active" });
        fetchCourseDetails();
      } else {
        toast.error(data.message || 'Failed to publish course');
      }
    } catch (error) {
      console.error('Error publishing course:', error);
      toast.error('Failed to publish course');
    }
  };

  const handleDraft = async () => {
    try {
      const response = await fetch(API.UPDATE_COURSE_STATUS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          course_id: id,
          status: 'draft'
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        toast.success("Course moved to drafts! 📝");
        setCourse({ ...course, status: "Draft" });
        fetchCourseDetails();
      } else {
        toast.error(data.message || 'Failed to move to draft');
      }
    } catch (error) {
      console.error('Error updating course status:', error);
      toast.error('Failed to update course status');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <Loading message="Loading course details..." />;
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${course.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
                }`}>
                {course.status}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/teacher/courses/edit/${teacherId}/${id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Course</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Enrolled Students</p>
                <p className="text-2xl font-bold text-gray-900">{course.enrolled_students}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{course.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {course.averageRating > 0 ? course.averageRating.toFixed(1) : 'N/A'}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{course.completionRate}%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full capitalize">
                  {course.category}
                </span>
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full capitalize">
                  {course.level}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>

              {course.averageRating > 0 && (
                <div className="flex items-center gap-4">
                  {renderStars(Math.round(course.averageRating))}
                  <span className="text-sm text-gray-600">
                    {course.averageRating.toFixed(1)} ({course.totalReviews} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Course Image */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.target.src = "https://i.ytimg.com/vi/EcvPBRM405k/maxresdefault.jpg";
                }}
              />
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="flex gap-6 border-b px-6 overflow-x-auto">
                {["overview", "curriculum", "outcomes", "students", "performance"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 font-semibold capitalize border-b-2 transition whitespace-nowrap ${activeTab === tab
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">Course Description</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{course.description}</p>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="flex items-center gap-2">
                        <PlayCircle className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">{course.numVideos} video lessons</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">{course.enrolled_students} students enrolled</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "curriculum" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Course Content ({course.videos.length} lessons)
                      </h3>
                      <button
                        onClick={() => navigate(`/teacher/courses/edit/${teacherId}/${id}?tab=curriculum`)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Edit Curriculum
                      </button>
                    </div>
                    {course.videos.length > 0 ? (
                      course.videos.map((video, idx) => (
                        <div
                          key={video.id}
                          className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition"
                        >
                          {/* Video Thumbnail */}
                          <div className="flex-shrink-0">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-32 h-20 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400";
                              }}
                            />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-semibold text-blue-600">
                                    Lesson {idx + 1}
                                  </span>
                                  {video.is_intro === 1 && (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                      Intro
                                    </span>
                                  )}
                                </div>
                                <h4 className="font-semibold text-gray-900">{video.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{video.description}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <PlayCircle className="w-4 h-4" />
                                {video.duration}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Eye className="w-4 h-4" />
                                {video.views} views
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 text-center py-8">No videos added yet. Click "Edit Curriculum" to add lessons.</p>
                    )}
                  </div>
                )}

                {activeTab === "outcomes" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Learning Outcomes</h3>
                      {course.learningOutcomes.length > 0 ? (
                        <ul className="space-y-3">
                          {course.learningOutcomes.map((outcome, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600">No learning outcomes specified.</p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h3>
                      {course.requirements.length > 0 ? (
                        <ul className="space-y-3">
                          {course.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0 mt-2" />
                              <span className="text-gray-700">{req}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600">No requirements specified.</p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "students" && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">Enrolled Students</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800">
                        <strong>{course.enrolled_students}</strong> students are enrolled in this course
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        No enrollment limit - unlimited spots available
                      </p>
                    </div>
                    <p className="text-gray-600">Detailed student list and progress tracking coming soon.</p>
                  </div>
                )}

                {activeTab === "performance" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Performance</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-green-50 rounded-lg p-5 border border-green-100">
                        <div className="flex items-center gap-3 mb-3">
                          <Users className="w-6 h-6 text-green-600" />
                          <h4 className="font-semibold text-gray-900">Enrollment</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Students:</span>
                            <span className="font-semibold">{course.enrolled_students}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Enrollment Status:</span>
                            <span className="font-semibold text-green-600">Unlimited</span>
                          </div>
                          <div className="flex justify-between border-t pt-2 mt-2">
                            <span className="text-gray-600">Availability:</span>
                            <span className="font-semibold">Open to All</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 rounded-lg p-5 border border-yellow-100">
                        <div className="flex items-center gap-3 mb-3">
                          <DollarSign className="w-6 h-6 text-yellow-600" />
                          <h4 className="font-semibold text-gray-900">Revenue</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Earned:</span>
                            <span className="font-semibold">₹{course.totalRevenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Price per Student:</span>
                            <span className="font-semibold">
                              {course.price === 0 ? "Free" : `₹${course.price}`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-5 border border-purple-100">
                        <div className="flex items-center gap-3 mb-3">
                          <TrendingUp className="w-6 h-6 text-purple-600" />
                          <h4 className="font-semibold text-gray-900">Engagement</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Completion Rate:</span>
                            <span className="font-semibold">{course.completionRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Average Rating:</span>
                            <span className="font-semibold">
                              {course.averageRating > 0 ? `${course.averageRating.toFixed(1)}/5.0` : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Reviews:</span>
                            <span className="font-semibold">{course.totalReviews}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                        <div className="flex items-center gap-3 mb-3">
                          <PlayCircle className="w-6 h-6 text-blue-600" />
                          <h4 className="font-semibold text-gray-900">Content Stats</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Videos:</span>
                            <span className="font-semibold">{course.numVideos}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Course Duration:</span>
                            <span className="font-semibold">{course.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Views:</span>
                            <span className="font-semibold">
                              {course.videos.reduce((sum, v) => sum + v.views, 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border p-6 space-y-3">
                <h3 className="font-semibold text-gray-900">Quick Actions</h3>

                <button
                  onClick={() => navigate(`/teacher/courses/edit/${teacherId}/${id}`)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Course
                </button>

                <button
                  onClick={handleShare}
                  className="w-full border-2 border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share Course
                </button>

                <button
                  onClick={() => navigate(`/courses/${teacherId}/${id}`)}
                  className="w-full border-2 border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Preview as Student
                </button>

                <div className="pt-3 border-t">
                  <button
                    onClick={course.status === "Active" ? handleDraft : handlePublish}
                    className={`w-full py-3 rounded-lg transition font-medium ${course.status === "Active"
                        ? "bg-yellow-50 text-yellow-700 border-2 border-yellow-200 hover:bg-yellow-100"
                        : "bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100"
                      }`}
                  >
                    {course.status === "Active" ? "Move to Draft" : "Publish Course"}
                  </button>
                </div>
              </div>

              {/* Course Info */}
              <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Course Information</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${course.status === "Active" ? "text-green-600" : "text-gray-600"}`}>
                      {course.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">
                      {course.price === 0 ? "Free" : `₹${course.price}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium capitalize">{course.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Level:</span>
                    <span className="font-medium capitalize">{course.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Students:</span>
                    <span className="font-medium">{course.enrolled_students}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCourseDetailPage;