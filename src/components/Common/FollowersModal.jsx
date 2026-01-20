import React from "react";
import { X, User } from "lucide-react";

const FollowersModal = ({ isOpen, onClose, title, followers, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white w-full max-w-sm mx-4 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 mx-auto">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors absolute right-4"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 p-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-3">
                            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
                        </div>
                    ) : followers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                <User size={32} className="text-gray-300" />
                            </div>
                            <p className="text-gray-900 font-medium">No followers yet</p>
                            <p className="text-sm text-gray-500 mt-1">
                                When people follow, they'll appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {followers.map((follower) => (
                                <div
                                    key={follower.user_id}
                                    className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors gap-3"
                                >
                                    {/* Avatar */}
                                    <div className="flex-shrink-0">
                                        {follower.profile_pic ? (
                                            <img
                                                src={`http://localhost/CultureConnect/backend/uploads/profile_pics/${follower.profile_pic}`}
                                                alt={follower.username}
                                                className="w-11 h-11 rounded-full object-cover border border-gray-100"
                                                onError={(e) => {
                                                    e.target.src = "https://ui-avatars.com/api/?name=" + follower.username + "&background=random";
                                                }}
                                            />
                                        ) : (
                                            <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold border border-gray-100">
                                                {follower.username?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {follower.username}
                                        </p>
                                        {/* Optional: Show full name if available, or 'Followed you' text */}
                                        {/* <p className="text-xs text-gray-500 truncate">
                      User
                    </p> */}
                                    </div>

                                    {/* Action Button (Optional - strictly view only for now as requested) */}
                                    {/* <button className="px-4 py-1.5 bg-gray-100 text-gray-900 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                    Remove
                  </button> */}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowersModal;
