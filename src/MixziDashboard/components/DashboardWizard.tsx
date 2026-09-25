import React from "react";
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
  ChevronRight
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoutePaths } from "@/router/routes";

interface WizardQuestion {
  id: string;
  category: string;
  question: string;
  description: string;
  icon: React.ElementType;
  primary?: boolean;
  actionText: string;
  badge?: string;
  onClick: () => void;
}

export const DashboardWizard: React.FC = () => {
  const navigate = useNavigate();

  const questions: WizardQuestion[] = [
    {
      id: "add-stock-item",
      category: "Inventario & Altas",
      question: "¿Quieres agregar un artículo en tu inventario?",
      description: "Crea y cataloga nuevos productos, asigna proveedores, precio de coste y stock de seguridad.",
      icon: PlusCircle,
      primary: true,
      badge: "Acción Prioritaria",
      actionText: "Ir a Stock para Agregar",
      onClick: () => navigate(`${RoutePaths.MixziStock}?action=add-item&block=Frescos`, { state: { action: "add-item", block: "Frescos" } }),
    },
    {
      id: "check-stock-alerts",
      category: "Aprovisionamiento",
      question: "¿Revisar artículos con bajo stock para pedir a proveedor?",
      description: "Detecta los 6 insumos críticos antes de que afecten el servicio del fin de semana.",
      icon: AlertTriangle,
      badge: "6 Alertas",
      actionText: "Gestionar Reposición",
      onClick: () => navigate(RoutePaths.MixziStock),
    },
    {
      id: "audit-stock",
      category: "Control Operativo",
      question: "¿Realizar recuento físico de inventario o arqueo?",
      description: "Ajusta las cantidades reales frente a las teóricas para controlar mermas y desvíos.",
      icon: ClipboardCheck,
      actionText: "Iniciar Recuento",
      onClick: () => navigate(RoutePaths.MixziStock),
    },
    {
      id: "catalog-management",
      category: "Estructura de Catálogo",
      question: "¿Organizar categorías, familias y unidades de medida?",
      description: "Optimiza la estructura de tus ingredientes para calcular escandallos con precisión.",
      icon: Boxes,
      actionText: "Configurar Catálogo",
      onClick: () => navigate(RoutePaths.MixziStock),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Asistente de Gestión Mixzi
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            ¿Qué quieres hacer hoy? Selecciona una acción para guiarte en la operativa diaria de tu restaurante.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questions.map((q) => {
          const Icon = q.icon;
          return (
            <Card 
              key={q.id}
              className={`transition-all duration-200 hover:shadow-md flex flex-col justify-between ${
                q.primary 
                  ? "border-primary/50 bg-primary/[0.03] hover:border-primary shadow-xs" 
                  : "border-border/80 hover:border-primary/30"
              }`}
            >
              <CardHeader className="pb-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {q.category}
                  </span>
                  {q.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      q.primary 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-rose-500/10 text-rose-500"
                    }`}>
                      {q.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    q.primary ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold leading-snug">
                      {q.question}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1.5 leading-relaxed">
                      {q.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-2">
                <Button 
                  onClick={q.onClick}
                  variant={q.primary ? "default" : "outline"}
                  className="w-full justify-between text-xs sm:text-sm font-semibold"
                >
                  <span>{q.actionText}</span>
                  <ChevronRight className="size-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
