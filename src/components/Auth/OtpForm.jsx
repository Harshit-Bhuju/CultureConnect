import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "../../../lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Spinner } from "../ui/spinner";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { FaArrowLeft } from "react-icons/fa";
import Rive from "../../Rive";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import API from "../../Configs/ApiEndpoints";

export default function OTPForm({ className, ...props }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, savedAccounts, loadSavedAccounts } = useAuth();

  const source = location.state?.source || "forgot";
  const isAddingAccount = location.state?.isAddingAccount || false;
  const originalUserEmail = location.state?.originalUserEmail;
  const redirectTo =
    location.state?.redirectTo ||
    (source === "forgot" ? "/changepassword" : "/");

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const otpVerifyUrl =
    source === "forgot"
      ? API.FORGOT_PASSWORD_VERIFY
      : API.SIGNUP_VERIFY;

  const autoSubmitRef = useRef(false);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  useEffect(() => {
    if (otp.length === 6 && !autoSubmitRef.current) {
      autoSubmitRef.current = true;
      handleVerify();
    } else if (otp.length < 6) {
      autoSubmitRef.current = false;
    }
  }, [otp]);

  const handleVerify = async () => {
    setLoading(true);
    setErrorMsg("");

    const formData = new URLSearchParams({ code: otp });

    try {
      const response = await fetch(otpVerifyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
        body: formData.toString(),
      });

      const result = await response.json();

      if (result.status === "success") {
        if (source === "signup" && result.user) {
          const verifiedEmail = result.user.email.toLowerCase();

          if (isAddingAccount && originalUserEmail) {
            // ADD ACCOUNT FLOW
            const currentUserEmail = originalUserEmail.toLowerCase();

            // Validate not adding own account
            if (verifiedEmail === currentUserEmail) {
              toast.error("You cannot add your own account!");
              navigate("/", { replace: true });
              return;
            }

            // Validate not already saved
            const isAlreadySaved = savedAccounts.some(
              (acc) => acc.email.toLowerCase() === verifiedEmail
            );

            if (isAlreadySaved) {
              toast.error("This account has already been added!");
              navigate("/", { replace: true });
              return;
            }

            try {
              // 1️⃣ Save the newly verified account to the original user's device
              const saveFormData = new URLSearchParams();
              saveFormData.append("original_user_email", currentUserEmail);
              saveFormData.append("account_email", verifiedEmail);

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

              // 2️⃣ Switch back to the original user
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

                // Reload saved accounts
                setTimeout(async () => {
                  await loadSavedAccounts();
                  toast.success("Account added and verified successfully!");
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
            // NORMAL SIGNUP FLOW - log in the new user
            await login(result.user);
            toast.success("Account verified successfully!");
            navigate(redirectTo, { replace: true });
          }
        } else {
          // FORGOT PASSWORD FLOW
          toast.success("OTP verified successfully!");
          navigate(redirectTo, { replace: true });
        }
      } else {
        setOtp("");
        setErrorMsg(result.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setOtp("");
      setErrorMsg("Verification failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      const response = await fetch(otpVerifyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
        body: new URLSearchParams({ action: "resend" }).toString(),
      });

      const result = await response.json();

      if (result.status === "success") {
        toast.success(result.message || "OTP resent successfully!");
        setTimer(60);
        setCanResend(false);
        setOtp("");
        setErrorMsg("");
      } else {
        setErrorMsg(result.message || "Failed to resend OTP.");
      }
    } catch (error) {
      setErrorMsg("Resend failed: " + error.message);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 md:min-h-[450px]", className)}
      {...props}>
      <Card className="flex-1 overflow-hidden p-0">
        <CardContent className="grid flex-1 p-0 md:grid-cols-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify();
            }}
            className="flex flex-col items-center justify-center p-6 md:p-8 w-full">
            <div
              className="self-start mb-4 cursor-pointer"
              onClick={() => navigate(-1)}>
              <FaArrowLeft size={20} />
            </div>

            <FieldGroup>
              <Field className="items-center text-center">
                <h1 className="text-2xl font-bold">Enter verification code</h1>
                <p className="text-muted-foreground text-sm">
                  We sent a 6-digit code to your email
                </p>
              </Field>

              <Field>
                <FieldLabel htmlFor="otp" className="sr-only">
                  Verification code
                </FieldLabel>
                <InputOTP
                  maxLength={6}
                  id="otp"
                  value={otp}
                  onChange={(value) => {
                    setOtp(value);
                    setErrorMsg("");
                  }}
                  required
                  containerClassName="gap-4">
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>

                {errorMsg && (
                  <p className="text-red-500 text-sm text-center">{errorMsg}</p>
                )}

                <FieldDescription className="text-center">
                  Enter the 6-digit code sent to your email.
                </FieldDescription>
              </Field>

              <Field className="mt-3">
                <Button type="submit" disabled={loading || otp.length !== 6}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Spinner className="w-4 h-4" />
                      Verifying...
                    </div>
                  ) : (
                    "Verify"
                  )}
                </Button>

                <FieldDescription className="text-center mt-2">
                  {canResend ? (
                    <span
                      className="underline cursor-pointer"
                      onClick={handleResend}>
                      Resend verification code
                    </span>
                  ) : (
                    <span className="text-gray-400">Wait for {timer}s</span>
                  )}
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>

          <div className="bg-muted relative hidden md:block">
            <Rive />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
