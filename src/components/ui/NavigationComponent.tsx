import { Gauge, Heart, Moon, Package, Sun, User, LogIn, LogOut, ShieldCheck, ChevronDown, Building2 } from "lucide-react"
import { type KeyboardEvent, type PointerEvent, useEffect, useRef, useState } from "react"
import { matchPath, NavLink, useLocation, useNavigate } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { RoutePaths } from "../../router/routes"
import { cn } from "../../lib/utils"
import { useTheme } from "./ThemeProvider"
import mixziLogo from "../../assets/mixi logo.svg"
import { authStore } from "../../stores/AuthStore"

const handleKeyboardActivation = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
        return
    }

    event.preventDefault()
    event.currentTarget.click()
}

export const NavigationComponent = observer(() => {
    const location = useLocation()
    const navigate = useNavigate()
    const { theme, toggleTheme } = useTheme()
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [hasDragged, setHasDragged] = useState(false)
    const dragThreshold = 5
    const isInteractingRef = useRef(false)

    // Estado del desplegable de perfil
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const userMenuRef = useRef<HTMLDivElement>(null)

    const isStockActive = location.pathname.startsWith(RoutePaths.MixziStock)
    const isDashboardActive = location.pathname.startsWith(RoutePaths.MixziDashboard) || (!isStockActive && !location.pathname.startsWith(RoutePaths.MixziProfile) && !location.pathname.startsWith(RoutePaths.MixziLogin))
    const isProfileActive = location.pathname.startsWith(RoutePaths.MixziProfile)
    const isLoginActive = location.pathname.startsWith(RoutePaths.MixziLogin)

    const mainActiveIndex = isStockActive ? 1 : 0

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

    // Cerrar menú de usuario al hacer clic/tocar fuera o presionar Escape
    useEffect(() => {
        const handleOutsideAction = (event: MouseEvent | TouchEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false)
            }
        }

        const handleEscape = (event: globalThis.KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsUserMenuOpen(false)
            }
        }

        if (isUserMenuOpen) {
            document.addEventListener("mousedown", handleOutsideAction)
            document.addEventListener("touchstart", handleOutsideAction, { passive: true })
            document.addEventListener("keydown", handleEscape)
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideAction)
            document.removeEventListener("touchstart", handleOutsideAction)
            document.removeEventListener("keydown", handleEscape)
        }
    }, [isUserMenuOpen])

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
                if (authStore.isAuthenticated) {
                    navigate(RoutePaths.MixziProfile)
                } else {
                    navigate(RoutePaths.MixziLogin)
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [navigate])

    const getLinkClasses = (path: string) => {
        const isActive = matchPath({ path, end: false }, location.pathname)
        return cn(
            "relative z-10 flex items-center rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            isActive
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
        )
    }

    const getMobileLinkClasses = (path: string) => {
        const isActive = matchPath({ path, end: false }, location.pathname)
        return cn(
            "flex-1 flex flex-col items-center justify-center gap-1 py-1.5 text-[10px] font-medium rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            isActive
                ? "text-primary font-semibold bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
        )
    }

    const isThemeDark = theme === "dark"

    const handleLogout = () => {
        setIsUserMenuOpen(false)
        authStore.logout()
        navigate(RoutePaths.MixziLogin)
    }

    const userInitials = authStore.currentUser
        ? `${authStore.currentUser.firstName?.[0] || ""}${authStore.currentUser.lastName?.[0] || ""}`.toUpperCase() || "U"
        : "U"

    return (
        <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md">
            <div className="flex h-14 items-center justify-between px-3 sm:px-6">
                {/* Logo with Easter Egg */}
                <div className="relative flex items-center">
                    <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
                        aria-hidden="true"
                    >
                        <Heart className="h-2.5 w-2.5 text-rose-500 fill-rose-500 animate-pulse drop-shadow-sm" />
                        <span className="text-[6.4px] font-bold text-foreground/85 leading-tight tracking-tight mt-0.5 whitespace-nowrap">
                            Made with Love by mixzi team!
                        </span>
                    </div>

                    <div
                        role="button"
                        tabIndex={0}
                        aria-label="Mixzi logo (arrastrable para descubrir easter egg)"
                        onKeyDown={handleKeyboardActivation}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={resetDrag}
                        onClick={() => {
                            if (!hasDragged) {
                                navigate(RoutePaths.MixziDashboard)
                            }
                        }}
                        style={{
                            transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0)`,
                            transition: isDragging ? "none" : "transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1)",
                        }}
                        className="relative z-10 flex items-center select-none cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md p-1"
                    >
                        <img
                            src={mixziLogo}
                            alt="Mixzi"
                            className="h-7 w-auto pointer-events-none drop-shadow-sm"
                        />
                    </div>
                </div>

                {/* Central Desktop Operational Navigation */}
                <nav
                    className="relative hidden md:flex items-center rounded-full border border-border/80 bg-muted/60 p-1 shadow-inner backdrop-blur-sm"
                    aria-label="Navegación principal"
                >
                    <div
                        className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-primary shadow-sm transition-transform duration-300 ease-out pointer-events-none"
                        style={{
                            transform: `translateX(${mainActiveIndex * 100}%)`,
                        }}
                    />

                    <NavLink
                        to={RoutePaths.MixziDashboard}
                        className={getLinkClasses(RoutePaths.MixziDashboard)}
                        title="Dashboard Principal (⌘1)"
                    >
                        <span className="flex items-center gap-2">
                            <Gauge className="h-3.5 w-3.5" />
                            <span>Dashboard</span>
                        </span>
                    </NavLink>

                    <NavLink
                        to={RoutePaths.MixziStock}
                        className={getLinkClasses(RoutePaths.MixziStock)}
                        title="Gestión de Stock & Existencias (⌘2)"
                    >
                        <span className="-translate-x-2 flex items-center gap-2">
                            <Package className="h-3.5 w-3.5" />
                            <span>Stock</span>
                        </span>
                    </NavLink>
                </nav>

                {/* Right side: Live badge, Theme toggle, and Unified Authentication Menu */}
                <div className="flex items-center gap-2">
                    <span className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        En vivo
                    </span>

                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label={isThemeDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-card text-foreground transition-all hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        title={isThemeDark ? "Modo Claro" : "Modo Oscuro"}
                    >
                        {isThemeDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>

                    <div className="h-4 w-px bg-border/60 mx-0.5" />

                    {/* Acceso Unificado: Si NO está autenticado muestra 'Iniciar sesión', si está autenticado muestra Avatar con Menú */}
                    {!authStore.isAuthenticated ? (
                        <NavLink
                            to={RoutePaths.MixziLogin}
                            className={cn(
                                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                isLoginActive
                                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                                    : "border border-border/80 bg-card text-foreground hover:bg-muted hover:border-primary/40"
                            )}
                            title="Iniciar sesión en Mixzi (⌘3)"
                        >
                            <LogIn className="h-3.5 w-3.5 text-primary" />
                            <span>Iniciar Sesión</span>
                        </NavLink>
                    ) : (
                        <div className="relative" ref={userMenuRef}>
                            <button
                                type="button"
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                aria-expanded={isUserMenuOpen}
                                aria-haspopup="true"
                                className={cn(
                                    "flex items-center gap-2 rounded-full border p-1 pr-2.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                    isUserMenuOpen || isProfileActive
                                        ? "border-primary/60 bg-primary/10 text-primary shadow-xs"
                                        : "border-border/80 bg-card text-foreground hover:bg-muted/60 hover:border-border"
                                )}
                                title="Menú de usuario y cuenta (⌘3)"
                            >
                                <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground shadow-xs">
                                    {userInitials}
                                    <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-background" />
                                </div>
                                <span className="hidden sm:inline-block max-w-[110px] truncate text-xs font-medium">
                                    {authStore.currentUser?.firstName || "Mi Cuenta"}
                                </span>
                                <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform duration-200", isUserMenuOpen && "rotate-180")} />
                            </button>

                            {/* Backdrop para cerrar al tocar fuera en cualquier dispositivo */}
                            {isUserMenuOpen && (
                                <div
                                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] md:bg-transparent"
                                    onClick={() => setIsUserMenuOpen(false)}
                                    aria-hidden="true"
                                />
                            )}

                            {/* Dropdown Menu Desplegable */}
                            {isUserMenuOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-72 rounded-2xl border border-border/80 bg-card/98 p-2.5 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150 z-50 text-foreground"
                                    role="menu"
                                    aria-orientation="vertical"
                                >
                                    {/* Cabecera de usuario */}
                                    <div className="px-3 py-2.5 border-b border-border/60">
                                        <p className="text-xs font-semibold text-foreground truncate">
                                            {authStore.currentUser?.firstName} {authStore.currentUser?.lastName}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground truncate">
                                            {authStore.currentUser?.email}
                                        </p>
                                        <div className="flex items-center gap-1.5 mt-2">
                                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-medium border border-primary/20">
                                                <ShieldCheck className="h-3 w-3" />
                                                Rol: {authStore.currentUser?.role || "Staff"}
                                            </span>
                                            {authStore.currentUser?.tenant?.name && (
                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px] font-medium truncate">
                                                    <Building2 className="h-3 w-3" />
                                                    {authStore.currentUser.tenant.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Acciones principales */}
                                    <div className="py-1">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsUserMenuOpen(false)
                                                navigate(RoutePaths.MixziProfile)
                                            }}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-muted/80 transition-colors text-left"
                                            role="menuitem"
                                        >
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span>Mi Perfil & Permisos Tenant</span>
                                        </button>
                                    </div>

                                    <div className="h-px bg-border/60 my-1" />

                                    {/* Cerrar Sesión */}
                                    <div className="pt-0.5">
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors text-left"
                                            role="menuitem"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span>Cerrar Sesión</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Bottom Navigation Bar: Solo Dashboard y Stock (el perfil se gestiona exclusivamente desde el icono superior) */}
            <div className="flex md:hidden border-t border-border/60 bg-card/95 px-3 py-1.5 backdrop-blur-md">
                <nav className="flex w-full items-center justify-around gap-2" aria-label="Navegación móvil">
                    <NavLink
                        to={RoutePaths.MixziDashboard}
                        className={getMobileLinkClasses(RoutePaths.MixziDashboard)}
                    >
                        <Gauge className="h-4 w-4" />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to={RoutePaths.MixziStock}
                        className={getMobileLinkClasses(RoutePaths.MixziStock)}
                    >
                        <Package className="h-4 w-4" />
                        <span>Stock</span>
                    </NavLink>
                </nav>
            </div>
        </header>
    )
})
