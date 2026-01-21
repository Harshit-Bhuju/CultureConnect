import React from "react";
import {
    Heart,
    Share2,
    PlayCircle,
    Award,
    Users,
    Clock,
    Download,
    Globe,
    CheckCircle,
    BookOpen,
    Smartphone,
} from "lucide-react";

export default function StudentCourseSidebar({
    course,
    isEnrolled,
    isWishlisted,
    handleEnroll,
    handleWishlist,
    handleShare,
}) {
    return (
        <div className="sticky top-24 space-y-6">
            {/* Price & Enrollment Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                {/* Price */}
                <div className="text-center mb-6">
                    <p className="text-4xl font-bold text-gray-900 mb-1">
                        {course.price === 0 ? (
                            <span className="text-green-600">Free</span>
                        ) : (
                            `Rs.${course.price.toLocaleString()}`
                        )}
                    </p>
                    {course.price > 0 && (
                        <p className="text-sm text-gray-600">One-time payment</p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    {isEnrolled ? (
                        <button
                            disabled
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-not-allowed">
                            <CheckCircle className="w-5 h-5" />
                            Already Enrolled
                        </button>
                    ) : (
                        <button
                            onClick={handleEnroll}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold transition shadow-md hover:shadow-lg">
                            {course.price === 0 ? "Enroll for Free" : "Enroll Now"}
                        </button>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleWishlist}
                            className={`flex items-center justify-center gap-2 py-2 rounded-lg border-2 transition font-medium ${isWishlisted
                                    ? "border-red-500 bg-red-50 text-red-600"
                                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                }`}>
                            <Heart
                                className={`w-4 h-4 ${isWishlisted ? "fill-red-500" : ""}`}
                            />
                            <span className="text-sm">
                                {isWishlisted ? "Saved" : "Save"}
                            </span>
                        </button>

                        <button
                            onClick={handleShare}
                            className="flex items-center justify-center gap-2 py-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium">
                            <Share2 className="w-4 h-4" />
                            <span className="text-sm">Share</span>
                        </button>
                    </div>
                </div>

                {/* Course Includes */}
                <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold text-gray-900 mb-4">
                        This course includes:
                    </h4>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-3 text-gray-700">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <PlayCircle className="w-4 h-4 text-blue-600" />
                            </div>
                            <span>{course.numVideos} video lessons</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Clock className="w-4 h-4 text-purple-600" />
                            </div>
                            <span>Lifetime access</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Award className="w-4 h-4 text-green-600" />
                            </div>
                            <span>Certificate of completion</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Download className="w-4 h-4 text-orange-600" />
                            </div>
                            <span>Downloadable resources</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Smartphone className="w-4 h-4 text-indigo-600" />
                            </div>
                            <span>Access on mobile & desktop</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                            <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Users className="w-4 h-4 text-pink-600" />
                            </div>
                            <span>Community support</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Course Stats */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Course Details
                </h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-blue-100">
                        <span className="text-sm text-gray-600">Students Enrolled</span>
                        <span className="font-semibold text-gray-900">
                            {course.enrolled_students}
                        </span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-blue-100">
                        <span className="text-sm text-gray-600">Duration</span>
                        <span className="font-semibold text-gray-900">
                            {course.duration}
                        </span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-blue-100">
                        <span className="text-sm text-gray-600">Skill Level</span>
                        <span className="font-semibold text-gray-900 capitalize">
                            {course.level}
                        </span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-blue-100">
                        <span className="text-sm text-gray-600">Language</span>
                        <span className="font-semibold text-gray-900">
                            {course.language}
                        </span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-blue-100">
                        <span className="text-sm text-gray-600">Category</span>
                        <span className="font-semibold text-gray-900 capitalize">
                            {course.category}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Videos</span>
                        <span className="font-semibold text-gray-900">
                            {course.numVideos}
                        </span>
                    </div>
                </div>
            </div>

            {/* Money Back Guarantee */}
            {course.price > 0 && (
                <div className="bg-green-50 rounded-2xl border border-green-100 p-6">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-1">
                                30-Day Money-Back Guarantee
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                Not satisfied? Get a full refund within 30 days, no questions
                                asked.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}