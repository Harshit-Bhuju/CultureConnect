import React from "react";
import {
  Film,
  Clock,
  ChevronLeft,
  ChevronRight,
  Play,
  Edit2,
  GripVertical,
  X,
  AlertCircle,
  Loader2,
  Image,
  Info,
} from "lucide-react";

export default function MediaUploadSection({
  videos,
  selectedVideo,
  setSelectedVideo,
  isUploading,
  handleVideoUpload,
  removeVideo,
  isDragging,
  draggedIndexRef,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  onEditVideo,
  courseThumbnailUrl,
  courseThumbnailFile,
  handleCourseThumbnailChange,
  removeCourseThumbnail,
  errors,
  totalHours,
  totalMinutes,
  isSubmitting,
}) {
  return (
    <div className="space-y-6">
      {/* Video Player & List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Film className="w-5 h-5 text-indigo-600" />
          Course Videos
          {videos.length > 0 && (
            <span className="text-sm font-normal text-gray-500">
              ({videos.length}/20)
            </span>
          )}
        </h2>

        {/* Total Duration Display */}
        {videos.length > 0 && (
          <div className="mb-4 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Total Video Content
                </p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">
                  {totalHours > 0 && `${totalHours}h `}
                  {totalMinutes}min
                </p>
              </div>
              <Clock className="w-10 h-10 text-indigo-400" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Across {videos.length} video lessons
            </p>
          </div>
        )}

        {/* Video Preview */}
        <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 mb-4">
          {videos[selectedVideo] ? (
            <video
              key={videos[selectedVideo].id}
              src={videos[selectedVideo].url}
              controls
              className="w-full h-full object-contain">
              Your browser does not support video playback.
            </video>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
              <Film className="w-16 h-16" />
              <p className="font-medium text-gray-600">
                Upload course video lessons
              </p>
              <p className="text-xs text-gray-500">
                First video will be the intro/preview
              </p>
            </div>
          )}

          {videos.length > 1 && (
            <>
              <button
                onClick={() =>
                  setSelectedVideo(
                    (p) => (p - 1 + videos.length) % videos.length,
                  )
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedVideo((p) => (p + 1) % videos.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition">
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {!videos.length && (
            <label className="absolute inset-0 cursor-pointer hover:bg-gray-200/50 transition flex items-center justify-center">
              <input
                type="file"
                multiple
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
                disabled={isUploading || isSubmitting}
              />
            </label>
          )}
        </div>

        {/* Video List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {videos.map((vid, idx) => (
            <div
              key={vid.id}
              className={`relative rounded-lg border-2 transition ${
                isDragging && draggedIndexRef.current === idx
                  ? "opacity-50 scale-95"
                  : ""
              } ${
                selectedVideo === idx
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}>
              <div
                draggable={!isSubmitting}
                onDragStart={() => !isSubmitting && handleDragStart(idx)}
                onDragOver={handleDragOver}
                onDrop={() => !isSubmitting && handleDrop(idx)}
                onDragEnd={handleDragEnd}
                onClick={() => setSelectedVideo(idx)}
                className={`p-3 ${!isSubmitting ? "cursor-move group" : "cursor-default group"}`}>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-900 rounded overflow-hidden flex-shrink-0 relative">
                    {vid.thumbnailUrl ? (
                      <img
                        src={vid.thumbnailUrl}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {vid.title || vid.name}
                    </p>
                    {vid.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {vid.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {vid.durationFormatted} • {vid.size}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditVideo(vid);
                      }}
                      disabled={isSubmitting}
                      className="p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 disabled:pointer-events-none">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="w-5 h-5 text-gray-400" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeVideo(vid.id);
                      }}
                      disabled={isSubmitting}
                      className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 disabled:pointer-events-none">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {idx === 0 && (
                  <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded">
                    Intro
                  </span>
                )}
              </div>
            </div>
          ))}

          {videos.length < 20 && (
            <label className="block p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition">
              {isUploading ? (
                <>
                  <Loader2 className="w-8 h-8 text-indigo-600 mx-auto mb-2 animate-spin" />
                  <span className="text-sm font-medium text-gray-600">
                    Uploading...
                  </span>
                </>
              ) : (
                <>
                  <Film className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-600">
                    Add More Videos
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    MP4, MOV, AVI, MKV, WEBM (Max 500MB)
                  </p>
                </>
              )}
              <input
                type="file"
                multiple
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
                disabled={isUploading || isSubmitting}
              />
            </label>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-3 flex items-start gap-2">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          Click the edit icon to add title, description, and thumbnail to each
          video. Drag to reorder.
        </p>

        {errors.videos && (
          <p className="text-xs text-red-600 mt-2 font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.videos}
          </p>
        )}
      </div>

      {/* Course Thumbnail */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Image className="w-5 h-5 text-indigo-600" />
          Course Thumbnail
          <span className="text-red-500">*</span>
        </h2>

        <div className="space-y-4">
          <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
            {courseThumbnailUrl ? (
              <img
                src={courseThumbnailUrl}
                alt="Course thumbnail"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                <Film className="w-12 h-12" />
                <div className="text-center">
                  <p className="font-medium text-gray-600">
                    Upload course thumbnail
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended 16:9 ratio • JPG/PNG • Max 5MB
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium cursor-pointer hover:bg-indigo-700 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleCourseThumbnailChange}
                className="hidden"
                disabled={isSubmitting}
              />
              <Film className="w-4 h-4" />
              {courseThumbnailUrl ? "Change Thumbnail" : "Upload Thumbnail"}
            </label>

            {courseThumbnailUrl && (
              <button
                type="button"
                onClick={removeCourseThumbnail}
                className="px-4 py-3 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition"
                disabled={isSubmitting}>
                Remove
              </button>
            )}
          </div>

          {errors.courseThumbnail && (
            <p className="text-xs text-red-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.courseThumbnail}
            </p>
          )}

          <p className="text-xs text-gray-500 flex items-start gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            This thumbnail will be displayed on the course card and details page
          </p>
        </div>
      </div>
    </div>
  );
}
