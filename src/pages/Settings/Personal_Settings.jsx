import React, { useState, useRef, useEffect } from "react";
import { ChevronRight, X, ChevronDown, Check, Camera } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import default_logo from "../../assets/default-image.jpg";
import toast from "react-hot-toast";

const Personal_Settings = () => {
  const { user: authUser, login } = useAuth();

  const [user, setUser] = useState({
    email: "",
    username: "",
    location: "",
    gender: "",
    avatar: default_logo,
  });

  const fileInputRef = useRef(null);
  const popupRef = useRef(null);
  const genderRef = useRef(null);

  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);

  const genderOptions = ["Male", "Female", "Prefer not to say"];

  // Sync authUser to local state
  useEffect(() => {
    if (authUser) {
      setUser({
        email: authUser.email || "",
        username: authUser.name || "",
        location: authUser.location || "",
        gender: authUser.gender || "",
        avatar:
          authUser.picture && authUser.picture.startsWith("http")
            ? authUser.picture
            : authUser.picture
            ? `http://localhost/CultureConnect/${authUser.picture}`
            : default_logo,
      });
    }
  }, [authUser]);

  // Handle click outside for edit popup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) handleCancel();
    };
    if (editingField) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [editingField]);

  // Handle click outside for gender dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (genderRef.current && !genderRef.current.contains(e.target))
        setGenderDropdownOpen(false);
    };
    if (genderDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [genderDropdownOpen]);

  // Open file selector
  const handleAvatarClick = () => fileInputRef.current.click();

  // Upload avatar
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("email", user.email);
    formData.append("username", user.username);
    formData.append("location", user.location);
    formData.append("gender", user.gender);

    try {
      const response = await fetch(
        "http://localhost/CultureConnect/backend/user_profile.php",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const result = await response.json();
      if (result.status === "success") {
        toast.success("Profile Picture updated successfully!");

        const newAvatarUrl = result.avatar.startsWith("http")
          ? result.avatar
          : `http://localhost/CultureConnect/${result.avatar}`;

        // Update local state and AuthContext
        setUser((prev) => ({ ...prev, avatar: newAvatarUrl }));
        login({ ...authUser, picture: newAvatarUrl });
      } else {
        toast.error(result.message || "Failed to update profile picture");
        console.error("Update failed:", result.message);
      }
    } catch (err) {
      toast.error("Error uploading avatar");
      console.error("Error uploading avatar:", err);
    }
  };

  const openEditPopup = (field) => {
    setEditingField(field);
    setTempValue(user[field] || "");
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue("");
  };

  // Save username/location
  const handleSave = async () => {
    if (!tempValue.trim()) {
      toast.error("Please enter a value");
      return;
    }

    const field = editingField;
    const value = tempValue.trim();

    // Store old value for rollback
    const oldValue = user[field];

    // Update UI immediately (optimistic update)
    setUser((prev) => ({ ...prev, [field]: value }));
    setEditingField(null);
    setTempValue("");

    // Prepare form data with ALL current user data
    const formData = new FormData();
    formData.append("email", user.email);
    formData.append("username", field === "username" ? value : user.username);
    formData.append("location", field === "location" ? value : user.location);
    formData.append("gender", user.gender);

    try {
      const response = await fetch(
        "http://localhost/CultureConnect/backend/user_profile.php",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const result = await response.json();
      
      if (result.status === "success") {
        // Update AuthContext with the complete updated user data from backend
        const updatedUser = {
          ...authUser,
          name: result.username,
          location: result.location,
          gender: result.gender,
          picture: result.avatar,
        };
        login(updatedUser);
        toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
      } else {
        // Rollback on failure
        setUser((prev) => ({ ...prev, [field]: oldValue }));
        toast.error(result.message || `Failed to update ${field}`);
        console.error(`${field} update failed:`, result.message);
      }
    } catch (err) {
      // Rollback on error
      setUser((prev) => ({ ...prev, [field]: oldValue }));
      toast.error(`Error updating ${field}`);
      console.error(`Error updating ${field}:`, err);
    }
  };

  // Gender selection
  const handleGenderSelect = async (option) => {
    // Store old value for rollback
    const oldGender = user.gender;

    // Update UI immediately (optimistic update)
    setUser((prev) => ({ ...prev, gender: option }));
    setGenderDropdownOpen(false);

    // Prepare form data with ALL current user data
    const formData = new FormData();
    formData.append("email", user.email);
    formData.append("username", user.username);
    formData.append("location", user.location);
    formData.append("gender", option);

    try {
      const response = await fetch(
        "http://localhost/CultureConnect/backend/user_profile.php",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const result = await response.json();
      
      if (result.status === "success") {
        // Update AuthContext with complete user data from backend
        const updatedUser = {
          ...authUser,
          name: result.username,
          location: result.location,
          gender: result.gender,
          picture: result.avatar,
        };
        login(updatedUser);
        toast.success("Gender updated successfully");
      } else {
        // Rollback on failure
        setUser((prev) => ({ ...prev, gender: oldGender }));
        toast.error(result.message || "Failed to update gender");
        console.error("Gender update failed:", result.message);
      }
    } catch (err) {
      // Rollback on error
      setUser((prev) => ({ ...prev, gender: oldGender }));
      toast.error("Error updating gender");
      console.error("Error updating gender:", err);
    }
  };

  return (
    <div className="max-w-full sm:max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="relative flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm mb-6">
        <div className="relative">
          <img
            src={user.avatar}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover shadow-md"
          />
          <button
            onClick={handleAvatarClick}
            className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition"
          >
            <Camera size={16} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Personal Information
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Update your personal details
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Email */}
        <div className="flex justify-between items-center bg-white rounded-xl p-4 sm:p-5 shadow-sm">
          <div className="flex-1">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">
              Email
            </p>
            <p className="text-gray-800 font-medium text-base">{user.email}</p>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </div>

        {/* Username */}
        <div
          className="flex justify-between items-center bg-white rounded-xl p-4 sm:p-5 shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all duration-200"
          onClick={() => openEditPopup("username")}
        >
          <div className="flex-1">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">
              Username
            </p>
            <p className="text-gray-800 font-medium text-base">{user.username}</p>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </div>

        {/* Location & Gender */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Location */}
          <div
            className="flex-1 flex justify-between items-center bg-white rounded-xl p-4 sm:p-5 shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all duration-200"
            onClick={() => openEditPopup("location")}
          >
            <div className="flex-1">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">
                Location
              </p>
              <p className="font-medium text-base text-gray-800">
                {user.location || "Add Location"}
              </p>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>

          {/* Gender */}
          <div className="flex-1 relative" ref={genderRef}>
            <div
              className="flex justify-between items-center bg-white rounded-xl p-4 sm:p-5 shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                setGenderDropdownOpen((prev) => !prev);
              }}
            >
              <div className="flex-1">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">
                  Gender
                </p>
                <p className="font-medium text-base text-gray-800">
                  {user.gender || "Select Gender"}
                </p>
              </div>
              <ChevronDown
                size={20}
                className={`text-gray-400 transition-transform duration-200 ${
                  genderDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {genderDropdownOpen && (
              <div className="absolute mt-2 w-full sm:w-auto bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {genderOptions.map((option, index) => (
                  <div
                    key={option}
                    className={`px-3 py-2 sm:py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 flex items-center justify-between ${
                      index !== genderOptions.length - 1 ? "border-b border-gray-50" : ""
                    } ${user.gender === option ? "bg-blue-50" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenderSelect(option);
                    }}
                  >
                    <span className={`text-sm ${user.gender === option ? "font-semibold text-blue-600" : "text-gray-700"}`}>
                      {option}
                    </span>
                    {user.gender === option && <Check size={14} className="text-blue-600" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Popup Modal */}
      {editingField && (
        <div className="fixed inset-0 flex items-center justify-center z-[1000]">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div
            ref={popupRef}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-md mx-4 pointer-events-auto animate-in zoom-in-95 fade-in duration-200 relative"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                Edit {editingField.charAt(0).toUpperCase() + editingField.slice(1)}
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-all duration-200"
                onClick={handleCancel}
              >
                <X size={22} />
              </button>
            </div>

            <div className="mb-6">
              <div className="w-full mb-4">
                <p className="text-sm text-gray-500">
                  {editingField === "username"
                    ? "You can change your username only once every 14 days."
                    : "Your location helps others know where you're from."}
                </p>
              </div>

              <input
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                placeholder={editingField === "location" ? "Enter your location" : "Enter your username"}
                className="border-2 border-gray-200 rounded-xl p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") handleCancel();
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Personal_Settings;