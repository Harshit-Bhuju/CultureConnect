import { useState, useEffect } from "react";
import API from "../Configs/ApiEndpoints";

// MOCK DATA for development
const MOCK_COURSES = [
  {
    id: "1",
    title: "Introduction to Classical Dance",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
    category: "Dance",
    status: "Published",
    price: 49.99,
    stock: 100, // Conceptually "seats"
    enrolled_students: 45,
    rating: 4.8,
    createdAt: "2025-01-10T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
    duration: "8 weeks",
    level: "Beginner",
  },
  {
    id: "2",
    title: "Advanced Violin Masterclass",
    image: "https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=400",
    category: "Music",
    status: "Draft",
    price: 120.0,
    stock: 20,
    enrolled_students: 0,
    rating: 0,
    createdAt: "2025-01-20T10:00:00Z",
    updatedAt: "2025-01-20T10:00:00Z",
    duration: "12 weeks",
    level: "Advanced",
  },
  {
    id: "3",
    title: "Traditional Art Techniques",
    image: "https://images.unsplash.com/photo-1460661631651-30de8e7172a9?w=400",
    category: "Art",
    status: "Published",
    price: 25.0,
    stock: 50,
    enrolled_students: 12,
    rating: 4.2,
    createdAt: "2025-01-05T10:00:00Z",
    updatedAt: "2025-01-18T10:00:00Z",
    duration: "4 weeks",
    level: "Intermediate",
  },
];

const useTeacherCourses = (teacherId) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeCourses: 0,
    totalStudents: 0,
    averageRating: 0,
  });

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // SIMULATED API CALL
        // In real impl, fetch from API.GET_TEACHER_COURSES
        // const response = await fetch(`${API.GET_TEACHER_COURSES}?teacher_id=${teacherId}`);

        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate delay

        setCourses(MOCK_COURSES);

        // Calculate mock stats
        const active = MOCK_COURSES.filter(
          (c) => c.status === "Published",
        ).length;
        const students = MOCK_COURSES.reduce(
          (acc, curr) => acc + (curr.enrolled_students || 0),
          0,
        );
        const ratings = MOCK_COURSES.filter((c) => c.rating > 0);
        const avgRating =
          ratings.length > 0
            ? ratings.reduce((acc, curr) => acc + curr.rating, 0) /
              ratings.length
            : 0;

        setStats({
          totalCourses: MOCK_COURSES.length,
          activeCourses: active,
          totalStudents: students,
          averageRating: avgRating.toFixed(1),
        });
      } catch (err) {
        setError(err.message || "Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchCourses();
    }
  }, [teacherId]);

  return { courses, stats, loading, error, setCourses };
};

export default useTeacherCourses;
