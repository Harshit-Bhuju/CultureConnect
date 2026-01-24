import React from "react";
import { Zap, Mail } from "lucide-react";

const TeamMemberCard = ({
  name,
  role,
  description,
  techStack,
  projectRole,
  image,
  email,
  isReverse,
}) => (
  <div
    className={`flex flex-col ${isReverse ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-8 lg:gap-12`}>
    {/* Image Container */}
    <div className="w-full lg:w-1/2 group relative">
      <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
        />
        {/* Solid color accent bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-heritage-red"></div>
      </div>
    </div>

    {/* Content Container */}
    <div className="w-full lg:w-1/2 space-y-5">
      <div className="space-y-1">
        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">{name}</h3>
        <p className="text-lg font-semibold text-royal-blue">{role}</p>
      </div>

      <p className="text-gray-600 leading-relaxed">{description}</p>

      <div className="space-y-3">
        <h4 className="font-bold text-gray-900 flex items-center gap-2">
          <Zap className="w-5 h-5 text-heritage-red" />
          Tech Stack
        </h4>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-royal-blue hover:bg-royal-blue/5 transition-all duration-200">
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5 bg-white border-2 border-gray-100 rounded-xl shadow-sm">
        <h4 className="font-bold text-gray-900 mb-2">Project Role</h4>
        <p className="text-gray-600 italic text-sm">"{projectRole}"</p>
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center">
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-royal-blue hover:text-heritage-red transition-colors font-medium text-sm">
            <Mail className="w-4 h-4" />
            {email}
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default TeamMemberCard;
