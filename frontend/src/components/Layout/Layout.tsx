import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Routes } from '@/providers/Router';
import { cn } from '@/lib/utils';
import { Icons } from '../ui/icons';
import { Toaster } from '../ui/toaster';

interface LayoutProps {
    children: React.ReactNode;
}

const SidebarLink = ({ route, isExpanded, isActive }: {
    route: typeof Routes[number],
    isExpanded: boolean,
    isActive: boolean
}) => (
    <Link
        to={route.href}
        className={cn(
            "flex items-center py-2 text-neutral-700 dark:text-neutral-300",
            "hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors",
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


const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, signOut } = useAuthContext();
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const location = useLocation();

    return (
        <div className="flex h-screen bg-neutral-100 dark:bg-neutral-900">
            {/* Sidebar */}
            <aside
                className={cn(
                    "bg-neutral-200 dark:bg-neutral-800 h-full",
                    "transition-all duration-300 ease-in-out flex flex-col",
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
                        {Routes.map((route) => (
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

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-neutral-300 dark:border-neutral-700">
                    <Button
                        variant="outline"
                        className="w-full justify-center"
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