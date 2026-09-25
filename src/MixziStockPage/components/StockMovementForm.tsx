import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  ArrowDownUp,
  Building2,
  Check,
  ChevronDown,
  Layers,
  MapPin,
  Minus,
  Package,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import {
  MOCKED_ARTICLE_NAMES,
  MOCKED_LOCATIONS,
  MOCKED_TYPES,
  MOCKED_UNITS,
  MOCKED_WAREHOUSES,
} from "@/mocks/catalogMocks";
import { Button } from "@/components/ui/button";

type StockSelectableProps = {
  id: string;
  name: string;
  placeholder: string;
  options: readonly string[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  icon?: React.ReactNode;
};

type StockMovementFormProps = {
  showTitle?: boolean;
  className?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

/* --- SELECTOR TÁCTIL Y ERGONÓMICO CON BÚSQUEDA --- */
function StockSelectable({
  id,
  name,
  placeholder,
  options,
  defaultValue = "",
  onChange,
  icon,
}: StockSelectableProps) {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOutsidePointer = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("pointerdown", handleOutsidePointer);
    return () => document.removeEventListener("pointerdown", handleOutsidePointer);
  }, []);

  const selectOption = (option: string) => {
    setSelectedValue(option);
    onChange?.(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen((prev) => {
            const next = !prev;
            if (next) {
              setTimeout(() => searchInputRef.current?.focus(), 80);
            }
            return next;
          });
        }}
        className={`group flex min-h-[44px] w-full items-center justify-between gap-2 rounded-xl border bg-background/80 px-3.5 py-2.5 text-left text-base md:text-sm font-medium transition-all duration-200 outline-none backdrop-blur-xs select-none active:scale-[0.99] ${
          isOpen
            ? "border-primary ring-2 ring-primary/20 shadow-xs"
            : "border-border/80 hover:border-primary/50 hover:bg-muted/30"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && (
            <span className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
              {icon}
            </span>
          )}
          <span
            className={`block truncate ${
              selectedValue ? "font-semibold text-foreground" : "text-muted-foreground font-normal"
            }`}
          >
            {selectedValue || placeholder}
          </span>
        </div>
        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={name}
          className="absolute top-full left-0 right-0 z-50 mt-1.5 max-h-64 w-full overflow-hidden rounded-xl border border-border bg-popover/95 p-1.5 shadow-xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150"
        >
          {options.length > 5 && (
            <div className="p-1 mb-1 border-b border-border/60">
              <div className="relative flex items-center">
                <Search className="absolute left-2.5 size-3.5 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar opción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg bg-muted/60 pl-8 pr-7 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:bg-muted focus:ring-1 focus:ring-primary/40"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 p-0.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="max-h-48 overflow-y-auto space-y-0.5 overscroll-contain">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = selectedValue === option;
                return (
                  <div
                    key={option}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => selectOption(option)}
                    className={`flex min-h-[40px] md:min-h-[36px] w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                      isSelected
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-foreground hover:bg-muted/80 active:bg-muted"
                    }`}
                  >
                    <span className="truncate">{option}</span>
                    {isSelected && <Check className="size-4 shrink-0 text-primary" />}
                  </div>
                );
              })
            ) : (
              <div className="py-4 text-center text-xs text-muted-foreground">
                No hay coincidencias
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* --- AUTOCOMPLETE PROGRESIVO DE ARTÍCULOS --- */
function StockArticleAutocomplete({ id, name, placeholder, options }: StockSelectableProps) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, []);

  const normalized = inputValue.trim().toLowerCase();
  const filteredOptions = normalized
    ? options
        .filter((opt) => opt.toLowerCase().includes(normalized))
        .sort((a, b) => {
          const aStarts = a.toLowerCase().startsWith(normalized);
          const bStarts = b.toLowerCase().startsWith(normalized);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return a.localeCompare(b);
        })
        .slice(0, 7)
    : [];

  const selectOption = (opt: string) => {
    setInputValue(opt);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <Package className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
        <input
          id={id}
          type="text"
          name={name}
          autoComplete="off"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(e.target.value.trim().length > 0);
          }}
          onFocus={() => inputValue.trim().length > 0 && setIsOpen(true)}
          className="flex min-h-[44px] w-full rounded-xl border border-border/80 bg-background/80 pl-10 pr-9 py-2.5 text-base md:text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
        />
        {inputValue && (
          <button
            type="button"
            onClick={() => {
              setInputValue("");
              setIsOpen(false);
              document.getElementById(id)?.focus();
            }}
            className="absolute right-3 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Limpiar artículo"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div
          role="listbox"
          className="absolute top-full left-0 right-0 z-50 mt-1.5 max-h-56 overflow-y-auto rounded-xl border border-border bg-popover/95 p-1.5 shadow-xl backdrop-blur-md animate-in fade-in-0 duration-150"
        >
          {filteredOptions.map((opt) => (
            <div
              key={opt}
              role="option"
              onClick={() => selectOption(opt)}
              className="flex min-h-[40px] md:min-h-[36px] w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted/80 active:bg-muted transition-colors"
            >
              <span className="font-medium truncate">{opt}</span>
              <span className="text-[11px] font-mono text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                Insumo
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* --- FORMULARIO PRINCIPAL DE MOVIMIENTO DE STOCK --- */
export function StockMovementForm({
  showTitle = true,
  className,
  onSuccess,
  onCancel,
}: StockMovementFormProps) {
  const [quantity, setQuantity] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const handleStep = (step: number) => {
    const current = parseFloat(quantity.replace(",", ".")) || 0;
    const next = Math.max(0, current + step);
    setQuantity(next === 0 ? "" : next.toString());
  };

  const setPreset = (preset: number) => {
    const current = parseFloat(quantity.replace(",", ".")) || 0;
    const next = current + preset;
    setQuantity(next.toString());
  };

  return (
    <Card
      className={`relative flex flex-col h-full overflow-hidden border border-border/80 bg-card rounded-2xl shadow-xs ${
        className || ""
      }`.trim()}
    >
      {showTitle && (
        <CardHeader className="p-4 md:p-5 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <ArrowDownUp className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold tracking-tight text-foreground">
                Registrar Movimiento
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Entradas, salidas o ajustes de inventario
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent className="flex-1 overflow-y-auto p-4 md:p-5 space-y-5">
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            onSuccess?.();
          }}
          aria-label="Formulario de movimiento de stock"
        >
          {/* SECCIÓN 1: ¿DÓNDE? */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                1
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Ubicación
              </span>
            </div>

            <div className="grid gap-3">
              <Field className="min-w-0">
                <FieldLabel htmlFor="stock-movement-location" className="text-xs font-medium">
                  Local <span className="text-rose-500">*</span>
                </FieldLabel>
                <StockSelectable
                  id="stock-movement-location"
                  name="location"
                  placeholder="Selecciona un local"
                  defaultValue={MOCKED_LOCATIONS[0]}
                  options={MOCKED_LOCATIONS}
                  icon={<MapPin className="size-4" />}
                />
              </Field>

              <Field className="min-w-0">
                <FieldLabel htmlFor="stock-movement-warehouse" className="text-xs font-medium">
                  Almacén <span className="text-rose-500">*</span>
                </FieldLabel>
                <StockSelectable
                  id="stock-movement-warehouse"
                  name="warehouse"
                  placeholder="Selecciona un almacén"
                  defaultValue={MOCKED_WAREHOUSES[0]}
                  options={MOCKED_WAREHOUSES}
                  icon={<Building2 className="size-4" />}
                />
              </Field>
            </div>
          </div>

          <div className="h-px bg-border/60" />

          {/* SECCIÓN 2: ¿QUÉ Y CUÁNTO? */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                2
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Detalles del Insumo
              </span>
            </div>

            <div className="grid gap-3">
              <Field className="min-w-0">
                <FieldLabel htmlFor="stock-movement-article" className="text-xs font-medium">
                  Artículo / Insumo <span className="text-rose-500">*</span>
                </FieldLabel>
                <StockArticleAutocomplete
                  id="stock-movement-article"
                  name="article"
                  placeholder="Escribe (ej. Tomate, Leche...)"
                  options={MOCKED_ARTICLE_NAMES}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field className="min-w-0">
                  <FieldLabel htmlFor="stock-movement-type" className="text-xs font-medium">
                    Tipo de Operación <span className="text-rose-500">*</span>
                  </FieldLabel>
                  <StockSelectable
                    id="stock-movement-type"
                    name="type"
                    placeholder="Tipo"
                    defaultValue={MOCKED_TYPES[0]}
                    options={MOCKED_TYPES}
                    icon={<Tag className="size-4" />}
                  />
                </Field>

                <Field className="min-w-0">
                  <FieldLabel htmlFor="stock-movement-unit" className="text-xs font-medium">
                    Unidad de Medida <span className="text-rose-500">*</span>
                  </FieldLabel>
                  <StockSelectable
                    id="stock-movement-unit"
                    name="unit"
                    placeholder="Unidad"
                    defaultValue={MOCKED_UNITS[0]}
                    options={MOCKED_UNITS}
                    icon={<Layers className="size-4" />}
                  />
                </Field>
              </div>

              {/* ENTRADA NUMÉRICA ERGONÓMICA PARA MÓVIL Y DESKTOP */}
              <Field className="min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <FieldLabel htmlFor="stock-movement-quantity" className="text-xs font-medium">
                    Cantidad <span className="text-rose-500">*</span>
                  </FieldLabel>
                  {quantity && (
                    <button
                      type="button"
                      onClick={() => setQuantity("")}
                      className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <RotateCcw className="size-3" /> Limpiar
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Botón Decremento táctil */}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleStep(-1)}
                    className="size-11 shrink-0 rounded-xl border-border/80 active:scale-95"
                    aria-label="Restar 1"
                  >
                    <Minus className="size-4" />
                  </Button>

                  {/* Input numérico optimizado para móviles */}
                  <div className="relative flex-1 min-w-0">
                    <input
                      id="stock-movement-quantity"
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*[.,]?[0-9]*"
                      name="quantity"
                      placeholder="0.00"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="flex min-h-[44px] w-full rounded-xl border border-border/80 bg-background/80 px-3.5 py-2.5 text-center text-lg md:text-base font-mono font-bold text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                    />
                  </div>

                  {/* Botón Incremento táctil */}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleStep(1)}
                    className="size-11 shrink-0 rounded-xl border-border/80 active:scale-95"
                    aria-label="Sumar 1"
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>

                {/* Chips rápidos de cantidad para facilitar la carga táctil */}
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[11px] text-muted-foreground mr-1">Rápido:</span>
                  {[1, 5, 10, 25].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setPreset(preset)}
                      className="rounded-lg border border-border/60 bg-muted/40 hover:bg-muted px-2 py-1 text-[11px] font-mono font-medium text-foreground transition-all active:scale-95"
                    >
                      +{preset}
                    </button>
                  ))}
                </div>
              </Field>

              {/* NOTA OPCIONAL */}
              <Field className="min-w-0">
                <FieldLabel htmlFor="stock-movement-note" className="text-xs font-medium">
                  Nota u observación
                </FieldLabel>
                <input
                  id="stock-movement-note"
                  type="text"
                  name="note"
                  placeholder="Ej. Lote urgente de proveedor, merma por rotura..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="flex min-h-[42px] w-full rounded-xl border border-border/80 bg-background/80 px-3.5 py-2 text-base md:text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                />
              </Field>
            </div>
          </div>

          {/* ACCIONES Y BOTONES UNIFICADOS */}
          <div className="pt-2 space-y-2">
            <Button
              type="submit"
              className="w-full min-h-[44px] rounded-xl font-semibold shadow-xs flex items-center justify-center gap-2 text-sm"
            >
              <Check className="size-4" />
              Guardar y Registrar Movimiento
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 min-h-[40px] rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setQuantity("");
                  setNote("");
                }}
              >
                Limpiar Datos
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1 min-h-[40px] rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground"
                  onClick={onCancel}
                >
                  Cerrar
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
