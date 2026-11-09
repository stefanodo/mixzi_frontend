import { action, makeObservable, observable } from "mobx";
import { AuthApi } from "@/_generated/apis/AuthApi";
import { Configuration as ApiConfig, ResponseError } from "@/_generated/runtime";
import { MIXZI_API_BASE, MIXZI_AUTH_BASE, MIXZI_AUTH_ANON_KEY } from "@/config/envVariables";

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "owner" | "admin" | "head_chef" | "staff" | null;
  tenant: { id: string; name?: string; planName?: string | null; address?: string | null; postalCode?: string | null } | null;
}

interface TokenClaims {
  sub: string;
  email?: string;
  exp: number;
  tenant_id?: string | null;
  user_metadata?: { first_name?: string; last_name?: string };
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  EMAIL_ALREADY_REGISTERED: "Ya existe una cuenta con este correo. Inicia sesión para continuar.",
  TERMS_NOT_ACCEPTED: "Los términos no se han aceptado o su versión ha cambiado. Recarga la página y vuelve a aceptarlos.",
  PLAN_NOT_FOUND: "El plan indicado no existe. Solicita a Mixzi un identificador de plan válido.",
  TENANT_ALREADY_ASSIGNED: "Esta cuenta ya tiene un restaurante. Inicia sesión de nuevo.",
  RATE_LIMITED: "Demasiados intentos. Espera unos minutos antes de volver a intentarlo.",
  UNAUTHENTICATED: "La sesión ha caducado. Inicia sesión de nuevo.",
};

async function responseDetails(error: unknown): Promise<{ response: Response | null; body: Record<string, unknown> | null }> {
  const response = error instanceof ResponseError ? error.response : error instanceof Response ? error : null;
  if (!response) return { response: null, body: null };
  try {
    const body: unknown = await response.clone().json();
    return { response, body: body && typeof body === "object" ? body as Record<string, unknown> : null };
  } catch {
    return { response, body: null };
  }
}

function readClaims(token: string): TokenClaims {
  const payload = token.split(".")[1];
  if (!payload) throw new Error("La sesión recibida no es válida.");
  const bytes = Uint8Array.from(atob(payload.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
  const claims: unknown = JSON.parse(new TextDecoder().decode(bytes));
  if (!claims || typeof claims !== "object" || !("sub" in claims) || typeof claims.sub !== "string" ||
      !("exp" in claims) || typeof claims.exp !== "number") {
    throw new Error("La sesión recibida no es válida.");
  }
  return claims as TokenClaims;
}

async function errorMessage(error: unknown, fallback: string): Promise<string> {
  const { response, body } = await responseDetails(error);
  if (response) {
    const code = typeof body?.code === "string" ? body.code : "";
    if (AUTH_ERROR_MESSAGES[code]) return AUTH_ERROR_MESSAGES[code];
    if (response.status === 429) return AUTH_ERROR_MESSAGES.RATE_LIMITED;
    if (response.status === 400 && code === "VALIDATION_ERROR") {
      return "Comprueba los datos introducidos y vuelve a intentarlo.";
    }
    return `${fallback} (HTTP ${response.status}).`;
  }
  if (error instanceof TypeError) return "No se pudo conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.";
  return error instanceof Error ? error.message : fallback;
}

export default class AuthStore {
  isLoading = false;
  errorMessage: string | null = null;
  isAuthenticated = false;
  accessToken: string | null = null;
  refreshToken: string | null = null;
  currentUser: UserProfile | null = null;
  profileError: string | null = null;
  profileLoaded = false;
  isAccountLocked = false;
  lockedEmail = "";
  otpSentMessage: string | null = null;
  private refreshPromise: Promise<string> | null = null;
  private sessionVersion = 0;
  private authApi = new AuthApi(new ApiConfig({ basePath: MIXZI_API_BASE }));

  constructor() {
    makeObservable(this, {
      isLoading: observable, errorMessage: observable, isAuthenticated: observable,
      accessToken: observable, currentUser: observable, profileError: observable, profileLoaded: observable, isAccountLocked: observable,
      lockedEmail: observable, otpSentMessage: observable,
      setIsLoading: action, setErrorMessage: action, setSession: action,
      logout: action, setAccountLocked: action, setOtpSentMessage: action, clearAuthErrors: action,
      setProfile: action, setProfileError: action, setProfileLoaded: action,
    });
    this.restoreSession();
    if (this.isAuthenticated) void this.loadProfile();
  }

  setIsLoading = (value: boolean) => { this.isLoading = value; };
  setErrorMessage = (message: string | null) => { this.errorMessage = message; };
  setAccountLocked = (locked: boolean, email = "") => { this.isAccountLocked = locked; this.lockedEmail = email; };
  setOtpSentMessage = (message: string | null) => { this.otpSentMessage = message; };
  setProfile = (user: UserProfile) => { this.currentUser = user; this.profileError = null; this.profileLoaded = true; };
  setProfileError = (message: string | null) => { this.profileError = message; };
  setProfileLoaded = (value: boolean) => { this.profileLoaded = value; };
  clearAuthErrors = () => { this.errorMessage = null; this.otpSentMessage = null; };

  private restoreSession() {
    const stored = localStorage.getItem("mixzi_auth_session");
    if (!stored) return;
    try {
      const session: unknown = JSON.parse(stored);
      if (!session || typeof session !== "object" || !("accessToken" in session) ||
          typeof session.accessToken !== "string" || !("refreshToken" in session) ||
          typeof session.refreshToken !== "string" || !session.refreshToken) {
        throw new Error("Sesión almacenada inválida.");
      }
      this.setSession(session.accessToken, session.refreshToken);
    } catch (error) {
      console.warn("No se pudo restaurar la sesión.", error);
      this.logout();
    }
  }

  setSession = (accessToken: string, refreshToken: string) => {
    const claims = readClaims(accessToken);
    if (!refreshToken) throw new Error("La sesión no incluye un token de renovación.");
    const previousUser = this.currentUser;
    const tenantId = typeof claims.tenant_id === "string" && claims.tenant_id ? claims.tenant_id : null;
    const sameProfile = previousUser?.id === claims.sub && (previousUser.tenant?.id ?? null) === tenantId;
    localStorage.setItem("mixzi_auth_session", JSON.stringify({ accessToken, refreshToken }));
    this.sessionVersion += 1;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.currentUser = {
      id: claims.sub,
      email: typeof claims.email === "string" ? claims.email : "",
      firstName: typeof claims.user_metadata?.first_name === "string" ? claims.user_metadata.first_name : "",
      lastName: typeof claims.user_metadata?.last_name === "string" ? claims.user_metadata.last_name : "",
      role: previousUser?.id === claims.sub && previousUser.tenant?.id === tenantId ? previousUser.role : null,
      tenant: tenantId
        ? previousUser?.id === claims.sub && previousUser.tenant?.id === tenantId ? previousUser.tenant : { id: tenantId }
        : null,
    };
    this.isAuthenticated = true;
    this.profileLoaded = sameProfile && this.profileLoaded;
    this.isAccountLocked = false;
    this.errorMessage = null;
    this.profileError = null;
  };

  logout = () => {
    this.sessionVersion += 1;
    this.refreshPromise = null;
    this.accessToken = null;
    this.refreshToken = null;
    this.currentUser = null;
    this.profileError = null;
    this.profileLoaded = false;
    this.isAuthenticated = false;
    this.isAccountLocked = false;
    this.lockedEmail = "";
    this.otpSentMessage = null;
    localStorage.removeItem("mixzi_auth_session");
  };

  private async authGrant(grant: "password" | "refresh_token", body: object): Promise<AuthTokens> {
    if (!MIXZI_AUTH_BASE || !MIXZI_AUTH_ANON_KEY) {
      throw new Error("Falta configurar la URL o la clave pública de Supabase Auth.");
    }
    const response = await fetch(`${MIXZI_AUTH_BASE.replace(/\/$/, "")}/auth/v1/token?grant_type=${grant}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: MIXZI_AUTH_ANON_KEY },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw response;
    const data: unknown = await response.json();
    if (!data || typeof data !== "object" || !("access_token" in data) ||
        typeof data.access_token !== "string" || !("refresh_token" in data) ||
        typeof data.refresh_token !== "string") {
      throw new Error("Supabase Auth ha devuelto una sesión incompleta.");
    }
    return { accessToken: data.access_token, refreshToken: data.refresh_token };
  }

  refreshSession = async (): Promise<string> => {
    if (!this.refreshPromise) {
      const refreshToken = this.refreshToken;
      const version = this.sessionVersion;
      if (!refreshToken) throw new Error("Inicia sesión para continuar.");
      const promise = (async () => {
        try {
          const tokens = await this.authGrant("refresh_token", { refresh_token: refreshToken });
          if (version !== this.sessionVersion) throw new Error("La sesión ha cambiado durante la renovación.");
          this.setSession(tokens.accessToken, tokens.refreshToken);
          return tokens.accessToken;
        } catch (error) {
          if (version === this.sessionVersion && error instanceof Response &&
              [400, 401, 403].includes(error.status)) {
            this.logout();
            this.setErrorMessage("La sesión ha caducado. Inicia sesión de nuevo.");
          }
          throw error;
        }
      })();
      this.refreshPromise = promise;
      const clearPromise = () => {
        if (this.refreshPromise === promise) this.refreshPromise = null;
      };
      void promise.then(clearPromise, clearPromise);
    }
    return this.refreshPromise;
  };

  getValidAccessToken = async (): Promise<string> => {
    if (!this.accessToken) throw new Error("Inicia sesión para continuar.");
    if (readClaims(this.accessToken).exp <= Date.now() / 1000 + 60) {
      const version = this.sessionVersion;
      try {
        return await this.refreshSession();
      } catch (error) {
        if (this.isAuthenticated && this.sessionVersion === version) {
          this.setErrorMessage(await errorMessage(error, "No se pudo renovar la sesión"));
        }
        throw error;
      }
    }
    return this.accessToken;
  };

  loadProfile = async (): Promise<void> => {
    const version = this.sessionVersion;
    let token: string | null = null;
    try {
      token = await this.getValidAccessToken();
      const response = await fetch(`${MIXZI_API_BASE.replace(/\/$/, "")}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw response;
      const data: unknown = await response.json();
      if (!data || typeof data !== "object" || !("user" in data) || !data.user ||
          typeof data.user !== "object" || !("id" in data.user) || typeof data.user.id !== "string" ||
          !("tenant" in data)) throw new Error("El perfil recibido no es válido.");
      const source = data.user;
      const role = "role" in source && (source.role === "owner" || source.role === "admin" ||
        source.role === "head_chef" || source.role === "staff") ? source.role : null;
      const tenant = data.tenant;
      if (tenant !== null && (typeof tenant !== "object" || !("id" in tenant) || typeof tenant.id !== "string")) {
        throw new Error("El restaurante recibido no es válido.");
      }
      if (this.accessToken !== token || !this.currentUser) return;
      if (source.id !== this.currentUser.id) throw new Error("El perfil recibido no corresponde a la sesión actual.");
      this.setProfile({
        id: source.id,
        email: "email" in source && typeof source.email === "string" ? source.email : this.currentUser.email,
        firstName: "firstName" in source && typeof source.firstName === "string" ? source.firstName : this.currentUser.firstName,
        lastName: "lastName" in source && typeof source.lastName === "string" ? source.lastName : this.currentUser.lastName,
        role,
        tenant: tenant && typeof tenant === "object" && "id" in tenant && typeof tenant.id === "string" ? {
          id: tenant.id,
          name: "name" in tenant && typeof tenant.name === "string" ? tenant.name : undefined,
          planName: "planName" in tenant && typeof tenant.planName === "string" ? tenant.planName : null,
          address: "address" in tenant && typeof tenant.address === "string" ? tenant.address : null,
          postalCode: "postalCode" in tenant && typeof tenant.postalCode === "string" ? tenant.postalCode : null,
        } : null,
      });
    } catch (error) {
      if (this.isAuthenticated && (token ? this.accessToken === token : this.sessionVersion === version)) {
        this.setProfileError(await errorMessage(error, "No se pudo cargar el perfil"));
      }
    }
  };

  login = async (email: string, password: string): Promise<boolean> => {
    this.setIsLoading(true);
    this.clearAuthErrors();
    const version = this.sessionVersion;
    try {
      const tokens = await this.authGrant("password", { email: email.trim(), password });
      if (version !== this.sessionVersion) return false;
      this.setSession(tokens.accessToken, tokens.refreshToken);
      await this.loadProfile();
      if (this.accessToken !== tokens.accessToken) return false;
      if (!this.currentUser?.tenant && this.profileError) {
        this.logout();
        this.setErrorMessage("No se pudo comprobar el restaurante de tu cuenta. Comprueba tu conexión y vuelve a iniciar sesión.");
        return false;
      }
      return true;
    } catch (error) {
      if (version !== this.sessionVersion) return false;
      const { body } = await responseDetails(error);
      if ([body?.code, body?.error, body?.error_description, body?.message].some(
        value => typeof value === "string" && value.includes("ACCOUNT_LOCKED_VERIFY_EMAIL")
      )) {
        this.setAccountLocked(true, email.trim());
        this.setErrorMessage("Tu cuenta está bloqueada. Solicita un código para verificar tu correo.");
      } else {
        this.setErrorMessage(await errorMessage(error, "Correo o contraseña incorrectos, o no se pudo iniciar sesión"));
      }
      return false;
    } finally { this.setIsLoading(false); }
  };

  requestUnlockCode = async (email: string): Promise<boolean> => {
    this.setIsLoading(true);
    this.clearAuthErrors();
    const version = this.sessionVersion;
    try {
      email = email.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Introduce un correo electrónico válido para solicitar el código.");
      }
      await this.authApi.authControllerVerifyLoginCode({ verifyLoginCodeDto: { email } });
      if (version !== this.sessionVersion) return false;
      this.setAccountLocked(true, email);
      this.setOtpSentMessage(`Si la cuenta cumple los requisitos, recibirás un código en ${email}.`);
      return true;
    } catch (error) {
      if (version !== this.sessionVersion) return false;
      this.setErrorMessage(await errorMessage(error, "No se pudo solicitar el código"));
      return false;
    } finally { this.setIsLoading(false); }
  };

  confirmUnlockCode = async (email: string, code: string): Promise<boolean> => {
    this.setIsLoading(true);
    this.clearAuthErrors();
    const version = this.sessionVersion;
    try {
      const response = await this.authApi.authControllerConfirmLoginCode({ confirmLoginCodeDto: { email, code } });
      if (version !== this.sessionVersion) return false;
      this.setSession(response.accessToken, response.refreshToken);
      await this.loadProfile();
      if (this.accessToken !== response.accessToken) return false;
      if (!this.currentUser?.tenant && this.profileError) {
        this.logout();
        this.setErrorMessage("No se pudo comprobar el restaurante de tu cuenta. Comprueba tu conexión y vuelve a iniciar sesión.");
        return false;
      }
      return true;
    } catch (error) {
      if (version !== this.sessionVersion) return false;
      this.setErrorMessage(await errorMessage(error, "Código incorrecto o caducado. Solicita otro y vuelve a intentarlo"));
      return false;
    } finally { this.setIsLoading(false); }
  };

  registerStep1 = async (payload: {
    firstName: string; lastName: string; email: string; password: string;
    termsAccepted: boolean; termsVersion: string;
  }): Promise<{ success: boolean; token?: string }> => {
    this.setIsLoading(true);
    this.clearAuthErrors();
    const version = this.sessionVersion;
    try {
      const response = await this.authApi.authControllerRegister({ registerDto: payload });
      if (version !== this.sessionVersion) return { success: false };
      this.setSession(response.accessToken, response.refreshToken);
      this.setProfileLoaded(true);
      return { success: true, token: response.accessToken };
    } catch (error) {
      if (version !== this.sessionVersion) return { success: false };
      this.setErrorMessage(await errorMessage(error, "No se pudo registrar la cuenta"));
      return { success: false };
    } finally { this.setIsLoading(false); }
  };

  completeRegistrationStep2 = async (payload: {
    restaurantName: string; address?: string; postalCode?: string; planId: string;
  }): Promise<boolean> => {
    this.setIsLoading(true);
    this.clearAuthErrors();
    let completed = false;
    let version = this.sessionVersion;
    try {
      const token = await this.getValidAccessToken();
      if (this.accessToken !== token) return false;
      version = this.sessionVersion;
      const api = new AuthApi(new ApiConfig({ basePath: MIXZI_API_BASE, accessToken: token }));
      const response = await api.authControllerCompleteRegistration({ completeRegistrationDto: payload });
      if (this.sessionVersion !== version) return false;
      completed = true;
      if (response.requiresNewToken) {
        await this.refreshSession();
        version = this.sessionVersion;
      }
      if (this.currentUser?.tenant?.id !== response.tenantId) {
        throw new Error("El nuevo token no contiene el tenant creado.");
      }
      await this.loadProfile();
      return this.sessionVersion === version;
    } catch (error) {
      if (this.sessionVersion !== version &&
          !(completed && !this.isAuthenticated && error instanceof Response && [400, 401, 403].includes(error.status))) {
        return false;
      }
      const message = await errorMessage(error, "No se pudo completar el registro");
      this.setErrorMessage(completed ? `El restaurante se creó, pero no se pudo actualizar la sesión. Inicia sesión de nuevo. ${message}` : message);
      if (completed) this.logout();
      return false;
    } finally { this.setIsLoading(false); }
  };
}

export const authStore = new AuthStore();
