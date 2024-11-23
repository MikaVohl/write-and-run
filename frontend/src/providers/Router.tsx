import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Login from "@/features/Auth/Login/Login";
import { useAuthContext } from "@/contexts/AuthContext";
import Layout from "@/components/Layout/Layout";
import { Icons, Icon } from '@/components/ui/icons';
import Home from "@/features/Home";
import Profile from "@/features/Profile";

const ProtectedRoute = () => {
    const { user, isLoading } = useAuthContext();
    if (!user && !isLoading) {
        return <Navigate to="/login" replace />;
    }

    if (isLoading) {
        return <></>;
    }

    return (
        <Layout>
            <Outlet />
        </Layout>
    );
};

interface Route {
    name: string;
    component: React.ReactNode;
    href: string;
    icon: Icon;
}

export const Routes: Route[] = [
    {
        name: "Home",
        href: "/",
        component: <Home />,
        icon: Icons.home,
    },
    {
        name: "Profile",
        href: "/profile",
        icon: Icons.user,
        component: <Profile />,
    },
]

const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute />,
        children: Routes.map((route) => ({
            path: route.href === "/" ? "" : route.href.slice(1),
            element: route.component
        })),
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
]
);

export default router;