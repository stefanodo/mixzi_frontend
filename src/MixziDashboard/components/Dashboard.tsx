import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  PlusCircle, 
  AlertTriangle, 
  TrendingUp, 
  Layers, 
  Sparkles, 
  Search, 
  Boxes, 
  LayoutDashboard, 
  Activity, 
  ShieldAlert, 
  ArrowUpRight,
  CheckCircle2,
  Clock,
  ChevronRight,
  Filter,
  RefreshCw
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoutePaths } from "@/router/routes";
import { DashboardWizard } from "./DashboardWizard";
import { InventoryCharts } from "./InventoryCharts";

export type DashboardViewMode = "overview" | "wizard" | "analytics" | "critical";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DashboardViewMode>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  // Suggested intents for the interactive copilot search
  const quickIntents = [
    { label: "+ Agregar artículo", action: () => navigate(`${RoutePaths.MixziStock}?action=add-item&block=Frescos`, { state: { action: "add-item", block: "Frescos" } }) },
    { label: "🚨 6 productos críticos", action: () => setActiveTab("critical") },
    { label: "📊 Distribución de costes", action: () => setActiveTab("analytics") },
    { label: "⚡ Modo Asistente", action: () => setActiveTab("wizard") },
  ];

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
      {/* 1. Header & Live Resto-Cockpit Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Servicio Activo
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Actualizado hace 2m
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Panel de Control & Inventario</h1>
          <p className="text-sm text-muted-foreground">
            Gestión inteligente de existencias, costes y aprovisionamiento en restauración.
          </p>
        </div>

        {/* Action Header Button Group */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(RoutePaths.MixziStock)}
            className="gap-1.5 text-xs sm:text-sm"
          >
            <Boxes className="w-4 h-4 text-primary" />
            <span>Ver Inventario</span>
          </Button>
          <Button 
            size="sm" 
            onClick={() => navigate(`${RoutePaths.MixziStock}?action=add-item&block=Frescos`, { state: { action: "add-item", block: "Frescos" } })}
            className="gap-1.5 bg-primary text-primary-foreground text-xs sm:text-sm font-medium shadow-sm hover:opacity-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Agregar Artículo</span>
          </Button>
        </div>
      </div>

      {/* 2. Interactive Navigation & Search Bar ("¿Qué quieres hacer hoy?") */}
      <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Question / Search intent trigger */}
          <div className="relative flex-1">
            <div className="flex items-center gap-2.5 bg-muted/60 hover:bg-muted/90 transition-colors border border-border rounded-xl px-3.5 py-2.5">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <input 
                type="text"
                placeholder="¿Qué quieres hacer hoy? (ej. agregar producto, revisar alertas, costes...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none text-foreground"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Quick Intent Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <span className="text-xs font-medium text-muted-foreground shrink-0 hidden sm:inline">Sugerencias:</span>
            {quickIntents.map((item, idx) => (
              <button
                key={idx}
                onClick={item.action}
                className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full border border-border bg-background hover:bg-accent hover:text-accent-foreground font-medium transition-all hover:scale-[1.02] active:scale-95 text-foreground"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "overview"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Resumen 360°</span>
            </button>

            <button
              onClick={() => setActiveTab("wizard")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "wizard"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Asistente & Tareas</span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "analytics"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Costes & Rotación</span>
            </button>

            <button
              onClick={() => setActiveTab("critical")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "critical"
                  ? "bg-rose-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-rose-500/10"
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Alertas Críticas (6)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Interactive KPI Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card 
          onClick={() => setActiveTab("analytics")}
          className="cursor-pointer border-border hover:border-primary/50 transition-all hover:shadow-md"
        >
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium">Valor Total Stock</span>
              <Layers className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold tracking-tight">€14,180</div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+4.2% este mes</span>
            </div>
          </CardContent>
        </Card>

        <Card 
          onClick={() => setActiveTab("critical")}
          className="cursor-pointer border-rose-500/30 hover:border-rose-500 transition-all hover:shadow-md bg-rose-500/[0.02]"
        >
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium text-rose-500 font-semibold">Stock Crítico</span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">6 Artículos</div>
            <div className="flex items-center gap-1 mt-1.5 text-xs text-rose-500">
              <span>Requieren pedido urgente</span>
            </div>
          </CardContent>
        </Card>

        <Card 
          onClick={() => setActiveTab("analytics")}
          className="cursor-pointer border-border hover:border-primary/50 transition-all hover:shadow-md"
        >
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium">Eficiencia Rotación</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold tracking-tight">88% Óptimo</div>
            <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
              <span>Bajo desperdicio de cocina</span>
            </div>
          </CardContent>
        </Card>

        <Card 
          onClick={() => navigate(RoutePaths.MixziStock)}
          className="cursor-pointer border-border hover:border-primary/50 transition-all hover:shadow-md"
        >
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium">Catálogo Activo</span>
              <Package className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold tracking-tight">176 Referencias</div>
            <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
              <span>5 categorías operativas</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Tab Content Integration */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Integrated Cockpit Grid: Assistant + Stock Health side by side on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left side: Guided Action Hub (Wizard integrado) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Acciones Rápidas del Día
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setActiveTab("wizard")}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Ver todas
                </Button>
              </div>

              {/* Main Promoted Card: "¿Quieres agregar un artículo en tu inventario?" */}
              <Card className="border-primary/40 bg-gradient-to-br from-primary/[0.06] via-transparent to-primary/[0.02] shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                      Pregunta Principal
                    </span>
                    <PlusCircle className="w-5 h-5 text-primary group-hover:rotate-90 transition-transform duration-300" />
                  </div>
                  <CardTitle className="text-base sm:text-lg font-bold pt-2">
                    ¿Quieres agregar un artículo en tu inventario?
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Registra materias primas, bebidas o insumos con su precio, categoría y stock mínimo.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    onClick={() => navigate(`${RoutePaths.MixziStock}?action=add-item&block=Frescos`, { state: { action: "add-item", block: "Frescos" } })}
                    className="w-full gap-2 font-semibold shadow-sm text-sm"
                  >
                    <span>Ir a Stock para Agregar</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Secondary fast cards */}
              <div className="grid grid-cols-1 gap-3">
                <Card 
                  onClick={() => setActiveTab("critical")}
                  className="cursor-pointer border-border hover:border-rose-400 hover:bg-rose-500/[0.02] transition-all p-3.5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">¿Revisar alertas de reposición?</h4>
                      <p className="text-xs text-muted-foreground">6 ingredientes están por debajo del mínimo.</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </Card>

                <Card 
                  onClick={() => navigate(RoutePaths.MixziStock)}
                  className="cursor-pointer border-border hover:border-primary/40 hover:bg-muted/40 transition-all p-3.5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                      <Boxes className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">¿Hacer recuento o auditoría?</h4>
                      <p className="text-xs text-muted-foreground">Comprueba las existencias físicas del almacén.</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </Card>
              </div>
            </div>

            {/* Right side: Stock Health & Live Category Allocation */}
            <div className="lg:col-span-7">
              <InventoryCharts 
                onSelectCategory={(cat) => setSelectedCategoryFilter(cat)}
                compact
              />
            </div>
          </div>

          {/* Full Analytical Charts */}
          <div className="pt-4 border-t border-border/60">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold tracking-tight">Análisis Operativo & Rotación Semanal</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Monitoreo de entradas de mercancía vs consumo del servicio.</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setActiveTab("analytics")}
                className="gap-1.5 text-xs"
              >
                <span>Ver detalles de costes</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
            <InventoryCharts detailedOnly />
          </div>
        </div>
      )}

      {/* Tab: Dedicated Wizard Mode */}
      {activeTab === "wizard" && (
        <div className="animate-in fade-in duration-200">
          <DashboardWizard />
        </div>
      )}

      {/* Tab: Analytics Deep Dive */}
      {activeTab === "analytics" && (
        <div className="animate-in fade-in duration-200">
          <InventoryCharts />
        </div>
      )}

      {/* Tab: Critical Alerts Center */}
      {activeTab === "critical" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <Card className="border-rose-500/40 bg-rose-500/[0.03]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  <CardTitle className="text-lg font-bold">Alertas de Reposición Inmediata</CardTitle>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => navigate(RoutePaths.MixziStock)}
                  className="bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs sm:text-sm gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Reponer en Stock</span>
                </Button>
              </div>
              <CardDescription>
                Estos 6 productos están por debajo del nivel de seguridad configurado y requieren pedido hoy para evitar roturas de carta.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {[
                  { name: "Solomillo de Ternera", category: "Carnes & Aves", current: "3.5 kg", min: "10 kg", supplier: "Cárnicas Sierra", urgency: "Crítico" },
                  { name: "Aceite Oliva Virgen Extra", category: "Secos & Despensa", current: "4 L", min: "15 L", supplier: "Almazara Sur", urgency: "Crítico" },
                  { name: "Vino Ribera Crianza", category: "Bebidas & Bodega", current: "6 botellas", min: "24 botellas", supplier: "Bodegas Aranda", urgency: "Alto" },
                  { name: "Aguacates Hass", category: "Frutas & Verduras", current: "2 kg", min: "8 kg", supplier: "Mercamadrid", urgency: "Alto" },
                  { name: "Leche Entera Fresca", category: "Lácteos & Huevos", current: "5 L", min: "20 L", supplier: "Lácteos Central", urgency: "Medio" },
                  { name: "Gambas Rojas Congeladas", category: "Pescados & Mariscos", current: "1.8 kg", min: "5 kg", supplier: "Mariscos del Cantábrico", urgency: "Medio" },
                ].map((item, idx) => (
                  <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">{item.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-medium text-muted-foreground">{item.category}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Proveedor habitual: {item.supplier}</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <span className="text-xs font-bold text-rose-500">{item.current}</span>
                        <span className="text-xs text-muted-foreground"> (Mín: {item.min})</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => navigate(RoutePaths.MixziStock)}
                        className="text-xs h-8"
                      >
                        Reponer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
