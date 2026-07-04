import { createFileRoute } from "@tanstack/react-router"
import {
  AlertTriangle,
  Leaf,
  Sprout,
} from "lucide-react"
import { useEffect, useState } from "react"
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
  type RecommendResponse,
  type Recommendation,
  commodityLabel,
  formatPercent,
  getRecommendations,
} from "@/lib/ml-api"

export const Route = createFileRoute("/_layout/rekomendasi-tanam")({
  component: RekomendasiTanam,
  head: () => ({
    meta: [{ title: "Rekomendasi Tanam - TaniLink" }],
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

function scoreClass(value: number) {
  if (value >= 0.75) return "Sangat Sesuai"
  if (value >= 0.55) return "Sesuai"
  if (value >= 0.35) return "Cukup Sesuai"
  return "Perlu Pertimbangan"
}

function ScoreBar({ value, color }: { value: number; color: string }) {
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

function ReliabilityBadges({ source }: { source: string }) {
  const lower = source.toLowerCase()
  if (lower.includes("keandalan rendah")) {
    return (
      <Badge variant="outline" className="rounded-md border-[#f5dbb2] bg-[#fbedd7] text-[#8f6f35]">
        Estimasi kasar
      </Badge>
    )
  }
  if (lower.includes("rule-based")) {
    return (
      <Badge variant="outline" className="rounded-md border-[#d8d0c3] bg-[#f4efe4] text-[#6d6559]">
        Indeks lahan
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="rounded-md border-[#cce0b8] bg-[#e5efda] text-[#4d6839]">
      Keandalan tinggi
    </Badge>
  )
}

function RecommendationCard({
  item,
}: {
  item: Recommendation
}) {
  const color = COMMODITY_COLORS[item.komoditas]
  const stale = item.harga_data_terakhir?.includes("2025")
  const interval =
    item.suitability_lo != null && item.suitability_hi != null
      ? `${formatPercent(item.suitability_lo)} - ${formatPercent(item.suitability_hi)}`
      : "-"

  return (
    <div
      className="flex h-full min-h-[268px] flex-col rounded-[18px] border border-[#eadfcf] bg-white p-5 text-left shadow-sm"
    >
      <div className="flex min-h-[58px] items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: color }}
          >
            <Leaf className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-[#1d3429]">
              #{item.rank} {commodityLabel(item.komoditas)}
            </div>
            <div className="mt-2 flex min-h-[26px] flex-wrap items-start gap-1.5">
              <Badge variant="outline" className="rounded-md px-2 py-0.5">
                {scoreClass(item.final_score)}
              </Badge>
              <ReliabilityBadges source={item.sumber_suitability} />
            </div>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-[Fraunces] text-[1.72rem] leading-none text-[#1d3429]">
            {formatPercent(item.final_score)}
          </div>
          <div className="mt-1 text-[10px] text-[#8d8478]">skor akhir</div>
        </div>
      </div>

      <div className="mt-5 grid flex-1 content-start gap-4">
        <div>
          <div className="mb-2 flex justify-between gap-3 text-[11px] text-[#6c655a]">
            <span>Kecocokan lahan</span>
            <span className="shrink-0">{formatPercent(item.suitability_norm)}</span>
          </div>
          <ScoreBar value={item.suitability_norm} color={color} />
          <div className="mt-2 text-[10px] leading-none text-[#8d8478]">
            Rentang keyakinan: {interval}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <div className="mb-2 flex justify-between gap-3 text-[11px] text-[#6c655a]">
              <span>Tren harga</span>
              <span className="shrink-0">{formatPercent(item.price_trend_norm)}</span>
            </div>
            <ScoreBar value={item.price_trend_norm} color="#6f8f4e" />
          </div>
          <div>
            <div className="mb-2 flex justify-between gap-3 text-[11px] text-[#6c655a]">
              <span>Risiko harga</span>
              <span className="shrink-0">{formatPercent(item.price_volatility_norm)}</span>
            </div>
            <ScoreBar value={item.price_volatility_norm} color="#d18a2f" />
          </div>
        </div>
      </div>

      <div className="mt-5 flex min-h-[28px] flex-wrap items-end gap-2 border-t border-[#f4eadb] pt-3">
        <Badge
          variant="outline"
          className={`rounded-md px-2.5 py-1 ${stale ? "border-[#f5dbb2] bg-[#fbedd7] text-[#8f6f35]" : ""}`}
        >
          Harga per {item.harga_data_terakhir ?? "-"}
        </Badge>
      </div>
    </div>
  )
}

export function RekomendasiTanam() {
  const { month, location } = useDashboardFilters()
  const [recommendations, setRecommendations] = useState<RecommendResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingRecommendations, setLoadingRecommendations] = useState(true)

  useEffect(() => {
    let active = true
    setLoadingRecommendations(true)
    setError(null)
    getRecommendations({ lat: location.lat, lon: location.lon, month })
      .then((data) => {
        if (!active) return
        setRecommendations(data)
      })
      .catch((err: Error) => {
        if (active) setError(err.message)
      })
      .finally(() => {
        if (active) setLoadingRecommendations(false)
      })
    return () => {
      active = false
    }
  }, [location.lat, location.lon, month])

  return (
    <div className="flex flex-col gap-4">
      {error ? (
        <Alert className="rounded-[18px] border-[#fbc4c4] bg-[#fff7f7]">
          <AlertTriangle className="size-4" />
          <AlertTitle>Layanan rekomendasi belum bisa dimuat</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4">
        <div className="flex flex-col gap-4">
          <Card className="rounded-[20px] border-[#eadfcf] bg-white shadow-sm">
            <CardHeader className="px-5 pb-3 pt-5">
              <CardTitle className="flex items-center gap-2 font-[Fraunces] text-xl text-[#1d3429]">
                <Sprout className="size-5" />
                Rekomendasi Komoditas
              </CardTitle>
              <CardDescription>
                Top komoditas untuk {MONTHS[month - 1]} di lat {location.lat.toFixed(3)}, lon{" "}
                {location.lon.toFixed(3)}.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              {loadingRecommendations ? (
                <div className="rounded-[18px] border border-[#efe4d3] bg-[#fffdf9] p-6 text-sm text-[#6c655a]">
                  Menghitung rekomendasi dari tabel ML...
                </div>
              ) : (
                <div className="grid items-stretch gap-4 lg:grid-cols-2">
                  {recommendations?.recommendations.map((item) => (
                    <RecommendationCard
                      key={item.komoditas}
                      item={item}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
