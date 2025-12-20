import React from 'react';
import { useParams } from 'react-router-dom';
import TeacherCourseDetailPage from '../../../../pages/Teacher/TeacherPagesHandling/TeacherCourseDetailPage';
import StudentCourseDetailPage from '../../../../pages/Teacher/TeacherPagesHandling/StudentCourseDetailPage';
import { useAuth } from '../../../../context/AuthContext';


const CourseDetailRouter = () => {
  const { teacherId } = useParams();
  const { user } = useAuth();

  // Check if the logged-in user is the teacher who owns this course
  const isTeacher = user?.teacher_id && user.teacher_id == teacherId;

  // Return appropriate view based on user type
  if (isTeacher) {
    return <TeacherCourseDetailPage />;
  } else {
    return <StudentCourseDetailPage />;
  }
};

export default CourseDetailRouter;