import React, { useState, useRef, useCallback } from "react";
import { Upload, X, Check, ArrowLeft, Save } from "lucide-react";

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
  // Simulating existing teacher data
  const [formData, setFormData] = useState({
    name: "Nisha Shrestha Dance Academy",
    bio: "Experienced classical dance instructor with over 15 years of teaching Kathak and traditional Nepali dances. Passionate about preserving and sharing our cultural heritage through dance education.",
    phone: "9812345678",
    category: "Classical Dance",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Profile picture states
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const cropImageRef = useRef(null);
  const cropContainerRef = useRef(null);
  const profileInputRef = useRef(null);

  const [profilePreview, setProfilePreview] = useState("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop");
  const [profileFile, setProfileFile] = useState(null);

  // Certificates states - simulating existing certificates
  const [certificates, setCertificates] = useState([
    { id: 1, name: "Kathak_Diploma.pdf", preview: "pdf" },
    { id: 2, name: "Cultural_Training.jpg", preview: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=400&h=400&fit=crop" },
  ]);
  const [certificatePreviews, setCertificatePreviews] = useState(["pdf", "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=400&h=400&fit=crop"]);
  const certificateInputRef = useRef(null);

  // Validation helpers
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
  const validateProfile = () => (profileFile || profilePreview ? "" : "Profile Picture is required");
  const validateCertificates = () => {
    if (certificates.length === 0) return "At least one certificate is required";
    return "";
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

    if (file.size > 4 * 1024 * 1024) {
      alert("Profile picture must be ≤ 4MB");
      return;
    }
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      alert("Only JPG/PNG allowed");
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

  // Certificates Upload Handler
  const handleCertificateUpload = (e) => {
    const files = Array.from(e.target.files);

    if (certificates.length + files.length > 5) {
      alert("Maximum 5 certificates allowed");
      return;
    }

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} exceeds 5MB limit`);
        return;
      }

      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        alert(`Invalid file type: ${file.name}`);
        return;
      }

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setCertificatePreviews((prev) => [...prev, ev.target.result]);
        };
        reader.readAsDataURL(file);
      } else {
        setCertificatePreviews((prev) => [...prev, "pdf"]);
      }

      setCertificates((prev) => [...prev, { id: Date.now() + Math.random(), name: file.name, file }]);
      setErrors((prev) => ({ ...prev, certificates: "" }));
    });

    if (certificateInputRef.current) certificateInputRef.current.value = "";
  };

  const removeCertificate = (index) => {
    setCertificates((prev) => prev.filter((_, i) => i !== index));
    setCertificatePreviews((prev) => prev.filter((_, i) => i !== index));
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

    const certErr = validateCertificates();
    if (certErr) newErrors.certificates = certErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, profileFile, profilePreview, certificates]);

  // Submission
  const handleSubmit = async () => {
    if (!validateRequiredFields()) {
      const firstKey = Object.keys(errors)[0];
      if (firstKey) {
        const el = document.querySelector(`[name="${firstKey}"]`) || document.querySelector("#certificates-section");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowSuccessModal(true);
      setErrors({});
    } catch (err) {
      console.error("Submit error", err);
      alert("Error updating profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-start mb-6">
          <button
            type="button"
            onClick={() => window.history.back()}
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
                <option>Classical Dance</option>
                <option>Folk Dance</option>
                <option>Vocal Music</option>
                <option>Instrumental Music</option>
                <option>Cultural Arts</option>
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
                      Recommended: at least 98×98 pixels, max 4MB. JPG or PNG only.
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

            {/* Certificates Upload */}
            <div id="certificates-section">
              <div className="mb-2">
                <h3 className="text-lg font-bold text-gray-800">
                  Certificates <span className="text-red-500">*</span>
                </h3>
                <p className="text-sm text-gray-600">
                  Upload your teaching qualifications, diplomas, or cultural training certificates
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                {certificatePreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                    {certificatePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-white rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
                          {preview === "pdf" ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-red-50">
                              <div className="text-4xl font-bold text-red-600">PDF</div>
                              <p className="text-xs text-gray-600 mt-1">Certificate {index + 1}</p>
                            </div>
                          ) : (
                            <img
                              src={preview}
                              alt={`Certificate ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCertificate(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  {certificates.length < 5 ? (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium mb-2">
                        Upload certificates (JPG, PNG, PDF)
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Max 5 files • 5MB each • At least 1 required
                      </p>
                      <button
                        type="button"
                        onClick={() => certificateInputRef.current?.click()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors shadow-sm"
                      >
                        Choose Files
                      </button>
                      <input
                        ref={certificateInputRef}
                        type="file"
                        multiple
                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                        className="hidden"
                        onChange={handleCertificateUpload}
                      />
                    </>
                  ) : (
                    <p className="text-gray-600 font-medium">Maximum 5 certificates uploaded</p>
                  )}
                </div>

                {errors.certificates && (
                  <p className="text-red-500 text-sm mt-3">{errors.certificates}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold py-4 rounded-xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg"
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