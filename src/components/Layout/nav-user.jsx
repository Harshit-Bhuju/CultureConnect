import {
  Bell,
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
  UserCheck 
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
  const { logout, savedAccounts, switchAccount, removeAccount } = useAuth();
  const navigate = useNavigate();
  const [showMobileModal, setShowMobileModal] = useState(false);

  // Filter out the current user from saved accounts
  const otherAccounts = savedAccounts.filter((acc) => acc.email !== user.email);

  // Split accounts: first one and rest
  const firstAccount = otherAccounts[0];
  const remainingAccounts = otherAccounts.slice(1);

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
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleSwitchAccount = async (account) => {
    const result = await switchAccount(account.email);
    if (result.success) {
      toast.success(`Switched to ${account.name}`);
      setShowMobileModal(false);
      window.location.href = "/";
    } else {
      toast.error(result.message || "Failed to switch account");
    }
  };

  const handleRemoveAccount = async (accountEmail, accountName, e) => {
    e.stopPropagation();
    const success = await removeAccount(accountEmail);
    if (success) {
      toast.success(`Removed ${accountName} from saved accounts`);
    } else {
      toast.error("Failed to remove account");
    }
  };

  const handleAddAccount = () => {
    setShowMobileModal(false);
    // Added toast notification
    toast.success("Please add your account", {
      duration: 2000,
      icon: "ℹ️",
    });
    navigate("/login?action=add");
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

            {/* First Account (Always visible) */}
            {firstAccount && (
              <>
                <DropdownMenuItem
                  onClick={() => handleSwitchAccount(firstAccount)}
                  className="cursor-pointer p-0 mb-1">
                  <div className="flex items-center gap-2 w-full px-2 py-1.5">
                    <Avatar className="h-7 w-7 rounded-lg flex-shrink-0">
                      <AvatarImage
                        src={firstAccount.avatar}
                        alt={firstAccount.name}
                      />
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight overflow-hidden min-w-0">
                      <span className="truncate font-medium text-xs">
                        {firstAccount.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {firstAccount.email}
                      </span>
                    </div>
                    <button
                      onClick={(e) =>
                        handleRemoveAccount(
                          firstAccount.email,
                          firstAccount.name,
                          e
                        )
                      }
                      className="flex-shrink-0 p-1 hover:bg-red-50 rounded transition-colors"
                      aria-label="Remove account">
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            {/* Remaining Accounts in Submenu */}
            {remainingAccounts.length > 0 && (
              <>
                {isMobile ? (
                  <DropdownMenuItem
                    onClick={handleOtherAccountsClick}
                    className="cursor-pointer">
                    <span className="text-sm">
                      Other Accounts ({remainingAccounts.length})
                    </span>
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        Other Accounts ({remainingAccounts.length})
                      </span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="min-w-[280px] max-w-[320px] p-1">
                      <DropdownMenuLabel className="text-xs font-semibold">
                        More Accounts
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {remainingAccounts.map((account) => (
                        <DropdownMenuItem
                          key={account.email}
                          onClick={() => handleSwitchAccount(account)}
                          className="cursor-pointer p-0 mb-1">
                          <div className="flex items-center gap-2 w-full px-2 py-1.5">
                            <Avatar className="h-7 w-7 rounded-lg flex-shrink-0">
                              <AvatarImage
                                src={account.avatar}
                                alt={account.name}
                              />
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight overflow-hidden min-w-0">
                              <span className="truncate font-medium text-xs">
                                {account.name}
                              </span>
                              <span className="truncate text-xs text-muted-foreground">
                                {account.email}
                              </span>
                            </div>
                            <button
                              onClick={(e) =>
                                handleRemoveAccount(
                                  account.email,
                                  account.name,
                                  e
                                )
                              }
                              className="flex-shrink-0 p-1 hover:bg-red-50 rounded transition-colors"
                              aria-label="Remove account">
                              <Trash2 size={16} className="text-red-600" />
                            </button>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}
                <DropdownMenuSeparator />
              </>
            )}

            {/* Add Account Option */}
            <DropdownMenuItem
              onClick={handleAddAccount}
              className="cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              <span className="text-sm">Add Account</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>{ navigate("/following")}}
              className="cursor-pointer">
              <UserCheck  className="w-4 h-4 mr-2" />
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
              <DropdownMenuItem  onClick={() => navigate("/cart")}className="cursor-pointer">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
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
          <div
            className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
            onClick={() => setShowMobileModal(false)}
          />

          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 animate-in slide-in-from-bottom-4 duration-200">
            <div className="bg-white rounded-lg shadow-lg max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h2 className="text-base font-semibold">More Accounts</h2>
                <button
                  onClick={() => setShowMobileModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close">
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-2">
                {remainingAccounts.map((account) => (
                  <div
                    key={account.email}
                    onClick={() => handleSwitchAccount(account)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors mb-1">
                    <Avatar className="h-10 w-10 rounded-lg flex-shrink-0">
                      <AvatarImage src={account.avatar} alt={account.name} />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium text-sm">
                        {account.name}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {account.email}
                      </p>
                    </div>
                    <button
                      onClick={(e) =>
                        handleRemoveAccount(account.email, account.name, e)
                      }
                      className="flex-shrink-0 p-2 hover:bg-red-50 rounded-full transition-colors"
                      aria-label="Remove account">
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </div>
                ))}
              </div>

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
