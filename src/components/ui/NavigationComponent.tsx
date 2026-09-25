import { Gauge, Heart, Moon, Package, Plus, Sparkles, Sun } from "lucide-react"
import { type KeyboardEvent, type PointerEvent, useEffect, useRef, useState } from "react"
import { matchPath, NavLink, useLocation, useNavigate } from "react-router-dom"
import { RoutePaths, routes } from "../../router/routes"
import { cn } from "../../lib/utils"
import { useTheme } from "./ThemeProvider"
import mixziLogo from "../../assets/mixi logo.svg"

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
    const navigate = useNavigate()
    const { theme, toggleTheme } = useTheme()
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const logoLinkRef = useRef<HTMLAnchorElement>(null)

    const isDashboardActive = Boolean(matchPath({ path: RoutePaths.MixziDashboard, end: true }, location.pathname))
    const isStockActive = Boolean(matchPath({ path: RoutePaths.MixziStock, end: true }, location.pathname))

    // Atajos de teclado rápidos (1 para Dashboard, 2 para Stock)
    useEffect(() => {
        const handleKeyDown = (event: globalThis.KeyboardEvent) => {
            const target = event.target as HTMLElement
            if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
                return
            }

            if ((event.metaKey || event.ctrlKey) && event.key === "1") {
                event.preventDefault()
                navigate(RoutePaths.MixziDashboard)
            } else if ((event.metaKey || event.ctrlKey) && event.key === "2") {
                event.preventDefault()
                navigate(RoutePaths.MixziStock)
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [navigate])

    useEffect(() => {
        if (!isDragging) return

        const handlePointerUp = () => {
            handleLogoDragEnd()
        }

        document.addEventListener("pointerup", handlePointerUp)
        return () => document.removeEventListener("pointerup", handlePointerUp)
    }, [isDragging])

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

    const handleLogoPointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
        const bounds = event.currentTarget.getBoundingClientRect()
        const horizontalPosition = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
        const verticalPosition = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2

        event.currentTarget.style.setProperty("--logo-bend-y", `${horizontalPosition * 24}deg`)
        event.currentTarget.style.setProperty("--logo-bend-z", `${horizontalPosition * -8 + verticalPosition * -5}deg`)
        event.currentTarget.style.setProperty("--logo-bend-skew", `${horizontalPosition * 8}deg`)
    }

    const handleLogoPointerLeave = (event: PointerEvent<HTMLAnchorElement>) => {
        event.currentTarget.style.removeProperty("--logo-bend-y")
        event.currentTarget.style.removeProperty("--logo-bend-z")
        event.currentTarget.style.removeProperty("--logo-bend-skew")
    }

    const handleLogoDragStart = (event: PointerEvent<HTMLAnchorElement>) => {
        setIsDragging(true)
        setDragStart({ x: event.clientX, y: event.clientY })
    }

    const handleLogoDragMove = (event: PointerEvent<HTMLAnchorElement>) => {
        if (!isDragging) return

        const deltaX = event.clientX - dragStart.x

        setDragOffset({ x: deltaX, y: 0 })
    }

    const handleLogoDragEnd = () => {
        setIsDragging(false)
        setDragOffset({ x: 0, y: 0 })
    }

    return (
        <>
            {/* ============================================================ */}
            {/* CABECERA PRINCIPAL INTEGRADA (MÓVIL Y DESKTOP)               */}
            {/* ============================================================ */}
            <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl shadow-xs transition-colors">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
                    {/* LOGO INTERACTIVO Y MARCA */}
                    <div className="relative flex items-center gap-3">
                        {isDragging && (
                            <div
                                className="pointer-events-none absolute z-0 flex flex-col items-center justify-center gap-1"
                                style={{ left: "calc(1rem + 15px)", top: "50%", transform: "translateY(-50%)" }}
                            >
                                <Heart size={18} fill="#EF4444" stroke="#EF4444" strokeWidth={1} />
                                <div className="flex flex-col text-center text-(--nav-text) leading-tight" style={{ fontSize: "9px" }}>
                                    <div>Made with Love</div>
                                    <div>by mixzi team!</div>
                                </div>
                            </div>
                        )}
                        <NavLink
                            ref={logoLinkRef}
                            className="mixzi-logo-link mr-1 shrink-0 self-center leading-none"
                            to={RoutePaths.MixziDashboard}
                            onKeyDown={handleKeyboardActivation}
                            onPointerLeave={handleLogoPointerLeave}
                            onPointerDown={handleLogoDragStart}
                            onPointerMove={(e) => {
                                handleLogoPointerMove(e)
                                handleLogoDragMove(e)
                            }}
                            onPointerUp={handleLogoDragEnd}
                            style={{
                                cursor: isDragging ? "grabbing" : "grab",
                                transform: isDragging
                                    ? `translate(${dragOffset.x}px, ${dragOffset.y}px)`
                                    : "translate(0, 0)",
                                transition: !isDragging ? "transform 0.2s ease-out" : "none",
                                position: "relative",
                                zIndex: 10,
                            }}
                        >
                            <img src={mixziLogo} alt="mixzi" className="mixzi-logo block h-10 w-auto object-contain" />
                        </NavLink>

                        {/* ESTADO OPERACIONAL EN VIVO */}
                        <div className="hidden items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground md:flex">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Servicio Activo</span>
                        </div>
                    </div>

                    {/* NAVEGACIÓN SEGMENTADA DE ALTA USABILIDAD EN DESKTOP */}
                    <nav aria-label="Navegación principal" className="hidden md:flex items-center">
                        <div className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-muted/40 p-1 shadow-2xs backdrop-blur-md">
                            <NavLink
                                to={RoutePaths.MixziDashboard}
                                className={cn(
                                    "relative flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-150",
                                    isDashboardActive
                                        ? "bg-background text-foreground shadow-xs ring-1 ring-border"
                                        : "text-muted-foreground hover:text-foreground hover:bg-background/50",
                                )}
                            >
                                <Gauge className="size-4" />
                                <span>Dashboard</span>
                                <span className="hidden lg:inline-flex items-center rounded border border-border/50 bg-muted px-1 text-[10px] text-muted-foreground font-mono">
                                    ⌘1
                                </span>
                            </NavLink>

                            <NavLink
                                to={RoutePaths.MixziStock}
                                className={cn(
                                    "relative flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-150",
                                    isStockActive
                                        ? "bg-background text-foreground shadow-xs ring-1 ring-border"
                                        : "text-muted-foreground hover:text-foreground hover:bg-background/50",
                                )}
                            >
                                <Package className="size-4" />
                                <span>Stock & Inventario</span>
                                <span className="hidden lg:inline-flex items-center rounded border border-border/50 bg-muted px-1 text-[10px] text-muted-foreground font-mono">
                                    ⌘2
                                </span>
                            </NavLink>
                        </div>
                    </nav>

                    {/* ACCIONES DIRECTAS EN DESKTOP Y TEMA */}
                    <div className="flex items-center gap-2.5">
                        {/* ACCIÓN RÁPIDA: REGISTRAR INSUMO */}
                        <NavLink
                            to="/mixzistock?action=add-item&block=Frescos"
                            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:opacity-90 active:scale-98 transition-all"
                        >
                            <Plus className="size-3.5" />
                            <span>+ Movimiento</span>
                        </NavLink>

                        {/* TOGGLE TEMA SUAVE */}
                        <button
                            aria-label={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`}
                            aria-pressed={theme === "dark"}
                            className="inline-flex size-9 items-center justify-center rounded-lg border border-border/80 bg-card text-foreground transition-all hover:bg-muted active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary shadow-2xs"
                            onClick={handleThemeToggle}
                            onKeyDown={handleThemeKeyboardActivation}
                            title={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`}
                            type="button"
                        >
                            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* ============================================================ */}
            {/* DOCK FLOTANTE INFERIOR MÓVIL 2026 (THUMB ZONE - SIN HAMBURGUESA) */}
            {/* ============================================================ */}
            <aside
                aria-label="Barra de navegación inferior móvil"
                className="fixed inset-x-3 bottom-3 z-50 md:hidden flex justify-center pointer-events-none"
            >
                <nav className="pointer-events-auto flex items-center justify-around gap-1 w-full max-w-sm rounded-2xl border border-border/80 bg-card/90 px-3 py-2 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/10">
                    {/* INICIO / DASHBOARD */}
                    <NavLink
                        to={RoutePaths.MixziDashboard}
                        className={cn(
                            "flex flex-1 flex-col items-center justify-center gap-1 py-1 rounded-xl text-[10px] font-semibold transition-all duration-150 active:scale-95",
                            isDashboardActive
                                ? "text-primary font-bold bg-primary/10"
                                : "text-muted-foreground hover:text-foreground",
                        )}
                    >
                        <Gauge className="size-5" />
                        <span>Dashboard</span>
                    </NavLink>

                    {/* BOTÓN CENTRAL DE ACCIÓN DIRECTA (AGREGAR INSUMO / MOVIMIENTO) */}
                    <NavLink
                        to="/mixzistock?action=add-item&block=Frescos"
                        aria-label="Registrar nuevo movimiento de stock"
                        className="flex flex-col items-center justify-center p-2 rounded-xl bg-primary text-primary-foreground shadow-md active:scale-90 transition-transform -my-1"
                    >
                        <Plus className="size-5" strokeWidth={2.5} />
                    </NavLink>

                    {/* STOCK */}
                    <NavLink
                        to={RoutePaths.MixziStock}
                        className={cn(
                            "flex flex-1 flex-col items-center justify-center gap-1 py-1 rounded-xl text-[10px] font-semibold transition-all duration-150 active:scale-95",
                            isStockActive
                                ? "text-primary font-bold bg-primary/10"
                                : "text-muted-foreground hover:text-foreground",
                        )}
                    >
                        <Package className="size-5" />
                        <span>Stock</span>
                    </NavLink>

                    {/* TOGGLE TEMA MÓVIL DIRECTO */}
                    <button
                        type="button"
                        onClick={handleThemeToggle}
                        aria-label="Cambiar tema"
                        className="flex flex-1 flex-col items-center justify-center gap-1 py-1 rounded-xl text-[10px] font-semibold text-muted-foreground hover:text-foreground active:scale-95 transition-all"
                    >
                        {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
                        <span>{theme === "dark" ? "Claro" : "Oscuro"}</span>
                    </button>
                </nav>
            </aside>
        </>
    )
}
