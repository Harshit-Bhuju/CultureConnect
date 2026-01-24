import React from "react";
import "./Footer.css";
import Facebook from "../../assets/brands-logo/facebook.svg";
import Instagram from "../../assets/brands-logo/instagram.svg";
import Twitter from "../../assets/brands-logo/twitter.svg";
import Github from "../../assets/brands-logo/github.svg";
import { Link, NavLink } from "react-router-dom";

const socialLinks = [
  { icon: Facebook },
  { icon: Instagram },
  { icon: Twitter },
  {
    icon: Github,
    href: "https://github.com/Harman-Bhuju/CultureConnect",
  },
];

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Marketplace", href: "/marketplace" },
  { name: "Learn culture", href: "/learnculture" },
  {
    name: "Contact Us",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=cultureconnect0701@gmail.com",
  },
  { name: "Our Team", href: "/documentation/team" },
];

export default function Footer() {
  return (
    <div className=" bg-gray-50 ">
      <footer className="bg-black text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <nav className="flex justify-center gap-4 md:gap-8 mb-6 flex-wrap">
            {navLinks.map((link, index) => {
              if (!link.href) {
                return (
                  <span
                    key={index}
                    className="text-gray-300 text-sm cursor-pointer">
                    {link.name}
                  </span>
                );
              }

              const isContact = link.name === "Contact Us";
              const className = ({ isActive }) =>
                `text-sm transition-colors ${
                  isActive && !isContact
                    ? "text-red-600 font-semibold"
                    : "text-gray-300 hover:text-white"
                }`;

              if (isContact) {
                return (
                  <a
                    key={index}
                    href={link.href}
                    className={className({ isActive: false })}
                    target="_blank"
                    rel="noopener noreferrer">
                    {link.name}
                  </a>
                );
              }

              return (
                <NavLink key={index} to={link.href} className={className}>
                  {link.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Social Media Icons */}
          <div className="flex justify-center gap-4 mb-6">
            {socialLinks.map((social, index) =>
              social.href ? (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <img
                    src={social.icon}
                    alt={social.label || `social-${index}`}
                    className="w-5 h-5"
                  />
                </a>
              ) : (
                <div
                  key={index}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <img
                    src={social.icon}
                    alt={social.label || `social-${index}`}
                    className="w-5 h-5"
                  />
                </div>
              ),
            )}
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-400 text-sm">
            Copyright ©2026; Designed and Developed by{" "}
            <span className="text-white">Harshit and Harman</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
