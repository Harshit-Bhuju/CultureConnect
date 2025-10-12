import React, { useState, useRef, useEffect } from "react";
import { X, Check, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

// OTP Modal Component
const OTPModal = ({ isOpen, onClose, onVerify, onResend, title, description }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await onVerify(otpString);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await onResend();
      setOtp(["", "", "", "", "", ""]);
      setError("");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1100]">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl w-full max-w-md relative animate-in zoom-in-95 fade-in duration-200 mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-all"
          >
            <X size={22} />
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-6">{description}</p>

        <div className="flex gap-2 justify-center mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-3"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="text-center">
          <button
            onClick={handleResend}
            disabled={loading}
            className="text-blue-600 text-sm hover:underline font-medium disabled:opacity-50"
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Password Settings Component
const Password_Settings = () => {
  const [editingField, setEditingField] = useState(null);
  const [step, setStep] = useState("current"); // "current" | "new"
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const popupRef = useRef(null);

  const openEditPopup = () => {
    setEditingField("password");
    setStep("current");
    setForgotPasswordMode(false);
    setForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError("");
    setSuccess(false);
  };

  const handleCancel = () => {
    setEditingField(null);
    setStep("current");
    setForgotPasswordMode(false);
    setForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError("");
    setSuccess(false);
    setShowOTPModal(false);
  };

  const handleNext = () => {
    setError("");

    if (step === "current") {
      if (!form.currentPassword) {
        setError("Please enter your current password");
        return;
      }

      // Frontend validation - password entered
      setStep("new");
    }

    if (step === "new") {
      if (!form.newPassword || !form.confirmPassword) {
        setError("All fields are required");
        return;
      }
      if (form.newPassword !== form.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (form.newPassword.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      // Simulate success
      setSuccess(true);
      toast.success("Password changed successfully!");
      setTimeout(() => handleCancel(), 1500);
    }
  };

  // Handle OTP verification
  const handleOTPVerify = async (otp) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (otp === "123456") {
          // Demo OTP for testing
          toast.success("OTP verified successfully!");
          setShowOTPModal(false);
          setStep("new");
          resolve();
        } else {
          reject(new Error("Invalid OTP"));
        }
      }, 1000);
    });
  };

  // Handle OTP resend
  const handleOTPResend = async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        toast.success("OTP resent successfully!");
        resolve();
      }, 500);
    });
  };

  // Handle "Forgot Password" click - send OTP
  const handleForgotPassword = () => {
    setForgotPasswordMode(true);
    toast.success("OTP sent to your email!");
    setShowOTPModal(true);
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        handleCancel();
      }
    };
    if (editingField) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [editingField]);

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
          onClick={openEditPopup}
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

      {/* Password Change Modal */}
      {editingField && (
        <div className="fixed inset-0 flex items-center justify-center z-[1000]">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div
            ref={popupRef}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl w-full max-w-md relative animate-in zoom-in-95 fade-in duration-200 mx-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {step === "new" && !forgotPasswordMode && (
                  <button
                    onClick={() => setStep("current")}
                    className="text-gray-400 hover:text-gray-600 transition-all"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  {step === "current"
                    ? "Verify Current Password"
                    : "Set New Password"}
                </h3>
              </div>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-all"
              >
                <X size={22} />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4">
              {step === "current" && (
                <>
                  <div>
                    <label className="text-sm text-gray-600 font-medium mb-2 block">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={form.currentPassword}
                      onChange={(e) =>
                        setForm({ ...form, currentPassword: e.target.value })
                      }
                      className="border-2 border-gray-200 rounded-xl p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Enter your current password"
                    />
                  </div>
                  <div className="text-right">
                    <button
                      onClick={handleForgotPassword}
                      className="text-blue-600 text-sm hover:underline font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </>
              )}

              {step === "new" && (
                <>
                  <div>
                    <label className="text-sm text-gray-600 font-medium mb-2 block">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={form.newPassword}
                      onChange={(e) =>
                        setForm({ ...form, newPassword: e.target.value })
                      }
                      className="border-2 border-gray-200 rounded-xl p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 font-medium mb-2 block">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm({ ...form, confirmPassword: e.target.value })
                      }
                      className="border-2 border-gray-200 rounded-xl p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Confirm new password"
                    />
                  </div>
                </>
              )}

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              {success && (
                <p className="text-green-600 text-sm flex items-center gap-1">
                  <Check size={16} /> Password changed successfully
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-md hover:shadow-lg"
              >
                {step === "new" ? "Save Changes" : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerify={handleOTPVerify}
        onResend={handleOTPResend}
        title="Verify Your Identity"
        description="Enter the 6-digit code sent to your email"
      />
    </div>
  );
};

export default Password_Settings;