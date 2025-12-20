import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { SidebarProvider, SidebarInset } from "../../components/ui/sidebar";
import AppSidebar from "../../components/Layout/app-sidebar";
import Navbar from "../../components/Layout/NavBar";
import Card from "../../components/cardLayout/Card";
import { Link, useParams } from "react-router-dom";
import API, { BASE_URL } from "../../Configs/ApiEndpoints";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/common/Loading";

const SellerProfile = () => {
  const { id } = useParams();
  const { user } = useAuth?.() || {};
  const [activeTab, setActiveTab] = useState("products");
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [sellerData, setSellerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    if (id) {
      fetchSellerProfile(id);
      fetchSellerProducts(id);
      checkFollowStatus(id);
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
        setFollowersCount(result.seller_profile.followers_count || 0);
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

  const fetchSellerProducts = async (sellerId) => {
    setProductsLoading(true);
    try {
      const response = await fetch(`${API.GET_SELLER_PRODUCTS}?seller_id=${sellerId}`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        const activeProducts = result.products.filter(
          product => product.status === 'Active'
        );
        setProducts(activeProducts);
      } else {
        console.error("Failed to fetch products:", result.error);
        setProducts([]);
      }
    } catch (err) {
      console.error("Fetch products error:", err);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const checkFollowStatus = async (sellerId) => {
    try {
      const response = await fetch(`${API.CHECK_FOLLOW_STATUS}?seller_id=${sellerId}`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (result.status === "success") {
        setIsFollowing(result.is_following);
      }
    } catch (err) {
      console.error("Check follow status error:", err);
    }
  };

  const handleFollowToggle = async () => {
    if (!user) {
      toast.error("Please login to follow sellers");
      return;
    }

    setFollowLoading(true);
    try {
      const action = isFollowing ? "unfollow" : "follow";
      const formData = new FormData();
      formData.append("seller_id", id);
      formData.append("action", action);

      const response = await fetch(API.FOLLOW_SELLER, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await response.json();

      if (result.status === "success") {
        setIsFollowing(result.is_following);
        setFollowersCount(result.followers_count);
        toast.success(result.message);
      } else {
        toast.error(result.message || "Failed to update follow status");
      }
    } catch (err) {
      console.error("Follow toggle error:", err);
      toast.error("Error updating follow status");
    } finally {
      setFollowLoading(false);
    }
  };

  if (isLoading) {
    return (<Loading message='Loading Profile...'  />);
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

                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-6 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{followersCount} Followers</span>
                    </div>
                    <div>
                      <span>Products ({products.length})</span>
                    </div>
                  </div>
                  <div className="text-gray-600 text-md">
                    <span className="font-bold">Primary Category: </span>
                    <span>{sellerData.category}</span>
                  </div>
                  <div className="text-gray-600 text-md">
                    <span className="font-bold">Joined: </span>
                    <span>{sellerData.created_at}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {!isOwnProfile ? (
                <div className="flex gap-3 mt-4 md:mt-0">
                  <button 
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={`px-4 py-2 rounded transition-colors flex items-center gap-2 ${
                      isFollowing 
                        ? "bg-gray-200 text-gray-800 hover:bg-gray-300" 
                        : "bg-gray-800 text-white hover:bg-gray-700"
                    } ${followLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {followLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <Heart 
                          className={`w-4 h-4 ${isFollowing ? "fill-current" : ""}`} 
                        />
                        <span>{isFollowing ? "Following" : "Follow"}</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 mt-4 md:mt-0">
                  <Link to="/customiseprofile">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                      Customize Account
                    </button>
                  </Link>
                  <Link to={`/seller/manageproducts/${user?.seller_id}`}>
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
                <div>
                  {productsLoading ? (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading products...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {products.length > 0 ? (
                        products.map((product) => (
                          <Card key={product.id} product={product} />
                        ))
                      ) : (
                        <div className="col-span-full text-center py-12">
                          <p className="text-gray-500 mb-2">No products available</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "about" && (
                <div className="bg-white p-6 rounded-lg shadow space-y-4">
                  <h2 className="font-bold text-lg text-gray-800">
                    About {sellerData.name}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {sellerData.description}
                  </p>
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