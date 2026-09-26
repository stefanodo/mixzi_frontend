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
  Sparkles,
  KeyRound,
  FileCheck,
  ChevronRight,
  Layers,
  ChefHat
} from "lucide-react";
import AuthStore from "@/stores/AuthStore";
import { RoutePaths } from "@/router/routes";

// Instancia compartida para acceso a Auth
const authStore = new AuthStore();

export const LoginPage: React.FC = observer(() => {
  const navigate = useNavigate();

  // Estados de vista
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);

  // Formulario Login
  const [loginEmail, setLoginEmail] = useState("chef@mixzi.rest");
  const [loginPassword, setLoginPassword] = useState("Restaurante2026!");

  // Formulario Registro Paso 1
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [step1Token, setStep1Token] = useState("");

  // Formulario Registro Paso 2 (Tenant y Plan)
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantAddress, setRestaurantAddress] = useState("");
  const [restaurantPostalCode, setRestaurantPostalCode] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("plan_enterprise_pro");

  // Desbloqueo de cuenta OTP
  const [otpCode, setOtpCode] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await authStore.login(loginEmail, loginPassword);
    if (ok) {
      navigate(RoutePaths.MixziDashboard);
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
      termsVersion: "1.0",
    });

    if (res.success && res.token) {
      setStep1Token(res.token);
      setRegisterStep(2);
    }
  };

  const handleRegisterStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantName.trim()) {
      authStore.setErrorMessage("Por favor indica el nombre de tu restaurante o establecimiento.");
      return;
    }

    const ok = await authStore.completeRegistrationStep2(step1Token, {
      restaurantName,
      address: restaurantAddress,
      postalCode: restaurantPostalCode,
      planId: selectedPlanId,
    });

    if (ok) {
      navigate(RoutePaths.MixziDashboard);
    }
  };

  const handleConfirmOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await authStore.confirmUnlockCode(authStore.lockedEmail || loginEmail, otpCode);
    if (ok) {
      navigate(RoutePaths.MixziDashboard);
    }
  };

  const handleResendOtp = async () => {
    await authStore.requestUnlockCode(authStore.lockedEmail || loginEmail);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/40 to-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl">
        {/* Cabecera de la Marca */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 mb-3">
            <ChefHat className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-quicksand">
            Mixzi <span className="text-primary font-normal text-2xl">BOH</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Plataforma Integral de Gestión de Cocina, Stock y Operaciones
          </p>
        </div>

        {/* Card Principal */}
        <div className="bg-card border border-border/80 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl">
          {/* Alerta de cuenta bloqueada */}
          {authStore.isAccountLocked ? (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400">
                <ShieldAlert className="w-6 h-6 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold">Cuenta protegida por seguridad</h3>
                  <p className="text-xs mt-0.5 opacity-90">
                    5 intentos fallidos consecutivos detectados (código GoTrue). Introduce el código OTP de desbloqueo enviado a tu correo.
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
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                    Código de Desbloqueo (POST /auth/confirm-login-code)
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
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
                  <p className="text-xs text-destructive font-medium">{authStore.errorMessage}</p>
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
                    className="text-primary hover:underline"
                  >
                    Reenviar código de acceso
                  </button>
                  <button
                    type="button"
                    onClick={() => authStore.setAccountLocked(false)}
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
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                        Correo Electrónico
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
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
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                          Contraseña
                        </label>
                        <button
                          type="button"
                          onClick={() => authStore.requestUnlockCode(loginEmail)}
                          className="text-xs text-primary hover:underline"
                        >
                          ¿Problemas de acceso?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
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
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {authStore.errorMessage && (
                      <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
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

                    <div className="pt-3 border-t border-border/60">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          Multi-tenant aislado
                        </span>
                        <span>API OpenAPI 2026 Compliant</span>
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

                    {registerStep === 1 ? (
                      /* Paso 1: POST /auth/register */
                      <form onSubmit={handleRegisterStep1} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-foreground block mb-1">Nombre</label>
                            <input
                              type="text"
                              value={regFirstName}
                              onChange={(e) => setRegFirstName(e.target.value)}
                              placeholder="Elena"
                              required
                              className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-foreground block mb-1">Apellidos</label>
                            <input
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
                          <label className="text-xs font-semibold text-foreground block mb-1">Correo Electrónico</label>
                          <input
                            type="email"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            placeholder="gerencia@mirestaurante.com"
                            required
                            className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-foreground block mb-1">Contraseña (Mín. 8 caracteres)</label>
                          <input
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
                            Acepto los Términos de Servicio y Tratamiento de Datos (v1.0) para la gestión back of house.
                          </label>
                        </div>

                        {authStore.errorMessage && (
                          <p className="text-xs text-destructive">{authStore.errorMessage}</p>
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
                          <label className="text-xs font-semibold text-foreground block mb-1">
                            Nombre del Restaurante / Tenant
                          </label>
                          <div className="relative">
                            <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
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
                            <label className="text-xs font-semibold text-foreground block mb-1">Dirección</label>
                            <input
                              type="text"
                              value={restaurantAddress}
                              onChange={(e) => setRestaurantAddress(e.target.value)}
                              placeholder="Calle Mayor 12"
                              className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-foreground block mb-1">C.P.</label>
                            <input
                              type="text"
                              value={restaurantPostalCode}
                              onChange={(e) => setRestaurantPostalCode(e.target.value)}
                              placeholder="28001"
                              className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-foreground block mb-2">
                            Plan Mixzi para el Tenant
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <div
                              onClick={() => setSelectedPlanId("plan_starter")}
                              className={`p-3 rounded-xl border cursor-pointer transition ${
                                selectedPlanId === "plan_starter"
                                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                                  : "border-border hover:bg-muted/30"
                              }`}
                            >
                              <div className="font-semibold text-sm">Starter BOH</div>
                              <div className="text-xs text-muted-foreground mt-0.5">Control de stock & escandallos</div>
                            </div>

                            <div
                              onClick={() => setSelectedPlanId("plan_enterprise_pro")}
                              className={`p-3 rounded-xl border cursor-pointer transition ${
                                selectedPlanId === "plan_enterprise_pro"
                                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                                  : "border-border hover:bg-muted/30"
                              }`}
                            >
                              <div className="flex items-center gap-1 font-semibold text-sm text-primary">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Pro Restauración</span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">Escaneo OCR + Auditorías</div>
                            </div>
                          </div>
                        </div>

                        {authStore.errorMessage && (
                          <p className="text-xs text-destructive">{authStore.errorMessage}</p>
                        )}

                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setRegisterStep(1)}
                            className="py-2.5 px-4 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition"
                          >
                            Atrás
                          </button>
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
