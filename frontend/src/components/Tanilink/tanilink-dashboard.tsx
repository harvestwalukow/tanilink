import {
  AlertTriangle,
  BarChart3,
  type LucideIcon,
  Sprout,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import {
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MONTHS, useDashboardFilters } from "@/lib/dashboard-filters"
import {
  type Commodity,
  commodityLabel,
  type ForecastResponse,
  formatCurrency,
  formatPercent,
  getForecast,
  getRecommendations,
  type Recommendation,
  type RecommendResponse,
} from "@/lib/ml-api"

const COMMODITY_COLORS: Record<Commodity, string> = {
  padi: "#2f5d50",
  jagung: "#d18a2f",
  kedelai: "#607e3f",
  tebu: "#7f7a70",
  cabai: "#e7644c",
  bawang_merah: "#8f64d8",
}
const BRAND_GREEN_ACCENT = "#2f5d50"
const CHART_WIDTH = 560
const CHART_HEIGHT = 132
const CHART_TOP = 10
const CHART_BOTTOM = 116
const CHART_PLOT_HEIGHT = CHART_BOTTOM - CHART_TOP

function scoreClass(value: number) {
  if (value >= 0.75) return "Sangat Sesuai"
  if (value >= 0.55) return "Sesuai"
  if (value >= 0.35) return "Cukup Sesuai"
  return "Perlu Pertimbangan"
}

function sourceBadge(source: string) {
  const lower = source.toLowerCase()
  if (lower.includes("keandalan rendah")) {
    return {
      label: "Estimasi kasar",
      className: "border-[#f5dbb2] bg-[#fbedd7] text-[#8f6f35]",
    }
  }
  if (lower.includes("rule-based")) {
    return {
      label: "Indeks lahan",
      className: "border-[#d8d0c3] bg-[#f4efe4] text-[#6d6559]",
    }
  }
  return {
    label: "Keandalan tinggi",
    className: "border-[#cce0b8] bg-[#e5efda] text-[#4d6839]",
  }
}

function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
  }).format(new Date(date))
}

function ScoreBar({
  value,
  color = "#607e3f",
}: {
  value: number
  color?: string
}) {
  const safeValue = Math.max(0, Math.min(100, Math.round(value * 100)))

  return (
    <div className="h-2 rounded-full bg-[#ece4d8]">
      <div
        className="h-2 rounded-full"
        style={{ width: `${safeValue}%`, backgroundColor: color }}
      />
    </div>
  )
}

function RecommendationRow({
  item,
  selected,
  onSelect,
}: {
  item: Recommendation
  selected: boolean
  onSelect: () => void
}) {
  const badge = sourceBadge(item.sumber_suitability)

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-[18px] border p-4 text-left transition hover:border-[#24473b] hover:bg-[#ecf5e9] hover:shadow-sm ${
        selected
          ? "border-[#24473b] bg-[#e5f0e1] shadow-sm"
          : "border-[#cfe0ca] bg-[#f3f9f0]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#e4dbc9] bg-white overflow-hidden shadow-xs">
            <img
              src={`/assets/images/commodities/icons/${item.komoditas}.png`}
              alt={commodityLabel(item.komoditas)}
              className="size-7 object-contain"
            />
          </div>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold text-[#163127]">
              #{item.rank} {commodityLabel(item.komoditas)}
            </span>
            <span className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant="outline" className="rounded-md px-2 py-0.5">
                {scoreClass(item.final_score)}
              </Badge>
              <Badge
                variant="outline"
                className={`rounded-md px-2 py-0.5 ${badge.className}`}
              >
                {badge.label}
              </Badge>
            </span>
          </span>
        </div>
        <span className="shrink-0 text-right">
          <span className="block font-[Fraunces] text-3xl leading-none text-[#163127]">
            {formatPercent(item.final_score)}
          </span>
          <span className="text-[10px] text-[#8d8478]">skor akhir</span>
        </span>
      </div>
      <div className="mt-4">
        <div className="mb-2 flex justify-between text-[11px] text-[#6c655a]">
          <span>Kecocokan lahan</span>
          <span>{formatPercent(item.suitability_norm)}</span>
        </div>
        <ScoreBar value={item.suitability_norm} color={BRAND_GREEN_ACCENT} />
      </div>
    </button>
  )
}

function CommodityImagePanel({ item }: { item: Recommendation | null }) {
  if (!item) return null

  const imageSrc = `/assets/images/commodities/${item.komoditas}.png`

  return (
    <Card className="overflow-hidden rounded-[24px] border-[#d9ccb7] bg-white shadow-sm">
      <div className="relative h-[180px] w-full overflow-hidden">
        <img
          src={imageSrc}
          alt={commodityLabel(item.komoditas)}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-5">
          <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs font-semibold text-[#fffaf1] backdrop-blur-md">
            Komoditas terpilih
          </span>
          <h2 className="mt-1 font-[Fraunces] text-3xl font-bold text-[#fffaf1] drop-shadow-sm">
            {commodityLabel(item.komoditas)}
          </h2>
        </div>
      </div>
    </Card>
  )
}

function SuitabilityPanel({ item }: { item: Recommendation | null }) {
  if (!item) {
    return (
      <PanelFrame title="Kecocokan Lahan" icon={Sprout}>
        <div className="rounded-[18px] border border-[#efe4d3] bg-[#fffdf9] p-6 text-sm text-[#6c655a]">
          Pilih rekomendasi untuk melihat kecocokan lahan.
        </div>
      </PanelFrame>
    )
  }

  const badge = sourceBadge(item.sumber_suitability)

  return (
    <PanelFrame title="Kecocokan Lahan" icon={Sprout}>
      <div className="grid items-center gap-5 rounded-[18px] border border-[#eadfcf] bg-[#fffefb] p-5 sm:grid-cols-[1fr_auto]">
        <div>
          <div className="text-sm text-[#6c655a]">Komoditas dipilih</div>
          <div className="mt-2 font-[Fraunces] text-3xl leading-tight text-[#163127]">
            {commodityLabel(item.komoditas)}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="outline" className="rounded-md">
              {scoreClass(item.suitability_norm)}
            </Badge>
            <Badge
              variant="outline"
              className={`rounded-md ${badge.className}`}
            >
              {badge.label}
            </Badge>
          </div>
        </div>
        <div className="sm:text-right">
          <div className="font-[Fraunces] text-5xl leading-none text-[#163127] sm:text-6xl">
            {formatPercent(item.suitability_norm)}
          </div>
          <div className="mt-1 text-xs text-[#8d8478]">nilai kecocokan</div>
        </div>
      </div>
    </PanelFrame>
  )
}

function PricePanel({
  forecast,
  loading,
}: {
  forecast: ForecastResponse | null
  loading: boolean
}) {
  const chartPoints = useMemo(() => {
    if (!forecast) return []
    return forecast.forecast.filter((_, index) => index % 6 === 0).slice(0, 12)
  }, [forecast])
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [hoverX, setHoverX] = useState<number | null>(null)
  const values = chartPoints.flatMap((point) => [
    point.harga_lower,
    point.harga_pred,
    point.harga_upper,
  ])
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = Math.max(1, max - min)
  const latest = chartPoints[chartPoints.length - 1]
  const lineColor = forecast ? COMMODITY_COLORS[forecast.komoditas] : "#d18a2f"
  const getChartX = (index: number) =>
    chartPoints.length > 1
      ? (index / (chartPoints.length - 1)) * CHART_WIDTH
      : CHART_WIDTH / 2
  const getChartY = (price: number) =>
    CHART_BOTTOM - ((price - min) / range) * CHART_PLOT_HEIGHT
  const linePath = chartPoints
    .map((point, index) => {
      const x = getChartX(index)
      const y = getChartY(point.harga_pred)
      return `${index === 0 ? "M" : "L"} ${x} ${y}`
    })
    .join(" ")
  const upperPath = chartPoints
    .map((point, index) => {
      const x = getChartX(index)
      const y = getChartY(point.harga_upper)
      return `${index === 0 ? "M" : "L"} ${x} ${y}`
    })
    .join(" ")
  const confidenceBandPath =
    chartPoints.length > 0
      ? `${upperPath} ${chartPoints
          .map((_point, index) => {
            const reverseIndex = chartPoints.length - 1 - index
            const x = getChartX(reverseIndex)
            const y = getChartY(chartPoints[reverseIndex].harga_lower)
            return `L ${x} ${y}`
          })
          .join(" ")} Z`
      : ""
  const areaPath =
    chartPoints.length > 0
      ? `${linePath} L ${getChartX(chartPoints.length - 1)} ${CHART_BOTTOM} L ${getChartX(0)} ${CHART_BOTTOM} Z`
      : ""
  const todayIndex = chartPoints.findIndex((point) => !point.sudah_lewat)
  const extrapolationIndex = chartPoints.findIndex(
    (point) => point.status === "ekstrapolasi",
  )
  const hoverPoint = hoverIndex === null ? null : chartPoints[hoverIndex]
  const firstPoint = chartPoints[0]
  const middlePoint = chartPoints[Math.floor(chartPoints.length / 2)]

  const handleChartMouseMove = (
    event: ReactMouseEvent<SVGSVGElement, MouseEvent>,
  ) => {
    if (chartPoints.length === 0) return
    const rect = event.currentTarget.getBoundingClientRect()
    const cursorX = event.clientX - rect.left
    const svgX = (cursorX / rect.width) * CHART_WIDTH
    const index = Math.min(
      chartPoints.length - 1,
      Math.max(0, Math.round((svgX / CHART_WIDTH) * (chartPoints.length - 1))),
    )
    setHoverIndex(index)
    setHoverX(getChartX(index))
  }

  const handleChartMouseLeave = () => {
    setHoverIndex(null)
    setHoverX(null)
  }

  return (
    <PanelFrame title="Prediksi Harga" icon={BarChart3}>
      {loading ? (
        <div className="rounded-[18px] border border-[#efe4d3] bg-[#fffdf9] p-6 text-sm text-[#6c655a]">
          Memuat forecast harga...
        </div>
      ) : forecast ? (
        <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="rounded-[18px] border border-[#eadfcf] bg-[#fffefb] p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#24473b]">
              {forecast.trend === "turun" ? (
                <TrendingDown className="size-4" />
              ) : (
                <TrendingUp className="size-4" />
              )}
              {commodityLabel(forecast.komoditas)}
            </div>
            <div className="mt-3 font-[Fraunces] text-3xl leading-tight text-[#163127]">
              {latest ? formatCurrency(latest.harga_pred) : "-"}
            </div>
            <div className="mt-1 text-xs text-[#8d8478]">
              Forecast s/d {forecast.forecast_menjangkau}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline" className="rounded-md">
                Risiko {forecast.kelas_risiko}
              </Badge>
              <Badge variant="outline" className="rounded-md">
                Data per {forecast.data_terakhir}
              </Badge>
            </div>
          </div>

          <div className="rounded-[18px] border border-[#eadfcf] bg-white p-5">
            <div className="relative rounded-[16px] border border-[#efe4d3] bg-[#fffefb] p-3">
              <div className="mb-2 flex items-center justify-between gap-3 text-xs text-[#71695c]">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-[#163127]">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: lineColor }}
                    />
                    Harga {commodityLabel(forecast.komoditas)}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#7e7669]">
                    <span className="h-2.5 w-2.5 rounded-sm bg-[#24473b]/12 ring-1 ring-[#24473b]/20" />
                    Confidence interval
                  </div>
                </div>
                <span>Rp/kg</span>
              </div>
              <svg
                viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                className="h-[150px] w-full cursor-crosshair overflow-visible select-none"
                role="img"
                aria-labelledby="forecast-price-chart-title"
                onMouseMove={handleChartMouseMove}
                onMouseLeave={handleChartMouseLeave}
              >
                <title id="forecast-price-chart-title">
                  Prediksi harga komoditas 90 hari
                </title>
                {[
                  CHART_TOP,
                  CHART_TOP + CHART_PLOT_HEIGHT / 2,
                  CHART_BOTTOM,
                ].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2={CHART_WIDTH}
                    y2={y}
                    stroke="#eee2d1"
                    strokeDasharray="4 7"
                  />
                ))}
                {confidenceBandPath ? (
                  <path
                    d={confidenceBandPath}
                    fill={lineColor}
                    opacity="0.12"
                  />
                ) : null}
                {todayIndex >= 0 ? (
                  <line
                    x1={getChartX(todayIndex)}
                    y1={CHART_TOP}
                    x2={getChartX(todayIndex)}
                    y2={CHART_BOTTOM}
                    stroke="#d8ccb9"
                    strokeDasharray="4 6"
                  />
                ) : null}
                {extrapolationIndex >= 0 ? (
                  <line
                    x1={getChartX(extrapolationIndex)}
                    y1={CHART_TOP}
                    x2={getChartX(extrapolationIndex)}
                    y2={CHART_BOTTOM}
                    stroke="#c98a4b"
                    strokeDasharray="5 5"
                  />
                ) : null}
                {areaPath ? (
                  <path d={areaPath} fill={lineColor} opacity="0.08" />
                ) : null}
                <path
                  d={linePath}
                  fill="none"
                  stroke={lineColor}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                />
                {chartPoints.map((point, index) => (
                  <circle
                    key={point.tanggal}
                    cx={getChartX(index)}
                    cy={getChartY(point.harga_pred)}
                    r={hoverIndex === index ? "4.5" : "2.8"}
                    fill={lineColor}
                    stroke="#fff"
                    strokeWidth="1.6"
                  />
                ))}
                {hoverX !== null && hoverPoint ? (
                  <>
                    <line
                      x1={hoverX}
                      y1={CHART_TOP}
                      x2={hoverX}
                      y2={CHART_BOTTOM}
                      stroke="#8f7654"
                      strokeDasharray="2 3"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={hoverX}
                      cy={getChartY(hoverPoint.harga_pred)}
                      r="5"
                      fill={lineColor}
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  </>
                ) : null}
              </svg>
              <div className="mt-2 grid grid-cols-3 items-center text-[10px] text-[#93897a]">
                <span>
                  {firstPoint ? formatShortDate(firstPoint.tanggal) : "-"}
                </span>
                {todayIndex >= 0 ? (
                  <Badge
                    variant="outline"
                    className="mx-auto rounded-full border-[#e6dbc9] bg-[#fffaf2] px-2 py-0 text-[10px] text-[#6b655a]"
                  >
                    Hari ini
                  </Badge>
                ) : (
                  <span className="text-center">
                    {middlePoint ? formatShortDate(middlePoint.tanggal) : "-"}
                  </span>
                )}
                <span className="text-right">
                  {latest ? formatShortDate(latest.tanggal) : "-"}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {forecast.ci_width_pct !== null ? (
                  <Badge
                    variant="outline"
                    className="rounded-full border-[#e6dbc9] bg-[#fffaf2] px-2.5 py-0 text-[10px] text-[#6b655a]"
                  >
                    Confidence interval +/-{forecast.ci_width_pct}%
                  </Badge>
                ) : null}

              </div>
              {hoverX !== null && hoverPoint ? (
                <div
                  className="pointer-events-none absolute top-12 z-10 w-[200px] rounded-xl border border-[#eadfcf] bg-white/95 p-3 text-xs text-[#2c3c2d] shadow-md backdrop-blur-sm"
                  style={{
                    left:
                      hoverX > CHART_WIDTH / 2
                        ? `${(hoverX / CHART_WIDTH) * 100 - 34}%`
                        : `${(hoverX / CHART_WIDTH) * 100 + 4}%`,
                  }}
                >
                  <div className="mb-1 border-b border-[#f2eadf] pb-1 font-bold text-[#163127]">
                    {formatShortDate(hoverPoint.tanggal)}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#6c655a]">Prediksi</span>
                    <span className="font-bold text-[#1d3429]">
                      {formatCurrency(hoverPoint.harga_pred)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="text-[#6c655a]">Interval</span>
                    <span className="font-medium text-[#1d3429]">
                      {formatCurrency(hoverPoint.harga_lower)} -{" "}
                      {formatCurrency(hoverPoint.harga_upper)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="text-[#6c655a]">Status</span>
                    <span className="font-medium text-[#1d3429]">
                      {hoverPoint.status === "ekstrapolasi"
                        ? "Ekstrapolasi"
                        : "Tervalidasi"}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="mt-4 border-t border-[#f4eadb] pt-3 text-sm leading-relaxed text-[#6c655a]">
              {forecast.ringkasan}
            </div>

          </div>
        </div>
      ) : (
        <div className="rounded-[18px] border border-[#efe4d3] bg-[#fffdf9] p-6 text-sm text-[#6c655a]">
          Pilih rekomendasi untuk melihat forecast harga.
        </div>
      )}
    </PanelFrame>
  )
}

function PanelFrame({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: LucideIcon
  children: ReactNode
}) {
  return (
    <Card className="rounded-[24px] border-[#d9ccb7] bg-white shadow-sm">
      <CardHeader className="px-5 pb-3 pt-5">
        <CardTitle className="flex items-center gap-2 font-[Fraunces] text-xl text-[#1d3429]">
          <Icon className="size-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">{children}</CardContent>
    </Card>
  )
}

export function TaniLinkDashboard() {
  const { month, location } = useDashboardFilters()
  const [recommendations, setRecommendations] =
    useState<RecommendResponse | null>(null)
  const [selectedCommodity, setSelectedCommodity] = useState<Commodity | null>(
    null,
  )
  const [forecast, setForecast] = useState<ForecastResponse | null>(null)
  const [recommendationError, setRecommendationError] = useState<string | null>(
    null,
  )
  const [forecastError, setForecastError] = useState<string | null>(null)
  const [loadingRecommendations, setLoadingRecommendations] = useState(true)
  const [loadingForecast, setLoadingForecast] = useState(false)

  useEffect(() => {
    let active = true
    setLoadingRecommendations(true)
    setRecommendationError(null)
    getRecommendations({ lat: location.lat, lon: location.lon, month })
      .then((data) => {
        if (!active) return
        setRecommendations(data)
        setSelectedCommodity(
          (current) => current ?? data.recommendations[0]?.komoditas ?? null,
        )
      })
      .catch((err: Error) => {
        if (active) setRecommendationError(err.message)
      })
      .finally(() => {
        if (active) setLoadingRecommendations(false)
      })
    return () => {
      active = false
    }
  }, [location.lat, location.lon, month])

  useEffect(() => {
    if (!selectedCommodity) return
    let active = true
    setLoadingForecast(true)
    setForecastError(null)
    getForecast(selectedCommodity)
      .then((data) => {
        if (active) setForecast(data)
      })
      .catch((err: Error) => {
        if (active) setForecastError(err.message)
      })
      .finally(() => {
        if (active) setLoadingForecast(false)
      })
    return () => {
      active = false
    }
  }, [selectedCommodity])

  const selectedRecommendation =
    recommendations?.recommendations.find(
      (item) => item.komoditas === selectedCommodity,
    ) ??
    recommendations?.recommendations[0] ??
    null

  return (
    <div className="grid min-h-[calc(100svh-6.25rem)] gap-4 lg:grid-cols-[380px_minmax(0,1fr)] xl:grid-cols-[410px_minmax(0,1fr)]">
      <Card className="rounded-[24px] border-[#d9ccb7] bg-white shadow-sm">
        <CardHeader className="px-5 pb-3 pt-5">
          <CardTitle className="font-[Fraunces] text-xl text-[#1d3429]">
            Rekomendasi komoditas
          </CardTitle>
          <CardDescription>
            Top komoditas untuk {MONTHS[month - 1]} di{" "}
            {location.label ?? "lokasi dipilih"}.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          {recommendationError ? (
            <Alert className="rounded-[18px] border-[#fbc4c4] bg-[#fff7f7]">
              <AlertTriangle className="size-4" />
              <AlertTitle>Rekomendasi belum bisa dimuat</AlertTitle>
              <AlertDescription>{recommendationError}</AlertDescription>
            </Alert>
          ) : loadingRecommendations ? (
            <div className="rounded-[18px] border border-[#efe4d3] bg-[#fffdf9] p-6 text-sm text-[#6c655a]">
              Menghitung rekomendasi dari tabel ML...
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recommendations?.recommendations.map((item) => (
                <RecommendationRow
                  key={item.komoditas}
                  item={item}
                  selected={
                    item.komoditas === selectedRecommendation?.komoditas
                  }
                  onSelect={() => setSelectedCommodity(item.komoditas)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid min-w-0 gap-4 content-start">
        <CommodityImagePanel item={selectedRecommendation} />
        <SuitabilityPanel item={selectedRecommendation} />
        {forecastError ? (
          <Alert className="rounded-[18px] border-[#fbc4c4] bg-[#fff7f7]">
            <AlertTriangle className="size-4" />
            <AlertTitle>Forecast belum bisa dimuat</AlertTitle>
            <AlertDescription>{forecastError}</AlertDescription>
          </Alert>
        ) : null}
        <PricePanel forecast={forecast} loading={loadingForecast} />
      </div>
    </div>
  )
}
