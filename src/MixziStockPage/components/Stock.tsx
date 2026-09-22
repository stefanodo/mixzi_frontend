import { useMainStore } from "@/context/MainContext";
import { useEffect, useMemo, useRef, useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { observer } from "mobx-react-lite";
import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid";
import type { StockLotResponseDto } from "@/_generated";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const getDisplayValue = (value: unknown) => {
    if (value === null || value === undefined) {
        return "";
    }

    if (typeof value === "object") {
        const record = value as Record<string, unknown>;
        return String(record.supplierName ?? record.name ?? record.id ?? "");
    }

    return String(value);
};

export const Stock = observer(() => {
    const [activeBlock, setActiveBlock] = useState("Stock actual");
    const [showBlockInfo, setShowBlockInfo] = useState(false);
    const [showSearchInfo, setShowSearchInfo] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeOptionIndex, setActiveOptionIndex] = useState(-1);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const {
        stockStore: {
            stockLotReferences,
            fetchingStockLots,
            fetchStockLots,
        }
    } = useMainStore();

    useEffect(() => {
        fetchStockLots();
    }, [fetchStockLots]);

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

    const columns = useMemo<DataGridColumn<StockLotResponseDto>[]>(() => [
        {
            accessorKey: "itemId",
            header: "Articulo",
            enableSorting: true,
        },
        {
            accessorKey: "locationId",
            header: "Ubicacion",
            enableSorting: true,
        },
        {
            accessorKey: "supplierId.supplierName",
            header: "Supplier",
            enableSorting: true,
        },
        {
            accessorKey: "quantityReceived",
            header: "Received",
            enableSorting: true,
        },
        {
            accessorKey: "quantityRemaining",
            header: "Remaining",
            enableSorting: true,
        },
        {
            accessorKey: "unitCost",
            header: "Unit Cost",
            cell: ({ row }) => `$${Number(row.original.unitCost ?? 0).toFixed(2)}`,
            enableSorting: true,
        },
        {
            accessorKey: "receivedAt",
            header: "Received At",
            cell: ({ row }) => new Date(row.original.receivedAt).toLocaleString(),
            enableSorting: true,
        }
    ], []);

    const filteredStockLots = useMemo(() => {
        const normalizedSearchTerm = searchTerm.trim().toLowerCase();

        if (!normalizedSearchTerm) {
            return stockLotReferences;
        }

        return stockLotReferences.filter((stockLot) =>
            [stockLot.itemId, stockLot.locationId, getDisplayValue(stockLot.supplierId)]
                .some((value) => value.toLowerCase().includes(normalizedSearchTerm)),
        );
    }, [searchTerm, stockLotReferences]);

    const searchOptions = useMemo(() => {
        const options = new Map<string, { label: string; value: string }>();
        stockLotReferences.forEach((stockLot) => {
            const supplier = getDisplayValue(stockLot.supplierId);
            const optionValue = stockLot.itemId;
            const optionLabel = [stockLot.itemId, stockLot.locationId, supplier]
                .filter(Boolean)
                .join(" - ");

            if (optionValue && optionLabel) {
                options.set(`${optionValue}-${stockLot.locationId}-${supplier}`, {
                    label: optionLabel,
                    value: optionValue,
                });
            }
        });

        const normalizedSearchTerm = searchTerm.trim().toLowerCase();
        return Array.from(options.values())
            .filter((option) => option.label.toLowerCase().includes(normalizedSearchTerm))
            .slice(0, 12);
    }, [searchTerm, stockLotReferences]);

    const clearSearch = () => {
        setSearchTerm("");
        setIsSearchOpen(false);
        setActiveOptionIndex(-1);
    };

    const selectSearchOption = (optionValue: string) => {
        setSearchTerm(optionValue);
        setIsSearchOpen(false);
        setActiveOptionIndex(-1);
    };

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
                    >
                        <Info />
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
                            <FieldLabel htmlFor="stock-search">Buscar en stock</FieldLabel>
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
                                            selectSearchOption(searchOptions[activeOptionIndex].value);
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
                                                selectSearchOption(option.value);
                                            }}
                                            onKeyDown={(event) => {
                                                if (event.key === "Enter" || event.key === " ") {
                                                    event.preventDefault();
                                                    selectSearchOption(option.value);
                                                }
                                            }}
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
                        >
                            <Info />
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <ButtonGroup aria-label="Bloques de stock" className="w-full flex-wrap gap-2 *:data-[slot=button]:ml-0">
                        {["Frescos", "Producciones", "Congelados", "Secos", "Limpieza", "Pend. clasificar", "Sin ubicar", "Stock actual"].map((block) => (
                            <Button
                                key={block}
                                variant={activeBlock === block ? "default" : "outline"}
                                aria-pressed={activeBlock === block}
                                onClick={() => setActiveBlock(block)}
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
            <Card>
                <DataGrid
                    className="mx-5"
                    data={filteredStockLots}
                    columns={columns}
                    loading={fetchingStockLots}
                    emptyMessage="No stock lots available."
                    ariaLabel="Stock lots table"
                    pageSize={5}
                    showPagination
                    getRowId={(row) => row.id}
                />
            </Card>


        </section>
    );
});