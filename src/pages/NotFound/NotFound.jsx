import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Compass, Home, Map, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showGoBack, setShowGoBack] = useState(false);

  useEffect(() => {
    // Check if there's navigation history and it's not a fallback
    const hasHistory = window.history.length > 1;

    // Get the current path's main route (first segment)
    const currentMainRoute = location.pathname.split("/")[1];

    // Check if the previous page exists and isn't the same main route
    const checkPreviousRoute = () => {
      // Access navigation entries if available (Chrome, Edge)
      if (window.performance && window.performance.getEntriesByType) {
        const navEntries = window.performance.getEntriesByType("navigation");
        if (navEntries.length > 0) {
          const referer = document.referrer;
          if (referer) {
            try {
              const refererUrl = new URL(referer);
              const previousMainRoute = refererUrl.pathname.split("/")[1];

              // Show button if has history and previous route is different
              setShowGoBack(
                hasHistory &&
                  previousMainRoute !== currentMainRoute &&
                  previousMainRoute !== "404",
              );
              return;
            } catch (e) {
              // Invalid URL, continue to default behavior
            }
          }
        }
      }

      // Fallback: show if has history (assuming it's valid)
      setShowGoBack(hasHistory);
    };

    checkPreviousRoute();
  }, [location]);

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-cream/30"
      style={{
        background:
          "radial-gradient(circle at center, #F8F1E7 0%, #F3E5D5 100%)",
      }}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute rounded-full blur-[100px] opacity-20 w-[500px] h-[500px] -top-20 -left-20"
          style={{ backgroundColor: "#D4145A" }}
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute rounded-full blur-[100px] opacity-20 w-[600px] h-[600px] -bottom-40 -right-20"
          style={{ backgroundColor: "#C17817" }}
        />
      </div>

      <main className="relative z-10 flex flex-col items-center max-w-2xl px-6 text-center">
        {/* 404 Error Code with Floating Icons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-4">
          {/* Floating Icons */}
          <div className="absolute -top-12 -left-8 w-full flex justify-between pointer-events-none">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
              <Compass
                size={40}
                className="opacity-60"
                style={{ color: "#D4145A" }}
              />
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}>
              <Map
                size={32}
                className="opacity-50"
                style={{ color: "#C17817" }}
              />
            </motion.div>
          </div>

          {/* 404 Text */}
          <h1
            className="text-[8rem] md:text-[12rem] lg:text-[16rem] leading-none font-bold select-none"
            style={{
              color: "rgba(51, 51, 51, 0.05)",
              textShadow:
                "2px 2px 0px rgba(212, 20, 90, 0.1), -2px -2px 0px rgba(193, 120, 23, 0.1)",
            }}>
            404
          </h1>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "#333333" }}>
            Lost in Tradition?
          </h2>
          <p
            className="text-lg mb-10 max-w-md mx-auto leading-relaxed"
            style={{ color: "rgba(51, 51, 51, 0.7)" }}>
            This piece of culture seems to be missing from our collection. Even
            the most seasoned explorers lose their way sometimes.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4">
          {/* Go Back Button - Conditional */}
          {showGoBack && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-full font-semibold transition-all duration-300 bg-white/80 border backdrop-blur-sm hover:bg-white hover:shadow-md hover:scale-105 active:scale-95"
              style={{
                color: "#333333",
                borderColor: "rgba(51, 51, 51, 0.1)",
              }}>
              <ArrowLeft size={18} />
              Go Back
            </button>
          )}

          {/* Return Home Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "#D4145A",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(212, 20, 90, 0.9)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#D4145A")
            }>
            <Home size={18} />
            Return Home
          </button>
        </motion.div>
      </main>

      {/* Cultural Patterns (SVG Overlay) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4145A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}></div>
    </div>
  );
};

export default NotFound;
