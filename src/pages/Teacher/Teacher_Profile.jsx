import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { SidebarProvider, SidebarInset } from "../../components/ui/sidebar";
import AppSidebar from "../../components/Layout/app-sidebar";
import Navbar from "../../components/Layout/NavBar";
import CourseCard from "../../components/cardLayout/CourseCard";
import { Link, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/common/Loading";
import API from "../../Configs/ApiEndpoints";

const TeacherProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth?.() || {};
  const [activeTab, setActiveTab] = useState("classes");
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    if (id) {
      fetchTeacherProfile(id);
      if (user) {
        checkFollowStatus(id);
      }
    }
  }, [id, user]);

  const fetchTeacherProfile = async (teacherId) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API.GET_TEACHER_PROFILE_WITH_COURSES}?teacher_id=${teacherId}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const result = await response.json();

      if (result.status === "success") {
        const teacherProfile = result.teacher_profile;

        setTeacherData(teacherProfile);
        setFollowersCount(teacherProfile.followers_count || 0);
        setClasses(result.classes || []);

        // Check if viewing own profile
        const currentUserTeacherId = user?.teacher_id;
        setIsOwnProfile(
          currentUserTeacherId && currentUserTeacherId == teacherId,
        );
      } else {
        toast.error(result.message || "Failed to load teacher profile");
        navigate("/");
      }
    } catch (err) {
      console.error("Fetch teacher profile error:", err);
      toast.error("Error loading teacher profile");
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const checkFollowStatus = async (teacherId) => {
    try {
      const response = await fetch(
        `${API.CHECK_TEACHER_FOLLOW_STATUS}?teacher_id=${teacherId}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const result = await response.json();

      if (result.status === "success") {
        setIsFollowing(result.is_following);
      }
    } catch (err) {
      console.error("Check follow status error:", err);
    }
  };

  const handleFollowToggle = async () => {
    if (!user) {
      toast.error("Please login to follow teachers");
      return;
    }

    setFollowLoading(true);
    try {
      const action = isFollowing ? "unfollow" : "follow";
      const formData = new FormData();
      formData.append("teacher_id", id);
      formData.append("action", action);

      const response = await fetch(API.FOLLOW_TEACHER, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await response.json();

      if (result.status === "success") {
        setIsFollowing(result.is_following);
        setFollowersCount(result.followers_count);
        toast.success(result.message);
      } else {
        toast.error(result.message || "Failed to update follow status");
      }
    } catch (err) {
      console.error("Follow toggle error:", err);
      toast.error("Error updating follow status");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleAddCourses = () => {
    navigate(`/teacher/classes/new/${user?.teacher_id}`);
  };

  if (isLoading) {
    return <Loading message="Loading Profile..." />;
  }

  if (!teacherData) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Navbar />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <p className="text-gray-600 mb-4">No teacher found</p>
              <Link to="/teacher-registration">
                <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Register as Teacher
                </button>
              </Link>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Show verification pending screen for own profile
  if (isOwnProfile && teacherData.status === "pending") {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Navbar />
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
            <div className="text-center max-w-2xl p-12 bg-white rounded-3xl shadow-2xl">
              <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <svg
                  className="w-12 h-12 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Account Being Verified
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Your teacher account is currently under review. This process
                usually takes up to 7 business days.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <p className="text-amber-800 font-medium mb-2">
                  What happens next?
                </p>
                <p className="text-amber-700 text-sm">
                  Our team is carefully reviewing your application. Once
                  approved, you'll receive an email notification and gain full
                  access to create and manage your classes.
                </p>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar />
        <div className="bg-gray-50 pb-12">
          {/* Profile Header */}
          <div className="relative pt-8 px-6 md:px-12">
            <div className="absolute top-8 left-6 w-32 h-32 border-4 border-white rounded-full overflow-hidden shadow-lg bg-white">
              <img
                src={`${API.TEACHER_PROFILE_PICTURES}/${teacherData.profile_picture}`}
                alt={`${teacherData.name}'s profile`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150?text=Teacher";
                }}
              />
            </div>
          </div>

          {/* Teacher Info */}
          <div className="mt-32 px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
              <div className="w-[70%]">
                <h1 className="text-3xl font-bold text-gray-800 w-3/4">
                  {teacherData.name || "Unnamed Teacher"}
                </h1>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-6 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{followersCount} Followers</span>
                    </div>
                    <div>
                      <span>
                        {classes.length} Published Class
                        {classes.length !== 1 ? "es" : ""}
                      </span>
                    </div>
                  </div>

                  {teacherData.category && (
                    <div className="text-gray-600">
                      <span className="font-bold">Teaching: </span>
                      <span className="capitalize">{teacherData.category}</span>
                    </div>
                  )}

                  <div className="text-gray-600">
                    <span className="font-bold">Joined: </span>
                    <span>{teacherData.created_at || "Recently"}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 md:mt-0">
                {!isOwnProfile ? (
                  <button
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      isFollowing
                        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                    } ${followLoading ? "opacity-50 cursor-not-allowed" : ""}`}>
                    {followLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <Heart
                          className={`w-4 h-4 ${isFollowing ? "fill-current" : ""}`}
                        />
                        {isFollowing ? "Following" : "Follow"}
                      </>
                    )}
                  </button>
                ) : (
                  <>
                    <Link to="/customise-teacher-profile">
                      <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Customize Profile
                      </button>
                    </Link>
                    <button
                      onClick={handleAddCourses}
                      className="px-5 py-2.5 border border-gray-800 text-gray-800 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                      Add New Class
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-10 border-b border-gray-200">
              <nav className="flex gap-8 text-gray-600">
                <button
                  onClick={() => setActiveTab("classes")}
                  className={`py-3 px-1 font-medium transition-colors border-b-2 ${
                    activeTab === "classes"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent hover:text-gray-800"
                  }`}>
                  Classes
                </button>
                <button
                  onClick={() => setActiveTab("about")}
                  className={`py-3 px-1 font-medium transition-colors border-b-2 ${
                    activeTab === "about"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent hover:text-gray-800"
                  }`}>
                  About
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-8">
              {activeTab === "classes" && (
                <div>
                  {classes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {classes.map((cls) => (
                        <CourseCard
                          key={cls.id}
                          course={cls}
                          teacherId={id}
                          teacherName={teacherData.name}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="max-w-md mx-auto">
                        <svg
                          className="w-24 h-24 text-gray-300 mx-auto mb-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                        <p className="text-gray-600 text-lg font-medium mb-3">
                          {isOwnProfile
                            ? "You haven't published any classes yet"
                            : `${teacherData.name} hasn't published any classes yet`}
                        </p>
                        <p className="text-gray-500 mb-6">
                          {isOwnProfile
                            ? "Start creating your first course to reach students!"
                            : "Check back later for new content."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "about" && (
                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    About {teacherData.name}
                  </h2>
                  <div className="text-gray-600 leading-relaxed whitespace-pre-line text-base">
                    {teacherData.bio?.trim()
                      ? teacherData.bio
                      : `${teacherData.name} hasn't added a bio yet.`}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default TeacherProfile;
