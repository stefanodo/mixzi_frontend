import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AlertTriangle, 
  TrendingUp, 
  PackageCheck, 
  PieChart as PieChartIcon, 
  BarChart3, 
  Activity,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Info,
  Calendar,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  CheckCircle2
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoutePaths } from "@/router/routes";

export interface InventoryChartsProps {
  compact?: boolean;
  detailedOnly?: boolean;
  onSelectCategory?: (category: string) => void;
}

// Sub-datos para drill-down por categoría
interface SubProduct {
  name: string;
  qty: string;
  value: string;
  status: "ok" | "warning" | "danger";
}

const categoryDetails: Record<string, SubProduct[]> = {
  "Bebidas & Bodega": [
    { name: "Cerveza Barril 50L (Estrella)", qty: "4 barriles", value: "€580", status: "danger" },
    { name: "Vino Ribera Crianza 75cl", qty: "36 botellas", value: "€432", status: "warning" },
    { name: "Ginebra Premium Tanqueray", qty: "12 botellas", value: "€264", status: "ok" },
    { name: "Agua Mineral 50cl (Pack 24)", qty: "20 packs", value: "€160", status: "ok" },
  ],
  "Carnes & Aves": [
    { name: "Solomillo de Ternera Madurado", qty: "3.5 kg", value: "€122.50", status: "danger" },
    { name: "Pechuga de Pollo Corral", qty: "18 kg", value: "€144", status: "ok" },
    { name: "Secreto Ibérico", qty: "6.2 kg", value: "€105", status: "warning" },
    { name: "Hamburguesas Angus 200g", qty: "45 uds", value: "€135", status: "ok" },
  ],
  "Frutas & Verduras": [
    { name: "Aguacates Hass Calibre 12", qty: "2 kg", value: "€16", status: "danger" },
    { name: "Tomate Pera Rama", qty: "15 kg", value: "€33", status: "ok" },
    { name: "Patata Monalisa Especial Fritura", qty: "50 kg", value: "€60", status: "ok" },
    { name: "Limones de Huerto", qty: "4 kg", value: "€9.60", status: "warning" },
  ],
  "Secos & Despensa": [
    { name: "Aceite de Oliva Virgen Extra 5L", qty: "4 L", value: "€38", status: "danger" },
    { name: "Arroz Bomba Especial Paellas", qty: "25 kg", value: "€75", status: "ok" },
    { name: "Harina de Trigo Panificable", qty: "40 kg", value: "€36", status: "ok" },
    { name: "Sal Marina Gruesa", qty: "15 kg", value: "€12", status: "ok" },
  ],
  "Lácteos & Huevos": [
    { name: "Leche Entera Fresca Hostelería", qty: "5 L", value: "€6.50", status: "danger" },
    { name: "Queso Mozzarella Barra", qty: "8 kg", value: "€64", status: "ok" },
    { name: "Huevos Camperos L (Caja 180)", qty: "1 caja", value: "€38", status: "warning" },
    { name: "Mantequilla Francesa 1kg", qty: "4 kg", value: "€42", status: "ok" },
  ],
};

// Productos desglosados por estado de salud
const healthDetails = {
  optimal: [
    { name: "Pechuga de Pollo Corral", stock: "18 kg", coverage: "14 días", category: "Carnes" },
    { name: "Arroz Bomba Especial", stock: "25 kg", coverage: "20 días", category: "Despensa" },
    { name: "Patatas Monalisa", stock: "50 kg", coverage: "12 días", category: "Verduras" },
    { name: "Agua Mineral 50cl", stock: "20 packs", coverage: "18 días", category: "Bebidas" },
  ],
  warning: [
    { name: "Vino Ribera Crianza", stock: "6 botellas", min: "12 botellas", coverage: "3 días", category: "Bebidas" },
    { name: "Limones de Huerto", stock: "4 kg", min: "8 kg", coverage: "4 días", category: "Verduras" },
    { name: "Huevos Camperos", stock: "1 caja", min: "2 cajas", coverage: "2 días", category: "Lácteos" },
    { name: "Secreto Ibérico", stock: "6.2 kg", min: "10 kg", coverage: "3 días", category: "Carnes" },
  ],
  critical: [
    { name: "Cerveza Barril 50L (Estrella)", stock: "1 barril", min: "4 barriles", coverage: "< 1 día", category: "Bebidas" },
    { name: "Solomillo de Ternera", stock: "3.5 kg", min: "10 kg", coverage: "1 día", category: "Carnes" },
    { name: "Aceite Oliva Virgen Extra", stock: "4 L", min: "15 L", coverage: "1 día", category: "Despensa" },
    { name: "Aguacates Hass", stock: "2 kg", min: "8 kg", coverage: "< 1 día", category: "Verduras" },
    { name: "Leche Entera Fresca", stock: "5 L", min: "20 L", coverage: "1 día", category: "Lácteos" },
    { name: "Gambas Rojas Congeladas", stock: "1.8 kg", min: "5 kg", coverage: "1 día", category: "Pescados" },
  ]
};

export const InventoryCharts: React.FC<InventoryChartsProps> = ({
  compact = false,
  detailedOnly = false,
  onSelectCategory
}) => {
  const navigate = useNavigate();

  // Estados interactivos para drill-down
  const [selectedHealthFilter, setSelectedHealthFilter] = useState<"optimal" | "warning" | "critical" | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [rotationFilter, setRotationFilter] = useState<"all" | "alert">("all");
  const [expandedRotationItem, setExpandedRotationItem] = useState<string | null>(null);

  // 1. Datos Estado de Salud
  const stockHealth = [
    { id: "optimal" as const, label: "Nivel Óptimo", count: 142, percentage: 72, color: "bg-emerald-500", text: "text-emerald-500", border: "border-emerald-500/40", bgLight: "bg-emerald-500/10" },
    { id: "warning" as const, label: "Stock Bajo (Alerta)", count: 28, percentage: 18, color: "bg-amber-500", text: "text-amber-500", border: "border-amber-500/40", bgLight: "bg-amber-500/10" },
    { id: "critical" as const, label: "Crítico / Por Agotar", count: 6, percentage: 10, color: "bg-rose-500", text: "text-rose-500", border: "border-rose-500/40", bgLight: "bg-rose-500/10" }
  ];

  // 2. Datos Distribución por Categoría de Restauración
  const categories = [
    { name: "Bebidas & Bodega", value: "34%", amount: "€4,820", items: 58, stroke: "#3b82f6", dash: "34 66", offset: 0 },
    { name: "Carnes & Aves", value: "26%", amount: "€3,710", items: 34, stroke: "#ef4444", dash: "26 74", offset: -34 },
    { name: "Frutas & Verduras", value: "18%", amount: "€2,490", items: 42, stroke: "#10b981", dash: "18 82", offset: -60 },
    { name: "Secos & Despensa", value: "14%", amount: "€1,980", items: 31, stroke: "#f59e0b", dash: "14 86", offset: -78 },
    { name: "Lácteos & Huevos", value: "8%", amount: "€1,120", items: 19, stroke: "#8b5cf6", dash: "8 92", offset: -92 },
  ];

  // 3. Datos Flujo Semanal (Consumo vs Reposición)
  const weeklyFlow = [
    { day: "Lun", inVal: 65, outVal: 40, inKg: "320kg", outKg: "210kg", note: "Recepción de bodega y lácteos" },
    { day: "Mar", inVal: 45, outVal: 50, inKg: "180kg", outKg: "240kg", note: "Servicio medio de mediodía" },
    { day: "Mié", inVal: 50, outVal: 55, inKg: "220kg", outKg: "260kg", note: "Entrada de carnes maduradas" },
    { day: "Jue", inVal: 80, outVal: 70, inKg: "410kg", outKg: "340kg", note: "Preparación mise en place fin de semana" },
    { day: "Vie", inVal: 95, outVal: 90, inKg: "580kg", outKg: "520kg", note: "Pico de entrada y servicio nocturno" },
    { day: "Sáb", inVal: 30, outVal: 98, inKg: "120kg", outKg: "590kg", note: "Máximo consumo semanal en comedor" },
    { day: "Dom", inVal: 20, outVal: 85, inKg: "90kg", outKg: "490kg", note: "Cierre de semana y preparación de pedido" }
  ];

  // 4. Datos Top Insumos con Mayor Rotación Diaria
  const topRotationItems = [
    { 
      name: "Cerveza Barril 50L (Estrella)", 
      category: "Bebidas", 
      usagePct: 94, 
      units: "18 barriles/sem", 
      alert: true,
      stockActual: "1 barril",
      stockMin: "4 barriles",
      consumoDiario: "2.8 barriles/día",
      proveedor: "Damm Distribución"
    },
    { 
      name: "Solomillo de Ternera Madurado", 
      category: "Carnes", 
      usagePct: 82, 
      units: "42 kg/sem", 
      alert: true,
      stockActual: "3.5 kg",
      stockMin: "10 kg",
      consumoDiario: "6 kg/día",
      proveedor: "Cárnicas Sierra"
    },
    { 
      name: "Queso Mozzarella Fresca", 
      category: "Lácteos", 
      usagePct: 76, 
      units: "28 kg/sem", 
      alert: false,
      stockActual: "8 kg",
      stockMin: "6 kg",
      consumoDiario: "4 kg/día",
      proveedor: "Lácteos Central"
    },
    { 
      name: "Aceite de Oliva Virgen Extra", 
      category: "Despensa", 
      usagePct: 68, 
      units: "50 L/sem", 
      alert: true,
      stockActual: "4 L",
      stockMin: "15 L",
      consumoDiario: "7 L/día",
      proveedor: "Almazara Sur"
    },
    { 
      name: "Tomate Pera Rama", 
      category: "Verduras", 
      usagePct: 62, 
      units: "65 kg/sem", 
      alert: false,
      stockActual: "15 kg",
      stockMin: "12 kg",
      consumoDiario: "9.2 kg/día",
      proveedor: "Mercamadrid Frescos"
    },
  ];

  // FILTRADO DE ITEMS DE ROTACION
  const displayedRotationItems = rotationFilter === "alert" 
    ? topRotationItems.filter(item => item.alert)
    : topRotationItems;

  /* ================== GRÁFICO 1: SALUD DEL STOCK (INTERACTIVO) ================== */
  const renderStockHealthCard = () => (
    <Card className="border border-border/80 bg-card hover:border-primary/40 transition-all shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <PackageCheck className="size-4 text-emerald-500" />
              Salud del Stock & Reposición
            </CardTitle>
            <CardDescription className="text-xs">
              Haz clic en cualquier estado para desplegar los artículos concretos.
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(RoutePaths.MixziStock)}
            className="text-xs h-7 gap-1 text-muted-foreground hover:text-foreground"
          >
            <span>Ver Stock</span>
            <ExternalLink className="size-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Barra Segmentada Animada e Interactiva */}
        <div className="space-y-2">
          <div className="h-3.5 w-full rounded-full bg-muted/60 overflow-hidden flex gap-1 p-0.5 cursor-pointer">
            <div 
              style={{ width: "72%" }} 
              onClick={() => setSelectedHealthFilter(selectedHealthFilter === "optimal" ? null : "optimal")}
              className={`h-full bg-emerald-500 rounded-l-full transition-all duration-300 hover:brightness-110 ${
                selectedHealthFilter === "optimal" ? "ring-2 ring-emerald-400 scale-y-110" : ""
              }`} 
              title="Clic para ver 142 artículos óptimos"
            />
            <div 
              style={{ width: "18%" }} 
              onClick={() => setSelectedHealthFilter(selectedHealthFilter === "warning" ? null : "warning")}
              className={`h-full bg-amber-500 transition-all duration-300 hover:brightness-110 ${
                selectedHealthFilter === "warning" ? "ring-2 ring-amber-400 scale-y-110" : ""
              }`} 
              title="Clic para ver 28 artículos en alerta"
            />
            <div 
              style={{ width: "10%" }} 
              onClick={() => setSelectedHealthFilter(selectedHealthFilter === "critical" ? null : "critical")}
              className={`h-full bg-rose-500 rounded-r-full transition-all duration-300 hover:brightness-110 ${
                selectedHealthFilter === "critical" ? "ring-2 ring-rose-400 scale-y-110" : ""
              }`} 
              title="Clic para ver 6 artículos críticos"
            />
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground px-0.5">
            <button 
              onClick={() => setSelectedHealthFilter(selectedHealthFilter === "optimal" ? null : "optimal")}
              className={`hover:text-emerald-500 transition-colors ${selectedHealthFilter === "optimal" ? "font-bold text-emerald-500 underline" : ""}`}
            >
              72% Nivel óptimo
            </button>
            <button 
              onClick={() => setSelectedHealthFilter(selectedHealthFilter === "warning" ? null : "warning")}
              className={`hover:text-amber-500 transition-colors ${selectedHealthFilter === "warning" ? "font-bold text-amber-500 underline" : ""}`}
            >
              18% Stock bajo
            </button>
            <button 
              onClick={() => setSelectedHealthFilter(selectedHealthFilter === "critical" ? null : "critical")}
              className={`font-semibold hover:text-rose-500 transition-colors ${selectedHealthFilter === "critical" ? "font-bold text-rose-500 underline" : "text-rose-500"}`}
            >
              10% Crítico (6) ⚡
            </button>
          </div>
        </div>

        {/* 3 Botones / Tarjetas de estado interactivos */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {stockHealth.map((item) => {
            const isSelected = selectedHealthFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedHealthFilter(isSelected ? null : item.id)}
                className={`text-left p-2.5 sm:p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? `${item.border} ${item.bgLight} ring-2 ring-primary/40 shadow-xs scale-[1.02]` 
                    : `border-border/60 hover:border-border ${item.bgLight} hover:scale-[1.01]`
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`size-2 rounded-full ${item.color} ${isSelected ? "animate-ping" : ""}`} />
                  <span className="text-[11px] font-medium text-muted-foreground truncate">{item.label}</span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <p className="text-base sm:text-lg font-bold text-foreground">{item.count}</p>
                  <span className={`text-[10px] font-semibold ${item.text}`}>{item.percentage}%</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Drill-down de detalle al hacer clic en un estado */}
        {selectedHealthFilter && (
          <div className="mt-3 p-3 rounded-xl bg-muted/60 border border-border/80 animate-in fade-in slide-in-from-top-2 duration-200 space-y-2">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Info className="size-3.5 text-primary" />
                Artículos en estado: {
                  selectedHealthFilter === "critical" ? "Crítico / Por Agotar" :
                  selectedHealthFilter === "warning" ? "Stock Bajo (Alerta)" : "Nivel Óptimo"
                }
              </span>
              <button 
                onClick={() => setSelectedHealthFilter(null)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {healthDetails[selectedHealthFilter].map((prod, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg bg-background/80 border border-border/40 hover:border-primary/40 transition-colors"
                >
                  <div>
                    <span className="font-semibold text-foreground">{prod.name}</span>
                    <span className="text-[10px] text-muted-foreground ml-2">({prod.category})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-medium text-foreground">{prod.stock}</span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => navigate(RoutePaths.MixziStock)}
                      className="text-[10px] h-6 px-2 text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Ver en Stock
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  /* ================== GRÁFICO 2: CATEGORÍAS (INTERACTIVO CON DONUT) ================== */
  const renderCategoriesCard = () => (
    <Card className="border border-border/80 bg-card hover:border-primary/40 transition-all shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <PieChartIcon className="size-4 text-blue-500" />
              Valor de Stock por Familia
            </CardTitle>
            <CardDescription className="text-xs">
              Haz clic en una categoría para inspeccionar los insumos correspondientes.
            </CardDescription>
          </div>
          {selectedCategory && (
            <button 
              onClick={() => setSelectedCategory(null)}
              className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
            >
              <RotateCcw className="size-3" /> Restablecer
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Donut SVG con animación y sectores interactivos */}
          <div className="relative size-32 sm:size-36 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="size-32 sm:size-36 -rotate-90 transform">
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted/30" />
              {categories.map((c, i) => {
                const isSelected = selectedCategory === c.name;
                return (
                  <circle
                    key={i}
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke={c.stroke}
                    strokeWidth={isSelected ? 4.5 : 3.2}
                    strokeDasharray={c.dash}
                    strokeDashoffset={c.offset}
                    onClick={() => {
                      setSelectedCategory(selectedCategory === c.name ? null : c.name);
                      onSelectCategory?.(c.name);
                    }}
                    className="transition-all duration-300 cursor-pointer hover:opacity-80"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                {selectedCategory ? "Filtrado" : "Total"}
              </span>
              <span className="text-sm font-bold text-foreground">
                {selectedCategory ? categories.find(c => c.name === selectedCategory)?.value : "€14.1k"}
              </span>
            </div>
          </div>

          {/* Lista de Familias con clickeable state */}
          <div className="w-full space-y-1.5">
            {categories.map((cat, i) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <div 
                  key={i} 
                  className={`flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? "bg-primary/10 border border-primary/40 font-semibold" 
                      : "hover:bg-muted/60 border border-transparent"
                  }`}
                  onClick={() => {
                    setSelectedCategory(isSelected ? null : cat.name);
                    onSelectCategory?.(cat.name);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className={`size-2.5 rounded-full transition-transform ${isSelected ? "scale-125" : ""}`} 
                      style={{ backgroundColor: cat.stroke }} 
                    />
                    <span className="text-foreground">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground font-mono">{cat.amount}</span>
                    <span className="font-semibold text-foreground w-8 text-right">{cat.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Drill-down de artículos de la categoría seleccionada */}
        {selectedCategory && categoryDetails[selectedCategory] && (
          <div className="mt-3 p-3 rounded-xl bg-muted/60 border border-border/80 animate-in fade-in slide-in-from-top-2 duration-200 space-y-2">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-xs font-bold text-foreground">
                Principales Insumos en: <span className="text-primary">{selectedCategory}</span>
              </span>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => navigate(RoutePaths.MixziStock)}
                className="text-[10px] h-6 px-1.5 text-primary hover:underline gap-1"
              >
                <span>Ver todos en Stock</span>
                <ArrowRight className="size-3" />
              </Button>
            </div>
            <div className="space-y-1">
              {categoryDetails[selectedCategory].map((sub, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 px-2 rounded-md bg-background/60">
                  <span className="text-foreground font-medium">{sub.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{sub.qty}</span>
                    <span className="font-mono font-semibold text-foreground">{sub.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  /* ================== GRÁFICO 3: FLUJO SEMANAL (INTERACTIVO POR DÍA) ================== */
  const renderWeeklyFlowCard = () => (
    <Card className="border border-border/80 bg-card hover:border-primary/40 transition-all shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="size-4 text-violet-500" />
              Entradas vs Salidas Semanales
            </CardTitle>
            <CardDescription className="text-xs">
              Haz clic en cualquier día de la semana para examinar el balance y las operaciones de servicio.
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-muted-foreground">
              <span className="size-2 rounded-sm bg-primary/40" /> Entradas
            </span>
            <span className="flex items-center gap-1 font-medium text-foreground">
              <span className="size-2 rounded-sm bg-primary" /> Salidas
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Barras interactivas con animaciones hover */}
        <div className="h-44 w-full flex items-end justify-between gap-2 pt-4">
          {weeklyFlow.map((item, idx) => {
            const isSelected = selectedDay === idx;
            return (
              <div 
                key={idx} 
                onClick={() => setSelectedDay(isSelected ? null : idx)}
                className={`flex-1 flex flex-col items-center gap-2 p-1 rounded-xl cursor-pointer transition-all duration-200 ${
                  isSelected ? "bg-primary/10 ring-1 ring-primary/40" : "hover:bg-muted/50"
                }`}
              >
                <div className="w-full flex items-end justify-center gap-1 h-32">
                  <div 
                    style={{ height: `${item.inVal}%` }} 
                    className={`w-2.5 sm:w-3.5 rounded-t-sm transition-all duration-300 ${
                      isSelected ? "bg-primary/60 scale-y-105" : "bg-primary/30 hover:bg-primary/50"
                    }`}
                    title={`Entradas: ${item.inKg}`}
                  />
                  <div 
                    style={{ height: `${item.outVal}%` }} 
                    className={`w-2.5 sm:w-3.5 rounded-t-sm transition-all duration-300 ${
                      isSelected ? "bg-primary scale-y-105" : "bg-primary hover:opacity-90"
                    }`}
                    title={`Salidas: ${item.outKg}`}
                  />
                </div>
                <span className={`text-[11px] font-medium transition-colors ${
                  isSelected ? "text-primary font-bold" : "text-muted-foreground"
                }`}>
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>

        {/* Detalle ampliado del día seleccionado */}
        {selectedDay !== null && (
          <div className="p-3 rounded-xl bg-muted/60 border border-border/80 animate-in fade-in slide-in-from-top-2 duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-foreground">Día: {weeklyFlow[selectedDay].day}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {weeklyFlow[selectedDay].note}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Entradas recibidas: <strong className="text-foreground">{weeklyFlow[selectedDay].inKg}</strong> · Consumo en servicio: <strong className="text-foreground">{weeklyFlow[selectedDay].outKg}</strong>
              </p>
            </div>
            <button 
              onClick={() => setSelectedDay(null)}
              className="text-xs text-muted-foreground hover:text-foreground self-end sm:self-auto"
            >
              Cerrar detalle
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  /* ================== GRÁFICO 4: TOP ROTACIÓN CON FILTROS Y DRILL-DOWN ================== */
  const renderTopRotationCard = () => (
    <Card className="border border-border/80 bg-card hover:border-primary/40 transition-all shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="size-4 text-emerald-500" />
              Top Insumos de Mayor Rotación
            </CardTitle>
            <CardDescription className="text-xs">
              Toca cada producto para expandir sus métricas de proveedor y consumo diario.
            </CardDescription>
          </div>
          {/* Filtro rápido: Todos vs Solo Alertas */}
          <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setRotationFilter("all")}
              className={`text-[10px] font-medium px-2 py-0.5 rounded-md transition-all ${
                rotationFilter === "all" ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setRotationFilter("alert")}
              className={`text-[10px] font-medium px-2 py-0.5 rounded-md transition-all ${
                rotationFilter === "alert" ? "bg-rose-500 text-white shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Alertas (3)
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayedRotationItems.map((prod, i) => {
          const isExpanded = expandedRotationItem === prod.name;
          return (
            <div 
              key={i} 
              className={`p-2 rounded-xl transition-all duration-200 border ${
                isExpanded ? "bg-muted/60 border-primary/40 shadow-xs" : "hover:bg-muted/40 border-transparent"
              }`}
            >
              <div 
                className="flex items-center justify-between text-xs cursor-pointer"
                onClick={() => setExpandedRotationItem(isExpanded ? null : prod.name)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground truncate max-w-[180px] sm:max-w-xs">
                    {prod.name}
                  </span>
                  {isExpanded ? <ChevronUp className="size-3 text-muted-foreground" /> : <ChevronDown className="size-3 text-muted-foreground" />}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-[11px] font-mono">{prod.units}</span>
                  {prod.alert ? (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(RoutePaths.MixziStock);
                      }}
                      className="text-[10px] font-semibold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <AlertTriangle className="size-3" /> Pedir
                    </button>
                  ) : (
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {prod.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Barra de progreso de rotación animada */}
              <div 
                className="h-2 w-full rounded-full bg-muted overflow-hidden mt-1.5 cursor-pointer"
                onClick={() => setExpandedRotationItem(isExpanded ? null : prod.name)}
              >
                <div 
                  style={{ width: `${prod.usagePct}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    prod.alert ? "bg-rose-500" : "bg-primary"
                  }`}
                />
              </div>

              {/* Acordeón expandido con detalles del producto */}
              {isExpanded && (
                <div className="mt-2.5 pt-2 border-t border-border/60 text-xs space-y-1.5 animate-in fade-in duration-150">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div className="bg-background/80 p-1.5 rounded-md border border-border/50">
                      <span className="text-muted-foreground block text-[10px]">Stock Actual</span>
                      <strong className="text-foreground font-mono">{prod.stockActual}</strong>
                    </div>
                    <div className="bg-background/80 p-1.5 rounded-md border border-border/50">
                      <span className="text-muted-foreground block text-[10px]">Stock Mínimo</span>
                      <strong className="text-foreground font-mono">{prod.stockMin}</strong>
                    </div>
                    <div className="bg-background/80 p-1.5 rounded-md border border-border/50">
                      <span className="text-muted-foreground block text-[10px]">Consumo Diario</span>
                      <strong className="text-foreground font-mono">{prod.consumoDiario}</strong>
                    </div>
                    <div className="bg-background/80 p-1.5 rounded-md border border-border/50">
                      <span className="text-muted-foreground block text-[10px]">Proveedor</span>
                      <strong className="text-primary truncate block">{prod.proveedor}</strong>
                    </div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <Button 
                      size="sm" 
                      onClick={() => navigate(RoutePaths.MixziStock)}
                      className="text-xs h-7 px-3 gap-1.5 font-medium"
                    >
                      <span>Gestionar en Stock</span>
                      <ArrowRight className="size-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );

  if (compact) {
    return (
      <div className="space-y-4">
        {renderStockHealthCard()}
        {renderCategoriesCard()}
      </div>
    );
  }

  if (detailedOnly) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderWeeklyFlowCard()}
        {renderTopRotationCard()}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderStockHealthCard()}
        {renderCategoriesCard()}
        {renderWeeklyFlowCard()}
        {renderTopRotationCard()}
      </div>
    </div>
  );
};
