import React from "react";
import CourseCategoryPageLayout from "./components/CourseCategoryPageLayout";

const generateCourses = (category, count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `course-art-${i}`,
    title: `Traditional ${category}: Master the Ancient Techniques`,
    teacher_name: "Master Artisan",
    description: `Create your own masterpieces using traditional ${category} methods passed down through generations.`,
    average_rating: (4.8 + (Math.random() * 0.2)).toFixed(1),
    enrolled_students: `${Math.floor(300 + Math.random() * 4000)}`,
    price: 2999 + i * 600,
    image: `https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80`, // Placeholder art image
    level: ["Beginner", "Intermediate", "Advanced"][i % 3],
    teacherId: 1,
  }));
};

const ArtCrafts = () => {
  const courses = [
    ...generateCourses("Thangka Painting", 8),
    ...generateCourses("Pottery & Ceramics", 7),
    ...generateCourses("Wood Carving", 8),
    ...generateCourses("Metal Crafting", 7),
  ];

  return (
    <CourseCategoryPageLayout
      title="Arts & Crafts"
      description="Work with your hands to create timeless cultural artifacts. Expert-led guidance for preserving our physical heritage."
      courses={courses}
    />
  );
};

export default ArtCrafts;
