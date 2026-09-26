import React from "react";
import {
    Gauge,
    Package,
    User,
    LogIn,
} from "lucide-react";
import { Navigate, type RouteObject } from "react-router-dom";
import {
    MixziDashboardPageLazy,
    MixziStockPageLazy,
    MixziLoginPageLazy,
    MixziProfilePageLazy,
} from "./lazypages";

type LazyRoutes = RouteObject & {
    name: string;
    sidebarIcon?: React.JSX.Element;
    label?: string;
};

export const RoutePaths = {
    MixziStock: "/mixzistock",
    MixziDashboard: "/mixzidashboard",
    MixziLogin: "/login",
    MixziProfile: "/profile",
    Splat: "/*",
} as const;

export type RoutePaths = typeof RoutePaths[keyof typeof RoutePaths];

export const routes: LazyRoutes[] = [
    {
        path: RoutePaths.MixziDashboard,
        Component: MixziDashboardPageLazy,
        name: "Dashboard",
        label: "Inicio",
        sidebarIcon: <Gauge aria-hidden="true" />,
    },
    {
        path: RoutePaths.MixziStock,
        Component: MixziStockPageLazy,
        name: "Stock",
        label: "Stock",
        sidebarIcon: <Package aria-hidden="true" />,
    },
    {
        path: RoutePaths.MixziProfile,
        Component: MixziProfilePageLazy,
        name: "Perfil",
        label: "Perfil",
        sidebarIcon: <User aria-hidden="true" />,
    },
    {
        path: RoutePaths.MixziLogin,
        Component: MixziLoginPageLazy,
        name: "Login",
        label: "Acceso",
        sidebarIcon: <LogIn aria-hidden="true" />,
    },
    {
        path: RoutePaths.Splat,
        Component: () => <Navigate to={RoutePaths.MixziDashboard} />,
        name: "Splat",
    }
];
