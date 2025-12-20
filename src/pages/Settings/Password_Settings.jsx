import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext';
import toast from "react-hot-toast";
import API from "../../Configs/ApiEndpoints";

const Password_Settings = () => {
  const { user } = useAuth(); 
  if (!user) return null; 

  const userEmail = user.email;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState("current");
  const [isOTPSent, setIsOTPSent] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Show/Hide password states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const popupRef = useRef(null);
  const otpInputRefs = useRef([]);

  // ------------------- Backend Helper -------------------
  const callBackend = async (data) => {
    try {
      const formData = new URLSearchParams(data);

      const response = await fetch(
       API.SETTING_PASSWORD,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          credentials: "include",
          body: formData.toString(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      console.error("Server error:", err);
      return { status: "error", message: "Server error. Try again later." };
    }
  };



  // ------------------- Reset / Modal -------------------
  const resetStates = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setCurrentStep("current");
    setIsOTPSent(false);
    setLoading(false);
    setResendTimer(0);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const openModal = () => {
    resetStates();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetStates();
  };

  // ------------------- Current Password -------------------
  const handleCurrentPasswordNext = async () => {
    setError("");
    if (!currentPassword.trim()) {
      setError("Please enter your current password");
      return;
    }

    setLoading(true);

    const result = await callBackend({
      email: userEmail,
      action: "verify_current",
      currentPassword,
    });

    setLoading(false);

    if (result.status === "success") {
      toast.success("Current password verified!");
      setCurrentStep("new");
    } else {
      setError(result.message || "Current password is incorrect");
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setLoading(true);

    const result = await callBackend({
      email: userEmail,
      action: "send_otp",
    });

    setLoading(false);

    if (result.status === "otp_sent") {
      toast.success("OTP sent to your email!");
      setIsOTPSent(true);
      setCurrentStep("otp");
      setResendTimer(60);
    } else {
      setError(result.message || "Failed to send OTP");
    }
  };

  // ------------------- OTP -------------------
  const handleOTPPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    const digits = pastedData.replace(/\D/g, "").slice(0, 6);

    if (digits.length === 6) {
      const newOtp = digits.split("");
      setOtp(newOtp);
      setError("");
      // Auto-verify immediately after paste
      verifyOTP(digits);
    }
  };

  const handleOTPChange = (index, value) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits are entered
    if (value && index === 5) {
      const otpString = newOtp.join("");
      if (otpString.length === 6) {
        verifyOTP(otpString);
      }
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = async (otpString) => {
    // Prevent duplicate calls
    if (loading) return;
    
    setLoading(true);
    setError("");

    const result = await callBackend({
      email: userEmail,
      action: "verify_otp",
      otp: otpString,
    });

    setLoading(false);

    if (result.status === "success") {
      toast.success("OTP verified successfully!");
      setCurrentStep("new");
    } else {
      setError(result.message || "Invalid OTP. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      requestAnimationFrame(() => {
        otpInputRefs.current[0]?.focus();
      });
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }
    await verifyOTP(otpString);
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0 || loading) return;
    
    setLoading(true);
    setOtp(["", "", "", "", "", ""]);
    setError("");

    const result = await callBackend({
      email: userEmail,
      action: "resend_otp",
    });

    setLoading(false);

    if (result.status === "otp_sent") {
      toast.success("OTP resent successfully!");
      setResendTimer(60);
      requestAnimationFrame(() => {
        otpInputRefs.current[0]?.focus();
      });
    } else {
      setError(result.message || "Failed to resend OTP");
    }
  };

  // ------------------- Change Password -------------------
  const handleSaveNewPassword = async () => {
    setError("");

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("All fields are required");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/;

    if (!passwordRegex.test(newPassword)) {
      setError(
        "Password must be 8–16 characters long and include uppercase, lowercase, number, and symbol."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const result = await callBackend({
      email: userEmail,
      action: "change_password",
      newPassword,
    });

    setLoading(false);

    if (result.status === "password_changed") {
      toast.success("Password changed successfully!");
      closeModal();
    } else {
      setError(result.message || "Failed to update password");
    }
  };

  // ------------------- Back Button -------------------
  const handleBack = () => {
    setError("");
    if (currentStep === "new" && isOTPSent) {
      setCurrentStep("otp");
    } else if (currentStep === "new") {
      setCurrentStep("current");
    } else if (currentStep === "otp") {
      setCurrentStep("current");
      setIsOTPSent(false);
      setOtp(["", "", "", "", "", ""]);
    }
  };

  // ------------------- Effects -------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        closeModal();
      }
    };
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const getTitle = () => {
    if (currentStep === "current") return "Verify Current Password";
    if (currentStep === "otp") return "Verify OTP";
    return "Set New Password";
  };

  const getButtonText = () => {
    if (currentStep === "current") return "Next";
    if (currentStep === "otp") return "Verify OTP";
    return "Save Changes";
  };

  const handlePrimaryAction = () => {
    if (loading) return;
    if (currentStep === "current") handleCurrentPasswordNext();
    else if (currentStep === "otp") handleVerifyOTP();
    else handleSaveNewPassword();
  };

  // ------------------- JSX -------------------
  return (
    <div className="max-w-full sm:max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Password & Security
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Manage your password and security settings
        </p>
      </div>

      {/* Change Password Card */}
      <div className="space-y-3">
        <div
          onClick={openModal}
          className="flex justify-between items-center bg-white rounded-xl p-4 sm:p-5 shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all duration-200"
        >
          <div className="flex-1">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">
              Change Password
            </p>
            <p className="text-gray-800 font-medium text-base">••••••••</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[1000]">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div
            ref={popupRef}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl w-full max-w-md relative mx-4"
            style={{
              animation: "slideIn 0.2s ease-out"
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {currentStep !== "current" && (
                  <button
                    onClick={handleBack}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-all"
                    disabled={loading}
                  >
                    <FaArrowLeft size={18} />
                  </button>
                )}
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  {getTitle()}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-all"
                disabled={loading}
              >
                <X size={22} />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 mb-6">
              {/* Current Password Step */}
              {currentStep === "current" && (
                <>
                  <div>
                    <label className="text-sm text-gray-600 font-medium mb-2 block">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => {
                          setCurrentPassword(e.target.value);
                          setError("");
                        }}
                        className="border-2 border-gray-200 rounded-xl p-3 pr-12 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Enter your current password"
                        autoFocus
                        disabled={loading}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !loading)
                            handleCurrentPasswordNext();
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={loading}
                      >
                        {showCurrentPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={handleForgotPassword}
                      className="text-blue-600 text-sm hover:underline font-medium disabled:opacity-50 "
                      disabled={loading}
                    >
                      Forgot Password?
                    </button>
                  </div>
                </>
              )}

              {/* OTP Step */}
              {currentStep === "otp" && (
                <>
                  <p className="text-gray-600 text-sm mb-4">
                    Enter the 6-digit code sent to <strong>{userEmail}</strong>
                  </p>
                  <div className="flex gap-2 justify-center mb-4">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpInputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        onKeyDown={(e) => handleOTPKeyDown(index, e)}
                        onPaste={index === 0 ? handleOTPPaste : undefined}
                        className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 "
                        disabled={loading}
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                  <div className="text-center">
                    <button
                      onClick={handleResendOTP}
                      className="text-blue-600 text-sm hover:underline font-medium disabled:opacity-50 "
                      disabled={loading || resendTimer > 0}
                    >
                      {resendTimer > 0
                        ? `Resend OTP in ${resendTimer}s`
                        : "Resend OTP"}
                    </button>
                  </div>
                </>
              )}

              {/* New Password Step */}
              {currentStep === "new" && (
                <>
                  <div>
                    <label className="text-sm text-gray-600 font-medium mb-2 block">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setError("");
                        }}
                        className="border-2 border-gray-200 rounded-xl p-3 pr-12 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Enter new password"
                        autoFocus
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={loading}
                      >
                        {showNewPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Must be 8-16 characters with uppercase, lowercase, number, and symbol
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 font-medium mb-2 block">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setError("");
                        }}
                        className="border-2 border-gray-200 rounded-xl p-3 pr-12 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Confirm new password"
                        disabled={loading}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !loading)
                            handleSaveNewPassword();
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={loading}
                      >
                        {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all font-medium disabled:opacity-50 "
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handlePrimaryAction}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 "
                disabled={loading}
              >
                {loading ? "Processing..." : getButtonText()}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Password_Settings;