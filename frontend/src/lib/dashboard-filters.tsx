import { createContext, type ReactNode, useContext, useState } from "react"

export const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
]

type DashboardFiltersContextValue = {
  month: number
  setMonth: (month: number) => void
  location: LocationSelection
  setLocation: (location: LocationSelection) => void
  hasPickedLocation: boolean
}

export type LocationSelection = {
  lat: number
  lon: number
  label?: string
}

export const DEFAULT_LOCATION: LocationSelection = {
  lat: -7.98,
  lon: 112.62,
  label: "Malang, Jawa Timur",
}

const DashboardFiltersContext =
  createContext<DashboardFiltersContextValue | null>(null)

const MONTH_STORAGE_KEY = "tanilink:dashboard-month"
const LOCATION_STORAGE_KEY = "tanilink:dashboard-location"
const ONBOARDING_STORAGE_KEY = "tanilink:onboarding-complete"

function readStoredMonth() {
  if (typeof window === "undefined") return new Date().getMonth() + 1
  const raw = window.localStorage.getItem(MONTH_STORAGE_KEY)
  const parsed = raw ? Number(raw) : Number.NaN
  if (Number.isInteger(parsed) && parsed >= 1 && parsed <= 12) {
    return parsed
  }
  return new Date().getMonth() + 1
}

function readStoredLocation() {
  if (typeof window === "undefined") return DEFAULT_LOCATION
  const raw = window.localStorage.getItem(LOCATION_STORAGE_KEY)
  if (!raw) return DEFAULT_LOCATION
  try {
    const parsed = JSON.parse(raw) as LocationSelection
    if (
      typeof parsed.lat === "number" &&
      typeof parsed.lon === "number" &&
      Number.isFinite(parsed.lat) &&
      Number.isFinite(parsed.lon)
    ) {
      return parsed
    }
  } catch {
    return DEFAULT_LOCATION
  }
  return DEFAULT_LOCATION
}

function readStoredHasPickedLocation() {
  if (typeof window === "undefined") return false
  return window.localStorage.getItem(LOCATION_STORAGE_KEY) !== null
}

export function isOnboardingComplete() {
  if (typeof window === "undefined") return false
  return window.sessionStorage.getItem(ONBOARDING_STORAGE_KEY) === "true"
}

export function markOnboardingComplete() {
  if (typeof window === "undefined") return
  window.sessionStorage.setItem(ONBOARDING_STORAGE_KEY, "true")
}

export function resetOnboardingComplete() {
  if (typeof window === "undefined") return
  window.sessionStorage.removeItem(ONBOARDING_STORAGE_KEY)
}

export function DashboardFiltersProvider({
  children,
}: {
  children: ReactNode
}) {
  const [month, setMonthState] = useState(readStoredMonth)
  const [location, setLocationState] =
    useState<LocationSelection>(readStoredLocation)
  const [hasPickedLocation, setHasPickedLocation] = useState(
    readStoredHasPickedLocation,
  )

  const setMonth = (nextMonth: number) => {
    setMonthState(nextMonth)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(MONTH_STORAGE_KEY, String(nextMonth))
    }
  }

  const setLocation = (nextLocation: LocationSelection) => {
    setLocationState(nextLocation)
    setHasPickedLocation(true)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        LOCATION_STORAGE_KEY,
        JSON.stringify(nextLocation),
      )
    }
  }

  return (
    <DashboardFiltersContext.Provider
      value={{ month, setMonth, location, setLocation, hasPickedLocation }}
    >
      {children}
    </DashboardFiltersContext.Provider>
  )
}

export function useDashboardFilters() {
  const context = useContext(DashboardFiltersContext)
  if (!context) {
    throw new Error(
      "useDashboardFilters must be used inside DashboardFiltersProvider",
    )
  }
  return context
}
