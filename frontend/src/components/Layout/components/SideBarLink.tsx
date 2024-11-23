import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Routes } from '@/providers/Router';

interface SidebarLinkProps {
    route: (typeof Routes)[number];
    isExpanded: boolean;
    isActive: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ route, isExpanded, isActive }) => {
    if (!route.href) return null;

    return (
        <Link
            to={route.href}
            className={cn(
                "flex items-center h-10",
                "text-gray-600 hover:text-gray-900",
                "hover:bg-gray-100 transition-all duration-200",
                "rounded-lg",
                isExpanded ? "px-3" : "justify-center px-2",
                isActive && "bg-gray-100 text-gray-900"
            )}
        >
            <route.icon className={cn(
                "h-5 w-5 flex-shrink-0",
                !isExpanded && "mx-auto",
                isActive ? "text-gray-900" : "text-gray-500"
            )} />
            {isExpanded && (
                <span className="ml-3 text-sm font-medium truncate">
                    {route.name}
                </span>
            )}
        </Link>
    );
};

export default SidebarLink;