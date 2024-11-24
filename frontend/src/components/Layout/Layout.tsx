import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { getNavigationItems } from "@/providers/Router";
import { cn } from "@/lib/utils";
import { Icons } from "../ui/icons";
import { Toaster } from "../ui/toaster";
import { Separator } from "@/components/ui/separator";
import SidebarLink from "./components/SideBarLink";
import logo from "/Logo/W&RLogo.png";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuthContext();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const location = useLocation();
  const navItems = getNavigationItems();
  const navigate = useNavigate();

  return (
    <div
      className="flex h-screen overflow-hidden bg-white"
      style={
        {
          "--sidebar-width": isSidebarExpanded ? "230px" : "64px",
        } as React.CSSProperties
      }
    >
      <aside
        className={cn(
          "bg-gray-50 h-full",
          "transition-all duration-200",
          "border-r border-gray-200",
          "flex flex-col",
          isSidebarExpanded ? "w-[230px]" : "w-16"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center min-h-[3.5rem] px-3 gap-2 bg-white border-b border-gray-200">
          {isSidebarExpanded && (
            <div className="flex items-center flex-1 min-w-0">
              <Link to="/" className="flex items-center gap-2 text-gray-900">
                <img src={logo} className="w-8 mr-2" />
                <span className="font-semibold truncate">Write and Run</span>
              </Link>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className="h-8 w-8 text-gray-500 hover:text-gray-900"
          >
            {isSidebarExpanded ? <Icons.chevronLeft /> : <Icons.chevronRight />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 space-y-1">
            {navItems.map((route) => (
              <SidebarLink
                key={route.href}
                route={route}
                isExpanded={isSidebarExpanded}
                isActive={location.pathname === route.href}
              />
            ))}
          </div>
        </nav>

        <Separator className="bg-gray-200" />

        {/* User Profile Section */}
        {user && (
          <div className="p-2 py-3 bg-white border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div
                onClick={() => navigate("./profile")}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg flex-1",
                  "cursor-pointer",
                  "hover:bg-gray-100 transition-all duration-200",
                  !isSidebarExpanded && "justify-center"
                )}
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icons.user className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                </div>
                {isSidebarExpanded && (
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.user_metadata?.full_name || user.email}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                )}
              </div>
              {isSidebarExpanded && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={signOut}
                  className="h-10 w-10 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                >
                  <Icons.logOut className="h-[1.1rem] w-[1.1rem]" />
                </Button>
              )}
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-white">
        <div className="flex-1 h-full">{children}</div>
        <Toaster />
      </main>
    </div>
  );
};

export default Layout;
