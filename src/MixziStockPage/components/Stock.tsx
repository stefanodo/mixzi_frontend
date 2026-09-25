import { useMainStore } from "@/context/MainContext";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { Info, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { observer } from "mobx-react-lite";
import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid";
import { Separator } from "@/components/ui/separator";
import { StockMovementForm } from "@/MixziStockPage/components/StockMovementForm";
import type { ItemResponseDto } from "@/_generated";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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

const getBlockInfo = (activeBlock: string) => {
    switch (activeBlock) {
        case "Frescos":
            return {
                title: "Insumos Frescos",
                description: "Carnes, pescados, verduras, frutas, huevos y otros perecederos.",
            };
        case "Producciones":
            return {
                title: "Stock de Producciones",
                description: "Elaborados confirmados que ya han entrado a stock de producción.",
            };
        case "Congelados":
            return {
                title: "Stock Congelados",
                description: "Artículos marcados como congelados para inventario y conteo.",
            };
        case "Secos":
            return {
                title: "Productos Secos",
                description: "Despensa, bebidas, salsas, legumbres, pastas, arroz, latas y similares.",
            };
        case "Limpieza":
            return {
                title: "Insumos de Limpieza",
                description: "Productos de limpieza y apoyo no alimentario.",
            };
        case "Pend. clasificar":
            return {
                title: "Insumos Pendientes de Clasificar",
                description: "Artículos activos sin familia operativa cerrada. Puedes buscarlos y recolocarlos rápido.",
            };
        case "Sin ubicar":
            return {
                title: "Insumos Sin Ubicar",
                description: "Artículos heredados o antiguos sin ubicación guardada. Conviene vaciar este bloque y llevarlos a una categoría o a “Pend. clasificar.”",
            };
        case "Stock actual":
            return {
                title: "Stock Actual Global",
                description: "Vista maestra para auditar todo el stock sin depender del bloque operativo.",
            };
        default:
            return null;
    }
};

export const Stock = observer(() => {
    const [activeBlock, setActiveBlock] = useState("Stock actual");
    const [showBlockInfo, setShowBlockInfo] = useState(false);
    const [showSearchInfo, setShowSearchInfo] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeOptionIndex, setActiveOptionIndex] = useState(-1);
    const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const location = useLocation();

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

    useEffect(() => {
        if (!isSearchOpen) {
            return;
        }

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
        if (!isMovementFormOpen) {
            return;
        }

        const dialog = movementDialogRef.current;
        const focusableSelector = "button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])";
        const focusInitialControl = () => movementCloseRef.current?.focus();
        const handleDialogKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                setIsMovementFormOpen(false);
                return;
            }

            if (event.key !== "Tab" || !dialog) {
                return;
            }

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
            meta: { className: "w-[38%] max-w-[38%] md:w-auto md:max-w-none", headerLabel: "Almacén" },
            cell: ({ row }) => row.original.tenantId,
        },
        {
            accessorKey: "name",
            header: "Artículo",
            enableSorting: true,
            meta: { className: "w-[38%] max-w-[38%] md:w-auto md:max-w-none", headerLabel: "Artículo" },
            cell: ({ row }) => row.original.name,
        },
        {
            accessorKey: "category",
            header: "Ubicación",
            enableSorting: true,
            meta: { className: "w-[38%] max-w-[38%] md:w-auto md:max-w-none", headerLabel: "Ubicación" },
            cell: ({ row }) => getCategoryName(row.original.category),
        },
        {
            id: "minStock",
            header: "Mín.",
            enableSorting: true,
            accessorFn: (row) => Number((row.minStock as Record<string, unknown> | null | undefined)?.value ?? 0),
            cell: ({ row }) => `${getNumericValue(row.original.minStock)} ${getUnitValue(row.original.minStock)}`.trim(),
        },
        {
            id: "maxStock",
            header: "Máx.",
            enableSorting: true,
            accessorFn: (row) => Number((row.maxStock as Record<string, unknown> | null | undefined)?.value ?? 0),
            cell: ({ row }) => `${getNumericValue(row.original.maxStock)} ${getUnitValue(row.original.maxStock)}`.trim(),
        },
        {
            id: "wasteDefaultPct",
            header: "Perdida",
            enableSorting: true,
            accessorFn: (row) => Number((row.wasteDefaultPct as Record<string, unknown> | null | undefined)?.value ?? 0),
            cell: ({ row }) => getNumericValue(row.original.wasteDefaultPct) + " " + `%`,
        },
        {
            accessorKey: "isActive",
            header: "Activo",
            enableSorting: true,
            cell: ({ row }) => row.original.isActive ? (
                <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold leading-none text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300">
                    OK
                </span>
            ) : (
                <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-semibold leading-none text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
                    MIN
                </span>
            ),
        },
        {
            accessorKey: "updatedAt",
            header: "Actualizado",
            enableSorting: true,
            cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString(),
        },
    ], []);

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

            return matchesCategory && matchesSearch;
        });
    }, [activeBlock, searchTerm, catalogReferences]);

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
            .slice(0, 12);
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

    return (
        <section className="space-y-4">
            <Card className="relative">
                <CardHeader>
                    <CardTitle>Buscar ingrediente / artículo</CardTitle>
                </CardHeader>
                <CardAction className="absolute top-4 right-4">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="border-(--nav-active-border) bg-(--nav-active) text-(--nav-active-text) hover:border-(--nav-focus) hover:bg-(--nav-item-hover)"
                        aria-label="Mostrar información de búsqueda"
                        aria-expanded={showSearchInfo}
                        aria-controls="stock-search-description"
                        title="Información sobre la búsqueda"
                        onClick={() => setShowSearchInfo((visible) => !visible)}
                        onKeyDown={(event) => handleKeyboardActivation(event, () => setShowSearchInfo((visible) => !visible))}
                    >
                        <Info />
                        <span className="sr-only">Mostrar información de búsqueda</span>
                    </Button>
                </CardAction>
                <CardContent>
                    <Field aria-label="Búsqueda de stock">
                        {showSearchInfo && (
                            <FieldDescription id="stock-search-description">
                                Empieza a escribir para localizar un artículo, abrirlo en Stock y ver rápido mínimo, máximo, ubicación y estado.
                            </FieldDescription>
                        )}
                        <div ref={searchContainerRef} className="relative">
                            <FieldLabel htmlFor="stock-search"></FieldLabel>
                            <div className="mt-2 flex gap-2">
                                <Input
                                    id="stock-search"
                                    type="text"
                                    aria-label="Buscar artículo o ingrediente"
                                    placeholder="Buscar artículo, ver mín / max."
                                    value={searchTerm}
                                    onFocus={() => setIsSearchOpen(true)}
                                    onChange={(event) => {
                                        setSearchTerm(event.target.value);
                                        setIsSearchOpen(true);
                                        setActiveOptionIndex(-1);
                                    }}
                                    onKeyDown={(event) => {
                                        if (!searchOptions.length) {
                                            return;
                                        }

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
                                    className="flex-1"
                                    role="combobox"
                                    aria-controls="stock-search-options"
                                    aria-expanded={isSearchOpen}
                                    aria-autocomplete="list"
                                    aria-activedescendant={
                                        activeOptionIndex >= 0
                                            ? `stock-search-option-${activeOptionIndex}`
                                            : undefined
                                    }
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    aria-label="Limpiar búsqueda"
                                    disabled={!searchTerm}
                                    className="h-9"
                                    onClick={clearSearch}
                                    onKeyDown={(event) => handleKeyboardActivation(event, clearSearch)}
                                >
                                    Limpiar
                                </Button>
                            </div>
                            {isSearchOpen && searchOptions.length > 0 && (
                                <div
                                    id="stock-search-options"
                                    role="listbox"
                                    aria-label="Resultados de búsqueda"
                                    className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-border bg-background p-1 shadow-lg"
                                >
                                    {searchOptions.map((option, index) => (
                                        <button
                                            id={`stock-search-option-${index}`}
                                            key={option.label}
                                            type="button"
                                            role="option"
                                            aria-selected={activeOptionIndex === index}
                                            className={`flex min-h-12 w-full items-center rounded-md px-3 text-left text-sm text-foreground hover:bg-muted focus-visible:bg-muted focus-visible:outline-none ${activeOptionIndex === index ? "bg-muted" : ""}`}
                                            onMouseDown={(event) => event.preventDefault()}
                                            onClick={() => {
                                                selectSearchOption(option);
                                            }}
                                            onKeyDown={(event) => handleKeyboardActivation(event, () => selectSearchOption(option))}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Field>
                </CardContent>
            </Card>
            <Card className="relative">
                <CardHeader>
                    <CardTitle>Bloques de stock</CardTitle>
                    <CardAction className="absolute top-4 right-4">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="border-(--nav-active-border) bg-(--nav-active) text-(--nav-active-text) hover:border-(--nav-focus) hover:bg-(--nav-item-hover)"
                            aria-label="Mostrar información de bloques de stock"
                            aria-expanded={showBlockInfo}
                            aria-controls="stock-blocks-description"
                            title="Información sobre bloques de stock"
                            onClick={() => setShowBlockInfo((visible) => !visible)}
                            onKeyDown={(event) => handleKeyboardActivation(event, () => setShowBlockInfo((visible) => !visible))}
                        >
                            <Info />
                            <span className="sr-only">Mostrar información de bloques de stock</span>
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <ButtonGroup aria-label="Bloques de stock" className="w-full flex-wrap gap-2 *:data-[slot=button]:ml-0">
                        {["Frescos", "Producciones", "Congelados", "Secos", "Limpieza", "Pend. clasificar", "Sin ubicar", "Stock actual"].map((block) => (
                            <Button
                                key={block}
                                variant="outline"
                                className={activeBlock === block ? "mixzi-active-block border-(--nav-active-border) bg-(--nav-active) text-(--nav-active-text) hover:bg-(--nav-active) hover:text-(--nav-active-text)" : undefined}
                                aria-pressed={activeBlock === block}
                                onClick={() => setActiveBlock(block)}
                                onKeyDown={(event) => handleKeyboardActivation(event, () => setActiveBlock(block))}
                            >
                                {block}
                            </Button>
                        ))}
                    </ButtonGroup>
                </CardContent>
                {showBlockInfo && (
                    <CardFooter id="stock-blocks-description">
                        <CardDescription>
                            Se carga solo el bloque elegido para dejar la vista de Stock más limpia y ligera. En bloques operativos, cada artículo intenta mostrarse en su almacén principal coherente (Cámara o Economato) sin reescribir todavía el histórico real de movimientos.
                        </CardDescription>
                    </CardFooter>
                )}
            </Card>
            {activeBlockInfo && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {activeBlockInfo.title}
                        </CardTitle>
                        <CardDescription>{activeBlockInfo.description}</CardDescription>
                    </CardHeader>
                </Card>
            )}
            <div className={activeBlock === "Frescos" ? "min-w-0 md:grid md:items-stretch md:grid-cols-[320px_minmax(0,1fr)] md:gap-6" : ""}>
                {activeBlock === "Frescos" && (
                    <div className="hidden min-h-88 min-w-0 md:flex md:w-[320px] md:min-w-[320px] md:max-w-[320px]">
                        <StockMovementForm />
                    </div>
                )}
                <Card className="flex min-h-88 min-w-0 flex-col md:h-full">
                    {[
                        "Frescos",
                        "Producciones",
                        "Congelados",
                        "Secos",
                        "Limpieza",
                        "Pend. clasificar",
                        "Sin ubicar",
                        "Stock actual",
                    ].map((block) =>
                        activeBlock === block ? (
                            <div key={block} className="flex flex-1 flex-col">
                                <DataGrid
                                    className="mx-5 mb-0 flex-1 pb-0"
                                    data={filteredCatalogItems}
                                    columns={columns}
                                    loading={fetchingCatalog}
                                    emptyMessage="No catalog items available."
                                    ariaLabel={`Catalog items table for ${block}`}
                                    pageSize={5}
                                    showPagination
                                    getRowId={(row) => row.id}
                                />
                            </div>
                        ) : null,
                    )}
                </Card>
            </div>
            {activeBlock === "Frescos" && (
                <>
                    <Button
                        type="button"
                        variant="glass"
                        size="icon"
                        aria-label="Añadir movimiento"
                        title="Añadir movimiento"
                        ref={movementTriggerRef}
                        className="mixzi-mobile-glass-control fixed right-5 bottom-5 z-30 size-14 rounded-full shadow-lg md:hidden"
                        onClick={() => setIsMovementFormOpen(true)}
                        onKeyDown={(event) => handleKeyboardActivation(event, () => setIsMovementFormOpen(true))}
                    >
                        <Plus className="size-6" />
                    </Button>
                    {isMovementFormOpen && (
                        <div
                            className="stock-modal-backdrop fixed inset-0 z-40 flex items-end bg-black/45 p-4 md:hidden"
                            role="presentation"
                        >
                            <div
                                ref={movementDialogRef}
                                className="stock-modal-sheet relative max-h-[56vh] w-full overflow-hidden rounded-xl bg-background shadow-xl"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="mobile-movement-form-title"
                            >
                                <Button
                                    ref={movementCloseRef}
                                    type="button"
                                    variant="glass"
                                    size="icon"
                                    aria-label="Cerrar formulario de movimiento"
                                    title="Cerrar"
                                    className="mixzi-mobile-glass-control absolute top-3 right-3 z-10 rounded-full"
                                    onClick={() => setIsMovementFormOpen(false)}
                                    onKeyDown={(event) => handleKeyboardActivation(event, () => setIsMovementFormOpen(false))}
                                >
                                    <X />
                                </Button>
                                <div className="max-h-[56vh] overflow-y-auto pb-6 pt-6">
                                    <h2 id="mobile-movement-form-title" className="mb-4 ml-6 text-lg font-semibold">
                                        Registrar Movimiento
                                    </h2>
                                    <StockMovementForm showTitle={false} />
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}


        </section>
    );
});