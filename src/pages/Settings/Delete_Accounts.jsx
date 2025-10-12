import React, { useState, useRef, useEffect } from "react";
import { X, Trash2, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Delete_Accounts = () => {
  const { user: authUser, logout } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const popupRef = useRef(null);

  const openConfirmModal = () => {
    setConfirmOpen(true);
    setPassword("");
    setError("");
    setSuccess(false);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setPassword("");
    setError("");
  };

  const handleDelete = async () => {
    if (!password) {
      setError("Please enter your password to confirm.");
      return;
    }

    try {
      setError("");

      // Prepare form data in x-www-form-urlencoded format
      const formData = new URLSearchParams();
      formData.append("password", password);

      const response = await fetch(
        "http://localhost/CultureConnect/backend/deleteAccount.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          credentials: "include",
          body: formData.toString(),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        toast.success("Your account has been successfully deleted");
        logout();
      } else {
        setError(data.message || "Failed to delete account. Please try again.");
      }
    } catch (err) {
      console.error("Delete account error:", err);
      setError("An error occurred. Please try again later.");
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        handleCancel();
      }
    }
    if (confirmOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [confirmOpen]);

  return (
    <div className="max-w-full sm:max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Delete Account
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Permanently delete your account and all associated data.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div
          className="flex justify-between items-center  rounded-xl p-4 sm:p-5 shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all duration-200"
          onClick={openConfirmModal}>
          <div className="flex-1">
            <p className="text-red-600 text-xs font-medium uppercase tracking-wide mb-1">
              Delete Account
            </p>
            <p className="text-red-700 font-medium text-base">
              This action is permanent and cannot be undone
            </p>
          </div>
          <Trash2 size={20} className="text-red-600" />
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[1000]">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div
            ref={popupRef}
            className="bg-white rounded-4xl p-6 sm:p-8 shadow-2xl w-full max-w-md pointer-events-auto animate-in zoom-in-95 fade-in duration-200 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                Confirm Delete Account
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-all duration-200"
                onClick={handleCancel}>
                <X size={22} />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Enter your password to confirm deletion. This action{" "}
              <strong>cannot</strong> be undone.
            </p>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleDelete();
                }
              }}
              placeholder="Enter your password"
              className="border-2 border-gray-200 rounded-xl p-3 w-full focus:ring-2  outline-none transition-all duration-200 mb-2"
              autoFocus
            />

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Delete_Accounts;
