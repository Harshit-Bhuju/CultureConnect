import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import default_logo from "../../assets/default-image.jpg";
import toast from "react-hot-toast";
import useNepalAddress from "../../hooks/NepalAddress";
import API from "../../Configs/ApiEndpoints";

// Import components
import ProfileHeader from "../../profileSettings_Components/ProfileHeader";
import ProfileField from "../../profileSettings_Components/ProfileField";
import GenderDropdown from "../../profileSettings_Components/GenderDropdown";
import EditModal from "../../profileSettings_Components/EditModal";
import LocationForm from "../../profileSettings_Components/LocationForm";
import UsernameInput from "../../profileSettings_Components/UsernameInput";
import SuggestionsModal from "../../profileSettings_Components/SuggestionsModal";
import ProfilePicModal from "../../profileSettings_Components/ProfilePicModal";
import CropModal from "../../profileSettings_Components/CropModal";

const Personal_Settings = () => {
  const { user: authUser, login } = useAuth();

  // Nepal address hook
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
  } = useNepalAddress();

  const [selectedWard, setSelectedWard] = useState("");

  const [user, setUser] = useState({
    email: "",
    username: "",
    location: "",
    gender: "",
    avatar: default_logo,
  });

  const fileInputRef = useRef(null);
  const cropImageRef = useRef(null);
  const cropContainerRef = useRef(null);

  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
  const [suggestionModalOpen, setSuggestionModalOpen] = useState(false);
  const genderOptions = ["Male", "Female", "Prefer not to say"];

  const [usernameSuggestions, setUsernameSuggestions] = useState([]);
  const [usernameError, setUsernameError] = useState("");
  const [usernameTakenError, setUsernameTakenError] = useState("");
  const [showProfilePicModal, setShowProfilePicModal] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  // Sync authUser to local state
  useEffect(() => {
    if (authUser) {
      setUser({
        email: authUser.email || "",
        username: authUser.name || "",
        location: authUser.location || "",
        gender: authUser.gender || "",
        avatar: authUser.avatar || default_logo,
      });
    }
  }, [authUser]);

  // Open file selector
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // Upload avatar
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageToCrop(event.target.result);
      setShowCropModal(true);
      setCropPosition({ x: 0, y: 0 });
      setZoom(1);

      const img = new Image();
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Handle crop and upload
  const handleCropAndUpload = async () => {
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

    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      size,
      size
    );

    canvas.toBlob(
      async (blob) => {
        // ✅ CHANGED: Send location fields separately
        const locationParts = user.location?.split(", ") || ["", "", "", ""];
        
        const formData = new FormData();
        formData.append("avatar", blob, "avatar.jpg");
        formData.append("email", user.email);
        formData.append("province", locationParts[0] || "");
        formData.append("district", locationParts[1] || "");
        formData.append("municipality", locationParts[2] || "");
        formData.append("ward", locationParts[3] || "");
        formData.append("gender", user.gender);

        try {
          const response = await fetch(API.USER_PROFILE, {
            method: "POST",
            body: formData,
            credentials: "include",
          });

          const result = await response.json();
          if (result.status === "success") {
            toast.success("Profile Picture updated successfully!");
            const newAvatarUrl = result.avatar.startsWith("http")
              ? result.avatar
              : `${API.UPLOADS}/${result.avatar}`;
            
            // ✅ CHANGED: Handle location object from PHP response
            const newLocation = result.location 
              ? `${result.location.province}, ${result.location.district}, ${result.location.municipality}, ${result.location.ward}`
              : user.location;
            
            setUser((prev) => ({ 
              ...prev, 
              avatar: newAvatarUrl,
              location: newLocation 
            }));

            login({
              ...authUser,
              avatar: newAvatarUrl,
              location: newLocation,
              gender: result.gender,
            });

            setShowCropModal(false);
            setImageToCrop(null);
          } else {
            toast.error(result.message || "Failed to update profile picture");
          }
        } catch (err) {
          toast.error("Error uploading avatar");
          console.error("Error uploading avatar:", err);
        }
      },
      "image/jpeg",
      0.95
    );
  };

  // Handle mouse/touch drag
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

    setCropPosition((prev) => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }));

    setDragStart({ x: clientX, y: clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    setZoom((prev) => Math.min(Math.max(0.5, prev + delta * 0.5), 3));
  };

  const openEditPopup = (field) => {
    setEditingField(field);
    if (field === "location") {
      const locationParts = user.location?.split(", ") || [];
      if (locationParts.length === 4) {
        setSelectedProvince(locationParts[0] || "");
        setSelectedDistrict(locationParts[1] || "");
        setSelectedMunicipal(locationParts[2] || "");
        setSelectedWard(locationParts[3] || "");
      } else {
        setSelectedProvince("");
        setSelectedDistrict("");
        setSelectedMunicipal("");
        setSelectedWard("");
      }
    } else if (field === "username") {
      setTempValue(user[field] || "");
      refreshSuggestions();
    } else {
      setTempValue(user[field] || "");
    }
    setUsernameError("");
    setUsernameTakenError("");
    setSuggestionModalOpen(false);
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue("");
    setUsernameError("");
    setUsernameTakenError("");
    setSuggestionModalOpen(false);
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedMunicipal("");
    setSelectedWard("");
  };

  const handleSave = async () => {
    let value;

    if (editingField === "location") {
      if (
        !selectedProvince ||
        !selectedDistrict ||
        !selectedMunicipal ||
        !selectedWard
      ) {
        toast.error("Please select all location fields");
        return;
      }
      value = `${selectedProvince}, ${selectedDistrict}, ${selectedMunicipal}, ${selectedWard}`;
    } else if (editingField === "username") {
      if (!tempValue.trim()) {
        toast.error("Please enter a value");
        return;
      }
      if (usernameError || usernameTakenError) return;
      value = tempValue.trim();
    }

    const field = editingField;
    const oldValue = user[field];
    setUser((prev) => ({ ...prev, [field]: value }));
    setEditingField(null);
    setTempValue("");

    try {
      let response, result;

      if (field === "username") {
        response = await fetch(API.USERNAME_PERSONAL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            action: "update",
            email: user.email,
            username: value,
          }),
          credentials: "include",
        });
        result = await response.json();

        if (result.status === "success") {
          login({
            ...authUser,
            name: result.username,
          });
          toast.success("Username updated successfully");
        } else {
          setUser((prev) => ({ ...prev, username: oldValue }));
          if (result.message === "Username already taken") {
            setUsernameTakenError(
              "Username is already taken, choose another one"
            );
          }
          toast.error(result.message || "Failed to update username");
        }
      } else if (field === "location") {
        // ✅ CHANGED: Send location fields separately to PHP
        const formData = new FormData();
        formData.append("email", user.email);
        formData.append("province", selectedProvince);
        formData.append("district", selectedDistrict);
        formData.append("municipality", selectedMunicipal);
        formData.append("ward", selectedWard);
        formData.append("gender", user.gender);

        response = await fetch(API.USER_PROFILE, {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        result = await response.json();

        if (result.status === "success") {
          // ✅ CHANGED: Handle location object from PHP response
          const newLocation = result.location 
            ? `${result.location.province}, ${result.location.district}, ${result.location.municipality}, ${result.location.ward}`
            : value;
          
          setUser((prev) => ({ ...prev, location: newLocation }));
          
          login({
            ...authUser,
            location: newLocation,
            name: result.username,
            gender: result.gender,
            avatar: result.avatar,
          });
          toast.success("Location updated successfully");
        } else {
          setUser((prev) => ({ ...prev, location: oldValue }));
          toast.error(result.message || "Failed to update location");
        }
      }
    } catch (err) {
      setUser((prev) => ({ ...prev, [field]: oldValue }));
      toast.error(`Error updating ${field}`);
      console.error(`Error updating ${field}:`, err);
    }
  };

  // Gender selection
  const handleGenderSelect = async (option) => {
    const oldGender = user.gender;
    setUser((prev) => ({ ...prev, gender: option }));
    setGenderDropdownOpen(false);

    // ✅ CHANGED: Send location fields separately
    const locationParts = user.location?.split(", ") || ["", "", "", ""];
    
    const formData = new FormData();
    formData.append("email", user.email);
    formData.append("province", locationParts[0] || "");
    formData.append("district", locationParts[1] || "");
    formData.append("municipality", locationParts[2] || "");
    formData.append("ward", locationParts[3] || "");
    formData.append("gender", option);

    try {
      const response = await fetch(API.USER_PROFILE, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await response.json();

      if (result.status === "success") {
        // ✅ CHANGED: Handle location object from PHP response
        const newLocation = result.location 
          ? `${result.location.province}, ${result.location.district}, ${result.location.municipality}, ${result.location.ward}`
          : user.location;
        
        login({
          ...authUser,
          name: result.username,
          location: newLocation,
          gender: result.gender,
          avatar: result.avatar,
        });
        toast.success("Gender updated successfully");
      } else {
        setUser((prev) => ({ ...prev, gender: oldGender }));
        toast.error(result.message || "Failed to update gender");
      }
    } catch (err) {
      setUser((prev) => ({ ...prev, gender: oldGender }));
      toast.error("Error updating gender");
      console.error("Error updating gender:", err);
    }
  };

  const isSaveDisabled = () => {
    if (editingField === "location") {
      return (
        !selectedProvince ||
        !selectedDistrict ||
        !selectedMunicipal ||
        !selectedWard
      );
    }
    if (editingField !== "username") return false;
    return !tempValue || usernameError || usernameTakenError;
  };

  const refreshSuggestions = async () => {
    try {
      const response = await fetch(API.USERNAME_PERSONAL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          action: "suggest",
          email: user.email,
        }),
        credentials: "include",
      });
      const result = await response.json();
      if (result.status === "success") {
        setUsernameSuggestions(result.suggestions);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleUsernameChange = async (value, error) => {
    setTempValue(value);
    setUsernameError(error);

    if (error === "") {
      setUsernameTakenError("");

      if (value.trim() && value !== user.username) {
        try {
          const response = await fetch(API.USERNAME_PERSONAL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              action: "check",
              username: value,
              email: user.email,
            }),
            credentials: "include",
          });
          const result = await response.json();
          if (result.status === "taken") {
            setUsernameTakenError("Username is already taken");
          } else {
            setUsernameTakenError("");
          }
        } catch (err) {
          console.error("Error checking username:", err);
        }
      }
    }
  };

  return (
    <div className="max-w-full sm:max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <ProfileHeader
        avatar={user.avatar}
        onAvatarClick={handleAvatarClick}
        onViewProfile={() => setShowProfilePicModal(true)}
        fileInputRef={fileInputRef}
        onAvatarChange={handleAvatarChange}
      />

      {/* Content */}
      <div className="space-y-3">
        {/* Email */}
        <ProfileField label="Email" value={user.email} isEditable={false} />

        {/* Username */}
        <ProfileField
          label="Username"
          value={user.username}
          onClick={() => openEditPopup("username")}
        />

        {/* Location & Gender */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Location */}
          <div className="flex-1">
            <ProfileField
              label="Location"
              value={user.location || "Add Location"}
              onClick={() => openEditPopup("location")}
            />
          </div>

          {/* Gender */}
          <GenderDropdown
            gender={user.gender}
            isOpen={genderDropdownOpen}
            onToggle={setGenderDropdownOpen}
            onSelect={handleGenderSelect}
            options={genderOptions}
          />
        </div>
      </div>

      {/* Main Edit Modal */}
      <EditModal
        isOpen={editingField && !suggestionModalOpen}
        field={editingField}
        value={tempValue}
        onChange={setTempValue}
        onSave={handleSave}
        onCancel={handleCancel}
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
             initialLocation={user.location}
          />
        ) : (
          <UsernameInput
            value={tempValue}
            onChange={handleUsernameChange}
            error={usernameError}
            takenError={usernameTakenError}
            onEnter={() => !isSaveDisabled() && handleSave()}
            onEscape={handleCancel}
          />
        )}
      </EditModal>

      {/* Suggestions Modal */}
      <SuggestionsModal
        isOpen={suggestionModalOpen}
        suggestions={usernameSuggestions}
        onSelect={(name) => {
          setTempValue(name);
          setSuggestionModalOpen(false);
        }}
        onRefresh={refreshSuggestions}
        onClose={() => setSuggestionModalOpen(false)}
      />

      {/* Profile Picture View Modal */}
      <ProfilePicModal
        isOpen={showProfilePicModal}
        avatar={user.avatar}
        onClose={() => setShowProfilePicModal(false)}
      />

      {/* Image Crop Modal */}
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
        onSave={handleCropAndUpload}
        onCancel={() => {
          setShowCropModal(false);
          setImageToCrop(null);
        }}
        cropImageRef={cropImageRef}
        cropContainerRef={cropContainerRef}
      />
    </div>
  );
};

export default Personal_Settings;