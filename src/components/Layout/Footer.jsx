import React from "react";
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
          <footer className="bg-black text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">

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
