import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "../../../lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Spinner } from "../ui/spinner";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import Rive from "../../Rive";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import API from "../../Configs/ApiEndpoints";

export default function ChangePasswordForm({
  mode = "change",
  className,
  ...props
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, savedAccounts, loadSavedAccounts } = useAuth();

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const config = {
    set: {
      title: "Set Your Password",
      description: "Create a password to secure your account.",
      phpEndpoint: API.SET_PASSWORD,
      submitText: "Set Password",
      fallbackRedirect: "/login",
    },
    change: {
      title: "Change Your Password",
      description: "Update your password for account security.",
      phpEndpoint: API.CHANGE_PASSWORD,
      submitText: "Change Password",
      fallbackRedirect: "/login",
    },
  };

  const { title, description, phpEndpoint, submitText, fallbackRedirect } =
    config[mode];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/;

    if (!passwordRegex.test(form.password)) {
      setFieldErrors({
        password:
          "Password must be 8–16 characters long and include uppercase, lowercase, number, and symbol.",
      });
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match." });
      setLoading(false);
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("password", form.password);

      const response = await fetch(phpEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
        body: formData.toString(),
      });

      const result = await response.json();

      if (result.status === "success") {
        // If setting password for Google login
        if (mode === "set" && result.user) {
          const userEmail = result.user.email.toLowerCase();
          const isAddingAccount = location.state?.isAddingAccount;
          const originalUserEmail = location.state?.originalUserEmail;

          if (isAddingAccount && originalUserEmail) {
            const currentUserEmail = originalUserEmail.toLowerCase();

            // Validate not adding own account
            if (userEmail === currentUserEmail) {
              toast.error("You cannot add your own account!");
              navigate("/", { replace: true });
              return;
            }

            // Validate not already saved
            const isAlreadySaved = savedAccounts.some(
              (acc) => acc.email.toLowerCase() === userEmail
            );

            if (isAlreadySaved) {
              toast.error("This account has already been added!");
              navigate("/", { replace: true });
              return;
            }

            try {
              // 1️⃣ Save the new account to original user's device
              const saveFormData = new URLSearchParams();
              saveFormData.append("original_user_email", currentUserEmail);
              saveFormData.append("account_email", userEmail);

              const saveResponse = await fetch(
                API.SAVE_ACCOUNT,
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                  body: saveFormData.toString(),
                }
              );

              const saveResult = await saveResponse.json();

              if (
                saveResult.status !== "success" &&
                saveResult.status !== "exists"
              ) {
                toast.error(saveResult.message || "Failed to save account");
                navigate("/", { replace: true });
                return;
              }

              // 2️⃣ Switch back to original user
              // 2️⃣ Stay logged in as NEW account - check session to sync
              const checkRes = await fetch(
                API.CHECK_SESSION,
                {
                  method: "GET",
                  credentials: "include",
                }
              );

              const checkResult = await checkRes.json();

              if (checkResult.status === "success" && checkResult.logged_in) {
                // Login with the NEW account
                await login(checkResult.user, true);

                setTimeout(async () => {
                  await loadSavedAccounts();
                  toast.success("Account added successfully!");
                }, 100);

                navigate("/", { replace: true });
              } else {
                toast.error("Session sync failed");
                navigate("/", { replace: true });
              }
            } catch (error) {
              console.error("Error completing add account flow:", error);
              toast.error("An error occurred while adding account");
              navigate("/", { replace: true });
            }
          } else {
            // Normal set password flow
            await login(result.user);
            toast.success(result.message || "Password set successfully!");
            navigate("/", { replace: true });
          }
        } else {
          // Change password flow
          toast.success(result.message || "Password updated successfully!");
          navigate("/login", { replace: true });
        }
      } else if (result.status === "same") {
        setFieldErrors({ password: result.message });
      } else {
        setFieldErrors({ password: result.message || "Something went wrong." });
      }
    } catch (error) {
      console.error("Password change/set error:", error);
      setFieldErrors({ password: "Network error: " + error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 md:min-h-[450px]", className)}
      {...props}>
      <Card className="flex-1 overflow-hidden p-0">
        <CardContent className="grid flex-1 p-0 md:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center p-6 md:p-8 w-full">
            <div
              className="self-start mb-4 cursor-pointer"
              onClick={() => navigate(-1)}>
              <FaArrowLeft size={20} />
            </div>

            <FieldGroup>
              <Field className="text-center">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  {description}
                </p>
              </Field>

              <Field>
                <FieldLabel className="mx-1.5">New Password</FieldLabel>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter new password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.password || (
                    <span className="text-muted-foreground">
                      Enter a strong password.
                    </span>
                  )}
                </p>
              </Field>

              <Field>
                <FieldLabel className="mx-1.5">Confirm Password</FieldLabel>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-gray-500"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.confirmPassword || (
                    <span className="text-muted-foreground">
                      Enter the same password again.
                    </span>
                  )}
                </p>
              </Field>

              <Field className="mt-3">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Spinner className="w-4 h-4" /> {submitText}...
                    </div>
                  ) : (
                    submitText
                  )}
                </Button>
              </Field>

              <FieldDescription className="text-center mt-3">
                Remembered your password?{" "}
                <span
                  className="underline cursor-pointer"
                  onClick={() => navigate("/login")}>
                  Go back to login
                </span>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="bg-muted relative hidden md:block">
            <Rive />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="text-center">
        By continuing, you agree to our{" "}
        <a href="#" className="underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
