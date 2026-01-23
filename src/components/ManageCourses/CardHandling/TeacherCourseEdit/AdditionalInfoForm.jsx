import React from "react";

import { AlertCircle } from "lucide-react";

export default function AdditionalInfoForm({
  formData,
  handleInputChange,
  errors,
}) {
  return (
    <>
      {/* What Students Will Learn */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          What Students Will Learn <span className="text-red-500">*</span>
        </label>
        <textarea
          name="whatYouWillLearn"
          value={formData.whatYouWillLearn}
          onChange={handleInputChange}
          rows="4"
          maxLength="5000"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition ${errors?.whatYouWillLearn
              ? "border-red-300 bg-red-50"
              : "border-gray-300"
            }`}
          placeholder="• Master basic dance steps&#10;• Understand rhythm and expressions&#10;• Learn traditional poses&#10;• Develop performance confidence"
        />
        {errors?.whatYouWillLearn && (
          <p className="text-xs text-red-600 font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.whatYouWillLearn}
          </p>
        )}
        <p className="text-xs text-gray-500">List key learning outcomes</p>
      </div>

      {/* Requirements */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Requirements <span className="text-red-500">*</span>
        </label>
        <textarea
          name="requirements"
          value={formData.requirements}
          onChange={handleInputChange}
          rows="3"
          maxLength="5000"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition ${errors?.requirements
              ? "border-red-300 bg-red-50"
              : "border-gray-300"
            }`}
          placeholder="• Comfortable clothing&#10;• Space to move freely&#10;• No prior experience needed"
        />
        {errors?.requirements && (
          <p className="text-xs text-red-600 font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.requirements}
          </p>
        )}
        <p className="text-xs text-gray-500">
          List any prerequisites or materials needed
        </p>
      </div>

      {/* Learning Schedule */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Suggested Learning Schedule <span className="text-red-500">*</span>
        </label>
        <textarea
          name="learningSchedule"
          value={formData.learningSchedule}
          onChange={handleInputChange}
          rows="5"
          maxLength="2000"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition ${errors?.learningSchedule
              ? "border-red-300 bg-red-50"
              : "border-gray-300"
            }`}
          placeholder="Week 1: Videos 1-3 - Basic footwork&#10;Week 2: Videos 4-6 - Rhythm exercises&#10;Week 3: Videos 7-10 - Combining steps&#10;Week 4: Videos 11-15 - Performance practice"
        />
        {errors?.learningSchedule && (
          <p className="text-xs text-red-600 font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.learningSchedule}
          </p>
        )}
        <p className="text-xs text-gray-500">
          Help students plan their learning journey with a week-by-week
          breakdown
        </p>
      </div>

      {/* Language */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Course Language
        </label>
        <select
          name="language"
          value={formData.language}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
          <option value="English">English</option>
          <option value="Nepali">Nepali</option>
          <option value="Newari">Newari</option>
          <option value="Tamang">Tamang</option>
          <option value="Maithali">Maithali</option>
          <option value="Tharu">Tharu</option>
          <option value="Bhojpuri">Bhojpuri</option>
          <option value="Both English & Nepali">Both English & Nepali</option>
        </select>
      </div>
    </>
  );
}
