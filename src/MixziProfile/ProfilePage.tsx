import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { Building2, LogOut, Shield, User } from "lucide-react";
import { authStore } from "@/stores/AuthStore";
import { RoutePaths } from "@/router/routes";

export const ProfilePage = observer(() => {
  const navigate = useNavigate();
  const user = authStore.currentUser;

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-4 p-6">
        <h1 className="text-2xl font-bold">Perfil</h1>
        <p>Inicia sesión para consultar tu perfil.</p>
        {authStore.errorMessage && <p role="alert" className="text-destructive">{authStore.errorMessage}</p>}
        <button className="min-h-12 rounded-xl bg-primary px-4 text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" onClick={() => navigate(RoutePaths.MixziLogin)}>
          Iniciar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-6">
      <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold"><User aria-hidden="true" /> Perfil</h1>
        <dl className="space-y-3">
          <div><dt className="font-semibold">Nombre</dt><dd>{[user.firstName, user.lastName].filter(Boolean).join(" ") || "No disponible"}</dd></div>
          <div><dt className="font-semibold">Correo electrónico</dt><dd className="break-all">{user.email || "No disponible"}</dd></div>
          <div><dt className="font-semibold">Identificador de usuario</dt><dd className="break-all">{user.id}</dd></div>
        </dl>
      </section>
      <section className="space-y-3 rounded-2xl border border-border bg-card p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold"><Building2 aria-hidden="true" /> Restaurante</h2>
        <p className="break-all">{user.tenant ? `ID: ${user.tenant.id}` : authStore.profileLoaded ? "Registro del restaurante pendiente." : "No se ha podido comprobar el restaurante."}</p>
        {user.tenant && <dl className="space-y-2">
          <div><dt className="font-semibold">Nombre</dt><dd>{user.tenant.name || "No disponible"}</dd></div>
          <div><dt className="font-semibold">Plan</dt><dd>{user.tenant.planName || "No disponible"}</dd></div>
          <div><dt className="font-semibold">Dirección</dt><dd>{user.tenant.address || "No disponible"}</dd></div>
          <div><dt className="font-semibold">Código postal</dt><dd>{user.tenant.postalCode || "No disponible"}</dd></div>
        </dl>}
        {!user.tenant && authStore.profileLoaded && <button className="min-h-12 rounded-xl bg-primary px-4 text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" onClick={() => navigate(RoutePaths.MixziLogin)}>Completar registro</button>}
      </section>
      <section className="space-y-3 rounded-2xl border border-border bg-card p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold"><Shield aria-hidden="true" /> Rol y permisos</h2>
        <p>Rol: {user.role || "No disponible"}</p>
        <p>La API comprueba los permisos de cada operación.</p>
      </section>
      {authStore.profileError && <p role="alert" className="text-destructive">No se pudo cargar el perfil completo: {authStore.profileError}</p>}
      <button
        className="flex min-h-12 items-center gap-2 rounded-xl border border-destructive px-4 text-destructive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive"
        onClick={() => { authStore.logout(); navigate(RoutePaths.MixziLogin); }}
      >
        <LogOut aria-hidden="true" /> Cerrar sesión
      </button>
    </div>
  );
});

export default ProfilePage;
