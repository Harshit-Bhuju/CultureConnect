import React, { useState, useEffect } from "react";
import Loading from "../components/common/Loading";
import toast from "react-hot-toast";
import API from "../Configs/ApiEndpoints";
import { Check, X, Eye, FileWarning } from "lucide-react";
import { useAuth } from "../context/AuthContext";  // ← Add this import
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageAlt, setSelectedImageAlt] = useState("");
const { logout } = useAuth();                    
  const navigate = useNavigate();
  useEffect(() => {
    fetchPendingTeachers();
  }, []);

  const fetchPendingTeachers = async () => {
    setLoading(true);
    try {
      const response = await fetch(API.GET_PENDING_TEACHERS, {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      console.log("API Response:", result);
      if (result.success) {
        setPendingTeachers(result.pending_teachers || []);
      } else {
        toast.error("Failed to load pending teachers");
      }
    } catch (err) {
      toast.error("Error loading data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherApproval = async (teacherId, action) => {
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append("teacher_id", teacherId);
      formData.append("action", action);

      const response = await fetch(API.APPROVE_TEACHER, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        toast.success(`Teacher ${action}ed successfully`);
        setPendingTeachers(pendingTeachers.filter((t) => t.id !== teacherId));
      } else {
        toast.error(result.message || "Action failed");
      }
    } catch (err) {
      toast.error("Error processing request");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleImageError = (teacherId, certIndex) => {
    setImageErrors(prev => ({
      ...prev,
      [`${teacherId}-${certIndex}`]: true
    }));
  };

  const openImageModal = (url, alt = "Certificate") => {
    setSelectedImage(url);
    setSelectedImageAlt(alt);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
    setSelectedImageAlt("");
  };

  // Placeholder handler for Seller Analytics button
  const handleSellerAnalytics = () => {
    toast.info("Seller Analytics feature coming soon!");
   
  };
const handleLogout = async () => {
    await logout();                            
    toast.success("Logged out successfully");
    navigate("/login");                        
  };
  if (loading) return <Loading message="Loading Admin Dashboard..." />;

  return (
 <div className="bg-gray-50 min-h-screen">
  {/* Header */}
  <div className="mb-6 mx-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div className="px-6 py-4">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      <p className="text-gray-600">Manage teacher approvals and view analytics</p>
    </div>

    <div className="px-6 py-4 flex gap-3">

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
          />
        </svg>
        Logout
      </button>
    </div>
  </div>


      {/* Content */}
      <div className="p-6">
        {/* Section Header with Button */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Pending Teacher Approvals ({pendingTeachers.length})
            </h2>
            <p className="text-gray-600">Review and approve or reject teacher applications</p>
          </div>

      
        </div>

        <div className="space-y-6">
          {pendingTeachers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-24 h-24 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium">No pending teacher applications</p>
              <p className="text-gray-400 text-sm mt-2">
                All teacher applications have been processed
              </p>
            </div>
          ) : (
            pendingTeachers.map((teacher) => (
              <div key={teacher.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                    <div className="flex items-center gap-6">
                      <img
                        src={
                          teacher.profile_photo
                            ? `${API.TEACHER_PROFILE_PICTURES}/${teacher.profile_photo}`
                            : "/default-avatar.png"
                        }
                        alt={teacher.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                        onError={(e) => {
                          console.error("Profile image failed to load:", e.target.src);
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{teacher.name}</h3>
                        <p className="text-gray-600">{teacher.email}</p>
                        <p className="text-gray-500 mt-1">
                          <span className="font-semibold">eSewa:</span> {teacher.esewa_number}
                        </p>
                        <p className="mt-2">
                          <span className="font-semibold">Category:</span>{" "}
                          <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                            {teacher.styles}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleTeacherApproval(teacher.id, "approve")}
                        disabled={actionLoading}
                        className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                      >
                        <Check className="w-5 h-5" /> Approve
                      </button>
                      <button
                        onClick={() => handleTeacherApproval(teacher.id, "reject")}
                        disabled={actionLoading}
                        className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                      >
                        <X className="w-5 h-5" /> Reject
                      </button>
                    </div>
                  </div>

                  {/* Bio */}
                  {teacher.bio && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-700 mb-2">Bio</h4>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        {teacher.bio}
                      </p>
                    </div>
                  )}

                  {/* Certificates */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">
                      Certificates ({teacher.certificates?.length || 0})
                    </h4>
                    {teacher.certificates && teacher.certificates.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {teacher.certificates.map((cert, i) => {
                          const certUrl = `${API.TEACHER_CERTIFICATES}/${cert.url}`;
                          const errorKey = `${teacher.id}-${i}`;
                          const hasError = imageErrors[errorKey];

                          return (
                            <div key={i} className="group relative">
                              {hasError ? (
                                <div className="w-full aspect-square bg-red-50 rounded-lg border-2 border-red-200 flex flex-col items-center justify-center p-4 text-center">
                                  <FileWarning className="w-10 h-10 text-red-400 mb-3" />
                                  <p className="text-sm font-medium text-red-700">Failed to load</p>
                                  <p className="text-xs text-gray-600 mt-1 break-all max-w-full">
                                    {cert.url}
                                  </p>
                                  <a
                                    href={certUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 underline mt-3 hover:text-blue-800"
                                  >
                                    Open directly →
                                  </a>
                                </div>
                              ) : (
                                <div
                                  className="cursor-pointer"
                                  onClick={() => openImageModal(certUrl, `Certificate ${i + 1}`)}
                                >
                                  <img
                                    src={certUrl}
                                    alt={`Certificate ${i + 1}`}
                                    className="w-full aspect-square object-cover rounded-lg border-2 border-gray-200 hover:border-purple-500 transition-all shadow-md hover:shadow-xl"
                                    onError={() => handleImageError(teacher.id, i)}
                                    loading="lazy"
                                  />
                                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center pointer-events-none">
                                    <Eye className="w-10 h-10 text-white" />
                                    <span className="ml-2 text-white font-medium">Click to enlarge</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No certificates uploaded</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Certificate Viewer Modal */}
     {/* Certificate Viewer Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[1100] bg-black/95 backdrop-blur-sm animate-in fade-in duration-300 p-4"
          onClick={closeModal}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-full z-10"
            onClick={closeModal}
            aria-label="Close modal"
          >
            <X size={32} />
          </button>
         
          <div className="relative animate-in zoom-in-95 duration-300 w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt={selectedImageAlt}
              className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-2xl"
              style={{ maxWidth: '95vw', maxHeight: '95vh' }}
              onError={(e) => {
                console.error("Modal image failed to load:", e.target.src);
              }}
            />
          </div>
          
          {/* Image caption */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg">
            <p className="text-sm">{selectedImageAlt}</p>
          </div>
        </div>
      )}
    </div>
   
  );
};

export default AdminDashboard;