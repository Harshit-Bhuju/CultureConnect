import React from "react";
import {
  Play,
  ChevronLeft,
  ChevronRight,
  Film,
  Clock,
  Eye,
  CheckCircle,
} from "lucide-react";

export default function VideoPlayer({
  course,
  selectedVideoIndex,
  setSelectedVideoIndex,
}) {
  const currentVideo = course.videos[selectedVideoIndex];

  const handlePrevious = () => {
    if (selectedVideoIndex > 0) {
      setSelectedVideoIndex(selectedVideoIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedVideoIndex < course.videos.length - 1) {
      setSelectedVideoIndex(selectedVideoIndex + 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Film className="w-6 h-6 text-indigo-600" />
          Course Videos
          {course.videos.length > 0 && (
            <span className="text-sm font-normal text-gray-500">
              ({selectedVideoIndex + 1} of {course.videos.length})
            </span>
          )}
        </h2>

        {/* Video Player */}
        {currentVideo ? (
          <div className="space-y-4">
            <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
              {currentVideo.videoUrl ? (
                <video
                  key={currentVideo.id}
                  src={currentVideo.videoUrl}
                  controls
                  className="w-full h-full"
                  poster={currentVideo.thumbnail}>
                  Your browser does not support video playback.
                </video>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white">
                  <Film className="w-16 h-16 mb-3 opacity-50" />
                  <p className="text-lg font-medium">Video not available</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Video file may be processing or missing
                  </p>
                </div>
              )}

              {/* Navigation Arrows */}
              {course.videos.length > 1 && (
                <>
                  <button
                    onClick={handlePrevious}
                    disabled={selectedVideoIndex === 0}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-lg transition ${
                      selectedVideoIndex === 0
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-white hover:scale-110"
                    }`}>
                    <ChevronLeft className="w-5 h-5 text-gray-900" />
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={selectedVideoIndex === course.videos.length - 1}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-lg transition ${
                      selectedVideoIndex === course.videos.length - 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-white hover:scale-110"
                    }`}>
                    <ChevronRight className="w-5 h-5 text-gray-900" />
                  </button>
                </>
              )}

              {/* Intro Badge */}
              {currentVideo.is_intro === 1 && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-full">
                  Intro Video
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-bold text-gray-900 flex-1">
                  {currentVideo.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {currentVideo.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {currentVideo.views}
                  </div>
                </div>
              </div>

              {currentVideo.description && (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {currentVideo.description}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <Film className="w-16 h-16 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No videos uploaded</p>
              <p className="text-sm text-gray-500 mt-1">
                Upload videos to display them here
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Video Playlist */}
      {course.videos.length > 0 && (
        <div className="border-t border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Play className="w-5 h-5 text-indigo-600" />
            Course Playlist
          </h3>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {course.videos.map((video, index) => (
              <button
                key={video.id}
                onClick={() => setSelectedVideoIndex(index)}
                className={`w-full text-left p-3 rounded-lg border-2 transition group ${
                  selectedVideoIndex === index
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}>
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  <div className="relative w-24 h-16 bg-gray-900 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-medium text-sm text-gray-900 line-clamp-1 flex-1">
                        {index + 1}. {video.title}
                      </p>
                      {selectedVideoIndex === index && (
                        <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      )}
                    </div>

                    {video.description && (
                      <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                        {video.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {video.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {video.views} views
                      </span>
                      {video.is_intro === 1 && (
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                          Intro
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
