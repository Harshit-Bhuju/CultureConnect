import React from "react";
import "./Footer.css";
import Facebook from "../../assets/brands-logo/facebook.svg";
import Instagram from "../../assets/brands-logo/instagram.svg";
import Twitter from "../../assets/brands-logo/twitter.svg";
import Github from "../../assets/brands-logo/github.svg";
import CultureConnectLogo from "../../assets/logo/cultureconnect__fav.png";
import { Link, NavLink } from "react-router-dom";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const socialLinks = [
  { icon: Facebook, label: "Facebook" },
  { icon: Instagram, label: "Instagram" },
  { icon: Twitter, label: "Twitter" },
  {
    icon: Github,
    href: "https://github.com/Harman-Bhuju/CultureConnect",
    label: "Github",
  },
];

export default function Footer() {
  const { user } = useAuth();

  const partnershipLinks = [];
  if (user) {
    if (user.role === "admin") {
      partnershipLinks.push({ name: "Admin Panel", href: "/admin" });
    } else if (user.role === "delivery") {
      partnershipLinks.push({
        name: "Delivery Dashboard",
        href: "/delivery",
      });
    } else {
      // Dynamic links for users, sellers, and experts
      if (user.seller_id) {
        partnershipLinks.push({
          name: "Seller Profile",
          href: `/sellerprofile/${user.seller_id}`,
        });
        partnershipLinks.push({
          name: "Seller Dashboard",
          href: `/seller/manageproducts/${user.seller_id}`,
        });
      } else {
        partnershipLinks.push({
          name: "Become a Seller",
          href: "/seller-registration",
        });
      }

      if (user.teacher_id) {
        partnershipLinks.push({
          name: "Expert Profile",
          href: `/teacherprofile/${user.teacher_id}`,
        });
        partnershipLinks.push({
          name: "Expert Dashboard",
          href: `/teacher/manageclasses/${user.teacher_id}`,
        });
      } else {
        partnershipLinks.push({
          name: "Become an Expert",
          href: "/teacher-registration",
        });
      }
    }
  } else {
    // Guest view
    partnershipLinks.push({
      name: "Become a Seller",
      href: "/seller-registration",
    });
    partnershipLinks.push({
      name: "Become an Expert",
      href: "/teacher-registration",
    });
  }

  const footerCategories = [
    {
      title: "Explore",
      links: [
        { name: "Home", href: "/" },
        { name: "Marketplace", href: "/marketplace" },
        { name: "Traditional Arts", href: "/marketplace/arts_decors" },
        { name: "Musical Instruments", href: "/marketplace/instruments" },
        { name: "Culture Learning", href: "/learnculture" },
      ],
    },
    {
      title: "Partnership",
      links: partnershipLinks,
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/documentation" },
        {
          name: "Contact Us",
          href: "https://mail.google.com/mail/?view=cm&fs=1&to=cultureconnect0701@gmail.com",
          external: true,
        },
        { name: "Developer Team", href: "/documentation/team" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/documentation/privacy" },
        { name: "Terms of Service", href: "/documentation/terms" },
      ],
    },
  ];

  return (
    <footer className="bg-[#0f1115] text-white pt-16 pb-8 px-4 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center backdrop-blur-sm transition-all duration-300">
                <img
                  src={CultureConnectLogo}
                  alt="CultureConnect"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight block">
                  CultureConnect
                </span>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-widest">
                  Heritage Platform
                </span>
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Connecting you with the soul of tradition. Discover authentic
              artifacts, learn cultural arts from masters, and celebrate our
              shared heritage.
            </p>

            <div className="flex gap-4 pt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all duration-300 group"
                  title={social.label}>
                  <img
                    src={social.icon}
                    alt={social.label}
                    className="w-5 h-5 brightness-0 invert group-hover:scale-110 transition-transform"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Links Categories */}
          {footerCategories.map((category, idx) => (
            <div key={idx} className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-white/50">
                {category.title}
              </h4>
              <ul className="space-y-4">
                {category.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-red-500 text-[15px] transition-colors flex items-center gap-1 group">
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-red-500 text-[15px] transition-colors">
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-500 text-xs font-medium">
            Copyright © {new Date().getFullYear()}{" "}
            <span className="text-gray-300">CultureConnect</span>. All rights
            reserved.
          </div>
          <div className="flex items-center gap-6 text-gray-500 text-xs font-medium">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-red-600"></div>
              Developed and Designed by{" "}
              <Link to={"/documentation/team"}>
                <span className="text-gray-300">Harshit & Harman</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
