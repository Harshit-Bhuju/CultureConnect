import React, { useRef, useEffect, useState } from "react";
import { Play, Clock, CheckCircle } from "lucide-react";
import API from "../../../../Configs/ApiEndpoints";

export default function VideoPlayerSection({
  activeVideo,
  course,
  completedVideos,
  toggleVideoCompletion,
  currentIndex,
  totalVideos,
  savedTimestamp,
}) {
  const videoRef = useRef(null);
  const lastUpdateRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Reset player when active video changes
  useEffect(() => {
    if (videoRef.current && activeVideo) {
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
      setHasStarted(false);
    }
  }, [activeVideo?.id]);

  const handleTimeUpdate = async () => {
    if (!videoRef.current || !activeVideo) return;

    const currentTime = videoRef.current.currentTime;
    const now = Date.now();

    // Throttle updates: every 5 seconds
    if (now - lastUpdateRef.current > 5000) {
      lastUpdateRef.current = now;
      try {
        await fetch(API.UPDATE_VIDEO_TIMESTAMP, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            course_id: course.id,
            video_id: activeVideo.id,
            timestamp: Math.floor(currentTime),
          }),
        });
      } catch (error) {
        console.error("Failed to sync progress", error);
      }
    }
  };

  const handlePlayClick = () => {
    if (videoRef.current) {
      setHasStarted(true);
      videoRef.current.play();
      // Try to enter fullscreen
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        /* Safari */
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        /* IE11 */
        videoRef.current.msRequestFullscreen();
      }
      setIsPlaying(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Video Player */}
      <div className="relative aspect-video bg-black group">
        {activeVideo ? (
          <>
            <video
              ref={videoRef}
              key={activeVideo.id}
              className="w-full h-full object-contain"
              controls={hasStarted}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => {
                if (savedTimestamp > 0 && !completedVideos.includes(activeVideo.id)) {
                  videoRef.current.currentTime = savedTimestamp;
                }
              }}
              onPlay={() => {
                setIsPlaying(true);
                setHasStarted(true);
              }}
              onPause={() => setIsPlaying(false)}
              onEnded={() => {
                setIsPlaying(false);
                if (!completedVideos.includes(activeVideo.id)) {
                  toggleVideoCompletion(activeVideo.id);
                }
              }}
              poster={`${API.COURSE_THUMBNAILS}/${activeVideo.thumbnail || course.thumbnail}`}>
              <source
                src={`${API.COURSE_VIDEOS}/${activeVideo.video_filename || activeVideo.video_url}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>

            {(!hasStarted || !isPlaying) && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer hover:bg-black/50 transition-all z-10"
                onClick={handlePlayClick}>
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50 shadow-xl group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="text-center">
              <Play className="w-20 h-20 mx-auto mb-4 opacity-20" />
              <p className="text-gray-400 text-lg font-medium">
                Select a lesson to begin
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-6 space-y-4">
        {/* Lesson Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 uppercase tracking-wide">
                Lesson {currentIndex + 1} of {totalVideos}
              </span>
              {activeVideo?.duration && (
                <>
                  <span className="text-gray-300 hidden sm:inline">•</span>
                  <span className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {activeVideo.duration}
                  </span>
                </>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              {activeVideo?.video_title || "Welcome to the Course"}
            </h2>
          </div>

          {/* Complete Button */}
          <button
            onClick={() => toggleVideoCompletion(activeVideo?.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-sm whitespace-nowrap ${completedVideos.includes(activeVideo?.id)
              ? "bg-green-50 border-2 border-green-200 text-green-700 hover:bg-green-100"
              : "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              }`}>
            <CheckCircle
              className={`w-5 h-5 ${completedVideos.includes(activeVideo?.id)
                ? "fill-green-600 text-white"
                : ""
                }`}
            />
            <span className="hidden sm:inline">
              {completedVideos.includes(activeVideo?.id)
                ? "Completed"
                : "Mark Complete"}
            </span>
            <span className="sm:hidden">
              {completedVideos.includes(activeVideo?.id) ? "Done" : "Complete"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
