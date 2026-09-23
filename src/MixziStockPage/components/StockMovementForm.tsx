import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { ChevronDown } from "lucide-react";
import { MOCKED_LOCATIONS, MOCKED_WAREHOUSES } from "@/mocks/catalogMocks";

type StockSelectableProps = {
    id: string;
    name: string;
    placeholder: string;
    options: readonly string[];
};

type StockMovementFormProps = {
    showTitle?: boolean;
};

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

export function StockMovementForm({ showTitle = true }: StockMovementFormProps) {
    return (
        <>
            <Card className="w-full min-w-0 rounded-none border-0 bg-transparent py-0 shadow-none md:w-[320px] md:min-w-[320px] md:max-w-[320px] md:rounded-xl md:border md:bg-card md:py-6 md:shadow-sm">
                {showTitle && <CardTitle className="ml-6">Registrar Movimiento</CardTitle>}
                <CardContent>
                    <Card className="min-w-0 w-full">
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
                    </Card>
                </CardContent>
            </Card>
        </>
    );
}
