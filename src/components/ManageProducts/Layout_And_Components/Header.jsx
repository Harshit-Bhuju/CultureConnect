import React from 'react';
import { ArrowLeft, Plus, Package, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CultureConnectLogo from "../../../assets/logo/cultureconnect__fav.png";
import { useAuth } from '../../../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAddProduct = () => {
    navigate(`/seller/products/new/${user?.seller_id}`);
  };

  const handleViewAnalytics = () => {
    navigate(`/seller/analytics/${user?.seller_id}`);
  };

  const handleDrafts = () => {
    navigate(`/seller/drafts/${user?.seller_id}`);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-6 top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/sellerprofile/${user?.seller_id}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 " />
          <span className="font-medium">Back to Profile</span>
        </button>

        {/* Header Content */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl">
                <img
                  src={CultureConnectLogo}
                  alt="CultureConnect Logo"
                  className="w-8 h-8 object-contain"
                />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Culture Connect</h1>
              <p className="text-gray-600 mt-1 font-medium">Product Management Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleViewAnalytics}
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg font-semibold border border-gray-300"
            >
              <BarChart3 size={20} strokeWidth={2.5} />
              View Analytics
            </button>

            <button
              onClick={handleDrafts}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg font-semibold border border-gray-300"
            >
              <Package size={20} strokeWidth={2.5} />
              Drafts
            </button>
            
            <button
              onClick={handleAddProduct}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg font-semibold "
            >
              <Plus size={20} strokeWidth={2.5} />
              Add Product
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
