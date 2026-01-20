import React from "react";
import { motion } from "framer-motion";
import { Star, Users, MapPin, ArrowRight } from "lucide-react";
import { teachers } from "../../data/homeData";
import { Link } from "react-router-dom";

const TeacherCard = ({ teacher, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group bg-white border border-gray-200 overflow-hidden h-[280px] flex">
      {/* Image Section - 40% width */}
      <div className="w-2/5 relative bg-gray-100 overflow-hidden">
        <motion.img
          src={teacher.imagePath}
          alt={teacher.name}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Rating Badge */}
        <div className="absolute top-4 left-4 bg-white px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-lg">
          <Star className="w-3.5 h-3.5 text-red-600 fill-red-600" />
          {teacher.rating}
        </div>

        {/* Specialty Label at Bottom */}
        <div className="absolute bottom-4 left-4 right-4">
          <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-wide">
            {teacher.specialty.split("&")[0].trim()}
          </span>
        </div>
      </div>

      {/* Content Section - 60% width */}
      <div className="w-3/5 p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
            {teacher.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {teacher.bio}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{teacher.students}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>Online</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <span className="block text-xs text-gray-500 mb-1">
              Hourly Rate
            </span>
            <span className="text-lg font-bold text-gray-900">
              {teacher.hourlyRate}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-600 text-white px-5 py-2 text-sm font-bold hover:bg-red-700 transition-colors duration-300">
            View Profile
          </motion.button>
        </div>
      </div>

      {/* Hover Border */}
      <motion.div
        className="absolute inset-0 border-2 border-red-600 opacity-0 group-hover:opacity-100 pointer-events-none"
        initial={false}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

const TeacherSection = () => {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl">
            <span className="inline-block text-sm font-bold tracking-wider uppercase text-red-600 mb-3 border-l-4 border-red-600 pl-4">
              Learn from Masters
            </span>
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900">
              Meet Our <span className="text-red-600">Gurus</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Connect with experienced mentors who have dedicated their lives to
              preserving and teaching traditional arts.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <motion.button
              whileHover={{ x: 5 }}
              className="hidden md:flex items-center gap-3 px-6 py-3 bg-red-600 text-white font-bold hover:bg-red-700 transition-colors duration-300 group">
              Find Your Teacher
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {teachers.map((teacher, index) => (
            <TeacherCard key={teacher.id} teacher={teacher} index={index} />
          ))}

          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -8 }}
            className="group bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-red-600 overflow-hidden h-[280px] flex items-center justify-center relative">
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: "40px 40px",
                }}
              />
            </div>

            {/* Red Accent Lines */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100px" }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute top-0 left-0 h-1 bg-red-600"
            />
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: "100px" }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="absolute bottom-0 right-0 w-1 bg-red-600"
            />

            <div className="relative z-10 text-center px-8 max-w-md">
              <h3 className="text-3xl font-bold text-white mb-4">
                Are You a Master Artist?
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Join our community of verified teachers and share your knowledge
                with students globally.
              </p>
              <Link to="/teacher-registration">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-red-600 text-white px-8 py-3 font-bold hover:bg-red-700 transition-colors duration-300 shadow-xl">
                  Apply to Teach
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Mobile CTA */}
        <motion.div
          className="md:hidden mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}>
          <button className="flex w-full items-center justify-center gap-2 py-4 bg-red-600 text-white font-bold hover:bg-red-700 transition-colors">
            Find Your Teacher
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default TeacherSection;
