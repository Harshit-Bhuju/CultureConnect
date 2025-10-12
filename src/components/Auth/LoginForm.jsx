import React, { useState, useEffect } from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Spinner } from "../ui/spinner";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "../ui/Field";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Rive from "../../Rive";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import GoogleLoginButton from "./GoogleLoginButton";

export default function LoginForm({ className, mode = "login", ...props }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [signState, setSignState] = useState(mode === "login" ? "Login" : "Create Account");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSignState(mode === "login" ? "Login" : "Create Account");
  }, [mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value.replace(/\s/g, "") });
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Signup validation
    if (signState !== "Login") {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/;
      let firstError = "";
      if (!passwordRegex.test(form.password))
        firstError =
          "Password must be 8-16 characters, include uppercase, lowercase, a number, and a symbol.";
      else if (form.password !== form.confirmPassword)
        firstError = "Passwords do not match.";

      if (firstError) {
        setFieldErrors({ password: firstError });
        setLoading(false);
        return;
      }
    }

    setFieldErrors({});

    try {
      const formData = new URLSearchParams();
      formData.append("email", form.email);
      formData.append("password", form.password);

      const endpoint =
        signState === "Login"
          ? "http://localhost/CultureConnect/backend/login.php"
          : "http://localhost/CultureConnect/backend/signup.php";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include", // Important: include cookies for session
        body: formData.toString(),
      });

      const result = await response.json();
      if (result.status === "success") {
        if (result.user) login(result.user);

        toast.success(
          signState === "Login"
            ? "Logged in successfully!"
            : "Account created successfully!"
        );

        if (signState !== "Login") {
          // Navigate to OTP page for signup
          navigate("/otp", {
            state: { source: "signup", redirectTo: "/" },
            replace: true,
          });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        setFieldErrors({ password: result.message || "Something went wrong!" });
      }
    } catch (error) {
      console.error(`${signState} error:`, error);
      setFieldErrors({ password: error.message || "Something went wrong!" });
    } finally {
      setLoading(false);
    }
  };

  const switchToOther = () => {
    if (signState === "Login") navigate("/signup");
    else navigate("/login");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup className={cn(signState === "Login" ? "gap-6" : "gap-4")}>
              {/* Header */}
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">
                  {signState === "Login" ? "Welcome back" : "Create your account"}
                </h1>
                <p className="text-muted-foreground text-balance">
                  {signState === "Login"
                    ? "Login to your CultureConnect account"
                    : "Enter your email below to create your account"}
                </p>
              </div>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email" className="mx-1.5">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                {signState !== "Login" && (
                  <p className="text-muted-foreground text-sm">
                    We'll use this to contact you. We will not share your email with anyone else.
                  </p>
                )}
              </Field>

              {/* Password Fields */}
              <Field>
                {signState === "Login" ? (
                  <div className="flex flex-col w-full relative gap-2.5">
                    <div className="flex justify-between gap-2.5">
                      <FieldLabel htmlFor="password" className="mx-1.5">
                        Password
                      </FieldLabel>
                      <a
                        href=""
                        className="text-sm underline-offset-2 hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/forgotpassword");
                        }}
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-10 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <p className="text-red-500 text-sm ">
                      {fieldErrors.password || ""}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    <div className="flex gap-4">
                      {/* Password */}
                      <div className="flex flex-col w-1/2 relative gap-2.5">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={form.password}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-10 text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>

                      {/* Confirm Password */}
                      <div className="flex flex-col w-1/2 relative gap-2.5">
                        <FieldLabel htmlFor="confirm-password">
                          Confirm Password
                        </FieldLabel>
                        <Input
                          id="confirm-password"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-10 text-gray-500"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    {/* Error Message Full Width */}
                    <p className="text-red-500 text-sm mt-1 min-h-[2rem]">
                      {fieldErrors.password || (
                        <span className="text-muted-foreground text-balance">
                          Enter a strong password!
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </Field>

              {/* Submit */}
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Spinner className="w-4 h-4" />
                      {signState === "Login" ? "Logging..." : "Creating..."}
                    </div>
                  ) : (
                    signState
                  )}
                </Button>
              </Field>

              {/* OR separator */}
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              {/* Google login */}
              <Field className="grid grid-cols-3 gap-4">
                <div className="col-span-3 flex justify-center">
                  <GoogleLoginButton />
                </div>
              </Field>

              {/* Switch login/signup */}
              <FieldDescription className="text-center">
                {signState === "Login" ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <span className="cursor-pointer underline" onClick={switchToOther}>
                      Sign Up
                    </span>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <span className="cursor-pointer underline" onClick={switchToOther}>
                      Sign In
                    </span>
                  </>
                )}
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="bg-muted relative hidden md:block">
            <Rive />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}