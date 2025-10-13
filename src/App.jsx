import { Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loading from "./components/Common/Loading";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import PublicRoute from "./components/Auth/PublicRoute";
import FlowRoute from "./components/Auth/FlowRoute";
import { Toaster } from "react-hot-toast";

// Lazy load all pages
const Home = lazy(() => import("./pages/Home/Home"));
const Login = lazy(() => import("./pages/Login/Login"));
const SignUp = lazy(() => import("./pages/SignUp/SignUp"));
const OTP = lazy(() => import("./pages/Otp/Otp"));
const ForgotPassword = lazy(() =>
  import("./pages/ForgotPassword/ForgotPassword")
);
const ForgotPasswordOtp = lazy(() =>
  import("./pages/ForgotPassword/ForgotPasswordOtp")
);
const ChangePassword = lazy(() =>
  import("./pages/ChangePassword/ChangePassword")
);
const SetPassword = lazy(() => import("./pages/SetPassword/SetPassword"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

// Learn Culture pages
const LearnCulture = lazy(() => import("./pages/LearnCulture/LearnCulture"));
const Dances = lazy(() => import("./pages/LearnCulture/Dances"));
const Singing = lazy(() => import("./pages/LearnCulture/Singing"));
const LCInstruments = lazy(() => import("./pages/LearnCulture/Instruments"));
const ArtCrafts = lazy(() => import("./pages/LearnCulture/ArtCrafts"));

// Marketplace pages
const MarketPlace = lazy(() => import("./pages/Marketplace/Marketplace"));
const TraditionalClothing = lazy(() =>
  import("./pages/Marketplace/TraditionalClothing")
);
const Instruments = lazy(() => import("./pages/Marketplace/Instruments"));
const Arts = lazy(() => import("./pages/Marketplace/Arts"));
const Decorations = lazy(() => import("./pages/Marketplace/Decorations"));

// Activity pages
const Activity = lazy(() => import("./pages/Activity/Activity"));
const ActivityGeneral = lazy(() => import("./pages/Activity/General"));
const ActivityTeam = lazy(() => import("./pages/Activity/Team"));
const ActivityBilling = lazy(() => import("./pages/Activity/Billing"));
const ActivityLimits = lazy(() => import("./pages/Activity/Limits"));

// Settings pages (lazy-loaded)
const Settings = lazy(() => import("./pages/Settings/Settings"));
const Personal_Settings = lazy(() =>
  import("./pages/Settings/Personal_Settings")
);
const Password_Settings = lazy(() =>
  import("./pages/Settings/Password_Settings")
);
const Delete_Accounts = lazy(() =>
  import("./pages/Settings/Delete_Accounts")
);

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Suspense fallback={<Loading message="Loading page..." />}>
        <Routes>
          {/* ---------------------- Protected Routes ---------------------- */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Marketplace with nested routes */}
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <MarketPlace />
              </ProtectedRoute>
            }
          >
            <Route path="traditional" element={<TraditionalClothing />} />
            <Route path="instruments" element={<Instruments />} />
            <Route path="arts" element={<Arts />} />
            <Route path="decorations" element={<Decorations />} />
          </Route>

          {/* Learn Culture with nested routes */}
          <Route
            path="/learnculture"
            element={
              <ProtectedRoute>
                <LearnCulture />
              </ProtectedRoute>
            }
          >
            <Route path="dances" element={<Dances />} />
            <Route path="singing" element={<Singing />} />
            <Route path="instruments" element={<LCInstruments />} />
            <Route path="art" element={<ArtCrafts />} />
          </Route>

          {/* Activity with nested routes */}
          <Route
            path="/activity"
            element={
              <ProtectedRoute>
                <Activity />
              </ProtectedRoute>
            }
          >
            <Route path="general" element={<ActivityGeneral />} />
            <Route path="team" element={<ActivityTeam />} />
            <Route path="billing" element={<ActivityBilling />} />
            <Route path="limits" element={<ActivityLimits />} />
          </Route>

          {/* Settings with nested routes */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="personal" />} />
            <Route path="personal" element={<Personal_Settings />} />
            <Route path="security" element={<Password_Settings />} />
            <Route path="delete" element={<Delete_Accounts />} />
          </Route>

          {/* ---------------------- Public Routes ------------------------- */}
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

          {/* ---------------------- Flow-Based Routes -------------------- */}
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

          {/* ---------------------- Fallback ---------------------------- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
