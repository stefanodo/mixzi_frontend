import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import {
  User,
  Shield,
  Building2,
  Key,
  LogOut,
  CheckCircle,
  XCircle,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  Mail,
  Sliders,
  FileSpreadsheet,
  ScanLine,
  Trash2,
  Truck,
  Users
} from "lucide-react";
import AuthStore, { UserProfile } from "@/stores/AuthStore";
import { RoutePaths } from "@/router/routes";

const authStore = new AuthStore();

export const ProfilePage: React.FC = observer(() => {
  const navigate = useNavigate();
  const user = authStore.currentUser;

  const [activeSubTab, setActiveSubTab] = useState<"tenant" | "permissions" | "security">("tenant");
  const [editingTenantName, setEditingTenantName] = useState(user?.tenant?.name || "");
  const [isSaved, setIsSaved] = useState(false);

  const handleLogout = () => {
    authStore.logout();
    navigate(RoutePaths.MixziDashboard);
  };

  const handleSaveTenant = (e: React.FormEvent) => {
    e.preventDefault();
    authStore.updateTenantName(editingTenantName);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const roleTranslations: Record<string, string> = {
    owner: "Propietario / Master Tenant",
    admin: "Administrador del Restaurante",
    head_chef: "Jefe de Cocina / Head Chef",
    staff: "Personal de Sala & BOH",
  };

  const permissionItems = [
    {
      key: "canManageStock",
      title: "Gestión de Stock & Existencias",
      desc: "Creación de artículos, lotes, traspasos y mermas directas.",
      icon: <Layers className="w-4 h-4 text-emerald-500" />,
      allowed: user?.permissions?.canManageStock ?? false,
    },
    {
      key: "canScanReceipts",
      title: "Escaneo OCR de Albaranes",
      desc: "Digitalización automática de facturas de compra y asignación de precios.",
      icon: <ScanLine className="w-4 h-4 text-primary" />,
      allowed: user?.permissions?.canScanReceipts ?? false,
    },
    {
      key: "canManageRecipes",
      title: "Escandallos y Recetas",
      desc: "Edición de costes por ración, ingredientes y mermas de producción.",
      icon: <FileSpreadsheet className="w-4 h-4 text-amber-500" />,
      allowed: user?.permissions?.canManageRecipes ?? false,
    },
    {
      key: "canAuditWaste",
      title: "Auditoría de Desperdicio (Waste API)",
      desc: "Registro de desperdicio por responsable, motivo y artículo.",
      icon: <Trash2 className="w-4 h-4 text-rose-500" />,
      allowed: user?.permissions?.canAuditWaste ?? false,
    },
    {
      key: "canManageSuppliers",
      title: "Gestión de Proveedores",
      desc: "Alta de proveedores y seguimiento de tarifas de compra.",
      icon: <Truck className="w-4 h-4 text-indigo-500" />,
      allowed: user?.permissions?.canManageSuppliers ?? false,
    },
    {
      key: "canManageUsers",
      title: "Administración de Miembros del Tenant",
      desc: "Invitación de empleados y asignación de roles operativos.",
      icon: <Users className="w-4 h-4 text-sky-500" />,
      allowed: user?.permissions?.canManageUsers ?? false,
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Cabecera de Perfil */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-2xl shadow-inner">
            {user?.firstName?.charAt(0) || "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                {user?.firstName} {user?.lastName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                {user?.role ? roleTranslations[user.role] || user.role : "Usuario"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <Mail className="w-3.5 h-3.5" />
              {user?.email}
              <span className="inline-block w-1 h-1 rounded-full bg-border" />
              <span className="text-xs text-muted-foreground">ID: {user?.id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl border border-destructive/30 text-destructive text-sm font-semibold hover:bg-destructive/10 transition flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Tabs de Navegación de Perfil */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveSubTab("tenant")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
            activeSubTab === "tenant"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Tenant & Establecimiento
        </button>
        <button
          onClick={() => setActiveSubTab("permissions")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
            activeSubTab === "permissions"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Shield className="w-4 h-4" />
          Permisos & Roles
        </button>
        <button
          onClick={() => setActiveSubTab("security")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
            activeSubTab === "security"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Key className="w-4 h-4" />
          Tokens & Seguridad
        </button>
      </div>

      {/* Contenido según Tab */}
      {activeSubTab === "tenant" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Datos del Tenant Activo
              </h2>

              <form onSubmit={handleSaveTenant} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Nombre Comercial</label>
                  <input
                    type="text"
                    value={editingTenantName}
                    onChange={(e) => setEditingTenantName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Identificador Tenant</label>
                    <input
                      type="text"
                      disabled
                      value={user?.tenant?.id || "N/A"}
                      className="w-full px-3.5 py-2 rounded-xl border border-input bg-muted text-muted-foreground text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Estado de Cuenta</label>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {user?.tenant?.status === "active" ? "Activo (Operativo)" : "Trial Beta"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Dirección Registrada</label>
                    <div className="text-xs text-foreground p-2 rounded-lg bg-muted/30">
                      {user?.tenant?.address || "Calle Gran Vía 28, Madrid"}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Código Postal</label>
                    <div className="text-xs text-foreground p-2 rounded-lg bg-muted/30">
                      {user?.tenant?.postalCode || "28013"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition shadow-sm"
                  >
                    Guardar Cambios
                  </button>
                  {isSaved && <span className="text-xs text-emerald-600 font-medium">¡Guardado con éxito!</span>}
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Plan Activo BOH
              </h3>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                <div className="font-bold text-base text-primary">
                  {user?.tenant?.planName || "Plan Pro Restauración"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Lotes ilimitados, escaneo inteligente de albaranes y control analítico de costes de receta.
                </p>
                <div className="text-xs text-muted-foreground pt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Prueba extendida hasta 31/12/2026
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Para solicitar planes multi-sucursal o franquicias, contacta con soporte técnico.
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "permissions" && (
        <div className="space-y-6">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-foreground">Permisos del Tenant por Rol</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Capacidades asignadas al rol operativo de tu perfil actual en este restaurante.
                </p>
              </div>

              {/* Selector de rol para simulación y pruebas rápidas */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Simular Rol:</span>
                <select
                  value={user?.role}
                  onChange={(e) => authStore.switchRole(e.target.value as any)}
                  className="text-xs px-3 py-1.5 rounded-xl border border-input bg-background font-semibold focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="owner">Owner (Propietario)</option>
                  <option value="admin">Admin (Gerente)</option>
                  <option value="head_chef">Head Chef</option>
                  <option value="staff">Personal Staff</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {permissionItems.map((item) => (
                <div
                  key={item.key}
                  className="p-4 rounded-xl border border-border/80 bg-background/50 flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-muted/60">{item.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                      {item.allowed ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          <CheckCircle className="w-3 h-3" /> Permitido
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                          <XCircle className="w-3 h-3" /> Restringido
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "security" && (
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            Tokens y Sesión GoTrue / Supabase
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Access Token (Bearer)</label>
              <div className="p-3 rounded-xl bg-muted font-mono text-xs text-muted-foreground break-all select-all">
                {authStore.accessToken || "jwt_bearer_token_mixzi_active"}
              </div>
            </div>

            <div className="pt-2 text-xs text-muted-foreground">
              Los tokens se renuevan de acuerdo al protocolo del <code>AuthController</code> con comprobación de permisos para cada endpoint de la API.
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default ProfilePage;
