import React from "react";
import {
    Play,
    Clock,
    Film,
    Lock,
    PlayCircle,
    Eye,
} from "lucide-react";

export default function StudentVideoPreview({ course, isEnrolled }) {
    // Find first intro video or first video
    const previewVideo =
        course.videos.find((v) => v.is_intro === 1) || course.videos[0];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Film className="w-6 h-6 text-blue-600" />
                    Course Preview
                </h2>

                {/* Preview Video */}
                {previewVideo ? (
                    <div className="space-y-4">
                        <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden group">
                            <img
                                src={previewVideo.thumbnail}
                                alt={previewVideo.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src =
                                        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800";
                                }}
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                {previewVideo.is_intro === 1 ? (
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition cursor-pointer">
                                            <Play className="w-10 h-10 text-blue-600 ml-1" />
                                        </div>
                                        <p className="text-white font-semibold text-lg">
                                            Watch Preview
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <Lock className="w-12 h-12 text-white/80 mb-3 mx-auto" />
                                        <p className="text-white font-semibold">
                                            Enroll to watch this video
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Preview Badge */}
                            {previewVideo.is_intro === 1 && (
                                <div className="absolute top-4 left-4 px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded-full">
                                    Free Preview
                                </div>
                            )}

                            {/* Duration Badge */}
                            <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/80 text-white text-sm font-medium rounded flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {previewVideo.duration}
                            </div>
                        </div>

                        {/* Video Info */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                                {previewVideo.title}
                            </h3>
                            {previewVideo.description && (
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {previewVideo.description}
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                            <Film className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 font-medium">No preview available</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Video List Preview */}
            {course.videos.length > 0 && (
                <div className="border-t border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <PlayCircle className="w-5 h-5 text-blue-600" />
                        Course Content
                        <span className="text-sm font-normal text-gray-500 ml-auto">
                            {course.videos.length} lessons
                        </span>
                    </h3>

                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {course.videos.slice(0, 5).map((video, index) => (
                            <div
                                key={video.id}
                                className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                                {/* Thumbnail */}
                                <div className="relative w-20 h-12 bg-gray-900 rounded overflow-hidden flex-shrink-0">
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                        {video.is_intro === 1 || isEnrolled ? (
                                            <Play className="w-5 h-5 text-white" />
                                        ) : (
                                            <Lock className="w-4 h-4 text-white" />
                                        )}
                                    </div>
                                </div>

                                {/* Video Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="font-medium text-sm text-gray-900 line-clamp-1 flex-1">
                                            {index + 1}. {video.title}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {video.duration}
                                        </span>
                                        {video.is_intro === 1 && (
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                                                Preview
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {course.videos.length > 5 && (
                            <p className="text-center text-sm text-gray-500 pt-2">
                                + {course.videos.length - 5} more lessons
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}