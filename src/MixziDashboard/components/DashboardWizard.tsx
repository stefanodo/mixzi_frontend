import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  PlusCircle, 
  ArrowRight, 
  Boxes, 
  Sparkles, 
  ClipboardCheck,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  CheckCircle2,
  ChevronRight,
  TrendingDown,
  DollarSign,
  PackageSearch,
  Truck,
  Lightbulb,
  Clock,
  Flame,
  Check,
  RefreshCw,
  BadgeAlert
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoutePaths } from "@/router/routes";

interface WizardSuggestion {
  id: string;
  category: "urgent" | "stock" | "costs" | "operations";
  categoryLabel: string;
  question: string;
  description: string;
  impact: string;
  impactType: "danger" | "warning" | "success" | "info";
  timeEstimate: string;
  icon: React.ElementType;
  primary?: boolean;
  actionText: string;
  badge?: string;
  onClick: () => void;
}

export const DashboardWizard: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<"all" | "urgent" | "stock" | "costs" | "operations">("all");
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [showDismissedToast, setShowDismissedToast] = useState<string | null>(null);

  const allSuggestions: WizardSuggestion[] = [
    {
      id: "add-stock-item",
      category: "stock",
      categoryLabel: "Inventario & Altas",
      question: "¿Quieres agregar un artículo en tu inventario?",
      description: "Crea y cataloga nuevos productos para la carta, asigna proveedor, escandallo, coste por ración y stock de seguridad.",
      impact: "Recomendado para nuevos platos",
      impactType: "success",
      timeEstimate: "1-2 min",
      icon: PlusCircle,
      primary: true,
      badge: "Acción Principal",
      actionText: "Ir a Stock para Agregar",
      onClick: () => navigate(`${RoutePaths.MixziStock}?action=add-item&block=Frescos`, { 
        state: { action: "add-item", block: "Frescos" } 
      }),
    },
    {
      id: "urgent-replenishment",
      category: "urgent",
      categoryLabel: "Aprovisionamiento Urgente",
      question: "¿Generar pedido para evitar rotura de stock en el servicio?",
      description: "Cerveza Barril 50L (1 barril) y Solomillo (3.5kg) están por debajo del mínimo. Tienen menos de 24h de cobertura.",
      impact: "Alto riesgo para el turno de cena",
      impactType: "danger",
      timeEstimate: "Inmediato",
      icon: AlertTriangle,
      primary: true,
      badge: "Crítico - 3 Insumos",
      actionText: "Gestionar Reposición Urgente",
      onClick: () => navigate(RoutePaths.MixziStock),
    },
    {
      id: "cost-deviation-alert",
      category: "costs",
      categoryLabel: "Control de Márgenes",
      question: "¿Revisar desviación de costes en Aceite de Oliva y Carnes?",
      description: "El precio de compra subió un +12% este mes. Ajusta escandallos o renegocia con el proveedor para proteger el margen bruto.",
      impact: "Ahorro estimado ~€180/mes",
      impactType: "warning",
      timeEstimate: "3 min",
      icon: TrendingDown,
      badge: "+12% Coste",
      actionText: "Auditar Precios y Recetas",
      onClick: () => navigate(RoutePaths.MixziStock),
    },
    {
      id: "shift-inventory-count",
      category: "operations",
      categoryLabel: "Cierre de Turno & Arqueo",
      question: "¿Realizar recuento rápido de insumos de alto valor?",
      description: "Compara el consumo teórico registrado con el stock físico de carnes maduradas y botellas prémium para frenar desvíos y mermas.",
      impact: "Control de mermas (-4%)",
      impactType: "info",
      timeEstimate: "4 min",
      icon: ClipboardCheck,
      actionText: "Iniciar Arqueo Rápido",
      onClick: () => navigate(RoutePaths.MixziStock),
    },
    {
      id: "pending-delivery-notes",
      category: "operations",
      categoryLabel: "Recepción de Proveedores",
      question: "¿Validar albaranes pendientes del día?",
      description: "Registra la recepción de Damm y Cárnicas Sierra para cuadrar lotes, caducidades y actualizar existencias automáticamente.",
      impact: "2 entregas pendientes",
      impactType: "warning",
      timeEstimate: "2 min",
      icon: Truck,
      actionText: "Revisar Entradas",
      onClick: () => navigate(RoutePaths.MixziStock),
    },
    {
      id: "catalog-management",
      category: "stock",
      categoryLabel: "Estructura de Catálogo",
      question: "¿Organizar familias, mermas estándar y unidades de medida?",
      description: "Optimiza la estructura de tus ingredientes para calcular escandallos precisos y vincularlos a tus puntos de venta (POS).",
      impact: "Precisión de escandallo",
      impactType: "info",
      timeEstimate: "5 min",
      icon: Boxes,
      actionText: "Configurar Familias",
      onClick: () => navigate(RoutePaths.MixziStock),
    },
  ];

  const filteredSuggestions = allSuggestions.filter((item) => {
    if (activeFilter === "all") return true;
    return item.category === activeFilter;
  });

  const toggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* HEADER OPERACIONAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Asistente & Sugerencias Mixzi
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sugerencias en vivo
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            ¿Qué quieres hacer hoy? Recomendaciones operativas basadas en demanda, rotación de stock y márgenes de restauración.
          </p>
        </div>

        {/* PILL FILTERS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: "all", label: "Todas" },
            { id: "urgent", label: "🚨 Urgentes" },
            { id: "stock", label: "📦 Inventario" },
            { id: "costs", label: "💰 Costes" },
            { id: "operations", label: "📋 Operativa" },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3 py-1 text-xs rounded-full font-medium whitespace-nowrap transition-all ${
                activeFilter === f.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* QUICK SUGGESTIONS SMART BANNER */}
      <div className="bg-gradient-to-r from-amber-500/10 via-primary/5 to-transparent border border-amber-500/20 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
            <Lightbulb className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-semibold text-foreground">
                Sugerencia Inteligente de Compra (Fin de Semana)
              </h4>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">
                Prioridad Alta
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              La demanda estimada para el servicio de viernes y sábado superará el stock actual de <strong className="text-foreground">Cerveza Barril</strong> y <strong className="text-foreground">Solomillo</strong>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={() => navigate(`${RoutePaths.MixziStock}?action=add-item&block=Frescos`, { state: { action: "add-item", block: "Frescos" } })}
            className="text-xs h-8 font-semibold shadow-xs"
          >
            <PlusCircle className="size-3.5 mr-1.5" />
            Agregar a Inventario
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(RoutePaths.MixziStock)}
            className="text-xs h-8"
          >
            Ver Stock Crítico
          </Button>
        </div>
      </div>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSuggestions.map((q) => {
          const Icon = q.icon;
          const isCompleted = completedIds.includes(q.id);

          return (
            <Card 
              key={q.id}
              className={`group transition-all duration-200 hover:shadow-md flex flex-col justify-between relative overflow-hidden ${
                isCompleted 
                  ? "opacity-60 bg-muted/30 border-border/40"
                  : q.primary 
                    ? "border-primary/50 bg-primary/[0.03] hover:border-primary shadow-xs" 
                    : "border-border/80 hover:border-primary/30"
              }`}
            >
              {q.primary && !isCompleted && (
                <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                  <div className="absolute transform rotate-45 bg-primary text-[9px] font-bold text-primary-foreground text-center py-0.5 right-[-35px] top-[14px] w-[120px] shadow-xs">
                    TOP
                  </div>
                </div>
              )}

              <CardHeader className="pb-3 space-y-2">
                <div className="flex items-center justify-between gap-2 pr-4 h-6">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      {q.categoryLabel}
                    </span>
                    <span className="text-[10px] text-muted-foreground/80 flex items-center gap-1">
                      <Clock className="size-3" />
                      {q.timeEstimate}
                    </span>
                  </div>

                  {q.badge && !isCompleted && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      q.impactType === "danger"
                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                        : q.impactType === "warning"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          : "bg-primary text-primary-foreground"
                    }`}>
                      {q.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 ${
                    isCompleted
                      ? "bg-muted text-muted-foreground"
                      : q.impactType === "danger"
                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        : q.primary 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-foreground"
                  }`}>
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <CardTitle className={`text-base font-bold leading-snug ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {q.question}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1.5 leading-relaxed">
                      {q.description}
                    </CardDescription>

                    <div className="mt-2 flex items-center gap-2">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                        q.impactType === "danger" 
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          : q.impactType === "warning"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      }`}>
                        💡 {q.impact}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-2 flex items-center gap-2">
                <Button 
                  onClick={q.onClick}
                  variant={q.primary && !isCompleted ? "default" : "outline"}
                  className="flex-1 justify-between text-xs sm:text-sm font-semibold transition-all group-hover:translate-x-0.5"
                >
                  <span>{q.actionText}</span>
                  <ChevronRight className="size-4 opacity-80" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => toggleComplete(q.id, e)}
                  title={isCompleted ? "Marcar como pendiente" : "Marcar como atendida"}
                  className={`size-9 shrink-0 ${isCompleted ? "text-emerald-500 bg-emerald-500/10" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Check className="size-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
