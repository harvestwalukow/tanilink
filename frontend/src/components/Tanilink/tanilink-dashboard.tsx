import { Link } from "@tanstack/react-router"
import {
  ArrowRight,
  BarChart3,
  Landmark,
  Sprout,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function MainActions() {
  return (
    <div className="grid gap-3 xl:grid-cols-3">
      <Card className="rounded-[20px] border-[#dce6d2] bg-white shadow-sm">
        <CardHeader className="px-5 pb-3 pt-4">
          <div className="flex items-center gap-2 text-[#24473b]">
            <Landmark className="size-5" />
            <CardTitle className="font-[Fraunces] text-xl">
              Rekomendasi tanam
            </CardTitle>
          </div>
          <CardDescription>
            Alur utama handoff: pilih lokasi, pilih bulan tanam, lalu lihat
            Top-N komoditas.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <Button asChild className="h-10 rounded-xl bg-[#24473b] text-white hover:bg-[#17352b]">
            <Link to="/rekomendasi-tanam" className="flex items-center gap-2">
              Buka rekomendasi
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-[20px] border-[#eadfcf] bg-white shadow-sm">
        <CardHeader className="px-5 pb-3 pt-4">
          <div className="flex items-center gap-2 text-[#46633a]">
            <Sprout className="size-5" />
            <CardTitle className="font-[Fraunces] text-xl">
              Kecocokan lahan
            </CardTitle>
          </div>
          <CardDescription>
            Detail suitability_norm, rentang keyakinan, dan sumber model per
            komoditas.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <Button asChild variant="outline" className="h-10 rounded-xl border-[#d9ccb9]">
            <Link to="/kesesuaian-lahan" className="flex items-center gap-2">
              Buka detail kecocokan
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-[20px] border-[#eadfcf] bg-white shadow-sm">
        <CardHeader className="px-5 pb-3 pt-4">
          <div className="flex items-center gap-2 text-[#c17c1f]">
            <BarChart3 className="size-5" />
            <CardTitle className="font-[Fraunces] text-xl">
              Cek forecast harga
            </CardTitle>
          </div>
          <CardDescription>
            Detail forecast harga, confidence interval, risiko, ekstrapolasi,
            dan kesegaran data.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <Button asChild variant="outline" className="h-10 rounded-xl border-[#d9ccb9]">
            <Link to="/prediksi-harga" className="flex items-center gap-2">
              Buka prediksi harga
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function TaniLinkDashboard() {
  return (
    <div className="flex flex-col gap-4 overflow-x-clip">
      <MainActions />
    </div>
  )
}
