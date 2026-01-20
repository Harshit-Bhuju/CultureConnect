import React from "react";
import CourseCategoryPageLayout from "./components/CourseCategoryPageLayout";

const generateCourses = (category, count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `course-vocal-${i}`,
    title: `${category} Vocal Training: Professional Masterclass`,
    teacher_name: "Sangeet Guru",
    description: `Develop your voice and master the complex ragas and folk melodies of ${category} traditions.`,
    average_rating: (4.7 + Math.random() * 0.3).toFixed(1),
    enrolled_students: `${Math.floor(500 + Math.random() * 8000)}`,
    price: 1599 + i * 300,
    image: `https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80`, // Placeholder singing image
    level: ["Beginner", "Intermediate", "Advanced"][i % 3],
    teacherId: 1,
  }));
};

const Singing = () => {
  const courses = [
    ...generateCourses("Classical Raga", 10),
    ...generateCourses("Folk Melodies", 10),
    ...generateCourses("Sufi Music", 5),
    ...generateCourses("Modern Ethnic", 5),
  ];

  return (
    <CourseCategoryPageLayout
      title="Vocal & Singing"
      description="Unlock the power of your voice through centuries-old vocal techniques and cultural storytelling through song."
      courses={courses}
    />
  );
};

export default Singing;
