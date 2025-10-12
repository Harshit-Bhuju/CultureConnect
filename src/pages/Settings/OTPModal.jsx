import React, { useState, useEffect, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Spinner } from "../../components/ui/spinner";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../../components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../../components/ui/input-otp";
import { X } from "lucide-react";

export default function OTPModal({ 
  isOpen, 
  onClose, 
  onVerify,
  onResend,
  title = "Enter verification code",
  description = "We sent a 6-digit code to your email"
}) {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const autoSubmitRef = useRef(false);

  // Countdown timer
  useEffect(() => {
    if (isOpen && timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, isOpen]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp("");
      setTimer(60);
      setCanResend(false);
      setLoading(false);
      setErrorMsg("");
      autoSubmitRef.current = false;
    }
  }, [isOpen]);

  // Auto-submit when OTP is fully entered
  useEffect(() => {
    if (otp.length === 6 && !autoSubmitRef.current && isOpen) {
      autoSubmitRef.current = true;
      handleVerify();
    } else if (otp.length < 6) {
      autoSubmitRef.current = false;
    }
  }, [otp, isOpen]);

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    
    setLoading(true);
    setErrorMsg("");

    try {
      await onVerify(otp);
      // Success handling is done by parent component
    } catch (error) {
      setOtp("");
      setErrorMsg(error.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      await onResend();
      setTimer(60);
      setCanResend(false);
      setOtp("");
      setErrorMsg("");
    } catch (error) {
      setErrorMsg(error.message || "Failed to resend OTP.");
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md relative animate-in fade-in zoom-in duration-200">
        <CardContent className="p-6">
          <button
            onClick={handleClose}
            disabled={loading}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify();
            }}
            className="flex flex-col gap-6"
          >
            <FieldGroup>
              <Field className="items-center text-center">
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="text-muted-foreground text-sm">
                  {description}
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
                  containerClassName="gap-4"
                >
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

              <Field>
                <Button 
                  type="submit" 
                  disabled={loading || otp.length !== 6}
                  className="w-full"
                >
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
                      className="underline cursor-pointer hover:text-foreground"
                      onClick={handleResend}
                    >
                      Resend verification code
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      Resend code in {timer}s
                    </span>
                  )}
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}