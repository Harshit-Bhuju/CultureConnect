import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Heart,
  Share2,
  PlayCircle,
  Clock,
  Users,
  CheckCircle,
  Star,
  BookOpen,
  Award
} from "lucide-react";
import Loading from "../../../components/Common/Loading";
import { useAuth } from "../../../context/AuthContext";
import API from "../../../Configs/ApiEndpoints";


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
          enrolled_students: parseInt(data.course.enrolled_students) || 0,
          max_students: parseInt(data.course.max_students) || 20,
          level: data.course.skill_level || 'Beginner',
          language: data.course.language || 'English',
          category: data.course.category || 'Dance',
          subcategory: data.course.subcategory || '',
          averageRating: parseFloat(data.course.average_rating) || 0,
          totalReviews: parseInt(data.course.total_reviews) || 0,
          teacher: data.teacher ? {
            id: data.teacher.id,
            name: data.teacher.name || 'Unknown Teacher',
            profile_picture: data.teacher.profile_picture 
              ? `${API.TEACHER_PROFILE_PICTURES}/${data.teacher.profile_picture}`
              : "https://i.ytimg.com/vi/EXAySI96m5c/sddefault.jpg",
            experience_years: parseInt(data.teacher.experience_years) || 0
          } : {
            id: teacherId,
            name: 'Unknown Teacher',
            profile_picture: "https://i.ytimg.com/vi/EXAySI96m5c/sddefault.jpg",
            experience_years: 0
          },
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

  const checkEnrollmentStatus = async () => {
    try {
      const response = await fetch(`${API.CHECK_ENROLLMENT}?course_id=${id}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setIsEnrolled(data.is_enrolled || false);
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch(`${API.CHECK_COURSE_WISHLIST}?course_id=${id}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setIsWishlisted(data.is_wishlisted || false);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.error("Please login to enroll");
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    // Handle free vs paid enrollment
    if (course.price === 0) {
      try {
        const response = await fetch(API.ENROLL_COURSE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ course_id: id })
        });
        const data = await response.json();
        
        if (data.status === 'success') {
          toast.success("Successfully enrolled in free course!");
          setIsEnrolled(true);
          fetchCourseDetails();
        } else {
          toast.error(data.message || 'Failed to enroll');
        }
      } catch (error) {
        console.error('Error enrolling:', error);
        toast.error('Failed to enroll');
      }
    } else {
      // Navigate to payment
      navigate(`/course/checkout/${teacherId}/${id}`);
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }
    
    try {
      const response = await fetch(API.ADD_TO_COURSE_WISHLIST, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          course_id: id, 
          action: isWishlisted ? 'remove' : 'add' 
        })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setIsWishlisted(!isWishlisted);
        toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist ❤️");
      } else {
        toast.error(data.message || 'Failed to update wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleBack = () => {
    navigate(`/teacherprofile/${teacherId}`);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
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
            onClick={handleBack}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Teacher Profile
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
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleWishlist}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <Share2 className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
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
                <div className="flex items-center gap-4 mb-4">
                  {renderStars(Math.round(course.averageRating))}
                  <span className="text-sm text-gray-600">
                    {course.averageRating.toFixed(1)} ({course.totalReviews} reviews)
                  </span>
                </div>
              )}

              {/* Teacher Info */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <img
                  src={course.teacher.profile_picture}
                  alt={course.teacher.name}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://i.ytimg.com/vi/EXAySI96m5c/sddefault.jpg";
                  }}
                />
                <div>
                  <p className="font-semibold text-gray-900">{course.teacher.name}</p>
                  <p className="text-sm text-gray-600">{course.teacher.experience_years} years experience</p>
                </div>
              </div>
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
                {["overview", "curriculum", "outcomes", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 font-semibold capitalize border-b-2 transition whitespace-nowrap ${
                      activeTab === tab
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
                    <h3 className="text-xl font-semibold text-gray-900">About This Course</h3>
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
                        <span className="text-gray-700">{course.enrolled_students} enrolled</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "curriculum" && (
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Course Curriculum ({course.videos.length} lessons)
                    </h3>
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
                                      Preview
                                    </span>
                                  )}
                                </div>
                                <h4 className="font-semibold text-gray-900">{video.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{video.description}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-2">
                              <PlayCircle className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-500">{video.duration}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 text-center py-8">Course curriculum coming soon</p>
                    )}
                  </div>
                )}

                {activeTab === "outcomes" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">What You'll Learn</h3>
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
                        <p className="text-gray-600">Learning outcomes will be updated soon.</p>
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
                        <p className="text-gray-600">No specific requirements.</p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">Student Reviews</h3>
                    <p className="text-gray-600">Reviews will appear here once students complete the course.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Enrollment Card */}
              <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
                <div className="text-center">
                  <p className="text-4xl font-bold text-gray-900">
                    {course.price === 0 ? "Free" : `₹${course.price}`}
                  </p>
                  {course.price > 0 && (
                    <p className="text-sm text-gray-600 mt-1">One-time payment</p>
                  )}
                </div>

                {isEnrolled ? (
                  <button
                    disabled
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Enrolled
                  </button>
                ) : (
                  <button
                    onClick={handleEnroll}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg hover:from-orange-600 hover:to-red-600 font-semibold transition"
                  >
                    {course.price === 0 ? "Enroll for Free" : "Enroll Now"}
                  </button>
                )}

                <div className="pt-4 border-t space-y-3">
                  <h4 className="font-semibold text-gray-900">This course includes:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-blue-600" />
                      {course.numVideos} video lessons
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      Certificate of completion
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      Live Q&A sessions
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      Lifetime access
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourseDetailPage;