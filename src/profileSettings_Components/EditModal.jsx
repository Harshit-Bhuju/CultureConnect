import React, { useRef, useEffect } from "react";
import { X } from "lucide-react";

const EditModal = ({
  isOpen,
  field,
  value,
  onChange,
  onSave,
  onCancel,
  error,
  takenError,
  isSaveDisabled,
  onOpenSuggestions,
  children
}) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onCancel();
      }
    };
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000]">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div
        ref={popupRef}
        className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-md mx-4 pointer-events-auto animate-in zoom-in-95 fade-in duration-200 relative"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">
            Edit {field?.charAt(0).toUpperCase() + field?.slice(1)}
          </h3>
          <button
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-all duration-200"
            onClick={onCancel}
          >
            <X size={22} />
          </button>
        </div>

        <div className="mb-6">
          <div className="w-full mb-4">
            <p className="text-sm text-gray-500">
              {field === "username"
                ? ""
                : "Select your location from Province to Ward."}
            </p>
          </div>

          {field === "username" && onOpenSuggestions && (
            <div className="mb-3">
              <p
                className="text-blue-500 text-sm cursor-pointer hover:underline"
                onClick={onOpenSuggestions}
              >
                Generate Suggestions
              </p>
            </div>
          )}

          {children}

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          {takenError && <p className="text-red-500 text-sm mt-1">{takenError}</p>}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isSaveDisabled}
            className={`flex-1 py-3 rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg
              ${isSaveDisabled
                ? "bg-gray-300 text-gray-500"
                : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
              }`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;