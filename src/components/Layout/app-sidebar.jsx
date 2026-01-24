"use client";

import * as React from "react";
import {
  BookOpen,
  GraduationCap,
  House,
  PanelLeftIcon,
  Store,
  TrendingUp,
  FileText,
  LayoutDashboard,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "../ui/sidebar";
import CultureConnectLogo from "../../assets/logo/cultureconnect__fav.png";
import { useAuth } from "../../context/AuthContext";
import default_logo from "../../assets/default-image.jpg";
import Navbar from "./NavBar";

export default function AppSidebar({ children, ...props }) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { user } = useAuth();

  // User data is already normalized in AuthContext
  const userData = user || {
    name: "Guest",
    email: "guest@example.com",
    avatar: default_logo,
    role: "user",
  };
  // Inside AppSidebar component
  let roleBasedProjects = [];

  if (userData.role === "seller" && userData.seller_id) {
    roleBasedProjects = [
      {
        name: "Seller Profile",
        url: `/sellerprofile/${userData.seller_id}`,
        icon: TrendingUp,
      },
      {
        name: "Be an Expert",
        url: "/teacher-registration",
        icon: GraduationCap,
      },
    ];
  } else if (userData.role === "teacher" && userData.teacher_id) {
    roleBasedProjects = [
      {
        name: "Be a Seller",
        url: "/seller-registration",
        icon: TrendingUp,
      },
      {
        name: "Expert Profile",
        url: `/teacherprofile/${userData.teacher_id}`, // ✅ Use teacher_id when available
        icon: GraduationCap,
      },
    ];
  } else if (
    userData.role === "seller_teacher" &&
    userData.teacher_id &&
    userData.seller_id
  ) {
    roleBasedProjects = [
      {
        name: "Seller Profile",
        url: `/sellerprofile/${userData.seller_id}`, // ✅ FIXED
        icon: TrendingUp,
      },
      {
        name: "Expert Profile",
        url: `/teacherprofile/${userData.teacher_id}`, // ✅ Use teacher_id
        icon: GraduationCap,
      },
    ];
  } else if (userData.role === "user") {
    roleBasedProjects = [
      {
        name: "Be a Seller",
        url: "/seller-registration",
        icon: TrendingUp,
      },
      {
        name: "Be an Expert",
        url: "/teacher-registration",
        icon: GraduationCap,
      },
    ];
  } else if (userData.role === "admin") {
    roleBasedProjects = [
      {
        name: "Admin Panel",
        url: "/admin",
        icon: LayoutDashboard,
      },
    ];
  }

  // Always add Documentation link at the end for all users
  roleBasedProjects.push({
    name: "Documentation",
    url: "/documentation",
    icon: FileText,
  });

  const data = {
    user: userData,
    teams: [
      {
        name: "CultureConnect",
        logo: CultureConnectLogo,
        plan: "Enterprise",
        disabled: true,
      },
    ],
    navMain: [
      { title: "Home", url: "/", icon: House, isActive: true },
      {
        title: "Marketplace",
        url: "/marketplace",
        icon: Store,
        items: [
          { title: "Traditional Clothing", url: "/marketplace/traditional" },
          { title: "Musical Instruments", url: "/marketplace/instruments" },
          { title: "Arts & Decors", url: "/marketplace/arts_decors" },
        ],
      },
      {
        title: "Learn Culture",
        url: "/learnculture",
        icon: BookOpen,
        items: [
          { title: "Cultural Dances", url: "/learnculture/dances" },
          { title: "Cultural Singing", url: "/learnculture/singing" },
          { title: "Musical Instruments", url: "/learnculture/instruments" },
          { title: "Cultural Art & Crafts", url: "/learnculture/art" },
        ],
      },
    ],
    projects: roleBasedProjects,
  };

  return (
    <div className="flex h-screen">
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader className="flex items-center justify-between">
          <TeamSwitcher teams={data.teams} />
          {isCollapsed && (
            <SidebarTrigger className="w-8 h-8 p-3">
              <PanelLeftIcon />
            </SidebarTrigger>
          )}
        </SidebarHeader>

        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavProjects projects={data.projects} />
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      {/* Main content area */}
    </div>
  );
}
