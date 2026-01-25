import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Users, Award, Heart, Globe } from "lucide-react";
import API from "../../Configs/ApiEndpoints";
const CulturalStorySection = () => {
  const [statsData, setStatsData] = useState({
    total_artisans: 0,
    total_courses: 0,
    total_users: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(API.GET_HOME_STATS);
        const result = await response.json();
        if (result.status === "success") {
          setStatsData({
            total_artisans:
              result.data.total_sellers + result.data.total_teachers,
            total_courses: result.data.total_courses,
            total_users: result.data.total_users,
          });
        }
      } catch (error) {
        console.error("Error fetching cultural stats:", error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      icon: Users,
      value:
        statsData.total_artisans >= 1000
          ? `${(statsData.total_artisans / 1000).toFixed(1)}k+`
          : `${statsData.total_artisans}+`,
      label: "Artisans Supported",
    },
    {
      icon: Award,
      value: "100%",
      label: "Authentic Handcrafted",
    },
    {
      icon: Heart,
      value: `${statsData.total_courses}+`,
      label: "Courses Available",
    },
    {
      icon: Globe,
      value:
        statsData.total_users >= 1000
          ? `${(statsData.total_users / 1000).toFixed(1)}k+`
          : `${statsData.total_users}+`,
      label: "Community Reach",
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              type: "spring",
              bounce: 0.3,
            }}
            viewport={{ once: false, margin: "-100px" }}
            className="space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block">
              <span className="text-sm font-bold tracking-wider uppercase text-red-600 border-l-4 border-red-600 pl-4">
                Our Mission
              </span>
            </motion.div>

            {/* Title */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-2">
                Preserving Heritage,
              </h2>
              <h2 className="text-4xl md:text-5xl font-bold text-red-600 leading-tight">
                Empowering Artisans
              </h2>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-700 leading-relaxed">
              Culture Connect is more than a marketplace; it's a movement to
              revitalize fading traditions. We bridge the gap between rural
              master craftsmen and global connoisseurs, ensuring that every
              purchase directly supports the artist and the continuation of
              their legacy.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 pt-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.3 + index * 0.1,
                      type: "spring",
                      stiffness: 150,
                      damping: 12,
                    }}
                    viewport={{ once: false, amount: 0.2 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group relative bg-gray-50 border border-gray-200 p-6 hover:border-red-600 transition-all duration-300 rounded-2xl">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600 text-white mb-4 group-hover:scale-110 group-hover:rotate-[360deg] transition-all duration-500 rounded-full">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h4 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors duration-300">
                      {stat.value}
                    </h4>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Side - Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: 100, rotate: 5 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{
              duration: 0.8,
              type: "spring",
              bounce: 0.3,
            }}
            viewport={{ once: false, margin: "-100px" }}
            className="relative">
            <div className="relative">
              {/* Large Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: false }}
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden border-4 border-white shadow-2xl rounded-2xl">
                <img
                  src="/Home-Images/about/artisan-story.jpg"
                  alt="Artisan at work"
                  className="w-full h-[500px] object-cover"
                />
                {/* Red Accent Overlay - Added rounding */}
                <div className="absolute inset-0 border-4 border-red-600 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />

                {/* Info Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-6 left-6 bg-white px-6 py-3 shadow-xl z-20 rounded-xl">
                  <p className="text-sm font-bold text-gray-900">
                    Master Craftsperson
                  </p>
                  <p className="text-xs text-gray-600">Since 1985</p>
                </motion.div>
              </motion.div>

              {/* Small Floating Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                viewport={{ once: false }}
                whileHover={{ scale: 1.05 }}
                className="absolute -bottom-8 -right-8 w-56 h-56 overflow-hidden border-8 border-white shadow-2xl rounded-2xl">
                <img
                  src="/Home-Images/about/workshop.png"
                  alt="Traditional Art"
                  className="w-full h-full object-cover"
                />
                {/* Red Corner Accent */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-red-600" />
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute -top-4 -left-4 w-24 h-24 border-2 border-red-600 rounded-xl"
              />

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-gray-300 rounded-xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CulturalStorySection;
