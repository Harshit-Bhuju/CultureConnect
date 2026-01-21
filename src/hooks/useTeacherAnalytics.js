import { useState, useEffect } from "react";
import API from "../Configs/ApiEndpoints";

// MOCK DATA for analytics
const MOCK_STATS = {
  total_revenue: 12500.5,
  total_students: 145,
  total_courses: 5,
  average_rating: 4.8,
};

const MOCK_COURSE_STATS = {
  active_courses: 5,
  draft_courses: 2,
  under_review: 1,
  total_views: 3500,
};

const MOCK_TOP_COURSES = [
  {
    id: "1",
    title: "Introduction to Classical Dance",
    revenue: 5000,
    students: 45,
    rating: 4.9,
  },
  {
    id: "2",
    title: "Advanced Violin Masterclass",
    revenue: 3500,
    students: 30,
    rating: 4.7,
  },
  {
    id: "3",
    title: "Digital Art Fundamentals",
    revenue: 2500,
    students: 40,
    rating: 4.8,
  },
  {
    id: "4",
    title: "Piano for Beginners",
    revenue: 1500,
    students: 30,
    rating: 4.6,
  },
];

const MOCK_ENROLLMENTS = [
  {
    id: "e1",
    student_name: "Rahul Sharma",
    course_title: "Introduction to Classical Dance",
    amount: 49.99,
    date: "2025-01-20",
    status: "Completed",
  },
  {
    id: "e2",
    student_name: "Priya Patel",
    course_title: "Advanced Violin Masterclass",
    amount: 120.0,
    date: "2025-01-19",
    status: "In Progress",
  },
  {
    id: "e3",
    student_name: "Amit Singh",
    course_title: "Introduction to Classical Dance",
    amount: 49.99,
    date: "2025-01-19",
    status: "Started",
  },
  {
    id: "e4",
    student_name: "Sneha Gupta",
    course_title: "Digital Art Fundamentals",
    amount: 35.0,
    date: "2025-01-18",
    status: "Completed",
  },
  {
    id: "e5",
    student_name: "Vikram Malhotra",
    course_title: "Piano for Beginners",
    amount: 55.0,
    date: "2025-01-18",
    status: "In Progress",
  },
];

const useTeacherAnalytics = (period) => {
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_students: 0,
    total_courses: 0,
    average_rating: 0,
  });
  const [courseStats, setCourseStats] = useState({
    active_courses: 0,
    draft_courses: 0,
    under_review: 0,
    total_views: 0,
  });
  const [topCourses, setTopCourses] = useState([]);
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // SIMULATED API CALL
        // const statsResponse = await fetch(`${API.GET_TEACHER_ANALYTICS_STATS}?period=${period}`);

        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay

        console.log(`Fetching analytics for ${period}`);

        // Mocking period interaction simply by not changing data for now,
        // in real app backend filters data
        setStats(MOCK_STATS);
        setCourseStats(MOCK_COURSE_STATS);
        setTopCourses(MOCK_TOP_COURSES);
        setRecentEnrollments(MOCK_ENROLLMENTS);
      } catch (err) {
        setError(err.message || "Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };

    if (period) {
      fetchAnalytics();
    }
  }, [period]);

  return { stats, courseStats, topCourses, recentEnrollments, loading, error };
};

export default useTeacherAnalytics;
