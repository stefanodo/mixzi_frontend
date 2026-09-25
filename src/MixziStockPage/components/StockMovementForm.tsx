import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { ChevronDown } from "lucide-react";
import { MOCKED_ARTICLE_NAMES, MOCKED_LOCATIONS, MOCKED_TYPES, MOCKED_UNITS, MOCKED_WAREHOUSES } from "@/mocks/catalogMocks";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";

type StockSelectableProps = {
    id: string;
    name: string;
    placeholder: string;
    options: readonly string[];
};

type StockMovementFormProps = {
    showTitle?: boolean;
    className?: string;
};

function StockArticleAutocomplete({ id, name, placeholder, options }: StockSelectableProps) {
    const [inputValue, setInputValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsidePointerDown = (event: PointerEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("pointerdown", handleOutsidePointerDown);
        return () => document.removeEventListener("pointerdown", handleOutsidePointerDown);
    }, []);

    const filteredOptions = inputValue
        ? options.filter((option) =>
            option.toLowerCase().includes(inputValue.toLowerCase())
          )
        : [];

    const selectOption = (option: string) => {
        setInputValue(option);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="relative min-w-0 w-full max-w-full">
            <input
                id={id}
                type="text"
                name={name}
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    setIsOpen(e.target.value.length > 0);
                }}
                onFocus={() => inputValue.length > 0 && setIsOpen(true)}
                onKeyDown={(event) => {
                    if (event.key === "Escape") {
                        setIsOpen(false);
                    }
                }}
                className="border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex h-10 min-w-0 w-full max-w-full flex-none items-center justify-start overflow-hidden rounded-md border px-3 text-left text-sm outline-none focus-visible:ring-3"
            />
            {isOpen && filteredOptions.length > 0 && (
                <div
                    role="listbox"
                    aria-label={name}
                    className="absolute top-full left-0 z-20 mt-1 max-h-60 min-w-0 w-full max-w-full overflow-x-hidden overflow-y-auto rounded-md border border-border bg-background p-1 text-left shadow-lg"
                >
                    {filteredOptions.map((option) => (
                        <div
                            key={option}
                            role="option"
                            className="flex min-h-10 min-w-0 w-full items-center justify-start overflow-hidden rounded-sm px-3 text-left text-sm hover:bg-muted focus-visible:bg-muted focus-visible:outline-none cursor-pointer"
                            onClick={() => selectOption(option)}
                        >
                            <span className="min-w-0 truncate">{option}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function StockSelectable({ id, name, placeholder, options }: StockSelectableProps) {
    const [selectedValue, setSelectedValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsidePointerDown = (event: PointerEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("pointerdown", handleOutsidePointerDown);
        return () => document.removeEventListener("pointerdown", handleOutsidePointerDown);
    }, []);

    const selectOption = (option: string) => {
        setSelectedValue(option);
        setIsOpen(false);
    };

    const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "Escape") {
            setIsOpen(false);
            return;
        }

        if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsOpen(true);
            requestAnimationFrame(() => {
                document.getElementById(`${id}-option-0`)?.focus();
            });
        }
    };

    return (
        <div ref={containerRef} className="relative min-w-0 w-full max-w-full">
            <button
                id={id}
                type="button"
                className="border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex h-10 min-w-0 w-full max-w-full flex-none items-center justify-start overflow-hidden rounded-md border px-3 pr-10 text-left text-sm outline-none focus-visible:ring-3"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={`${id}-options`}
                onClick={() => setIsOpen((open) => !open)}
                onKeyDown={handleTriggerKeyDown}
            >
                <span className={`block min-w-0 max-w-full truncate ${selectedValue ? "text-foreground" : "text-muted-foreground"}`}>
                    {selectedValue || placeholder}
                </span>
                <ChevronDown
                    aria-hidden="true"
                    className={`pointer-events-none absolute right-4 size-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>
            {isOpen && (
                <div
                    id={`${id}-options`}
                    role="listbox"
                    aria-label={name}
                    className="absolute top-full left-0 z-20 mt-1 max-h-60 min-w-0 w-full max-w-full overflow-x-hidden overflow-y-auto rounded-md border border-border bg-background p-1 text-left shadow-lg"
                >
                    {options.map((option, index) => (
                        <div
                            id={`${id}-option-${index}`}
                            key={option}
                            role="option"
                            tabIndex={0}
                            title={option}
                            className="flex min-h-10 min-w-0 w-full items-center justify-start overflow-hidden rounded-sm px-3 text-left text-sm hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                            aria-selected={selectedValue === option}
                            onClick={() => selectOption(option)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    selectOption(option);
                                    return;
                                }

                                if (event.key === "Escape") {
                                    event.preventDefault();
                                    setIsOpen(false);
                                    document.getElementById(id)?.focus();
                                    return;
                                }

                                if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Home" || event.key === "End") {
                                    event.preventDefault();
                                    const nextIndex = event.key === "Home"
                                        ? 0
                                        : event.key === "End"
                                            ? options.length - 1
                                            : Math.max(0, Math.min(
                                                options.length - 1,
                                                index + (event.key === "ArrowDown" ? 1 : -1),
                                            ));
                                    document.getElementById(`${id}-option-${nextIndex}`)?.focus();
                                }
                            }}
                        >
                            <span className="min-w-0 truncate">{option}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
export function StockMovementForm({ showTitle = true, className }: StockMovementFormProps) {
    return (
        <>
            <Card className={`w-full min-w-0 rounded-none border-0 bg-transparent py-0 shadow-none md:w-full md:rounded-xl md:border md:bg-card md:py-6 md:shadow-sm md:h-full md:flex md:flex-col ${className || ""}`.trim()}>
                {showTitle && <CardTitle className="ml-6">Registrar Movimiento</CardTitle>}
                <CardContent className="md:flex-1 md:flex md:flex-col p-4 md:p-6 pt-0">
                    <Card className="min-w-0 w-full md:flex-1 md:flex md:flex-col justify-between">
                        <CardContent className="min-w-0 md:pr-8">
                            <CardTitle className="mb-4">¿Dónde?</CardTitle>
                            <Separator />
                            <form className="grid min-w-0 gap-4 mt-4" aria-label="Formulario de movimiento de stock">
                                <fieldset className="grid min-w-0 gap-4">
                                    <legend className="sr-only">Ubicación del movimiento</legend>
                                    <Field className="min-w-0">
                                        <FieldLabel htmlFor="stock-movement-location">Local *</FieldLabel>
                                        <StockSelectable
                                            id="stock-movement-location"
                                            name="location"
                                            placeholder="Selecciona un local"
                                            options={MOCKED_LOCATIONS}
                                        />
                                    </Field>
                                    <Field className="min-w-0">
                                        <FieldLabel htmlFor="stock-movement-warehouse">Almacen *</FieldLabel>
                                        <StockSelectable
                                            id="stock-movement-warehouse"
                                            name="warehouse"
                                            placeholder="Selecciona un almacen"
                                            options={MOCKED_WAREHOUSES}
                                        />
                                    </Field>
                                </fieldset>
                            </form>
                        </CardContent>
                        <CardContent className="min-w-0 md:pr-8">
                            <CardTitle className="mb-4">¿Qué y cuánto?</CardTitle>
                            <Separator />
                            <form className="grid min-w-0 gap-4 mt-4" aria-label="Formulario de movimiento de stock">
                                <fieldset className="grid min-w-0 gap-4">
                                    <legend className="sr-only">Ubicación del movimiento</legend>
                                    <Field className="min-w-0">
                                        <FieldLabel htmlFor="stock-movement-article">Artículo *</FieldLabel>
                                        <StockArticleAutocomplete
                                            id="stock-movement-article"
                                            name="article"
                                            placeholder="Escribe (ej. patata, sal...)"
                                            options={MOCKED_ARTICLE_NAMES}
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">Empieza a escribir y selecciona del listado del navegador</p>
                                    </Field>
                                    <Field className="min-w-0">
                                        <FieldLabel htmlFor="stock-movement-type">Tipo *</FieldLabel>
                                        <StockSelectable
                                            id="stock-movement-type"
                                            name="type"
                                            placeholder="Selecciona un tipo"
                                            options={MOCKED_TYPES}
                                        />
                                    </Field>
                                    <Field className="min-w-0">
                                        <FieldLabel htmlFor="stock-movement-quantity">Cantidad *</FieldLabel>
                                        <div className="flex gap-2">
                                            <input
                                                id="stock-movement-quantity"
                                                type="number"
                                                name="quantity"
                                                placeholder="0,000"
                                                step="0.001"
                                                min="0"
                                                className="border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex h-10 min-w-0 flex-1 items-center justify-start overflow-hidden rounded-md border px-3 text-left text-sm outline-none focus-visible:ring-3"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <StockSelectable
                                                    id="stock-movement-unit"
                                                    name="unit"
                                                    placeholder="Unidad"
                                                    options={MOCKED_UNITS}
                                                />
                                            </div>
                                        </div>
                                    </Field>
                                    <Field className="min-w-0">
                                        <FieldLabel htmlFor="stock-movement-note">Nota</FieldLabel>
                                        <input
                                            id="stock-movement-note"
                                            type="text"
                                            name="note"
                                            placeholder="Opcional"
                                            className="border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex h-10 min-w-0 w-full max-w-full flex-none items-center justify-start overflow-hidden rounded-md border px-3 text-left text-sm outline-none focus-visible:ring-3"
                                        />
                                    </Field>
                                </fieldset>
                                <ButtonGroup className="justify-between">
                                    <Button type="submit" variant="primary" className="h-10">
                                        <span className="font-medium md:text-[11px]">Guardar y seguir</span>
                                    </Button>
                                    <Button type="button" variant="secondary" className="h-10">
                                        <span className="font-medium md:text-[11px]">Guardar y Salir</span>
                                    </Button>
                                </ButtonGroup>
                                <ButtonGroup className="justify-items-start">
                                    <Button type="button" variant="tertiary" className="h-10">
                                        <span className="font-medium md:text-[11px]">Actualizar</span>
                                    </Button>
                                </ButtonGroup>
                            </form>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </>
    );
}
