import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, GraduationCap } from "lucide-react";
import API from "../../Configs/ApiEndpoints";

const TeacherSpotlight = () => {
    const [teachers, setTeachers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSuggestedTeachers();
    }, []);

    const fetchSuggestedTeachers = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(API.GET_SUGGESTED_TEACHERS, {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();

            if (data.success) {
                setTeachers(data.teachers || []);
            } else {
                setError(data.error || "Failed to load teachers");
            }
        } catch (err) {
            console.error("Fetch suggested teachers error:", err);
            setError("Network error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="py-8 bg-gray-50 px-3 sm:px-6 md:px-10">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 w-[280px] md:w-[320px] bg-white rounded-xl p-4 animate-pulse flex items-center gap-4">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gray-200 shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (teachers.length === 0) {
        return null;
    }

    return (
        <div className="py-8 px-3 sm:px-6 md:px-10">
            <div className="mb-6 flex items-end justify-between">
                <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                        Suggested Instructors
                    </h2>
                    <p className="text-sm text-gray-500">Learn from master practitioners</p>
                </div>
                <Link
                    to="/teachers"
                    className="text-teal-600 hover:text-teal-700 font-semibold text-sm transition-colors hidden sm:block"
                >
                    View all teachers →
                </Link>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex overflow-x-auto gap-4 pb-4 md:pb-6 scrollbar-hide snap-x">
                {teachers.map((teacher) => (
                    <Link
                        key={teacher.id}
                        to={`/teacherprofile/${teacher.id}`}
                        className="flex-shrink-0 w-[280px] md:w-[330px] snap-start bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md hover:-translate-y-1 flex items-center gap-5 group"
                    >
                        <div className="relative">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-100 ring-2 ring-gray-50 group-hover:ring-teal-100 transition-all">
                                <img
                                    src={`${API.TEACHER_PROFILE_PICTURES}/${teacher.profile_picture}`}
                                    alt={teacher.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1544717305-27a734ef1904?q=80&w=2070&auto=format&fit=crop"; // Better fallback
                                    }}
                                />
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white p-1 rounded-full border-2 border-white shadow-sm">
                                <GraduationCap size={12} />
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 truncate text-base md:text-lg mb-0.5 group-hover:text-teal-600 transition-colors">
                                {teacher.name}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2 font-medium">{teacher.specialty}</p>

                            <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs">
                                <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                                    <Star size={10} fill="currentColor" /> {teacher.rating}
                                </div>
                                <div className="text-gray-400 font-medium whitespace-nowrap">
                                    {teacher.courses} Courses
                                </div>
                                <div className="text-gray-400 font-medium whitespace-nowrap">
                                    {teacher.total_students.toLocaleString()} Students
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <Link
                to="/teachers"
                className="text-teal-600 hover:text-teal-700 font-semibold text-sm transition-colors sm:hidden block mt-2"
            >
                View all teachers →
            </Link>
        </div>
    );
};

export default TeacherSpotlight;
