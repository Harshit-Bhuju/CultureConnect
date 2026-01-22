import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ShoppingBag,
  BarChart3,
  X,
  PanelLeftIcon,
  ChevronsUpDown,
  LogOut,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import CultureConnectLogo from "../../assets/logo/cultureconnect__fav.png";
import { useAuth } from "../../context/AuthContext";
import default_logo from "../../assets/default-image.jpg";
import toast from "react-hot-toast";

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Load collapsed state from localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved ? JSON.parse(saved) : false;
  });

  const userData = user || {
    name: "Admin",
    email: "admin@cultureconnect.com",
    avatar: default_logo,
    role: "admin"
  };

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      path: "/admin/overview",
    },
    {
      id: "teachers",
      label: "Teacher Approvals",
      icon: GraduationCap,
      path: "/admin/teachers",
    },
    {
      id: "users",
      label: "User Management",
      icon: Users,
      path: "/admin/users",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      path: "/admin/analytics",
    },
  ];

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Keyboard shortcut for toggle (Ctrl/Cmd + B)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        if (!isMobile) {
          toggleCollapse();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobile, isCollapsed]);

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className="group peer text-sidebar-foreground md:block"
        data-state={isCollapsed ? "collapsed" : "expanded"}
        data-collapsible={isCollapsed ? "icon" : ""}
        style={{
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "3rem",
        }}>
        
        {/* Sidebar Gap (for desktop layout) - creates space for fixed sidebar */}
        <div
          className="hidden md:block relative bg-transparent transition-[width] duration-200 ease-linear"
          style={{
            width: isCollapsed ? "3rem" : "16rem",
          }}
        />

        {/* Sidebar */}
        <div
          className={`
            fixed md:fixed inset-y-0 left-0 z-50 md:z-10
            h-screen
            transition-[left,width] duration-200 ease-linear
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            border-r border-sidebar-border
          `}
          style={{
            width: isMobile ? "18rem" : isCollapsed ? "3rem" : "16rem",
          }}>
          
          {/* Sidebar Inner */}
          <div className="bg-sidebar flex h-full w-full flex-col">
            
            {/* COLLAPSED VIEW */}
            {isCollapsed && !isMobile && (
              <>
                {/* Header - Logo */}
                <div className="flex items-center justify-center p-2 border-b border-sidebar-border h-[60px]">
                  <button
                    onClick={toggleCollapse}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-sidebar-accent transition-all duration-200"
                    title="Expand Sidebar (Ctrl+B)">
                    <img
                      src={CultureConnectLogo}
                      alt="CultureConnect"
                      className="h-5 w-5 object-contain"
                    />
                  </button>
                </div>

                {/* Content - Menu Icons */}
                <div className="flex-1 flex flex-col items-center py-4 gap-2 overflow-y-auto">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    
                    return (
                      <div key={item.id} className="group/menu-item relative">
                        <NavLink
                          to={item.path}
                          className={`
                            w-8 h-8 flex items-center justify-center rounded-md
                            transition-all duration-200
                            hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
                            ${active ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                          `}
                          title={item.label}>
                          <Icon className="w-4 h-4" />
                        </NavLink>
                        
                        {/* Tooltip */}
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md border border-border whitespace-nowrap opacity-0 pointer-events-none group-hover/menu-item:opacity-100 transition-opacity duration-200 z-50">
                          {item.label}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer - User Avatar */}
                <div className="flex items-center justify-center p-2 border-t border-sidebar-border h-[60px]">
                  <div className="group/menu-item relative">
                    <button
                      onClick={toggleCollapse}
                      className="w-8 h-8 rounded-lg overflow-hidden hover:ring-2 hover:ring-sidebar-accent transition-all duration-200"
                      title={`${userData.name}\n${userData.email}\nClick to expand`}>
                      <img
                        src={userData.avatar || default_logo}
                        alt={userData.name}
                        className="h-full w-full object-cover"
                      />
                    </button>

                    {/* Tooltip */}
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-md shadow-md border border-border opacity-0 pointer-events-none group-hover/menu-item:opacity-100 transition-opacity duration-200 z-50 min-w-[180px]">
                      <div className="font-medium">{userData.name || "Admin"}</div>
                      <div className="text-muted-foreground">{userData.email || "admin@cultureconnect.com"}</div>
                      <div className="text-[10px] text-muted-foreground mt-1">Click to expand</div>
                    </div>
                  </div>
                </div>


              </>
            )}

            {/* EXPANDED VIEW */}
            {(!isCollapsed || isMobile) && (
              <>
                {/* Header */}
                <div className="flex flex-col gap-2 p-2 border-b border-sidebar-border min-h-[80px]">
                  <div className="flex items-center justify-between w-full">
                    {/* Team Switcher */}
                    <div className="flex-1">
                      <button className="group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 h-12 text-sm">
                        <div className="flex items-center gap-3 w-full">
                          {/* Logo */}
                          <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden flex-shrink-0 transition-transform duration-200 hover:scale-105">
                            <img
                              src={CultureConnectLogo}
                              alt="CultureConnect"
                              className="h-6 w-6 object-contain"
                            />
                          </div>
                          {/* Text */}
                          <div className="grid text-left text-sm leading-tight flex-1 min-w-0">
                            <span className="truncate font-medium">
                              CultureConnect
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                              Admin Panel
                            </span>
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* Sidebar Trigger - Desktop only */}
                    {!isMobile && (
                      <button
                        onClick={toggleCollapse}
                        className="w-9 h-9 p-2 rounded-xl hover:bg-sidebar-accent transition-all duration-200 flex items-center justify-center flex-shrink-0 group"
                        title="Collapse Sidebar (Ctrl+B)">
                        <PanelLeftIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div 
                  className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden p-2"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}>
                  <style>{`
                    [data-sidebar="content"]::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>

                  {/* Main Menu Group */}
                  <div className="relative flex w-full min-w-0 flex-col">
                    <div className="text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 mb-1">
                      Main Menu
                    </div>
                    
                    {/* Menu Items */}
                    <ul className="flex w-full min-w-0 flex-col gap-1 mt-1">
                      {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        
                        return (
                          <li key={item.id} className="group/menu-item relative">
                            <NavLink
                              to={item.path}
                              onClick={() => {
                                if (isMobile) {
                                  setSidebarOpen(false);
                                }
                              }}
                              className={`
                                peer/menu-button flex items-center w-full gap-2 p-2 text-left overflow-hidden rounded-md outline-hidden ring-sidebar-ring transition-all duration-200
                                hover:bg-sidebar-accent hover:text-sidebar-accent-foreground 
                                focus-visible:ring-2 
                                active:bg-sidebar-accent active:text-sidebar-accent-foreground 
                                disabled:pointer-events-none disabled:opacity-50 
                                aria-disabled:pointer-events-none aria-disabled:opacity-50 
                                [&>svg]:size-4 [&>svg]:shrink-0
                                text-sm
                                ${active ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground" : ""}
                              `}>
                              <Icon className="flex-shrink-0" />
                              <span className="ml-2 truncate flex-1">{item.label}</span>
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col gap-2 p-2 border-t border-sidebar-border">
                  {/* User Menu */}
                  <ul className="flex w-full min-w-0 flex-col gap-1">
                    <li className="group/menu-item relative">
                      <div className="relative">
                        <button
                          onClick={() => setShowUserMenu(!showUserMenu)}
                          className="peer/menu-button flex items-center w-full gap-2 p-2 text-left h-12 overflow-hidden rounded-md outline-hidden ring-sidebar-ring transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0 text-sm">
                          <div className="rounded-lg overflow-hidden flex-shrink-0 h-8 w-8 transition-transform duration-200 hover:scale-105">
                            <img
                              src={userData.avatar || default_logo}
                              alt={userData.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                            <span className="truncate font-medium">
                              {userData.name || "Admin"}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                              {userData.email || "admin@cultureconnect.com"}
                            </span>
                          </div>
                          <ChevronsUpDown className="ml-auto size-4 flex-shrink-0 transition-transform duration-200" />
                        </button>

                        {/* User Dropdown Menu */}
                        {showUserMenu && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setShowUserMenu(false)}
                            />
                            <div
                              className="absolute bottom-full left-0 mb-2 w-[280px] bg-popover text-popover-foreground rounded-lg shadow-md border border-border p-1 z-20 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-200">
                              {/* Current User */}
                              <div className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                  <div className="h-8 w-8 rounded-lg overflow-hidden">
                                    <img
                                      src={userData.avatar || default_logo}
                                      alt={userData.name}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div className="grid flex-1 text-left text-sm leading-tight overflow-hidden">
                                    <span className="truncate font-medium">
                                      {userData.name || "Admin"}
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                      {userData.email || "admin@cultureconnect.com"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="h-px bg-border my-1" />
                              
                              {/* Logout */}
                              <button
                                onClick={handleLogout}
                                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-600 hover:bg-red-50 hover:text-red-700 w-full text-sm">
                                <LogOut className="w-4 h-4 mr-2 text-red-600" />
                                <span className="text-sm">Log out</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;