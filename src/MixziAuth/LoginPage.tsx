import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Mail,
  Building2,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  ChevronRight,
  X
} from "lucide-react";
import { authStore } from "@/stores/AuthStore";
import { RoutePaths } from "@/router/routes";
import mixziLogo from "../assets/mixi logo.svg";

export const LoginPage: React.FC = observer(() => {
  const navigate = useNavigate();

  // Cerrar la página de login con Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate(RoutePaths.MixziDashboard);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  // Estados de vista
  const hasUnassignedSession = authStore.isAuthenticated && !authStore.currentUser?.tenant;
  const [activeTab, setActiveTab] = useState<"login" | "register">(hasUnassignedSession ? "register" : "login");
  const registerStep = hasUnassignedSession && authStore.profileLoaded ? 2 : 1;
  const [showPassword, setShowPassword] = useState(false);

  // Formulario Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Formulario Registro Paso 1
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Formulario Registro Paso 2 (Tenant y Plan)
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantAddress, setRestaurantAddress] = useState("");
  const [restaurantPostalCode, setRestaurantPostalCode] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");

  // Desbloqueo de cuenta OTP
  const [otpCode, setOtpCode] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await authStore.login(loginEmail, loginPassword);
    if (ok) {
      if (authStore.currentUser?.tenant) {
        navigate(RoutePaths.MixziDashboard);
      } else {
        setActiveTab("register");
      }
    }
  };

  const handleRegisterStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      authStore.setErrorMessage("Debes aceptar los Términos y Condiciones para continuar.");
      return;
    }

    const res = await authStore.registerStep1({
      firstName: regFirstName,
      lastName: regLastName,
      email: regEmail,
      password: regPassword,
      termsAccepted: true,
      termsVersion: "v1",
    });

    if (res.success && res.token) setActiveTab("register");
  };

  const handleRegisterStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantName.trim()) {
      authStore.setErrorMessage("Por favor indica el nombre de tu restaurante o establecimiento.");
      return;
    }

    const ok = await authStore.completeRegistrationStep2({
      restaurantName: restaurantName.trim(),
      address: restaurantAddress.trim() || undefined,
      postalCode: restaurantPostalCode.trim() || undefined,
      planId: selectedPlanId.trim(),
    });

    if (ok) {
      navigate(RoutePaths.MixziDashboard);
    } else if (!authStore.isAuthenticated) {
      setActiveTab("login");
    }
  };

  const handleConfirmOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await authStore.confirmUnlockCode(authStore.lockedEmail || loginEmail, otpCode);
    if (ok) {
      if (authStore.currentUser?.tenant) {
        navigate(RoutePaths.MixziDashboard);
      } else {
        setActiveTab("register");
      }
    }
  };

  const handleResendOtp = async () => {
    await authStore.requestUnlockCode(authStore.lockedEmail || loginEmail);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-muted/40 to-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl">
        {/* Cabecera de la Marca */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 mb-3">
              <img
                  src={mixziLogo}
                  alt="Mixzi"
                  className="h-8 w-auto max-w-31 object-contain select-none pointer-events-none drop-shadow-sm"
                  draggable={false}
              />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-quicksand">
            
            <span className="text-primary font-normal text-2xl">mixzi</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Plataforma Integral de Gestión de Cocina, Stock y Operaciones
          </p>
        </div>

        {/* Card Principal con botón de cerrar hacia el Dashboard */}
        <div className="relative bg-card border border-border/80 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl">
          <button
            type="button"
            onClick={() => navigate(RoutePaths.MixziDashboard)}
            className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            title="Cerrar y volver al Dashboard (Esc)"
            aria-label="Cerrar y volver al Dashboard"
          >
            <X className="w-5 h-5" />
          </button>
          {/* Alerta de cuenta bloqueada */}
          {authStore.isAccountLocked ? (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400">
                <ShieldAlert className="w-6 h-6 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold">Cuenta protegida por seguridad</h3>
                  <p className="text-xs mt-0.5 opacity-90">
                    Solicita un código para verificar tu correo y desbloquear la cuenta.
                  </p>
                </div>
              </div>

              {authStore.otpSentMessage && (
                <div className="text-xs p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                  {authStore.otpSentMessage}
                </div>
              )}

              <form onSubmit={handleConfirmOtp} className="space-y-4">
                <div>
                  <label htmlFor="unlock-code" className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                    Código de desbloqueo
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="unlock-code"
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Ej. 123456"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm font-mono tracking-widest focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                {authStore.errorMessage && (
                  <p role="alert" className="text-xs text-destructive font-medium">{authStore.errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={authStore.isLoading || !otpCode}
                  className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition shadow-md disabled:opacity-50"
                >
                  {authStore.isLoading ? "Verificando..." : "Desbloquear y Acceder"}
                </button>

                <div className="flex justify-between items-center pt-2 text-xs">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={authStore.isLoading}
                    className="text-primary hover:underline"
                  >
                    {authStore.otpSentMessage ? "Reenviar código de acceso" : "Solicitar código de acceso"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      authStore.setAccountLocked(false);
                      authStore.clearAuthErrors();
                      setOtpCode("");
                    }}
                    className="text-muted-foreground hover:underline"
                  >
                    Volver al login
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* Selector de Pestaña */}
              <div className="grid grid-cols-2 border-b border-border/70 p-1.5 bg-muted/30">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("login");
                    authStore.clearAuthErrors();
                  }}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
                    activeTab === "login"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("register");
                    authStore.clearAuthErrors();
                  }}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
                    activeTab === "register"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Registro Restaurante
                </button>
              </div>

              <div className="p-6 sm:p-8">
                {activeTab === "login" ? (
                  /* ================= FORMULARIO LOGIN ================= */
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="login-email" className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                        Correo Electrónico
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="login-email"
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="chef@restaurante.com"
                          required
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label htmlFor="login-password" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                          Contraseña
                        </label>
                        <button
                          type="button"
                          onClick={() => authStore.requestUnlockCode(loginEmail)}
                          disabled={authStore.isLoading}
                          className="text-xs text-primary hover:underline"
                        >
                          ¿Cuenta bloqueada? Solicitar código
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          className="absolute right-1 top-1/2 flex min-h-12 min-w-12 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {authStore.errorMessage && (
                      <div role="alert" className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                        {authStore.errorMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={authStore.isLoading}
                      className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition shadow-md flex items-center justify-center gap-2"
                    >
                      {authStore.isLoading ? (
                        "Accediendo a Mixzi..."
                      ) : (
                        <>
                          <span>Entrar al BOH</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="pt-3 border-t border-border/60 space-y-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          Multi-tenant aislado
                        </span>
                        <span>API OpenAPI 2026 Compliant</span>
                      </div>
                      <div className="text-center pt-1">
                        <button
                          type="button"
                          onClick={() => navigate(RoutePaths.MixziDashboard)}
                          className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition"
                        >
                          ← Volver al Dashboard sin iniciar sesión
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  /* ================= FORMULARIO REGISTRO ================= */
                  <div className="space-y-6">
                    {/* Indicador de Pasos del AuthController */}
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                            registerStep >= 1
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          1
                        </span>
                        <span className="text-xs font-semibold text-foreground">Usuario Auth</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                            registerStep === 2
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          2
                        </span>
                        <span className="text-xs font-semibold text-foreground">Tenant & Plan</span>
                      </div>
                    </div>

                    {hasUnassignedSession && !authStore.profileLoaded ? (
                      <div role="status" className="space-y-3">
                        <p>{authStore.profileError ? "No se pudo comprobar el restaurante de tu cuenta." : "Comprobando tu cuenta..."}</p>
                        {authStore.profileError && (
                          <button type="button" className="min-h-12 rounded-xl bg-primary px-4 text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" onClick={() => void authStore.loadProfile()}>
                            Reintentar
                          </button>
                        )}
                      </div>
                    ) : registerStep === 1 ? (
                      /* Paso 1: POST /auth/register */
                      <form onSubmit={handleRegisterStep1} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="register-first-name" className="text-xs font-semibold text-foreground block mb-1">Nombre</label>
                            <input
                              id="register-first-name"
                              type="text"
                              value={regFirstName}
                              onChange={(e) => setRegFirstName(e.target.value)}
                              placeholder="Elena"
                              required
                              className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
                            />
                          </div>
                          <div>
                            <label htmlFor="register-last-name" className="text-xs font-semibold text-foreground block mb-1">Apellidos</label>
                            <input
                              id="register-last-name"
                              type="text"
                              value={regLastName}
                              onChange={(e) => setRegLastName(e.target.value)}
                              placeholder="Navarro"
                              required
                              className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="register-email" className="text-xs font-semibold text-foreground block mb-1">Correo Electrónico</label>
                          <input
                            id="register-email"
                            type="email"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            placeholder="gerencia@mirestaurante.com"
                            required
                            className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
                          />
                        </div>

                        <div>
                          <label htmlFor="register-password" className="text-xs font-semibold text-foreground block mb-1">Contraseña (Mín. 8 caracteres)</label>
                          <input
                            id="register-password"
                            type="password"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="Mínimo 8 caracteres"
                            minLength={8}
                            required
                            className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
                          />
                        </div>

                        {/* Checkbox Términos requerido por backend termsAccepted / termsVersion */}
                        <div className="p-3 rounded-xl bg-muted/40 border border-border/80 flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            id="termsCheck"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="mt-0.5 rounded text-primary focus:ring-primary h-4 w-4"
                          />
                          <label htmlFor="termsCheck" className="text-xs text-muted-foreground leading-relaxed">
                            Acepto los Términos de Servicio y Tratamiento de Datos (v1) para la gestión back of house.
                          </label>
                        </div>

                        {authStore.errorMessage && (
                          <p role="alert" className="text-xs text-destructive">{authStore.errorMessage}</p>
                        )}

                        <button
                          type="submit"
                          disabled={authStore.isLoading || !termsAccepted}
                          className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition shadow flex items-center justify-center gap-2"
                        >
                          <span>Continuar al Paso 2</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </form>
                    ) : (
                      /* Paso 2: POST /auth/complete-registration */
                      <form onSubmit={handleRegisterStep2} className="space-y-4">
                        <div>
                          <label htmlFor="restaurant-name" className="text-xs font-semibold text-foreground block mb-1">
                            Nombre del Restaurante / Tenant
                          </label>
                          <div className="relative">
                            <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                              id="restaurant-name"
                              type="text"
                              value={restaurantName}
                              onChange={(e) => setRestaurantName(e.target.value)}
                              placeholder="Ej. Taberna La Central"
                              required
                              className="w-full pl-10 pr-4 py-2 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="col-span-2">
                            <label htmlFor="restaurant-address" className="text-xs font-semibold text-foreground block mb-1">Dirección</label>
                            <input
                              id="restaurant-address"
                              type="text"
                              value={restaurantAddress}
                              onChange={(e) => setRestaurantAddress(e.target.value)}
                              placeholder="Calle Mayor 12"
                              className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
                            />
                          </div>
                          <div>
                            <label htmlFor="restaurant-postal-code" className="text-xs font-semibold text-foreground block mb-1">C.P.</label>
                            <input
                              id="restaurant-postal-code"
                              type="text"
                              value={restaurantPostalCode}
                              onChange={(e) => setRestaurantPostalCode(e.target.value)}
                              placeholder="28001"
                              className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="plan-id" className="text-xs font-semibold text-foreground block mb-2">
                            Identificador del plan
                          </label>
                          <input
                            id="plan-id"
                            value={selectedPlanId}
                            onChange={(e) => setSelectedPlanId(e.target.value)}
                            required
                            placeholder="UUID del plan facilitado por Mixzi"
                            className="min-h-12 w-full rounded-xl border border-input bg-background px-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                          />
                          <p className="mt-1 text-xs text-muted-foreground">Solicita a Mixzi el identificador de un plan disponible.</p>
                        </div>

                        {authStore.errorMessage && (
                          <p role="alert" className="text-xs text-destructive">{authStore.errorMessage}</p>
                        )}

                        <div className="flex gap-2 pt-2">
                          <button
                            type="submit"
                            disabled={authStore.isLoading}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition shadow flex items-center justify-center gap-2"
                          >
                            {authStore.isLoading ? "Activando Tenant..." : "Crear Tenant y Comenzar"}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default LoginPage;
