import {
  ChevronsUpDown,
  CreditCard,
  LogOut,
  ChevronRight,
  Plus,
  Trash2,
  X,
  Users,
  Settings2,
  User,
  ShoppingCart,
  UserCheck,
  Clipboard,
  Award,
  FileText,
  GraduationCap,
} from "lucide-react";

import { Avatar, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "../ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

export function NavUser({ user }) {
  const { isMobile } = useSidebar();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-[280px] max-w-[320px] rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            {/* Current User */}
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight overflow-hidden">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                navigate("/following");
              }}
              className="cursor-pointer">
              <UserCheck className="w-4 h-4 mr-2" />
              <span className="text-sm">Following</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Settings */}
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => navigate("/settings")}
                className="cursor-pointer">
                <Settings2 className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            {/* Account Options */}
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => navigate("/cart")}
                className="cursor-pointer">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/mycourses")}
                className="cursor-pointer">
                <GraduationCap className="w-4 h-4 mr-2" />
                My Courses
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-700 cursor-pointer">
              <LogOut className="w-4 h-4 mr-2 text-red-600" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
