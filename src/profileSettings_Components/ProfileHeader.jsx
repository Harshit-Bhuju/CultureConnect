import React from "react";
import { Camera } from "lucide-react";

const ProfileHeader = ({ avatar, onAvatarClick, onViewProfile, fileInputRef, onAvatarChange }) => {
  return (
    <div className="relative flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm mb-6">
      <div className="relative">
        <img
          src={avatar}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover shadow-md cursor-pointer hover:opacity-90 transition-opacity"
          onClick={onViewProfile}
        />
        <button
          onClick={onAvatarClick}
          className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition z-10"
        >
          <Camera size={16} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={onAvatarChange}
        />
      </div>
      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Personal Information
        </h2>
        <p className="text-gray-500 text-sm mt-1">Update your personal details</p>
      </div>
    </div>
  );
};

export default ProfileHeader;