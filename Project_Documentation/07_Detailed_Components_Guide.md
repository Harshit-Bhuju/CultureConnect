# Component Directory Reference (`src/components/`)

This document details the reusable building blocks of the application.

## Auth/

Authentication logic and route protection.

- **`LoginForm.jsx`, `GoogleLoginButton.jsx`**: UI forms for signing in.
- **`Route/ProtectedRoute.jsx`**: Wraps pages that require the user to be logged in.
- **`Route/PublicRoute.jsx`**: Wraps pages that should NOT be accessible if logged in (like Login).
- **`Route/SellerRoute/ProtectedSellerRoute.jsx`**: Ensures the user is a Seller AND owns the data they are trying to access.
- **`Route/TeacherRoute/ProtectedTeacherRoute.jsx`**: Ensures the user is a Teacher AND owns the data.

## Common/

Generic utilities used everywhere.

- **`Loading.jsx`**: Spinner/Loader animation.
- **`SearchBar.jsx`**: Global search input.
- **`ScrollToTop.jsx`**: Helper to reset scroll position on route change.

## Home/

Sections specific to the Landing Page.

- **`HeroSection.jsx`**: The big top banner with welcome text and primary CTA.
- **`CategorySection.jsx`**: Grid showing top categories (Marketplace, Learn Culture).
- **`BecomeSellerSection.jsx`**: Call-to-action banner inviting users to sell.
- **`BecomeExpertSection.jsx`**: Call-to-action banner inviting users to teach.
- **`CulturalStorySection.jsx`**: Narrative block about the brand's mission.

## Layout/

Global layout structures.

- **`NavBar.jsx`**: Top navigation header.
- **`Footer.jsx`**: Bottom footer.
- **`app-sidebar.jsx`**: Sidebar navigation (likely for Admin or Dashboard views).

## ManageCourses/ (Teacher Dashboard)

- **`Analytics/`**: Components for charts and data visualization (e.g., `TeacherAnalyticsDashboard.jsx`).
- **`CardHandling/`**: Logic for displaying courses.
  - **`TeacherCourseUpload/`**: Multi-step form for creating a new course.
  - **`TeacherCourseEditPage/`**: Form for updating an existing course.
  - **`EnrolledStudentCourseDetailPage/`**: The "Classroom" view where students watch videos (`CoursePlayerPage.jsx`).

## ManageProducts/ (Seller Dashboard)

- **`SellerAnalyticsDashboard.jsx`**: Sales and views data.
- **`SellerProductUpload.jsx`**: Form for listing a new product.
- **`SellerProductEditPage.jsx`**: Form for editing listings.
- **`Drafts/`**: Components for managing unfinished listings.

## LearnCulture/

- **`CourseSwiper.jsx`**: Carousel component for displaying courses.
- **`TeacherSpotlight.jsx`**: Highlight section for top teachers.
