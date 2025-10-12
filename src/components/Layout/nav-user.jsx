import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  ChevronRight,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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
  const [showMobileModal, setShowMobileModal] = useState(false);

  // Mock data for other logged-in accounts
  // Replace this with your actual stored accounts
  const [otherAccounts, setOtherAccounts] = useState([
    {
      id: "2",
      name: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.j@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.d@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    },
  ]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setShowMobileModal(false);
    };
    if (showMobileModal) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showMobileModal]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSwitchAccount = (account) => {
    toast.success(`Switched to ${account.name}`);
    setShowMobileModal(false);
    // Implement your account switching logic here
  };

  const handleRemoveAccount = (accountId, accountName, e) => {
    e.stopPropagation();
    setOtherAccounts(otherAccounts.filter((acc) => acc.id !== accountId));
    toast.success(`Removed ${accountName} from saved accounts`);
    // Implement your account removal logic here
  };

  const handleAddAccount = () => {
    toast.success("Redirecting to add account...");
    setShowMobileModal(false);
    navigate("/login?addAccount=true");
  };

  const handleOtherAccountsClick = () => {
    if (isMobile) {
      setShowMobileModal(true);
    }
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
                <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
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
                  <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight overflow-hidden">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Other Accounts Dropdown - Shows all accounts */}
            {otherAccounts.length > 0 && (
              <>
                {isMobile ? (
                  <DropdownMenuItem onClick={handleOtherAccountsClick} className="cursor-pointer">
                    <span className="text-sm">Other Accounts</span>
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer">
                      <span className="text-sm">Other Accounts</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="min-w-[280px] max-w-[320px] p-1">
                      <DropdownMenuLabel className="text-xs font-semibold">Switch Accounts</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {otherAccounts.map((account) => (
                        <DropdownMenuItem
                          key={account.id}
                          onClick={() => handleSwitchAccount(account)}
                          className="cursor-pointer p-0 mb-1">
                          <div className="flex items-center gap-2 w-full px-2 py-1.5">
                            <Avatar className="h-7 w-7 rounded-lg flex-shrink-0">
                              <AvatarImage src={account.avatar} alt={account.name} />
                              <AvatarFallback>{account.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight overflow-hidden min-w-0">
                              <span className="truncate font-medium text-xs">{account.name}</span>
                              <span className="truncate text-xs text-muted-foreground">{account.email}</span>
                            </div>
                            <button
                              onClick={(e) => handleRemoveAccount(account.id, account.name, e)}
                              className="flex-shrink-0 p-1 hover:bg-red-50 rounded transition-colors"
                              aria-label="Remove account">
                              <Trash2 size={16} className="text-red-600" />
                            </button>
                          </div>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleAddAccount} className="cursor-pointer">
                        <Plus className="w-4 h-4 mr-2" />
                        <span className="text-sm">Add Account</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}
                <DropdownMenuSeparator />
              </>
            )}

            {/* Add Account Option */}
            <DropdownMenuItem onClick={handleAddAccount} className="cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              <span className="text-sm">Add Account</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Settings */}
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
                <Sparkles className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            {/* Account Options */}
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <BadgeCheck className="w-4 h-4 mr-2" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <CreditCard className="w-4 h-4 mr-2" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
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

      {/* Mobile Modal for Other Accounts */}
      {isMobile && showMobileModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
            onClick={() => setShowMobileModal(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 animate-in slide-in-from-bottom-4 duration-200">
            <div className="bg-white rounded-lg shadow-lg max-h-[80vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h2 className="text-base font-semibold">Switch Accounts</h2>
                <button
                  onClick={() => setShowMobileModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close">
                  <X size={20} />
                </button>
              </div>

              {/* Accounts List */}
              <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-2">
                {otherAccounts.map((account) => (
                  <div
                    key={account.id}
                    onClick={() => handleSwitchAccount(account)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors mb-1">
                    <Avatar className="h-10 w-10 rounded-lg flex-shrink-0">
                      <AvatarImage src={account.avatar} alt={account.name} />
                      <AvatarFallback>{account.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium text-sm">{account.name}</p>
                      <p className="truncate text-xs text-gray-500">{account.email}</p>
                    </div>
                    <button
                      onClick={(e) => handleRemoveAccount(account.id, account.name, e)}
                      className="flex-shrink-0 p-2 hover:bg-red-50 rounded-full transition-colors"
                      aria-label="Remove account">
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer with Add Account */}
              <div className="border-t p-2">
                <button
                  onClick={handleAddAccount}
                  className="w-full flex items-center justify-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <Plus className="w-5 h-5" />
                  <span className="text-sm font-medium">Add Account</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </SidebarMenu>
  );
}