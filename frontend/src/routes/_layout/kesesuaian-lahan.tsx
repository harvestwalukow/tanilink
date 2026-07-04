import { createFileRoute } from "@tanstack/react-router"
import {
  AlertTriangle,
  Info,
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
    meta: [{ title: "Kecocokan Lahan - TaniLink" }],
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
    <Card className="rounded-[20px] border-[#eadfcf] bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="font-[Fraunces] text-xl text-[#1d3429]">
              {commodityLabel(item.komoditas)}
            </CardTitle>
            <CardDescription>
              {suitabilityClass(item.suitability_norm)}
            </CardDescription>
          </div>
          <Badge variant="outline" className={`rounded-md ${badge.className}`}>
            {badge.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div>
          <div className="mb-1 flex justify-between text-xs text-[#6c655a]">
            <span>Kecocokan lahan</span>
            <span className="font-semibold text-[#163127]">
              {formatPercent(item.suitability_norm)}
            </span>
          </div>
          <ScoreBar value={item.suitability_norm} />
        </div>
        <div className="rounded-[14px] border border-[#efe4d3] bg-[#fffdf9] p-3 text-xs text-[#6c655a]">
          <div>
            <span className="font-semibold text-[#163127]">
              Rentang keyakinan:
            </span>{" "}
            {interval}
          </div>
          <div className="mt-1">
            <span className="font-semibold text-[#163127]">Sumber:</span>{" "}
            {item.sumber_suitability}
          </div>
        </div>
      </CardContent>
    </Card>
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
        <CardContent className="grid gap-3 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
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

      <Card className="rounded-[20px] border-[#eadfcf] bg-white shadow-sm">
        <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="rounded-xl border border-[#efe4d3] bg-[#fffdf9] px-3 py-2 text-xs text-[#6c655a]">
            Lokasi aktif:{" "}
            <span className="font-semibold text-[#163127]">
              Lat {location.lat.toFixed(5)}, Lon {location.lon.toFixed(5)}
            </span>
          </div>
          {data ? (
            <div className="rounded-xl border border-[#efe4d3] bg-[#fffdf9] px-3 py-2 text-xs text-[#6c655a]">
              Matched point{" "}
              <span className="font-semibold text-[#163127]">
                {data.matched_point.point_id}
              </span>{" "}
              ({data.matched_point.distance_deg})
            </div>
          ) : null}
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
          <div className="grid gap-3 xl:grid-cols-3">
            {recommendations.map((item) => (
              <SuitabilityCard key={item.komoditas} item={item} />
            ))}
          </div>

          <Card className="overflow-hidden rounded-[20px] border-[#eadfcf] bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-[#1d3429]">
                <Sprout className="size-4" />
                Tabel audit suitability
              </CardTitle>
              <CardDescription>
                Nilai ini adalah komponen kecocokan lahan sebelum digabung
                dengan tren dan risiko harga pada decision score.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
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
            </CardContent>
          </Card>

          <Alert className="rounded-[18px] border-[#dce6d2] bg-[#fbfff8]">
            <Info className="size-4" />
            <AlertTitle>Catatan handoff</AlertTitle>
            <AlertDescription>
              Halaman ini tidak menampilkan pH, C-organik, atau nutrien tanah
              karena field itu tidak ada di kontrak handoff. Kecocokan dihitung
              dari model suitability precompute dan disajikan bersama interval
              ketidakpastiannya.
            </AlertDescription>
          </Alert>
        </>
      )}
    </div>
  )
}
