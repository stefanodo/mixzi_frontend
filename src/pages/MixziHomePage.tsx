import { Suspense } from "react"
import { Route, Routes } from "react-router"
import { routes } from "../router/routes"

export const MixziHomePage = () => {
    return (
        <Suspense fallback={<div></div>}>
            <Routes>
                {routes.map(({ path, Component }) => (
                    <Route key={path} path={path} Component={Component} />
                ))}
            </Routes>
        </Suspense>
    )
}