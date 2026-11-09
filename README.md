# React + TypeScript + Vite

## Autenticación

Configura `VITE_MIXZI_API_BASE` con la URL raíz de la API NestJS,
`VITE_MIXZI_AUTH_BASE` con la URL raíz de Supabase Auth/Kong y
`VITE_MIXZI_AUTH_ANON_KEY` con la clave **anon pública** del mismo proyecto.
Por ejemplo, la API de desarrollo utiliza `https://mixzi-api-dev.granile.dev`.
Usa `.env.dev` para desarrollo local o las variables de compilación de Docker;
las variables `VITE_*` se incluyen en el navegador, así que nunca pongas una
clave `service_role` ni otros secretos en ellas.

El acceso se realiza contra Supabase Auth; el registro y `/auth/me` usan la API.
La sesión se guarda en `localStorage` y se renueva antes de que expire. Tras
crear el restaurante se solicita un token nuevo para obtener `tenant_id`.
El rol, nombre y plan del restaurante proceden de `/auth/me`, no del JWT.
La API todavía no ofrece un catálogo de planes: para completar el registro
hay que obtener del backend el UUID de un plan existente.
El registro envía la versión `v1` de los términos, pero el texto o enlace
oficial aún debe facilitarlo Mixzi antes de recoger consentimiento válido.
El cierre de sesión elimina la sesión local; no revoca los tokens en Supabase.

Las pruebas aisladas de autenticación se ejecutan con `npm run test:auth`.
Simulan las respuestas de los servicios y no crean cuentas ni restaurantes reales.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
