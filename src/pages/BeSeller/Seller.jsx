import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Store, Upload, X } from 'lucide-react';
import useNepalAddress from '../../hooks/NepalAddress';
import API from '../../Configs/ApiEndpoints';
import toast from 'react-hot-toast';

function SellerForm() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [bannerPreview, setBannerPreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
    businessEmail: user?.email || '',
    esewaPhone: '',
    primaryCategory: '',
    termsAccepted: false
  });

  const {
    provinces,
    districts,
    municipals,
    wards,
    selectedProvince,
    selectedDistrict,
    selectedMunicipal,
    selectedWard,
    setSelectedProvince,
    setSelectedDistrict,
    setSelectedMunicipal,
    setSelectedWard,
  } = useNepalAddress();

  const handleImagePreview = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'banner') {
          setBannerPreview(reader.result);
          setBannerFile(file);
        }
        if (type === 'logo') {
          setLogoPreview(reader.result);
          setLogoFile(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
    <div className="bg-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Store className="w-10 h-10 text-gray-800" />
            <h1 className="text-4xl font-bold text-gray-800">CultureConnect</h1>
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Seller Registration</h2>
          <p className="text-gray-600">Join our community of cultural artisans and sellers</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-6">
            {/* Store Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Store Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded text-gray-800 focus:outline-none focus:border-gray-500 focus:bg-white"
                placeholder="Enter your store name"
              />
            </div>

            {/* Store Description */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Store Description <span className="text-gray-500">(Optional)</span>
              </label>
              <textarea
                rows={4}
                value={formData.storeDescription}
                onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded text-gray-800 focus:outline-none focus:border-gray-500 focus:bg-white"
                placeholder="Tell customers about your store and products..."
              />
            </div>

            {/* Business Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
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
              <label className="block text-sm font-medium mb-4 text-gray-700">
                Business Location <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
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
                </div>
              </div>
            </div>

            {/* eSewa Phone Number */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                eSewa Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.esewaPhone}
                onChange={(e) => setFormData({ ...formData, esewaPhone: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded text-gray-800 focus:outline-none focus:border-gray-500 focus:bg-white"
                placeholder="98XXXXXXXX"
              />
              <p className="text-xs text-gray-500 mt-1">Payment will be sent to this eSewa account</p>
            </div>

            {/* Primary Category */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
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
            </div>

            {/* Store Logo Upload */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Store Logo <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
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
            </div>

            {/* Store Banner Upload */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Store Banner <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                {bannerPreview ? (
                  <div className="relative">
                    <img src={bannerPreview} alt="Banner Preview" className="w-full h-48 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => {
                        setBannerPreview(null);
                        setBannerFile(null);
                      }}
                      className="absolute top-2 right-2 bg-red-600 rounded-full p-1 hover:bg-red-700"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
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
            </div>

            {/* Terms & Conditions */}
            <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
              <h3 className="font-semibold mb-4 text-lg text-gray-800">Terms & Conditions for Sellers:</h3>
              <ul className="space-y-3 text-sm text-gray-700 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-gray-800 mt-1">•</span>
                  <span><strong>Commission:</strong> A 1% commission will be deducted from each successful sale</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-800 mt-1">•</span>
                  <span><strong>Delivery:</strong> Buyers are responsible for all delivery charges. Sellers incur no delivery costs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-800 mt-1">•</span>
                  <span><strong>Shipping:</strong> Products must be shipped to the nearest branch location selected by the buyer at checkout</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-800 mt-1">•</span>
                  <span><strong>Payment:</strong> Settlements are processed within 7 business days after successful delivery</span>
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
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gray-800 text-white font-semibold py-4 rounded hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerForm;