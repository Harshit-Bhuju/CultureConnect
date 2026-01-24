import { Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuth } from "./context/AuthContext";
import Loading from "./components/Common/Loading";
import ProtectedRoute from "./components/Auth/Route/ProtectedRoute";
import PublicRoute from "./components/Auth/Route/PublicRoute";
import FlowRoute from "./components/Auth/Route/FlowRoute";
import { Toaster } from "react-hot-toast";

// Lazy load all pages
const Home = lazy(() => import("./pages/Home/Home"));
const Login = lazy(() => import("./pages/Login/Login"));
const SignUp = lazy(() => import("./pages/SignUp/SignUp"));
const OTP = lazy(() => import("./pages/Otp/Otp"));
const ForgotPassword = lazy(
  () => import("./pages/ForgotPassword/ForgotPassword"),
);
const ForgotPasswordOtp = lazy(
  () => import("./pages/ForgotPassword/ForgotPasswordOtp"),
);
const ChangePassword = lazy(
  () => import("./pages/ChangePassword/ChangePassword"),
);
const SetPassword = lazy(() => import("./pages/SetPassword/SetPassword"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const Notification = lazy(() => import("./pages/Notification/Notification"));
const DocumentationPage = lazy(
  () => import("./pages/Documentation/DocumentationPage"),
);
const DocContent = lazy(
  () => import("./pages/Documentation/components/DocContent"),
);
const DocTeam = lazy(() => import("./pages/Documentation/components/DocTeam"));
const PrivacyPolicy = lazy(
  () => import("./pages/Documentation/components/PrivacyPolicy"),
);
const TermsOfService = lazy(
  () => import("./pages/Documentation/components/TermsOfService"),
);

// Learn Culture pages
const LearnCulture = lazy(() => import("./pages/LearnCulture/LearnCulture"));
const Dances = lazy(() => import("./pages/LearnCulture/Dances"));
const Singing = lazy(() => import("./pages/LearnCulture/Singing"));
const LCInstruments = lazy(() => import("./pages/LearnCulture/Instruments"));
const ArtCrafts = lazy(() => import("./pages/LearnCulture/ArtCrafts"));

// Marketplace pages
const MarketPlace = lazy(() => import("./pages/Marketplace/Marketplace"));
const TraditionalClothing = lazy(
  () => import("./pages/Marketplace/TraditionalClothing"),
);
const Instruments = lazy(() => import("./pages/Marketplace/Instruments"));
const Arts = lazy(() => import("./pages/Marketplace/Arts"));
// Decorations merged into Arts

const SellerProductUpload = lazy(
  () => import("./components/ManageProducts/CardHandling/SellerProductUpload"),
);
const SellerProductEdit = lazy(
  () =>
    import("./components/ManageProducts/CardHandling/SellerProductEditPage"),
);
const ProductDetailRouter = lazy(
  () => import("./components/Products/ProductRouter/ProductDetailRouter"),
);
const SellerAnalyticsDashboard = lazy(
  () =>
    import("./components/ManageProducts/Analytics/SellerAnalyticsDashboard"),
);
const DraftProducts = lazy(
  () => import("./components/ManageProducts/Drafts/Drafts"),
);

// Settings pages
const Settings = lazy(() => import("./pages/Settings/Settings"));
const Personal_Settings = lazy(
  () => import("./pages/Settings/Personal_Settings"),
);
const Password_Settings = lazy(
  () => import("./pages/Settings/Password_Settings"),
);
const AdminProtectedRoute = lazy(
  () => import("./components/Auth/Route/AdminProtectedRoute"),
);
const AdminPanel = lazy(() => import("./AdminPage/AdminDashboard"));
const ProtectedSellerRoute = lazy(
  () => import("./components/Auth/Route/ProtectedSellerRoute"),
);
const SellerRegistrationRoute = lazy(
  () => import("./components/Auth/Route/SellerRegistrationRoute"),
);

// Teacher pages
const TeacherRegistration = lazy(
  () => import("./pages/Teacher/Teacher_Registration"),
);
const TeacherProfile = lazy(() => import("./pages/Teacher/Teacher_Profile"));
const CustomizeTeacherProfile = lazy(
  () => import("./pages/Teacher/CustomizeTeacherProfile"),
);
const CourseManagement = lazy(
  () => import("./pages/Teacher/ManageCourses/CourseManagement"),
);
const TeacherCourseUpload = lazy(
  () =>
    import("./components/ManageCourses/CardHandling/TeacherCourseUpload/TeacherCourseUpload"),
);
const TeacherCourseEditPage = lazy(
  () =>
    import("./components/ManageCourses/CardHandling/TeacherCourseEdit/TeacherCourseEditPage"),
);
const TeacherAnalyticsDashboard = lazy(
  () =>
    import("./components/ManageCourses/Analytics/TeacherAnalyticsDashboard"),
);
const DraftCourses = lazy(
  () => import("./components/ManageCourses/Drafts/DraftCourses"),
);

// Course pages
const CourseDetailRouter = lazy(
  () => import("./components/Auth/Route/TeacherRoute/CourseDetailRouter"),
);

// Protected Teacher Route component
const ProtectedTeacherRoute = lazy(
  () => import("./components/Auth/Route/TeacherRoute/ProtectedTeacherRoute"),
);

// Seller pages
const Seller = lazy(() => import("./pages/BeSeller/Seller"));
const SellerProfile = lazy(() => import("./pages/BeSeller/SellerProfile"));
const CustomizeProfile = lazy(
  () => import("./pages/BeSeller/CustomiseProfile"),
);
const ProductManagement = lazy(
  () => import("./pages/BeSeller/ProductManagement"),
);

// Checkout & Cart
const CheckOutPage = lazy(() => import("./pages/CheckOut/CheckOutPage"));
const CourseCheckOutPage = lazy(
  () => import("./pages/CheckOut/CourseCheckOutPage"),
);
const CartPage = lazy(() => import("./pages/Cart/CartPage"));
const MyCourses = lazy(() => import("./pages/MyCourses/MyCourses"));
const FollowingPage = lazy(() => import("./pages/Following/FollowingPage"));
const FollowersPage = lazy(() => import("./pages/Followers/FollowersPage"));

// Admin sub-pages
const AdminOverview = lazy(
  () => import("./AdminPage/components/AdminOverview"),
);
const AdminTeacherApprovals = lazy(
  () => import("./AdminPage/components/AdminTeacherApprovals"),
);
const AdminUserManagement = lazy(
  () => import("./AdminPage/components/AdminUserManagement"),
);

const AdminAnalytics = lazy(
  () => import("./AdminPage/components/AdminAnalytics"),
);
const AdminHomepageContent = lazy(
  () => import("./AdminPage/components/AdminHomepageContent"),
);

// Home Route Wrapper
function HomeRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading message="Loading..." />;
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  );
}

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Suspense fallback={<Loading message="Loading page..." />}>
        <Routes>
          {/* ==================== Home Route ==================== */}
          <Route path="/" element={<HomeRoute />} />

          {/* ==================== Admin Panel ==================== */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminPanel />
              </AdminProtectedRoute>
            }>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<AdminOverview />} />
            <Route path="teachers" element={<AdminTeacherApprovals />} />
            <Route path="users" element={<AdminUserManagement />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="homepage" element={<AdminHomepageContent />} />
          </Route>

          {/* ==================== Marketplace Routes ==================== */}
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <MarketPlace />
              </ProtectedRoute>
            }>
            <Route path="traditional" element={<TraditionalClothing />} />
            <Route path="instruments" element={<Instruments />} />
            <Route path="arts_decors" element={<Arts />} />
            {/* Decorations merged into arts_decors */}
          </Route>

          {/* Customer Product Detail View */}
          <Route
            path="/products/:sellerId/:id"
            element={
              <ProtectedRoute>
                <ProductDetailRouter />
              </ProtectedRoute>
            }
          />

          {/* ==================== Seller Routes ==================== */}
          <Route
            path="/seller-registration"
            element={
              <SellerRegistrationRoute>
                <Seller />
              </SellerRegistrationRoute>
            }
          />

          <Route
            path="/sellerprofile/:id"
            element={
              <ProtectedRoute>
                <SellerProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customiseprofile"
            element={
              <ProtectedSellerRoute>
                <CustomizeProfile />
              </ProtectedSellerRoute>
            }
          />

          <Route
            path="/seller/manageproducts/:sellerId"
            element={
              <ProtectedSellerRoute>
                <ProductManagement />
              </ProtectedSellerRoute>
            }
          />

          <Route
            path="/seller/analytics/:sellerId"
            element={
              <ProtectedSellerRoute>
                <SellerAnalyticsDashboard />
              </ProtectedSellerRoute>
            }
          />

          <Route
            path="/seller/drafts/:sellerId"
            element={
              <ProtectedSellerRoute>
                <DraftProducts />
              </ProtectedSellerRoute>
            }
          />

          <Route
            path="/seller/products/new/:sellerId"
            element={
              <ProtectedSellerRoute>
                <SellerProductUpload />
              </ProtectedSellerRoute>
            }
          />

          <Route
            path="/seller/products/edit/:sellerId/:id"
            element={
              <ProtectedSellerRoute>
                <SellerProductEdit />
              </ProtectedSellerRoute>
            }
          />

          <Route
            path="/seller/products/:sellerId/:id"
            element={
              <ProtectedRoute>
                <ProductDetailRouter />
              </ProtectedRoute>
            }
          />

          {/* ==================== Teacher Routes ==================== */}
          <Route
            path="/teacher-registration"
            element={
              <ProtectedRoute>
                <TeacherRegistration />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacherprofile/:id"
            element={
              <ProtectedRoute>
                <TeacherProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customise-teacher-profile"
            element={
              <ProtectedTeacherRoute>
                <CustomizeTeacherProfile />
              </ProtectedTeacherRoute>
            }
          />

          <Route
            path="/teacher/manageclasses/:teacherId"
            element={
              <ProtectedTeacherRoute>
                <CourseManagement />
              </ProtectedTeacherRoute>
            }
          />

          <Route
            path="/teacher/courses/new/:teacherId"
            element={
              <ProtectedTeacherRoute>
                <TeacherCourseUpload />
              </ProtectedTeacherRoute>
            }
          />

          <Route
            path="/teacher/courses/edit/:teacherId/:id"
            element={
              <ProtectedTeacherRoute>
                <TeacherCourseEditPage />
              </ProtectedTeacherRoute>
            }
          />

          <Route
            path="/teacher/analytics/:teacherId"
            element={
              <ProtectedTeacherRoute>
                <TeacherAnalyticsDashboard />
              </ProtectedTeacherRoute>
            }
          />

          <Route
            path="/teacher/drafts/:teacherId"
            element={
              <ProtectedTeacherRoute>
                <DraftCourses />
              </ProtectedTeacherRoute>
            }
          />

          {/* ==================== Course Routes ==================== */}
          {/* Course Detail - Auto-detects if teacher or student */}
          <Route
            path="/courses/:teacherId/:id"
            element={
              <ProtectedRoute>
                <CourseDetailRouter />
              </ProtectedRoute>
            }
          />

          {/* ==================== Checkout & Cart Routes ==================== */}
          <Route
            path="/checkout/:sellerId/:productId"
            element={
              <ProtectedRoute>
                <CheckOutPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout/payment/:sellerId/:productId"
            element={
              <ProtectedRoute>
                <CheckOutPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout/confirmation/:sellerId/:productId"
            element={
              <ProtectedRoute>
                <CheckOutPage />
              </ProtectedRoute>
            }
          />

          {/* ==================== Course Checkout & Learning ==================== */}
          <Route
            path="/course/checkout/:teacherId/:courseId"
            element={
              <ProtectedRoute>
                <CourseCheckOutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course/checkout/payment/:teacherId/:courseId"
            element={
              <ProtectedRoute>
                <CourseCheckOutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course/checkout/confirmation/:teacherId/:courseId"
            element={
              <ProtectedRoute>
                <CourseCheckOutPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mycourses"
            element={
              <ProtectedRoute>
                <MyCourses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/following"
            element={
              <ProtectedRoute>
                <FollowingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notification />
              </ProtectedRoute>
            }
          />

          {/* Followers Pages */}
          <Route
            path="/sellerprofile/:sellerId/followers"
            element={
              <ProtectedRoute>
                <FollowersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacherprofile/:teacherId/followers"
            element={
              <ProtectedRoute>
                <FollowersPage />
              </ProtectedRoute>
            }
          />

          {/* ==================== Learn Culture Routes ==================== */}
          <Route
            path="/learnculture"
            element={
              <ProtectedRoute>
                <LearnCulture />
              </ProtectedRoute>
            }>
            <Route path="dances" element={<Dances />} />
            <Route path="singing" element={<Singing />} />
            <Route path="instruments" element={<LCInstruments />} />
            <Route path="art" element={<ArtCrafts />} />
          </Route>

          {/* ==================== Settings Routes ==================== */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }>
            <Route index element={<Navigate to="personal" />} />
            <Route path="personal" element={<Personal_Settings />} />
            <Route path="security" element={<Password_Settings />} />
          </Route>

          {/* ==================== Public Routes ==================== */}
          <Route path="/documentation" element={<DocumentationPage />}>
            <Route index element={<DocContent />} />
            <Route path="team" element={<DocTeam />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsOfService />} />
          </Route>

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />

          <Route
            path="/forgotpassword"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />

          {/* ==================== Flow-Based Routes ==================== */}
          <Route
            path="/setpassword"
            element={
              <FlowRoute requiredState="email" storageKey="email">
                <SetPassword mode="set" />
              </FlowRoute>
            }
          />

          <Route
            path="/forgotpasswordotp"
            element={
              <FlowRoute requiredState="otpEmail" storageKey="otpEmail">
                <ForgotPasswordOtp />
              </FlowRoute>
            }
          />

          <Route
            path="/changepassword"
            element={
              <FlowRoute requiredState="otpEmail" storageKey="otpEmail">
                <ChangePassword mode="change" />
              </FlowRoute>
            }
          />

          <Route
            path="/otp"
            element={
              <FlowRoute requiredState="otpEmail" storageKey="otpEmail">
                <OTP />
              </FlowRoute>
            }
          />

          {/* ==================== Fallback ==================== */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
