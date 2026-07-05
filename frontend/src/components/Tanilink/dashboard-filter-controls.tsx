import {
  Calendar as CalendarIcon,
  ChevronDown,
  LocateFixed,
  MapPin,
  Minus,
  MousePointer2,
  Move,
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
import { MONTHS, useDashboardFilters } from "@/lib/dashboard-filters"
import { cn } from "@/lib/utils"

type SelectAlign = "start" | "center" | "end"
type InteractionMode = "point" | "pan"

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

const headerSurfaceClass =
  "border-[#426a5b] bg-[#24473b] text-[#fffaf1] shadow-none data-[placeholder]:text-[#dce8df] [&_svg]:text-[#fffaf1]"

export function DashboardMonthSelect({
  triggerClassName,
  variant = "header",
}: {
  triggerClassName?: string
  variant?: "header" | "neutral"
}) {
  const { month, setMonth } = useDashboardFilters()

  const isHeader = variant === "header"
  const surfaceClass = isHeader
    ? headerSurfaceClass
    : "border-[#d8ccb7] bg-white text-[#24473b] hover:bg-[#faf6ee] hover:text-[#1c392e] shadow-none"

  return (
    <Select
      value={String(month)}
      onValueChange={(value) => setMonth(Number(value))}
    >
      <SelectTrigger
        className={cn(
          "h-9 min-w-[104px] rounded-2xl sm:min-w-[132px]",
          isHeader
            ? "[&_svg:last-child]:!text-[#fffaf1]"
            : "[&_svg:last-child]:!text-[#24473b]",
          "[&_svg:last-child]:!opacity-100",
          surfaceClass,
          triggerClassName,
        )}
      >
        <CalendarIcon className={cn("mr-2 size-4", isHeader ? "text-[#fffaf1]" : "text-[#24473b]")} />
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

export function DashboardLocationPicker({
  triggerClassName,
  contentAlign = "start",
  variant = "header",
}: {
  triggerClassName?: string
  contentAlign?: SelectAlign
  variant?: "header" | "neutral"
}) {
  const { location, setLocation, hasPickedLocation } = useDashboardFilters()
  const [gpsStatus, setGpsStatus] = useState<string | null>(null)
  const [zoom, setZoom] = useState(8)
  const [interactionMode, setInteractionMode] =
    useState<InteractionMode>("point")
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
    if (interactionMode !== "point" || didDragRef.current) return
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
    if (interactionMode !== "pan") return
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
    if (interactionMode !== "pan" || !dragStart) return
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
    if (interactionMode !== "pan") return
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

  const isHeader = variant === "header"
  const surfaceClass = isHeader
    ? headerSurfaceClass
    : "border-[#d8ccb7] bg-white text-[#24473b] hover:bg-[#faf6ee] hover:text-[#1c392e] shadow-none"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-9 min-w-[144px] flex-1 justify-between rounded-2xl px-3 sm:min-w-[180px] sm:flex-none",
            isHeader ? "hover:bg-[#2e594a]" : "",
            surfaceClass,
            triggerClassName,
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            <MapPin className={cn("size-4 shrink-0", isHeader ? "text-[#fffaf1]" : "text-[#24473b]")} />
            <span className="truncate">
              {hasPickedLocation ? location.label : "Pilih Lokasi"}
            </span>
          </span>
          <ChevronDown className={cn("size-4 shrink-0", isHeader ? "text-[#fffaf1]" : "text-[#24473b]")} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={contentAlign}
        className="w-[430px] rounded-2xl border-[#d8ccb7] bg-[#fffaf2] p-3 text-[#24473b] shadow-[0_16px_40px_rgba(74,98,79,0.18)]"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <div className="font-[Fraunces] text-lg font-semibold text-[#163127]">
              Pilih Lokasi
            </div>
            <div className="text-xs text-[#6c655a]">
              Gunakan mode tunjuk untuk memilih titik, atau geser peta saat
              perlu berpindah area.
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
            Lokasi saya
          </Button>
        </div>

        <div
          className="relative h-[260px] overflow-hidden rounded-2xl border border-[#e2d7c4] bg-[#e8decf]"
          onWheel={handleMapWheel}
        >
          <div className="absolute left-3 top-3 z-30 inline-flex rounded-lg border border-[#d8ccb7] bg-white/95 p-0.5 shadow-sm">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className={cn(
                "h-7 rounded-md px-2 text-[11px] gap-1",
                interactionMode === "point"
                  ? "bg-[#24473b] text-[#fffaf1] hover:bg-[#24473b]"
                  : "text-[#5f685b] hover:bg-[#eef4ea]",
              )}
              onClick={() => setInteractionMode("point")}
            >
              <MousePointer2 className="size-3" />
              Tunjuk
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className={cn(
                "h-7 rounded-md px-2 text-[11px] gap-1",
                interactionMode === "pan"
                  ? "bg-[#24473b] text-[#fffaf1] hover:bg-[#24473b]"
                  : "text-[#5f685b] hover:bg-[#eef4ea]",
              )}
              onClick={() => setInteractionMode("pan")}
            >
              <Move className="size-3" />
              Geser
            </Button>
          </div>
          <button
            type="button"
            aria-label="Pilih titik lokasi di peta"
            className={cn(
              "absolute inset-0 z-10 w-full touch-none text-left",
              interactionMode === "point"
                ? "cursor-crosshair"
                : dragStart
                  ? "cursor-grabbing"
                  : "cursor-grab",
            )}
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
        </div>
        <div className="mt-3 text-xs text-[#6c655a]">
          <div className="min-w-0">
            {gpsStatus ??
              (interactionMode === "point"
                ? "Mode tunjuk aktif. Klik titik pada peta untuk memilih lokasi."
                : "Mode geser aktif. Seret peta untuk berpindah area.")}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
