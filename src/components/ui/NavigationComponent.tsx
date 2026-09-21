import { Menu, Moon, Sun, X } from "lucide-react"
import { type KeyboardEvent, useEffect, useState } from "react"
import { matchPath, NavLink, useLocation } from "react-router-dom"
import { RoutePaths, routes } from "../../router/routes"
import { cn } from "../../lib/utils"
import { useDeviceType } from "../../hooks/useDeviceType"
import { useTheme } from "./ThemeProvider"

const navigationRoutes = routes.filter((route) => route.label)

const handleKeyboardActivation = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
        return
    }

    event.preventDefault()
    event.currentTarget.click()
}

export const NavigationComponent = () => {
    const location = useLocation()
    const deviceType = useDeviceType()
    const { theme, toggleTheme } = useTheme()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const isMobile = deviceType === "mobile"
    const activeRoute = navigationRoutes.find((route) =>
        matchPath({ path: route.path ?? "", end: true }, location.pathname),
    )

    useEffect(() => {
        setIsMenuOpen(false)
    }, [location.pathname])

    const handleMenuToggle = () => {
        setIsMenuOpen((open) => !open)
    }

    const handleMenuKeyboardActivation = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key !== "Enter" && event.key !== " ") {
            return
        }

        event.preventDefault()
        handleMenuToggle()
    }

    const handleThemeToggle = () => {
        toggleTheme()
    }

    const handleThemeKeyboardActivation = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key !== "Enter" && event.key !== " ") {
            return
        }

        event.preventDefault()
        handleThemeToggle()
    }

    const navigationLinks = navigationRoutes.map((route) => {
        const isActive = Boolean(matchPath({ path: route.path ?? "", end: true }, location.pathname))

        return (
            <li key={route.path}>
                <NavLink
                    to={route.path ?? RoutePaths.MixziDashboard}
                    onKeyDown={handleKeyboardActivation}
                    className={cn(
                        "inline-flex min-h-12 shrink-0 items-center gap-2 rounded-lg border border-(--nav-border) bg-(--nav-item) px-3 text-xs font-semibold text-(--nav-muted) transition-colors hover:border-(--nav-border-hover) hover:bg-(--nav-item-hover) hover:text-(--nav-text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--nav-focus)",
                        isActive && "border-(--nav-active-border) bg-(--nav-active) text-(--nav-active-text) shadow-[inset_0_-2px_0_var(--nav-focus)]",
                        isMobile && "w-full justify-start",
                    )}
                >
                    <span className="[&_svg]:size-4">{route.sidebarIcon}</span>
                    {route.label}
                </NavLink>
            </li>
        )
    })

    return (
        <header className="border-b border-(--nav-border) bg-(--nav-background) text-(--nav-muted) shadow-[0_1px_0_var(--nav-shadow)]">
            <div className="relative flex min-h-19 items-center gap-2 px-6 sm:gap-3 sm:px-6">
                <NavLink
                    className="mr-1 shrink-0 leading-none"
                    to={RoutePaths.MixziDashboard}
                    onKeyDown={handleKeyboardActivation}
                >
                    <span className="block text-[17px] font-extrabold tracking-[-0.04em] text-(--nav-text)">Mixzi</span>
                    <span className="mt-1 block text-[8px] font-medium uppercase tracking-[0.12em] text-(--nav-muted)">Inventory workspace</span>
                </NavLink>

                <button
                    aria-controls="mixzi-navigation-menu"
                    aria-expanded={isMenuOpen}
                    aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                    className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg border border-(--nav-border) bg-(--nav-item) text-(--nav-text) transition-colors hover:bg-(--nav-item-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--nav-focus) sm:hidden"
                    onPointerUp={handleMenuToggle}
                    onKeyDown={handleMenuKeyboardActivation}
                    type="button"
                >
                    {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </button>

                <nav
                    aria-label="Primary navigation"
                    aria-hidden={isMobile && !isMenuOpen}
                    className={cn("min-w-0 flex-1 overflow-hidden", isMobile && !isMenuOpen && "hidden sm:block")}
                    id="mixzi-navigation-menu"
                >
                    <ul className={cn("flex gap-1", isMobile ? "absolute inset-x-3 top-17 z-10 flex-col rounded-xl border border-(--nav-border) bg-(--nav-background) p-2 shadow-xl sm:static sm:flex-row sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none" : "min-w-max items-center overflow-x-auto pb-0.5")}>
                        {navigationLinks}
                    </ul>
                </nav>

                <button
                    aria-label={`Switch to ${theme === "dark" ? "standard" : "dark"} theme`}
                    aria-pressed={theme === "dark"}
                    className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg border border-(--nav-border) bg-(--nav-item) px-3 text-xs font-semibold text-(--nav-text) transition-colors hover:bg-(--nav-item-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--nav-focus)"
                    onPointerUp={handleThemeToggle}
                    onKeyDown={handleThemeKeyboardActivation}
                    title={`Switch to ${theme === "dark" ? "standard" : "dark"} theme`}
                    type="button"
                >
                    {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
                    <span className="hidden sm:inline">{theme === "dark" ? "Dark" : "Standard"}</span>
                </button>

                <span aria-live="polite" className="sr-only">
                    {activeRoute?.label ?? ""} selected
                </span>
            </div>
        </header>
    )
}