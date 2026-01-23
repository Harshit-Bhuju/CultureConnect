import React from "react";
import {
  BookOpen,
  CheckCircle,
  AlertCircle,
  Calendar,
  List,
  Target,
  Play,
  Star,
  Users,
} from "lucide-react";
import CourseReviews from "../Reviews/CourseReviews";
import RecentEnrollments from "../../Analytics/Chart and Enrollments/RecentEnrollments";

export default function CourseContent({
  course,
  activeTab,
  setActiveTab,
  user,
  teacherId,
  openReviewForm,
  openDeleteModal,
  enrollments = [],
  enrollmentsLoading = false,
}) {
  const tabs = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "curriculum", label: "Curriculum", icon: List },
    { id: "students", label: "Students", icon: Users },
    { id: "outcomes", label: "Learning Outcomes", icon: Target },
    { id: "requirements", label: "Requirements", icon: AlertCircle },
    { id: "schedule", label: "Learning Schedule", icon: Calendar },
    { id: "reviews", label: "Reviews", icon: Star },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Tabs */}
      <div className="border-b border-gray-200 px-6">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 transition whitespace-nowrap ${activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}>
                <Icon className="w-4 h-4" />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                About This Course
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {course.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  Course Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium capitalize">
                      {course.category}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Skill Level:</span>
                    <span className="font-medium capitalize">
                      {course.level}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Language:</span>
                    <span className="font-medium">{course.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Videos:</span>
                    <span className="font-medium">{course.numVideos}</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  Time Commitment
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  {course.hoursPerWeek > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hours per week:</span>
                      <span className="font-medium">
                        {course.hoursPerWeek} hours
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">
                      {course.price === 0 ? "Free" : `Rs.${course.price}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Curriculum Tab */}
        {activeTab === "curriculum" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Course Curriculum
              </h3>
              <span className="text-sm text-gray-600">
                {course.videos.length} lessons
              </span>
            </div>

            {course.videos.length > 0 ? (
              <div className="space-y-3">
                {course.videos.map((video, index) => (
                  <div
                    key={video.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition">
                    <div className="flex-shrink-0 relative group/thumb">
                      <div className="w-32 h-20 bg-gray-200 rounded-xl overflow-hidden border border-gray-100 shadow-sm relative">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover/thumb:bg-black/40 transition-all duration-300">
                          <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center transform scale-90 group-hover/thumb:scale-100 transition-transform duration-300">
                            <Play className="w-4 h-4 text-white fill-white" />
                          </div>
                        </div>
                      </div>
                      <div className="absolute -top-2 -left-2 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg ring-2 ring-white z-10">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-semibold text-gray-900 flex-1">
                          {video.title}
                        </h4>
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                          {video.duration}
                        </span>
                      </div>
                      {video.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {video.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <List className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No curriculum available</p>
              </div>
            )}
          </div>
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <div className="animate-in fade-in duration-300">
            <RecentEnrollments
              selectedPeriod="Until now"
              enrollments={enrollments}
              loading={enrollmentsLoading}
            />
          </div>
        )}

        {/* Learning Outcomes Tab */}
        {activeTab === "outcomes" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              What You'll Learn
            </h3>

            {course.learningOutcomes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.learningOutcomes.map((outcome, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {outcome}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No learning outcomes specified</p>
              </div>
            )}
          </div>
        )}

        {/* Requirements Tab */}
        {activeTab === "requirements" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Requirements
            </h3>

            {course.requirements.length > 0 ? (
              <div className="space-y-3">
                {course.requirements.map((requirement, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed flex-1">
                      {requirement}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No requirements specified</p>
                <p className="text-sm text-gray-500 mt-1">
                  This course is open to everyone!
                </p>
              </div>
            )}
          </div>
        )}
        {activeTab === "schedule" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Suggested Learning Schedule
            </h3>

            {course.learningSchedule ? (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                <div className="flex items-start gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Recommended Study Plan
                    </h4>
                    <p className="text-sm text-gray-600">
                      Follow this schedule for optimal learning
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                  {course.learningSchedule}
                </div>

                {course.hoursPerWeek > 0 && course.durationWeeks > 0 && (
                  <div className="mt-4 p-4 bg-white rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total commitment:</span>
                      <span className="font-semibold text-gray-900">
                        {course.durationWeeks} weeks × {course.hoursPerWeek}{" "}
                        hours/week
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No learning schedule available</p>
                <p className="text-sm text-gray-500 mt-1">
                  Learn at your own pace!
                </p>
              </div>
            )}
          </div>
        )}
        {activeTab === "reviews" && (
          <div className="animate-in fade-in duration-300">
            <CourseReviews
              course={course}
              user={user}
              teacherId={teacherId}
              openReviewForm={openReviewForm}
              openDeleteModal={openDeleteModal}
            />
          </div>
        )}
      </div>
    </div>
  );
}
