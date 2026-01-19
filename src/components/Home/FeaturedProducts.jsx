import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Pagination,
  Navigation,
  EffectCoverflow,
} from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

import {
  ShoppingBag,
  Eye,
  Heart,
  ArrowRight,
  Sparkles,
  Star,
} from "lucide-react";
import { products } from "../../data/homeData";

const ProductCard = ({ product }) => {
  return (
    <motion.div
      className="p-2"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}>
      <motion.div
        className="group relative bg-white overflow-hidden border border-gray-200 h-[240px] flex"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}>
        {/* Image - Wider, Less Height */}
        <div className="relative w-2/5 bg-gray-100 overflow-hidden">
          <motion.img
            src={product.imagePath}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
          />

          {/* Category Badge */}
          <div className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-3 py-1 uppercase tracking-wide">
            {product.category.replace("-", " ")}
          </div>
        </div>

        {/* Content - Takes remaining space */}
        <div className="w-3/5 p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-gray-900 group-hover:text-red-600 transition-colors duration-300 line-clamp-2 mb-2">
              {product.name}
            </h3>
            <p className="text-xs text-gray-600 mb-2">by {product.artisan}</p>
            <span className="font-bold text-base text-gray-900">
              {product.price}
            </span>
          </div>

          <div className="space-y-2">
            {/* Region & Stock */}
            <div className="flex justify-between items-center text-xs border-t border-gray-200 pt-2">
              <span className="text-gray-600">{product.region}</span>
              <span
                className={`font-bold ${
                  product.inStock ? "text-green-600" : "text-red-600"
                }`}>
                {product.inStock ? "In Stock" : "Sold Out"}
              </span>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-red-600 text-white py-2 text-xs font-bold hover:bg-red-700 transition-colors duration-300">
              Add to Cart
            </motion.button>
          </div>
        </div>

        {/* Hover Border */}
        <motion.div
          className="absolute inset-0 border-2 border-red-600 opacity-0 group-hover:opacity-100 pointer-events-none"
          initial={false}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
};

const FeaturedProducts = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
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
              className="hidden md:flex items-center gap-3 px-6 py-3 bg-red-600 text-white font-bold hover:bg-red-700 transition-colors duration-300 group"
              whileHover={{ x: 5 }}>
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
          className="w-full pb-12"
          style={{
            "--swiper-pagination-color": "#DC2626",
            "--swiper-pagination-bullet-inactive-color": "#D1D5DB",
            "--swiper-navigation-color": "#DC2626",
            "--swiper-navigation-size": "28px",
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
        <button className="flex w-full items-center justify-center gap-2 py-4 bg-red-600 text-white font-bold hover:bg-red-700 transition-colors">
          View All Products
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </section>
  );
};

export default FeaturedProducts;
