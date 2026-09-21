import { createContext, useContext, useEffect, useMemo, useState } from "react"

type Theme = "standard" | "dark"

interface ThemeContextValue {
    theme: Theme
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const getInitialTheme = (): Theme => {
    if (typeof window === "undefined") {
        return "standard"
    }

    const savedTheme = window.localStorage.getItem("mixzi-theme")

    if (savedTheme === "dark" || savedTheme === "standard") {
        return savedTheme
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "standard"
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(getInitialTheme)

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark")
        document.documentElement.dataset.theme = theme
        document.body.dataset.theme = theme
        window.localStorage.setItem("mixzi-theme", theme)
    }, [theme])

    const value = useMemo(
        () => ({
            theme,
            toggleTheme: () => setTheme((currentTheme) => currentTheme === "dark" ? "standard" : "dark"),
        }),
        [theme],
    )

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
    const context = useContext(ThemeContext)

    if (!context) {
        throw new Error("useTheme must be used inside ThemeProvider")
    }

    return context
}
