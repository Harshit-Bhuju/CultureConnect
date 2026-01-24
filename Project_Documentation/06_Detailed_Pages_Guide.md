# Page Directory Reference (`src/pages/`)

This document provides a detailed explanation of each file within the `src/pages` directory. These files represent the main views or routes of the application.

## BeSeller/

- **`Seller.jsx`**: The landing/registration page for users exploring how to become a seller.
- **`SellerProfile.jsx`**: Public profile page for a specific seller, showing their bio and products.
- **`CustomiseProfile.jsx`**: Form for sellers to edit their profile details (bio, banner, avatar).
- **`ProductManagement.jsx`**: The main dashboard for sellers to manage their listings.
- **`CropModal.jsx`**: Helper component for cropping profile images during upload.

## Cart/

- **`CartPage.jsx`**: Displays items currently in the user's shopping cart.

## CheckOut/

- **`CheckOutPage.jsx`**: Parent wrapper for the product checkout flow.
- **`Checkout.jsx`**: Step 1: Shipping and billing details form.
- **`PaymentPage.jsx`**: Step 2: Payment method selection and processing.
- **`ConfirmationPage.jsx`**: Step 3: Success message after order placement.
- **`CourseCheckOutPage.jsx`**: Parent wrapper for the course checkout flow.
- **`CourseCheckout.jsx`**: Details form for purchasing a course.
- **`CoursePaymentPage.jsx`**: Payment step for courses.
- **`CourseConfirmationPage.jsx`**: Success message for course enrollment.

## Documentation/

- **`DocumentationPage.jsx`**: Main layout for the help center/docs area.
- **`components/DocNavbar.jsx`**: Navigation bar specific to documentation.
- **`components/DocSidebar.jsx`**: Sidebar TOC for documentation.
- **`components/DocContent.jsx`**: Renders the actual markdown/text content.
- **`components/PrivacyPolicy.jsx`**: Privacy Policy legal text.
- **`components/TermsOfService.jsx`**: Terms of Service legal text.
- **`components/DocTeam.jsx`**: "Meet the Team" page within docs.

## Home/

- **`Home.jsx`**: The main landing page of the application (`/`). Aggregates Hero, Categories, and featured sections.

## LearnCulture/

- **`LearnCulture.jsx`**: Landing page for the Education module.
- **`Dances.jsx`, `Singing.jsx`, `Instruments.jsx`, `ArtCrafts.jsx`**: Specific category pages listing courses for that topic.
- **`components/CourseCategoryPageLayout.jsx`**: A reusable template used by the category pages to ensure consistent design.

## Login/ & SignUp/ & Otp/

- **`Login.jsx`**: User login page.
- **`SignUp.jsx`**: User registration page.
- **`Otp.jsx`**: One-Time Password verification page.

## Marketplace/

- **`Marketplace.jsx`**: Main shopping landing page.
- **`TraditionalClothing.jsx`, `Instruments.jsx`, `Arts.jsx`**: Category pages for physical products.
- **`components/CategoryPageLayout.jsx`**: Reusable template for product category listings.

## Settings/

- **`Settings.jsx`**: Main layout for user account settings.
- **`Personal_Settings.jsx`**: Profile editing (Name, Email).
- **`Password_Settings.jsx`**: Security settings (Change Password).

## Teacher/

- **`Teacher_Registration.jsx`**: Signup flow for new teachers.
- **`Teacher_Profile.jsx`**: Public profile page for teachers.
- **`CustomizeTeacherProfile.jsx`**: Editor for teacher profile details.
- **`ManageCourses/CourseManagement.jsx`**: Dashboard for teachers to create and edit courses.
