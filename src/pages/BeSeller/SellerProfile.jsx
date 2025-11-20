import React, { useState } from "react";
import { MapPin, Heart } from "lucide-react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../../components/ui/sidebar";
import AppSidebar from "../../components/Layout/app-sidebar";
import Navbar from "../../components/Layout/NavBar";

// Mock seller data
const mockSeller = {
  storeName: "Cultural Crafts",
  storeDescription:
    "We bring authentic Nepalese crafts directly to your doorstep. Handmade, traditional, and unique.",
  banner: "https://images.unsplash.com/photo-1602524209726-1e2381e2c0f7?auto=format&fit=crop&w=1470&q=80",
  logo: "https://images.unsplash.com/photo-1612831455542-bd99a0ff6c3d?auto=format&fit=crop&w=400&q=80",
  province: "Bagmati",
  district: "Kathmandu",
  municipality: "Kathmandu Metropolitan",
  ward: "Ward 7",
  followers: 256,
  createdAt: "2025-20-11",
  productsNo: 10
};

// Mock products
const mockProducts = [
  {
    id: 1,
    name: "Traditional Dhaka Topi",
    category: "Clothing",
    price: "₹1200",
    image: "https://images.unsplash.com/photo-1589987604952-fb47e05dba6c?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    name: "Handmade Pottery Vase",
    category: "Arts & Decors",
    price: "₹3500",
    image: "https://images.unsplash.com/photo-1610384128025-2f81f2f0df95?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    name: "Nepali Madal",
    category: "Musical Instruments",
    price: "₹1500",
    image: "https://images.unsplash.com/photo-1601093290757-d0dbda3bb4cd?auto=format&fit=crop&w=500&q=80",
  },
];

const SellerProfile = () => {
  const [activeTab, setActiveTab] = useState("products");

  return (
        <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar />
    <div className="bg-gray-50">
      {/* Banner */}
      <div className="relative w-full h-64 bg-gray-200">
        <img
          src={mockSeller.banner}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        {/* Profile Picture */}
        <div className="absolute -bottom-16 left-6 w-32 h-32 border-4 border-white rounded-full overflow-hidden shadow-lg">
          <img
            src={mockSeller.logo}
            alt="Logo"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Seller Info */}
      <div className="mt-20 px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{mockSeller.storeName}</h1>
            <p className="text-gray-600 mt-2">{mockSeller.storeDescription}</p>
            <div className="flex items-center gap-4 mt-3 text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{`${mockSeller.province}, ${mockSeller.district}`}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{mockSeller.followers} followers</span>
              </div>
               <div>
                <span>Created At {mockSeller.createdAt}</span>
              </div>
               <div>
                <span>Products({mockSeller.productsNo})</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700">
              Follow
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
              Message
            </button>
          </div>
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
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-3 px-2 font-medium transition-colors ${
                activeTab === "reviews"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "hover:text-gray-800"
              }`}
            >
              Reviews
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "products" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mockProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow p-4 flex flex-col"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{product.category}</p>
                  <p className="text-gray-900 font-bold mt-2">{product.price}</p>
                  <button className="mt-3 py-2 px-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "about" && (
            <div className="bg-white p-6 rounded-lg shadow space-y-4">
              <h2 className="font-bold text-lg text-gray-800">About {mockSeller.storeName}</h2>
              <p className="text-gray-600">{mockSeller.storeDescription}</p>
              <p className="text-gray-600">
                Location: {mockSeller.ward}, {mockSeller.municipality}, {mockSeller.district}, {mockSeller.province}
              </p>
              <p className="text-gray-600">Contact: seller@example.com</p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="bg-white p-6 rounded-lg shadow space-y-4">
              <p className="text-gray-500 text-center">No reviews yet.</p>
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
