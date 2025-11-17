"use client";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarTrigger,
} from "../ui/sidebar";
import { PanelLeftIcon } from "lucide-react";

export function TeamSwitcher({ teams }) {
  const { isMobile, state } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);
  
  if (!activeTeam) return null;
  
  const isCollapsed = state === "collapsed";
  
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2 w-full">
          {/* Main dropdown trigger - only show when NOT collapsed */}
          {!isCollapsed && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex-1">
                  <div className="flex items-center gap-3 w-full">
                    {/* Logo */}
                    <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
                      <img
                        src={activeTeam.logo}
                        alt={activeTeam.name}
                        className="h-6 w-6 object-contain"
                      />
                    </div>
                    {/* Text */}
                    <div className="grid text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {activeTeam.name}
                      </span>
                      <span className="truncate text-xs">{activeTeam.plan}</span>
                    </div>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            </DropdownMenu>
          )}
          {/* Sidebar trigger - only show when NOT collapsed */}
          {!isCollapsed && (
            <SidebarTrigger className="w-9 h-9 p-2 rounded-xl hover:bg-sidebar-accent transition [&_svg]:w-5 [&_svg]:h-5" ><PanelLeftIcon/></SidebarTrigger>
          )}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}