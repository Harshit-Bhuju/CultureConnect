import React, { useState, useRef } from "react";
import {
  User,
  Camera,
  Mail,
  Phone,
  MapPin,
  Save,
  X,
  Check,
  ArrowLeft,
  Store,
  FileText,
  DollarSign,
  Package,
  Edit2,
} from "lucide-react";
import EditModal from "../../profileSettings_Components/EditModal";
import LocationForm from "../../profileSettings_Components/LocationForm";
import CropModal from "../../profileSettings_Components/CropModal";
import useNepalAddress from "../../hooks/NepalAddress";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Simulated user data
const initialUserData = {
  province: "Bagmati",
  district: "Kathmandu",
  municipality: "Kathmandu",
  ward: "5",
  // Seller fields
  storeName: "Hello",
  storeDescription: "HUYDgeywdgf uwegdfgy uqsydqw dfygasdf xd",
  businessEmail: "harshitbhuju123@gmail.com",
  esewaPhone: "98765456789",
  primaryCategory: "Musical Instruments",
};


// Main Profile Component
function CustomiseProfile() {
  const [userData, setUserData] = useState(initialUserData);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // validation errors (Seller-like)
  const [errors, setErrors] = useState({});

  const [profilePreview, setProfilePreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);

  // Banner states (added)
  const [bannerPreview, setBannerPreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const bannerInputRef = useRef(null);

  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [cropType, setCropType] = useState(null); // 'profile' | 'logo' | 'banner'
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const profileInputRef = useRef(null);
  const cropImageRef = useRef(null);
  const cropContainerRef = useRef(null);
  const navigate = useNavigate();

  // Nepal address hook (reused from Seller)
  const {
    provinces,
    districts: hookDistricts,
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
  const [selectedWard, setSelectedWard] = useState(userData.ward);

  const handleImageSelect = (e, type = "profile") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = type === "banner" ? 6 * 1024 * 1024 : 4 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`${type === "banner" ? "Banner" : "Image"} must be ${Math.round(maxSize / 1024 / 1024)}MB or less`);
      return;
    }

    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      alert("Only JPG/PNG allowed");
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

  // Crop handlers
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

  const handleCropAndSave = () => {
    if (!imageToCrop) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = cropImageRef.current;
    if (!img) return;

    if (cropType === "profile") {
      // Circular crop for profile
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

      canvas.toBlob((blob) => {
        const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
        const url = URL.createObjectURL(blob);
        setProfilePreview(url);
        setProfileFile(file);
        setShowCropModal(false);
        setImageToCrop(null);
      }, "image/jpeg", 0.95);
    } else {
   
      canvas.width = 2048;
      canvas.height = 1152;

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

      ctx.drawImage(img, sourceX, sourceY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const file = new File([blob], "banner.jpg", { type: "image/jpeg" });
        const url = URL.createObjectURL(blob);
        setBannerPreview(url);
        setBannerFile(file);
        setShowCropModal(false);
        setImageToCrop(null);
      }, "image/jpeg", 0.95);
    }
  };

  const handleFieldChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };


  const openEditModal = (field) => {
    setEditingField(field);
    if (field === "location") {
      // initialize modal selects from current userData
      setSelectedProvince(userData.province || "");
      setSelectedDistrict(userData.district || "");
      setSelectedMunicipal(userData.municipality || "");
      setSelectedWard(userData.ward || "");
    } else {
      setTempValue(userData[field] || "");
    }
  };

  // disable save when required location fields aren't filled (same logic as Seller)
  const isSaveDisabled = () => {
    if (!editingField) return true;
    if (editingField === "location") {
      return !selectedProvince || !selectedDistrict || !selectedMunicipal || !selectedWard;
    }
    return false;
  };

  const handleSaveEdit = () => {
    // validate location when saving location
    if (editingField === "location") {
      if (!selectedProvince || !selectedDistrict || !selectedMunicipal || !selectedWard) {
        alert("Please select province, district, municipality and ward.");
        return;
      }
      setIsSaving(true);
      setTimeout(() => {
        setUserData((prev) => ({
          ...prev,
          province: selectedProvince,
          district: selectedDistrict,
          municipality: selectedMunicipal,
          ward: selectedWard,
        }));
        setIsSaving(false);
        setEditingField(null);
      }, 400);
      return;
    }

    // other fields
    setIsSaving(true);
    setTimeout(() => {
      setUserData((prev) => ({ ...prev, [editingField]: tempValue }));
      setIsSaving(false);
      setEditingField(null);
    }, 400);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue("");
  };
  const validateRequiredFields = () => {
  const newErrors = {};

  // Store Name
  if (!userData.storeName?.trim()) {
    newErrors.storeName = "Store name is required";
  }

  // Store Description
  if (!userData.storeDescription?.trim()) {
    newErrors.storeDescription = "Store description is required";
  } else if (userData.storeDescription.length > 2000) {
    newErrors.storeDescription = "Description cannot exceed 2000 characters";
  }else if (userData.storeDescription.length < 10) {
    newErrors.storeDescription = "Description must be atleast 10 characters";
  }

  // Business Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!userData.businessEmail?.trim()) {
    newErrors.businessEmail = "Business email is required";
  } else if (!emailRegex.test(userData.businessEmail)) {
    newErrors.businessEmail = "Please enter a valid email address";
  }

  // eSewa Phone Number
  const phoneRegex = /^98\d{8}$/; // Must start with 98 and be exactly 10 digits
  if (!userData.esewaPhone?.trim()) {
    newErrors.esewaPhone = "eSewa phone number is required";
  } else if (!/^\d{10}$/.test(userData.esewaPhone)) {
    newErrors.esewaPhone = "Phone number must be exactly 10 digits";
  } else if (!phoneRegex.test(userData.esewaPhone)) {
    newErrors.esewaPhone = "Phone number must start with 98";
  }

  // Primary Category
  if (!userData.primaryCategory?.trim()) {
    newErrors.primaryCategory = "Please select a primary category";
  }

  // Location (all 4 fields required)
  if (!userData.province || !userData.district || !userData.municipality || !userData.ward) {
    newErrors.location = "Complete location (Province, District, Municipality, Ward) is required";
  }

  // Profile Picture (optional - you can make it required if needed)
  if (!profileFile) newErrors.profile = "Profile picture is required";

  // Banner Image (optional - or make required)
  if (!bannerFile) newErrors.banner = "Banner image is required";   

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
  
const handleSaveAll = () => {
  if (!validateRequiredFields()) {
    toast.error("Please fix all errors before saving");
    return;
  }

  setIsSaving(true);

  // Simulate API call
  setTimeout(() => {

    setUserData((prev) => ({
      ...prev,
      province: selectedProvince || prev.province,
      district: selectedDistrict || prev.district,
      municipality: selectedMunicipal || prev.municipality,
      ward: selectedWard || prev.ward,
    }));

    setIsSaving(false);
    toast.success("Profile updated successfully!");


    navigate(`/sellerprofile/:id`);
  }, 1000);
};

  const districts = hookDistricts || [];
  const municipalities = municipals || [];

  return (
  
    <div className=" bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-start mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-gray-600 text-lg mt-2">Manage your account information</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
          {/* Profile Picture Section */}
          <div className="mb-10">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Profile Picture</h3>
            <p className="text-sm text-gray-600 mb-6">
              Upload a profile picture that represents you
            </p>

            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Profile Picture Preview */}
                <div className="flex-shrink-0">
                  <div className="w-40 h-40 rounded-full overflow-hidden bg-white border-4 border-gray-200 flex items-center justify-center shadow-sm relative group">
                    {profilePreview ? (
                      <>
                        <img
                          src={profilePreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                          <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </>
                    ) : (
                      <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-10 h-10 text-gray-600" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Controls */}
                <div className="flex-1">
                  <p className="text-gray-600 text-sm mb-4">
                    Recommended: At least 400 x 400 pixels, 4MB or less. Use PNG or JPG format.
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => profileInputRef.current?.click()}
                      className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm"
                    >
                      {profilePreview ? "Change" : "Upload"}
                    </button>
               
                  </div>
                  <input
                    ref={profileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    className="hidden"
                    onChange={(e) => handleImageSelect(e, "profile")}
                  />
                </div>
              </div>
            </div>
             {errors.profile && <p className="text-red-500 text-sm mt-2">{errors.profile}</p>}
          </div>

          {/* Banner Section (new) */}
          <div className="mb-10">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Banner Image</h3>
            <p className="text-sm text-gray-600 mb-6">
              Upload a banner image for your profile
            </p>

            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Banner Image Preview */}
                <div className="flex-shrink-0">
                  <div className="w-60  sm:w-80 h-44 rounded-lg overflow-hidden bg-white border-4 border-gray-200 flex items-center justify-center shadow-sm relative group">
                    {bannerPreview ? (
                      <>
                        <img
                          src={bannerPreview}
                          alt="Banner"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                          <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
                        <Camera className="w-10 h-10 text-gray-600" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Controls */}
                <div className="flex-1">
                  <p className="text-gray-600 text-sm mb-4">
                    Recommended: 1200 x 300 pixels, 6MB or less. Use PNG or JPG format.
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => bannerInputRef.current?.click()}
                      className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm"
                    >
                      {bannerPreview ? "Change" : "Upload"}
                    </button>
            
                  </div>
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
               {errors.banner && <p className="text-red-500 text-sm mt-2">{errors.banner}</p>}
               </div>
         

          {/* Seller Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-3">
              Seller Information
            </h3>

            {/* Store Name */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <Store className="w-5 h-5 text-gray-700" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Store Name</p>
              </div>
              <input
                type="text"
                value={userData.storeName}
                onChange={(e) => handleFieldChange("storeName", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:border-gray-400 focus:outline-none transition-all"
                placeholder="Enter store name"
              />
                {errors.storeName && <p className="text-red-500 text-sm mb-2">{errors.storeName}</p>}
            </div>

            {/* Store Description */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-700" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Store Description</p>
              </div>
              <textarea
                value={userData.storeDescription}
                onChange={(e) => handleFieldChange("storeDescription", e.target.value)}
                rows="4"
                placeholder="Describe your store..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:border-gray-400 focus:outline-none transition-all resize-none"
              />
              <p className="text-gray-500 text-sm mt-2">{userData.storeDescription.length}/2000 characters</p>
               {errors.storeDescription && <p className="text-red-500 text-sm mb-2">{errors.storeDescription}</p>}
            </div>

            {/* Business Email */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              {errors.businessEmail && <p className="text-red-500 text-sm mb-2">{errors.businessEmail}</p>}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-700" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Business Email</p>
              </div>
              <input
                type="email"
                value={userData.businessEmail}
                onChange={(e) => handleFieldChange("businessEmail", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:border-gray-400 focus:outline-none transition-all"
                placeholder="business@example.com"
              />
            </div>

            {/* eSewa Phone */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
             
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-gray-700" />
                </div>
                <p className="text-sm font-semibold text-gray-700">eSewa Phone Number</p>
              </div>
              <input
                type="text"
                value={userData.esewaPhone}
                onChange={(e) => handleFieldChange("esewaPhone", e.target.value)}
                maxLength="10"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:border-gray-400 focus:outline-none transition-all"
                placeholder="98XXXXXXXX"
              />
               {errors.esewaPhone && <p className="text-red-500 text-sm mb-2">{errors.esewaPhone}</p>}
            </div>

            {/* Primary Category */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-gray-700" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Primary Category</p>
              </div>
              <select
                value={userData.primaryCategory}
                onChange={(e) => handleFieldChange("primaryCategory", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:border-gray-400 focus:outline-none transition-all"
              >
                <option value="" hidden>Select Category</option>
                <option>Traditional Clothing</option>
                <option>Musical Instruments</option>
                <option>Arts & Decors</option>
                <option>Handmade Crafts</option>
              </select>
                {errors.primaryCategory && <p className="text-red-500 text-sm mb-2">{errors.primaryCategory}</p>}
            </div>

            {/* Banner */}
           
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-gray-700" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Location</p>
              </div>
             {errors.location && <p className="text-red-500 text-sm mb-2">{errors.location}</p>}
              <div
                onClick={() => openEditModal("location")}
                className="p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-all flex items-center justify-between"
              >
                <div>
                  <p className="text-sm text-gray-600">Current</p>
                  <p className="text-gray-800 font-medium">
                    {[userData.province, userData.district, userData.municipality, userData.ward ? `Ward ${userData.ward}` : null]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
                <Edit2 className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
             

          {/* Save Button */}
          <div className="mt-10">
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save All Changes
                </>
              )}
            </button>
          </div>
      
      </div>

      {/* Crop Modal */}
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
          setCropType(null);
        }}
        cropImageRef={cropImageRef}
        cropContainerRef={cropContainerRef}
        cropType={cropType}
      />

      {/* Edit Modal (location-only) */}
      <EditModal
        isOpen={!!editingField}
        title={`Edit ${editingField === "location" ? "Location" : editingField?.charAt(0).toUpperCase() + editingField?.slice(1)}`}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
        isSaveDisabled={isSaveDisabled() || isSaving}
      >
        {editingField === "location" ? (
          <LocationForm
            provinces={provinces}
            districts={districts}
            municipals={municipalities}
            wards={wards}
            selectedProvince={selectedProvince}
            selectedDistrict={selectedDistrict}
            selectedMunicipal={selectedMunicipal}
            selectedWard={selectedWard}
            onProvinceChange={(v) => { setSelectedProvince(v); setSelectedDistrict(""); setSelectedMunicipal(""); setSelectedWard(""); }}
            onDistrictChange={(v) => { setSelectedDistrict(v); setSelectedMunicipal(""); setSelectedWard(""); }}
            onMunicipalChange={(v) => { setSelectedMunicipal(v); setSelectedWard(""); }}
            onWardChange={(v) => setSelectedWard(v)}
          />
        ) : (
          <div />
        )}
      </EditModal>
    </div>
   </div>
  );
}

export default CustomiseProfile;