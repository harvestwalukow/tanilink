import {
  AlertTriangle,
  BarChart3,
  Leaf,
  type LucideIcon,
  Sprout,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { type ReactNode, useEffect, useMemo, useState } from "react"

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
  const color = COMMODITY_COLORS[item.komoditas]
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
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: color }}
          >
            <Leaf className="size-5" />
          </span>
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

  const color = COMMODITY_COLORS[item.komoditas]
  const badge = sourceBadge(item.sumber_suitability)
  const interval =
    item.suitability_lo != null && item.suitability_hi != null
      ? `${formatPercent(item.suitability_lo)} - ${formatPercent(item.suitability_hi)}`
      : "-"

  return (
    <PanelFrame title="Kecocokan Lahan" icon={Sprout}>
      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[18px] border border-[#eadfcf] bg-[#fffefb] p-5">
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
          <div className="mt-5">
            <div className="font-[Fraunces] text-5xl leading-none text-[#163127]">
              {formatPercent(item.suitability_norm)}
            </div>
            <div className="mt-1 text-xs text-[#8d8478]">nilai kecocokan</div>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#eadfcf] bg-white p-5">
          <div className="mb-2 flex justify-between gap-3 text-sm text-[#6c655a]">
            <span>Kecocokan lahan</span>
            <span className="font-semibold text-[#163127]">
              {formatPercent(item.suitability_norm)}
            </span>
          </div>
          <ScoreBar value={item.suitability_norm} color={color} />
          <div className="mt-2 text-xs text-[#8d8478]">
            Rentang keyakinan: {interval}
          </div>
          <div className="mt-5 border-t border-[#f4eadb] pt-4 text-sm leading-relaxed text-[#6c655a]">
            <div className="font-semibold text-[#163127]">Sumber model</div>
            <div className="mt-1">{item.sumber_suitability}</div>
          </div>
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
  const values = chartPoints.map((point) => point.harga_pred)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = Math.max(1, max - min)
  const latest = chartPoints[chartPoints.length - 1]

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
            <div className="flex h-40 items-end gap-2">
              {chartPoints.map((point) => {
                const height = 22 + ((point.harga_pred - min) / range) * 118
                return (
                  <div
                    key={point.tanggal}
                    className="flex flex-1 flex-col items-center justify-end gap-2"
                  >
                    <span
                      className="w-full rounded-t-lg bg-[#d18a2f]"
                      style={{ height }}
                    />
                  </div>
                )
              })}
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
