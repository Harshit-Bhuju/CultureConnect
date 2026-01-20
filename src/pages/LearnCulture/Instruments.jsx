import React from "react";
import CourseCategoryPageLayout from "./components/CourseCategoryPageLayout";

const generateCourses = (category, count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `course-instr-${i}`,
    title: `Master the ${category}: From Basic to Professional`,
    teacher_name: "Ustad Maestro",
    description: `Learn the soul-stirring notes of the ${category} with personalized guidance from legendary performers.`,
    average_rating: (4.6 + (Math.random() * 0.4)).toFixed(1),
    enrolled_students: `${Math.floor(100 + Math.random() * 3000)}`,
    price: 2499 + i * 400,
    image: `https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80`, // Placeholder instrument image
    level: ["Beginner", "Intermediate", "Advanced"][i % 3],
    teacherId: 1,
  }));
};

const Instruments = () => {
  const courses = [
    ...generateCourses("Madal", 8),
    ...generateCourses("Sarangi", 7),
    ...generateCourses("Bansuri", 8),
    ...generateCourses("Sitar", 7),
  ];

  return (
    <CourseCategoryPageLayout
      title="Musical Instruments"
      description="Find your rhythm and master the traditional sounds of our heritage. Step-by-step masterclasses for every aspiring musician."
      courses={courses}
    />
  );
};

export default Instruments;
