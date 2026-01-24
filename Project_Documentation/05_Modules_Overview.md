# Modules Overview

The application is divided into two primary business verticals, each with its own set of pages and components.

## 1. Marketplace (Commerce)

Focuses on physical goods.

- **Pages**: `src/pages/Marketplace/`
  - `Marketplace.jsx`: Landing page with featured products/categories.
  - `TraditionalClothing.jsx`, `Instruments.jsx`, `Arts.jsx`: Category listing pages.
- **Components**: `src/components/Products/` & `src/components/ManageProducts/`
  - **ProductRouter**: Handles displaying product details (`ProductDetailRouter`).
  - **ManageProducts**: Contains complex forms for `SellerProductUpload`, `SellerProductEdit`, and the `SellerAnalyticsDashboard`.

## 2. Learn Culture (Education)

Focuses on courses and digital learning.

- **Pages**: `src/pages/LearnCulture/`
  - `LearnCulture.jsx`: Hub for educational content.
  - `Dances.jsx`, `Singing.jsx`, `Instruments.jsx`: Course category listings.
- **Components**: `src/components/ManageCourses/`
  - **Course Management**: `TeacherCourseUpload`, `TeacherCourseEdit`.
  - **Analytics**: `TeacherAnalyticsDashboard` for tracking student enrollment and revenue.
  - **CardHandling**: Specific components for rendering Course Cards in various states (Draft, Active, Enrolled).

## 3. Shared Components

To maintain design consistency, both modules share UI elements from `src/components/ui/` and `src/components/Common/`.

- **Buttons**: Unified button styles.
- **Modals/Dialogs**: Consistent interaction patterns.
- **Carousels**: Used in both Hero sections and Product/Course lists.
