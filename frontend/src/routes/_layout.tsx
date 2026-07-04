import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import {
  Calendar as CalendarIcon,
  ChevronDown,
  LocateFixed,
  MapPin,
  Search,
} from "lucide-react"
import { useState, type MouseEvent } from "react"

import { Footer } from "@/components/Common/Footer"
import AppSidebar from "@/components/Sidebar/AppSidebar"
import { isLoggedIn } from "@/hooks/useAuth"
import useAuth from "@/hooks/useAuth"
import {
  DashboardFiltersProvider,
  MONTHS,
  useDashboardFilters,
} from "@/lib/dashboard-filters"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

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
    <Select value={String(month)} onValueChange={(value) => setMonth(Number(value))}>
      <SelectTrigger className="h-9 min-w-[132px] rounded-2xl border-[#d8ccb7] bg-[#f7f2e8] text-[#24473b] shadow-none data-[placeholder]:text-[#6f7d70] [&_svg]:text-[#24473b]">
        <CalendarIcon className="mr-2 size-4" />
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
      ((1 -
        Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) /
        2) *
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

function HeaderLocationPicker() {
  const { location, setLocation, hasPickedLocation } = useDashboardFilters()
  const [gpsStatus, setGpsStatus] = useState<string | null>(null)
  const zoom = 8
  const center = lonLatToTile(location.lon, location.lat, zoom)
  const centerTileX = Math.floor(center.x)
  const centerTileY = Math.floor(center.y)
  const markerX = 256 + (center.x - centerTileX) * 256
  const markerY = 256 + (center.y - centerTileY) * 256
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

  const handleMapClick = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const clickX = (event.clientX - rect.left) / rect.width
    const clickY = (event.clientY - rect.top) / rect.height
    const tileX = centerTileX - 1 + clickX * 3
    const tileY = centerTileY - 1 + clickY * 3
    const next = tileToLonLat(tileX, tileY, zoom)
    setLocation({
      lat: Number(next.lat.toFixed(5)),
      lon: Number(next.lon.toFixed(5)),
      label: "Lokasi dipilih",
    })
    setGpsStatus(null)
  }

  const useGpsLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus("GPS tidak tersedia di browser ini.")
      return
    }
    setGpsStatus("Mengambil lokasi...")
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: Number(position.coords.latitude.toFixed(5)),
          lon: Number(position.coords.longitude.toFixed(5)),
          label: "Lokasi saya",
        })
        setGpsStatus("Lokasi GPS dipakai.")
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
          className="h-9 min-w-[180px] justify-between rounded-2xl border-[#d8ccb7] bg-[#f7f2e8] px-3 text-[#24473b] shadow-none hover:bg-[#eef4ea]"
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
          role="button"
          aria-label="Pilih titik lokasi di peta"
          className="relative h-[260px] cursor-crosshair overflow-hidden rounded-2xl border border-[#e2d7c4] bg-[#e8decf]"
          onClick={handleMapClick}
        >
          <div
            className="absolute left-1/2 top-1/2 size-[768px] -translate-x-1/2 -translate-y-1/2"
            style={{ transform: `translate(${-markerX + 384}px, ${-markerY + 384}px)` }}
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
          <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
            <MapPin className="size-9 fill-[#24473b] text-[#24473b] drop-shadow-md" />
            <span className="mt-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-[#163127] shadow-sm">
              {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
            </span>
          </div>
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] text-[#6c655a] shadow-sm">
            OpenStreetMap
          </div>
        </div>
        <div className="mt-3 text-xs text-[#6c655a]">
          <div className="min-w-0">
            {gpsStatus ?? `Lat ${location.lat.toFixed(5)}, Lon ${location.lon.toFixed(5)}`}
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
    <div className="app-shell">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-[radial-gradient(circle_at_top_left,_rgba(238,232,212,0.85),_transparent_32%),linear-gradient(180deg,_#fffdf7_0%,_#f9f3e8_100%)]">
          <header className="sticky top-0 z-10 flex shrink-0 items-center border-b border-[#d7ccb9]/70 bg-[#fffaf1]/90 px-3 py-2 backdrop-blur-sm md:px-4">
            <div className="flex w-full items-center gap-3">
              <SidebarTrigger className="-ml-1 rounded-full border border-[#e4d8c5] bg-white text-[#6c655a] hover:bg-[#efe3cd] hover:text-[#163127]" />
              <div className="relative hidden max-w-[420px] flex-1 md:block">
                <Search className="text-muted-foreground absolute top-1/2 left-4 size-4 -translate-y-1/2" />
                <Input
                  value="Cari komoditas, lokasi, atau data..."
                  readOnly
                  className="h-9 rounded-2xl border-[#e3d7c6] bg-white pl-11 text-sm text-[#6c655a] shadow-none"
                />
              </div>
              <HeaderLocationPicker />
              <HeaderMonthSelect />
              <div className="ml-auto flex items-center gap-2.5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-11 gap-3 rounded-[24px] border-[#d8ccb7] bg-[#fffaf2] pl-5! pr-4! text-left text-[#24473b] shadow-[0_1px_2px_rgba(117,92,48,0.05)] hover:bg-[#eef4ea]"
                    >
                      <div className="min-w-0 flex-1 text-left">
                        <div className="max-w-[180px] truncate text-[0.95rem] font-semibold leading-tight text-[#2c3c2d]">
                          {userName}
                        </div>
                        <div className="truncate pt-0.5 text-[0.78rem] leading-tight text-[#7b7468]">
                          {userRole}
                        </div>
                      </div>
                      <ChevronDown className="size-4 text-[#24473b]" />
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
          <main className="flex-1 p-2.5 md:p-3">
            <div className="mx-auto max-w-[1520px]">
              <Outlet />
            </div>
          </main>
          <Footer />
        </SidebarInset>
      </SidebarProvider>
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
