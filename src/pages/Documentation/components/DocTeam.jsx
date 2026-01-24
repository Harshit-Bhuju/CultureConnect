import React from "react";
import TeamMemberCard from "./TeamMemberCard";
import HarshitImg from "../../../assets/team/harshit_portrait.png";
import HarmanImg from "../../../assets/team/harman_portrait.png";

const DocTeam = () => {
  return (
    <section id="team" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <div className="border-b border-gray-300 pb-6">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Meet the Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              The developers and architects behind the CultureConnect platform.
            </p>
          </div>
        </div>

        {/* Team Members */}
        <div className="space-y-20">
          <TeamMemberCard
            name="Harshit Bhuju"
            role="Frontend Developer & UI Architect"
            description="The creative force behind what users see. Transforms ideas into stunning, interactive interfaces with a focus on usability and modern design aesthetics."
            techStack={[
              "React",
              "JavaScript",
              "Tailwind CSS",
              "C",
              "Bootstrap",
              "HTML5",
              "CSS3",
            ]}
            projectRole="Crafted the entire frontend experience using React with Tailwind, ensuring a smooth, responsive, and visually captivating user interface."
            image={HarshitImg}
            email="harshitbhuju123@gmail.com"
            isReverse={false}
          />

          <div className="border-t border-gray-200"></div>

          <TeamMemberCard
            name="Harman Bhuju"
            role="Backend Developer & Database Engineer"
            description="The powerhouse behind the scenes. Builds robust infrastructure, manages server logic, and secures data to ensure performance and reliability."
            techStack={[
              "PHP",
              "SQL",
              "JavaScript",
              "HTML5",
              "CSS3",
              "Bootstrap",
              "C",
            ]}
            projectRole="Developed the backend architecture with PHP and SQL, creating a solid foundation for data management and server-side functionality."
            image={HarmanImg}
            email="harmanbhuju@gmail.com"
            isReverse={true}
          />
        </div>
      </div>
    </section>
  );
};

export default DocTeam;
