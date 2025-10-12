import React, { useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

const GenderDropdown = ({ gender, isOpen, onToggle, onSelect, options }) => {
  const genderRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (genderRef.current && !genderRef.current.contains(e.target)) {
        onToggle(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onToggle]);

  return (
    <div className="flex-1 relative" ref={genderRef}>
      <div
        className="flex justify-between items-center bg-white rounded-xl p-4 sm:p-5 shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all duration-200"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(!isOpen);
        }}
      >
        <div className="flex-1">
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">
            Gender
          </p>
          <p className="font-medium text-base text-gray-800">
            {gender || "Select Gender"}
          </p>
        </div>
        <ChevronDown
          size={20}
          className={`text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute mt-2 w-full sm:w-auto bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((option, index) => (
            <div
              key={option}
              className={`px-3 py-2 sm:py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 flex items-center justify-between ${
                index !== options.length - 1 ? "border-b border-gray-50" : ""
              } ${gender === option ? "bg-blue-50" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(option);
              }}
            >
              <span
                className={`text-sm ${
                  gender === option ? "font-semibold text-blue-600" : "text-gray-700"
                }`}
              >
                {option}
              </span>
              {gender === option && <Check size={14} className="text-blue-600" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenderDropdown;