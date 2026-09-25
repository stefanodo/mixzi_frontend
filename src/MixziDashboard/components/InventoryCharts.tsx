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
  ExternalLink
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoutePaths } from "@/router/routes";

export interface InventoryChartsProps {
  compact?: boolean;
  detailedOnly?: boolean;
  onSelectCategory?: (category: string) => void;
}

export const InventoryCharts: React.FC<InventoryChartsProps> = ({
  compact = false,
  detailedOnly = false,
  onSelectCategory
}) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  // 1. Datos Estado de Salud del Stock
  const stockHealth = [
    { label: "Nivel Óptimo", count: 142, percentage: 72, color: "bg-emerald-500", text: "text-emerald-500", bgLight: "bg-emerald-500/10" },
    { label: "Stock Bajo (Alerta)", count: 28, percentage: 18, color: "bg-amber-500", text: "text-amber-500", bgLight: "bg-amber-500/10" },
    { label: "Crítico / Por Agotar", count: 6, percentage: 10, color: "bg-rose-500", text: "text-rose-500", bgLight: "bg-rose-500/10" }
  ];

  // 2. Datos Distribución por Categoría de Restauración
  const categories = [
    { name: "Bebidas & Bodega", value: "34%", amount: "€4,820", stroke: "#3b82f6", dash: "34 66", offset: 0 },
    { name: "Carnes & Aves", value: "26%", amount: "€3,710", stroke: "#ef4444", dash: "26 74", offset: -34 },
    { name: "Frutas & Verduras", value: "18%", amount: "€2,490", stroke: "#10b981", dash: "18 82", offset: -60 },
    { name: "Secos & Despensa", value: "14%", amount: "€1,980", stroke: "#f59e0b", dash: "14 86", offset: -78 },
    { name: "Lácteos & Huevos", value: "8%", amount: "€1,120", stroke: "#8b5cf6", dash: "8 92", offset: -92 },
  ];

  // 3. Datos Flujo Semanal (Consumo vs Reposición)
  const weeklyFlow = [
    { day: "Lun", inVal: 65, outVal: 40, inKg: "320kg", outKg: "210kg" },
    { day: "Mar", inVal: 45, outVal: 50, inKg: "180kg", outKg: "240kg" },
    { day: "Mié", inVal: 50, outVal: 55, inKg: "220kg", outKg: "260kg" },
    { day: "Jue", inVal: 80, outVal: 70, inKg: "410kg", outKg: "340kg" },
    { day: "Vie", inVal: 95, outVal: 90, inKg: "580kg", outKg: "520kg" },
    { day: "Sáb", inVal: 30, outVal: 98, inKg: "120kg", outKg: "590kg" },
    { day: "Dom", inVal: 20, outVal: 85, inKg: "90kg", outKg: "490kg" }
  ];

  // 4. Datos Top Insumos con Mayor Rotación Diaria
  const topRotationItems = [
    { name: "Cerveza Barril 50L (Estrella)", category: "Bebidas", usagePct: 94, units: "18 barriles/sem", alert: true },
    { name: "Solomillo de Ternera Madurado", category: "Carnes", usagePct: 82, units: "42 kg/sem", alert: false },
    { name: "Queso Mozzarella Fresca", category: "Lácteos", usagePct: 76, units: "28 kg/sem", alert: false },
    { name: "Aceite de Oliva Virgen Extra", category: "Despensa", usagePct: 68, units: "50 L/sem", alert: false },
    { name: "Tomate Pera Rama", category: "Verduras", usagePct: 62, units: "65 kg/sem", alert: false },
  ];

  const renderStockHealthCard = () => (
    <Card className="border border-border/80 bg-card hover:border-primary/40 transition-colors shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <PackageCheck className="size-4 text-emerald-500" />
              Salud del Stock & Reposición
            </CardTitle>
            <CardDescription className="text-xs">
              Semáforo de inventario para anticipar roturas en servicio.
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
        {/* Barra Segmentada Multi-color */}
        <div className="space-y-2">
          <div className="h-3 w-full rounded-full bg-muted/60 overflow-hidden flex gap-0.5 p-0.5">
            <div style={{ width: "72%" }} className="h-full bg-emerald-500 rounded-l-full transition-all duration-500" />
            <div style={{ width: "18%" }} className="h-full bg-amber-500 transition-all duration-500" />
            <div style={{ width: "10%" }} className="h-full bg-rose-500 rounded-r-full transition-all duration-500" />
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground px-0.5">
            <span>72% Nivel óptimo</span>
            <span>18% Stock bajo</span>
            <span className="font-semibold text-rose-500">10% Crítico (6)</span>
          </div>
        </div>

        {/* Tarjetas resumen de estado */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {stockHealth.map((item, idx) => (
            <div key={idx} className={`p-2.5 sm:p-3 rounded-lg border border-border/50 ${item.bgLight} space-y-1`}>
              <div className="flex items-center gap-1.5">
                <span className={`size-2 rounded-full ${item.color}`} />
                <span className="text-[11px] font-medium text-muted-foreground truncate">{item.label}</span>
              </div>
              <p className="text-base sm:text-lg font-bold text-foreground">{item.count}</p>
              <p className={`text-[10px] font-semibold ${item.text}`}>{item.percentage}% del total</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderCategoriesCard = () => (
    <Card className="border border-border/80 bg-card hover:border-primary/40 transition-colors shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <PieChartIcon className="size-4 text-blue-500" />
              Valor de Stock por Familia
            </CardTitle>
            <CardDescription className="text-xs">
              Distribución de capital invertido en almacén (€14,120 total).
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative size-32 sm:size-36 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="size-32 sm:size-36 -rotate-90 transform">
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted/40" />
              {categories.map((c, i) => (
                <circle
                  key={i}
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke={c.stroke}
                  strokeWidth="3.2"
                  strokeDasharray={c.dash}
                  strokeDashoffset={c.offset}
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] text-muted-foreground uppercase font-semibold">Total</span>
              <span className="text-sm font-bold text-foreground">€14.1k</span>
            </div>
          </div>

          <div className="w-full space-y-1.5">
            {categories.map((cat, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between text-xs py-1 px-2 rounded-md hover:bg-muted/60 cursor-pointer transition-colors"
                onMouseEnter={() => setActiveCategory(i)}
                onMouseLeave={() => setActiveCategory(null)}
                onClick={() => onSelectCategory?.(cat.name)}
              >
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: cat.stroke }} />
                  <span className="font-medium text-foreground">{cat.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground font-mono">{cat.amount}</span>
                  <span className="font-semibold text-foreground w-8 text-right">{cat.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderWeeklyFlowCard = () => (
    <Card className="border border-border/80 bg-card hover:border-primary/40 transition-colors shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="size-4 text-violet-500" />
              Entradas vs Salidas Semanales
            </CardTitle>
            <CardDescription className="text-xs">
              Picos de consumo hacia el servicio del fin de semana (kg/unidades).
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
      <CardContent>
        <div className="h-44 w-full flex items-end justify-between gap-2 pt-4">
          {weeklyFlow.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full flex items-end justify-center gap-1 h-32">
                <div 
                  style={{ height: `${item.inVal}%` }} 
                  className="w-2.5 sm:w-3.5 bg-primary/30 rounded-t-sm transition-all duration-300 group-hover:bg-primary/50"
                  title={`Entradas: ${item.inKg}`}
                />
                <div 
                  style={{ height: `${item.outVal}%` }} 
                  className="w-2.5 sm:w-3.5 bg-primary rounded-t-sm transition-all duration-300 group-hover:opacity-90"
                  title={`Salidas: ${item.outKg}`}
                />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderTopRotationCard = () => (
    <Card className="border border-border/80 bg-card hover:border-primary/40 transition-colors shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="size-4 text-emerald-500" />
              Top Insumos de Mayor Rotación
            </CardTitle>
            <CardDescription className="text-xs">
              Velocidad de agotamiento y control de caducidad/mermas.
            </CardDescription>
          </div>
          <span className="text-[11px] text-muted-foreground">Últimos 7 días</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3.5">
        {topRotationItems.map((prod, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground truncate max-w-[200px]">
                {prod.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-[11px]">{prod.units}</span>
                {prod.alert ? (
                  <button 
                    onClick={() => navigate(RoutePaths.MixziStock)}
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
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div 
                style={{ width: `${prod.usagePct}%` }}
                className={`h-full rounded-full transition-all duration-500 ${
                  prod.alert ? "bg-rose-500" : "bg-primary"
                }`}
              />
            </div>
          </div>
        ))}
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
