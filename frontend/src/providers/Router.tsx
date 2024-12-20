import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Login from "@/features/Auth/Login/Login";
import { useAuthContext } from "@/contexts/AuthContext";
import Layout from "@/components/Layout/Layout";
import { Icons, Icon } from "@/components/ui/icons";
import Home from "@/features/Home";
import Profile from "@/features/Profile";
import SessionDashboard from "@/features/Dashboard";
import Sessions from "@/features/Sessions";
import Tester from "@/features/TestMe";
import LoadingAnimation from "@/components/LoadingAnimation"
import LandingPage from "@/features/LandingPage";

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
  path: string; // The actual path with parameters if any
  href?: string; // The link to show in navigation (if different from path)
  icon: Icon;
  component: React.ReactNode;
  showInNav?: boolean; // Whether to show in navigation
}

export const Routes: Route[] = [
  {
    name: "Home",
    path: "/home",
    href: "/home",
    component: <Home />,
    icon: Icons.home,
    showInNav: true,
  },
  {
    name: "Sessions",
    path: "/sessions",
    href: "/sessions",
    icon: Icons.code,
    component: <Sessions />,
    showInNav: true,
  },
  {
    name: "Session Details",
    path: "/sessions/:sessionId",
    icon: Icons.code,
    component: <SessionDashboard />,
    showInNav: false,
  },
  {
    name: "Profile",
    path: "/profile",
    href: "/profile",
    icon: Icons.user,
    component: <Profile />,
    showInNav: false,
  }
];

export const getNavigationItems = () =>
  Routes.filter((route) => route.showInNav);

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      ...Routes.map((route) => ({
        path: route.path === "/" ? "" : route.path.slice(1),
        element: route.component,
      })),
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
