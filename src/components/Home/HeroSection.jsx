import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

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
    subtitle: "Adorn your space with timeless art from master artisans.",
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

const HeroSection = ({ containerRef }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set([0])); // Preload first image
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // Preload next image when slide changes
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
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] z-10" />

            {/* Optimized Image Loading */}
            <img
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              className="w-full h-full object-cover"
              loading="eager" // Load hero images immediately
              decoding="async" // Async decoding for better performance
              fetchPriority="high" // Prioritize hero images
              style={{
                // Add a blur effect while loading for better UX
                filter: loadedImages.has(currentSlide) ? "none" : "blur(10px)",
                transition: "filter 0.3s ease-in-out",
              }}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Animated Grid Overlay */}
      <div className="absolute inset-0 z-10 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      {/* Main Content Container */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 h-full flex items-center justify-center px-6 md:px-12">
        <div className="max-w-7xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Side - Text Content */}
              <div className="lg:col-span-7 space-y-8">
                {/* Decorative Element */}
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "120px", opacity: 1 }}
                  transition={{ delay: 0.3, duration: 1 }}
                  className="flex items-center gap-4">
                  <div
                    className="h-[2px] w-full"
                    style={{ backgroundColor: heroSlides[currentSlide].accent }}
                  />
                  <Sparkles
                    className="w-5 h-5"
                    style={{ color: heroSlides[currentSlide].accent }}
                  />
                </motion.div>

                {/* Eyebrow Text */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}>
                  <span
                    className="text-sm md:text-base font-light tracking-[0.3em] uppercase"
                    style={{ color: heroSlides[currentSlide].accent }}>
                    Heritage • Culture • Tradition
                  </span>
                </motion.div>

                {/* Main Title - Staggered Animation */}
                <div className="space-y-2">
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-extralight text-white tracking-tight leading-[0.95]">
                    {firstPart}
                  </motion.h1>
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65, duration: 0.8 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]"
                    style={{
                      color: heroSlides[currentSlide].accent,
                      textShadow: `0 0 40px ${heroSlides[currentSlide].accent}40`,
                    }}>
                    {secondPart}
                  </motion.h1>
                </div>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-xl">
                  {heroSlides[currentSlide].subtitle}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="flex flex-wrap gap-4 pt-4">
                  <Link to={heroSlides[currentSlide].redirect}>
                    <motion.button
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="group px-8 py-4 text-black font-semibold text-base rounded-none flex items-center gap-3 transition-all duration-300"
                      style={{
                        backgroundColor: heroSlides[currentSlide].accent,
                        boxShadow: `0 10px 40px ${heroSlides[currentSlide].accent}40`,
                      }}>
                      Explore Collection
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                  <Link to={heroSlides[currentSlide].redirect}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 border-2 text-white font-semibold text-base backdrop-blur-md hover:bg-white/10 transition-all duration-300"
                      style={{ borderColor: heroSlides[currentSlide].accent }}>
                      Learn More
                    </motion.button>
                  </Link>
                </motion.div>
              </div>

              {/* Right Side - Decorative Stats/Info */}
              <div className="lg:col-span-5 hidden lg:flex flex-col gap-6 items-end">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-sm max-w-sm">
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-6xl font-bold"
                        style={{ color: heroSlides[currentSlide].accent }}>
                        500+
                      </span>
                      <span className="text-gray-400 text-sm">Artisans</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Master craftspeople preserving centuries of tradition
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4, duration: 0.8 }}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-sm max-w-xs">
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-6xl font-bold"
                        style={{ color: heroSlides[currentSlide].accent }}>
                        15k+
                      </span>
                      <span className="text-gray-400 text-sm">Products</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Curated authentic pieces from across cultures
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Slide Indicators - Bottom Center */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {heroSlides.map((slide, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="group relative">
            <div
              className={`h-1 transition-all duration-500 ${
                index === currentSlide ? "w-16" : "w-8"
              }`}
              style={{
                backgroundColor:
                  index === currentSlide
                    ? heroSlides[currentSlide].accent
                    : "rgba(255,255,255,0.3)",
              }}
            />
            {index === currentSlide && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute inset-0 rounded-full"
                style={{
                  boxShadow: `0 0 20px ${heroSlides[currentSlide].accent}`,
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Scroll Indicator - Bottom Right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 right-12 z-30 hidden md:flex flex-col items-center gap-3">
        <span className="text-xs text-gray-500 uppercase tracking-widest writing-mode-vertical">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/50 to-transparent"
        />
      </motion.div>
    </div>
  );
};

export default HeroSection;
