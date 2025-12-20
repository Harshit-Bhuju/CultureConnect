import React from "react";
import { X } from "lucide-react";

const SuggestionsModal = ({ isOpen, suggestions, onSelect, onRefresh, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1050]">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-md mx-4 pointer-events-auto animate-in zoom-in-95 fade-in duration-200 relative">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">
            Username Suggestions
          </h3>
          <button
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-all duration-200"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>



        {/* Three suggestions */}
        <div className="space-y-3 mb-6">
          {suggestions.map((name) => (
            <div
              key={name}
              className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl text-center cursor-pointer hover:from-blue-100 hover:to-indigo-100 hover:shadow-md transition-all duration-200 border border-blue-100"
              onClick={() => onSelect(name)}
            >
              <span className="font-medium text-gray-800">{name}</span>
            </div>
          ))}
        </div>
        {/* Refresh button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            Refresh Suggestions
          </button>
        </div>
        {/* Type your own username */}
        <div className="pt-4 border-t border-gray-200">
          <button
            className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
            onClick={onClose}
          >
            Type your own username
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuggestionsModal;
