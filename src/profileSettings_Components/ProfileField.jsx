import React from "react";
import { ChevronRight } from "lucide-react";

const ProfileField = ({ label, value, onClick, isEditable = true }) => {
  return (
    <div
      className={`flex justify-between items-center bg-white rounded-xl p-4 sm:p-5 shadow-sm ${
        isEditable ? "cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all duration-200" : ""
      }`}
      onClick={isEditable ? onClick : undefined}
    >
      <div className="flex-1">
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="text-gray-800 font-medium text-base">{value}</p>
      </div>
      <ChevronRight size={20} className="text-gray-400" />
    </div>
  );
};

export default ProfileField;