import React, { useState, useRef, useEffect, useCallback } from "react";
import { Store, Upload, X, Check, Save, Info, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import useNepalAddress from "../../hooks/NepalAddress";
import API from "../../Configs/ApiEndpoints";

// Reuse your existing components
import EditModal from "../../profileSettings_Components/EditModal";
import LocationForm from "../../profileSettings_Components/LocationForm";
import CropModal from "./CropModal";

const InlineLabel = ({ children }) => (
  <label className="block text-sm font-semibold mb-2 text-gray-800">
    {children}
  </label>
);

// --- SellerForm Component ---
function SellerForm() {
  const { user: authUser, checkSession } = useAuth?.() || {
    user: null,
    checkSession: async () => {},
  };
  const navigate = useNavigate();
  const {
    provinces,
    districts,
    municipals,
    wards,
    selectedProvince,
    setSelectedProvince,
    selectedDistrict,
    setSelectedDistrict,
    selectedMunicipal,
    setSelectedMunicipal,
  } = useNepalAddress?.() || {
    provinces: [],
    districts: [],
    municipals: [],
    wards: [],
    selectedProvince: "",
    setSelectedProvince: () => {},
    selectedDistrict: "",
    setSelectedDistrict: () => {},
    selectedMunicipal: "",
    setSelectedMunicipal: () => {},
  };

  const [selectedWard, setSelectedWard] = useState("");

  const [formData, setFormData] = useState({
    storeName: "",
    storeDescription: "",
    esewaPhone: "",
    primaryCategory: "",
    province: "",
    district: "",
    municipality: "",
    ward: "",
    termsAccepted: false,
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // crop modal + image upload
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [cropType, setCropType] = useState(null); // 'logo' or 'banner'
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const cropImageRef = useRef(null);
  const cropContainerRef = useRef(null);
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  // Edit modal (for editing location or username like your Personal_Settings pattern)
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usernameTakenError, setUsernameTakenError] = useState("");
  const [usernameSuggestions, setUsernameSuggestions] = useState([]);
  const [suggestionModalOpen, setSuggestionModalOpen] = useState(false);

  // sync province/district selection to form when not using edit modal
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      province: selectedProvince || prev.province,
      district: selectedDistrict || prev.district,
      municipality: selectedMunicipal || prev.municipality,
      ward: selectedWard || prev.ward,
    }));
  }, [selectedProvince, selectedDistrict, selectedMunicipal, selectedWard]);

  // ---------- Validation helpers ----------
  const validateStoreName = (name) => {
    if (!name || !name.trim()) return "Store name is required";
    if (name.trim().length < 3)
      return "Store name must be at least 3 characters";
    if (name.trim().length > 100)
      return "Store name must not exceed 100 characters";
    if (!/^[a-zA-Z0-9\s&\-']+$/.test(name))
      return "Only letters, numbers and & - ' allowed";
    return "";
  };

  const validateStoreDescription = (desc) => {
    if (!desc || !desc.trim()) return "Description is required";
    if (desc.trim().length < 10)
      return "Description must be at least 10 characters";
    if (desc.length > 2000)
      return "Description must not exceed 2000 characters";
    return "";
  };

  const validateEsewaPhone = (phone) => {
    if (!phone || !phone.trim()) return "eSewa phone number is required";
    const phoneRegex = /^(98|97)\d{8}$/;
    if (!phoneRegex.test(phone))
      return "Please enter a valid 10-digit Nepali phone number";
    return "";
  };

  const validateCategory = (cat) =>
    cat ? "" : "Please select a primary category";

  const validateLogo = () => (logoFile ? "" : "Store logo is required");
  const validateBanner = () => (bannerFile ? "" : "Store banner is required");
  const validateLocation = (province, district, municipal, ward) => {
    if (!province || !district || !municipal || !ward)
      return "Please select full location";
    return "";
  };

  // ---------- Handlers ----------
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Image selection & crop
  const handleImageSelect = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear the input value to allow re-selecting the same file
    e.target.value = "";
    const maxSizeMB = type === "banner" ? 6 : 4;
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(
        `${type === "banner" ? "Banner" : "Logo"} must be <= ${maxSizeMB}MB`,
      );
      return;
    }
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      toast.error("Only JPG/PNG allowed");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageToCrop(ev.target.result);
      setCropType(type);
      setShowCropModal(true);
      setCropPosition({ x: 0, y: 0 });
      setZoom(1);

      const img = new Image();
      img.onload = () => setImageSize({ width: img.width, height: img.height });
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleCropAndSave = () => {
    if (!imageToCrop) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = cropImageRef.current;
    if (!img) return;

    if (cropType === "logo") {
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

      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        sourceSize,
        sourceSize,
        0,
        0,
        size,
        size,
      );
    } else {
      // banner rectangular crop
      canvas.width = 1280;
      canvas.height = 400;

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

      const cropWidth = containerRect.width * scaleX;
      const cropHeight = containerRect.height * scaleY;

      const sourceX = img.naturalWidth / 2 + offsetX - cropWidth / 2;
      const sourceY = img.naturalHeight / 2 + offsetY - cropHeight / 2;

      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        cropWidth,
        cropHeight,
        0,
        0,
        canvas.width,
        canvas.height,
      );
    }

    canvas.toBlob(
      (blob) => {
        const file = new File([blob], `${cropType}.jpg`, {
          type: "image/jpeg",
        });
        const url = URL.createObjectURL(blob);

        if (cropType === "logo") {
          setLogoPreview(url);
          setLogoFile(file);
          setErrors((p) => ({ ...p, logo: "" }));
          if (logoInputRef.current) logoInputRef.current.value = "";
        } else {
          setBannerPreview(url);
          setBannerFile(file);
          setErrors((p) => ({ ...p, banner: "" }));
          if (bannerInputRef.current) bannerInputRef.current.value = "";
        }

        setShowCropModal(false);
        setImageToCrop(null);
      },
      "image/jpeg",
      0.95,
    );
  };

  // crop drag handlers
  const handleMouseDown = (e) => {
    if (e.cancelable) e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX || e.touches?.[0]?.clientX,
      y: e.clientY || e.touches?.[0]?.clientY,
    });
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    if (e.cancelable) e.preventDefault();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    setCropPosition((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
    setDragStart({ x: clientX, y: clientY });
  };
  const handleMouseUp = () => setIsDragging(false);
  const handleWheel = (e) => {
    if (e.cancelable) e.preventDefault();
    const delta = e.deltaY * -0.01;
    setZoom((prev) => Math.min(Math.max(0.5, prev + delta * 0.5), 3));
  };

  // ----- Edit modal for location/username -----
  const openEditPopup = (field) => {
    setEditingField(field);
    if (field === "location") {
      // populate selected values from current formData
      setSelectedProvince(formData.province || "");
      setSelectedDistrict(formData.district || "");
      setSelectedMunicipal(formData.municipality || "");
      setSelectedWard(formData.ward || "");
    } else if (field === "username") {
      setTempValue(authUser?.name || "");
    } else {
      setTempValue(formData[field] || "");
    }
    setUsernameError("");
    setUsernameTakenError("");
    setSuggestionModalOpen(false);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue("");
    setUsernameError("");
    setUsernameTakenError("");
    setSuggestionModalOpen(false);
    // reset selection to current
    setSelectedProvince(formData.province || "");
    setSelectedDistrict(formData.district || "");
    setSelectedMunicipal(formData.municipality || "");
    setSelectedWard(formData.ward || "");
  };

  const isSaveDisabled = () => {
    if (!editingField) return true;
    if (editingField === "location") {
      return (
        !selectedProvince ||
        !selectedDistrict ||
        !selectedMunicipal ||
        !selectedWard
      );
    }
    if (editingField === "username") {
      return !tempValue || usernameError || usernameTakenError;
    }
    return false;
  };

  const handleSaveEdit = async () => {
    if (editingField === "location") {
      if (
        !selectedProvince ||
        !selectedDistrict ||
        !selectedMunicipal ||
        !selectedWard
      ) {
        toast.error("Select all location fields");
        return;
      }
      setFormData((p) => ({
        ...p,
        province: selectedProvince,
        district: selectedDistrict,
        municipality: selectedMunicipal,
        ward: selectedWard,
      }));
      setEditingField(null);
      return;
    }
    if (editingField === "username") {
      if (!tempValue.trim()) {
        toast.error("Enter username");
        return;
      }
      // call API to update username if needed - simulated here
      setEditingField(null);
      toast.success("Username updated");
    }
  };

  // username suggestions refresh (optional real API)
  const refreshSuggestions = async () => {
    // placeholder: fetch suggestions from your API
    setUsernameSuggestions([
      `${authUser?.name || "seller"}123`,
      `${authUser?.name || "seller"}_art`,
    ]);
  };

  // ---------- Form submission ----------
  const validateRequiredFields = useCallback(() => {
    const newErrors = {};
    const storeNameErr = validateStoreName(formData.storeName);
    if (storeNameErr) newErrors.storeName = storeNameErr;

    const descErr = validateStoreDescription(formData.storeDescription);
    if (descErr) newErrors.storeDescription = descErr;

    const phoneErr = validateEsewaPhone(formData.esewaPhone);
    if (phoneErr) newErrors.esewaPhone = phoneErr;

    const catErr = validateCategory(formData.primaryCategory);
    if (catErr) newErrors.primaryCategory = catErr;

    const logoErr = validateLogo();
    if (logoErr) newErrors.logo = logoErr;

    const bannerErr = validateBanner();
    if (bannerErr) newErrors.banner = bannerErr;

    const locErr = validateLocation(
      formData.province,
      formData.district,
      formData.municipality,
      formData.ward,
    );
    if (locErr) newErrors.location = locErr;

    const termsErr = formData.termsAccepted
      ? ""
      : "You must accept the terms and conditions";
    if (termsErr) newErrors.terms = termsErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, logoFile, bannerFile]);

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
      const body = new FormData();
      body.append("storeName", formData.storeName);
      body.append("storeDescription", formData.storeDescription);
      body.append("esewaPhone", formData.esewaPhone);
      body.append("primaryCategory", formData.primaryCategory);
      body.append("province", formData.province);
      body.append("district", formData.district);
      body.append("municipality", formData.municipality);
      body.append("ward", formData.ward);
      if (logoFile) body.append("logo", logoFile);
      if (bannerFile) body.append("banner", bannerFile);

      const response = await fetch(API.SELLER_REGISTRATION, {
        method: "POST",
        credentials: "include",
        body: body,
      });

      const result = await response.json();

      if (result.status === "success") {
        toast.success("Application submitted successfully!");
        setErrors({});

        // ✅ CRITICAL FIX: Refresh session BEFORE navigation
        console.log("Refreshing session to get updated seller_id...");
        await checkSession();

        // ✅ Wait a bit more for state to update
        await new Promise((resolve) => setTimeout(resolve, 500));

        // ✅ Navigate to seller profile
        console.log("Navigating to seller profile:", result.seller_id);
        navigate(`/sellerprofile/${result.seller_id}`, { replace: true });
      } else {
        toast.error(result.message || "Failed to submit application");
      }
    } catch (err) {
      console.error("Submit error", err);
      toast.error("Error submitting application");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-start mb-6">
          <button
            type="button"
            onClick={() => navigate("/", { replace: true })}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm"
            aria-label="Go back">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Seller Application
          </h1>
          <p className="text-gray-600 text-lg">
            Register your store and list products
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
          <div className="space-y-8">
            {/* Basic Info */}
            <div>
              <InlineLabel>
                Store Name <span className="text-red-500">*</span>
              </InlineLabel>
              <input
                name="storeName"
                value={formData.storeName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3.5 border-2 rounded-xl ${errors.storeName ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"}`}
                placeholder="Enter store name"
              />
              {errors.storeName && (
                <p className="text-red-500 text-sm mt-2">{errors.storeName}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <InlineLabel>
                Store Description <span className="text-red-500">*</span>
              </InlineLabel>
              <textarea
                name="storeDescription"
                value={formData.storeDescription}
                onChange={handleInputChange}
                rows="5"
                className={`w-full px-4 py-3.5 border-2 rounded-xl resize-none ${errors.storeDescription ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"}`}
                placeholder="Describe your store and products..."
              />
              <div className="flex justify-between mt-2">
                <p className="text-gray-500 text-sm">
                  {formData.storeDescription.length < 10
                    ? "⚠ Minimum 10 characters"
                    : ""}
                </p>
                <p className="text-gray-500 text-sm">
                  {formData.storeDescription.length}/2000
                </p>
              </div>
              {errors.storeDescription && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.storeDescription}
                </p>
              )}
            </div>

            {/* Location (inline selectors) */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => openEditPopup("location")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openEditPopup("location");
                }
              }}
              aria-invalid={!!errors.location}
              className={`w-full text-left px-4 py-3.5 rounded-xl border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                errors.location
                  ? "border-red-300 bg-red-50 text-red-800"
                  : formData.province ||
                      formData.district ||
                      formData.municipality ||
                      formData.ward
                    ? "border-gray-200 bg-gray-50 text-gray-800"
                    : "border-dashed border-gray-300 bg-white text-gray-500"
              }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-700">
                    Location
                  </div>
                  <div className="text-sm truncate mt-1">
                    {formData.province ||
                    formData.district ||
                    formData.municipality ||
                    formData.ward
                      ? [
                          formData.province,
                          formData.district,
                          formData.municipality,
                          formData.ward,
                        ]
                          .filter(Boolean)
                          .join(", ")
                      : "Add Location (click to edit)"}
                  </div>
                </div>
                <div className="text-blue-600 ml-4 font-medium">Edit</div>
              </div>
            </div>
            {errors.location && (
              <p className="text-red-500 text-sm mt-2">{errors.location}</p>
            )}

            {/* eSewa phone */}
            <div>
              <InlineLabel>
                eSewa Phone Number <span className="text-red-500">*</span>
              </InlineLabel>
              <input
                name="esewaPhone"
                value={formData.esewaPhone}
                onChange={handleInputChange}
                maxLength="10"
                placeholder="98XXXXXXXX"
                className={`w-full px-4 py-3.5 border-2 rounded-xl ${errors.esewaPhone ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"}`}
              />
              <p className="text-gray-500 text-sm mt-2">
                Payment will be sent to this eSewa account
              </p>
              {errors.esewaPhone && (
                <p className="text-red-500 text-sm mt-1">{errors.esewaPhone}</p>
              )}
            </div>

            {/* Primary Category */}
            <div>
              <InlineLabel>
                Primary Category <span className="text-red-500">*</span>
              </InlineLabel>
              <select
                name="primaryCategory"
                value={formData.primaryCategory}
                onChange={handleInputChange}
                className={`w-full px-4 py-3.5 border-2 rounded-xl ${errors.primaryCategory ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"}`}>
                <option value="">Select Category</option>
                <option>Traditional Clothing</option>
                <option>Musical Instruments</option>
                <option>Handicraft & Decors</option>
              </select>
              {errors.primaryCategory && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.primaryCategory}
                </p>
              )}
            </div>

            {/* Banner Upload */}
            <div>
              <div className="mb-2">
                <h3 className="text-lg font-bold text-gray-800">
                  Banner image
                </h3>
                <p className="text-sm text-gray-600">
                  This image will appear across the top of your channel
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                <div className="flex flex-col gap-6">
                  {/* Preview Area - Full Width */}
                  <div className="w-full">
                    <div className="w-full h-64 bg-white rounded-lg overflow-hidden border-4 border-gray-200 shadow-sm">
                      {bannerPreview ? (
                        <img
                          src={bannerPreview}
                          alt="banner"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-red-600 rounded-lg mx-auto mb-2"></div>
                            <div className="w-12 h-8 bg-gray-300 rounded mx-auto"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Info */}
                  <div className="flex-1">
                    <p className="text-gray-600 text-sm mb-4">
                      For the best results on all devices, use an image that's
                      at least 1280 x 400 pixels and 6MB or less.
                    </p>
                    {bannerPreview ? (
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            bannerInputRef.current &&
                            bannerInputRef.current.click()
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm">
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setBannerPreview(null);
                            setBannerFile(null);
                          }}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded-full font-medium transition-colors">
                          Remove
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          bannerInputRef.current &&
                          bannerInputRef.current.click()
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm">
                        Upload
                      </button>
                    )}
                    <input
                      ref={bannerInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                      onChange={(e) => handleImageSelect(e, "banner")}
                    />
                  </div>
                </div>
              </div>
              {errors.banner && (
                <p className="text-red-500 text-sm mt-2">{errors.banner}</p>
              )}
            </div>

            {/* Logo Upload */}
            <div>
              <div className="mb-2">
                <h3 className="text-lg font-bold text-gray-800">Picture</h3>
                <p className="text-sm text-gray-600">
                  Your profile picture will appear where your channel is
                  presented on CultureConnect, like next to your products and
                  store info
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Preview Area */}
                  <div className="flex-shrink-0">
                    <div className="w-40 h-40 rounded-full overflow-hidden bg-white border-4 border-gray-200 flex items-center justify-center shadow-sm">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="logo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center">
                          <div
                            className="w-8 h-10 bg-white"
                            style={{
                              clipPath:
                                "polygon(50% 0%, 0% 40%, 30% 40%, 30% 100%, 70% 100%, 70% 40%, 100% 40%)",
                            }}></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Info */}
                  <div className="flex-1">
                    <p className="text-gray-600 text-sm mb-4">
                      It's recommended to use a picture that's at least 98 x 98
                      pixels and 4MB or less. Use a PNG or GIF (no animations)
                      file. Make sure your picture follows the YouTube Community
                      Guidelines.
                    </p>
                    <div className="flex gap-3">
                      {logoPreview ? (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              logoInputRef.current &&
                              logoInputRef.current.click()
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm">
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setLogoPreview(null);
                              setLogoFile(null);
                            }}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded-full font-medium transition-colors">
                            Remove
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            logoInputRef.current && logoInputRef.current.click()
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm">
                          Upload
                        </button>
                      )}
                    </div>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                      onChange={(e) => handleImageSelect(e, "logo")}
                    />
                  </div>
                </div>
              </div>
              {errors.logo && (
                <p className="text-red-500 text-sm mt-2">{errors.logo}</p>
              )}
            </div>

            {/* Terms */}
            <div
              className={`border-2 rounded-2xl p-6 ${errors.terms ? "border-red-300 bg-red-50" : "border-gray-200 bg-gradient-to-br from-slate-50 to-gray-50"}`}>
              <h3 className="font-bold mb-4 text-lg text-gray-800 flex items-center gap-2">
                📋 Terms & Conditions
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 mb-4">
                <li className="p-3 bg-white rounded-lg border">
                  • Commission: 1% per sale. Sellers should price products
                  considering this commission.
                </li>
                <li className="p-3 bg-white rounded-lg border">
                  • Delivery: Buyers pay delivery charges, calculated
                  automatically from the seller's location to the buyer's chosen
                  delivery address.
                </li>
                <li className="p-3 bg-white rounded-lg border">
                  • Settlement: Online payments (eSewa only) are processed
                  within 7 business days after successful delivery.
                </li>
              </ul>

              <label className="flex items-start gap-3 cursor-pointer p-4 bg-white rounded-xl border-2 border-gray-200">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  className="w-5 h-5"
                />
                <span className="text-sm text-gray-700 leading-relaxed">
                  I agree to the Terms & Conditions and confirm information is
                  accurate
                </span>
              </label>
              {errors.terms && (
                <p className="text-red-500 text-sm mt-3">{errors.terms}</p>
              )}
            </div>

            {/* Submit */}
            <div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold py-4 rounded-xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg">
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                      role="status"
                      aria-hidden="true"
                    />
                    <span>Submitting...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" aria-hidden="true" />
                    <span>Submit Application</span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Need help? Contact{" "}
            <a
              href="mailto:support@cultureconnect.com"
              className="text-gray-800 font-semibold">
              support@cultureconnect.com
            </a>
          </p>
        </div>
      </div>

      {/* OTP modal removed */}

      {/* --- Crop Modal (reused component) --- */}
      <CropModal
        isOpen={showCropModal}
        imageToCrop={imageToCrop}
        cropPosition={cropPosition}
        zoom={zoom}
        isDragging={isDragging}
        imageSize={imageSize}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onZoomChange={setZoom}
        onSave={handleCropAndSave}
        onCancel={() => {
          setShowCropModal(false);
          setImageToCrop(null);
        }}
        cropImageRef={cropImageRef}
        cropContainerRef={cropContainerRef}
        cropType={cropType}
      />

      <EditModal
        isOpen={!!editingField && !suggestionModalOpen}
        field={editingField}
        value={tempValue}
        onChange={setTempValue}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
        error={usernameError}
        takenError={usernameTakenError}
        isSaveDisabled={isSaveDisabled()}
        onOpenSuggestions={() => setSuggestionModalOpen(true)}>
        {editingField === "location" ? (
          <LocationForm
            provinces={provinces}
            districts={districts}
            municipals={municipals}
            wards={wards}
            selectedProvince={selectedProvince}
            selectedDistrict={selectedDistrict}
            selectedMunicipal={selectedMunicipal}
            selectedWard={selectedWard}
            onProvinceChange={setSelectedProvince}
            onDistrictChange={setSelectedDistrict}
            onMunicipalChange={setSelectedMunicipal}
            onWardChange={setSelectedWard}
          />
        ) : (
          // a minimal username input when editing username
          <div>
            <input
              value={tempValue}
              onChange={(e) => {
                setTempValue(e.target.value);
                setUsernameError("");
                setUsernameTakenError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isSaveDisabled()) handleSaveEdit();
                if (e.key === "Escape") handleCancelEdit();
              }}
              className="w-full px-4 py-3 border-2 rounded-xl"
            />
            {usernameError && (
              <p className="text-red-500 text-sm mt-2">{usernameError}</p>
            )}
            {usernameTakenError && (
              <p className="text-red-500 text-sm mt-2">{usernameTakenError}</p>
            )}
          </div>
        )}
      </EditModal>
    </div>
  );
}

export default SellerForm;
