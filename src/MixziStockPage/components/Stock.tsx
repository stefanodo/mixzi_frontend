import { useMainStore } from "@/context/MainContext";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { 
  Info, 
  Plus, 
  X, 
  Search, 
  SlidersHorizontal, 
  AlertTriangle, 
  CheckCircle2, 
  Boxes, 
  Layers, 
  Sparkles, 
  PackageCheck, 
  ArrowUpDown,
  Filter,
  Flame,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { observer } from "mobx-react-lite";
import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid";
import { StockMovementForm } from "@/MixziStockPage/components/StockMovementForm";
import type { ItemResponseDto } from "@/_generated";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const getCategoryName = (category: unknown) => {
    if (!category || typeof category !== "object") {
        return "Sin categoría";
    }

    const record = category as Record<string, unknown>;
    const name = typeof record.name === "string" ? record.name.trim() : "";

    return name || "Sin categoría";
};

const getNumericValue = (value: unknown) => {
    if (!value || typeof value !== "object") {
        return "-";
    }

    const numericValue = (value as Record<string, unknown>).value;
    return typeof numericValue === "number" ? String(numericValue) : "-";
};

const getUnitValue = (value: unknown) => {
    if (!value || typeof value !== "object") {
        return "";
    }

    const unit = (value as Record<string, unknown>).unit;
    return typeof unit === "string" ? unit : "";
};

const handleKeyboardActivation = (
    event: React.KeyboardEvent,
    action: () => void,
) => {
    if (event.currentTarget instanceof HTMLButtonElement) {
        return;
    }

    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        action();
    }
};

const BLOCK_CATEGORY_MAP: Record<string, string[]> = {
    Frescos: ["cat-fresh"],
    Producciones: ["cat-prod"],
    Congelados: ["cat-freeze"],
    Secos: ["cat-dry"],
    Limpieza: ["cat-manteinance"],
    "Pend. clasificar": ["cat-pending"],
    "Sin ubicar": ["cat-unknown"],
    "Stock actual": ["cat-fresh", "cat-dry", "cat-freeze", "cat-manteinance", "cat-prod", "cat-pending", "cat-unknown"],
};

const BLOCK_BY_CATEGORY_ID: Record<string, string> = {
    "cat-fresh": "Frescos",
    "cat-prod": "Producciones",
    "cat-freeze": "Congelados",
    "cat-dry": "Secos",
    "cat-manteinance": "Limpieza",
    "cat-pending": "Pend. clasificar",
    "cat-unknown": "Sin ubicar",
};

const BLOCK_ICONS: Record<string, string> = {
    "Stock actual": "📊",
    Frescos: "🥬",
    Producciones: "🍳",
    Congelados: "❄️",
    Secos: "🥫",
    Limpieza: "🧼",
    "Pend. clasificar": "⏳",
    "Sin ubicar": "❓",
};

const getBlockInfo = (activeBlock: string) => {
    switch (activeBlock) {
        case "Frescos":
            return {
                title: "Insumos Frescos & Perecederos",
                description: "Carnes, pescados, verduras, frutas, lácteos y huevos. Máxima rotación y control de caducidad.",
                badge: "Rotación Rápida",
                badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
            };
        case "Producciones":
            return {
                title: "Stock de Producciones & Elaboraciones",
                description: "Bases, fondos, salsas y elaborados propios ya procesados en cocina y listos para servicio.",
                badge: "Elaborado Interno",
                badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
            };
        case "Congelados":
            return {
                title: "Stock Congelados & Ultracongelados",
                description: "Insumos conservados a baja temperatura con caducidad extendida.",
                badge: "Cámara Congelador",
                badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
            };
        case "Secos":
            return {
                title: "Productos Secos & Economato",
                description: "Despensa, bebidas, especias, legumbres, harinas, aceites y latas.",
                badge: "Despensa Central",
                badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
            };
        case "Limpieza":
            return {
                title: "Insumos de Limpieza & Menaje",
                description: "Químicos, detergentes, papel y consumibles operativos no alimentarios.",
                badge: "No Alimentario",
                badgeColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20"
            };
        case "Pend. clasificar":
            return {
                title: "Insumos Pendientes de Clasificar",
                description: "Artículos registrados sin familia operativa definida. Reasígnalos para cuadrar escandallos.",
                badge: "Revisión Necesaria",
                badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
            };
        case "Sin ubicar":
            return {
                title: "Insumos Sin Ubicación",
                description: "Artículos heredados o sin almacén asignado. Conviene ubicarlos en cámara o economato.",
                badge: "Huérfanos",
                badgeColor: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20"
            };
        case "Stock actual":
            return {
                title: "Stock Global Unificado",
                description: "Auditoría integral de todos los insumos y materias primas de la operativa del restaurante.",
                badge: "Vista Maestra",
                badgeColor: "bg-primary/10 text-primary border-primary/20"
            };
        default:
            return null;
    }
};

export const Stock = observer(() => {
    const [activeBlock, setActiveBlock] = useState("Stock actual");
    const [showBlockInfo, setShowBlockInfo] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeOptionIndex, setActiveOptionIndex] = useState(-1);
    const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
    const [onlyAlerts, setOnlyAlerts] = useState(false);

    const [searchParams] = useSearchParams();
    const location = useLocation();

    const searchContainerRef = useRef<HTMLDivElement>(null);
    const movementDialogRef = useRef<HTMLDivElement>(null);
    const movementCloseRef = useRef<HTMLButtonElement>(null);
    const movementTriggerRef = useRef<HTMLButtonElement>(null);

    const {
        catalogStore: {
            catalogReferences,
            fetchingCatalog,
            fetchCatalog,
        }
    } = useMainStore();

    useEffect(() => {
        fetchCatalog();
    }, [fetchCatalog]);

    // Auto-navegación y apertura de formulario para Agregar Artículo desde el Dashboard
    useEffect(() => {
        const isAddAction = searchParams.get("action") === "add-item" || (location.state as any)?.action === "add-item";
        const requestedBlock = searchParams.get("block") || (location.state as any)?.block;

        if (isAddAction || requestedBlock === "Frescos") {
            setActiveBlock("Frescos");
            
            // Si está en móvil (< 768px), abre el modal
            const isMobile = window.innerWidth < 768;
            if (isMobile) {
                setIsMovementFormOpen(true);
            }

            // Enfocar el input de artículo una vez montado
            const timer = setTimeout(() => {
                const articleInput = document.getElementById("stock-movement-article") as HTMLInputElement | null;
                if (articleInput) {
                    articleInput.focus();
                    articleInput.click();
                }
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [searchParams, location.state]);

    useEffect(() => {
        if (!isSearchOpen) return;

        const handleOutsidePointerDown = (event: PointerEvent) => {
            if (!searchContainerRef.current?.contains(event.target as Node)) {
                setIsSearchOpen(false);
                setActiveOptionIndex(-1);
            }
        };

        document.addEventListener("pointerdown", handleOutsidePointerDown);
        return () => document.removeEventListener("pointerdown", handleOutsidePointerDown);
    }, [isSearchOpen]);

    useEffect(() => {
        if (!isMovementFormOpen) return;

        const dialog = movementDialogRef.current;
        const focusableSelector = "button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])";
        const focusInitialControl = () => movementCloseRef.current?.focus();
        
        const handleDialogKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                setIsMovementFormOpen(false);
                return;
            }

            if (event.key !== "Tab" || !dialog) return;

            const focusableElements = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));
            if (!focusableElements.length) {
                event.preventDefault();
                return;
            }

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        requestAnimationFrame(focusInitialControl);
        dialog?.addEventListener("keydown", handleDialogKeyDown);

        return () => {
            dialog?.removeEventListener("keydown", handleDialogKeyDown);
            movementTriggerRef.current?.focus();
        };
    }, [isMovementFormOpen]);

    const columns = useMemo<DataGridColumn<ItemResponseDto>[]>(() => [
        {
            accessorKey: "tenantId",
            header: "Almacén",
            enableSorting: true,
            meta: { className: "w-[24%] md:w-auto font-medium text-muted-foreground", headerLabel: "Almacén" },
            cell: ({ row }) => (
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted/60 border border-border/40">
                {row.original.tenantId || "Principal"}
              </span>
            ),
        },
        {
            accessorKey: "name",
            header: "Artículo / Insumo",
            enableSorting: true,
            meta: { className: "font-semibold text-foreground", headerLabel: "Artículo" },
            cell: ({ row }) => (
              <div className="py-0.5">
                <span className="font-semibold text-foreground text-sm block leading-tight">
                  {row.original.name}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {getCategoryName(row.original.category)}
                </span>
              </div>
            ),
        },
        {
            id: "minStock",
            header: "Mínimo",
            enableSorting: true,
            accessorFn: (row) => Number((row.minStock as Record<string, unknown> | null | undefined)?.value ?? 0),
            cell: ({ row }) => (
              <span className="font-mono text-xs">
                {`${getNumericValue(row.original.minStock)} ${getUnitValue(row.original.minStock)}`.trim()}
              </span>
            ),
        },
        {
            id: "maxStock",
            header: "Máximo",
            enableSorting: true,
            accessorFn: (row) => Number((row.maxStock as Record<string, unknown> | null | undefined)?.value ?? 0),
            cell: ({ row }) => (
              <span className="font-mono text-xs text-muted-foreground">
                {`${getNumericValue(row.original.maxStock)} ${getUnitValue(row.original.maxStock)}`.trim()}
              </span>
            ),
        },
        {
            id: "wasteDefaultPct",
            header: "Merma",
            enableSorting: true,
            accessorFn: (row) => Number((row.wasteDefaultPct as Record<string, unknown> | null | undefined)?.value ?? 0),
            cell: ({ row }) => (
              <span className="font-mono text-xs text-muted-foreground">
                {getNumericValue(row.original.wasteDefaultPct)}%
              </span>
            ),
        },
        {
            accessorKey: "isActive",
            header: "Estado",
            enableSorting: true,
            cell: ({ row }) => row.original.isActive ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-3" />
                    Óptimo
                </span>
            ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                    <span className="size-1.5 rounded-full bg-rose-500 animate-pulse" />
                    Bajo Mínimo
                </span>
            ),
        },
        {
            accessorKey: "updatedAt",
            header: "Actualizado",
            enableSorting: true,
            cell: ({ row }) => (
              <span className="text-xs text-muted-foreground font-mono">
                {new Date(row.original.updatedAt).toLocaleDateString()}
              </span>
            ),
        },
    ], []);

    // Conteo por bloque para las píldoras
    const blockCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        Object.keys(BLOCK_CATEGORY_MAP).forEach((b) => {
            const allowed = BLOCK_CATEGORY_MAP[b] || [];
            counts[b] = catalogReferences.filter(item => {
                const catId = typeof item.category === "object" && item.category
                    ? String((item.category as Record<string, unknown>).id ?? "")
                    : "";
                return allowed.includes(catId);
            }).length;
        });
        return counts;
    }, [catalogReferences]);

    // Filtrado de artículos
    const filteredCatalogItems = useMemo(() => {
        const normalizedSearchTerm = searchTerm.trim().toLowerCase();
        const allowedCategoryIds = BLOCK_CATEGORY_MAP[activeBlock] ?? BLOCK_CATEGORY_MAP["Stock actual"];

        return catalogReferences.filter((item) => {
            const categoryId = typeof item.category === "object" && item.category
                ? (item.category as Record<string, unknown>).id
                : undefined;

            const matchesCategory = allowedCategoryIds.includes(String(categoryId ?? ""));
            const matchesSearch = !normalizedSearchTerm || [item.id, item.name, item.unit, getCategoryName(item.category)]
                .some((value) => value.toLowerCase().includes(normalizedSearchTerm));

            const matchesAlertFilter = onlyAlerts ? !item.isActive : true;

            return matchesCategory && matchesSearch && matchesAlertFilter;
        });
    }, [activeBlock, searchTerm, catalogReferences, onlyAlerts]);

    // Métricas rápidas del bloque actual
    const stats = useMemo(() => {
        const total = filteredCatalogItems.length;
        const optimal = filteredCatalogItems.filter(i => i.isActive).length;
        const alerts = filteredCatalogItems.filter(i => !i.isActive).length;
        return { total, optimal, alerts };
    }, [filteredCatalogItems]);

    const searchOptions = useMemo(() => {
        const options = new Map<string, { label: string; value: string; categoryId?: string }>();
        catalogReferences.forEach((item) => {
            const optionValue = item.name;
            const categoryId = typeof item.category === "object" && item.category
                ? String((item.category as Record<string, unknown>).id ?? "")
                : "";
            const optionLabel = [item.name, item.unit, getCategoryName(item.category)]
                .filter(Boolean)
                .join(" - ");

            if (optionValue && optionLabel) {
                options.set(`${item.id}-${item.name}-${item.unit}`, {
                    label: optionLabel,
                    value: optionValue,
                    categoryId,
                });
            }
        });

        const normalizedSearchTerm = searchTerm.trim().toLowerCase();
        return Array.from(options.values())
            .filter((option) => option.label.toLowerCase().includes(normalizedSearchTerm))
            .slice(0, 8);
    }, [searchTerm, catalogReferences]);

    const clearSearch = () => {
        setSearchTerm("");
        setIsSearchOpen(false);
        setActiveOptionIndex(-1);
    };

    const selectSearchOption = (option: { label: string; value: string; categoryId?: string }) => {
        const matchedBlock = option.categoryId ? BLOCK_BY_CATEGORY_ID[option.categoryId] : undefined;
        setSearchTerm(option.value);
        if (matchedBlock) {
            setActiveBlock(matchedBlock);
        }
        setIsSearchOpen(false);
        setActiveOptionIndex(-1);
    };

    const activeBlockInfo = getBlockInfo(activeBlock);

    const blockList = [
      "Stock actual",
      "Frescos",
      "Producciones",
      "Congelados",
      "Secos",
      "Limpieza",
      "Pend. clasificar",
      "Sin ubicar",
    ];

    return (
        <section className="space-y-5 animate-in fade-in duration-300">
            {/* CABECERA OPERACIONAL INTEGRADA CON BÚSQUEDA Y MÉTRICAS */}
            <div className="bg-gradient-to-r from-card via-card to-muted/20 border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-xl bg-primary/10 text-primary">
                                <Boxes className="size-5" />
                            </span>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                                Gestión de Stock & Inventario
                            </h1>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                En directo
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                            Consulta niveles de inventario, márgenes de seguridad y registra movimientos de almacén.
                        </p>
                    </div>

                    {/* BOTÓN REGISTRAR / NUEVO ARTÍCULO */}
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => {
                                const isMobile = window.innerWidth < 768;
                                if (isMobile) {
                                    setIsMovementFormOpen(true);
                                } else {
                                    setActiveBlock("Frescos");
                                    setTimeout(() => {
                                        const el = document.getElementById("stock-movement-article");
                                        el?.focus();
                                    }, 200);
                                }
                            }}
                            className="text-xs sm:text-sm font-semibold h-9 gap-1.5 shadow-xs"
                        >
                            <Plus className="size-4" />
                            <span>Registrar Movimiento</span>
                        </Button>
                    </div>
                </div>

                {/* BUSCADOR MODERNO CON AUTOCOMPLETE Y BOTÓN INTEGRADO */}
                <div ref={searchContainerRef} className="relative">
                    <div className="relative flex items-center">
                        <Search className="size-4 absolute left-3.5 text-muted-foreground pointer-events-none" />
                        <Input
                            id="stock-search"
                            type="text"
                            aria-label="Buscar artículo o ingrediente"
                            placeholder="Buscar ingrediente o producto (ej. Solomillo, Cerveza, Aceite...)"
                            value={searchTerm}
                            onFocus={() => setIsSearchOpen(true)}
                            onChange={(event) => {
                                setSearchTerm(event.target.value);
                                setIsSearchOpen(true);
                                setActiveOptionIndex(-1);
                            }}
                            onKeyDown={(event) => {
                                if (!searchOptions.length) return;

                                if (event.key === "ArrowDown") {
                                    event.preventDefault();
                                    setIsSearchOpen(true);
                                    setActiveOptionIndex((index) => Math.min(index + 1, searchOptions.length - 1));
                                } else if (event.key === "ArrowUp") {
                                    event.preventDefault();
                                    setActiveOptionIndex((index) => Math.max(index - 1, 0));
                                } else if (event.key === "Enter" && activeOptionIndex >= 0) {
                                    event.preventDefault();
                                    selectSearchOption(searchOptions[activeOptionIndex]);
                                } else if (event.key === "Escape") {
                                    setIsSearchOpen(false);
                                    setActiveOptionIndex(-1);
                                }
                            }}
                            className="pl-10 pr-10 h-10 bg-background/80 border-border/80 focus-visible:ring-primary rounded-xl text-xs sm:text-sm shadow-2xs"
                            role="combobox"
                            aria-controls="stock-search-options"
                            aria-expanded={isSearchOpen}
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-3 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </div>

                    {/* Desplegable de búsqueda */}
                    {isSearchOpen && searchOptions.length > 0 && (
                        <div
                            id="stock-search-options"
                            role="listbox"
                            className="absolute z-30 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-border/80 bg-popover/95 backdrop-blur-md p-1 shadow-lg animate-in fade-in slide-in-from-top-1 duration-200"
                        >
                            {searchOptions.map((option, index) => (
                                <button
                                    key={option.label}
                                    type="button"
                                    role="option"
                                    aria-selected={activeOptionIndex === index}
                                    className={`flex items-center justify-between w-full rounded-lg px-3 py-2 text-left text-xs sm:text-sm text-foreground transition-colors hover:bg-muted ${
                                        activeOptionIndex === index ? "bg-muted font-medium" : ""
                                    }`}
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => selectSearchOption(option)}
                                >
                                    <span className="truncate">{option.label}</span>
                                    <ChevronRight className="size-3.5 text-muted-foreground shrink-0 ml-2" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* KPI STRIP DE CONTROL RÁPIDO */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/50 text-xs">
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-background/50 border border-border/40">
                        <PackageCheck className="size-4 text-primary shrink-0" />
                        <div className="truncate">
                            <span className="text-[10px] text-muted-foreground block truncate">Mostrados</span>
                            <span className="font-bold text-foreground font-mono">{stats.total}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-xl bg-background/50 border border-border/40">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                        <div className="truncate">
                            <span className="text-[10px] text-muted-foreground block truncate">Nivel Óptimo</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{stats.optimal}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setOnlyAlerts(prev => !prev)}
                        className={`flex items-center gap-2 p-2 rounded-xl border transition-all text-left truncate cursor-pointer ${
                            onlyAlerts
                                ? "bg-rose-500/10 border-rose-500/40 ring-1 ring-rose-500/30"
                                : "bg-background/50 border-border/40 hover:border-rose-400/50"
                        }`}
                    >
                        <AlertTriangle className={`size-4 shrink-0 ${stats.alerts > 0 ? "text-rose-500 animate-pulse" : "text-muted-foreground"}`} />
                        <div className="truncate">
                            <span className="text-[10px] text-muted-foreground block truncate">Bajo Mínimo</span>
                            <span className="font-bold text-rose-500 font-mono">{stats.alerts}</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* BLOQUES DE STOCK: TABS NAVEGABLES ADAPTADOS A MÓVIL Y DESKTOP */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Layers className="size-4 text-primary" />
                        <span className="text-xs font-semibold text-foreground">Familias & Bloques Operativos:</span>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7 text-muted-foreground hover:text-foreground gap-1"
                        onClick={() => setShowBlockInfo(prev => !prev)}
                    >
                        <Info className="size-3.5" />
                        <span>{showBlockInfo ? "Ocultar guía" : "Info bloques"}</span>
                    </Button>
                </div>

                {/* TABS CON SCROLL HORIZONTAL FLUIDO EN MÓVIL */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-0.5 scrollbar-none -mx-1 px-1">
                    {blockList.map((block) => {
                        const isSelected = activeBlock === block;
                        const count = blockCounts[block] ?? 0;
                        const icon = BLOCK_ICONS[block] || "📦";

                        return (
                            <button
                                key={block}
                                type="button"
                                onClick={() => {
                                    setActiveBlock(block);
                                    setOnlyAlerts(false);
                                }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 border ${
                                    isSelected
                                        ? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold scale-[1.02]"
                                        : "bg-card text-muted-foreground border-border/70 hover:bg-muted/70 hover:text-foreground"
                                }`}
                            >
                                <span className="text-xs">{icon}</span>
                                <span>{block}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                                    isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                                }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* GUÍA DE BLOQUES SI ESTÁ ACTIVA */}
                {showBlockInfo && (
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/80 text-xs text-muted-foreground animate-in fade-in duration-200">
                        Se muestra únicamente el bloque operativo seleccionado para maximizar la velocidad de carga y lectura. En bloques operativos, cada artículo se ubica en su almacén principal (Cámara o Economato).
                    </div>
                )}
            </div>

            {/* DESCRIPCIÓN Y ESTADO DEL BLOQUE ACTIVO */}
            {activeBlockInfo && (
                <div className="bg-card border border-border/70 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-foreground">{activeBlockInfo.title}</h3>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${activeBlockInfo.badgeColor}`}>
                                {activeBlockInfo.badge}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{activeBlockInfo.description}</p>
                    </div>

                    {onlyAlerts && (
                        <div className="flex items-center gap-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-2 py-1 rounded-lg text-xs font-medium shrink-0">
                            <Filter className="size-3.5" />
                            <span>Filtrando solo bajo mínimo</span>
                            <button onClick={() => setOnlyAlerts(false)} className="ml-1 hover:text-foreground">
                                <X className="size-3" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* TABLA DE ARTÍCULOS Y FORMULARIO */}
            <div className={activeBlock === "Frescos" ? "min-w-0 md:grid md:items-start md:grid-cols-[340px_minmax(0,1fr)] md:gap-6" : ""}>
                {/* Formulario en desktop para Frescos */}
                {activeBlock === "Frescos" && (
                    <div className="hidden min-w-0 md:block md:w-[340px] md:min-w-[340px] md:max-w-[340px] sticky top-4">
                        <StockMovementForm />
                    </div>
                )}

                {/* DataGrid principal */}
                <Card className="flex min-h-88 min-w-0 flex-col overflow-hidden border border-border/80 shadow-xs">
                    <div className="flex flex-1 flex-col">
                        <DataGrid
                            className="mx-3 sm:mx-5 mb-0 flex-1 pb-0"
                            data={filteredCatalogItems}
                            columns={columns}
                            loading={fetchingCatalog}
                            emptyMessage={onlyAlerts ? "No hay artículos bajo mínimo en este bloque." : "No hay artículos disponibles en este bloque."}
                            ariaLabel={`Tabla de insumos para ${activeBlock}`}
                            pageSize={8}
                            showPagination
                            getRowId={(row) => row.id}
                        />
                    </div>
                </Card>
            </div>

            {/* CONTROL FLOTANTE MÓVIL (FAB) CON ACCESO DIRECTO */}
            <Button
                type="button"
                size="icon"
                aria-label="Registrar movimiento de stock"
                title="Registrar movimiento"
                ref={movementTriggerRef}
                className="fixed right-5 bottom-5 z-40 size-14 rounded-full shadow-xl bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-transform md:hidden flex items-center justify-center border-2 border-background"
                onClick={() => setIsMovementFormOpen(true)}
            >
                <Plus className="size-6" />
            </Button>

            {/* BOTTOM SHEET MODAL PARA MÓVIL CON ANIMACIÓN FLUIDA */}
            {isMovementFormOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 p-0 sm:p-4 md:hidden"
                    role="presentation"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsMovementFormOpen(false);
                    }}
                >
                    <div
                        ref={movementDialogRef}
                        className="relative max-h-[85vh] h-[85vh] w-full overflow-hidden rounded-t-2xl sm:rounded-2xl bg-background border border-border shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="mobile-movement-form-title"
                    >
                        {/* Grab handle visual */}
                        <div className="w-10 h-1.5 bg-muted-foreground/30 rounded-full mx-auto mt-2.5 mb-1 shrink-0" />

                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-5 py-3 border-b border-border/60 shrink-0">
                            <div>
                                <h2 id="mobile-movement-form-title" className="text-base font-bold text-foreground">
                                    Registrar Movimiento de Stock
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Entradas, consumos y mermas de almacén
                                </p>
                            </div>
                            <Button
                                ref={movementCloseRef}
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label="Cerrar formulario"
                                className="size-8 rounded-full"
                                onClick={() => setIsMovementFormOpen(false)}
                            >
                                <X className="size-4" />
                            </Button>
                        </div>

                        {/* Modal Content Scrollable */}
                        <div className="flex-1 overflow-y-auto px-5 py-4">
                            <StockMovementForm showTitle={false} />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
});
