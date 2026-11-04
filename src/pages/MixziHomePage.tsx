import { Suspense } from "react"
import { Route, Routes } from "react-router"
import { routes } from "../router/routes"
import { ProtectedRoute } from "../router/ProtectedRoute"

export const MixziHomePage = () => {
    return (
        <Suspense fallback={<div></div>}>
            <Routes>
                {routes.map(({ path, Component, requiresAuth }) =>
                    requiresAuth && Component ? (
                        <Route
                            key={path}
                            path={path}
                            element={
                                <ProtectedRoute>
                                    <Component />
                                </ProtectedRoute>
                            }
                        />
                    ) : (
                        <Route key={path} path={path} Component={Component} />
                    )
                )}
            </Routes>
        </Suspense>
    )
}