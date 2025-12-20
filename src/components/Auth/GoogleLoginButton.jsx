import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "../ui/spinner";
import API from "../../Configs/ApiEndpoints";

export default function GoogleLoginButton({ isAddingAccount = false }) {
  const [loading, setLoading] = useState(false);
  const { login, user, savedAccounts, loadSavedAccounts } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async (tokenResponse) => {
    setLoading(true);

    try {
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
      );
      const userInfo = await userInfoResponse.json();
      const { email, picture } = userInfo;
      const loginEmail = email.toLowerCase();
      const currentUserEmail = user?.email?.toLowerCase();

      const formData = new URLSearchParams();
      formData.append("email", email);
      formData.append("picture", picture);

      const response = await fetch(API.GOOGLE_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
        body: formData.toString(),
      });

      const result = await response.json();

      if (result.status === "null") {
        // User needs to set password (first time Google login)
        toast.success("Please set your password.");
        navigate("/setpassword", {
          state: { 
            email: loginEmail,
            isAddingAccount,
            originalUserEmail: currentUserEmail,
          },
          replace: true,
        });
      }
      else if (result.status === "not_null") {
        if (isAddingAccount) {
          // Check if adding own account
          if (loginEmail === currentUserEmail) {
            toast.error("You cannot add your own account!");
            setLoading(false);
            navigate("/", { replace: true });
            return;
          }

          // Check if already saved
          const isAlreadySaved = savedAccounts.some(
            (acc) => acc.email.toLowerCase() === loginEmail
          );
          if (isAlreadySaved) {
            toast.error("This account has already been added!");
            setLoading(false);
            navigate("/", { replace: true });
            return;
          }

          // Save account to device with original user context
          const saveFormData = new URLSearchParams();
          saveFormData.append("original_user_email", currentUserEmail);
          saveFormData.append("account_email", loginEmail);

          const saveResponse = await fetch(API.SAVE_ACCOUNT, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: saveFormData.toString(),
          });

          const saveResult = await saveResponse.json();
          if (saveResult.status !== "success" && saveResult.status !== "exists") {
            toast.error(saveResult.message || "Failed to save account");
            setLoading(false);
            return;
          }

          // Stay logged in as the NEW account
          // Check session to ensure sync
          const checkRes = await fetch(API.CHECK_SESSION, {
            method: "GET",
            credentials: "include",
          });
          const checkResult = await checkRes.json();

          if (checkResult.status === "success" && checkResult.logged_in) {
            await login(checkResult.user, true);
            
            setTimeout(async () => {
              await loadSavedAccounts();
            }, 100);
            
            toast.success("Account added and logged in successfully!");
            navigate("/", { replace: true });
          } else {
            toast.error("Session sync failed");
          }
        } else {
          // Normal login - PHP already set session
          await login(result.user);
          toast.success("Logged in successfully!");
          navigate("/", { replace: true });
        }
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleLogin,
    onError: (error) => {
      console.error("Google OAuth error:", error);
      toast.error("Google login failed");
      setLoading(false);
    },
  });

  return (
    <div className="col-span-3 flex justify-center">
      <button
        type="button"
        onClick={() => googleLogin()}
        disabled={loading}
        className="flex items-center justify-center gap-3 w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? (
          <>
            <Spinner className="w-5 h-5" />
            <span className="text-sm font-medium text-gray-700">
              {isAddingAccount ? "Adding..." : "Logging in..."}
            </span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Continue with Google
            </span>
          </>
        )}
      </button>
    </div>
  );
}