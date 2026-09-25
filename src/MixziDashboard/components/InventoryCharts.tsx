import React, { useState, useEffect } from "react";
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
  CheckCircle2,
  RefreshCw,
  Clock,
  Layers,
  ArrowUpRight,
  ArrowDownRight
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
    { name: "Presa Ibérica", qty: "6 kg", value: "€138", status: "warning" },
    { name: "Hamburguesas Angus 200g", qty: "40 uds", value: "€160", status: "ok" },
  ],
  "Frutas & Verduras": [
    { name: "Aguacates Hass", qty: "2 kg", value: "€12", status: "danger" },
    { name: "Tomate Pera Rama", qty: "15 kg", value: "€28.50", status: "ok" },
    { name: "Cebolla Recalcitrante", qty: "25 kg", value: "€22.50", status: "ok" },
    { name: "Limones de Huerta", qty: "8 kg", value: "€14.40", status: "warning" },
  ],
  "Secos & Despensa": [
    { name: "Aceite de Oliva Virgen Extra 5L", qty: "4 L", value: "€38", status: "danger" },
    { name: "Arroz Bomba Especial Paellas", qty: "30 kg", value: "€75", status: "ok" },
    { name: "Harina de Trigo Fuerza", qty: "50 kg", value: "€45", status: "ok" },
    { name: "Sal Marina Gruesa", qty: "20 kg", value: "€12", status: "ok" },
  ],
  "Lácteos & Huevos": [
    { name: "Queso Mozzarella Fresca", qty: "8 kg", value: "€72", status: "ok" },
    { name: "Leche Entera Fresca", qty: "5 L", value: "€6.50", status: "danger" },
    { name: "Huevos Camperos L (Docena)", qty: "15 doc", value: "€42", status: "warning" },
    { name: "Mantequilla Francesa Sin Sal", qty: "6 kg", value: "€54", status: "ok" },
  ]
};

// Sub-datos para drill-down de Salud de Stock
const healthDrilldownData = {
  optimal: [
    { name: "Pechuga de Pollo Corral", stock: "18 kg", min: "10 kg", coverage: "5 días", category: "Carnes" },
    { name: "Arroz Bomba Especial", stock: "30 kg", min: "15 kg", coverage: "8 días", category: "Secos" },
    { name: "Tomate Pera Rama", stock: "15 kg", min: "12 kg", coverage: "3 días", category: "Verduras" },
    { name: "Ginebra Premium", stock: "12 bot", min: "6 bot", coverage: "14 días", category: "Bebidas" },
  ],
  warning: [
    { name: "Vino Ribera Crianza", stock: "36 bot", min: "40 bot", coverage: "2 días", category: "Bebidas" },
    { name: "Presa Ibérica", stock: "6 kg", min: "8 kg", coverage: "2 días", category: "Carnes" },
    { name: "Limones de Huerta", stock: "8 kg", min: "10 kg", coverage: "2 días", category: "Verduras" },
    { name: "Huevos Camperos L", stock: "15 doc", min: "20 doc", coverage: "2 días", category: "Lácteos" },
  ],
  critical: [
    { name: "Cerveza Barril 50L (Estrella)", stock: "1 barril", min: "4 barriles", coverage: "< 24 horas", category: "Bebidas" },
    { name: "Solomillo de Ternera Madurado", stock: "3.5 kg", min: "10 kg", coverage: "< 24 horas", category: "Carnes" },
    { name: "Aceite de Oliva Virgen Extra", stock: "4 L", min: "15 L", coverage: "< 24 horas", category: "Despensa" },
    { name: "Aguacates Hass", stock: "2 kg", min: "8 kg", coverage: "< 1 día", category: "Verduras" },
    { name: "Leche Entera Fresca", stock: "5 L", min: "20 L", coverage: "1 día", category: "Lácteos" },
    { name: "Gambas Rojas Congeladas", stock: "1.8 kg", min: "5 kg", coverage: "1 día", category: "Pescados" },
  ]
};

// Conjunto de datos según periodo temporal
type Period = "today" | "week" | "month";

interface PeriodData {
  totalVal: string;
  totalValDiff: string;
  totalItems: number;
  stockHealth: Array<{
    id: "optimal" | "warning" | "critical";
    label: string;
    count: number;
    percentage: number;
    color: string;
    text: string;
    border: string;
    bgLight: string;
  }>;
  categories: Array<{
    name: string;
    value: string;
    amount: string;
    items: number;
    stroke: string;
    dash: string;
    offset: number;
  }>;
  weeklyFlow: Array<{
    day: string;
    inVal: number;
    outVal: number;
    inKg: string;
    outKg: string;
    note: string;
  }>;
  topRotationItems: Array<{
    name: string;
    category: string;
    usagePct: number;
    units: string;
    alert: boolean;
    stockActual: string;
    stockMin: string;
    consumoDiario: string;
    proveedor: string;
  }>;
}

const datasets: Record<Period, PeriodData> = {
  today: {
    totalVal: "€14,120",
    totalValDiff: "+2.4% vs ayer",
    totalItems: 176,
    stockHealth: [
      { id: "optimal", label: "Nivel Óptimo", count: 142, percentage: 72, color: "bg-emerald-500", text: "text-emerald-500", border: "border-emerald-500/40", bgLight: "bg-emerald-500/10" },
      { id: "warning", label: "Stock Bajo (Alerta)", count: 28, percentage: 18, color: "bg-amber-500", text: "text-amber-500", border: "border-amber-500/40", bgLight: "bg-amber-500/10" },
      { id: "critical", label: "Crítico / Por Agotar", count: 6, percentage: 10, color: "bg-rose-500", text: "text-rose-500", border: "border-rose-500/40", bgLight: "bg-rose-500/10" }
    ],
    categories: [
      { name: "Bebidas & Bodega", value: "34%", amount: "€4,820", items: 58, stroke: "#3b82f6", dash: "34 66", offset: 0 },
      { name: "Carnes & Aves", value: "26%", amount: "€3,710", items: 34, stroke: "#ef4444", dash: "26 74", offset: -34 },
      { name: "Frutas & Verduras", value: "18%", amount: "€2,490", items: 42, stroke: "#10b981", dash: "18 82", offset: -60 },
      { name: "Secos & Despensa", value: "14%", amount: "€1,980", items: 31, stroke: "#f59e0b", dash: "14 86", offset: -78 },
      { name: "Lácteos & Huevos", value: "8%", amount: "€1,120", items: 19, stroke: "#8b5cf6", dash: "8 92", offset: -92 },
    ],
    weeklyFlow: [
      { day: "Lun", inVal: 65, outVal: 40, inKg: "320kg", outKg: "210kg", note: "Recepción de bodega y lácteos" },
      { day: "Mar", inVal: 45, outVal: 50, inKg: "180kg", outKg: "240kg", note: "Servicio medio de mediodía" },
      { day: "Mié", inVal: 50, outVal: 55, inKg: "220kg", outKg: "260kg", note: "Entrada de carnes maduradas" },
      { day: "Jue", inVal: 80, outVal: 70, inKg: "410kg", outKg: "340kg", note: "Preparación mise en place fin de semana" },
      { day: "Vie", inVal: 95, outVal: 90, inKg: "580kg", outKg: "520kg", note: "Pico de entrada y servicio nocturno" },
      { day: "Sáb", inVal: 30, outVal: 98, inKg: "120kg", outKg: "590kg", note: "Máximo consumo semanal en comedor" },
      { day: "Dom", inVal: 20, outVal: 85, inKg: "90kg", outKg: "490kg", note: "Cierre de semana y preparación de pedido" }
    ],
    topRotationItems: [
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
    ]
  },
  week: {
    totalVal: "€16,840",
    totalValDiff: "+6.8% vs semana previa",
    totalItems: 182,
    stockHealth: [
      { id: "optimal", label: "Nivel Óptimo", count: 130, percentage: 67, color: "bg-emerald-500", text: "text-emerald-500", border: "border-emerald-500/40", bgLight: "bg-emerald-500/10" },
      { id: "warning", label: "Stock Bajo (Alerta)", count: 38, percentage: 21, color: "bg-amber-500", text: "text-amber-500", border: "border-amber-500/40", bgLight: "bg-amber-500/10" },
      { id: "critical", label: "Crítico / Por Agotar", count: 14, percentage: 12, color: "bg-rose-500", text: "text-rose-500", border: "border-rose-500/40", bgLight: "bg-rose-500/10" }
    ],
    categories: [
      { name: "Bebidas & Bodega", value: "37%", amount: "€6,230", items: 60, stroke: "#3b82f6", dash: "37 63", offset: 0 },
      { name: "Carnes & Aves", value: "24%", amount: "€4,040", items: 35, stroke: "#ef4444", dash: "24 76", offset: -37 },
      { name: "Frutas & Verduras", value: "16%", amount: "€2,690", items: 44, stroke: "#10b981", dash: "16 84", offset: -61 },
      { name: "Secos & Despensa", value: "13%", amount: "€2,190", items: 31, stroke: "#f59e0b", dash: "13 87", offset: -77 },
      { name: "Lácteos & Huevos", value: "10%", amount: "€1,690", items: 22, stroke: "#8b5cf6", dash: "10 90", offset: -90 },
    ],
    weeklyFlow: [
      { day: "Lun", inVal: 75, outVal: 55, inKg: "380kg", outKg: "280kg", note: "Recepción ampliada de fin de mes" },
      { day: "Mar", inVal: 60, outVal: 62, inKg: "240kg", outKg: "290kg", note: "Eventos corporativos" },
      { day: "Mié", inVal: 70, outVal: 68, inKg: "310kg", outKg: "320kg", note: "Entrada de frescos y pescados" },
      { day: "Jue", inVal: 85, outVal: 82, inKg: "450kg", outKg: "410kg", note: "Mise en place de banquetes" },
      { day: "Vie", inVal: 100, outVal: 95, inKg: "640kg", outKg: "580kg", note: "Pleno total cenas" },
      { day: "Sáb", inVal: 45, outVal: 100, inKg: "180kg", outKg: "650kg", note: "Servicio continuado de terraza y barra" },
      { day: "Dom", inVal: 30, outVal: 90, inKg: "110kg", outKg: "520kg", note: "Servicio de comidas y cierre" }
    ],
    topRotationItems: [
      { 
        name: "Cerveza Barril 50L (Estrella)", 
        category: "Bebidas", 
        usagePct: 98, 
        units: "24 barriles/sem", 
        alert: true,
        stockActual: "0.5 barriles",
        stockMin: "4 barriles",
        consumoDiario: "3.4 barriles/día",
        proveedor: "Damm Distribución"
      },
      { 
        name: "Solomillo de Ternera Madurado", 
        category: "Carnes", 
        usagePct: 89, 
        units: "52 kg/sem", 
        alert: true,
        stockActual: "2 kg",
        stockMin: "10 kg",
        consumoDiario: "7.4 kg/día",
        proveedor: "Cárnicas Sierra"
      },
      { 
        name: "Aceite de Oliva Virgen Extra", 
        category: "Despensa", 
        usagePct: 80, 
        units: "65 L/sem", 
        alert: true,
        stockActual: "3 L",
        stockMin: "15 L",
        consumoDiario: "9.2 L/día",
        proveedor: "Almazara Sur"
      },
      { 
        name: "Queso Mozzarella Fresca", 
        category: "Lácteos", 
        usagePct: 74, 
        units: "32 kg/sem", 
        alert: false,
        stockActual: "10 kg",
        stockMin: "8 kg",
        consumoDiario: "4.5 kg/día",
        proveedor: "Lácteos Central"
      },
      { 
        name: "Tomate Pera Rama", 
        category: "Verduras", 
        usagePct: 69, 
        units: "78 kg/sem", 
        alert: false,
        stockActual: "18 kg",
        stockMin: "14 kg",
        consumoDiario: "11 kg/día",
        proveedor: "Mercamadrid Frescos"
      },
    ]
  },
  month: {
    totalVal: "€58,900",
    totalValDiff: "+4.1% vs mes anterior",
    totalItems: 195,
    stockHealth: [
      { id: "optimal", label: "Nivel Óptimo", count: 154, percentage: 79, color: "bg-emerald-500", text: "text-emerald-500", border: "border-emerald-500/40", bgLight: "bg-emerald-500/10" },
      { id: "warning", label: "Stock Bajo (Alerta)", count: 32, percentage: 16, color: "bg-amber-500", text: "text-amber-500", border: "border-amber-500/40", bgLight: "bg-amber-500/10" },
      { id: "critical", label: "Crítico / Por Agotar", count: 9, percentage: 5, color: "bg-rose-500", text: "text-rose-500", border: "border-rose-500/40", bgLight: "bg-rose-500/10" }
    ],
    categories: [
      { name: "Bebidas & Bodega", value: "35%", amount: "€20,600", items: 64, stroke: "#3b82f6", dash: "35 65", offset: 0 },
      { name: "Carnes & Aves", value: "28%", amount: "€16,490", items: 38, stroke: "#ef4444", dash: "28 72", offset: -35 },
      { name: "Frutas & Verduras", value: "15%", amount: "€8,830", items: 45, stroke: "#10b981", dash: "15 85", offset: -63 },
      { name: "Secos & Despensa", value: "14%", amount: "€8,250", items: 32, stroke: "#f59e0b", dash: "14 86", offset: -78 },
      { name: "Lácteos & Huevos", value: "8%", amount: "€4,730", items: 21, stroke: "#8b5cf6", dash: "8 92", offset: -92 },
    ],
    weeklyFlow: [
      { day: "Sem 1", inVal: 80, outVal: 72, inKg: "1,450kg", outKg: "1,320kg", note: "Inicio de mes y compras fuertes" },
      { day: "Sem 2", inVal: 70, outVal: 68, inKg: "1,280kg", outKg: "1,250kg", note: "Rotación media regular" },
      { day: "Sem 3", inVal: 88, outVal: 84, inKg: "1,600kg", outKg: "1,520kg", note: "Jornadas gastronómicas locales" },
      { day: "Sem 4", inVal: 92, outVal: 94, inKg: "1,720kg", outKg: "1,780kg", note: "Fin de mes con alta demanda" }
    ],
    topRotationItems: [
      { 
        name: "Cerveza Barril 50L (Estrella)", 
        category: "Bebidas", 
        usagePct: 96, 
        units: "86 barriles/mes", 
        alert: true,
        stockActual: "2 barriles",
        stockMin: "6 barriles",
        consumoDiario: "2.9 barriles/día",
        proveedor: "Damm Distribución"
      },
      { 
        name: "Solomillo de Ternera Madurado", 
        category: "Carnes", 
        usagePct: 86, 
        units: "190 kg/mes", 
        alert: true,
        stockActual: "4 kg",
        stockMin: "12 kg",
        consumoDiario: "6.3 kg/día",
        proveedor: "Cárnicas Sierra"
      },
      { 
        name: "Queso Mozzarella Fresca", 
        category: "Lácteos", 
        usagePct: 78, 
        units: "125 kg/mes", 
        alert: false,
        stockActual: "12 kg",
        stockMin: "8 kg",
        consumoDiario: "4.1 kg/día",
        proveedor: "Lácteos Central"
      },
      { 
        name: "Aceite de Oliva Virgen Extra", 
        category: "Despensa", 
        usagePct: 72, 
        units: "220 L/mes", 
        alert: true,
        stockActual: "6 L",
        stockMin: "20 L",
        consumoDiario: "7.3 L/día",
        proveedor: "Almazara Sur"
      },
      { 
        name: "Tomate Pera Rama", 
        category: "Verduras", 
        usagePct: 65, 
        units: "310 kg/mes", 
        alert: false,
        stockActual: "20 kg",
        stockMin: "15 kg",
        consumoDiario: "10.3 kg/día",
        proveedor: "Mercamadrid Frescos"
      },
    ]
  }
};

export const InventoryCharts: React.FC<InventoryChartsProps> = ({
  compact = false,
  detailedOnly = false,
  onSelectCategory
}) => {
  const navigate = useNavigate();

  // Periodo temporal seleccionado
  const [period, setPeriod] = useState<Period>("today");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [animKey, setAnimKey] = useState<number>(0);

  // Estados interactivos para drill-down
  const [selectedHealthFilter, setSelectedHealthFilter] = useState<"optimal" | "warning" | "critical" | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [rotationFilter, setRotationFilter] = useState<"all" | "alert">("all");
  const [expandedRotationItem, setExpandedRotationItem] = useState<string | null>(null);

  // Cambiar periodo con animación de carga fluida
  const handlePeriodChange = (newPeriod: Period) => {
    if (newPeriod === period) return;
    setIsLoading(true);
    setPeriod(newPeriod);
    setSelectedHealthFilter(null);
    setSelectedCategory(null);
    setSelectedDay(null);
    setTimeout(() => {
      setIsLoading(false);
      setAnimKey(prev => prev + 1);
    }, 350);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimKey(prev => prev + 1);
    }, 450);
  };

  // Datos actuales según el periodo
  const currentData = datasets[period];
  const { stockHealth, categories, weeklyFlow, topRotationItems } = currentData;

  // Filtrado de items de rotación
  const displayedRotationItems = rotationFilter === "alert" 
    ? topRotationItems.filter(item => item.alert)
    : topRotationItems;

  /* ================== GRÁFICO 1: SALUD DEL STOCK (INTERACTIVO Y ANIMADO) ================== */
  const renderStockHealthCard = () => (
    <Card className="border border-border/80 bg-card hover:border-primary/40 transition-all shadow-xs overflow-hidden">
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

      <CardContent className="space-y-4 pt-1">
        {/* Barra apilada interactiva con transición suave */}
        <div className="space-y-1.5">
          <div className="h-4 w-full bg-muted/60 rounded-full overflow-hidden flex shadow-inner p-0.5 gap-0.5">
            {stockHealth.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedHealthFilter(selectedHealthFilter === item.id ? null : item.id)}
                title={`${item.label}: ${item.percentage}%`}
                style={{ width: isLoading ? "0%" : `${item.percentage}%` }}
                className={`h-full ${item.color} rounded-sm transition-all duration-700 ease-out hover:opacity-85 focus:outline-hidden ${
                  selectedHealthFilter === item.id ? "ring-2 ring-foreground ring-offset-1 scale-y-110 z-10" : ""
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground px-0.5">
            <span>Total artículos catalogados: <strong className="text-foreground">{currentData.totalItems}</strong></span>
            <span>{currentData.totalValDiff}</span>
          </div>
        </div>

        {/* Tarjetas / botones de estado interactivos */}
        <div className="grid grid-cols-3 gap-2">
          {stockHealth.map((item) => {
            const isSelected = selectedHealthFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedHealthFilter(isSelected ? null : item.id)}
                className={`p-2.5 rounded-xl border text-left transition-all duration-300 relative group overflow-hidden ${
                  isSelected 
                    ? `${item.border} ${item.bgLight} ring-2 ring-primary/40 shadow-xs scale-[1.02]`
                    : `border-border/60 hover:${item.border} hover:bg-muted/40`
                }`}
              >
                {item.id === "critical" && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                )}
                <div className="flex items-center gap-1.5">
                  <span className={`size-2 rounded-full ${item.color} transition-transform group-hover:scale-125`} />
                  <span className="text-[11px] font-medium text-muted-foreground truncate">{item.label}</span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`text-lg font-bold tracking-tight ${item.text} transition-transform ${isLoading ? "opacity-30 translate-y-1" : "opacity-100 translate-y-0"}`}>
                    {item.count}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-semibold">({item.percentage}%)</span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center justify-between">
                  <span>{isSelected ? "Ocultar" : "Explorar"}</span>
                  <ChevronDown className={`size-3 transition-transform duration-300 ${isSelected ? "rotate-180" : ""}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Panel Desplegable: Detalle de Artículos según el filtro seleccionado */}
        {selectedHealthFilter && (
          <div className="mt-3 p-3 rounded-xl bg-muted/40 border border-border/80 animate-in fade-in slide-in-from-top-2 duration-300 space-y-2">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <div className="flex items-center gap-2">
                <span className={`size-2.5 rounded-full ${
                  selectedHealthFilter === "critical" ? "bg-rose-500" : selectedHealthFilter === "warning" ? "bg-amber-500" : "bg-emerald-500"
                }`} />
                <span className="text-xs font-semibold">
                  Artículos en {stockHealth.find(s => s.id === selectedHealthFilter)?.label} ({healthDrilldownData[selectedHealthFilter].length})
                </span>
              </div>
              <button 
                onClick={() => setSelectedHealthFilter(null)}
                className="text-muted-foreground hover:text-foreground p-0.5 rounded-md hover:bg-muted"
              >
                <X className="size-3.5" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
              {healthDrilldownData[selectedHealthFilter].map((prod, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/50 hover:border-primary/40 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-foreground text-xs">{prod.name}</p>
                    <p className="text-[10px] text-muted-foreground">Familia: {prod.category} • Min. seguridad: {prod.min}</p>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${
                      selectedHealthFilter === "critical" ? "text-rose-500 font-mono" : "text-foreground font-mono"
                    }`}>
                      {prod.stock}
                    </span>
                    <p className="text-[10px] text-muted-foreground">Cobertura: {prod.coverage}</p>
                  </div>
                </div>
              ))}
            </div>

            {selectedHealthFilter === "critical" && (
              <Button 
                size="sm" 
                onClick={() => navigate(RoutePaths.MixziStock)}
                className="w-full text-xs h-7 font-semibold mt-1 bg-rose-600 hover:bg-rose-700 text-white"
              >
                <AlertTriangle className="size-3 mr-1" />
                Crear Orden de Compra para Críticos
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  /* ================== GRÁFICO 2: VALORACIÓN POR CATEGORÍA (DONUT ANIMADO) ================== */
  const renderCategoryValueCard = () => (
    <Card className="border border-border/80 bg-card hover:border-primary/40 transition-all shadow-xs overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <PieChartIcon className="size-4 text-primary" />
              Valoración por Categoría
            </CardTitle>
            <CardDescription className="text-xs">
              Distribución del inmovilizado en almacenes y cámaras.
            </CardDescription>
          </div>
          <span className="text-xs font-bold text-foreground font-mono bg-muted/60 px-2 py-0.5 rounded-md border border-border/40">
            Total {currentData.totalVal}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Donut SVG con animación de trazado */}
          <div className="relative size-36 shrink-0 flex items-center justify-center">
            <svg 
              className={`size-full transform -rotate-90 transition-transform duration-700 ease-out ${isLoading ? "scale-90 opacity-40 rotate-0" : "scale-100 opacity-100"}`} 
              viewBox="0 0 36 36"
            >
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="3.5"
                className="text-muted/30"
              />
              {categories.map((c, i) => {
                const isSelected = selectedCategory === c.name;
                return (
                  <circle
                    key={i}
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="transparent"
                    stroke={c.stroke}
                    strokeWidth={isSelected ? "5" : "3.5"}
                    strokeDasharray={isLoading ? "0 100" : c.dash}
                    strokeDashoffset={c.offset}
                    className="cursor-pointer transition-all duration-700 ease-in-out hover:opacity-80"
                    onClick={() => {
                      const next = selectedCategory === c.name ? null : c.name;
                      setSelectedCategory(next);
                      if (next && onSelectCategory) onSelectCategory(next);
                    }}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                {selectedCategory ? "Filtrado" : "Inmovilizado"}
              </span>
              <span className="text-sm font-extrabold tracking-tight font-mono text-foreground transition-all">
                {selectedCategory 
                  ? categories.find(c => c.name === selectedCategory)?.amount 
                  : currentData.totalVal}
              </span>
              <span className="text-[9px] text-muted-foreground">
                {selectedCategory || `${categories.length} Familias`}
              </span>
            </div>
          </div>

          {/* Leyenda interactiva de categorías */}
          <div className="w-full space-y-1.5 flex-1">
            {categories.map((cat, i) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={i}
                  onClick={() => {
                    const next = isSelected ? null : cat.name;
                    setSelectedCategory(next);
                    if (next && onSelectCategory) onSelectCategory(next);
                  }}
                  className={`w-full flex items-center justify-between text-xs p-1.5 rounded-lg transition-all duration-200 text-left ${
                    isSelected 
                      ? "bg-primary/10 border border-primary/30 font-semibold shadow-xs scale-[1.01]" 
                      : "hover:bg-muted/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span 
                      className="size-2.5 rounded-full shrink-0 transition-transform group-hover:scale-125" 
                      style={{ backgroundColor: cat.stroke }} 
                    />
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[10px] text-muted-foreground">({cat.items} arts)</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-medium">{cat.amount}</span>
                    <span className="text-[10px] font-bold text-muted-foreground w-8 text-right font-mono">
                      {cat.value}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-detalle cuando una categoría está seleccionada */}
        {selectedCategory && categoryDetails[selectedCategory] && (
          <div className="p-3 rounded-xl bg-muted/30 border border-border/80 animate-in fade-in slide-in-from-top-2 duration-300 space-y-2">
            <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <ShoppingBag className="size-3 text-primary" />
                Artículos clave en {selectedCategory}
              </span>
              <button 
                onClick={() => setSelectedCategory(null)}
                className="text-[10px] text-muted-foreground hover:text-foreground"
              >
                Limpiar selección
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
              {categoryDetails[selectedCategory].map((sub, idx) => (
                <div key={idx} className="flex items-center justify-between p-1.5 rounded-md bg-card border border-border/50 text-xs">
                  <div className="truncate pr-2">
                    <p className="font-medium text-foreground truncate">{sub.name}</p>
                    <p className="text-[10px] text-muted-foreground">{sub.qty}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold">{sub.value}</span>
                    <span className={`block size-1.5 rounded-full ml-auto mt-0.5 ${
                      sub.status === "danger" ? "bg-rose-500" : sub.status === "warning" ? "bg-amber-500" : "bg-emerald-500"
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  /* ================== GRÁFICO 3: FLUJO DE CONSUMO VS REPOSICIÓN ================== */
  const renderWeeklyFlowCard = () => (
    <Card className="border border-border/80 bg-card hover:border-primary/40 transition-all shadow-xs overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="size-4 text-blue-500" />
              Flujo Operativo (Entradas vs Consumo)
            </CardTitle>
            <CardDescription className="text-xs">
              Muestra el equilibrio entre recepción de albaranes y el consumo en cocina/sala.
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 text-xs self-start sm:self-auto bg-muted/40 p-1.5 rounded-lg border border-border/50">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="size-2 rounded-sm bg-blue-500" />
              Entradas (Proveedores)
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="size-2 rounded-sm bg-amber-500" />
              Salidas / Consumo
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* Gráfico de barras interactivo con animación fluida de altura */}
        <div className="h-44 flex items-end gap-2 sm:gap-4 pt-4 px-2 border-b border-border/60">
          {weeklyFlow.map((item, idx) => {
            const isSelected = selectedDay === idx;
            return (
              <div 
                key={idx} 
                className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer"
                onClick={() => setSelectedDay(isSelected ? null : idx)}
              >
                {/* Tooltip / Valor flotante al hover o selección */}
                <div className={`transition-all duration-300 text-[9px] font-mono font-bold text-center ${
                  isSelected ? "opacity-100 -translate-y-1 text-primary scale-110" : "opacity-0 group-hover:opacity-100 text-muted-foreground"
                }`}>
                  {item.outKg}
                </div>

                <div className={`w-full max-w-[36px] flex items-end justify-center gap-1 h-32 px-1 rounded-t-md transition-colors ${
                  isSelected ? "bg-muted/60 ring-2 ring-primary/30" : "group-hover:bg-muted/30"
                }`}>
                  {/* Barra Entradas con transición suave */}
                  <div 
                    style={{ height: isLoading ? "0%" : `${item.inVal}%` }} 
                    className="w-1/2 bg-blue-500/80 group-hover:bg-blue-500 rounded-t-sm transition-all duration-700 ease-out" 
                  />
                  {/* Barra Salidas con transición suave */}
                  <div 
                    style={{ height: isLoading ? "0%" : `${item.outVal}%` }} 
                    className="w-1/2 bg-amber-500/80 group-hover:bg-amber-500 rounded-t-sm transition-all duration-700 ease-out" 
                  />
                </div>

                <span className={`text-[11px] font-semibold transition-colors ${
                  isSelected ? "text-primary font-bold scale-110" : "text-muted-foreground group-hover:text-foreground"
                }`}>
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>

        {/* Detalle del día seleccionado */}
        {selectedDay !== null && weeklyFlow[selectedDay] && (
          <div className="p-3 rounded-xl bg-muted/40 border border-border/80 animate-in fade-in slide-in-from-top-2 duration-300 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-foreground">
                Detalle {weeklyFlow[selectedDay].day}:
              </span>
              <p className="text-muted-foreground text-[11px]">{weeklyFlow[selectedDay].note}</p>
            </div>
            <div className="flex items-center gap-3 font-mono">
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground block">Entradas</span>
                <span className="text-blue-500 font-bold">{weeklyFlow[selectedDay].inKg}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground block">Consumo</span>
                <span className="text-amber-500 font-bold">{weeklyFlow[selectedDay].outKg}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  /* ================== GRÁFICO 4: TOP ROTACIÓN & ESCANDALLO ================== */
  const renderTopRotationCard = () => (
    <Card className="border border-border/80 bg-card hover:border-primary/40 transition-all shadow-xs overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Activity className="size-4 text-purple-500" />
              Insumos de Mayor Rotación Diaria
            </CardTitle>
            <CardDescription className="text-xs">
              Productos con mayor ritmo de salida. Claves para evitar rotura de servicio.
            </CardDescription>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              onClick={() => setRotationFilter("all")}
              className={`px-2 py-0.5 text-xs rounded-md font-medium transition-all ${
                rotationFilter === "all" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Todos (5)
            </button>
            <button
              onClick={() => setRotationFilter("alert")}
              className={`px-2 py-0.5 text-xs rounded-md font-medium transition-all flex items-center gap-1 ${
                rotationFilter === "alert" ? "bg-rose-500 text-white shadow-xs" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <AlertTriangle className="size-3" />
              En Alerta ({topRotationItems.filter(i => i.alert).length})
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-1">
        <div className="space-y-2">
          {displayedRotationItems.map((item, idx) => {
            const isExpanded = expandedRotationItem === item.name;
            return (
              <div 
                key={idx}
                className="p-2.5 rounded-xl border border-border/60 hover:border-primary/40 bg-muted/20 hover:bg-muted/40 transition-all"
              >
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedRotationItem(isExpanded ? null : item.name)}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-foreground">{item.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                      {item.category}
                    </span>
                    {item.alert && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-rose-500 animate-pulse" />
                        Reponer
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-foreground">{item.units}</span>
                    <ChevronDown className={`size-3.5 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                </div>

                {/* Barra de progreso de rotación con animación de ancho */}
                <div className="mt-2 h-1.5 w-full bg-muted/80 rounded-full overflow-hidden">
                  <div 
                    style={{ width: isLoading ? "0%" : `${item.usagePct}%` }}
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      item.alert ? "bg-rose-500" : "bg-primary"
                    }`}
                  />
                </div>

                {/* Drawer desplegable con datos operativos */}
                {isExpanded && (
                  <div className="mt-3 pt-2.5 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] animate-in fade-in duration-200">
                    <div className="bg-card p-1.5 rounded border border-border/40">
                      <span className="text-muted-foreground block text-[10px]">Stock Actual</span>
                      <span className="font-bold font-mono text-foreground">{item.stockActual}</span>
                    </div>
                    <div className="bg-card p-1.5 rounded border border-border/40">
                      <span className="text-muted-foreground block text-[10px]">Stock Mínimo</span>
                      <span className="font-bold font-mono text-foreground">{item.stockMin}</span>
                    </div>
                    <div className="bg-card p-1.5 rounded border border-border/40">
                      <span className="text-muted-foreground block text-[10px]">Salida Diaria</span>
                      <span className="font-bold font-mono text-foreground">{item.consumoDiario}</span>
                    </div>
                    <div className="bg-card p-1.5 rounded border border-border/40">
                      <span className="text-muted-foreground block text-[10px]">Proveedor</span>
                      <span className="font-bold text-foreground truncate block">{item.proveedor}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* BARRA SUPERIOR DE CONTROL: SELECTOR DE PERIODO Y RECARGA CON ANIMACIÓN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/30 p-2.5 rounded-xl border border-border/60">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">Periodo de Análisis:</span>
          
          <div className="flex items-center gap-1 bg-background p-1 rounded-lg border border-border/80 shadow-2xs">
            {[
              { id: "today", label: "Hoy (Tiempo Real)" },
              { id: "week", label: "Esta Semana" },
              { id: "month", label: "Mes Actual" }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => handlePeriodChange(p.id as Period)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                  period === p.id 
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {isLoading && (
            <span className="text-[11px] text-muted-foreground flex items-center gap-1 animate-pulse">
              <RefreshCw className="size-3 animate-spin text-primary" />
              Sincronizando datos...
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="text-xs h-7 gap-1 font-medium"
          >
            <RefreshCw className={`size-3 ${isLoading ? "animate-spin" : ""}`} />
            <span>Actualizar</span>
          </Button>
        </div>
      </div>

      {/* RENDERIZADO DE LOS 4 GRÁFICOS INTERACTIVOS */}
      {compact ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {renderStockHealthCard()}
          {renderCategoryValueCard()}
        </div>
      ) : detailedOnly ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {renderWeeklyFlowCard()}
          {renderTopRotationCard()}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderStockHealthCard()}
          {renderCategoryValueCard()}
          {renderWeeklyFlowCard()}
          {renderTopRotationCard()}
        </div>
      )}
    </div>
  );
};
