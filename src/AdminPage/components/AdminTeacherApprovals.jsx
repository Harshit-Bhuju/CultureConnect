import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  Eye,
  FileWarning,
  Mail,
  Phone,
  GraduationCap,
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../../Configs/ApiEndpoints";
import Loading from "../../components/Common/Loading";

const AdminTeacherApprovals = () => {
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageAlt, setSelectedImageAlt] = useState("");

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
    setImageErrors((prev) => ({
      ...prev,
      [`${teacherId}-${certIndex}`]: true,
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

  if (loading) {
    return <Loading message="Loading Teacher Approvals..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Teacher Approvals
            </h2>
            <p className="text-gray-600 mt-1">
              {pendingTeachers.length} pending application
              {pendingTeachers.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Teachers List */}
      {pendingTeachers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-gray-400 mb-4">
            <GraduationCap size={64} className="mx-auto" />
          </div>
          <p className="text-gray-500 text-lg font-medium">
            No pending applications
          </p>
          <p className="text-gray-400 text-sm mt-2">
            All teacher applications have been processed
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="p-6">
                {/* Teacher Info */}
                <div className="flex flex-col lg:flex-row gap-6 mb-6">
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={
                        teacher.profile_photo
                          ? `${API.TEACHER_PROFILE_PICTURES}/${teacher.profile_photo}`
                          : "/default-avatar.png"
                      }
                      alt={teacher.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-gray-100 shadow-sm"
                      onError={(e) => {
                        console.error("Profile image failed to load:", e.target.src);
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {teacher.name}
                      </h3>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={16} />
                          <span>{teacher.email}</span>
                        </div>
                        {teacher.esewa_number && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={16} />
                            <span>eSewa: {teacher.esewa_number}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-semibold">
                            {teacher.styles}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex lg:flex-col gap-3">
                    <button
                      onClick={() =>
                        handleTeacherApproval(teacher.id, "approve")
                      }
                      disabled={actionLoading}
                      className="flex-1 lg:flex-none px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold shadow-sm transition-all">
                      <Check size={20} /> Approve
                    </button>
                    <button
                      onClick={() =>
                        handleTeacherApproval(teacher.id, "reject")
                      }
                      disabled={actionLoading}
                      className="flex-1 lg:flex-none px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold shadow-sm transition-all">
                      <X size={20} /> Reject
                    </button>
                  </div>
                </div>

                {/* Bio */}
                {teacher.bio && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <span>📝</span> Bio
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {teacher.bio}
                    </p>
                  </div>
                )}

                {/* Certificates */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span>🎓</span> Certificates (
                    {teacher.certificates?.length || 0})
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
                                <p className="text-sm font-medium text-red-700">
                                  Failed to load
                                </p>
                                <p className="text-xs text-gray-600 mt-1 break-all max-w-full">
                                  {cert.url}
                                </p>
                                <a
                                  href={certUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 underline mt-3 hover:text-blue-800">
                                  Open directly →
                                </a>
                              </div>
                            ) : (
                              <div
                                className="cursor-pointer relative"
                                onClick={() => openImageModal(certUrl, `Certificate ${i + 1}`)}>
                                <img
                                  src={certUrl}
                                  alt={`Certificate ${i + 1}`}
                                  className="w-full aspect-square object-cover rounded-lg border-2 border-gray-200 hover:border-purple-500 transition-all shadow-md hover:shadow-xl"
                                  onError={() => {
                                    console.error("Certificate image failed to load:", certUrl);
                                    handleImageError(teacher.id, i);
                                  }}
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center pointer-events-none">
                                  <Eye className="w-10 h-10 text-white" />
                                  <span className="ml-2 text-white font-medium">
                                    Click to enlarge
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No certificates uploaded
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Viewer Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[1100] bg-black/95 backdrop-blur-sm animate-in fade-in duration-300 p-4"
          onClick={closeModal}>
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-full z-10"
            onClick={closeModal}
            aria-label="Close modal">
            <X size={32} />
          </button>

          <div
            className="relative animate-in zoom-in-95 duration-300 w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt={selectedImageAlt}
              className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-2xl"
              style={{ maxWidth: "95vw", maxHeight: "95vh" }}
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

export default AdminTeacherApprovals;
