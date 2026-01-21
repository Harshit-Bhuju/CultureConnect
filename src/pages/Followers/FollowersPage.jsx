import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Users } from "lucide-react";
import API, { BASE_URL } from "../../Configs/ApiEndpoints";
import default_logo from "../../assets/default-image.jpg";

const FollowersPage = () => {
  const { sellerId, teacherId } = useParams();
  const navigate = useNavigate();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const getAvatarUrl = (filename) => {
    if (!filename || filename === "null" || filename === "undefined")
      return default_logo;
    if (
      filename.startsWith("http") ||
      filename.startsWith("blob:") ||
      filename.startsWith("data:")
    ) {
      return filename;
    }
    return `${BASE_URL}/uploads/profile_pics/${filename}`;
  };

  // Determine if this is a seller or teacher followers page
  const isSeller = !!sellerId;
  const id = sellerId || teacherId;

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setLoading(true);
        console.log("🔍 FollowersPage Params:", {
          sellerId,
          teacherId,
          isSeller,
          id,
        });

        const endpoint = isSeller
          ? `${API.GET_SELLER_FOLLOWERS}?seller_id=${id}`
          : `${API.GET_TEACHER_FOLLOWERS}?teacher_id=${id}`;

        console.log("🚀 Fetching from endpoint:", endpoint);

        const response = await fetch(endpoint, {
          credentials: "include",
        });

        console.log("📡 Response Status:", response.status);

        const data = await response.json();
        console.log("✅ API Response:", data);

        if (data.status === "success" || data.success) {
          setFollowers(data.followers || []);
          setProfileName(data.name || (isSeller ? "Seller" : "Teacher"));
          setProfileImage(data.profile_pic);
        } else {
          console.error("❌ API returned error:", data);
        }
      } catch (error) {
        console.error("❌ Error fetching followers:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFollowers();
    }
  }, [id, isSeller]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900">Followers</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Stats Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
            <p className="text-sm text-gray-600">
              <span className="font-bold text-gray-900">
                {followers.length}
              </span>{" "}
              {followers.length === 1 ? "follower" : "followers"}
            </p>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <div className="w-10 h-10 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Loading followers...</p>
            </div>
          ) : followers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <User size={40} className="text-gray-400" />
              </div>
              <p className="text-gray-900 font-semibold text-lg mb-1">
                No followers yet
              </p>
              <p className="text-sm text-gray-500 max-w-xs">
                When people follow this {isSeller ? "seller" : "teacher"},
                they'll appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {followers.map((follower) => (
                <div
                  key={follower.user_id}
                  className="flex items-center px-4 py-4 hover:bg-gray-50 transition-colors gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <img
                      src={getAvatarUrl(follower.profile_pic)}
                      alt={follower.username}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                      onError={(e) => {
                        e.target.src = default_logo;
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {follower.username}
                    </p>
                    <p className="text-xs text-gray-500">Follower</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FollowersPage;
