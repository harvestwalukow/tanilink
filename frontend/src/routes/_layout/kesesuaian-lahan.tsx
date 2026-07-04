import { createFileRoute } from "@tanstack/react-router"
import {
  AlertTriangle,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  type RecommendResponse,
  type Recommendation,
  commodityLabel,
  formatPercent,
  getRecommendations,
} from "@/lib/ml-api"
import { useDashboardFilters } from "@/lib/dashboard-filters"

export const Route = createFileRoute("/_layout/kesesuaian-lahan")({
  component: KesesuaianLahan,
  head: () => ({
    meta: [{ title: "TaniLink" }],
  }),
})

function suitabilityClass(value: number) {
  if (value >= 0.75) return "Sangat sesuai"
  if (value >= 0.55) return "Sesuai"
  if (value >= 0.35) return "Cukup sesuai"
  return "Perlu pertimbangan"
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

function ScoreBar({ value }: { value: number }) {
  const width = Math.max(0, Math.min(100, Math.round(value * 100)))
  return (
    <div className="h-2 rounded-full bg-[#ece4d8]">
      <div
        className="h-2 rounded-full bg-[#2f5d50]"
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

function SuitabilityCard({ item }: { item: Recommendation }) {
  const badge = sourceBadge(item.sumber_suitability)
  const interval =
    item.suitability_lo != null && item.suitability_hi != null
      ? `${formatPercent(item.suitability_lo)} - ${formatPercent(item.suitability_hi)}`
      : "-"

  return (
    <div className="flex h-full min-h-[218px] flex-col rounded-[18px] border border-[#eadfcf] bg-white p-5 text-left shadow-sm">
      <div className="flex min-h-[58px] items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="font-[Fraunces] text-xl leading-tight text-[#1d3429]">
            {commodityLabel(item.komoditas)}
          </div>
          <div className="mt-2 flex min-h-[26px] flex-wrap items-start gap-1.5">
            <Badge variant="outline" className="rounded-md px-2 py-0.5">
              {suitabilityClass(item.suitability_norm)}
            </Badge>
            <Badge variant="outline" className={`rounded-md ${badge.className}`}>
              {badge.label}
            </Badge>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="font-[Fraunces] text-[1.72rem] leading-none text-[#1d3429]">
            {formatPercent(item.suitability_norm)}
          </div>
          <div className="mt-1 text-[10px] text-[#8d8478]">kecocokan</div>
        </div>
      </div>

      <div className="mt-5 grid flex-1 content-start gap-4">
        <div>
          <div className="mb-2 flex justify-between gap-3 text-[11px] text-[#6c655a]">
            <span>Kecocokan lahan</span>
            <span className="shrink-0 font-semibold text-[#163127]">
              {formatPercent(item.suitability_norm)}
            </span>
          </div>
          <ScoreBar value={item.suitability_norm} />
          <div className="mt-2 text-[10px] leading-none text-[#8d8478]">
            Rentang keyakinan: {interval}
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-[#f4eadb] pt-3 text-xs leading-relaxed text-[#6c655a]">
        <div className="font-semibold text-[#163127]">Sumber model</div>
        <div className="mt-1">{item.sumber_suitability}</div>
      </div>
    </div>
  )
}

function KesesuaianLahan() {
  const { month, location } = useDashboardFilters()
  const [data, setData] = useState<RecommendResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setIsLoading(true)
    setError(null)
    getRecommendations({ lat: location.lat, lon: location.lon, month })
      .then((response) => {
        if (active) setData(response)
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
  }, [location.lat, location.lon, month])

  const recommendations = data?.recommendations ?? []

  return (
    <div className="flex flex-col gap-4">
      <Card className="rounded-[20px] border-[#eadfcf] bg-white shadow-sm">
        <CardContent className="grid gap-4 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h1 className="font-[Fraunces] text-2xl leading-tight text-[#1d3429]">
              Detail kecocokan lahan
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-[#6c675d]">
              Detail ini berasal dari endpoint handoff `/recommend`: skor
              kecocokan, rentang keyakinan, dan sumber model per komoditas.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="rounded-md border-[#cce0b8] bg-[#e5efda]">
              Suitability + interval
            </Badge>
            <Badge variant="outline" className="rounded-md border-[#eadfcf] bg-[#fffdf9]">
              Grid Jatim
            </Badge>
          </div>
        </CardContent>
      </Card>

      {error ? (
        <Alert className="rounded-[18px] border-[#fbc4c4] bg-[#fff7f7]">
          <AlertTriangle className="size-4" />
          <AlertTitle>Data kecocokan belum bisa dimuat</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <Card className="rounded-[20px] border-[#eadfcf] bg-white p-6 text-sm text-[#6c655a]">
          Memuat detail kecocokan lahan...
        </Card>
      ) : (
        <>
          <div className="grid items-stretch gap-4 xl:grid-cols-3">
            {recommendations.map((item) => (
              <SuitabilityCard key={item.komoditas} item={item} />
            ))}
          </div>

          <Card className="overflow-hidden rounded-[20px] border-[#eadfcf] bg-white shadow-sm">
            <CardHeader className="px-5 pb-3 pt-5">
              <CardTitle className="flex items-center gap-2 text-base text-[#1d3429]">
                <Sprout className="size-4" />
                Tabel audit suitability
              </CardTitle>
              <CardDescription>
                Nilai ini adalah komponen kecocokan lahan sebelum digabung
                dengan tren dan risiko harga pada decision score.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="overflow-hidden rounded-[16px] border border-[#efe4d3]">
                <Table>
                  <TableHeader className="bg-[#fffbf4]">
                    <TableRow>
                      <TableHead>Komoditas</TableHead>
                      <TableHead>Kecocokan</TableHead>
                      <TableHead>Rentang keyakinan</TableHead>
                      <TableHead>Keandalan</TableHead>
                      <TableHead>Sumber model</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recommendations.map((item) => {
                      const badge = sourceBadge(item.sumber_suitability)
                      return (
                        <TableRow key={item.komoditas}>
                          <TableCell className="font-semibold text-[#163127]">
                            {commodityLabel(item.komoditas)}
                          </TableCell>
                          <TableCell>{formatPercent(item.suitability_norm)}</TableCell>
                          <TableCell>
                            {formatPercent(item.suitability_lo)} -{" "}
                            {formatPercent(item.suitability_hi)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`rounded-md ${badge.className}`}>
                              {badge.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[420px] text-xs text-[#6c655a]">
                            {item.sumber_suitability}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
