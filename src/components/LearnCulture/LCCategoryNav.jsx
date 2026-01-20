import React from "react";
import { Link } from "react-router-dom";
import { Music, Palette, Users, BookOpen } from "lucide-react";

const categories = [
  {
    id: "dances",
    title: "Traditional Dances",
    path: "/learnculture/dances",
    icon: Users,
    count: "30+ Masterclasses",
    color: "bg-teal-50 text-teal-600",
  },
  {
    id: "singing",
    title: "Vocal & Singing",
    path: "/learnculture/singing",
    icon: Music,
    count: "45+ Courses",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    id: "instruments",
    title: "Musical Instruments",
    path: "/learnculture/instruments",
    icon: BookOpen,
    count: "60+ Tutorials",
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    id: "art",
    title: "Arts & Crafts",
    path: "/learnculture/art",
    icon: Palette,
    count: "40+ Workshops",
    color: "bg-indigo-50 text-indigo-600",
  },
];

const LCCategoryNav = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
      {categories.map((cat) => {
        const Icon = cat.icon;
        return (
          <Link
            key={cat.id}
            to={cat.path}
            className="group relative w-full sm:w-64 p-8 bg-white/40 backdrop-blur-md rounded-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(20,184,166,0.07)] hover:shadow-[0_8px_32px_0_rgba(20,184,166,0.15)] transition-all duration-500 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${cat.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm`}>
              <Icon size={32} />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-black transition-colors">
              {cat.title}
            </h3>
            <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
              {cat.count}
            </p>

            {/* Animated Underline */}
            <div className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-transparent via-teal-600/20 to-transparent w-0 group-hover:w-full transition-all duration-700 ease-in-out" />

            {/* Subtle Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-white/0 via-teal-100/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
          </Link>
        );
      })}
    </div>
  );
};

export default LCCategoryNav;
