import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { cn } from "../../../lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Spinner } from "../ui/spinner";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { FaArrowLeft } from "react-icons/fa";
import Rive from "../../Rive";
import API from "../../Configs/ApiEndpoints";

export default function ForgotPasswordForm({ className, ...props }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    try {
      const formData = new URLSearchParams();
      formData.append("email", email);

      const response = await fetch(
        API.FORGOT_PASSWORD,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          credentials: "include",
          body: formData.toString(),
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        toast.success(`Verification code sent to ${email}`);

        // Navigate with otpEmail in state
        navigate("/forgotpasswordotp", {
          state: { otpEmail: email },
          replace: true,
        });
      } else {
        setFieldErrors({ email: result.message || "Email is not registered" });
      }
    } catch (error) {
      setFieldErrors({ email: "Failed to send code: " + error.message });
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
                <h1 className="text-2xl font-bold">Forgot Password?</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Enter your registered email address to receive a verification
                  code.
                </p>
              </Field>

              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.email || ""}
                </p>
              </Field>

              <Field className="mt-3">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Spinner className="w-4 h-4" />
                      Sending...
                    </div>
                  ) : (
                    "Send Verification Code"
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
