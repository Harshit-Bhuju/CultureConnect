import React, { useState, useEffect } from "react";
import {
  X,
  Image,
  Upload,
  Loader2,
  Film,
  AlertCircle,
  Check,
} from "lucide-react";

// Video Detail Upload Modal Component
export default function VideoDetailUpload({
  video,
  isOpen,
  onClose,
  onSave,
  isSaving = false,
}) {
  const [form, setForm] = useState({
    title: video?.title || "",
    description: video?.description || "",
    thumbnailFile: null,
    thumbnailUrl: video?.thumbnailUrl || null,
  });

  const [errors, setErrors] = useState({});
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

  useEffect(() => {
    if (video) {
      setForm({
        title: video.title || "",
        description: video.description || "",
        thumbnailFile: null,
        thumbnailUrl: video.thumbnailUrl || null,
      });
      setErrors({});
    }
  }, [video]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        thumbnail: "Please select an image file",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, thumbnail: "Image must be under 5MB" }));
      return;
    }

    setIsUploadingThumbnail(true);
    const url = URL.createObjectURL(file);
    setForm((prev) => ({
      ...prev,
      thumbnailFile: file,
      thumbnailUrl: url,
    }));
    setErrors((prev) => {
      const { thumbnail: _, ...rest } = prev;
      return rest;
    });
    setTimeout(() => setIsUploadingThumbnail(false), 300);
    e.target.value = "";
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) {
      newErrors.title = "Video title is required";
    }
    if (!form.description.trim()) {
      newErrors.description = "Video description is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    onSave({
      id: video.id,
      title: form.title.trim(),
      description: form.description.trim(),
      thumbnailFile: form.thumbnailFile,
      thumbnailUrl: form.thumbnailUrl,
    });
  };

  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Edit Video Details
          </h2>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Video Preview
            </label>
            <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden border border-gray-200">
              <video
                src={video.url}
                controls
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs text-gray-500">
              {video.name} • {video.durationFormatted || "Unknown duration"} •{" "}
              {video.size}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Image className="w-4 h-4" />
              Thumbnail (Required)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                {form.thumbnailUrl ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-gray-200">
                    <img
                      src={form.thumbnailUrl}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                    <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center cursor-pointer">
                      <Upload className="w-8 h-8 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="aspect-video border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition group">
                    {isUploadingThumbnail ? (
                      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                    ) : (
                      <>
                        <Image className="w-12 h-12 text-gray-400 group-hover:text-indigo-600 transition" />
                        <span className="text-sm font-medium text-gray-600 mt-2">
                          Upload Thumbnail
                        </span>
                        <span className="text-xs text-gray-500">
                          JPG, PNG • Max 5MB • 16:9 recommended
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                      disabled={isUploadingThumbnail}
                    />
                  </label>
                )}
              </div>
              <div className="flex items-center justify-center">
                <div className="bg-gray-100 rounded-xl aspect-video w-full flex items-center justify-center">
                  <Film className="w-16 h-16 text-gray-400" />
                </div>
              </div>
            </div>
            {errors.thumbnail && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.thumbnail}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Video Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g., Introduction to Basic Footwork"
              maxLength="255"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition ${
                errors.title ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.title}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              rows="4"
              maxLength="5000"
              placeholder="What will students learn in this lesson? Key topics, techniques, etc."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition ${
                errors.description
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300"
              }`}
            />
            <p className="text-xs text-gray-500">
              {form.description.length}/5000 characters
            </p>
            {errors.description && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2 transition disabled:opacity-50">
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
