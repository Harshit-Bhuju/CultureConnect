import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  Bell,
  X,
  Menu,
  Mic,
  MessageCircle,
} from "lucide-react";
import { SidebarTrigger, useSidebar } from "../../components/ui/sidebar";
import { useAuth } from "../../context/AuthContext";
import CultureConnectLogo from "../../assets/logo/cultureconnect__fav.png";
import { useNavigate } from "react-router-dom";
import default_logo from "../../assets/default-image.jpg";
import Message from "../../Message/Message";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearch, setIsMobileSearch] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const searchInputRef = useRef(null);
  const voiceModalRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);

  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";

  const suggestions = [
    "Traditional crafts",
    "Nepali food",
    "Cultural events",
    "Art exhibitions",
    "Music festivals",
    "Handmade products",
    "Local artisans",
  ].filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));

  // Focus search input when search is open
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search/voice on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (isSearchOpen) setIsSearchOpen(false);
        if (isVoiceOpen) stopVoiceSearch();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSearchOpen, isVoiceOpen]);

  // Handle mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobileSearch(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close voice modal on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (voiceModalRef.current && !voiceModalRef.current.contains(e.target)) {
        stopVoiceSearch();
      }
    };
    if (isVoiceOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isVoiceOpen]);

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) setSearchQuery("");
  };

  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      setSearchQuery(transcript);

      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      // 3-second silence timer
      silenceTimerRef.current = setTimeout(() => {
        stopVoiceSearch();
        if (transcript.trim()) {
          console.log("Searching for:", transcript);
          // Add your search logic here
        }
      }, 3000);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsVoiceOpen(true);
  };

  const stopVoiceSearch = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsVoiceOpen(false);
    setIsListening(false);
  };

  return (
    <header className="w-full bg-white sticky top-0 z-50 border-b">
      <div className="max-w-full px-2 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Sidebar trigger + logo */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="flex items-center lg:hidden md:gap-2 sm:gap-1">
              <SidebarTrigger className="lg:hidden text-2xl">
                <Menu />
              </SidebarTrigger>
              <img
                src={CultureConnectLogo}
                alt="CultureConnect Logo"
                className="w-4 h-4 md:w-6 md:h-6 object-contain block"
              />
              <span className="text-sm md:text-[18px] font-bold text-gray-800 block">
                CultureConnect
              </span>
            </div>

            {!isSearchOpen && isCollapsed && (
              <div className="hidden lg:flex items-center gap-2">
                <img
                  src={CultureConnectLogo}
                  alt="CultureConnect Logo"
                  className="w-8 h-8 object-contain"
                />
                <span className="text-xl font-bold text-gray-800 md:block">
                  CultureConnect
                </span>
              </div>
            )}
          </div>

          {/* Right: Search / Cart / Notifications / Avatar */}
          <div className="flex items-center gap-1 md:gap-3 flex-1 justify-end">
            {/* Desktop search bar */}
            <div className="hidden lg:flex flex-1 max-w-xl relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-4 pr-20 py-2 border border-gray-300 rounded-full
                           focus:outline-none focus:border-blue-500 transition-colors
                           text-sm md:text-base"
              />
              <button
                onClick={startVoiceSearch}
                className="absolute right-12 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100">
                <Mic className="w-5 h-5 text-gray-500" />
              </button>
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100">
                <Search className="w-5 h-5 text-gray-500" />
              </button>

              {searchQuery && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setSearchQuery(s)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3">
                      <Search className="w-5 h-5 text-gray-400" />
                      <span>{s}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile search icon */}
            {isMobileSearch && !isSearchOpen && (
              <button
                onClick={handleSearchToggle}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Search className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            )}

            {/* Cart */}
            {!isSearchOpen && (
              <button
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => navigate("/cart")}>
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            )}
            {/* Message */}
            {!isSearchOpen && (
              <button
                onClick={() => {
                  window.open(
                    "https://peaky-willa-glucinic.ngrok-free.dev",
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            )}

            {/* Notifications */}
            {/* {!isSearchOpen && (
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-5 h-5 md:w-6 md:h-6" />
                <span className="absolute top-2 right-0 bg-red-500 w-2 h-2 rounded-full"></span>
              </button>
            )} */}

            {/* User Avatar */}
            {!isSearchOpen && (
              <button className="flex-shrink-0">
                <img
                  src={user?.avatar || default_logo}
                  alt={user?.name || "User"}
                  className="w-7 h-7 md:w-10 md:h-10 rounded-full border-2 border-gray-200 hover:border-blue-500 transition-colors"
                />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && isMobileSearch && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col p-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={handleSearchToggle}
              className="p-3 hover:bg-gray-100 rounded-full transition-colors">
              <X size={28} />
            </button>
            <div className="flex-1 relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 transition-colors text-base"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
              <button
                onClick={startVoiceSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100">
                <Mic className="w-6 h-6 text-gray-500" />
              </button>
            </div>
          </div>

          {searchQuery && suggestions.length > 0 && (
            <div className="flex-1 overflow-y-auto border-t border-gray-200">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setIsSearchOpen(false);
                  }}
                  className="w-full px-4 py-4 text-left hover:bg-gray-100 flex items-center gap-3 border-b border-gray-100 last:border-b-0 transition-colors">
                  <Search className="text-gray-400 w-5 h-5" />
                  <span className="text-base">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Voice Search Modal */}
      {isVoiceOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-2">
          <div
            ref={voiceModalRef}
            className="bg-white rounded-xl shadow-xl w-full max-w-sm p-4 overflow-hidden">
            <div className="bg-blue-500 p-4 text-white text-center rounded-t-xl">
              <h2 className="text-lg font-semibold">
                {isListening ? "Listening..." : "Initializing..."}
              </h2>
              <p className="text-xs mt-1 opacity-90">
                {isListening ? "Speak now" : "Starting microphone..."}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center py-6">
              <div className="flex items-end justify-center gap-1 h-12 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 bg-blue-500 rounded-full transition-all duration-300 ${
                      isListening ? "animate-wave" : "h-2"
                    }`}
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      height: isListening ? undefined : "8px",
                    }}
                  />
                ))}
              </div>
              <div className="w-full min-h-[50px] bg-gray-50 rounded-lg p-3 mb-3 text-center">
                {searchQuery || "Your speech will appear here..."}
              </div>
            </div>
          </div>

          <style>{`
            @keyframes wave {
              0%, 100% { height: 8px; }
              50% { height: 64px; }
            }
            .animate-wave { animation: wave 0.8s ease-in-out infinite; }
          `}</style>
        </div>
      )}
      {/* Message Sidebar */}
      <Message isOpen={isMessageOpen} onClose={() => setIsMessageOpen(false)} />
    </header>
  );
};

export default Navbar;
