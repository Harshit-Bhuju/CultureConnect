import React from "react";
import { Truck, CreditCard, DollarSign, Clock } from "lucide-react";
import "./Footer.css";
import Facebook from "../../assets/brands-logo/facebook.svg";
import Instagram from "../../assets/brands-logo/instagram.svg";
import Twitter from "../../assets/brands-logo/twitter.svg";
import Youtube from "../../assets/brands-logo/youtube.svg";
import { NavLink } from "react-router-dom";

const socialLinks = [
  { icon: Facebook },
  { icon: Instagram },
  { icon: Twitter },
  { icon: Youtube },
];

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Marketplace", href: "/marketplace/traditional" },
  { name: "Learn culture", href: "/learnculture/dances" },
  { name: "Contact Us", href: "" },
  { name: "Our Team", href: "" },
];

export default function Footer() {
  return (
    <div className=" bg-gray-50 ">
      {/* Features Section */}
      <section className="py-10 px-4 bg-white hidden md:block">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 gap-8">
            {/* Fast & Free Delivery */}
            <div className="flex flex-col items-center text-center side-border">
              <div className="mb-4">
                <Truck className="w-12 h-12 text-gray-700" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                Fast & Free Delivery
              </h3>
            </div>

            {/* Secure Payment */}
            <div className="flex flex-col items-center text-center side-border">
              <div className="mb-4">
                <CreditCard
                  className="w-12 h-12 text-gray-700"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                Secure Payment
              </h3>
            </div>

            {/* Money Back Guarantee */}
            <div className="flex flex-col items-center text-center side-border">
              <div className="mb-4">
                <DollarSign
                  className="w-12 h-12 text-gray-700"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                Money Back Guarantee
              </h3>
            </div>

            {/* Online Support */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <Clock className="w-12 h-12 text-gray-700" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                Online Support
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-black text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Links */}

          <nav className="flex justify-center gap-4 md:gap-8 mb-6 flex-wrap">
            {navLinks.map((link, index) =>
              link.href ? (
                <NavLink
                  key={index}
                  to={link.href}
                  className={({ isActive }) =>
                    `text-sm transition-colors ${
                      isActive
                        ? "text-red-600 font-semibold"
                        : "text-gray-300 hover:text-white"
                    }`
                  }>
                  {link.name}
                </NavLink>
              ) : (
                <span
                  key={index}
                  className="text-gray-300 text-sm cursor-pointer">
                  {link.name}
                </span>
              )
            )}
          </nav>

          {/* Social Media Icons */}
          <div className="flex justify-center gap-4 mb-6">
            {socialLinks.map((social, index) => (
              <div
                key={index} // Add key here
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                <img
                  src={social.icon}
                  alt={social.label || `social-${index}`}
                  className="w-5 h-5"
                />
              </div>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-400 text-sm">
            Copyright ©2025; Designed by{" "}
            <span className="text-white">Uranus</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
