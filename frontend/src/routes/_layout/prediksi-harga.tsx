import { createFileRoute } from "@tanstack/react-router"
import {
  AlertTriangle,
  Download,
  LineChart as LineChartIcon,
  Table as TableIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  type Commodity,
  type ForecastPoint,
  type ForecastResponse,
  COMMODITIES,
  commodityLabel,
  formatCurrency,
  getForecast,
} from "@/lib/ml-api"

export const Route = createFileRoute("/_layout/prediksi-harga")({
  component: PrediksiHarga,
  head: () => ({
    meta: [{ title: "TaniLink" }],
  }),
})

const COMMODITY_COLORS: Record<Commodity, string> = {
  padi: "#2f5d50",
  jagung: "#d18a2f",
  kedelai: "#607e3f",
  tebu: "#7f7a70",
  cabai: "#e7644c",
  bawang_merah: "#8f64d8",
}

function RiskBadge({ risk }: { risk: ForecastResponse["kelas_risiko"] }) {
  const tone =
    risk === "rendah"
      ? "border-[#cce0b8] bg-[#e5efda] text-[#4d6839]"
      : risk === "sedang"
        ? "border-[#f5dbb2] bg-[#fbedd7] text-[#8f6f35]"
        : "border-[#fbc4c4] bg-[#fde2e2] text-[#9b2c2c]"

  return (
    <Badge variant="outline" className={`rounded-md px-2 py-0.5 ${tone}`}>
      Risiko {risk}
    </Badge>
  )
}

function TrendIcon({ trend }: { trend: ForecastResponse["trend"] }) {
  if (trend === "turun") return <TrendingDown className="size-4" />
  return <TrendingUp className="size-4" />
}

function ForecastChart({
  forecast,
  commodity,
}: {
  forecast: ForecastPoint[]
  commodity: Commodity
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hovered, setHovered] = useState<ForecastPoint | null>(null)

  const width = 920
  const height = 360
  const pad = { left: 72, right: 28, top: 28, bottom: 42 }
  const values = forecast.flatMap((point) => [
    point.harga_lower,
    point.harga_upper,
    point.harga_pred,
  ])
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const padding = (maxValue - minValue) * 0.12 || 1
  const yMin = Math.max(0, minValue - padding)
  const yMax = maxValue + padding
  const chartWidth = width - pad.left - pad.right
  const chartHeight = height - pad.top - pad.bottom
  const color = COMMODITY_COLORS[commodity]

  const scaleX = (index: number) =>
    pad.left + (index / Math.max(1, forecast.length - 1)) * chartWidth
  const scaleY = (value: number) =>
    pad.top + (1 - (value - yMin) / Math.max(1, yMax - yMin)) * chartHeight

  const linePath = forecast
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${scaleX(index)} ${scaleY(point.harga_pred)}`,
    )
    .join(" ")

  const bandPath = [
    ...forecast.map(
      (point, index) => `${index === 0 ? "M" : "L"} ${scaleX(index)} ${scaleY(point.harga_upper)}`,
    ),
    ...forecast
      .map((point, index) => `L ${scaleX(index)} ${scaleY(point.harga_lower)}`)
      .reverse(),
    "Z",
  ].join(" ")

  const firstExtraIndex = forecast.findIndex((point) => point.status === "ekstrapolasi")
  const lastPastIndex = forecast.reduce(
    (lastIndex, point, index) => (point.sudah_lewat ? index : lastIndex),
    -1,
  )
  const todayX = lastPastIndex >= 0 ? scaleX(lastPastIndex) : null

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const ratio = (event.clientX - rect.left) / rect.width
    const index = Math.max(
      0,
      Math.min(forecast.length - 1, Math.round(ratio * (forecast.length - 1))),
    )
    setHovered(forecast[index])
  }

  return (
    <div className="relative rounded-[18px] border border-[#efe4d3] bg-[#fffefb] p-5">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full cursor-crosshair select-none"
        role="img"
        aria-label="Grafik prediksi harga dengan pita confidence interval"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const value = yMin + ratio * (yMax - yMin)
          const y = scaleY(value)
          return (
            <g key={ratio}>
              <line
                x1={pad.left}
                x2={width - pad.right}
                y1={y}
                y2={y}
                stroke="#eee2d1"
                strokeDasharray="4 7"
              />
              <text
                x={pad.left - 10}
                y={y + 4}
                textAnchor="end"
                className="fill-[#8d8478] text-[10px] font-semibold"
              >
                {Math.round(value).toLocaleString("id-ID")}
              </text>
            </g>
          )
        })}
        {lastPastIndex > 0 ? (
          <rect
            x={pad.left}
            y={pad.top}
            width={Math.max(0, scaleX(lastPastIndex) - pad.left)}
            height={chartHeight}
            fill="#efe3cd"
            opacity="0.32"
          />
        ) : null}
        <path d={bandPath} fill={color} opacity="0.18" />
        <path d={linePath} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
        {firstExtraIndex > 0 ? (
          <path
            d={forecast
              .slice(firstExtraIndex)
              .map(
                (point, index) =>
                  `${index === 0 ? "M" : "L"} ${scaleX(index + firstExtraIndex)} ${scaleY(point.harga_pred)}`,
              )
              .join(" ")}
            fill="none"
            stroke={color}
            strokeWidth="3.5"
            strokeDasharray="9 8"
            strokeLinecap="round"
            opacity="0.74"
          />
        ) : null}
        {todayX ? (
          <g>
            <line
              x1={todayX}
              x2={todayX}
              y1={pad.top}
              y2={height - pad.bottom}
              stroke="#8f7654"
              strokeDasharray="4 6"
            />
            <text
              x={todayX}
              y={pad.top - 8}
              textAnchor="middle"
              className="fill-[#8f7654] text-[10px] font-bold"
            >
              hari ini
            </text>
          </g>
        ) : null}
        {forecast.map((point, index) => {
          if (index % 12 !== 0 && index !== forecast.length - 1) return null
          return (
            <text
              key={point.tanggal}
              x={scaleX(index)}
              y={height - 18}
              textAnchor="middle"
              className="fill-[#8d8478] text-[10px] font-semibold"
            >
              {new Date(point.tanggal).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              })}
            </text>
          )
        })}
      </svg>
      {hovered ? (
        <div className="absolute right-5 top-5 w-[230px] rounded-xl border border-[#eadfcf] bg-white/95 p-3 text-xs shadow-xl backdrop-blur-sm">
          <div className="mb-1 border-b border-[#f2eadf] pb-1 font-bold text-[#163127]">
            {new Date(hovered.tanggal).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          <div className="grid gap-1 text-[#6c655a]">
            <span>Prediksi: {formatCurrency(hovered.harga_pred)}</span>
            <span>
              CI: {formatCurrency(hovered.harga_lower)} -{" "}
              {formatCurrency(hovered.harga_upper)}
            </span>
            <span>
              Status: {hovered.status}
              {hovered.sudah_lewat ? " (mengisi gap data)" : ""}
            </span>
          </div>
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[#f4eadb] pt-3 text-[11px] text-[#6c655a]">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-5 rounded-full" style={{ backgroundColor: color }} />
          garis prediksi
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-5 rounded-full opacity-30" style={{ backgroundColor: color }} />
          confidence interval
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-5 rounded-full bg-[#efe3cd]" />
          tanggal sudah lewat
        </span>
        <span>Segmen putus-putus = ekstrapolasi.</span>
      </div>
    </div>
  )
}

function PrediksiHarga() {
  const [commodity, setCommodity] = useState<Commodity>("padi")
  const [activeTab, setActiveTab] = useState("chart")
  const [forecast, setForecast] = useState<ForecastResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setIsLoading(true)
    setError(null)
    getForecast(commodity)
      .then((data) => {
        if (active) setForecast(data)
      })
      .catch((err: Error) => {
        if (active) setError(err.message)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [commodity])

  const tableRows = useMemo(
    () => forecast?.forecast.filter((_, index) => index % 3 === 0) ?? [],
    [forecast],
  )

  const handleExport = () => {
    if (!forecast) return
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(forecast, null, 2))}`
    const link = document.createElement("a")
    link.href = dataStr
    link.download = `Prediksi_Harga_${forecast.komoditas}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Data forecast berhasil diunduh.")
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="rounded-[20px] border-[#eadfcf] bg-white shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={commodity} onValueChange={(value) => setCommodity(value as Commodity)}>
              <SelectTrigger className="h-10 w-[190px] rounded-xl border-[#d8ccb7] bg-[#f7f2e8] text-xs text-[#24473b] shadow-none">
                <SelectValue placeholder="Pilih komoditas" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-[#d8ccb7] bg-[#fffaf2] text-[#24473b]">
                <SelectGroup>
                  {COMMODITIES.map((item) => (
                    <SelectItem key={item} value={item} className="rounded-xl">
                      {commodityLabel(item)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-9.5 rounded-xl bg-[#f3ead8] p-0.75">
                <TabsTrigger value="chart" className="h-8 gap-1.5 rounded-lg px-3 text-xs">
                  <LineChartIcon className="size-3.5" />
                  Grafik
                </TabsTrigger>
                <TabsTrigger value="table" className="h-8 gap-1.5 rounded-lg px-3 text-xs">
                  <TableIcon className="size-3.5" />
                  Tabel
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={!forecast}
            className="h-10 gap-2 rounded-xl border-[#e5dacb] bg-[#fffdfa] text-xs"
          >
            <Download className="size-4" />
            Ekspor JSON
          </Button>
        </CardContent>
      </Card>

      {error ? (
        <Alert className="rounded-[18px] border-[#fbc4c4] bg-[#fff7f7]">
          <AlertTriangle className="size-4" />
          <AlertTitle>Forecast belum bisa dimuat</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {forecast ? (
        <Card className="rounded-[20px] border-[#eadfcf] bg-white shadow-sm">
          <CardHeader className="px-5 pb-3 pt-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 font-[Fraunces] text-xl text-[#1d3429]">
                  <TrendIcon trend={forecast.trend} />
                  {commodityLabel(forecast.komoditas)}
                </CardTitle>
                <CardDescription className="mt-1 text-sm text-[#6c655a]">
                  {forecast.ringkasan}
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                <RiskBadge risk={forecast.kelas_risiko} />
                <Badge variant="outline" className="rounded-md">
                  Data per {forecast.data_terakhir}
                </Badge>
                <Badge variant="outline" className="rounded-md">
                  Forecast s/d {forecast.forecast_menjangkau}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 px-5 pb-5">
            {forecast.catatan_ekstrapolasi ? (
              <Alert className="rounded-[16px] border-[#f5dbb2] bg-[#fffaf2]">
                <AlertTriangle className="size-4" />
                <AlertTitle>Bagian grafik bersifat indikatif</AlertTitle>
                <AlertDescription>{forecast.catatan_ekstrapolasi}</AlertDescription>
              </Alert>
            ) : null}
            {activeTab === "chart" ? (
              <ForecastChart forecast={forecast.forecast} commodity={forecast.komoditas} />
            ) : (
              <div className="overflow-x-auto rounded-[18px] border border-[#efe4d3]">
                <Table>
                  <TableHeader className="bg-[#fffbf4]">
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Prediksi</TableHead>
                      <TableHead>Confidence interval</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableRows.map((point) => (
                      <TableRow key={point.tanggal}>
                        <TableCell className="font-medium">
                          {new Date(point.tanggal).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell>{formatCurrency(point.harga_pred)}</TableCell>
                        <TableCell>
                          {formatCurrency(point.harga_lower)} -{" "}
                          {formatCurrency(point.harga_upper)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="rounded-md">
                            {point.status}
                            {point.sudah_lewat ? " / sudah lewat" : ""}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      ) : isLoading ? (
        <Card className="rounded-[20px] border-[#eadfcf] bg-white p-6 text-sm text-[#6c655a]">
          Memuat forecast harga...
        </Card>
      ) : null}
    </div>
  )
}
