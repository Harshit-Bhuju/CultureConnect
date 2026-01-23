import { useState, useEffect } from "react";
import API from "../Configs/ApiEndpoints";

const useTeacherAnalytics = (period, teacherId = null, courseId = null) => {
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_students: 0,
    total_courses: 0,
    average_rating: 0,
  });
  const [courseStats, setCourseStats] = useState({
    active_courses: 0,
    draft_courses: 0,
    deleted_courses: 0,
    total_courses: 0,
  });
  const [topCourses, setTopCourses] = useState([]);
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);

      try {
        const teacherParam = teacherId ? `&teacher_id=${teacherId}` : "";
        const courseParam = courseId ? `&course_id=${courseId}` : "";
        const commonParams = `period=${encodeURIComponent(period)}${teacherParam}${courseParam}`;

        // Fetch all analytics data in parallel
        const [statsRes, topCoursesRes, enrollmentsRes] = await Promise.all([
          fetch(`${API.GET_TEACHER_ANALYTICS_STATS}?${commonParams}`, {
            credentials: "include",
          }),
          fetch(`${API.GET_TOP_PERFORMING_COURSES}?${commonParams}`, {
            credentials: "include",
          }),
          fetch(`${API.GET_RECENT_ENROLLMENTS}?${commonParams}`, {
            credentials: "include",
          }),
        ]);

        const statsData = await statsRes.json();
        const topCoursesData = await topCoursesRes.json();
        const enrollmentsData = await enrollmentsRes.json();

        if (statsData.success) {
          setStats(statsData.stats);
          setCourseStats(statsData.course_stats);
        } else {
          console.warn("Stats fetch failed:", statsData.error);
        }

        if (topCoursesData.success) {
          setTopCourses(topCoursesData.top_courses);
        } else {
          console.warn("Top courses fetch failed:", topCoursesData.error);
        }

        if (enrollmentsData.success) {
          setRecentEnrollments(enrollmentsData.enrollments);
        } else {
          console.warn("Enrollments fetch failed:", enrollmentsData.error);
        }
      } catch (err) {
        console.error("Analytics fetch error:", err);
        setError(err.message || "Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };

    if (period) {
      fetchAnalytics();
    }
  }, [period, teacherId, courseId]);

  return { stats, courseStats, topCourses, recentEnrollments, loading, error };
};

export default useTeacherAnalytics;
