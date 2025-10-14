"use client";

import * as React from "react";
import {
  BookOpen,
  GraduationCap,
  House,
  Settings2,
  Store,
  TrendingUp,
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

export default function AppSidebar({ children, ...props }) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { user } = useAuth();

  // User data is already normalized in AuthContext
  const userData = user || {
    name: "Guest",
    email: "guest@example.com",
    avatar: default_logo,
  };

  console.log("User from AuthContext:", user);

  // Sample data
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
          { title: "Handicrafts & Arts", url: "/marketplace/arts" },
          { title: "Cultural Decorations", url: "/marketplace/decorations" },
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
      {
        title: "Your Activity",
        url: "/activity",
        icon: Settings2,
        items: [
          { title: "General", url: "/activity/general" },
          { title: "Team", url: "/activity/team" },
          { title: "Billing", url: "/activity/billing" },
          { title: "Limits", url: "/activity/limits" },
        ],
      },
    ],
    projects: [
      { name: "Be a Seller/Vendor", url: "/projects/seller", icon: TrendingUp },
      { name: "Be a Teacher", url: "/projects/teacher", icon: GraduationCap },
    ],
  };

  return (
    <div className="flex h-screen">
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader className="flex items-center justify-between">
          <TeamSwitcher teams={data.teams} />
          {isCollapsed && <SidebarTrigger className="w-8 h-8 p-3" />}
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