import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Routes, getNavigationItems } from '@/providers/Router';
import { cn } from '@/lib/utils';
import { Icons } from '../ui/icons';
import { Toaster } from '../ui/toaster';

interface LayoutProps {
    children: React.ReactNode;
}

interface SidebarLinkProps {
    route: (typeof Routes)[number];
    isExpanded: boolean;
    isActive: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ route, isExpanded, isActive }) => {
    // Only render if the route has an href (means it should show in navigation)
    if (!route.href) return null;

    return (
        <Link
            to={route.href}
            className={cn(
                "flex items-center py-2 text-neutral-700 dark:text-neutral-300",
                "hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors",
                "rounded-md", // Added rounded corners
                isExpanded ? "px-4" : "justify-center px-2",
                isActive && "bg-neutral-300 dark:bg-neutral-700"
            )}
        >
            <route.icon className={cn(
                "h-5 w-5 flex-shrink-0",
                !isExpanded && "mx-auto"
            )} />
            {isExpanded && <span className="ml-3 truncate">{route.name}</span>}
        </Link>
    );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, signOut } = useAuthContext();
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const location = useLocation();
    const navItems = getNavigationItems();

    return (
        <div className="flex h-screen bg-neutral-100 dark:bg-neutral-900">
            {/* Sidebar */}
            <aside
                className={cn(
                    "bg-neutral-200 dark:bg-neutral-800 h-full",
                    "transition-all duration-300 ease-in-out flex flex-col",
                    "border-r border-neutral-300 dark:border-neutral-700",
                    isSidebarExpanded ? "w-64" : "w-16"
                )}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b border-neutral-300 dark:border-neutral-700">
                    {isSidebarExpanded && (
                        <Link
                            to="/"
                            className="text-xl font-bold text-neutral-900 dark:text-neutral-100 truncate"
                        >
                            Write and Run
                        </Link>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                        className="flex-shrink-0"
                    >
                        {isSidebarExpanded ? <Icons.chevronLeft /> : <Icons.chevronRight />}
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-2">
                        {navItems.map((route) => (
                            <li key={route.href}>
                                <SidebarLink
                                    route={route}
                                    isExpanded={isSidebarExpanded}
                                    isActive={location.pathname === route.href}
                                />
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* User Profile Section */}
                {user && (
                    <div className="px-4 py-3 border-t border-neutral-300 dark:border-neutral-700">
                        <div className={cn(
                            "flex items-center",
                            !isSidebarExpanded && "justify-center"
                        )}>
                            <div className="w-8 h-8 rounded-full bg-neutral-300 dark:bg-neutral-600 flex-shrink-0">
                                {user.user_metadata?.avatar_url ? (
                                    <img
                                        src={user.user_metadata.avatar_url}
                                        alt="Profile"
                                        className="w-full h-full rounded-full"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Icons.user className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
                                    </div>
                                )}
                            </div>
                            {isSidebarExpanded && (
                                <div className="ml-3 overflow-hidden">
                                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                                        {user.user_metadata?.full_name || user.email}
                                    </p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                                        {user.email}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-neutral-300 dark:border-neutral-700">
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full",
                            isSidebarExpanded ? "justify-start" : "justify-center"
                        )}
                        onClick={signOut}
                    >
                        <Icons.logOut className="h-4 w-4 flex-shrink-0" />
                        {isSidebarExpanded && <span className="ml-2">Sign Out</span>}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto px-4 py-8">
                    {children}
                </div>
                <Toaster />
            </main>
        </div>
    );
};

export default Layout;