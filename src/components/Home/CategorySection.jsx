import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import API from "../../Configs/ApiEndpoints";

const CategoryCard = ({ category, index }) => {
  return (
    <Link to={category.route}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: index * 0.15,
          type: "spring",
          stiffness: 100,
        }}
        viewport={{ once: false, margin: "-100px" }}
        whileHover={{ y: -12, scale: 1.02 }}
        className="group relative overflow-hidden h-[450px] cursor-pointer bg-gray-900 rounded-2xl">
        {/* Background Image */}
        <div className="absolute inset-0">
          <motion.img
            src={category.imagePath}
            alt={category.name}
            className="w-full h-full object-cover opacity-40 group-hover:opacity-20 transition-opacity duration-500"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

        {/* Red Accent Line - Animates on Hover */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-red-600"
          initial={{ width: 0 }}
          whileInView={{ width: "60px" }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.4 }}
        />

        {/* Content */}
        <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
          {/* Top Section - Icon */}
          <div>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-sm border border-white/20 text-3xl rounded-full">
              {category.icon}
            </motion.div>
          </div>

          {/* Bottom Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-3 leading-tight group-hover:text-red-600 transition-colors duration-300">
                {category.name}
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm mb-2">
                {category.description}
              </p>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                {category.itemCount} Items Available
              </span>
            </div>

            {/* CTA - Appears on Hover */}
            <motion.div
              initial={{ opacity: 1, x: -10 }}
              whileInView={{ opacity: 1, x: -10 }}
              whileHover={{ opacity: 1, x: 0.5 }}
              className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider">
              Explore Collection
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>
        </div>

        {/* Border on Hover */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-600 transition-colors duration-300 pointer-events-none rounded-2xl" />
      </motion.div>
    </Link>
  );
};
const categories = [
  {
    id: "traditional-clothing",
    name: "Traditional Clothing",
    tagline: "Wear Your Heritage",
    description:
      "Handcrafted sarees, daura suruwal, and ethnic wear from master sellers",
    icon: "🥻",
    themeColor: "#D4145A",
    gradient: "linear-gradient(135deg, #D4145A 0%, #FBB03B 100%)",
    imagePath: "/Home-Images/categories/clothing/thumbnail.jpg",
    route: "/marketplace/traditional",
    stats: [
      { label: "Seller Partners", value: "500+" },
      { label: "Traditional Styles", value: "50+" },
      { label: "Handcrafted", value: "100%" },
    ],
  },
  {
    id: "arts-decor",
    name: "Arts & Decor",
    tagline: "Artistry for Your Space",
    description:
      "Thangka paintings, wood carvings, and pottery from heritage craftsmen",
    icon: "🎨",
    themeColor: "#C17817",
    gradient: "linear-gradient(135deg, #C17817 0%, #8B4513 100%)",
    imagePath: "/Home-Images/categories/arts/thumbnail.png",
    route: "/marketplace/arts_decors",
    stats: [
      { label: "Art Forms", value: "30+" },
      { label: "Master Artists", value: "200+" },
      { label: "Authentic", value: "100%" },
    ],
  },
  {
    id: "musical-instruments",
    name: "Musical Instruments",
    tagline: "Sound of Tradition",
    description:
      "Classical madal, sarangi, and flute handcrafted by experienced makers",
    icon: "🎵",
    themeColor: "#8B4513",
    gradient: "linear-gradient(135deg, #8B4513 0%, #654321 100%)",
    imagePath: "/Home-Images/categories/instruments/thumbnail.jpg",
    route: "/marketplace/instruments",
    stats: [
      { label: "Instruments", value: "40+" },
      { label: "Craftsmen", value: "100+" },
      { label: "Quality", value: "Premium" },
    ],
  },
];

const CategorySection = () => {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(API.GET_HOME_STATS);
        const result = await response.json();
        if (result.status === "success") {
          setCounts(result.data.category_counts || {});
        }
      } catch (error) {
        console.error("Error fetching category counts:", error);
      }
    };
    fetchCounts();
  }, []);

  const getMappedCategories = () => {
    return categories.map((cat) => {
      let dbCategory = "";
      if (cat.id === "traditional-clothing") dbCategory = "cultural-clothes";
      else if (cat.id === "arts-decor") dbCategory = "handicraft-decors";
      else if (cat.id === "musical-instruments")
        dbCategory = "musical-instruments";

      return {
        ...cat,
        itemCount: counts[dbCategory] || 0,
      };
    });
  };

  const dynamicCategories = getMappedCategories();

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16">
          <span className="inline-block text-sm font-bold tracking-wider uppercase text-red-600 mb-3">
            Curated Collections
          </span>

          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            Explore by <span className="text-red-600">Category</span>
          </h2>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Dive deep into specific areas of cultural heritage, from hand-woven
            textiles to classical instruments.
          </p>

          {/* Decorative Line */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "100px", opacity: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="h-1 bg-red-600 mx-auto mt-8 rounded-full"
          />
        </motion.div>

        {/* Category Grid */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dynamicCategories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategorySection;
