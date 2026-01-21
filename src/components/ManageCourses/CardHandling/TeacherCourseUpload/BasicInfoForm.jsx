import React from "react";
import { AlertCircle, Clock, Info, X } from "lucide-react";

export default function BasicInfoForm({
  formData,
  handleInputChange,
  errors,
  tagInput,
  setTagInput,
  handleTagKeyDown,
  handleTagBlur,
  removeTag,
  totalHours,
  totalMinutes,
  isSubmitting,
}) {
  return (
    <>
      {/* Course Title */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Course Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="courseTitle"
          value={formData.courseTitle}
          onChange={handleInputChange}
          disabled={isSubmitting}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
            errors.courseTitle ? "border-red-300 bg-red-50" : "border-gray-300"
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

      {/* Category & Skill Level */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className={`w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${
              errors.category ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}>
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
            disabled={isSubmitting}
            className={`w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${
              errors.skillLevel ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}>
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

      {/* Price */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Price (Rs)
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          disabled={isSubmitting}
          min="0"
          max="999999999"
          placeholder="0 (Free course)"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${
            errors.price ? "border-red-300 bg-red-50" : "border-gray-300"
          }`}
        />
        {errors.price && (
          <p className="text-xs text-red-600 font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.price}
          </p>
        )}
      </div>

      {/* Recommended Completion Time */}
      <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Recommended Completion Time <span className="text-red-500">*</span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <input
              type="number"
              name="recommendedWeeks"
              value={formData.recommendedWeeks}
              onChange={handleInputChange}
              disabled={isSubmitting}
              min="1"
              max="52"
              placeholder="Weeks"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${
                errors.recommendedWeeks
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 bg-white"
              }`}
            />
            <p className="text-xs text-gray-500">1-52 weeks</p>
            {errors.recommendedWeeks && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.recommendedWeeks}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <input
              type="number"
              name="hoursPerWeek"
              value={formData.hoursPerWeek}
              onChange={handleInputChange}
              disabled={isSubmitting}
              min="1"
              max="40"
              placeholder="Hours/week"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${
                errors.hoursPerWeek
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 bg-white"
              }`}
            />
            <p className="text-xs text-gray-500">Study pace</p>
            {errors.hoursPerWeek && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.hoursPerWeek}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white p-3 rounded border border-blue-200">
          <p className="text-xs text-gray-700 flex items-start gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
            <span>
              <strong>Example:</strong> For{" "}
              {totalHours > 0
                ? `${totalHours}h ${totalMinutes} min`
                : totalMinutes > 0
                  ? `${totalMinutes} min`
                  : "-"}{" "}
              {" of video content, recommend "}
              {formData.skillLevel === "beginner"
                ? "8-12"
                : formData.skillLevel === "advanced"
                  ? "4-6"
                  : "6-8"}{" "}
              weeks at 2-3 hours/week for practice and mastery
            </span>
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Course Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          disabled={isSubmitting}
          rows="5"
          maxLength="5000"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none ${
            errors.description ? "border-red-300 bg-red-50" : "border-gray-300"
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

      {/* Tags */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Tags <span className="text-red-500">*</span>
        </label>
        <div
          className={`flex flex-wrap gap-2 rounded-lg border px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition ${
            errors.tags ? "border-red-300 bg-red-50" : "border-gray-300"
          }`}>
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-1 rounded-full">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                disabled={isSubmitting}
                className="text-indigo-600 hover:text-indigo-800 transition disabled:opacity-50">
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
            disabled={isSubmitting}
            placeholder={
              formData.tags.length
                ? "Add another tag"
                : "Type a tag and press space"
            }
            className="flex-1 min-w-[120px] border-none focus:outline-none focus:ring-0 text-sm py-1 bg-transparent"
            maxLength="50"
          />
        </div>
        <p className="text-xs text-gray-500">
          Press space, enter, or comma to add a tag. Max 50 characters per tag.
          (1-10 tags required)
        </p>
        {errors.tags && (
          <p className="text-xs text-red-600 font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.tags}
          </p>
        )}
      </div>
    </>
  );
}
