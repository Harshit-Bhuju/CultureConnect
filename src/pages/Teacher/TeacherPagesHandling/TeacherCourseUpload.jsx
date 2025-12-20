import { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  Tag,
  Save,
  Eye,
  Clock,
  Info,
  AlertCircle,
  ArrowLeft,
  Play,
  Film,
  Loader2,
  Edit2,
  Check,
} from "lucide-react";
import API from "../../../Configs/ApiEndpoints";
import VideoDetailUpload from "./VideoDetailUpload";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function TeacherCourseUpload() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(0);
  const draggedIndexRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [videoDetailOpen, setVideoDetailOpen] = useState(false);
  const [currentEditingVideo, setCurrentEditingVideo] = useState(null);
  const [courseThumbnailFile, setCourseThumbnailFile] = useState(null);
  const [courseThumbnailUrl, setCourseThumbnailUrl] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    courseTitle: "",
    category: "",
    skillLevel: "",
    price: "",
    durationWeeks: "",
    description: "",
    tags: [],
    whatYouWillLearn: "",
    requirements: "",
    language: "English",
  });

  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    return () => {
      videos.forEach((vid) => {
        if (!vid.isExisting && vid.url) {
          URL.revokeObjectURL(vid.url);
        }
      });
    };
  }, [videos]);

  useEffect(() => {
    if (selectedVideo > videos.length - 1 && videos.length > 0) {
      setSelectedVideo(videos.length - 1);
    } else if (videos.length === 0) {
      setSelectedVideo(0);
    }
  }, [videos.length, selectedVideo]);

  const handleVideoUpload = useCallback((e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    setIsUploading(true);

    try {
      const validFiles = files.filter((file) => {
        if (!file.type.startsWith("video/")) {
          toast.error(`${file.name} is not a video file`);
          return false;
        }
        if (file.size > 500 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 500MB)`);
          return false;
        }
        return true;
      });

      if (!validFiles.length) {
        setIsUploading(false);
        return;
      }

      const newVideos = validFiles.map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(file),
        file,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: "",
      }));

      setVideos((prev) => {
        const total = [...prev, ...newVideos];
        if (total.length > 20) {
          toast.error("Maximum 20 videos allowed");
          total.slice(20).forEach(vid => {
            if (vid.url) URL.revokeObjectURL(vid.url);
          });
          return total.slice(0, 20);
        }
        return total;
      });

      setErrors((prev) => {
        if (prev.videos) {
          const { videos: _, ...rest } = prev;
          return rest;
        }
        return prev;
      });
    } catch (error) {
      console.error('Error uploading videos:', error);
      toast.error('Failed to process videos');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  }, []);

  const removeVideo = useCallback((id) => {
    setVideos((prev) => {
      const removedIndex = prev.findIndex(v => v.id === id);
      const vid = prev[removedIndex];

      if (vid && vid.url) {
        URL.revokeObjectURL(vid.url);
      }

      const newVideos = prev.filter((v) => v.id !== id);

      setSelectedVideo(current => {
        if (removedIndex === current && current >= newVideos.length) {
          return Math.max(0, newVideos.length - 1);
        } else if (removedIndex < current) {
          return current - 1;
        }
        return current;
      });

      return newVideos;
    });
  }, []);

  const handleDragStart = useCallback((index) => {
    draggedIndexRef.current = index;
    setIsDragging(true);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((dropIndex) => {
    const dragIndex = draggedIndexRef.current;
    if (dragIndex === null || dragIndex === dropIndex) return;

    setVideos((prev) => {
      const newVids = [...prev];
      const [moved] = newVids.splice(dragIndex, 1);
      newVids.splice(dropIndex, 0, moved);

      setSelectedVideo(current => {
        if (current === dragIndex) return dropIndex;
        if (current === dropIndex) return dragIndex < dropIndex ? current + 1 : current - 1;
        if (dragIndex < current && dropIndex >= current) return current - 1;
        if (dragIndex > current && dropIndex <= current) return current + 1;
        return current;
      });

      return newVids;
    });

    draggedIndexRef.current = null;
    setIsDragging(false);
  }, []);

  const handleDragEnd = useCallback(() => {
    draggedIndexRef.current = null;
    setIsDragging(false);
  }, []);

  // Video editing is handled via the `VideoDetailUpload` modal now (see modal state below).

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => {
      if (prev[name]) {
        const { [name]: _, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  }, []);

  const commitTag = useCallback((value) => {
    const tag = value.trim();
    if (!tag) return;

    if (tag.length > 50) {
      setErrors((prev) => ({ ...prev, tags: "Tag must be less than 50 characters" }));
      return;
    }

    setFormData((prev) => {
      if (prev.tags.includes(tag)) {
        setErrors((prevErr) => ({ ...prevErr, tags: "Tag already exists" }));
        return prev;
      }

      if (prev.tags.length >= 10) {
        setErrors((prevErr) => ({ ...prevErr, tags: "Maximum 10 tags allowed" }));
        return prev;
      }

      setErrors((prevErr) => {
        const { tags: _, ...rest } = prevErr;
        return rest;
      });

      return { ...prev, tags: [...prev.tags, tag] };
    });

    setTagInput("");
  }, []);

  const handleTagKeyDown = useCallback((e) => {
    if (e.key === " " || e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitTag(tagInput);
    } else if (e.key === "Backspace" && !tagInput && formData.tags.length) {
      e.preventDefault();
      setFormData((prev) => ({ ...prev, tags: prev.tags.slice(0, -1) }));
    }
  }, [tagInput, formData.tags, commitTag]);

  const handleTagBlur = useCallback(() => {
    if (tagInput.trim()) {
      commitTag(tagInput);
    }
  }, [tagInput, commitTag]);

  const removeTag = useCallback((tag) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  }, []);

  const handleCourseThumbnailChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file for course thumbnail');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Course thumbnail must be under 5MB');
      return;
    }

    // revoke previous url if we set one
    if (courseThumbnailUrl) {
      URL.revokeObjectURL(courseThumbnailUrl);
    }

    const url = URL.createObjectURL(file);
    setCourseThumbnailFile(file);
    setCourseThumbnailUrl(url);
    setErrors((prev) => {
      const { courseThumbnail, ...rest } = prev;
      return rest;
    });
    e.target.value = '';
  }, [courseThumbnailUrl]);

  const removeCourseThumbnail = useCallback(() => {
    if (courseThumbnailUrl) {
      URL.revokeObjectURL(courseThumbnailUrl);
    }
    setCourseThumbnailFile(null);
    setCourseThumbnailUrl(null);
  }, [courseThumbnailUrl]);

  const validateRequiredFields = useCallback(() => {
    const newErrors = {};

    if (!videos.length) {
      newErrors.videos = "Please upload at least one course video.";
    }

    const videosWithoutTitle = videos.filter(v => !v.title?.trim());
    const videosWithoutDescription = videos.filter(v => !v.description?.trim());
    const videosWithoutThumbnail = videos.filter(v => !(v.thumbnailUrl || v.thumbnailFile || v.thumbnail));

    if (videosWithoutTitle.length > 0) {
      newErrors.videos = `${videosWithoutTitle.length} video(s) missing title. Please add titles to all videos.`;
    } else if (videosWithoutDescription.length > 0) {
      newErrors.videos = `${videosWithoutDescription.length} video(s) missing description. Please add descriptions to all videos.`;
    } else if (videosWithoutThumbnail.length > 0) {
      newErrors.videos = `${videosWithoutThumbnail.length} video(s) missing thumbnail. Please add thumbnails to all videos.`;
    }

    const titleTrimmed = formData.courseTitle.trim();
    if (!titleTrimmed) {
      newErrors.courseTitle = "Course title is required.";
    } else if (titleTrimmed.length < 3) {
      newErrors.courseTitle = "Course title must be at least 3 characters.";
    } else if (titleTrimmed.length > 255) {
      newErrors.courseTitle = "Course title must not exceed 255 characters.";
    }

    if (!formData.category) {
      newErrors.category = "Select a category.";
    } else if (!['dance', 'music', 'yoga', 'art', 'language'].includes(formData.category)) {
      newErrors.category = "Invalid category selected.";
    }

    if (!formData.skillLevel) {
      newErrors.skillLevel = "Select a skill level.";
    } else if (!['beginner', 'intermediate', 'advanced', 'all'].includes(formData.skillLevel)) {
      newErrors.skillLevel = "Invalid skill level selected.";
    }

    if (formData.price) {
      const priceNum = Number(formData.price);
      if (isNaN(priceNum) || priceNum < 0) {
        newErrors.price = "Enter a valid price (0 or greater).";
      } else if (priceNum > 999999999) {
        newErrors.price = "Price must not exceed 999,999,999.";
      }
    }

    if (!formData.durationWeeks) {
      newErrors.durationWeeks = "Duration is required.";
    } else {
      const duration = Number(formData.durationWeeks);
      if (isNaN(duration) || duration < 1) {
        newErrors.durationWeeks = "Duration must be at least 1 week.";
      } else if (duration > 52) {
        newErrors.durationWeeks = "Duration cannot exceed 52 weeks.";
      }
    }

    const descTrimmed = formData.description.trim();
    if (!descTrimmed) {
      newErrors.description = "Description is required.";
    } else if (descTrimmed.length < 20) {
      newErrors.description = "Description must be at least 20 characters.";
    } else if (descTrimmed.length > 5000) {
      newErrors.description = "Description must not exceed 5000 characters.";
    }

    // Course thumbnail required
    if (!(courseThumbnailFile || courseThumbnailUrl)) {
      newErrors.courseThumbnail = "Course thumbnail is required.";
    }

    if (formData.tags.length === 0) {
      newErrors.tags = "Please add at least one tag.";
    } else if (formData.tags.length > 10) {
      newErrors.tags = "Maximum 10 tags allowed.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [videos, formData]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    if (!validateRequiredFields()) {
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const element = document.querySelector(`[name="${firstErrorKey}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      toast.error("Please fix all errors before publishing");
      return;
    }

    setIsSubmitting(true);

    try {
      // Build form data including videos, their titles/descriptions and thumbnails
      const fd = new FormData();
      fd.append('courseTitle', formData.courseTitle);
      fd.append('category', formData.category);
      fd.append('skillLevel', formData.skillLevel);
      fd.append('price', formData.price || 0);
      fd.append('durationWeeks', formData.durationWeeks);
      fd.append('description', formData.description);
      fd.append('whatYouWillLearn', formData.whatYouWillLearn);
      fd.append('requirements', formData.requirements);
      fd.append('language', formData.language || 'English');
      fd.append('status', 'published');
      fd.append('tags', JSON.stringify(formData.tags));

      // course thumbnail
      if (courseThumbnailFile) {
        fd.append('course_thumbnail', courseThumbnailFile);
      }

      videos.forEach((vid, idx) => {
        if (vid.file) fd.append('videos[]', vid.file);
        fd.append('video_titles[]', vid.title || '');
        fd.append('video_descriptions[]', vid.description || '');
        if (vid.thumbnailFile) {
          // put thumbnail in indexed field so server can map by index
          fd.append(`thumbnails[${idx}]`, vid.thumbnailFile);
        }
      });

      const res = await fetch(API.COURSE_UPLOAD, {
        method: 'POST',
        body: fd,
        credentials: 'include',
      });

      const data = await res.json();
      if (!data || data.status !== 'success') {
        throw new Error(data?.message || 'Upload failed');
      }

      toast.success(data.message || 'Course published successfully!');
      navigate(`/teacherprofile/${data.teacher_id}`);
      // reset form after successful publish
      setFormData({
        courseTitle: "",
        category: "",
        skillLevel: "",
        price: "",
        durationWeeks: "",
        description: "",
        tags: [],
        whatYouWillLearn: "",
        requirements: "",
        language: "English",
      });

      videos.forEach((vid) => {
        if (vid.url) URL.revokeObjectURL(vid.url);
      });
      setVideos([]);
      setErrors({});
      setSelectedVideo(0);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to publish course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, validateRequiredFields, videos, formData, errors]);

  const handleSaveDraft = useCallback(async () => {
    if (isSubmitting) return;

    if (!validateRequiredFields()) {
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const element = document.querySelector(`[name="${firstErrorKey}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      toast.error("Please fix all errors before saving draft");
      return;
    }

    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append('courseTitle', formData.courseTitle);
      fd.append('category', formData.category);
      fd.append('skillLevel', formData.skillLevel);
      fd.append('price', formData.price || 0);
      fd.append('durationWeeks', formData.durationWeeks);
      fd.append('description', formData.description);
      fd.append('whatYouWillLearn', formData.whatYouWillLearn);
      fd.append('requirements', formData.requirements);
      fd.append('language', formData.language || 'English');
      fd.append('status', 'draft');
      fd.append('tags', JSON.stringify(formData.tags));

      // course thumbnail
      if (courseThumbnailFile) {
        fd.append('course_thumbnail', courseThumbnailFile);
      }

      videos.forEach((vid, idx) => {
        if (vid.file) fd.append('videos[]', vid.file);
        fd.append('video_titles[]', vid.title || '');
        fd.append('video_descriptions[]', vid.description || '');
        if (vid.thumbnailFile) {
          fd.append(`thumbnails[${idx}]`, vid.thumbnailFile);
        }
      });

      const res = await fetch(API.COURSE_UPLOAD, {
        method: 'POST',
        body: fd,
        credentials: 'include',
      });

      const data = await res.json();
      if (!data || data.status !== 'success') {
        throw new Error(data?.message || 'Save draft failed');
      }

      toast.success(data.message || 'Draft saved successfully!');

      videos.forEach((vid) => {
        if (vid.url) URL.revokeObjectURL(vid.url);
      });
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to save draft. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, validateRequiredFields, videos, errors]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <button
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
            disabled={isSubmitting}
            onClick={() => (navigate(-1))}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Courses
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Course
          </h1>
          <p className="text-gray-600">
            Upload video lessons and build an engaging online course
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
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

              <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 mb-4">
                {videos[selectedVideo] ? (
                  <video
                    key={videos[selectedVideo].id}
                    src={videos[selectedVideo].url}
                    controls
                    className="w-full h-full object-contain"
                  >
                    Your browser does not support video playback.
                  </video>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
                    <Film className="w-16 h-16" />
                    <p className="font-medium text-gray-600">Upload course video lessons</p>
                    <p className="text-xs text-gray-500">First video will be the intro/preview</p>
                  </div>
                )}

                {videos.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedVideo((p) => (p - 1 + videos.length) % videos.length)
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition"
                      aria-label="Previous video"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedVideo((p) => (p + 1) % videos.length)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition"
                      aria-label="Next video"
                    >
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

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {videos.map((vid, idx) => (
                  <div
                    key={vid.id}
                    className={`relative rounded-lg border-2 transition ${isDragging && draggedIndexRef.current === idx ? "opacity-50 scale-95" : ""
                      } ${selectedVideo === idx
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <div
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(idx)}
                      onDragEnd={handleDragEnd}
                      onClick={() => setSelectedVideo(idx)}
                      className="p-3 cursor-move group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gray-900 rounded overflow-hidden flex-shrink-0 relative">
                          {vid.thumbnailUrl ? (
                            <img src={vid.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
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
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{vid.description}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">{vid.size}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentEditingVideo(vid);
                              setVideoDetailOpen(true);
                            }}
                            className="p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Edit video details"
                          >
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
                            className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove video"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {idx === 0 && (
                        <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded">
                          Intro
                        </span>
                      )}
                      {(!vid.title?.trim() || !vid.description?.trim() || !(vid.thumbnailUrl || vid.thumbnailFile || vid.thumbnail)) && (
                        <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {!vid.title?.trim() ? 'No title' : !vid.description?.trim() ? 'No description' : 'No thumbnail'}
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
                        <span className="text-sm font-medium text-gray-600">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Film className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm font-medium text-gray-600">Add More Videos</span>
                        <p className="text-xs text-gray-500 mt-1">MP4, MOV, AVI, MKV, WEBM (Max 500MB)</p>
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
                Click the edit icon to add title, description, and thumbnail to each video. Drag thumbnails to reorder.
              </p>

              {errors.videos && (
                <p className="text-xs text-red-600 mt-2 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.videos}
                </p>
              )}
            </div>

            {/* Course Thumbnail Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Film className="w-5 h-5 text-indigo-600" />
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
                        <p className="font-medium text-gray-600">Upload course thumbnail</p>
                        <p className="text-xs text-gray-500 mt-1">Recommended 16:9 ratio • JPG/PNG • Max 5MB</p>
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
                    {courseThumbnailUrl ? 'Change Thumbnail' : 'Upload Thumbnail'}
                  </label>

                  {courseThumbnailUrl && (
                    <button
                      type="button"
                      onClick={removeCourseThumbnail}
                      className="px-4 py-3 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition"
                      disabled={isSubmitting}
                    >
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

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab("basic")}
                  className={`flex-1 py-4 font-semibold flex items-center justify-center gap-2 transition ${activeTab === "basic"
                      ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                      : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <Tag className="w-4 h-4" />
                  Basic Info
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`flex-1 py-4 font-semibold flex items-center justify-center gap-2 transition ${activeTab === "details"
                      ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                      : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <Info className="w-4 h-4" />
                  Details
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
                {activeTab === "basic" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Course Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="courseTitle"
                        value={formData.courseTitle}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${errors.courseTitle ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                        placeholder="e.g. Beginner Kathak Dance Course"
                        maxLength="255"
                      />
                      {errors.courseTitle && (
                        <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.courseTitle}
                        </p>
                      )}

                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${errors.category ? "border-red-300 bg-red-50" : "border-gray-300"
                            }`}
                        >
                          <option value="">Select category</option>
                          <option value="dance">Dance</option>
                          <option value="music">Music</option>
                          <option value="yoga">Yoga</option>
                          <option value="art">Art & Craft</option>
                          <option value="language">Language</option>
                        </select>
                        {errors.category && (
                          <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.category}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Skill Level <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="skillLevel"
                          value={formData.skillLevel}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${errors.skillLevel ? "border-red-300 bg-red-50" : "border-gray-300"
                            }`}
                        >
                          <option value="">Select level</option>
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                          <option value="all">All Levels</option>
                        </select>
                        {errors.skillLevel && (
                          <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.skillLevel}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Price (Rs)
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          min="0"
                          max="999999999"
                          placeholder="0"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${errors.price ? "border-red-300 bg-red-50" : "border-gray-300"
                            }`}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Duration (Weeks) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="durationWeeks"
                          value={formData.durationWeeks}
                          onChange={handleInputChange}
                          min="1"
                          max="52"
                          placeholder="e.g. 8"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${errors.durationWeeks ? "border-red-300 bg-red-50" : "border-gray-300"
                            }`}
                        />
                        <p className="text-xs text-gray-500">1-52 weeks</p>
                        {errors.durationWeeks && (
                          <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.durationWeeks}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Course Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="5"
                        maxLength="5000"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none ${errors.description ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                        placeholder="Describe your course, what students will learn, teaching methodology..."
                      />
                      <p className="text-xs text-gray-500">
                        {formData.description.length}/5000 characters (minimum 20)
                      </p>
                      {errors.description && (
                        <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Tags <span className="text-red-500">*</span>
                      </label>
                      <div className={`flex flex-wrap gap-2 rounded-lg border px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition ${errors.tags ? "border-red-300 bg-red-50" : "border-gray-300"
                        }`}>
                        {formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-1 rounded-full"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="text-indigo-600 hover:text-indigo-800 transition"
                              aria-label={`Remove ${tag} tag`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleTagKeyDown}
                          onBlur={handleTagBlur}
                          placeholder={
                            formData.tags.length ? "Add another tag" : "Type a tag and press space"
                          }
                          className="flex-1 min-w-[120px] border-none focus:outline-none focus:ring-0 text-sm py-1 bg-transparent"
                          maxLength="50"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Press space, enter, or comma to add a tag. Max 50 characters per tag. (1-10 tags required)
                      </p>
                      {errors.tags && (
                        <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.tags}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {activeTab === "details" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        What Students Will Learn (Optional)
                      </label>
                      <textarea
                        name="whatYouWillLearn"
                        value={formData.whatYouWillLearn}
                        onChange={handleInputChange}
                        rows="4"
                        maxLength="5000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                        placeholder="• Master basic dance steps&#10;• Understand rhythm and expressions&#10;• Learn traditional poses&#10;• Develop performance confidence"
                      />
                      <p className="text-xs text-gray-500">
                        List key learning outcomes (optional)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Requirements (Optional)
                      </label>
                      <textarea
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleInputChange}
                        rows="3"
                        maxLength="5000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                        placeholder="• Comfortable clothing&#10;• Space to move freely&#10;• No prior experience needed"
                      />
                      <p className="text-xs text-gray-500">
                        List any prerequisites or materials needed (optional)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Course Language
                      </label>
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Nepali">Nepali</option>
                        <option value="Both English & Hindi">Both English & Hindi</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="border-t bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleSaveDraft}
                  disabled={isSubmitting || isUploading}
                  className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save as Draft
                    </>
                  )}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isUploading}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Eye className="w-5 h-5" />
                      Publish Course
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video detail modal */}
      <VideoDetailUpload
        video={currentEditingVideo}
        isOpen={videoDetailOpen}
        onClose={() => {
          setVideoDetailOpen(false);
          setCurrentEditingVideo(null);
        }}
        onSave={(updatedData) => {
          setVideos((prev) =>
            prev.map((v) =>
              v.id === updatedData.id
                ? {
                  ...v,
                  title: updatedData.title,
                  description: updatedData.description,
                  thumbnailUrl: updatedData.thumbnailUrl,
                  thumbnailFile: updatedData.thumbnailFile,
                }
                : v
            )
          );
          setVideoDetailOpen(false);
          setCurrentEditingVideo(null);
        }}
        isSaving={isSubmitting}
      />

    </div>
  )
};