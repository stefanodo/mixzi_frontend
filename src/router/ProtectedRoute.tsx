import React from "react";
import { observer } from "mobx-react-lite";
import { Navigate, useLocation } from "react-router-dom";
import { authStore } from "@/stores/AuthStore";
import { RoutePaths } from "./routes";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = observer(({ children }) => {
    const location = useLocation();

    if (!authStore.isAuthenticated) {
        return <Navigate to={RoutePaths.MixziLogin} state={{ from: location }} replace />;
    }
    return <>{children}</>;
});
