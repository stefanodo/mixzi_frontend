import { makeAutoObservable } from "mobx";
import { AuthApi } from "@/_generated/apis/AuthApi";
import { Configuration as ApiConfig, FetchError } from "@/_generated/runtime";
import { MIXZI_API_BASE, MIXZI_AUTH_BASE, MIXZI_AUTH_ANON_KEY } from "@/config/envVariables";

export interface TenantPermissions {
  canManageStock: boolean;
  canViewStock: boolean;
  canScanReceipts: boolean;
  canManageRecipes: boolean;
  canAuditWaste: boolean;
  canManageSuppliers: boolean;
  canManageUsers: boolean;
  canManageBilling: boolean;
  canExportReports: boolean;
}

export type UserRole = "owner" | "admin" | "head_chef" | "staff";

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenant: {
    id: string;
    name: string;
    planId: string;
    planName: string;
    status: "active" | "trial" | "past_due";
    trialEndsAt?: string;
    address?: string;
    postalCode?: string;
  };
  permissions: TenantPermissions;
}

export interface RegistrationSession {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
}

const ROLE_PERMISSIONS: Record<UserRole, TenantPermissions> = {
  owner: {
    canManageStock: true,
    canViewStock: true,
    canScanReceipts: true,
    canManageRecipes: true,
    canAuditWaste: true,
    canManageSuppliers: true,
    canManageUsers: true,
    canManageBilling: true,
    canExportReports: true,
  },
  admin: {
    canManageStock: true,
    canViewStock: true,
    canScanReceipts: true,
    canManageRecipes: true,
    canAuditWaste: true,
    canManageSuppliers: true,
    canManageUsers: true,
    canManageBilling: false,
    canExportReports: true,
  },
  head_chef: {
    canManageStock: true,
    canViewStock: true,
    canScanReceipts: true,
    canManageRecipes: true,
    canAuditWaste: true,
    canManageSuppliers: false,
    canManageUsers: false,
    canManageBilling: false,
    canExportReports: true,
  },
  staff: {
    canManageStock: true,
    canViewStock: true,
    canScanReceipts: false,
    canManageRecipes: false,
    canAuditWaste: true,
    canManageSuppliers: false,
    canManageUsers: false,
    canManageBilling: false,
    canExportReports: false,
  },
};

const SESSION_STORAGE_KEY = "mixzi_auth_session";

interface JwtClaims {
  sub?: string;
  tenant_id?: string;
  user_role?: string;
  app_metadata?: { role?: string };
}

interface UserMetadata {
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
}

const decodeJwtClaims = (token: string): JwtClaims => {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload));
  } catch {
    return {};
  }
};

interface SupabaseTokenResponse {
  access_token: string;
  refresh_token: string;
  user?: { id: string; email?: string; user_metadata?: UserMetadata };
}

type TokenResult =
  | { ok: true; data: SupabaseTokenResponse }
  | { ok: false; status: number; message: string };

export default class AuthStore {
  isLoading = false;
  errorMessage: string | null = null;

  isAuthenticated = false;
  accessToken: string | null = null;
  refreshToken: string | null = null;
  currentUser: UserProfile | null = null;

  // Cuenta bloqueada por intentos fallidos (ACCOUNT_LOCKED_VERIFY_EMAIL): flujo de desbloqueo por OTP.
  isAccountLocked = false;
  lockedEmail = "";
  otpSentMessage: string | null = null;

  private authApi = new AuthApi(new ApiConfig({ basePath: MIXZI_API_BASE }));
  private refreshInFlight: Promise<boolean> | null = null;

  constructor() {
    makeAutoObservable<AuthStore, "authApi" | "refreshInFlight">(this, {
      authApi: false,
      refreshInFlight: false,
    });
    this.restoreSession();
  }

  setIsLoading = (value: boolean) => {
    this.isLoading = value;
  };

  setErrorMessage = (message: string | null) => {
    this.errorMessage = message;
  };

  setAccountLocked = (locked: boolean, email = "") => {
    this.isAccountLocked = locked;
    this.lockedEmail = email;
    this.otpSentMessage = null;
  };

  setOtpSentMessage = (msg: string | null) => {
    this.otpSentMessage = msg;
  };

  clearAuthErrors = () => {
    this.errorMessage = null;
  };

  setSession = (accessToken: string, refreshToken: string, user: UserProfile) => {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.currentUser = user;
    this.isAuthenticated = true;
    this.isAccountLocked = false;
    this.errorMessage = null;
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ accessToken, refreshToken, user }));
  };

  updateTenantName = (name: string) => {
    if (!this.currentUser || !this.accessToken) return;
    this.setSession(this.accessToken, this.refreshToken ?? "", {
      ...this.currentUser,
      tenant: { ...this.currentUser.tenant, name },
    });
  };

  logout = () => {
    const token = this.accessToken;
    this.isAuthenticated = false;
    this.accessToken = null;
    this.refreshToken = null;
    this.currentUser = null;
    this.isAccountLocked = false;
    localStorage.removeItem(SESSION_STORAGE_KEY);

    // Revoca la sesión en el servidor; si falla, la sesión local ya está cerrada.
    if (token) {
      fetch(`${MIXZI_AUTH_BASE}/auth/v1/logout`, {
        method: "POST",
        headers: { apikey: MIXZI_AUTH_ANON_KEY ?? "", Authorization: `Bearer ${token}` },
      }).catch(() => undefined);
    }
  };

  // Hooks de ApiService: solo estado de carga global.
  onStartedRequest = async () => {
    this.setIsLoading(true);
  };

  onSuccessfulRequest = () => {
    this.setIsLoading(false);
  };

  onUnsuccessfulRequest = () => {
    this.setIsLoading(false);
  };

  /**
   * fetch autenticado: añade el Bearer y, ante un 401, renueva la sesión y reintenta una vez.
   * Si no se puede renovar, cierra la sesión.
   */
  authorizedFetch = async (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
    const send = () => {
      const headers = new Headers(init.headers);
      if (this.accessToken) headers.set("Authorization", `Bearer ${this.accessToken}`);
      return fetch(input, { ...init, headers });
    };

    const res = await send();
    if (res.status !== 401 || !this.accessToken) return res;
    if (!this.refreshToken) {
      this.logout();
      return res;
    }
    return (await this.refreshSession()) ? send() : res;
  };

  // Una sola renovación a la vez: los refresh tokens de Supabase son de un solo uso.
  refreshSession = (): Promise<boolean> => {
    this.refreshInFlight ??= this.doRefresh().finally(() => {
      this.refreshInFlight = null;
    });
    return this.refreshInFlight;
  };

  private doRefresh = async (): Promise<boolean> => {
    if (!this.refreshToken) return false;

    const result = await this.requestTokens("refresh_token", { refresh_token: this.refreshToken });
    if (!result.ok) {
      // Solo se cierra sesión si el refresh token es inválido, no ante fallos de red o 5xx.
      if (result.status >= 400 && result.status < 500) this.logout();
      return false;
    }

    const { data } = result;
    this.setSession(
      data.access_token,
      data.refresh_token,
      this.buildUser(data.access_token, data.user, this.currentUser?.tenant)
    );
    return true;
  };

  login = async (email: string, password: string): Promise<boolean> => {
    this.setIsLoading(true);
    this.clearAuthErrors();

    const result = await this.requestTokens("password", { email, password });
    this.setIsLoading(false);

    if (!result.ok) {
      if (result.message.includes("ACCOUNT_LOCKED_VERIFY_EMAIL")) {
        this.setAccountLocked(true, email);
        await this.requestUnlockCode(email);
      } else if (result.status === 429) {
        this.setErrorMessage("Demasiados intentos. Inténtalo de nuevo en unos minutos.");
      } else if (result.status === 0) {
        this.setErrorMessage("No se pudo conectar con el servidor");
      } else {
        this.setErrorMessage("Email o contraseña incorrectos");
      }
      return false;
    }

    const { data } = result;
    this.setSession(data.access_token, data.refresh_token, this.buildUser(data.access_token, data.user, undefined, email));
    return true;
  };

  /** POST /auth/verify-login-code: envía el OTP de desbloqueo (responde 200 exista o no la cuenta). */
  requestUnlockCode = async (email: string): Promise<void> => {
    this.setIsLoading(true);
    try {
      await this.authApi.authControllerVerifyLoginCode({ verifyLoginCodeDto: { email } });
    } catch (err) {
      // El endpoint responde 200 exista o no la cuenta; solo un fallo de conexión es un error real.
      if (err instanceof FetchError) {
        this.setErrorMessage("No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.");
        this.setIsLoading(false);
        return;
      }
    }
    this.clearAuthErrors();
    this.setOtpSentMessage(`Si la cuenta existe, hemos enviado un código a ${email}.`);
    this.setIsLoading(false);
  };

  /** POST /auth/confirm-login-code: valida el OTP y devuelve una sesión completa. */
  confirmUnlockCode = async (email: string, code: string): Promise<boolean> => {
    this.setIsLoading(true);
    this.clearAuthErrors();

    try {
      const res = await this.authApi.authControllerConfirmLoginCode({
        confirmLoginCodeDto: { email, code },
      });
      this.setSession(
        res.accessToken,
        res.refreshToken,
        this.buildUser(res.accessToken, { id: res.userId, email: res.email })
      );
      return true;
    } catch {
      this.setErrorMessage("Código incorrecto o caducado. Vuelve a intentarlo.");
      return false;
    } finally {
      this.setIsLoading(false);
    }
  };

  /** Paso 1 de registro (POST /auth/register). No abre sesión: el usuario aún no tiene tenant. */
  registerStep1 = async (payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    termsAccepted: boolean;
    termsVersion: string;
  }): Promise<RegistrationSession | null> => {
    this.setIsLoading(true);
    this.clearAuthErrors();

    try {
      const res = await this.authApi.authControllerRegister({ registerDto: payload });
      return { accessToken: res.accessToken, refreshToken: res.refreshToken, userId: res.userId, email: res.email };
    } catch {
      this.setErrorMessage("No se pudo crear la cuenta. Revisa los datos o prueba con otro correo.");
      return null;
    } finally {
      this.setIsLoading(false);
    }
  };

  /**
   * Paso 2 de registro (POST /auth/complete-registration). El token usado no lleva tenant_id,
   * así que tras crear el tenant se renueva con el refresh token para obtener uno nuevo con el claim.
   */
  completeRegistrationStep2 = async (
    session: RegistrationSession,
    payload: { restaurantName: string; address?: string; postalCode?: string; planId: string }
  ): Promise<boolean> => {
    this.setIsLoading(true);
    this.clearAuthErrors();

    try {
      const authApiWithToken = new AuthApi(
        new ApiConfig({ basePath: MIXZI_API_BASE, accessToken: session.accessToken })
      );
      const { tenantId } = await authApiWithToken.authControllerCompleteRegistration({
        completeRegistrationDto: payload,
      });

      const result = await this.requestTokens("refresh_token", { refresh_token: session.refreshToken });
      if (!result.ok) throw new Error(result.message);

      const { data } = result;
      this.setSession(
        data.access_token,
        data.refresh_token,
        this.buildUser(
          data.access_token,
          data.user ?? { id: session.userId, email: session.email },
          {
            id: tenantId,
            name: payload.restaurantName,
            planId: payload.planId,
            planName: payload.planId === "plan_enterprise_pro" ? "Plan Pro Restauración" : "Plan Starter",
            status: "trial",
            address: payload.address,
            postalCode: payload.postalCode,
          }
        )
      );
      return true;
    } catch {
      this.setErrorMessage("No se pudo crear el restaurante. Inténtalo de nuevo.");
      return false;
    } finally {
      this.setIsLoading(false);
    }
  };

  private restoreSession() {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!stored) return;
      const { accessToken, refreshToken, user } = JSON.parse(stored);
      if (!accessToken || !user) return;
      this.accessToken = accessToken;
      this.refreshToken = refreshToken || null;
      this.currentUser = user;
      this.isAuthenticated = true;
    } catch {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  private requestTokens = async (
    grantType: "password" | "refresh_token",
    body: Record<string, string>
  ): Promise<TokenResult> => {
    try {
      const res = await fetch(`${MIXZI_AUTH_BASE}/auth/v1/token?grant_type=${grantType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: MIXZI_AUTH_ANON_KEY ?? "" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return {
          ok: false,
          status: res.status,
          message: String(data?.msg || data?.error_description || data?.message || ""),
        };
      }
      return { ok: true, data };
    } catch {
      return { ok: false, status: 0, message: "network_error" };
    }
  };

  // El rol y el tenant_id vienen en el JWT; nombre y plan del tenant no, por eso se conservan del estado previo.
  private buildUser(
    accessToken: string,
    supabaseUser?: SupabaseTokenResponse["user"],
    tenant?: UserProfile["tenant"],
    fallbackEmail = ""
  ): UserProfile {
    const claims = decodeJwtClaims(accessToken);
    const claimRole = claims.user_role ?? claims.app_metadata?.role;
    const role: UserRole = claimRole && claimRole in ROLE_PERMISSIONS ? (claimRole as UserRole) : "staff";
    const meta = supabaseUser?.user_metadata ?? {};
    const tenantId = claims.tenant_id ?? tenant?.id ?? "";
    const resolvedTenant =
      tenant && tenant.id === tenantId
        ? tenant
        : { id: tenantId, name: "", planId: "", planName: "", status: "active" as const };

    return {
      id: supabaseUser?.id ?? claims.sub ?? "",
      email: supabaseUser?.email ?? fallbackEmail,
      firstName: meta.firstName ?? meta.first_name ?? this.currentUser?.firstName ?? "",
      lastName: meta.lastName ?? meta.last_name ?? this.currentUser?.lastName ?? "",
      role,
      tenant: resolvedTenant,
      permissions: ROLE_PERMISSIONS[role],
    };
  }
}

export const authStore = new AuthStore();
