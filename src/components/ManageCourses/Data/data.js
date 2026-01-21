// Helper function to get all recent enrollments across all courses
export const getAllRecentEnrollments = (initialCourses) => {
  const allEnrollments = [];

  initialCourses.forEach((course) => {
    if (course.enrollments && course.enrollments.length > 0) {
      course.enrollments.forEach((enrollment) => {
        allEnrollments.push({
          ...enrollment,
          courseId: course.id,
          courseTitle: course.title,
          coursePrice: course.price,
        });
      });
    }
  });

  // Sort by date (most recent first)
  return allEnrollments.sort(
    (a, b) => new Date(b.enrollmentDate) - new Date(a.enrollmentDate),
  );
};

// Helper function to update enrollment status
export const updateEnrollmentStatus = (initialCourses, userId, newStatus) => {
  const course = initialCourses.find(
    (c) => c.enrollments && c.enrollments.some((e) => e.user_id === userId),
  );

  if (course) {
    const enrollment = course.enrollments.find((e) => e.user_id === userId);
    if (enrollment) {
      enrollment.status = newStatus;
      return true;
    }
  }
  return false;
};

// Helper function to get enrollments by user ID
export const getEnrollmentsByUserId = (initialCourses, userId) => {
  const userEnrollments = [];

  initialCourses.forEach((course) => {
    if (course.enrollments && course.enrollments.length > 0) {
      const matchingEnrollments = course.enrollments.filter(
        (enrollment) => enrollment.user_id === userId,
      );

      matchingEnrollments.forEach((enrollment) => {
        userEnrollments.push({
          ...enrollment,
          courseId: course.id,
          courseTitle: course.title,
        });
      });
    }
  });

  return userEnrollments.sort(
    (a, b) => new Date(b.enrollmentDate) - new Date(a.enrollmentDate),
  );
};

// Helper function to get enrollments by student email
export const getEnrollmentsByEmail = (initialCourses, email) => {
  const emailEnrollments = [];

  initialCourses.forEach((course) => {
    if (course.enrollments && course.enrollments.length > 0) {
      const matchingEnrollments = course.enrollments.filter(
        (enrollment) => enrollment.studentEmail === email,
      );

      matchingEnrollments.forEach((enrollment) => {
        emailEnrollments.push({
          ...enrollment,
          courseId: course.id,
          courseTitle: course.title,
        });
      });
    }
  });

  return emailEnrollments.sort(
    (a, b) => new Date(b.enrollmentDate) - new Date(a.enrollmentDate),
  );
};

// Categories matching the upload form
export const categories = [
  "All Categories",
  "Dance",
  "Music",
  "Art",
  "Language",
  "Cooking",
];

export const sortOptions = ["Latest", "Oldest", "Recently Updated"];

export const getCategoryDisplay = (category) => {
  const categoryMap = {
    dance: "Dance",
    music: "Music",
    art: "Art",
    language: "Language",
    cooking: "Cooking",
  };
  return categoryMap[category] || category.toUpperCase();
};

// Helper function to get audience display name
export const getAudienceDisplay = (audience) => {
  const audienceMap = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    "all-levels": "All Levels",
  };
  return audienceMap[audience] || "";
};

// Helper function to calculate average rating
export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
};
