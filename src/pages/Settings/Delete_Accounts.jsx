import React, { useState, useRef, useEffect } from "react";
import { X, Trash2, LogOut, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Delete_Accounts = () => {
  const { user: authUser, logout } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "delete", "logout", "logoutOthers"
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const popupRef = useRef(null);

  const openModal = (type) => {
    setModalType(type);
    setConfirmOpen(true);
    setPassword("");
    setError("");
    setSuccess(false);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setPassword("");
    setError("");
    setModalType("");
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!password) {
      setError("Please enter your password to confirm.");
      return;
    }

    try {
      setError("");
      setLoading(true);

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
        setTimeout(() => {
          logout();
        toast.success("Your account has been successfully deleted");

        }, 1500);
      } else {
        setError(data.message || "Failed to delete account. Please try again.");
      }
    } catch (err) {
      console.error("Delete account error:", err);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      toast.success("Logging out...");
      await logout();
      handleCancel();
    } catch (err) {
      console.error("Logout error:", err);
      setError("Failed to logout. Please try again.");
      setLoading(false);
    }
  };


  const handlePrimaryAction = () => {
    if (loading) return;
    
    if (modalType === "delete") {
      handleDelete();
    } else if (modalType === "logout") {
      handleLogout();
    } 
  };

  const getModalConfig = () => {
    switch (modalType) {
      case "delete":
        return {
          title: "Confirm Delete Account",
          description: "Enter your password to confirm deletion. This action cannot be undone.",
          requirePassword: true,
          buttonText: "Delete Account",
          buttonClass: "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
        };
      case "logout":
        return {
          title: "Confirm Logout",
          description: "Are you sure you want to logout from this session?",
          requirePassword: false,
          buttonText: "Logout",
          buttonClass: "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
        };
      default:
        return {};
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
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [confirmOpen]);

  const modalConfig = getModalConfig();

  return (
    <div className="max-w-full sm:max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Account Management
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Manage your logout preferences and account deletion
        </p>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Logout Current Device */}
        <div
          className="flex justify-between items-center bg-white rounded-xl p-4 sm:p-5 shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all duration-200"
          onClick={() => openModal("logout")}
        >
          <div className="flex-1">
            <p className="text-orange-600 text-xs font-medium uppercase tracking-wide mb-1">
              Logout
            </p>
            <p className="text-gray-700 font-medium text-base">
              Sign out from this device
            </p>
          </div>
          <LogOut size={20} className="text-orange-600" />
        </div>



        {/* Delete Account */}
        <div
          className="flex justify-between items-center bg-white rounded-xl p-4 sm:p-5 shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all duration-200"
          onClick={() => openModal("delete")}
        >
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
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl w-full max-w-md relative mx-4"
            style={{
              animation: "slideIn 0.2s ease-out"
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                {modalConfig.title}
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-all"
                onClick={handleCancel}
                disabled={loading}
              >
                <X size={22} />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              {modalConfig.description}
            </p>

            {modalConfig.requirePassword && (
              <>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !loading) {
                      handlePrimaryAction();
                    }
                  }}
                  placeholder="Enter your password"
                  className="border-2 border-gray-200 rounded-xl p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all mb-2"
                  autoFocus
                  disabled={loading}
                />
              </>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-3">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handlePrimaryAction}
                className={`flex-1 bg-gradient-to-r ${modalConfig.buttonClass} text-white py-3 rounded-xl transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={loading}
              >
                {loading ? "Processing..." : modalConfig.buttonText}
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

export default Delete_Accounts;