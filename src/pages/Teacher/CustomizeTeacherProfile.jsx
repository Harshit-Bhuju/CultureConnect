import React, { useState, useRef, useCallback, useEffect } from "react";
import { Upload, X, Check, ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API, { BASE_URL } from "../../Configs/ApiEndpoints";

const InlineLabel = ({ children }) => (
  <label className="block text-sm font-semibold mb-2 text-gray-800">
    {children}
  </label>
);

// Success Modal Component
const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fadeIn">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Profile Updated!
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your teacher profile has been successfully updated on <span className="font-semibold text-red-500">CultureConnect</span>!
          </p>
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};

// Simple Crop Modal (matching the original structure)
const CropModal = ({ isOpen, imageToCrop, onSave, onCancel }) => {
  const [zoom, setZoom] = useState(1);
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const cropImageRef = useRef(null);
  const cropContainerRef = useRef(null);

  if (!isOpen) return null;

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX || e.touches?.[0]?.clientX,
      y: e.clientY || e.touches?.[0]?.clientY,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    setCropPosition((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
    setDragStart({ x: clientX, y: clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    setZoom((prev) => Math.min(Math.max(0.5, prev + delta * 0.5), 3));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Crop Profile Picture</h3>

        <div className="mb-6 flex justify-center">
          <div
            ref={cropContainerRef}
            className="relative w-80 h-80 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            onWheel={handleWheel}
          >
            <img
              ref={cropImageRef}
              src={imageToCrop}
              alt="Crop"
              className="absolute cursor-move select-none"
              draggable={false}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
              style={{
                transform: `translate(${cropPosition.x}px, ${cropPosition.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
              }}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Zoom: {zoom.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(cropImageRef, cropContainerRef, cropPosition, zoom)}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

function CustomizeTeacherProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    phone: "",
    category: "",
  });
  const [initialFormData, setInitialFormData] = useState({
    name: "",
    bio: "",
    phone: "",
    category: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Profile picture states
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const cropImageRef = useRef(null);
  const cropContainerRef = useRef(null);
  const profileInputRef = useRef(null);

  const [profilePreview, setProfilePreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);

  // Fetch Teacher Data
  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        const response = await fetch(API.GET_TEACHER_PROFILE_WITH_COURSES, {
          method: "GET",
          credentials: "include"
        });
        const data = await response.json();

        if (data.status === "success") {
          const profile = data.teacher_profile;
          const loadedData = {
            name: profile.name || "",
            bio: profile.bio || "",
            phone: profile.esewa_phone || "",
            category: profile.category || "",
          };
          setFormData(loadedData);
          setInitialFormData(loadedData);

          if (profile.profile_picture) {
            setProfilePreview(`${API.TEACHER_PROFILE_PICTURES}/${profile.profile_picture}`);
          }
        } else {
          toast.error(data.message || "Failed to load profile");
          navigate(-1);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Error loading profile");
      } finally {
        setIsValidating(false);
      }
    };

    fetchTeacherProfile();
  }, [navigate]);

  // Validation helpers (Same as Registration)
  const validateName = (name) => {
    if (!name || !name.trim()) return "Teacher / Studio Name is required";
    if (name.trim().length < 3) return "Name must be at least 3 characters";
    if (name.trim().length > 100) return "Name must not exceed 100 characters";
    return "";
  };

  const validateBio = (bio) => {
    if (!bio || !bio.trim()) return "Teaching Bio is required";
    if (bio.trim().length < 10) return "Bio must be at least 10 characters";
    if (bio.length > 2000) return "Bio must not exceed 2000 characters";
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone || !phone.trim()) return "Phone number is required";
    const phoneRegex = /^(98|97)\d{8}$/;
    if (!phoneRegex.test(phone)) return "Please enter a valid 10-digit Nepali phone number";
    return "";
  };

  const validateCategory = (cat) => (cat ? "" : "Please select a primary teaching category");

  const validateProfile = () => {
    // Required if no preview exists (meaning no previous image and no new image)
    return (profileFile || profilePreview) ? "" : "Profile Picture is required";
  };

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Profile Picture
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile picture must be ≤ 5MB");
      return;
    }
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      toast.error("Only JPG/PNG allowed");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageToCrop(ev.target.result);
      setShowCropModal(true);
      setCropPosition({ x: 0, y: 0 });
      setZoom(1);
      const img = new Image();
      img.onload = () => setImageSize({ width: img.width, height: img.height });
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleCropAndSave = (cropImageRef, cropContainerRef, cropPosition, zoom) => {
    if (!imageToCrop) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = cropImageRef.current;
    if (!img) return;

    const size = 400;
    canvas.width = size;
    canvas.height = size;

    const containerRect = cropContainerRef.current.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    const scaleX = img.naturalWidth / imgRect.width;
    const scaleY = img.naturalHeight / imgRect.height;

    const containerCenterX = containerRect.left + containerRect.width / 2;
    const containerCenterY = containerRect.top + containerRect.height / 2;
    const imgCenterX = imgRect.left + imgRect.width / 2;
    const imgCenterY = imgRect.top + imgRect.height / 2;

    const offsetX = (containerCenterX - imgCenterX) * scaleX;
    const offsetY = (containerCenterY - imgCenterY) * scaleY;
    const cropRadius = (containerRect.width / 2) * scaleX;

    const sourceX = img.naturalWidth / 2 + offsetX - cropRadius;
    const sourceY = img.naturalHeight / 2 + offsetY - cropRadius;
    const sourceSize = cropRadius * 2;

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(img, sourceX, sourceY, sourceSize, sourceSize, 0, 0, size, size);

    canvas.toBlob(
      (blob) => {
        const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
        const url = URL.createObjectURL(blob);
        setProfilePreview(url);
        setProfileFile(file);
        setErrors((p) => ({ ...p, profile: "" }));
        if (profileInputRef.current) profileInputRef.current.value = "";
        setShowCropModal(false);
        setImageToCrop(null);
      },
      "image/jpeg",
      0.95
    );
  };

  // Form validation
  const validateRequiredFields = useCallback(() => {
    const newErrors = {};

    const nameErr = validateName(formData.name);
    if (nameErr) newErrors.name = nameErr;

    const bioErr = validateBio(formData.bio);
    if (bioErr) newErrors.bio = bioErr;

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) newErrors.phone = phoneErr;

    const catErr = validateCategory(formData.category);
    if (catErr) newErrors.category = catErr;

    const profileErr = validateProfile();
    if (profileErr) newErrors.profile = profileErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, profileFile, profilePreview]);

  const hasChanges = useCallback(() => {
    const isFormDataChanged = Object.keys(formData).some(
      (key) => formData[key] !== initialFormData[key]
    );
    const isProfilePictureChanged = profileFile !== null;
    return isFormDataChanged || isProfilePictureChanged;
  }, [formData, initialFormData, profileFile]);

  // Submission
  const handleSubmit = async () => {
    if (!validateRequiredFields()) {
      const firstKey = Object.keys(errors)[0];
      if (firstKey) {
        const el = document.querySelector(`[name="${firstKey}"]`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const formBody = new FormData();
      formBody.append("name", formData.name);
      formBody.append("bio", formData.bio);
      formBody.append("phone", formData.phone);
      formBody.append("category", formData.category);

      if (profileFile) {
        formBody.append("profilePicture", profileFile);
      }

      const response = await fetch(API.UPDATE_TEACHER_PROFILE, {
        method: "POST",
        credentials: "include",
        body: formBody
      });

      const result = await response.json();

      if (result.status === "success") {
        setShowSuccessModal(true);
        setErrors({});
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Submit error", err);
      toast.error("Error updating profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate(0); // Reload to fetch fresh data
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-start mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Customize Teacher Profile
          </h1>
          <p className="text-gray-600 text-lg">Update your teaching profile information</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
          <div className="space-y-8">
            {/* Teacher / Studio Name */}
            <div>
              <InlineLabel>
                Teacher / Studio Name <span className="text-red-500">*</span>
              </InlineLabel>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3.5 border-2 rounded-xl ${errors.name ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
                  }`}
                placeholder="Enter teacher or studio name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
            </div>

            {/* Teaching Bio */}
            <div>
              <InlineLabel>
                Teaching Bio <span className="text-red-500">*</span>
              </InlineLabel>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="5"
                className={`w-full px-4 py-3.5 border-2 rounded-xl resize-none ${errors.bio ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
                  }`}
                placeholder="Describe your teaching experience, cultural background, and skills..."
              />
              <div className="flex justify-between mt-2">
                <p className="text-gray-500 text-sm">
                  {formData.bio.length < 10 ? "⚠ Minimum 10 characters" : ""}
                </p>
                <p className="text-gray-500 text-sm">{formData.bio.length}/2000</p>
              </div>
              {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <InlineLabel>
                eSewa Phone Number <span className="text-red-500">*</span>
              </InlineLabel>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                maxLength="10"
                placeholder="98XXXXXXXX"
                className={`w-full px-4 py-3.5 border-2 rounded-xl ${errors.phone ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
                  }`}
              />
              <p className="text-gray-500 text-sm mt-2">
                Used for contact and payment (eSewa/Khalti)
              </p>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Primary Teaching Category */}
            <div>
              <InlineLabel>
                Primary Teaching Category <span className="text-red-500">*</span>
              </InlineLabel>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-4 py-3.5 border-2 rounded-xl ${errors.category ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
                  }`}
              >
                <option value="">Select Category</option>
                <option>Cultural Dances</option>
                <option>Cultural Singing</option>
                <option>Musical Instruments</option>
                <option>Cultural Art & Crafts</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-2">{errors.category}</p>}
            </div>

            {/* Profile Picture Upload */}
            <div>
              <div className="mb-2">
                <h3 className="text-lg font-bold text-gray-800">
                  Profile Picture <span className="text-red-500">*</span>
                </h3>
                <p className="text-sm text-gray-600">
                  Your profile picture will appear on your teacher profile and class listings
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-40 h-40 rounded-full overflow-hidden bg-white border-4 border-gray-200 flex items-center justify-center shadow-sm">
                      {profilePreview ? (
                        <img src={profilePreview} alt="profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center">
                          <div
                            className="w-8 h-10 bg-white"
                            style={{
                              clipPath: "polygon(50% 0%, 0% 40%, 30% 40%, 30% 100%, 70% 100%, 70% 40%, 100% 40%)",
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-600 text-sm mb-4">
                      Recommended: at least 98×98 pixels, max 5MB. JPG or PNG only.
                    </p>
                    <div className="flex gap-3">
                      {profilePreview ? (
                        <>
                          <button
                            type="button"
                            onClick={() => profileInputRef.current?.click()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setProfilePreview(null);
                              setProfileFile(null);
                            }}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded-full font-medium transition-colors"
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => profileInputRef.current?.click()}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm"
                        >
                          Upload
                        </button>
                      )}
                    </div>
                    <input
                      ref={profileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </div>
                </div>
              </div>
              {errors.profile && <p className="text-red-500 text-sm mt-2">{errors.profile}</p>}
            </div>

            {errors.profile && <p className="text-red-500 text-sm mt-2">{errors.profile}</p>}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !hasChanges()}
              className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all ${isSubmitting || !hasChanges()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                : "bg-gray-800 text-white hover:bg-gray-900"
                }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Save className="w-5 h-5" />
                  <span>Update Profile</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="text-gray-500 text-sm">
          Need help? Contact{" "}
          <a href="mailto:support@cultureconnect.com" className="text-gray-800 font-semibold">
            support@cultureconnect.com
          </a>
        </p>
      </div>

      {/* Crop Modal */}
      <CropModal
        isOpen={showCropModal}
        imageToCrop={imageToCrop}
        onSave={handleCropAndSave}
        onCancel={() => {
          setShowCropModal(false);
          setImageToCrop(null);
        }}
      />

      {/* Success Modal */}
      <SuccessModal isOpen={showSuccessModal} onClose={handleCloseSuccessModal} />
    </div>
  );
}

export default CustomizeTeacherProfile;