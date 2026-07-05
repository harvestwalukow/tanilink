import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import {
  Calendar as CalendarIcon,
  ChevronDown,
  LocateFixed,
  MapPin,
  Minus,
  Plus,
} from "lucide-react"
import {
  type MouseEvent,
  type PointerEvent,
  useRef,
  useState,
  type WheelEvent,
} from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useAuth, { isLoggedIn } from "@/hooks/useAuth"
import {
  DashboardFiltersProvider,
  MONTHS,
  useDashboardFilters,
} from "@/lib/dashboard-filters"

export const Route = createFileRoute("/_layout")({
  component: Layout,
  beforeLoad: async () => {
    if (!isLoggedIn()) {
      throw redirect({ to: "/login" })
    }
  },
})

function HeaderMonthSelect() {
  const { month, setMonth } = useDashboardFilters()

  return (
    <Select
      value={String(month)}
      onValueChange={(value) => setMonth(Number(value))}
    >
      <SelectTrigger className="h-9 min-w-[104px] rounded-2xl border-[#426a5b] bg-[#24473b] text-[#fffaf1] shadow-none data-[placeholder]:text-[#dce8df] sm:min-w-[132px] [&_svg]:text-[#fffaf1] [&_svg:last-child]:!text-[#fffaf1] [&_svg:last-child]:!opacity-100">
        <CalendarIcon className="mr-2 size-4 text-[#fffaf1]" />
        <SelectValue placeholder="Bulan tanam" />
      </SelectTrigger>
      <SelectContent className="rounded-2xl border-[#d8ccb7] bg-[#fffaf2] text-[#24473b] shadow-[0_12px_30px_rgba(74,98,79,0.12)]">
        <SelectGroup>
          {MONTHS.map((label, index) => (
            <SelectItem
              key={label}
              value={String(index + 1)}
              className="rounded-xl text-[#24473b] focus:bg-[#e7efe7] focus:text-[#17352b]"
            >
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

function lonLatToTile(lon: number, lat: number, zoom: number) {
  const latRad = (lat * Math.PI) / 180
  const scale = 2 ** zoom
  return {
    x: ((lon + 180) / 360) * scale,
    y:
      ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
      scale,
  }
}

function tileToLonLat(x: number, y: number, zoom: number) {
  const scale = 2 ** zoom
  const lon = (x / scale) * 360 - 180
  const n = Math.PI - (2 * Math.PI * y) / scale
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))
  return { lat, lon }
}

function fallbackLocationName(lat: number, lon: number) {
  return `Lokasi ${lat.toFixed(3)}, ${lon.toFixed(3)}`
}

async function getLocationName(lat: number, lon: number) {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(lat),
    lon: String(lon),
    "accept-language": "id,en",
  })
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params}`,
  )
  if (!response.ok) return fallbackLocationName(lat, lon)
  const payload = await response.json()
  const address = payload?.address ?? {}
  const primary =
    address.village ??
    address.town ??
    address.city ??
    address.suburb ??
    address.municipality ??
    address.county ??
    address.state_district
  const secondary = [
    address.city,
    address.county,
    address.state_district,
    address.state,
    address.country,
  ].find((part) => part && part !== primary)

  if (primary && secondary && primary !== secondary) {
    return `${primary}, ${secondary}`
  }
  return primary ?? payload?.name ?? fallbackLocationName(lat, lon)
}

function HeaderLocationPicker() {
  const { location, setLocation, hasPickedLocation } = useDashboardFilters()
  const [gpsStatus, setGpsStatus] = useState<string | null>(null)
  const [zoom, setZoom] = useState(8)
  const [mapCenter, setMapCenter] = useState({
    lat: location.lat,
    lon: location.lon,
  })
  const [dragStart, setDragStart] = useState<{
    x: number
    y: number
    centerX: number
    centerY: number
  } | null>(null)
  const didDragRef = useRef(false)
  const center = lonLatToTile(mapCenter.lon, mapCenter.lat, zoom)
  const selectedPoint = lonLatToTile(location.lon, location.lat, zoom)
  const centerTileX = Math.floor(center.x)
  const centerTileY = Math.floor(center.y)
  const tileLayerX = -((center.x - centerTileX) * 256) - 256
  const tileLayerY = -((center.y - centerTileY) * 256) - 256
  const markerX = (selectedPoint.x - center.x) * 256
  const markerY = (selectedPoint.y - center.y) * 256
  const tiles = []

  for (let dx = -1; dx <= 1; dx += 1) {
    for (let dy = -1; dy <= 1; dy += 1) {
      tiles.push({
        key: `${dx}:${dy}`,
        x: centerTileX + dx,
        y: centerTileY + dy,
        left: (dx + 1) * 256,
        top: (dy + 1) * 256,
      })
    }
  }

  const setPickedLocation = async ({
    lat,
    lon,
    pendingLabel,
    successStatus,
  }: {
    lat: number
    lon: number
    pendingLabel: string
    successStatus: string
  }) => {
    setMapCenter({ lat, lon })
    setLocation({ lat, lon, label: pendingLabel })
    setGpsStatus("Mencari nama lokasi...")
    try {
      const label = await getLocationName(lat, lon)
      setLocation({ lat, lon, label })
      setGpsStatus(successStatus)
    } catch {
      setLocation({ lat, lon, label: fallbackLocationName(lat, lon) })
      setGpsStatus("Nama lokasi tidak tersedia, koordinat dipakai.")
    }
  }

  const handleMapClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (didDragRef.current) return
    const rect = event.currentTarget.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const clickY = event.clientY - rect.top
    const clickedTileX = center.x + (clickX - rect.width / 2) / 256
    const clickedTileY = center.y + (clickY - rect.height / 2) / 256
    const next = tileToLonLat(clickedTileX, clickedTileY, zoom)
    void setPickedLocation({
      lat: Number(next.lat.toFixed(5)),
      lon: Number(next.lon.toFixed(5)),
      pendingLabel: "Lokasi dipilih",
      successStatus: "Lokasi peta dipakai.",
    })
  }

  const handleMapPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    didDragRef.current = false
    setDragStart({
      x: event.clientX,
      y: event.clientY,
      centerX: center.x,
      centerY: center.y,
    })
  }

  const handleMapPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!dragStart) return
    const deltaX = event.clientX - dragStart.x
    const deltaY = event.clientY - dragStart.y
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      didDragRef.current = true
    }
    const next = tileToLonLat(
      dragStart.centerX - deltaX / 256,
      dragStart.centerY - deltaY / 256,
      zoom,
    )
    setMapCenter({ lat: next.lat, lon: next.lon })
  }

  const handleMapPointerEnd = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    setDragStart(null)
    window.setTimeout(() => {
      didDragRef.current = false
    }, 0)
  }

  const zoomIn = () => setZoom((current) => Math.min(16, current + 1))
  const zoomOut = () => setZoom((current) => Math.max(5, current - 1))
  const handleMapWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault()
    setZoom((current) =>
      Math.max(5, Math.min(16, current + (event.deltaY < 0 ? 1 : -1))),
    )
  }

  const useGpsLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus("GPS tidak tersedia di browser ini.")
      return
    }
    setGpsStatus("Mengambil lokasi...")
    navigator.geolocation.getCurrentPosition(
      (position) => {
        void setPickedLocation({
          lat: Number(position.coords.latitude.toFixed(5)),
          lon: Number(position.coords.longitude.toFixed(5)),
          pendingLabel: "Lokasi saya",
          successStatus: "Lokasi GPS dipakai.",
        })
      },
      () => setGpsStatus("Izin lokasi ditolak atau gagal dibaca."),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-9 min-w-[144px] flex-1 justify-between rounded-2xl border-[#426a5b] bg-[#24473b] px-3 text-[#fffaf1] shadow-none hover:bg-[#2e594a] sm:min-w-[180px] sm:flex-none [&_svg]:text-[#fffaf1]"
        >
          <span className="flex min-w-0 items-center gap-2">
            <MapPin className="size-4 shrink-0" />
            <span className="truncate">
              {hasPickedLocation ? location.label : "Pilih Lokasi"}
            </span>
          </span>
          <ChevronDown className="size-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[430px] rounded-2xl border-[#d8ccb7] bg-[#fffaf2] p-3 text-[#24473b] shadow-[0_16px_40px_rgba(74,98,79,0.18)]"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <div className="font-[Fraunces] text-lg font-semibold text-[#163127]">
              Pilih Lokasi
            </div>
            <div className="text-xs text-[#6c655a]">
              Klik peta untuk menentukan lat/lon rekomendasi.
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 rounded-xl border-[#d9ccb9] bg-white text-xs"
            onClick={useGpsLocation}
          >
            <LocateFixed className="size-3.5" />
            Pakai GPS
          </Button>
        </div>
        <div
          className="relative h-[260px] overflow-hidden rounded-2xl border border-[#e2d7c4] bg-[#e8decf]"
          onWheel={handleMapWheel}
        >
          <button
            type="button"
            aria-label="Pilih titik lokasi di peta"
            className={`absolute inset-0 z-10 w-full touch-none text-left ${
              dragStart ? "cursor-grabbing" : "cursor-grab"
            }`}
            onClick={handleMapClick}
            onPointerDown={handleMapPointerDown}
            onPointerMove={handleMapPointerMove}
            onPointerUp={handleMapPointerEnd}
            onPointerCancel={handleMapPointerEnd}
          >
            <div
              className="absolute left-1/2 top-1/2 size-[768px]"
              style={{
                transform: `translate(${tileLayerX}px, ${tileLayerY}px)`,
              }}
            >
              {tiles.map((tile) => (
                <img
                  key={tile.key}
                  src={`https://tile.openstreetmap.org/${zoom}/${tile.x}/${tile.y}.png`}
                  alt=""
                  className="absolute size-64 select-none"
                  draggable={false}
                  style={{ left: tile.left, top: tile.top }}
                />
              ))}
            </div>
          </button>
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex flex-col items-center"
            style={{
              transform: `translate(calc(-50% + ${markerX}px), calc(-100% + ${markerY}px))`,
            }}
          >
            <MapPin className="size-9 fill-[#24473b] text-[#24473b] drop-shadow-md" />
            <span className="mt-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-[#163127] shadow-sm">
              {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
            </span>
          </div>
          <div className="absolute right-3 top-3 z-30 grid overflow-hidden rounded-xl border border-[#d8ccb7] bg-white shadow-sm">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-none text-[#24473b] hover:bg-[#eef4ea]"
              onClick={zoomIn}
              aria-label="Perbesar peta"
            >
              <Plus className="size-4" />
            </Button>
            <div className="h-px bg-[#eadfcf]" />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-none text-[#24473b] hover:bg-[#eef4ea]"
              onClick={zoomOut}
              aria-label="Perkecil peta"
            >
              <Minus className="size-4" />
            </Button>
          </div>
          <div className="pointer-events-none absolute bottom-3 left-3 z-20 rounded-full bg-white/90 px-2.5 py-1 text-[10px] text-[#6c655a] shadow-sm">
            OpenStreetMap
          </div>
          <div className="pointer-events-none absolute bottom-3 right-3 z-20 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[#24473b] shadow-sm">
            Zoom {zoom}
          </div>
        </div>
        <div className="mt-3 text-xs text-[#6c655a]">
          <div className="min-w-0">
            {gpsStatus ??
              `Lat ${location.lat.toFixed(5)}, Lon ${location.lon.toFixed(5)}`}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function LayoutContent() {
  const { logout, user } = useAuth()
  const userName = user?.full_name || user?.email || "TaniLink"
  const userRole = user?.is_superuser ? "Admin" : "Petani"

  return (
    <div className="app-shell min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(238,232,212,0.85),_transparent_32%),linear-gradient(180deg,_#fffdf7_0%,_#f9f3e8_100%)]">
      <header className="sticky top-0 z-10 flex shrink-0 items-center border-b border-[#0f261f] bg-[#163127] px-3 py-2 shadow-[0_8px_24px_rgba(22,49,39,0.18)] md:px-5">
        <div className="flex w-full items-center gap-2 sm:gap-3">
          <div className="hidden min-w-[128px] font-[Fraunces] text-2xl font-bold text-[#fffaf1] sm:block">
            TaniLink
          </div>
          <HeaderLocationPicker />
          <HeaderMonthSelect />
          <div className="ml-auto flex items-center gap-2.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 w-11 gap-2 rounded-[24px] border-[#426a5b] bg-[#24473b] px-0! text-left text-[#fffaf1] shadow-[0_1px_2px_rgba(15,38,31,0.24)] hover:bg-[#2e594a] sm:w-auto sm:gap-3 sm:pl-5! sm:pr-4!"
                >
                  <div className="hidden min-w-0 flex-1 text-left sm:block">
                    <div className="max-w-[180px] truncate text-[0.95rem] font-semibold leading-tight text-[#fffaf1]">
                      {userName}
                    </div>
                    <div className="truncate pt-0.5 text-[0.78rem] leading-tight text-[#dce8df]">
                      {userRole}
                    </div>
                  </div>
                  <ChevronDown className="size-4 text-[#fffaf1]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 rounded-2xl border-[#d8ccb7] bg-[#fffaf2] p-2 text-[#24473b] shadow-[0_16px_40px_rgba(74,98,79,0.18)]"
              >
                <DropdownMenuItem
                  className="cursor-pointer rounded-xl px-3 py-2 text-sm text-[#24473b] focus:bg-[#e7efe7] focus:text-[#17352b]"
                  onClick={logout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="p-3 md:p-4">
        <div className="mx-auto max-w-[1520px]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

function Layout() {
  return (
    <DashboardFiltersProvider>
      <LayoutContent />
    </DashboardFiltersProvider>
  )
}

export default Layout
