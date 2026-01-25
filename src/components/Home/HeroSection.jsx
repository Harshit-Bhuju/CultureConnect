import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import API from "../../Configs/ApiEndpoints";

const heroSlides = [
  {
    image: "/Home-Images/Hero_images/home-hero.png",
    title: "Discover Your Cultural Heritage",
    subtitle:
      "Connect with authentic traditions through our curated marketplace.",
    accent: "#D4AF37",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    redirect: "/marketplace",
  },
  {
    image: "/Home-Images/Hero_images/clothing-hero.png",
    title: "Wear Your Tradition With Pride",
    subtitle: "Handcrafted ethnic wear that tells a story of generations.",
    accent: "#DC2626",
    gradient: "from-red-500/20 via-rose-500/10 to-transparent",
    redirect: "/marketplace/traditional",
  },
  {
    image: "/Home-Images/Hero_images/arts-hero.png",
    title: "Masterpieces of Craftsmanship",
    subtitle: "Adorn your space with timeless art from master sellers.",
    accent: "#3B82F6",
    gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
    redirect: "/marketplace/arts_decor",
  },
  {
    image: "/Home-Images/Hero_images/instruments-hero.png",
    title: "The Rhythm of Culture",
    subtitle: "Authentic musical instruments handcrafted for perfect sound.",
    accent: "#F59E0B",
    gradient: "from-amber-600/20 via-yellow-500/10 to-transparent",
    redirect: "/learnculture",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set([0]));
  const [stats, setStats] = useState({
    total_sellers: 0,
    total_products: 0,
    total_teachers: 0,
    total_courses: 0,
  });

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(API.GET_HOME_STATS);
        const result = await response.json();
        if (result.status === "success") {
          setStats(result.data);
        }
      } catch (error) {
        console.error("Error fetching home stats:", error);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const nextSlide = (currentSlide + 1) % heroSlides.length;
    if (!loadedImages.has(nextSlide)) {
      const img = new Image();
      img.src = heroSlides[nextSlide].image;
      img.onload = () => {
        setLoadedImages((prev) => new Set([...prev, nextSlide]));
      };
    }
  }, [currentSlide, loadedImages]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const titleWords = heroSlides[currentSlide].title.split(" ");
  const firstPart = titleWords
    .slice(0, Math.ceil(titleWords.length / 2))
    .join(" ");
  const secondPart = titleWords
    .slice(Math.ceil(titleWords.length / 2))
    .join(" ");

  return (
    <div
      ref={ref}
      className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background with Parallax */}
      <motion.div style={{ scale }} className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${heroSlides[currentSlide].gradient} z-10`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20 z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,black_100%)] z-10" />

            <img
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
              style={{
                filter: loadedImages.has(currentSlide) ? "none" : "blur(10px)",
                transition: "filter 0.3s ease-in-out",
              }}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 z-10 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Main Content Container */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 h-full flex items-center px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Text Content */}
              <div className="space-y-6 lg:space-y-8">
                {/* Decorative Element */}
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "80px", opacity: 1 }}
                  transition={{ delay: 0.3, duration: 1 }}
                  className="flex items-center gap-3">
                  <div
                    className="h-[1.5px] w-full"
                    style={{ backgroundColor: heroSlides[currentSlide].accent }}
                  />
                  <Sparkles
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: heroSlides[currentSlide].accent }}
                  />
                </motion.div>

                {/* Eyebrow Text */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.4, duration: 0.8 }}>
                  <span
                    className="text-xs md:text-sm font-light tracking-[0.25em] uppercase"
                    style={{ color: heroSlides[currentSlide].accent }}>
                    Heritage • Culture • Tradition
                  </span>
                </motion.div>

                {/* Main Title - Optimized Sizes */}
                <div className="space-y-1 overflow-hidden">
                  <motion.h1
                    key={`title1-${currentSlide}`}
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 20,
                      delay: 0.2,
                    }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-tight leading-[1.1]">
                    {firstPart}
                  </motion.h1>
                  <motion.h1
                    key={`title2-${currentSlide}`}
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 20,
                      delay: 0.4,
                    }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
                    style={{
                      color: heroSlides[currentSlide].accent,
                      textShadow: `0 0 30px ${heroSlides[currentSlide].accent}30`,
                    }}>
                    {secondPart}
                  </motion.h1>
                </div>

                {/* Subtitle */}
                <motion.p
                  key={`subtitle-${currentSlide}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="text-base md:text-lg text-gray-300 font-light leading-relaxed max-w-lg">
                  {heroSlides[currentSlide].subtitle}
                </motion.p>

                {/* CTA Button */}
                <motion.div
                  key={`cta-${currentSlide}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.8,
                  }}
                  className="pt-2">
                  <Link to={heroSlides[currentSlide].redirect}>
                    <motion.button
                      whileHover={{ scale: 1.05, x: 3 }}
                      whileTap={{ scale: 0.95 }}
                      className="group px-7 py-3 text-black font-semibold text-base rounded-full flex items-center gap-2 transition-all duration-300"
                      style={{
                        backgroundColor: heroSlides[currentSlide].accent,
                        boxShadow: `0 8px 30px ${heroSlides[currentSlide].accent}30`,
                      }}>
                      Explore Collection
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                </motion.div>
              </div>

              {/* Right Side - Compact Stats */}
              <div className="hidden lg:flex flex-col gap-5 items-end justify-center">
                <motion.div
                  initial={{ opacity: 0, rotateY: 90, x: 50 }}
                  whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-xl w-full max-w-xs [perspective:1000px]">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span
                      className="text-5xl font-bold"
                      style={{ color: heroSlides[currentSlide].accent }}>
                      {stats.total_sellers >= 1000
                        ? `${(stats.total_sellers / 1000).toFixed(1)}k+`
                        : `${stats.total_sellers}+`}
                    </span>
                    <span className="text-gray-400 text-xs uppercase tracking-wider">
                      Sellers
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Master craftspeople preserving centuries of tradition
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, rotateY: -90, x: 50 }}
                  whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-xl w-full max-w-[280px] [perspective:1000px]">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span
                      className="text-5xl font-bold"
                      style={{ color: heroSlides[currentSlide].accent }}>
                      {stats.total_products >= 1000
                        ? `${(stats.total_products / 1000).toFixed(1)}k+`
                        : `${stats.total_products}+`}
                    </span>
                    <span className="text-gray-400 text-xs uppercase tracking-wider">
                      Products
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Curated authentic pieces from cultures worldwide
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Slide Indicators - Refined Design */}
      <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {heroSlides.map((slide, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="group relative">
            <div
              className={`h-0.5 rounded-full transition-all duration-500 ${
                index === currentSlide ? "w-12" : "w-6"
              }`}
              style={{
                backgroundColor:
                  index === currentSlide
                    ? heroSlides[currentSlide].accent
                    : "rgba(255,255,255,0.25)",
              }}
            />
            {index === currentSlide && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute inset-0 rounded-full blur-sm"
                style={{
                  backgroundColor: heroSlides[currentSlide].accent,
                  opacity: 0.4,
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 sm:bottom-10 right-8 sm:right-12 z-30 hidden md:flex flex-col items-center gap-2">
        <span className="text-[10px] text-gray-500 uppercase tracking-widest rotate-90 origin-center">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/40 to-transparent"
        />
      </motion.div>
    </div>
  );
};

export default HeroSection;
