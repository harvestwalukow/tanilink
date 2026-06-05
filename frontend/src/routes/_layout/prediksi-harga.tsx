import { createFileRoute } from "@tanstack/react-router"
import {
  Download,
  Eye,
  EyeOff,
  HelpCircle,
  LineChart as LineChartIcon,
  Table as TableIcon,
} from "lucide-react"
import { useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

export const Route = createFileRoute("/_layout/prediksi-harga")({
  component: PrediksiHarga,
  head: () => ({
    meta: [
      {
        title: "Prediksi Harga Komoditas - TaniLink",
      },
    ],
  }),
})

// Configuration for commodities
const commoditiesConfig = {
  padi: { label: "Padi Sawah", color: "#2f5d50", bg: "bg-[#2f5d50]" },
  jagung: { label: "Jagung", color: "#d18a2f", bg: "bg-[#d18a2f]" },
  cabai: { label: "Cabai Merah", color: "#e7644c", bg: "bg-[#e7644c]" },
  bawang: { label: "Bawang Merah", color: "#8f64d8", bg: "bg-[#8f64d8]" },
  tebu: { label: "Tebu", color: "#7f7a70", bg: "bg-[#7f7a70]" },
} as const

type CommodityKey = keyof typeof commoditiesConfig

// Generate 90 days of forecast data starting from 19 Mei 2025
const generateForecastData = () => {
  const data = []
  const start = new Date(2025, 4, 19)
  for (let i = 0; i < 90; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)

    // Price trend generators
    const padi = 12200 + Math.sin(i / 12) * 350 + i * 12 + (i % 3) * 30
    const jagung = 5800 + Math.cos(i / 15) * 250 - i * 6 + (i % 2) * 20
    const cabai = 38000 + Math.sin(i / 6) * 3200 + i * 160 + (i % 4) * 180
    const bawang = 31000 + Math.cos(i / 10) * 1800 + i * 75 - (i % 3) * 80
    const tebu = 14800 + Math.sin(i / 25) * 80 + i * 3.5 + (i % 2) * 10

    data.push({
      index: i,
      date: d,
      dateStr: d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      }),
      dateFull: d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      padi: Math.round(padi),
      jagung: Math.round(jagung),
      cabai: Math.round(cabai),
      bawang: Math.round(bawang),
      tebu: Math.round(tebu),
    })
  }
  return data
}

const forecastData = generateForecastData()

function PrediksiHarga() {
  const [selectedCommodity, setSelectedCommodity] = useState<
    "all" | CommodityKey
  >("all")
  const [rangeDays, setRangeDays] = useState<30 | 60 | 90>(90)
  const [activeTab, setActiveTab] = useState("chart")
  const [hoveredPoint, setHoveredPoint] = useState<
    (typeof forecastData)[0] | null
  >(null)
  const [hoverX, setHoverX] = useState<number | null>(null)

  // Legend toggle visibility
  const [visibleCommodities, setVisibleCommodities] = useState<
    Record<CommodityKey, boolean>
  >({
    padi: true,
    jagung: true,
    cabai: true,
    bawang: true,
    tebu: true,
  })

  const svgRef = useRef<SVGSVGElement>(null)

  // Filtered range data
  const rangeData = useMemo(() => {
    return forecastData.slice(0, rangeDays)
  }, [rangeDays])

  // Get active lines based on selection & toggles
  const activeCommodities = useMemo(() => {
    if (selectedCommodity === "all") {
      return (Object.keys(commoditiesConfig) as CommodityKey[]).filter(
        (k) => visibleCommodities[k],
      )
    }
    return [selectedCommodity]
  }, [selectedCommodity, visibleCommodities])

  // Find min/max values in range to scale the Y-axis properly
  const yBounds = useMemo(() => {
    let min = Infinity
    let max = -Infinity

    for (const point of rangeData) {
      for (const comm of activeCommodities) {
        const val = point[comm]
        if (val < min) min = val
        if (val > max) max = val
      }
    }

    // Add 10% buffer
    const range = max - min
    return {
      min: Math.max(0, min - range * 0.1),
      max: max + range * 0.1,
    }
  }, [rangeData, activeCommodities])

  // SVG dimensions
  const svgWidth = 800
  const svgHeight = 350
  const paddingLeft = 60
  const paddingRight = 30
  const paddingTop = 20
  const paddingBottom = 40

  const scaleX = (index: number) => {
    const chartWidth = svgWidth - paddingLeft - paddingRight
    return paddingLeft + (index / (rangeDays - 1)) * chartWidth
  }

  const scaleY = (value: number) => {
    const chartHeight = svgHeight - paddingTop - paddingBottom
    const yRatio = (value - yBounds.min) / (yBounds.max - yBounds.min)
    return svgHeight - paddingBottom - yRatio * chartHeight
  }

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const clientX = e.clientX - rect.left

    // Map clientX back to index
    const chartWidth =
      rect.width * ((svgWidth - paddingLeft - paddingRight) / svgWidth)
    const chartStart = rect.width * (paddingLeft / svgWidth)

    const percentage = (clientX - chartStart) / chartWidth
    const rawIndex = percentage * (rangeDays - 1)
    const index = Math.max(0, Math.min(rangeDays - 1, Math.round(rawIndex)))

    const point = rangeData[index]
    setHoveredPoint(point)
    setHoverX(scaleX(index))
  }

  const handleMouseLeave = () => {
    setHoveredPoint(null)
    setHoverX(null)
  }

  const toggleVisibility = (key: CommodityKey) => {
    setVisibleCommodities((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleExport = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(rangeData, null, 2))}`
    const downloadAnchor = document.createElement("a")
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute(
      "download",
      `Prediksi_Harga_${rangeDays}_Hari.json`,
    )
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    document.body.removeChild(downloadAnchor)
    toast.success("File JSON prediksi harga berhasil diunduh!")
  }

  // Generate SVG Line Paths
  const renderLines = () => {
    return activeCommodities.map((comm) => {
      const config = commoditiesConfig[comm]
      const points = rangeData
        .map((d, i) => `${scaleX(i)},${scaleY(d[comm])}`)
        .join(" ")
      return (
        <polyline
          key={comm}
          fill="none"
          stroke={config.color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          className="transition-all duration-300"
        />
      )
    })
  }

  return (
    <div className="space-y-4">
      {/* Toolbar Controls */}
      <Card className="rounded-[20px] border-[#eadfcf] bg-white shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Commodity filter selector */}
            <Select
              value={selectedCommodity}
              onValueChange={(val) =>
                setSelectedCommodity(val as "all" | CommodityKey)
              }
            >
              <SelectTrigger className="h-10 w-[180px] rounded-xl border-[#e5dacb] bg-[#fffdfa] text-xs shadow-none">
                <SelectValue placeholder="Pilih Komoditas" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Semua Komoditas</SelectItem>
                  <SelectItem value="padi">Padi Sawah</SelectItem>
                  <SelectItem value="jagung">Jagung</SelectItem>
                  <SelectItem value="cabai">Cabai Merah</SelectItem>
                  <SelectItem value="bawang">Bawang Merah</SelectItem>
                  <SelectItem value="tebu">Tebu</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Range selection */}
            <Select
              value={String(rangeDays)}
              onValueChange={(val) => setRangeDays(Number(val) as 30 | 60 | 90)}
            >
              <SelectTrigger className="h-10 w-[140px] rounded-xl border-[#e5dacb] bg-[#fffdfa] text-xs shadow-none">
                <SelectValue placeholder="Jangka Waktu" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="30">30 Hari</SelectItem>
                  <SelectItem value="60">60 Hari</SelectItem>
                  <SelectItem value="90">90 Hari</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Legend Toggles (only visible when all commodities are selected) */}
            {selectedCommodity === "all" && (
              <div className="hidden lg:flex items-center gap-2.5 border-l border-[#efe4d5] pl-3 ml-1">
                <span className="text-[10px] font-bold text-[#8d8478] uppercase mr-1.5">
                  Tampilkan:
                </span>
                {(Object.keys(commoditiesConfig) as CommodityKey[]).map(
                  (comm) => {
                    const active = visibleCommodities[comm]
                    const cfg = commoditiesConfig[comm]
                    return (
                      <button
                        type="button"
                        key={comm}
                        onClick={() => toggleVisibility(comm)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.25 rounded-lg border text-[10px] font-medium transition-all ${
                          active
                            ? "bg-white border-[#eadfcf] text-[#163127]"
                            : "bg-[#f8f5ee] border-transparent text-[#9a907f] opacity-60"
                        }`}
                      >
                        <span className={`size-1.5 rounded-full ${cfg.bg}`} />
                        <span>{cfg.label}</span>
                        {active ? (
                          <Eye className="size-3 text-[#5c9a59]" />
                        ) : (
                          <EyeOff className="size-3 text-[#9a907f]" />
                        )}
                      </button>
                    )
                  },
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Display Mode Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-auto"
            >
              <TabsList className="bg-[#f3ead8] rounded-xl p-0.75 h-9.5">
                <TabsTrigger
                  value="chart"
                  className="rounded-lg text-xs font-semibold px-3 h-8 gap-1.5 data-[state=active]:bg-white data-[state=active]:text-[#163127]"
                >
                  <LineChartIcon className="size-3.5" />
                  <span>Grafik Tren</span>
                </TabsTrigger>
                <TabsTrigger
                  value="table"
                  className="rounded-lg text-xs font-semibold px-3 h-8 gap-1.5 data-[state=active]:bg-white data-[state=active]:text-[#163127]"
                >
                  <TableIcon className="size-3.5" />
                  <span>Tabel Angka</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Action Buttons */}
            <Button
              variant="outline"
              onClick={handleExport}
              className="h-9.5 rounded-xl border-[#e5dacb] bg-[#fffdfa] text-xs font-semibold text-[#6c655a] shadow-none hover:bg-[#fffcf7] gap-2"
            >
              <Download className="size-4" />
              <span>Ekspor Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <Card className="rounded-[20px] border-[#eadfcf] bg-white shadow-sm overflow-hidden">
        <CardContent className="p-4 md:p-6">
          {activeTab === "chart" ? (
            <div className="space-y-4">
              {/* Responsive SVG Chart */}
              <div className="relative w-full">
                <svg
                  ref={svgRef}
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-auto cursor-crosshair overflow-visible select-none"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <title>Grafik Tren Prediksi Harga Komoditas</title>
                  {/* Grid Lines */}
                  {Array.from({ length: 5 }).map((_, i) => {
                    const value =
                      yBounds.min + (i / 4) * (yBounds.max - yBounds.min)
                    const y = scaleY(value)
                    return (
                      <g key={i}>
                        <line
                          x1={paddingLeft}
                          y1={y}
                          x2={svgWidth - paddingRight}
                          y2={y}
                          stroke="#eee2d1"
                          strokeDasharray="4 6"
                        />
                        <text
                          x={paddingLeft - 8}
                          y={y + 4}
                          textAnchor="end"
                          className="text-[9px] font-semibold fill-[#8d8478]"
                        >
                          {Math.round(value).toLocaleString("id-ID")}
                        </text>
                      </g>
                    )
                  })}

                  {/* Date Grid Lines (X-Axis markers) */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                    const idx = Math.round(ratio * (rangeDays - 1))
                    const x = scaleX(idx)
                    const point = rangeData[idx]
                    if (!point) return null
                    return (
                      <g key={i}>
                        <line
                          x1={x}
                          y1={paddingTop}
                          x2={x}
                          y2={svgHeight - paddingBottom}
                          stroke="#eee2d1"
                          strokeWidth="0.8"
                        />
                        <text
                          x={x}
                          y={svgHeight - paddingBottom + 16}
                          textAnchor="middle"
                          className="text-[9px] font-semibold fill-[#8d8478]"
                        >
                          {point.dateStr}
                        </text>
                      </g>
                    )
                  })}

                  {/* Render Lines */}
                  {renderLines()}

                  {/* Vertical Hover Tracker Line */}
                  {hoverX !== null && (
                    <line
                      x1={hoverX}
                      y1={paddingTop}
                      x2={hoverX}
                      y2={svgHeight - paddingBottom}
                      stroke="#8f7654"
                      strokeWidth="1.5"
                      strokeDasharray="2 3"
                    />
                  )}

                  {/* Hover Points Highlight Circle */}
                  {hoveredPoint &&
                    activeCommodities.map((comm) => {
                      const config = commoditiesConfig[comm]
                      const x = scaleX(hoveredPoint.index)
                      const y = scaleY(hoveredPoint[comm])
                      return (
                        <circle
                          key={comm}
                          cx={x}
                          cy={y}
                          r="5.5"
                          fill={config.color}
                          stroke="#ffffff"
                          strokeWidth="2"
                          className="shadow-md"
                        />
                      )
                    })}
                </svg>

                {/* Floating Interactive Tooltip */}
                {hoveredPoint && hoverX !== null && (
                  <div
                    className="absolute z-10 bg-[#fffdfb] border border-[#eadfcf] rounded-xl p-3 shadow-xl w-[220px]"
                    style={{
                      left:
                        hoverX > svgWidth / 2
                          ? `${(hoverX / svgWidth) * 100 - 32}%`
                          : `${(hoverX / svgWidth) * 100 + 4}%`,
                      top: "12%",
                    }}
                  >
                    <div className="text-[10px] font-bold text-[#8d8478] mb-1.5 border-b border-[#f2eadf] pb-1">
                      {hoveredPoint.dateFull}
                    </div>
                    <div className="space-y-1.5">
                      {activeCommodities.map((comm) => {
                        const cfg = commoditiesConfig[comm]
                        return (
                          <div
                            key={comm}
                            className="flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`size-2 rounded-full ${cfg.bg}`}
                              />
                              <span className="font-medium text-[#6c655a]">
                                {cfg.label}
                              </span>
                            </div>
                            <span className="font-bold text-[#163127]">
                              Rp {hoveredPoint[comm].toLocaleString("id-ID")}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Legend & Instructions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#f2eadf] text-[10px] text-[#8c8273]">
                <div className="flex flex-wrap items-center gap-3.5">
                  {(Object.keys(commoditiesConfig) as CommodityKey[]).map(
                    (comm) => {
                      const cfg = commoditiesConfig[comm]
                      return (
                        <div key={comm} className="flex items-center gap-1.5">
                          <span className={`size-2.5 rounded-full ${cfg.bg}`} />
                          <span className="font-semibold text-[#3b352a]">
                            {cfg.label}
                          </span>
                        </div>
                      )
                    },
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <HelpCircle className="size-3.5" />
                  <span>
                    Arahkan kursor ke grafik untuk memantau harga harian
                    spesifik.
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Forecast Data Table View */
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#efe4d3]">
                    <TableHead className="font-bold text-[#3c3529]">
                      Tanggal
                    </TableHead>
                    {activeCommodities.includes("padi") && (
                      <TableHead className="font-bold text-[#3c3529]">
                        Padi Sawah
                      </TableHead>
                    )}
                    {activeCommodities.includes("jagung") && (
                      <TableHead className="font-bold text-[#3c3529]">
                        Jagung
                      </TableHead>
                    )}
                    {activeCommodities.includes("cabai") && (
                      <TableHead className="font-bold text-[#3c3529]">
                        Cabai Merah
                      </TableHead>
                    )}
                    {activeCommodities.includes("bawang") && (
                      <TableHead className="font-bold text-[#3c3529]">
                        Bawang Merah
                      </TableHead>
                    )}
                    {activeCommodities.includes("tebu") && (
                      <TableHead className="font-bold text-[#3c3529]">
                        Tebu
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rangeData
                    .filter((_, idx) => idx % 3 === 0)
                    .map(
                      (
                        row, // Show every 3rd day to avoid too long table
                      ) => (
                        <TableRow
                          key={row.index}
                          className="border-[#f3ebd6]/60 hover:bg-[#fffefb]"
                        >
                          <TableCell className="font-semibold text-xs text-[#163127]">
                            {row.dateFull}
                          </TableCell>
                          {activeCommodities.includes("padi") && (
                            <TableCell className="text-xs">
                              Rp {row.padi.toLocaleString("id-ID")}
                            </TableCell>
                          )}
                          {activeCommodities.includes("jagung") && (
                            <TableCell className="text-xs">
                              Rp {row.jagung.toLocaleString("id-ID")}
                            </TableCell>
                          )}
                          {activeCommodities.includes("cabai") && (
                            <TableCell className="text-xs font-semibold text-[#e7644c]">
                              Rp {row.cabai.toLocaleString("id-ID")}
                            </TableCell>
                          )}
                          {activeCommodities.includes("bawang") && (
                            <TableCell className="text-xs">
                              Rp {row.bawang.toLocaleString("id-ID")}
                            </TableCell>
                          )}
                          {activeCommodities.includes("tebu") && (
                            <TableCell className="text-xs">
                              Rp {row.tebu.toLocaleString("id-ID")}
                            </TableCell>
                          )}
                        </TableRow>
                      ),
                    )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
