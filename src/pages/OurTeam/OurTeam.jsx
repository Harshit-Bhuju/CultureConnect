import React, { useEffect } from "react";
import {
  Code2,
  Database,
  Layout as LayoutIcon,
  Server,
  Cpu,
  Palette,
  Github,
  Linkedin,
  Mail,
  Zap,
} from "lucide-react";
import Navbar from "../../components/Layout/NavBar";
import Footer from "../../components/Layout/Footer";
import { SidebarProvider, SidebarInset } from "../../components/ui/sidebar";
import AppSidebar from "../../components/Layout/app-sidebar";

// Image imports (using the generated images)
import HarshitImg from "../../assets/team/harshit_portrait.png";
import HarmanImg from "../../assets/team/harman_portrait.png";

const TeamMember = ({
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
    className={`flex flex-col ${isReverse ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12 mb-24`}>
    {/* Image Container */}
    <div className="w-full lg:w-1/2 group relative">
      <div className="absolute -inset-4 bg-gradient-to-r from-heritage-red to-royal-blue rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200 bg-white">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
        />
      </div>
    </div>

    {/* Content Container */}
    <div className="w-full lg:w-1/2 space-y-6">
      <div className="space-y-2">
        <h3 className="text-3xl font-bold text-gray-900">{name}</h3>
        <p className="text-xl font-semibold text-royal-blue">{role}</p>
      </div>

      <p className="text-gray-600 text-lg leading-relaxed">{description}</p>

      <div className="space-y-4">
        <h4 className="font-bold text-gray-900 flex items-center gap-2">
          <Zap className="w-5 h-5 text-heritage-red" />
          Tech Stack
        </h4>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech, idx) => (
            <span
              key={idx}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-royal-blue transition-colors">
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl shadow-sm flex flex-col gap-4">
        <div>
          <h4 className="font-bold text-gray-900 mb-2">Project Role</h4>
          <p className="text-gray-600 italic">"{projectRole}"</p>
        </div>
        <div className="pt-4 border-t border-gray-100 flex items-center gap-4">
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-royal-blue hover:text-heritage-red transition-colors font-medium">
            <Mail className="w-5 h-5" />
            {email}
          </a>
        </div>
      </div>
    </div>
  </div>
);

const OurTeam = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-white">
        <Navbar />

        <main className="min-h-screen">
          {/* Hero Section */}
          <section className="relative py-24 px-6 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-[0.03]">
              <div className="absolute top-10 left-10 w-64 h-64 bg-royal-blue rounded-full blur-[100px]"></div>
              <div className="absolute bottom-10 right-10 w-96 h-96 bg-heritage-red rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-4xl mx-auto text-center space-y-8">
              <span className="px-4 py-2 bg-royal-blue/10 text-royal-blue rounded-full text-sm font-bold tracking-wider uppercase">
                The Builders
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
                Meet the Minds Behind the{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-heritage-red to-royal-blue">
                  Magic
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                We're a dynamic duo of brothers passionate about building
                seamless digital experiences. Together, we combine cutting-edge
                frontend design with powerful backend functionality to create
                websites that don't just look good—they work flawlessly.
              </p>
            </div>
          </section>

          {/* Team Members Section */}
          <section className="py-20 px-6 bg-gray-50/30">
            <div className="max-w-6xl mx-auto">
              <TeamMember
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

              <TeamMember
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
          </section>

          {/* CTA Section */}
          <section className="py-24 px-6">
            <div className="max-w-4xl mx-auto bg-gray-900 rounded-3xl p-12 text-center text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                <Code2 size={120} />
              </div>
              <h2 className="text-4xl font-bold mb-6">Want to work with us?</h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                Whether you have a question or a project proposal, we're always
                open to connecting with fellow digital enthusiasts.
              </p>
              <button
                onClick={() =>
                  (window.location.href =
                    "https://mail.google.com/mail/?view=cm&fs=1&to=cultureconnect0701@gmail.com")
                }
                className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center gap-2 mx-auto active:scale-95 shadow-xl shadow-white/10">
                <Mail className="w-5 h-5" />
                Contact the Duo
              </button>
            </div>
          </section>
        </main>

        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default OurTeam;
