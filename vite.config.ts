import path from "path"
import dotenv from "dotenv"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  const env = {
    ...loadEnv(mode, import.meta.dirname, ""),
    ...dotenv.config({ path: path.resolve(import.meta.dirname, ".env.dev") }).parsed,
  }
  const clientEnv = Object.fromEntries(
    Object.entries(env)
      .filter(([key]) => key.startsWith("VITE_"))
      .map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value)]),
  )

  return {
    define: clientEnv,
    plugins: [react()],
    server: {
      port: 3001,
    },
    resolve: {
      alias: {
        "@/_generated": path.resolve(import.meta.dirname, "./apis"),
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
  }
})