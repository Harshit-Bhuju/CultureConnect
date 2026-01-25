import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Globe, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const BecomeSellerSection = () => {
  const { user } = useAuth();
  const isSeller = user?.seller_id;

  return (
    <section className="pb-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gray-900 shadow-2xl">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/Home-Images/Hero_images/arts-hero.png"
              alt="Become a Seller"
              className="w-full h-full object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 md:p-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                type: "spring",
                bounce: 0.2,
              }}
              viewport={{ once: false, margin: "-100px" }}
              className="space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: false }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-heritage-red/20 border border-heritage-red/30 rounded-full text-heritage-red text-sm font-bold uppercase tracking-wider">
                <ShoppingBag size={16} />
                Marketplace Opportunities
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Empower Your <br />
                <span className="text-heritage-red">Craftsmanship</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-300 max-w-lg leading-relaxed">
                Join our elite community of traditional sellers. Showcase your
                unique creations to a global audience and preserve cultural
                heritage through sustainable commerce.
              </motion.p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Global Reach</h4>
                    <p className="text-gray-400 text-sm">
                      Sell to collectors worldwide.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">
                      Secure Payments
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Transparent & reliable payouts.
                    </p>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.7, type: "spring" }}>
                <Link
                  to={
                    isSeller
                      ? `/seller/manageproducts/${user.seller_id}`
                      : "/seller-registration"
                  }>
                  <button className="group px-8 py-4 bg-heritage-red text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-xl shadow-red-900/20 flex items-center gap-2">
                    {isSeller
                      ? "Go to Seller Dashboard"
                      : "Start Your Seller Journey"}
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Visual Grid of Opportunities */}
            <div className="grid grid-cols-2 gap-4 h-full min-h-[500px] [perspective:1000px]">
              <motion.div
                initial={{ opacity: 0, rotateY: -30, scale: 0.9 }}
                whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6 }}
                className="rounded-2xl overflow-hidden shadow-lg border border-white/10 group h-full">
                <img
                  src="/Home-Images/seller/seller 1.png"
                  alt="Clothing Detail"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, rotateX: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, rotateX: 0, scale: 1 }}
                viewport={{ once: false }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="rounded-2xl overflow-hidden shadow-lg border border-white/10 group h-full">
                <img
                  src="/Home-Images/seller/seller 2.png"
                  alt="Instruments Action"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, rotateX: -30, scale: 0.9 }}
                whileInView={{ opacity: 1, rotateX: 0, scale: 1 }}
                viewport={{ once: false }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="rounded-2xl overflow-hidden shadow-lg border border-white/10 group h-full">
                <img
                  src="/Home-Images/seller/seller 3.png"
                  alt="Ritual Item"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, rotateY: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
                viewport={{ once: false }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="rounded-2xl overflow-hidden shadow-lg border border-white/10 group h-full">
                <img
                  src="/Home-Images/seller/selller 4.jpg"
                  alt="Artisan Workspace"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeSellerSection;
