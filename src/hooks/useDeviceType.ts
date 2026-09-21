import { useEffect, useState } from "react"

export type DeviceType = "mobile" | "tablet" | "desktop"

const getDeviceType = (): DeviceType => {
    if (typeof window === "undefined") {
        return "desktop"
    }

    if (window.matchMedia("(max-width: 639px)").matches) {
        return "mobile"
    }

    if (window.matchMedia("(max-width: 1023px)").matches) {
        return "tablet"
    }

    return "desktop"
}

export const useDeviceType = () => {
    const [deviceType, setDeviceType] = useState<DeviceType>(getDeviceType)

    useEffect(() => {
        const updateDeviceType = () => setDeviceType(getDeviceType())
        const mediaQueries = [
            window.matchMedia("(max-width: 639px)"),
            window.matchMedia("(max-width: 1023px)"),
        ]

        mediaQueries.forEach((mediaQuery) => mediaQuery.addEventListener("change", updateDeviceType))
        updateDeviceType()

        return () => {
            mediaQueries.forEach((mediaQuery) => mediaQuery.removeEventListener("change", updateDeviceType))
        }
    }, [])

    return deviceType
}
