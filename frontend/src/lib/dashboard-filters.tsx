import { createContext, useContext, useState, type ReactNode } from "react"

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

export function DashboardFiltersProvider({
  children,
}: {
  children: ReactNode
}) {
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [location, setLocationState] =
    useState<LocationSelection>(DEFAULT_LOCATION)
  const [hasPickedLocation, setHasPickedLocation] = useState(false)

  const setLocation = (nextLocation: LocationSelection) => {
    setLocationState(nextLocation)
    setHasPickedLocation(true)
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
