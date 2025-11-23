import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Store, Upload, X, Check, Mail, Shield } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import CropModal from "../../profileSettings_Components/CropModal";

function SellerForm() {
  const [bannerPreview, setBannerPreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
    businessEmail: '',
    esewaPhone: '',
    primaryCategory: '',
    province: '',
    district: '',
    municipal: '',
    ward: '',
    termsAccepted: false
  });

  const provinces = ['Province 1', 'Bagmati Province', 'Gandaki Province'];
  const districts = ['Kathmandu', 'Lalitpur', 'Bhaktapur'];
  const municipals = ['Kathmandu Metro', 'Lalitpur Metro', 'Bhaktapur Metro'];
  const wards = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'];

  const validateStoreName = (name) => {
    if (!name.trim()) return 'Store name is required';
    if (name.length < 3) return 'Store name must be at least 3 characters';
    if (name.length > 100) return 'Store name must not exceed 100 characters';
    if (!/^[a-zA-Z\s&]+$/.test(name)) return 'Only letters and & symbol are allowed';
    return '';
  };

  const validateStoreDescription = (desc) => {
    if (!desc.trim()) return 'Description is required';
    if (desc.trim() && desc.length < 10) return 'Description must be at least 10 characters';
    if (desc.length > 500) return 'Description must not exceed 500 characters';
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) return 'Business email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validateEsewaPhone = (phone) => {
    if (!phone.trim()) return 'eSewa phone number is required';
    const phoneRegex = /^(98|97)\d{8}$/;
    if (!phoneRegex.test(phone)) return 'Please enter a valid 10-digit Nepali phone number';
    return '';
  };

  const validateCategory = (category) => {
    if (!category) return 'Please select a primary category';
    return '';
  };

  const validateField = (field) => {
    if (!formData[field]) return `Please select a ${field}`;
    return '';
  };

  const validateLogo = () => {
    if (!logoFile) return 'Store logo is required';
    return '';
  };

  const validateBanner = () => {
    if (!bannerFile) return 'Store banner is required';
    return '';
  };

  const validateTerms = () => {
    if (!formData.termsAccepted) return 'You must accept the terms and conditions';
    return '';
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }, [errors]);

  // Handle image file selection
  const handleImageSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = type === 'banner' ? 6 : 4;
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`${type === 'banner' ? 'Banner' : 'Logo'} file size must not exceed ${maxSize}MB`);
      return;
    }
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      toast.error('Only JPG and PNG formats are allowed');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageToCrop(event.target.result);
      setCropType(type);
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

  // Handle crop and save
  const handleCropAndSave = () => {
    if (!imageToCrop) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = cropImageRef.current;

    if (!img) return;

    if (cropType === 'logo') {
      // Circular crop for logo
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
    } else {
      // Rectangular crop for banner
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
    }

    canvas.toBlob((blob) => {
      const file = new File([blob], `${cropType}.jpg`, { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);

      if (cropType === 'logo') {
        setLogoPreview(url);
        setLogoFile(file);
        if (errors.logo) {
          setErrors(prev => ({ ...prev, logo: '' }));
        }
      } else {
        setBannerPreview(url);
        setBannerFile(file);
        if (errors.banner) {
          setErrors(prev => ({ ...prev, banner: '' }));
        }
      }

      setShowCropModal(false);
      setImageToCrop(null);
    }, 'image/jpeg', 0.95);
  };

  // Drag handlers
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

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    setZoom((prev) => Math.min(Math.max(0.5, prev + delta * 0.5), 3));
  };

  const handleSendOtp = async () => {
    const emailError = validateEmail(formData.businessEmail);
    if (emailError) {
      setErrors(prev => ({ ...prev, businessEmail: emailError }));
      return;
    }

    setIsOtpSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setOtpSent(true);
      setShowOtpModal(true);
      setResendTimer(60);
      toast.success('OTP sent to your email!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setIsOtpSending(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    setIsOtpSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
      toast.success('OTP resent to your email!');
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setIsOtpSending(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    
    const newOtp = pastedData.split('');
    while (newOtp.length < 6) newOtp.push('');
    setOtp(newOtp);
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      toast.error('Please enter complete 6-digit OTP');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsOtpVerified(true);
      setShowOtpModal(false);
      toast.success('Email verified successfully!');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const validateRequiredFields = useCallback(() => {
    const newErrors = {};

    const storeNameError = validateStoreName(formData.storeName);
    if (storeNameError) newErrors.storeName = storeNameError;

    const storeDescError = validateStoreDescription(formData.storeDescription);
    if (storeDescError) newErrors.storeDescription = storeDescError;

    const emailError = validateEmail(formData.businessEmail);
    if (emailError) newErrors.businessEmail = emailError;

    const phoneError = validateEsewaPhone(formData.esewaPhone);
    if (phoneError) newErrors.esewaPhone = phoneError;

    const categoryError = validateCategory(formData.primaryCategory);
    if (categoryError) newErrors.primaryCategory = categoryError;

    const provinceError = validateField('province');
    if (provinceError) newErrors.province = provinceError;

    const districtError = validateField('district');
    if (districtError) newErrors.district = districtError;

    const municipalError = validateField('municipal');
    if (municipalError) newErrors.municipal = municipalError;

    const wardError = validateField('ward');
    if (wardError) newErrors.ward = wardError;

    const logoError = validateLogo();
    if (logoError) newErrors.logo = logoError;

    const bannerError = validateBanner();
    if (bannerError) newErrors.banner = bannerError;

    const termsError = validateTerms();
    if (termsError) newErrors.terms = termsError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, logoFile, bannerFile]);

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.storeName || !formData.businessEmail || !formData.esewaPhone ||
      !selectedProvince || !selectedDistrict || !selectedMunicipal || !selectedWard ||
      !formData.primaryCategory || !logoFile || !bannerFile || !formData.termsAccepted) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('storeName', formData.storeName);
      submitData.append('storeDescription', formData.storeDescription);
      submitData.append('businessEmail', formData.businessEmail);
      submitData.append('esewaPhone', formData.esewaPhone);
      submitData.append('primaryCategory', formData.primaryCategory);
      submitData.append('province', selectedProvince);
      submitData.append('district', selectedDistrict);
      submitData.append('municipality', selectedMunicipal);
      submitData.append('ward', selectedWard);
      submitData.append('terms', formData.termsAccepted ? 'on' : 'off');
      submitData.append('logo', logoFile);
      submitData.append('banner', bannerFile);

      // Replace API.SELLER_REGISTRATION with your actual endpoint
      const response = await fetch(API.SELLER_REGISTRATION, {
        method: 'POST',
        body: submitData,
        credentials: 'include',
      });

      const result = await response.json();

      if (result.status === 'success') {
        toast.success('Seller registration successful!');

        // Update user context with seller data
        login({
          ...user,
          role: 'seller',
          sellerId: result.sellerId
        });

        // Navigate to seller profile
        navigate(`/seller-profile/${result.sellerId}`);
      } else {
        toast.error(result.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12 px-4">
      <Toaster position="top-center" />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-2xl shadow-lg">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              CultureConnect
            </h1>
          </div>
          <h2 className="text-3xl font-bold mb-3 text-gray-800">Seller Registration</h2>
          <p className="text-gray-600 text-lg">Join our community of cultural artisans and sellers</p>
        </div>

        {/* OTP Modal */}
        {showOtpModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
              <button onClick={() => setShowOtpModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h3>
                <p className="text-gray-600 text-sm">
                  We've sent a 6-digit code to<br />
                  <span className="font-semibold text-gray-800">{formData.businessEmail}</span>
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">Enter OTP Code</label>
                <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isVerifyingOtp || otp.join('').length !== 6}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed mb-4"
              >
                {isVerifyingOtp ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </div>
                ) : 'Verify OTP'}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                <button
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || isOtpSending}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>
            </div>
          </div>
        )}

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
          }}
          cropImageRef={cropImageRef}
          cropContainerRef={cropContainerRef}
          cropType={cropType}
        />

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
          <div className="space-y-8">
            {/* Store Name */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-800">
                Store Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded text-gray-800 focus:outline-none focus:border-gray-500 focus:bg-white"
                placeholder="Enter your store name"
              />
              {errors.storeName && (
                <p className="text-red-500 text-sm mt-2">{errors.storeName}</p>
              )}
            </div>

            {/* Store Description */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-800">
                Store Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.storeDescription}
                onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded text-gray-800 focus:outline-none focus:border-gray-500 focus:bg-white"
                placeholder="Tell customers about your store and products..."
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-gray-500 text-sm">
                  {formData.storeDescription.length > 0 && formData.storeDescription.length < 10 && '⚠ Minimum 10 characters'}
                </p>
                <p className="text-gray-500 text-sm font-medium">
                  {formData.storeDescription.length}/500
                </p>
              </div>
              {errors.storeDescription && (
                <p className="text-red-500 text-sm mt-1">{errors.storeDescription}</p>
              )}
            </div>

            {/* Business Email with OTP */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-800">
                Business Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.businessEmail}
                onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded text-gray-800 focus:outline-none focus:border-gray-500 focus:bg-white"
                placeholder="your.business@example.com"
              />
            </div>

            {/* Business Location */}
            <div>
              <label className="block text-sm font-semibold mb-4 text-gray-800">
                Business Location <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Province</label>
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded text-gray-800 focus:outline-none focus:border-gray-500 focus:bg-white"
                  >
                    <option value="">Select Province</option>
                    {provinces.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                  {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province}</p>}
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-2">District</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={!selectedProvince}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded text-gray-800 focus:outline-none focus:border-gray-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select District</option>
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                  {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-2">Municipality</label>
                  <select
                    value={selectedMunicipal}
                    onChange={(e) => setSelectedMunicipal(e.target.value)}
                    disabled={!selectedDistrict}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded text-gray-800 focus:outline-none focus:border-gray-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Municipality</option>
                    {municipals.map(municipal => (
                      <option key={municipal} value={municipal}>{municipal}</option>
                    ))}
                  </select>
                  {errors.municipal && <p className="text-red-500 text-xs mt-1">{errors.municipal}</p>}
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-2">Ward</label>
                  <select
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                    disabled={!selectedMunicipal}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded text-gray-800 focus:outline-none focus:border-gray-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Ward</option>
                    {wards.map(ward => (
                      <option key={ward} value={ward}>{ward}</option>
                    ))}
                  </select>
                  {errors.ward && <p className="text-red-500 text-xs mt-1">{errors.ward}</p>}
                </div>
              </div>
            </div>

            {/* eSewa Phone Number */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-800">
                eSewa Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.esewaPhone}
                onChange={(e) => setFormData({ ...formData, esewaPhone: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded text-gray-800 focus:outline-none focus:border-gray-500 focus:bg-white"
                placeholder="98XXXXXXXX"
              />
              <p className="text-gray-500 text-sm mt-2">💳 Payment will be sent to this eSewa account</p>
              {errors.esewaPhone && (
                <p className="text-red-500 text-sm mt-1">{errors.esewaPhone}</p>
              )}
            </div>

            {/* Primary Category */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-800">
                Primary Category of Selling <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.primaryCategory}
                onChange={(e) => setFormData({ ...formData, primaryCategory: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded text-gray-800 focus:outline-none focus:border-gray-500 focus:bg-white"
              >
                <option value="">Select Category</option>
                <option>Traditional Clothing</option>
                <option>Musical Instruments</option>
                <option>Arts & Decors</option>
              </select>
              {errors.primaryCategory && (
                <p className="text-red-500 text-sm mt-2">{errors.primaryCategory}</p>
              )}
            </div>

            {/* Store Logo Upload - CIRCULAR */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-800">
                Store Logo <span className="text-red-500">*</span>
              </label>
              <div name="logo" className={`border-2 border-dashed rounded-2xl p-6 transition-all duration-200 ${errors.logo ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50 hover:border-gray-400'}`}>
                {logoPreview ? (
                  <div className="relative">
                    <img src={logoPreview} alt="Logo Preview" className="w-32 h-32 mx-auto rounded-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setLogoPreview(null);
                        setLogoFile(null);
                      }}
                      className="absolute top-0 right-1/2 translate-x-16 bg-red-600 rounded-full p-1 hover:bg-red-700"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Click to upload logo</span>
                    <span className="text-xs text-gray-500 mt-1">Recommended: 400x400px, PNG or JPG</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImagePreview(e, 'logo')}
                    />
                  </label>
                )}
              </div>
              {errors.logo && (
                <p className="text-red-500 text-sm mt-2">{errors.logo}</p>
              )}
            </div>

            {/* Store Banner Upload - Full Width */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-800">
                Store Banner <span className="text-red-500">*</span>
              </label>
              <div name="banner" className={`border-2 border-dashed rounded-2xl p-6 transition-all duration-200 ${errors.banner ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50 hover:border-gray-400'}`}>
                {bannerPreview ? (
                  <div className="relative">
                    <img src={bannerPreview} alt="Banner Preview" className="w-full h-48 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => {
                        setBannerPreview(null);
                        setBannerFile(null);
                        setErrors(prev => ({ ...prev, banner: '' }));
                        if (bannerInputRef.current) bannerInputRef.current.value = '';
                      }}
                      className="absolute top-2 right-2 bg-red-500 rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                    <p className="text-sm text-gray-600 mt-3 text-center font-medium">Banner uploaded successfully</p>
                  </div>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Click to upload banner</span>
                    <span className="text-xs text-gray-500 mt-1">Recommended: 2048x1152px, 6MB or less</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImagePreview(e, 'banner')}
                    />
                  </label>
                )}
              </div>
              {errors.banner && (
                <p className="text-red-500 text-sm mt-2">{errors.banner}</p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div name="terms" className={`border-2 rounded-2xl p-6 transition-all duration-200 ${errors.terms ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gradient-to-br from-slate-50 to-gray-50'}`}>
              <h3 className="font-bold mb-4 text-lg text-gray-800 flex items-center gap-2">
                📋 Terms & Conditions for Sellers
              </h3>
              <ul className="space-y-3 text-sm text-gray-700 mb-5">
                <li className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                  <span className="text-gray-800 font-bold mt-0.5">•</span>
                  <span><strong className="text-gray-800">Commission:</strong> A 1% commission will be deducted from each successful sale</span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                  <span className="text-gray-800 font-bold mt-0.5">•</span>
                  <span><strong className="text-gray-800">Delivery:</strong> Buyers are responsible for all delivery charges. Sellers incur no delivery costs</span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                  <span className="text-gray-800 font-bold mt-0.5">•</span>
                  <span><strong className="text-gray-800">Shipping:</strong> Products must be shipped to the nearest branch location selected by the buyer at checkout</span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                  <span className="text-gray-800 font-bold mt-0.5">•</span>
                  <span><strong className="text-gray-800">Payment:</strong> Settlements are processed within 7 business days after successful delivery</span>
                </li>
              </ul>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                  className="w-5 h-5 mt-0.5 accent-gray-800"
                />
                <span className="text-sm text-gray-700">I agree to the Terms & Conditions and confirm that the information provided is accurate</span>
              </label>
              {errors.terms && (
                <p className="text-red-500 text-sm mt-3">{errors.terms}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold py-4 rounded-xl hover:from-gray-900 hover:to-black transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@cultureconnect.com" className="text-gray-800 font-semibold hover:underline">
              support@cultureconnect.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SellerForm;