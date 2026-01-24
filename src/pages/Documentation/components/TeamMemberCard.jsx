import React from "react";
import { Mail, Code2, Briefcase } from "lucide-react";

const TeamMemberCard = ({
  name,
  role,
  description,
  techStack,
  projectRole,
  image,
  email,
  isReverse,
}) => {
  return (
    <div
      className={`flex flex-col ${
        isReverse ? "lg:flex-row-reverse" : "lg:flex-row"
      } gap-12 items-start`}>
      {/* Image Section */}
      <div className="w-full lg:w-2/5">
        <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200">
          <div className="aspect-square">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 border-t border-gray-100">
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white font-medium py-3 rounded-md hover:bg-gray-800 transition-colors">
              <Mail className="w-4 h-4" />
              Contact via Email
            </a>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full lg:w-3/5 space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{name}</h3>
          <p className="text-lg text-gray-600 font-medium">{role}</p>
        </div>

        {/* Description */}
        <div>
          <p className="text-gray-700 leading-relaxed">{description}</p>
        </div>

        {/* Project Role */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
          <div className="flex items-start gap-3">
            <div className="bg-white rounded-md p-2 border border-gray-200">
              <Briefcase className="w-5 h-5 text-gray-700" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">
                Project Contribution
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {projectRole}
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Code2 className="w-5 h-5 text-gray-700" />
            <h4 className="font-semibold text-gray-900">Technical Skills</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:border-gray-400 hover:shadow-sm transition-all">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Email Display */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Email Address</p>
          <p className="text-gray-900 font-medium">{email}</p>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
