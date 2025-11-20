import React, { useState } from 'react';
import { Store, Upload, X } from 'lucide-react';

export default function CultureConnectSellerForm() {
  const [currentPage, setCurrentPage] = useState('form'); // 'form' or 'profile'
  const [bannerPreview, setBannerPreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleImagePreview = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'banner') setBannerPreview(reader.result);
        if (type === 'logo') setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (currentPage === 'profile') {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Banner Section */}
        <div className="relative">
          <div className="w-full h-48 md:h-64 bg-gradient-to-r from-gray-800 to-gray-900 overflow-hidden">
            {bannerPreview ? (
              <img src={bannerPreview} alt="Store Banner" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600">
                <span className="text-lg">Store Banner</span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Section */}
        <div className="max-w-7xl mx-auto px-4 -mt-16 md:-mt-20 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Logo */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-800 border-4 border-black overflow-hidden">
                {logoPreview ? (
                  <img src={logoPreview} alt="Store Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Store className="w-16 h-16 text-gray-600" />
                  </div>
                )}
              </div>
            </div>

            {/* Store Info */}
            <div className="flex-1 mt-4 md:mt-12">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">Traditional Arts Store</h1>
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <p className="text-gray-400 mb-1">@traditionalarts · 245 followers · 89 products</p>
              
              <p className="text-gray-300 mb-3 max-w-3xl">
                Authentic Nepali traditional clothing, handcrafted with love. Preserving our culture through quality craftsmanship.
              </p>

              <p className="text-sm text-gray-400 mb-4">
                📍 Kathmandu, Nepal · Joined December 2024
              </p>

              <button className="bg-red-600 text-white px-8 py-2 rounded font-semibold hover:bg-red-700 transition-colors">
                Follow
              </button>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="max-w-7xl mx-auto px-4 mt-12">
          <div className="border-b border-gray-800">
            <div className="flex gap-8">
              <button className="px-4 py-4 border-b-2 border-white font-semibold">
                Products
              </button>
              <button className="px-4 py-4 text-gray-400 hover:text-white">
                About
              </button>
            </div>
          </div>

          {/* Products Grid Placeholder */}
          <div className="py-12">
            <div className="text-center text-gray-500">
              <Store className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Products will be displayed here</p>
              <p className="text-sm mt-2">Seller will add products after registration</p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="fixed bottom-8 left-8">
          <button 
            onClick={() => setCurrentPage('form')}
            className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 transition-colors"
          >
            Back to Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Store className="w-10 h-10" />
            <h1 className="text-4xl font-bold">CultureConnect</h1>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Seller Registration</h2>
          <p className="text-gray-400">Join our community of cultural artisans and sellers</p>
        </div>

        {/* Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
          <div className="space-y-6">
            {/* Store Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Store Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-gray-500"
                placeholder="Enter your store name"
              />
            </div>

            {/* Store Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Store Description <span className="text-gray-500">(Optional)</span>
              </label>
              <textarea 
                rows={4}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-gray-500"
                placeholder="Tell customers about your store and products..."
              />
            </div>

            {/* Business Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Business Email <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-gray-500"
                placeholder="your.business@example.com"
              />
            </div>

            {/* Business Location */}
            <div>
              <label className="block text-sm font-medium mb-4">
                Business Location <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Province</label>
                  <select className="w-full px-4 py-3 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-gray-500">
                    <option value="">Select Province</option>
                    <option>Province 1</option>
                    <option>Madhesh Province</option>
                    <option>Bagmati Province</option>
                    <option>Gandaki Province</option>
                    <option>Lumbini Province</option>
                    <option>Karnali Province</option>
                    <option>Sudurpashchim Province</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">District</label>
                  <select className="w-full px-4 py-3 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-gray-500">
                    <option value="">Select District</option>
                    <option>Kathmandu</option>
                    <option>Lalitpur</option>
                    <option>Bhaktapur</option>
                    <option>Pokhara</option>
                    <option>Chitwan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Municipality</label>
                  <select className="w-full px-4 py-3 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-gray-500">
                    <option value="">Select Municipality</option>
                    <option>Metropolitan</option>
                    <option>Sub-Metropolitan</option>
                    <option>Municipality</option>
                    <option>Rural Municipality</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Ward</label>
                  <select className="w-full px-4 py-3 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-gray-500">
                    <option value="">Select Ward</option>
                    {[...Array(32)].map((_, i) => (
                      <option key={i} value={i + 1}>Ward {i + 1}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* eSewa Phone Number */}
            <div>
              <label className="block text-sm font-medium mb-2">
                eSewa Phone Number <span className="text-red-500">*</span>
              </label>
              <input 
                type="tel" 
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-gray-500"
                placeholder="98XXXXXXXX"
              />
              <p className="text-xs text-gray-500 mt-1">Payment will be sent to this eSewa account</p>
            </div>

            {/* Primary Category */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Primary Category of Selling <span className="text-red-500">*</span>
              </label>
              <select className="w-full px-4 py-3 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-gray-500">
                <option value="">Select Category</option>
                <option>Traditional Clothing</option>
                <option>Musical Instruments</option>
                <option>Arts & Decors</option>
              </select>
            </div>

            {/* Store Logo Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Store Logo <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-6">
                {logoPreview ? (
                  <div className="relative">
                    <img src={logoPreview} alt="Logo Preview" className="w-32 h-32 mx-auto rounded-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setLogoPreview(null)}
                      className="absolute top-0 right-1/2 translate-x-16 bg-red-600 rounded-full p-1 hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-600 mb-2" />
                    <span className="text-sm text-gray-400">Click to upload logo</span>
                    <span className="text-xs text-gray-600 mt-1">Recommended: 400x400px, PNG or JPG</span>
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
              <label className="block text-sm font-medium mb-2">
                Store Banner <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-6">
                {bannerPreview ? (
                  <div className="relative">
                    <img src={bannerPreview} alt="Banner Preview" className="w-full h-48 object-cover rounded" />
                    <button 
                      type="button"
                      onClick={() => setBannerPreview(null)}
                      className="absolute top-2 right-2 bg-red-600 rounded-full p-1 hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-600 mb-2" />
                    <span className="text-sm text-gray-400">Click to upload banner</span>
                    <span className="text-xs text-gray-600 mt-1">Recommended: 2048x1152px, 6MB or less</span>
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
            <div className="border border-gray-700 rounded-lg p-6 bg-gray-950">
              <h3 className="font-semibold mb-4 text-lg">Terms & Conditions for Sellers:</h3>
              <ul className="space-y-3 text-sm text-gray-300 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">•</span>
                  <span><strong>Commission:</strong> A 1% commission will be deducted from each successful sale</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">•</span>
                  <span><strong>Delivery:</strong> Buyers are responsible for all delivery charges. Sellers incur no delivery costs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">•</span>
                  <span><strong>Shipping:</strong> Products must be shipped to the nearest branch location selected by the buyer at checkout</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">•</span>
                  <span><strong>Payment:</strong> Settlements are processed within 7 business days after successful delivery</span>
                </li>
              </ul>
              
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 mt-0.5 bg-black border-gray-700 rounded" />
                <span className="text-sm">I agree to the Terms & Conditions and confirm that the information provided is accurate</span>
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="button"
              onClick={() => setCurrentPage('profile')}
              className="w-full bg-white text-black font-semibold py-4 rounded hover:bg-gray-200 transition-colors"
            >
              Submit Application
            </button>
          </div>
        </div>

        {/* Preview Profile Button */}
        <div className="text-center mt-6">
          <button 
            onClick={() => setCurrentPage('profile')}
            className="text-gray-400 hover:text-white text-sm underline"
          >
            Preview Store Profile
          </button>
        </div>
      </div>
    </div>
  );
}