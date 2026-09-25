import { Gauge, Heart, Moon, Package, Plus, Sun } from "lucide-react"
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
    const logoLinkRef = useRef<HTMLAnchorElement>(null)

    const isDashboardActive = Boolean(matchPath({ path: RoutePaths.MixziDashboard, end: true }, location.pathname))
    const isStockActive = Boolean(matchPath({ path: RoutePaths.MixziStock, end: true }, location.pathname))

    // Refs para la animación fluida del indicador de pestaña en desktop
    const desktopNavRef = useRef<HTMLDivElement>(null)
    const dashboardTabRef = useRef<HTMLAnchorElement>(null)
    const stockTabRef = useRef<HTMLAnchorElement>(null)
    const [pillStyle, setPillStyle] = useState<{ left: number; width: number; opacity: number }>({
        left: 4,
        width: 110,
        opacity: 0,
    })

    // Actualizar la posición de la píldora animada en desktop
    useEffect(() => {
        const updatePill = () => {
            const container = desktopNavRef.current
            const activeEl = isDashboardActive
                ? dashboardTabRef.current
                : isStockActive
                ? stockTabRef.current
                : null

            if (container && activeEl) {
                const containerRect = container.getBoundingClientRect()
                const activeRect = activeEl.getBoundingClientRect()
                setPillStyle({
                    left: activeRect.left - containerRect.left,
                    width: activeRect.width,
                    opacity: 1,
                })
            } else {
                setPillStyle((prev) => ({ ...prev, opacity: 0 }))
            }
        }

        updatePill()
        window.addEventListener("resize", updatePill)
        return () => window.removeEventListener("resize", updatePill)
    }, [isDashboardActive, isStockActive])

    // Atajos de teclado (⌘1 / Ctrl+1 para Dashboard, ⌘2 / Ctrl+2 para Stock)
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
            setIsDragging(false)
            setDragOffset({ x: 0, y: 0 })
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

        event.currentTarget.style.setProperty("--logo-bend-y", `${horizontalPosition * 20}deg`)
        event.currentTarget.style.setProperty("--logo-bend-z", `${horizontalPosition * -6 + verticalPosition * -4}deg`)
        event.currentTarget.style.setProperty("--logo-bend-skew", `${horizontalPosition * 6}deg`)
    }

    const handleLogoPointerLeave = (event: PointerEvent<HTMLAnchorElement>) => {
        event.currentTarget.style.removeProperty("--logo-bend-y")
        event.currentTarget.style.removeProperty("--logo-bend-z")
        event.currentTarget.style.removeProperty("--logo-bend-skew")
    }

    const handleLogoDragStart = (event: PointerEvent<HTMLAnchorElement>) => {
        setIsDragging(true)
        setHasDragged(false)
        setDragStart({ x: event.clientX, y: event.clientY })
        setDragOffset({ x: 0, y: 0 })
        try {
            event.currentTarget.setPointerCapture(event.pointerId)
        } catch {
            // fallback
        }
    }

    const handleLogoDragMove = (event: PointerEvent<HTMLAnchorElement>) => {
        if (!isDragging) return

        const deltaX = event.clientX - dragStart.x
        const deltaY = event.clientY - dragStart.y

        if (Math.hypot(deltaX, deltaY) > 5) {
            setHasDragged(true)
        }

        setDragOffset({ x: deltaX, y: deltaY })
    }

    const handleLogoDragEnd = (event: PointerEvent<HTMLAnchorElement>) => {
        if (isDragging) {
            setIsDragging(false)
            setDragOffset({ x: 0, y: 0 })
            try {
                event.currentTarget.releasePointerCapture(event.pointerId)
            } catch {
                // fallback
            }
        }
    }

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/90 backdrop-blur-xl shadow-2xs transition-colors">
            {/* BARRA SUPERIOR PRINCIPAL */}
            <div className="mx-auto flex h-14 sm:h-16 w-full max-w-7xl items-center justify-between px-3.5 sm:px-6">
                {/* LOGO INTERACTIVO CON EASTER EGG DE HOJA LEVANTABLE */}
                {/* El easter egg está justo debajo del logo, fijado y exactamente con sus mismas dimensiones */}
                <div className="relative inline-flex items-center shrink-0">
                    {/* EASTER EGG FIJO DEBAJO DEL LOGO (reducido 30%, mismo tamaño del logo, no sobresale) */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center rounded-lg border border-red-500/15 bg-red-500/5 p-0.5 text-center select-none overflow-hidden"
                    >
                        <div className="flex flex-col items-center justify-center scale-[0.70] origin-center">
                            <Heart className="size-3 text-rose-500 fill-rose-500 animate-pulse" strokeWidth={1} />
                            <div className="mt-0.5 flex flex-col leading-tight text-foreground/85 font-semibold text-[8px] tracking-tight whitespace-nowrap">
                                <span>Made with Love</span>
                                <span className="text-[7px] text-muted-foreground font-normal">by mixzi team!</span>
                            </div>
                        </div>
                    </div>

                    {/* LOGOTIPO QUE ACTÚA COMO HOJA QUE SE LEVANTA Y REVELA LO QUE HAY DEBAJO */}
                    <NavLink
                        ref={logoLinkRef}
                        className="mixzi-logo-link relative z-10 block shrink-0 select-none bg-background/95 rounded-lg"
                        to={RoutePaths.MixziDashboard}
                        onClick={(e) => {
                            if (hasDragged) {
                                e.preventDefault()
                                setHasDragged(false)
                            }
                        }}
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
                                ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.08}deg) scale(1.03)`
                                : "translate(0, 0)",
                            boxShadow: isDragging ? "0 10px 25px -5px rgba(0, 0, 0, 0.25)" : "none",
                            transition: !isDragging ? "transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.2s" : "none",
                            touchAction: "none",
                        }}
                        title="mixzi (¡levanta el logo!)"
                    >
                        <img
                            src={mixziLogo}
                            alt="mixzi"
                            draggable={false}
                            className="mixzi-logo block h-8 sm:h-10 w-auto object-contain pointer-events-none"
                        />
                    </NavLink>
                </div>

                {/* NAVEGACIÓN SEGMENTADA EN DESKTOP CON PÍLDORA ANIMADA FLUIDA */}
                <nav aria-label="Navegación principal desktop" className="hidden md:flex items-center">
                    <div
                        ref={desktopNavRef}
                        className="relative flex items-center rounded-xl border border-border/80 bg-muted/40 p-1 shadow-2xs backdrop-blur-md"
                    >
                        {/* PÍLDORA RESALTADA FLUIDA ANIMADA */}
                        <div
                            className="pointer-events-none absolute top-1 bottom-1 rounded-lg bg-background shadow-xs ring-1 ring-border transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                            style={{
                                left: `${pillStyle.left}px`,
                                width: `${pillStyle.width}px`,
                                opacity: pillStyle.opacity,
                            }}
                        />

                        <NavLink
                            ref={dashboardTabRef}
                            to={RoutePaths.MixziDashboard}
                            className={cn(
                                "relative z-10 flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors duration-200",
                                isDashboardActive
                                    ? "text-foreground font-bold"
                                    : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            <Gauge className="size-4" />
                            <span>Dashboard</span>
                            <span className="hidden lg:inline-flex items-center rounded border border-border/50 bg-muted/60 px-1 text-[10px] text-muted-foreground font-mono">
                                ⌘1
                            </span>
                        </NavLink>

                        <NavLink
                            ref={stockTabRef}
                            to={RoutePaths.MixziStock}
                            className={cn(
                                "relative z-10 flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors duration-200",
                                isStockActive
                                    ? "text-foreground font-bold"
                                    : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            <Package className="size-4" />
                            <span>Stock & Inventario</span>
                            <span className="hidden lg:inline-flex items-center rounded border border-border/50 bg-muted/60 px-1 text-[10px] text-muted-foreground font-mono">
                                ⌘2
                            </span>
                        </NavLink>
                    </div>
                </nav>

                {/* ACCIONES Y BADGE EN VIVO SITUADO A LA DERECHA */}
                <div className="flex items-center gap-2 sm:gap-2.5">
                    {/* BADGE DE SERVICIO EN VIVO (A la derecha en desktop y móvil) */}
                    <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400 select-none shadow-2xs">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>En vivo</span>
                    </div>

                    {/* Botón Desktop Agregar Insumo */}
                    <NavLink
                        to="/mixzistock?action=add-item&block=Frescos"
                        className="hidden md:inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:opacity-90 active:scale-98 transition-all"
                    >
                        <Plus className="size-3.5" />
                        <span>+ Movimiento</span>
                    </NavLink>

                    {/* Botón Desktop Darkmode */}
                    <button
                        aria-label={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`}
                        aria-pressed={theme === "dark"}
                        className="hidden md:inline-flex size-9 items-center justify-center rounded-lg border border-border/80 bg-card text-foreground transition-all hover:bg-muted active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary shadow-2xs"
                        onClick={handleThemeToggle}
                        onKeyDown={handleThemeKeyboardActivation}
                        title={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`}
                        type="button"
                    >
                        {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                    </button>
                </div>
            </div>

            {/* BARRA DE PESTAÑAS INTEGRADA EN CABECERA SUPERIOR PARA MÓVIL */}
            {/* Libera el 100% del área inferior para que nada tape botones flotantes ni formularios */}
            <div className="md:hidden border-t border-border/50 bg-muted/20 px-3.5 py-1.5">
                <nav
                    aria-label="Pestañas móviles"
                    className="grid grid-cols-2 gap-1 rounded-xl bg-muted/50 p-1 border border-border/60 shadow-2xs"
                >
                    <NavLink
                        to={RoutePaths.MixziDashboard}
                        className={cn(
                            "flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-98",
                            isDashboardActive
                                ? "bg-background text-foreground shadow-xs ring-1 ring-border font-bold"
                                : "text-muted-foreground hover:text-foreground",
                        )}
                    >
                        <Gauge className="size-3.5" />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to={RoutePaths.MixziStock}
                        className={cn(
                            "flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-98",
                            isStockActive
                                ? "bg-background text-foreground shadow-xs ring-1 ring-border font-bold"
                                : "text-muted-foreground hover:text-foreground",
                        )}
                    >
                        <Package className="size-3.5" />
                        <span>Stock</span>
                    </NavLink>
                </nav>
            </div>
        </header>
    )
}
