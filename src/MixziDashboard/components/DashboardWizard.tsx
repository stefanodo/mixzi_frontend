import { useNavigate } from "react-router-dom";
import { 
  Package, 
  PlusCircle, 
  ArrowRight, 
  Boxes, 
  Sparkles, 
  ClipboardList
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoutePaths } from "@/router/routes";

interface QuickAction {
  id: string;
  question: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
  primary?: boolean;
  actionText: string;
  onClick: () => void;
}

export const DashboardWizard = () => {
  const navigate = useNavigate();

  const actions: QuickAction[] = [
    {
      id: "add-stock-item",
      question: "¿Quieres agregar un artículo en tu inventario?",
      description: "Crea y registra nuevos productos con su precio, categoría y cantidad disponible.",
      icon: PlusCircle,
      badge: "Recomendado",
      primary: true,
      actionText: "Ir a Stock",
      onClick: () => navigate(RoutePaths.MixziStock),
    },
    {
      id: "check-stock",
      question: "¿Revisar niveles y existencias de stock?",
      description: "Consulta el listado general de artículos, alertas de existencias mínimas y estado actual.",
      icon: Boxes,
      actionText: "Ver Inventario",
      onClick: () => navigate(RoutePaths.MixziStock),
    },
    {
      id: "manage-catalog",
      question: "¿Gestionar categorías y referencias?",
      description: "Organiza la estructura de tus artículos para mantener tu catálogo siempre al día.",
      icon: ClipboardList,
      actionText: "Explorar Stock",
      onClick: () => navigate(RoutePaths.MixziStock),
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-10 space-y-8 animate-in fade-in duration-300">
      {/* Header / Hero */}
      <div className="text-center md:text-left space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
          <Sparkles className="size-3.5" />
          <span>Asistente inicial</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          ¿Qué quieres hacer hoy?
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
          Selecciona una acción rápida para comenzar a gestionar tu negocio de forma ágil y organizada.
        </p>
      </div>

      {/* Main Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Card
              key={action.id}
              className={`relative flex flex-col justify-between transition-all duration-200 hover:shadow-md cursor-pointer border ${
                action.primary
                  ? "border-primary/40 bg-card hover:border-primary shadow-xs"
                  : "border-border hover:border-muted-foreground/30"
              }`}
              onClick={action.onClick}
            >
              <CardHeader className="space-y-3 pb-2">
                <div className="flex items-center justify-between">
                  <div
                    className={`p-2.5 rounded-lg inline-flex items-center justify-center ${
                      action.primary
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <Icon className="size-5" />
                  </div>
                  {action.badge && (
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                      {action.badge}
                    </span>
                  )}
                </div>
                <CardTitle className="text-base md:text-lg font-semibold leading-snug">
                  {action.question}
                </CardTitle>
                <CardDescription className="text-xs md:text-sm leading-relaxed text-muted-foreground">
                  {action.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4 flex items-center justify-between mt-auto border-t border-border/50">
                <span className="text-xs font-medium text-foreground">
                  {action.actionText}
                </span>
                <Button
                  size="sm"
                  variant={action.primary ? "default" : "outline"}
                  className="gap-1.5 text-xs h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick();
                  }}
                >
                  Continuar
                  <ArrowRight className="size-3.5" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Helper Footer */}
      <div className="p-4 rounded-xl bg-muted/40 border border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs md:text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Package className="size-4 text-primary" />
          <span>¿Buscas más opciones de inventario? Explora la sección completa de stock.</span>
        </div>
        <Button
          variant="link"
          size="sm"
          className="text-primary p-0 h-auto font-medium"
          onClick={() => navigate(RoutePaths.MixziStock)}
        >
          Ir a MixziStock &rarr;
        </Button>
      </div>
    </div>
  );
};
