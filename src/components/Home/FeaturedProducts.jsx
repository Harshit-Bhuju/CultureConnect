import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { ArrowRight } from "lucide-react";
import { products } from "../../data/homeData";
import Rating from "../Rating/Rating";
import { BASE_URL } from "../../Configs/ApiEndpoints";
import { useAuth } from "../../context/AuthContext";

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle both sellerId and seller_id
  const sellerId = product.sellerId || product.seller_id;
  const productId = product.id;

  // Check if it's seller's own product
  const isOwnProduct =
    user?.seller_id && sellerId && user.seller_id === sellerId;

  const productLink = isOwnProduct
    ? `/seller/products/${user.seller_id}/${productId}`
    : `/products/${sellerId}/${productId}`;

  // Flexible image handling
  const getFirstImage = () => {
    if (product.images?.length > 0) {
      return Array.isArray(product.images) ? product.images[0] : product.images;
    }
    return (
      product.image ||
      product.image_url ||
      product.imageUrl ||
      product.imagePath ||
      null
    );
  };

  const rawImage = getFirstImage();
  const imageUrl = rawImage
    ? rawImage.startsWith("http") || rawImage.startsWith("/")
      ? rawImage
      : `${BASE_URL}/uploads/product_images/${rawImage}`
    : "/placeholder-image.png";

  // Product name fallback
  const productName =
    product.productName ||
    product.name ||
    product.title ||
    product.product_name ||
    "Unnamed Product";

  // Price formatting
  const price = (() => {
    const p = product.price;
    if (typeof p === "number") return p.toLocaleString();
    if (typeof p === "string") {
      // Remove "Rs. " prefix if present
      const cleanPrice = p.replace(/Rs\.\s*/i, "").replace(/,/g, "");
      return parseFloat(cleanPrice || 0).toLocaleString();
    }
    return "0";
  })();

  // Rating normalization
  const rating = product.averageRating ?? product.rating ?? 0;
  const reviews =
    product.totalReviews ?? product.reviews ?? product.reviewCount ?? 0;

  const handleCardClick = (e) => {
    e.preventDefault();

    // Validate required IDs before navigation
    if (!productId || !sellerId) {
      console.error("Missing required IDs for navigation:", {
        productId,
        sellerId,
        product,
      });
      return;
    }

    const currentLocation = location.pathname + (location.search || "");
    console.log("Navigating to:", productLink);
    navigate(productLink, { state: { from: currentLocation } });
  };

  return (
    <motion.div
      className="p-2"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}>
      <motion.div
        className="group relative bg-white overflow-hidden border border-gray-200 h-[280px] flex shadow-sm hover:shadow-xl cursor-pointer rounded-2xl"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        onClick={handleCardClick}>
        {/* Image - Wider, Less Height */}
        <div className="relative w-2/5 bg-gray-100 overflow-hidden">
          <motion.img
            src={imageUrl}
            alt={productName}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
            onError={(e) => {
              e.target.src = "/placeholder-image.png";
            }}
          />
        </div>

        {/* Content - Takes remaining space */}
        <div className="w-3/5 p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-red-600 transition-colors duration-300 line-clamp-2 mb-2">
              {productName}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              by {product.artisan || "Artisan"}
            </p>
            <span className="font-bold text-lg text-gray-900">Rs. {price}</span>
          </div>

          <div className="space-y-2">
            {/* Rating & Stock */}
            <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-3">
              <Rating rating={rating} reviews={reviews} />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-red-600 text-white py-2.5 text-sm font-bold hover:bg-red-700 transition-colors duration-300 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick(e);
              }}>
              Buy Now
            </motion.button>
          </div>
        </div>

        {/* Hover Border */}
        <motion.div
          className="absolute inset-0 border-2 border-red-600 opacity-0 group-hover:opacity-100 pointer-events-none rounded-2xl"
          initial={false}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
};

const FeaturedProducts = () => {
  const navigate = useNavigate();

  const handleViewAllClick = () => {
    navigate("/products");
  };

  return (
    <section className="py-8 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <span className="inline-block text-sm font-bold tracking-wider uppercase text-red-600 mb-3">
              Handpicked For You
            </span>
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900">
              Featured <span className="text-red-600">Collection</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-xl">
              Exclusive handcrafted items that tell a story of centuries-old
              traditions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <motion.button
              className="hidden md:flex items-center gap-3 px-6 py-3 bg-red-600 text-white font-bold hover:bg-red-700 transition-colors duration-300 group rounded-full"
              whileHover={{ x: 5 }}
              onClick={handleViewAllClick}>
              View All Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          loop
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={true}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 2 },
            1280: { slidesPerView: 3 },
          }}
          className="w-full pb-10"
          style={{
            "--swiper-pagination-color": "#DC2626",
            "--swiper-pagination-bullet-inactive-color": "#D1D5DB",
            "--swiper-navigation-color": "#DC2626",
            "--swiper-navigation-size": "28px",
            paddingBottom: "80px",
          }}>
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Mobile CTA */}
      <motion.div
        className="md:hidden px-6 mt-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}>
        <button
          className="flex w-full items-center justify-center gap-2 py-4 bg-red-600 text-white font-bold hover:bg-red-700 transition-colors"
          onClick={handleViewAllClick}>
          View All Products
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </section>
  );
};

export default FeaturedProducts;
