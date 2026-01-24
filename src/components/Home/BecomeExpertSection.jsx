import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Star, ArrowRight, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const BecomeExpertSection = () => {
  return (
    <section className="pb-12 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden bg-royal-blue shadow-2xl">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/Home-Images/Hero_images/instruments-hero.png"
              alt="Become an Expert"
              className="w-full h-full object-cover opacity-20 grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-indigo-900 via-indigo-900/60 to-transparent" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 md:p-16 items-center">
            {/* Visual Grid of Experts */}
            <div className="grid grid-cols-2 grid-rows-[auto_1fr] gap-4 h-full min-h-[500px]">
              <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                className="col-span-2 rounded-2xl overflow-hidden shadow-2xl border border-white/20 group relative h-64 md:h-80">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                <img
                  src="/Home-Images/experts/expert 1.png"
                  alt="Online Teaching"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs text-white font-bold uppercase tracking-wider">
                    Online Lessons
                  </span>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl overflow-hidden shadow-xl border border-white/20 group relative h-full">
                <img
                  src="/Home-Images/experts/expert 2.png"
                  alt="Group Workshop"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 z-20">
                  <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-royal-blue shadow-lg">
                    <Users size={16} />
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl overflow-hidden shadow-xl border border-white/20 group relative h-full">
                <img
                  src="/Home-Images/experts/expert 3.png"
                  alt="In-person Session"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-3 right-3 z-20">
                  <span className="px-3 py-1 bg-amber-400 rounded-full text-[10px] text-royal-blue font-black uppercase">
                    Physical
                  </span>
                </div>
              </motion.div>
            </div>

            <div className="lg:order-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 border border-white/30 rounded-full text-white text-sm font-bold uppercase tracking-wider backdrop-blur-sm">
                <BookOpen size={16} />
                Knowledge Exchange
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Share Your <br />
                <span className="text-amber-400">Mastery</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg text-indigo-100 max-w-lg leading-relaxed">
                Connect with passionate learners eager to master traditional
                arts, music, and crafts – both online and in-person. Become a
                verified Expert and pass on your heritage.
              </motion.p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">
                      Global & Local
                    </h4>
                    <p className="text-indigo-200 text-sm">
                      Teach digital or physical classes.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                    <Star size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Recognition</h4>
                    <p className="text-indigo-200 text-sm">
                      Build your digital legacy.
                    </p>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}>
                <Link to="/teacher-registration">
                  <button className="group px-8 py-4 bg-white text-royal-blue font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-900/20 flex items-center gap-2">
                    Become a Verified Expert
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeExpertSection;
