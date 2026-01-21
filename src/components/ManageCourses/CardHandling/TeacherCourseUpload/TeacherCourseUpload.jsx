import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tag, Save, Eye, Info, Loader2 } from "lucide-react";
import VideoDetailUpload from "./VideoDetailUpload";
import CourseUploadHeader from "./CourseUploadHeader";
import MediaUploadSection from "./MediaUploadSection";
import BasicInfoForm from "./BasicInfoForm";
import AdditionalInfoForm from "./AdditionalInfoForm";
import PublishCourseModal from "../../Modals/PublishCourseModal";
import toast from "react-hot-toast";
import API from "../../../../Configs/ApiEndpoints";

// Helper function to get video duration
function getVideoDuration(file) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(Math.floor(video.duration));
    };
    video.onerror = () => {
      resolve(0); // Return 0 if can't read duration
    };
    video.src = URL.createObjectURL(file);
  });
}

// Helper to format duration (seconds to HH:MM:SS or MM:SS)
function formatDuration(seconds) {
  if (!seconds || seconds === 0) return "0:00";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Helper to convert seconds to hours and minutes
function secondsToHoursMinutes(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return { hours, minutes };
}

// Main Course Upload Component
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
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [currentEditingVideo, setCurrentEditingVideo] = useState(null);
  const [courseThumbnailFile, setCourseThumbnailFile] = useState(null);
  const [courseThumbnailUrl, setCourseThumbnailUrl] = useState(null);
  const navigate = useNavigate();
  const { teacherId } = useParams();
  const [submissionType, setSubmissionType] = useState(null); // 'publish' or 'draft'

  const [formData, setFormData] = useState({
    courseTitle: "",
    category: "",
    skillLevel: "",
    price: "",
    recommendedWeeks: "",
    hoursPerWeek: "",
    accessDuration: "lifetime",
    description: "",
    tags: [],
    whatYouWillLearn: "",
    requirements: "",
    learningSchedule: "",
    language: "English",
  });

  const [tagInput, setTagInput] = useState("");

  // Calculate total video duration
  const getTotalVideoDuration = () => {
    return videos.reduce((total, vid) => total + (vid.duration || 0), 0);
  };

  const totalDurationSeconds = getTotalVideoDuration();
  const { hours: totalHours, minutes: totalMinutes } =
    secondsToHoursMinutes(totalDurationSeconds);

  useEffect(() => {
    return () => {
      videos.forEach((vid) => {
        if (vid.url) URL.revokeObjectURL(vid.url);
      });
      if (courseThumbnailUrl) URL.revokeObjectURL(courseThumbnailUrl);
    };
  }, []);

  useEffect(() => {
    if (selectedVideo > videos.length - 1 && videos.length > 0) {
      setSelectedVideo(videos.length - 1);
    } else if (videos.length === 0) {
      setSelectedVideo(0);
    }
  }, [videos.length, selectedVideo]);

  const handleVideoUpload = useCallback(async (e) => {
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

      const newVideos = await Promise.all(
        validFiles.map(async (file) => {
          const duration = await getVideoDuration(file);
          return {
            id: `${Date.now()}-${Math.random()}`,
            url: URL.createObjectURL(file),
            file,
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
            duration: duration,
            durationFormatted: formatDuration(duration),
            title: file.name.replace(/\.[^/.]+$/, ""),
            description: "",
          };
        }),
      );

      setVideos((prev) => {
        const total = [...prev, ...newVideos];
        if (total.length > 20) {
          toast.error("Maximum 20 videos allowed");
          total.slice(20).forEach((vid) => {
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
      console.error("Error uploading videos:", error);
      toast.error("Failed to process videos");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }, []);

  const removeVideo = useCallback((id) => {
    setVideos((prev) => {
      const removedIndex = prev.findIndex((v) => v.id === id);
      const vid = prev[removedIndex];

      if (vid && vid.url) URL.revokeObjectURL(vid.url);

      const newVideos = prev.filter((v) => v.id !== id);

      setSelectedVideo((current) => {
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
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback((dropIndex) => {
    const dragIndex = draggedIndexRef.current;
    if (dragIndex === null || dragIndex === dropIndex) return;

    setVideos((prev) => {
      const newVids = [...prev];
      const [moved] = newVids.splice(dragIndex, 1);
      newVids.splice(dropIndex, 0, moved);

      setSelectedVideo((current) => {
        if (current === dragIndex) return dropIndex;
        if (current === dropIndex)
          return dragIndex < dropIndex ? current + 1 : current - 1;
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
      setErrors((prev) => ({
        ...prev,
        tags: "Tag must be less than 50 characters",
      }));
      return;
    }

    setFormData((prev) => {
      if (prev.tags.includes(tag)) {
        setErrors((prevErr) => ({ ...prevErr, tags: "Tag already exists" }));
        return prev;
      }

      if (prev.tags.length >= 10) {
        setErrors((prevErr) => ({
          ...prevErr,
          tags: "Maximum 10 tags allowed",
        }));
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

  const handleTagKeyDown = useCallback(
    (e) => {
      if (e.key === " " || e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        commitTag(tagInput);
      } else if (e.key === "Backspace" && !tagInput && formData.tags.length) {
        e.preventDefault();
        setFormData((prev) => ({ ...prev, tags: prev.tags.slice(0, -1) }));
      }
    },
    [tagInput, formData.tags, commitTag],
  );

  const handleTagBlur = useCallback(() => {
    if (tagInput.trim()) {
      commitTag(tagInput);
    }
  }, [tagInput, commitTag]);

  const removeTag = useCallback((tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  }, []);

  const handleCourseThumbnailChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file for course thumbnail");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Course thumbnail must be under 5MB");
        return;
      }

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
      e.target.value = "";
    },
    [courseThumbnailUrl],
  );

  const removeCourseThumbnail = useCallback(() => {
    if (courseThumbnailUrl) {
      URL.revokeObjectURL(courseThumbnailUrl);
    }
    setCourseThumbnailFile(null);
    setCourseThumbnailUrl(null);
  }, [courseThumbnailUrl]);

  const validateForPublish = useCallback(() => {
    const newErrors = {};

    if (!videos.length) {
      newErrors.videos = "Please upload at least one course video.";
    }

    const videosWithoutTitle = videos.filter((v) => !v.title?.trim());
    const videosWithoutDescription = videos.filter(
      (v) => !v.description?.trim(),
    );
    const videosWithoutThumbnail = videos.filter(
      (v) => !(v.thumbnailUrl || v.thumbnailFile || v.thumbnail),
    );

    if (videosWithoutTitle.length > 0) {
      newErrors.videos = `${videosWithoutTitle.length} video(s) missing title.`;
    } else if (videosWithoutDescription.length > 0) {
      newErrors.videos = `${videosWithoutDescription.length} video(s) missing description.`;
    } else if (videosWithoutThumbnail.length > 0) {
      newErrors.videos = `${videosWithoutThumbnail.length} video(s) missing thumbnail.`;
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
    }

    if (!formData.skillLevel) {
      newErrors.skillLevel = "Select a skill level.";
    }

    if (formData.price) {
      const priceNum = Number(formData.price);
      if (isNaN(priceNum) || priceNum < 0) {
        newErrors.price = "Enter a valid price (0 or greater).";
      } else if (priceNum > 999999999) {
        newErrors.price = "Price must not exceed 999,999,999.";
      }
    }

    if (!formData.recommendedWeeks) {
      newErrors.recommendedWeeks = "Required.";
    } else {
      const weeks = Number(formData.recommendedWeeks);
      if (isNaN(weeks) || weeks < 1) {
        newErrors.recommendedWeeks = "Min 1 week.";
      } else if (weeks > 52) {
        newErrors.recommendedWeeks = "Max 52 weeks.";
      }
    }

    if (!formData.hoursPerWeek) {
      newErrors.hoursPerWeek = "Required.";
    } else {
      const hours = Number(formData.hoursPerWeek);
      if (isNaN(hours) || hours < 1) {
        newErrors.hoursPerWeek = "Min 1 hour.";
      } else if (hours > 40) {
        newErrors.hoursPerWeek = "Max 40 hours.";
      }
    }

    const descTrimmed = formData.description.trim();
    if (!descTrimmed) {
      newErrors.description = "Description is required.";
    } else if (descTrimmed.length < 20) {
      newErrors.description = "Min 20 characters.";
    }

    if (!formData.whatYouWillLearn?.trim()) {
      newErrors.whatYouWillLearn = "Required.";
    }

    if (!formData.requirements?.trim()) {
      newErrors.requirements = "Required.";
    }

    if (!formData.learningSchedule?.trim()) {
      newErrors.learningSchedule = "Required.";
    }

    if (!(courseThumbnailFile || courseThumbnailUrl)) {
      newErrors.courseThumbnail = "Course thumbnail is required.";
    }

    if (formData.tags.length === 0) {
      newErrors.tags = "Add at least one tag.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [videos, formData, courseThumbnailFile, courseThumbnailUrl]);

  const validateForDraft = useCallback(() => {
    const newErrors = {};

    // Draft Requirements: Title + 1 Video + Logic validity
    if (!videos.length) {
      newErrors.videos = "Upload at least one video for draft.";
    }

    if (!formData.courseTitle.trim()) {
      newErrors.courseTitle = "Course title is required.";
    }

    // Logic checks (fields not required, but if present must be valid)
    if (formData.price) {
      const priceNum = Number(formData.price);
      if (isNaN(priceNum) || priceNum < 0) {
        newErrors.price = "Invalid price.";
      }
    }

    if (formData.recommendedWeeks) {
      const weeks = Number(formData.recommendedWeeks);
      if (isNaN(weeks) || weeks < 1 || weeks > 52) {
        newErrors.recommendedWeeks = "Invalid weeks (1-52).";
      }
    }

    if (formData.hoursPerWeek) {
      const hours = Number(formData.hoursPerWeek);
      if (isNaN(hours) || hours < 1 || hours > 40) {
        newErrors.hoursPerWeek = "Invalid hours (1-40).";
      }
    }

    if (formData.description && formData.description.length > 5000) {
      newErrors.description = "Description too long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [videos, formData]);

  const handlePublishClick = useCallback(() => {
    if (!validateForPublish()) {
      const errorCount = Object.keys(errors).length || "multiple";
      toast.error(`Please fix ${errorCount} validation errors`);
      // Optionally verify if we need to switch tabs to show errors
      const basicInfoErrors = [
        "courseTitle",
        "category",
        "skillLevel",
        "price",
        "recommendedWeeks",
        "hoursPerWeek",
        "description",
        "tags",
      ];
      const hasBasicErrors = basicInfoErrors.some((key) => errors[key]);
      if (hasBasicErrors && activeTab !== "basic") {
        setActiveTab("basic");
      }
      return;
    }
    setPublishModalOpen(true);
  }, [validateForPublish, errors, activeTab]);

  const confirmPublish = useCallback(async () => {
    if (isSubmitting) return;
    setPublishModalOpen(false);

    setIsSubmitting(true);
    setSubmissionType("publish");
    const toastId = toast.loading("Publishing course...");

    try {
      const fd = new FormData();
      fd.append("courseTitle", formData.courseTitle);
      fd.append("category", formData.category);
      fd.append("skillLevel", formData.skillLevel);
      fd.append("price", formData.price || 0);
      fd.append("durationWeeks", formData.recommendedWeeks);
      fd.append("hoursPerWeek", formData.hoursPerWeek);
      fd.append("accessDuration", formData.accessDuration);
      fd.append("description", formData.description);
      fd.append("whatYouWillLearn", formData.whatYouWillLearn);
      fd.append("requirements", formData.requirements);
      fd.append("learningSchedule", formData.learningSchedule);
      fd.append("language", formData.language || "English");
      fd.append("status", "published");
      fd.append("tags", JSON.stringify(formData.tags));
      fd.append("totalVideoDuration", totalDurationSeconds);

      if (courseThumbnailFile) {
        fd.append("course_thumbnail", courseThumbnailFile);
      }

      videos.forEach((vid, idx) => {
        if (vid.file) fd.append("videos[]", vid.file);
        fd.append("video_titles[]", vid.title || "");
        fd.append("video_descriptions[]", vid.description || "");
        fd.append("video_durations[]", vid.duration || 0);
        if (vid.thumbnailFile) {
          fd.append(`thumbnails[${idx}]`, vid.thumbnailFile);
        }
      });

      const response = await fetch(API.COURSE_UPLOAD, {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Course published successfully!", { id: toastId });
        navigate(`/teacher/manageclasses/${teacherId}`);
      } else {
        throw new Error(data.message || "Failed to publish course");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to publish course", { id: toastId });
    } finally {
      setIsSubmitting(false);
      setSubmissionType(null);
    }
  }, [
    isSubmitting,
    videos,
    formData,
    courseThumbnailFile,
    totalDurationSeconds,
    navigate,
  ]);

  const handleSaveDraft = useCallback(async () => {
    if (isSubmitting) return;

    if (!validateForDraft()) {
      toast.error("Please provide Title and at least 1 Video for draft");
      // Switch to basic tab if title is missing
      if (!formData.courseTitle.trim() && activeTab !== "basic") {
        setActiveTab("basic");
      }
      return;
    }

    setIsSubmitting(true);
    setSubmissionType("draft");
    const toastId = toast.loading("Saving draft...");

    try {
      const fd = new FormData();
      fd.append("courseTitle", formData.courseTitle);
      fd.append("category", formData.category);
      fd.append("skillLevel", formData.skillLevel);
      fd.append("price", formData.price || 0);
      fd.append("durationWeeks", formData.recommendedWeeks || "");
      fd.append("hoursPerWeek", formData.hoursPerWeek || "");
      fd.append("accessDuration", formData.accessDuration);
      fd.append("description", formData.description);
      fd.append("whatYouWillLearn", formData.whatYouWillLearn);
      fd.append("requirements", formData.requirements);
      fd.append("learningSchedule", formData.learningSchedule);
      fd.append("language", formData.language || "English");
      fd.append("status", "draft");
      fd.append("tags", JSON.stringify(formData.tags));
      fd.append("totalVideoDuration", totalDurationSeconds);

      if (courseThumbnailFile) {
        fd.append("course_thumbnail", courseThumbnailFile);
      }

      videos.forEach((vid, idx) => {
        if (vid.file) fd.append("videos[]", vid.file);
        fd.append("video_titles[]", vid.title || "");
        fd.append("video_descriptions[]", vid.description || "");
        fd.append("video_durations[]", vid.duration || 0);
        if (vid.thumbnailFile) {
          fd.append(`thumbnails[${idx}]`, vid.thumbnailFile);
        }
      });

      const response = await fetch(API.COURSE_UPLOAD, {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Draft saved successfully!", { id: toastId });
        navigate(`/teacher/manageclasses/${teacherId}`);
      } else {
        throw new Error(data.message || "Failed to save draft");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to save draft", { id: toastId });
    } finally {
      setIsSubmitting(false);
      setSubmissionType(null);
    }
  }, [
    isSubmitting,
    validateForDraft,
    videos,
    formData,
    courseThumbnailFile,
    totalDurationSeconds,
    activeTab,
    navigate,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <CourseUploadHeader
          onBack={() => navigate(-1)}
          isSubmitting={isSubmitting}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Videos */}
          <div className="space-y-6">
            <MediaUploadSection
              videos={videos}
              selectedVideo={selectedVideo}
              setSelectedVideo={setSelectedVideo}
              isUploading={isUploading}
              handleVideoUpload={handleVideoUpload}
              removeVideo={removeVideo}
              isDragging={isDragging}
              draggedIndexRef={draggedIndexRef}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              handleDragEnd={handleDragEnd}
              onEditVideo={(vid) => {
                setCurrentEditingVideo(vid);
                setVideoDetailOpen(true);
              }}
              courseThumbnailUrl={courseThumbnailUrl}
              courseThumbnailFile={courseThumbnailFile}
              handleCourseThumbnailChange={handleCourseThumbnailChange}
              removeCourseThumbnail={removeCourseThumbnail}
              errors={errors}
              totalHours={totalHours}
              totalMinutes={totalMinutes}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Right Column - Course Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab("basic")}
                  className={`flex-1 py-4 font-semibold flex items-center justify-center gap-2 transition ${
                    activeTab === "basic"
                      ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  <Tag className="w-4 h-4" />
                  Basic Info
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`flex-1 py-4 font-semibold flex items-center justify-center gap-2 transition ${
                    activeTab === "details"
                      ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  <Info className="w-4 h-4" />
                  Details
                </button>
              </div>

              <div className="p-6 space-y-6  overflow-y-auto">
                {activeTab === "basic" && (
                  <BasicInfoForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    errors={errors}
                    tagInput={tagInput}
                    setTagInput={setTagInput}
                    handleTagKeyDown={handleTagKeyDown}
                    handleTagBlur={handleTagBlur}
                    removeTag={removeTag}
                    totalHours={totalHours}
                    totalMinutes={totalMinutes}
                    isSubmitting={isSubmitting}
                  />
                )}

                {activeTab === "details" && (
                  <AdditionalInfoForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    errors={errors}
                    isSubmitting={isSubmitting}
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="border-t bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-4">
                {(!isSubmitting || submissionType === "draft") && (
                  <button
                    onClick={handleSaveDraft}
                    disabled={isSubmitting || isUploading}
                    className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    {submissionType === "draft" ? (
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
                )}
                {(!isSubmitting || submissionType === "publish") && (
                  <button
                    onClick={handlePublishClick}
                    disabled={isSubmitting || isUploading}
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed">
                    {submissionType === "publish" ? (
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Detail Modal */}
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
                : v,
            ),
          );
          setVideoDetailOpen(false);
          setCurrentEditingVideo(null);
          toast.success("Video details updated!");
        }}
        isSaving={isSubmitting}
      />

      {/* Publish Confirmation Modal */}
      {publishModalOpen && (
        <PublishCourseModal
          course={{ title: formData.courseTitle }}
          onClose={() => setPublishModalOpen(false)}
          onPublish={confirmPublish}
        />
      )}
    </div>
  );
}
