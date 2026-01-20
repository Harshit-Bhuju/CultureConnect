import React from "react";
import CourseCategoryPageLayout from "./components/CourseCategoryPageLayout";

const generateCourses = (category, count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `course-dance-${i}`,
    title: `${category} Masterclass: Level ${(i % 3) + 1}`,
    teacher_name: "Master Dancer",
    description: `Master the intricate movements and spiritual storytelling of traditional ${category}.`,
    average_rating: (4.5 + (Math.random() * 0.5)).toFixed(1),
    enrolled_students: `${Math.floor(200 + Math.random() * 5000)}`,
    price: 1999 + i * 500,
    image: `https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&q=80`, // Placeholder dance image
    level: ["Beginner", "Intermediate", "Advanced"][i % 3],
    teacherId: 1,
  }));
};

const Dances = () => {
  const courses = [
    ...generateCourses("Kathak", 5),
    ...generateCourses("Bharatnatyam", 5),
    ...generateCourses("Nepali Folk", 10),
    ...generateCourses("Lakhe Dance", 5),
  ];

  return (
    <CourseCategoryPageLayout
      title="Traditional Dances"
      description="Embark on a rhythmic journey through centuries of heritage. Learn from masters who have dedicated their lives to these sacred art forms."
      courses={courses}
    />
  );
};

export default Dances;
