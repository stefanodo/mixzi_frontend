import { Gauge, Heart, Moon, Package, Plus, Sun, User } from "lucide-react"
import { type KeyboardEvent, type PointerEvent, useEffect, useRef, useState } from "react"
import { matchPath, NavLink, useLocation, useNavigate } from "react-router-dom"
import { RoutePaths } from "../../router/routes"
import { cn } from "../../lib/utils"
import { useTheme } from "./ThemeProvider"
import mixziLogo from "../../assets/mixi logo.svg"

const handleKeyboardActivation = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
        return
    }

    event.preventDefault()
    event.currentTarget.click()
}

export const NavigationComponent = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { theme, toggleTheme } = useTheme()
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [hasDragged, setHasDragged] = useState(false)
    const dragThreshold = 5
    const isInteractingRef = useRef(false)
    const activeIndex = location.pathname.startsWith(RoutePaths.MixziStock)
        ? 1
        : location.pathname.startsWith(RoutePaths.MixziProfile)
        ? 2
        : 0

    const resetDrag = () => {
        setDragOffset({ x: 0, y: 0 })
        setIsDragging(false)
        setHasDragged(false)
        isInteractingRef.current = false
    }

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        if (event.button !== 0) return
        isInteractingRef.current = true
        setIsDragging(true)
        setHasDragged(false)
        setDragStart({
            x: event.clientX - dragOffset.x,
            y: event.clientY - dragOffset.y,
        })
        event.currentTarget.setPointerCapture?.(event.pointerId)
    }

    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
        if (!isInteractingRef.current) return
        const nextX = event.clientX - dragStart.x
        const nextY = event.clientY - dragStart.y
        if (!hasDragged && Math.hypot(nextX, nextY) > dragThreshold) {
            setHasDragged(true)
        }
        setDragOffset({
            x: Math.max(-56, Math.min(56, nextX)),
            y: Math.max(-56, Math.min(56, nextY)),
        })
    }

    const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
        if (!isInteractingRef.current) return
        try {
            event.currentTarget.releasePointerCapture?.(event.pointerId)
        } catch {}
        resetDrag()
    }

    useEffect(() => {
        const handleKeyDown = (event: globalThis.KeyboardEvent) => {
            const isModifierPressed = event.metaKey || event.ctrlKey
            if (!isModifierPressed) return

            if (event.key === "1") {
                event.preventDefault()
                navigate(RoutePaths.MixziDashboard)
            } else if (event.key === "2") {
                event.preventDefault()
                navigate(RoutePaths.MixziStock)
            } else if (event.key === "3") {
                event.preventDefault()
                navigate(RoutePaths.MixziProfile)
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [navigate])

    const getLinkClasses = (path: string) => {
        const isActive = matchPath({ path, end: false }, location.pathname)
        return cn(
            "relative z-10 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            isActive
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
        )
    }

    const getMobileLinkClasses = (path: string) => {
        const isActive = matchPath({ path, end: false }, location.pathname)
        return cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            isActive
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
        )
    }

    const isThemeDark = theme === "dark"

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6">
                <div className="relative flex items-center select-none overflow-hidden h-9 w-[124px] cursor-grab active:cursor-grabbing">
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center bg-transparent pointer-events-none text-center px-1"
                        aria-hidden="true"
                    >
                        <Heart className="h-2.5 w-2.5 text-rose-500 fill-rose-500 animate-pulse drop-shadow-sm" />
                        <span className="text-[7.5px] font-bold text-foreground/85 leading-tight tracking-tight mt-0.5 whitespace-nowrap">
                            Made with Love by mixzi team!
                        </span>
                    </div>

                    <div
                        tabIndex={0}
                        role="button"
                        aria-label="Mixzi logo interactivo, arrastra para descubrir mensaje especial"
                        onKeyDown={handleKeyboardActivation}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={resetDrag}
                        className="relative z-10 flex h-full w-full items-center transition-transform duration-100 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
                        style={{
                            transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0)`,
                            touchAction: "none",
                        }}
                    >
                        <img
                            src={mixziLogo}
                            alt="Mixzi"
                            className="h-8 w-auto max-w-[124px] object-contain select-none pointer-events-none drop-shadow-sm"
                            draggable={false}
                        />
                    </div>
                </div>

                <nav
                    className="relative hidden md:flex items-center gap-1 rounded-full border border-border/70 bg-card/90 p-1 shadow-sm backdrop-blur-md"
                    aria-label="Navegación principal"
                >
                    <span
                        className="pointer-events-none absolute inset-y-1 rounded-full bg-primary shadow-sm shadow-primary/30 transition-all duration-300 ease-out"
                        style={{
                            width: "calc(33.333% - 5px)",
                            transform: `translateX(calc(${activeIndex * 100}% + ${activeIndex * 4}px))`,
                        }}
                        aria-hidden="true"
                    />

                    <NavLink
                        to={RoutePaths.MixziDashboard}
                        className={getLinkClasses(RoutePaths.MixziDashboard)}
                        title="Dashboard (⌘1)"
                    >
                        <Gauge className="h-3.5 w-3.5" />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to={RoutePaths.MixziStock}
                        className={getLinkClasses(RoutePaths.MixziStock)}
                        title="Gestión de Stock (⌘2)"
                    >
                        <Package className="h-3.5 w-3.5" />
                        <span>Stock</span>
                    </NavLink>

                    <NavLink
                        to={RoutePaths.MixziProfile}
                        className={getLinkClasses(RoutePaths.MixziProfile)}
                        title="Perfil y Tenant (⌘3)"
                    >
                        <User className="h-3.5 w-3.5" />
                        <span>Perfil</span>
                    </NavLink>
                </nav>

                <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        En vivo
                    </span>

                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label={isThemeDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-card text-foreground transition-all hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                        {isThemeDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            <div className="flex md:hidden border-t border-border/60 bg-card/95 px-3 py-1.5 backdrop-blur-md">
                <nav className="flex w-full items-center gap-1.5" aria-label="Navegación móvil">
                    <NavLink
                        to={RoutePaths.MixziDashboard}
                        className={getMobileLinkClasses(RoutePaths.MixziDashboard)}
                    >
                        <Gauge className="h-3.5 w-3.5" />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to={RoutePaths.MixziStock}
                        className={getMobileLinkClasses(RoutePaths.MixziStock)}
                    >
                        <Package className="h-3.5 w-3.5" />
                        <span>Stock</span>
                    </NavLink>

                    <NavLink
                        to={RoutePaths.MixziProfile}
                        className={getMobileLinkClasses(RoutePaths.MixziProfile)}
                    >
                        <User className="h-3.5 w-3.5" />
                        <span>Perfil</span>
                    </NavLink>
                </nav>
            </div>
        </header>
    )
}
