import React from "react";
import { X } from "lucide-react";

const ProfilePicModal = ({ isOpen, avatar, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-[1100] bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-full"
        onClick={onClose}
      >
        <X size={32} />
      </button>
      
      <div className="relative animate-in zoom-in-95 duration-300">
        <img
          src={avatar}
          alt="Profile"
          className="w-72 h-72 sm:w-96 sm:h-96 rounded-full object-cover shadow-2xl ring-4 ring-white/20"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

export default ProfilePicModal;