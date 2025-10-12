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

export default function ChangePasswordForm({ mode = "change", className, ...props }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const config = {
    set: {
      title: "Set Your Password",
      description: "Create a password to secure your account.",
      phpEndpoint: "http://localhost/CultureConnect/backend/setpassword.php",
      submitText: "Set Password",
      fallbackRedirect: "/login",
    },
    change: {
      title: "Change Your Password",
      description: "Update your password for account security.",
      phpEndpoint: "http://localhost/CultureConnect/backend/changePassword.php",
      submitText: "Change Password",
      fallbackRedirect: "/login",
    },
  };

  const { title, description, phpEndpoint, submitText, fallbackRedirect } = config[mode];

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
        credentials: "include", // Include session cookies
        body: formData.toString(),
      });

      const result = await response.json();

      if (result.status === "success") {
        toast.success(result.message || "Password updated successfully!");

        // If setting password for Google login, update user in context
        if (mode === "set" && result.user) {
          login(result.user);
        }

        // Redirect after success
        setTimeout(() => {
          navigate(mode === "set" ? "/" : "/login", { replace: true });
        }, 1000);
      } else if (result.status === "same") {
        setFieldErrors({ password: result.message });
      } else {
        setFieldErrors({ password: result.message || "Something went wrong." });
      }
    } catch (error) {
      setFieldErrors({ password: "Network error: " + error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 md:min-h-[450px]", className)} {...props}>
      <Card className="flex-1 overflow-hidden p-0">
        <CardContent className="grid flex-1 p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="flex flex-col justify-center p-6 md:p-8 w-full">
            <div className="self-start mb-4 cursor-pointer" onClick={() => navigate(-1)}>
              <FaArrowLeft size={20} />
            </div>

            <FieldGroup>
              <Field className="text-center">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-muted-foreground text-sm mt-1">{description}</p>
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
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.password || <span className="text-muted-foreground">Enter a strong password.</span>}
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.confirmPassword || <span className="text-muted-foreground">Enter the same password again.</span>}
                </p>
              </Field>

              <Field className="mt-3">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Spinner className="w-4 h-4" /> {submitText}...
                    </div>
                  ) : submitText}
                </Button>
              </Field>

              <FieldDescription className="text-center mt-3">
                Remembered your password?{" "}
                <span className="underline cursor-pointer" onClick={() => navigate("/login")}>
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
        <a href="#" className="underline">Terms of Service</a> and{" "}
        <a href="#" className="underline">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}