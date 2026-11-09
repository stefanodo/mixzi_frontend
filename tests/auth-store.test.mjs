import { after, before, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";

const storage = new Map();
globalThis.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: (key) => storage.delete(key),
};

const originalFetch = globalThis.fetch;
let vite;
let AuthStore;

const token = (overrides = {}) => {
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ alg: "none" })}.${encode({
    sub: "user-1",
    email: "user@example.test",
    exp: Math.floor(Date.now() / 1000) + 3600,
    user_metadata: { first_name: "Ana", last_name: "Test" },
    ...overrides,
  })}.signature`;
};
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json" },
});
const profile = (tenantId = null) => ({
  user: { id: "user-1", email: "user@example.test", firstName: "Ana", lastName: "Test", role: tenantId ? "owner" : null },
  tenant: tenantId ? { id: tenantId, name: "Restaurante", planName: "Piloto" } : null,
});
const urlPath = (url) => new URL(String(url), "http://localhost").pathname;

before(async () => {
  vite = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  ({ default: AuthStore } = await vite.ssrLoadModule("/src/stores/AuthStore.ts"));
});

beforeEach(() => {
  storage.clear();
  globalThis.fetch = () => { throw new Error("Unexpected network request"); };
});

after(async () => {
  globalThis.fetch = originalFetch;
  await vite.close();
});

test("login loads the real profile and logout removes the stored session", async () => {
  const store = new AuthStore();
  globalThis.fetch = async (url) => urlPath(url).endsWith("/auth/me")
    ? json(profile("tenant-1"))
    : json({ access_token: token({ tenant_id: "tenant-1" }), refresh_token: "refresh" });
  assert.equal(await store.login(" user@example.test ", "password"), true);
  assert.equal(store.currentUser.tenant.name, "Restaurante");
  assert.equal(store.currentUser.role, "owner");
  assert.ok(storage.has("mixzi_auth_session"));
  store.logout();
  assert.equal(store.isAuthenticated, false);
  assert.equal(storage.has("mixzi_auth_session"), false);
});

test("invalid login does not authenticate and locked login offers verification", async () => {
  const store = new AuthStore();
  globalThis.fetch = async () => json({ error_description: "Invalid login credentials" }, 400);
  assert.equal(await store.login("user@example.test", "wrong"), false);
  assert.equal(store.isAuthenticated, false);
  assert.match(store.errorMessage, /contraseña/i);
  globalThis.fetch = async () => json({ error_description: "ACCOUNT_LOCKED_VERIFY_EMAIL" }, 400);
  assert.equal(await store.login("user@example.test", "wrong"), false);
  assert.equal(store.isAccountLocked, true);
  assert.equal(store.lockedEmail, "user@example.test");
  assert.match(store.errorMessage, /bloqueada/i);
});

test("unlock code requests validate email and report API failures", async () => {
  const store = new AuthStore();
  assert.equal(await store.requestUnlockCode(""), false);
  assert.match(store.errorMessage, /correo electrónico válido/i);
  globalThis.fetch = async () => json({ code: "RATE_LIMITED" }, 429);
  assert.equal(await store.requestUnlockCode("user@example.test"), false);
  assert.match(store.errorMessage, /demasiados intentos/i);
  globalThis.fetch = async () => new Response(null, { status: 200 });
  assert.equal(await store.requestUnlockCode("user@example.test"), true);
  assert.match(store.otpSentMessage, /si la cuenta/i);
  globalThis.fetch = async () => json({ code: "INVALID_CODE" }, 400);
  assert.equal(await store.confirmUnlockCode("user@example.test", "000000"), false);
  assert.match(store.errorMessage, /incorrecto o caducado/i);
});

test("a correct unlock code creates a session", async () => {
  const store = new AuthStore();
  globalThis.fetch = async (url) => urlPath(url).endsWith("/auth/me")
    ? json(profile("tenant-1"))
    : json({ accessToken: token({ tenant_id: "tenant-1" }), refreshToken: "refresh" });
  assert.equal(await store.confirmUnlockCode("user@example.test", "123456"), true);
  assert.equal(store.isAuthenticated, true);
  assert.equal(store.currentUser.tenant.id, "tenant-1");
});

test("registration failures remain failures and translate backend codes", async () => {
  const store = new AuthStore();
  const payload = { firstName: "Ana", lastName: "Test", email: "user@example.test", password: "password", termsAccepted: true, termsVersion: "v1" };
  globalThis.fetch = async () => json({ code: "EMAIL_ALREADY_REGISTERED" }, 409);
  assert.equal((await store.registerStep1(payload)).success, false);
  assert.match(store.errorMessage, /ya existe/i);
  globalThis.fetch = async () => json({ code: "TERMS_NOT_ACCEPTED" }, 400);
  assert.equal((await store.registerStep1(payload)).success, false);
  assert.match(store.errorMessage, /términos/i);
  assert.equal(store.isAuthenticated, false);
});

test("successful account registration starts the restaurant step", async () => {
  const store = new AuthStore();
  globalThis.fetch = async () => json({ accessToken: token(), refreshToken: "refresh" }, 201);
  const result = await store.registerStep1({ firstName: "Ana", lastName: "Test", email: "user@example.test", password: "password", termsAccepted: true, termsVersion: "v1" });
  assert.equal(result.success, true);
  assert.equal(store.profileLoaded, true);
  assert.equal(store.currentUser.tenant, null);
});

test("restaurant registration rejects missing plans and refreshes the tenant on success", async () => {
  const store = new AuthStore();
  store.setSession(token(), "refresh");
  const payload = { restaurantName: "Restaurante", planId: "plan-1" };
  globalThis.fetch = async () => json({ code: "PLAN_NOT_FOUND" }, 404);
  assert.equal(await store.completeRegistrationStep2(payload), false);
  assert.match(store.errorMessage, /plan indicado no existe/i);
  assert.equal(store.currentUser.tenant, null);
  const calls = [];
  globalThis.fetch = async (url, init) => {
    const path = urlPath(url);
    calls.push(path);
    if (path.endsWith("/auth/complete-registration")) {
      assert.equal(init.headers.Authorization, `Bearer ${store.accessToken}`);
      return json({ tenantId: "tenant-1", requiresNewToken: true }, 201);
    }
    if (path.endsWith("/auth/v1/token")) return json({ access_token: token({ tenant_id: "tenant-1" }), refresh_token: "new-refresh" });
    if (path.endsWith("/auth/me")) return json(profile("tenant-1"));
    throw new Error(`Unexpected request: ${path}`);
  };
  assert.equal(await store.completeRegistrationStep2(payload), true);
  assert.deepEqual(calls.map((path) => path.split("/").at(-1)), ["complete-registration", "token", "me"]);
  assert.equal(store.currentUser.tenant.name, "Restaurante");
  assert.equal(store.refreshToken, "new-refresh");
});

test("a rejected refresh signs out, while a network error preserves a retryable session", async () => {
  const store = new AuthStore();
  store.setSession(token({ exp: 1 }), "refresh");
  globalThis.fetch = async () => { throw new TypeError("Network unavailable"); };
  await assert.rejects(store.getValidAccessToken());
  assert.equal(store.isAuthenticated, true);
  assert.match(store.errorMessage, /conectar/i);
  globalThis.fetch = async () => json({ error: "refresh_token_not_found" }, 400);
  await assert.rejects(store.getValidAccessToken());
  assert.equal(store.isAuthenticated, false);
  assert.equal(storage.has("mixzi_auth_session"), false);
  assert.match(store.errorMessage, /sesión ha caducado/i);
});

test("a failed profile lookup cannot be mistaken for an unfinished registration", async () => {
  const store = new AuthStore();
  globalThis.fetch = async (url) => urlPath(url).endsWith("/auth/me")
    ? json({ code: "INTERNAL_ERROR" }, 500)
    : json({ access_token: token(), refresh_token: "refresh" });
  assert.equal(await store.login("user@example.test", "password"), false);
  assert.match(store.errorMessage, /comprobar el restaurante/i);
  assert.equal(store.isAuthenticated, false);
  globalThis.fetch = async (url) => urlPath(url).endsWith("/auth/me")
    ? json({ code: "INTERNAL_ERROR" }, 500)
    : json({ accessToken: token(), refreshToken: "refresh" });
  assert.equal(await store.confirmUnlockCode("user@example.test", "123456"), false);
  assert.equal(store.isAuthenticated, false);
});

test("created restaurant followed by a failed refresh reports the partial success", async () => {
  const store = new AuthStore();
  store.setSession(token(), "refresh");
  globalThis.fetch = async (url) => urlPath(url).endsWith("/auth/complete-registration")
    ? json({ tenantId: "tenant-1", requiresNewToken: true }, 201)
    : json({ error: "invalid_refresh_token" }, 400);
  assert.equal(await store.completeRegistrationStep2({ restaurantName: "Restaurante", planId: "plan-1" }), false);
  assert.equal(store.isAuthenticated, false);
  assert.match(store.errorMessage, /restaurante se creó.*inicia sesión de nuevo/i);
});

test("late registration and unlock responses cannot restore a session after logout", async () => {
  for (const operation of ["register", "unlock"]) {
    const store = new AuthStore();
    let resolve;
    let started;
    const requestStarted = new Promise((done) => { started = done; });
    globalThis.fetch = () => new Promise((done) => { resolve = done; started(); });
    const pending = operation === "register"
      ? store.registerStep1({ firstName: "Ana", lastName: "Test", email: "user@example.test", password: "password", termsAccepted: true, termsVersion: "v1" })
      : store.confirmUnlockCode("user@example.test", "123456");
    await requestStarted;
    store.logout();
    resolve(json({ accessToken: token(), refreshToken: "refresh" }));
    const result = await pending;
    assert.equal(operation === "register" ? result.success : result, false);
    assert.equal(store.isAuthenticated, false);
  }
});

test("concurrent token renewals share one request", async () => {
  const store = new AuthStore();
  store.setSession(token({ exp: 1 }), "refresh");
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return json({ access_token: token(), refresh_token: "new-refresh" });
  };
  const tokens = await Promise.all([store.getValidAccessToken(), store.getValidAccessToken()]);
  assert.equal(calls, 1);
  assert.equal(tokens[0], tokens[1]);
});

test("late refresh failure cannot sign out a newer session", async () => {
  const store = new AuthStore();
  store.setSession(token({ exp: 1 }), "old-refresh");
  let resolve;
  globalThis.fetch = () => new Promise((done) => { resolve = done; });
  const pending = store.getValidAccessToken();
  store.setSession(token({ sub: "other-user" }), "new-refresh");
  resolve(json({ error: "invalid_refresh_token" }, 400));
  await assert.rejects(pending);
  assert.equal(store.isAuthenticated, true);
  assert.equal(store.currentUser.id, "other-user");
});
