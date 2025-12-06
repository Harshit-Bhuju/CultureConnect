import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { SidebarProvider, SidebarInset } from "../../components/ui/sidebar";
import AppSidebar from "../../components/Layout/app-sidebar";
import Navbar from "../../components/Layout/NavBar";
import Card from "../../components/cardLayout/Card";
import { Link, useParams } from "react-router-dom";
import API, { BASE_URL } from "../../Configs/ApiEndpoints"; // ✅ Import BASE_URL
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const SellerProfile = () => {
  const { id } = useParams();
  const { user } = useAuth?.() || {};
  const [activeTab, setActiveTab] = useState("products");
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [sellerData, setSellerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (id) {
      fetchSellerProfile(id);
    }
  }, [id]);

  const fetchSellerProfile = async (sellerId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API.GET_SELLER_PROFILE}?seller_id=${sellerId}`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (result.status === "success") {
        setSellerData(result.seller_profile);
        const currentUserSellerId = user?.seller_id;
        setIsOwnProfile(currentUserSellerId && currentUserSellerId == sellerId);
      } else {
        toast.error(result.message || "Failed to load profile");
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
      toast.error("Error loading seller profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Navbar />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!sellerData) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Navbar />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Seller profile not found</p>
              <Link to="/seller-registration">
                <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Register as Seller
                </button>
              </Link>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar />
        <div className="bg-gray-50 min-h-screen pb-12">
          {/* Banner */}
          <div className="relative w-full h-64 bg-gray-200">
            <img
              src={`${BASE_URL}/seller_img_datas/seller_banners/${sellerData.store_banner}`}
              alt="Store Banner"
              className="w-full h-full object-cover"
            />
            {/* Profile Picture */}
            <div className="absolute -bottom-16 left-6 w-32 h-32 border-4 border-white rounded-full overflow-hidden shadow-lg bg-white">
              <img
                src={`${BASE_URL}/seller_img_datas/seller_logos/${sellerData.store_logo}`}
                alt="Store Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Seller Info */}
          <div className="mt-20 px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{sellerData.name}</h1>
                <p className="text-gray-600 mt-2">{sellerData.description}</p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-6 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{sellerData.followers_count || 0} followers</span>
                    </div>
                    <div>
                      <span>Products ({sellerData.products_count || 0})</span>
                    </div>
                  </div>
                  <div className="text-gray-500 text-sm">
                    <span>Joined {new Date(sellerData.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 text-sm">Category: {sellerData.category}</p>
                </div>
              </div>

              {/* Action Buttons */}
              {!isOwnProfile ? (
                <div className="flex gap-3 mt-4 md:mt-0">
                  <button className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors">
                    Follow
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                    Message
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 mt-4 md:mt-0">
                  <Link to="/customiseprofile">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                      Customize Account
                    </button>
                  </Link>
                  <Link to="/manageproducts">
                    <button className="px-4 py-2 border border-gray-800 text-gray-800 rounded hover:bg-gray-100 transition-colors">
                      Manage Products
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="mt-8 border-b border-gray-200">
              <nav className="flex gap-4 text-gray-600">
                <button
                  onClick={() => setActiveTab("products")}
                  className={`py-3 px-2 font-medium transition-colors ${
                    activeTab === "products"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "hover:text-gray-800"
                  }`}
                >
                  Products
                </button>
                <button
                  onClick={() => setActiveTab("about")}
                  className={`py-3 px-2 font-medium transition-colors ${
                    activeTab === "about"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "hover:text-gray-800"
                  }`}
                >
                  About
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === "products" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {products.length > 0 ? (
                    products.map((product) => <Card key={product.id} product={product} />)
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500 mb-2">No products yet</p>
                      {isOwnProfile && (
                        <Link to="/manageproducts">
                          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                            Add Your First Product
                          </button>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "about" && (
                <div className="bg-white p-6 rounded-lg shadow space-y-4">
                  <h2 className="font-bold text-lg text-gray-800">About {sellerData.name}</h2>
                  <p className="text-gray-600 leading-relaxed">{sellerData.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SellerProfile;