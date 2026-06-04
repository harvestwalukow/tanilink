import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CircleHelp,
  CloudRain,
  CloudSun,
  Droplets,
  Leaf,
  MapPin,
  SunMedium,
  TrendingUp,
  Wind,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const suitabilityRows = [
  { commodity: "Padi Sawah", marker: "PS", score: 87, badge: "Sangat Sesuai" },
  { commodity: "Jagung", marker: "JG", score: 74, badge: "Sesuai" },
  { commodity: "Cabai Merah", marker: "CM", score: 68, badge: "Cukup Sesuai" },
  { commodity: "Bawang Merah", marker: "BM", score: 61, badge: "Cukup Sesuai" },
  { commodity: "Tebu", marker: "TB", score: 58, badge: "Cukup Sesuai" },
]

const forecastSeries = [
  {
    label: "Padi",
    color: "#2f5d50",
    points: [58, 61, 63, 62, 64, 60, 62, 60, 61, 60],
  },
  {
    label: "Jagung",
    color: "#d18a2f",
    points: [44, 46, 43, 45, 44, 41, 42, 40, 40, 39],
  },
  {
    label: "Cabai Merah",
    color: "#e7644c",
    points: [25, 29, 27, 26, 25, 24, 24, 23, 22, 22],
  },
  {
    label: "Bawang Merah",
    color: "#8f64d8",
    points: [14, 16, 17, 16, 17, 16, 15, 14, 13, 12],
  },
  {
    label: "Tebu",
    color: "#7f7a70",
    points: [52, 52, 51, 51, 50, 49, 49, 48, 48, 48],
  },
]

const weeklyWeather = [
  { day: "Hari ini", high: "32°", low: "24°", icon: CloudSun },
  { day: "Rab", high: "33°", low: "24°", icon: CloudRain },
  { day: "Kam", high: "32°", low: "24°", icon: CloudSun },
  { day: "Jum", high: "31°", low: "23°", icon: CloudSun },
  { day: "Sab", high: "32°", low: "23°", icon: CloudSun },
]

const soilStats = [
  { label: "pH (H2O)", value: "6,4", note: "Agak Masam" },
  { label: "C-Organik", value: "1,82%", note: "Rendah" },
  { label: "N-Total", value: "0,12%", note: "Rendah" },
  { label: "P2O5", value: "18 ppm", note: "Sedang" },
  { label: "K2O", value: "0,35 me/100g", note: "Rendah" },
  { label: "KTK", value: "16,2 me/100g", note: "Sedang" },
]

const recommendations = [
  {
    date: "20 - 30 Mei 2025",
    title: "Padi Sawah (MT II)",
    body: "Waktu tanam optimal. Ketersediaan air baik.",
    badge: "Sangat Sesuai",
  },
  {
    date: "25 Mei - 5 Jun 2025",
    title: "Jagung (Musim Kemarau)",
    body: "Persiapan lahan dan pemupukan dasar.",
    badge: "Sesuai",
  },
  {
    date: "1 - 10 Jun 2025",
    title: "Cabai Merah",
    body: "Gunakan varietas tahan penyakit.",
    badge: "Cukup Sesuai",
  },
]

const notifications = [
  {
    title: "Curah hujan tinggi diprediksi",
    body: "20-24 Mei 2025 di sebagian besar Jawa Timur. Waspadai risiko genangan.",
    age: "Baru saja",
    tone: "warning",
  },
  {
    title: "Harga Cabai Merah naik signifikan",
    body: "+18% dalam 7 hari terakhir di Jawa Timur.",
    age: "1 jam lalu",
    tone: "success",
  },
  {
    title: "Pembaruan data model",
    body: "Model kesesuaian lahan telah diperbarui.",
    age: "3 jam lalu",
    tone: "info",
  },
] as const

const CARD_HEADER = "px-5 pb-2 pt-4"
const CARD_CONTENT = "px-5 pb-4"
const CARD_FOOTER = "mt-auto justify-between px-5 pb-4 pt-3"
const SECTION_HEADER = "gap-1 px-5 pb-2 pt-4"

function SectionTitle({
  title,
  description,
  trailing,
}: {
  title: string
  description?: string
  trailing?: React.ReactNode
}) {
  return (
    <CardHeader className={SECTION_HEADER}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="font-[Fraunces] text-[0.96rem] leading-tight tracking-[-0.03em] text-[#21382d] md:text-[1.04rem]">
            {title}
          </CardTitle>
          {description ? (
            <CardDescription className="text-[10px] text-[#7d7467]">
              {description}
            </CardDescription>
          ) : null}
        </div>
        {trailing}
      </div>
    </CardHeader>
  )
}

function StatBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 rounded-full bg-[#ece4d8]">
      <div
        className="h-1.5 rounded-full bg-[#79a56e]"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

function ScorePill({ label }: { label: string }) {
  const tone =
    label === "Sangat Sesuai"
      ? "bg-[#e5efda] text-[#4d6839]"
      : label === "Sesuai"
        ? "bg-[#edf1e7] text-[#56704b]"
        : "bg-[#fbedd7] text-[#8f6f35]"

  return (
    <Badge
      variant="secondary"
      className={`rounded-md border-0 px-2 py-0.5 text-[10px] font-medium ${tone}`}
    >
      {label}
    </Badge>
  )
}

function CardLink({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#2d603d]">
      <span>{label}</span>
      <ArrowRight className="size-3.5" />
    </div>
  )
}

function ForecastChart() {
  const width = 560
  const height = 110

  const toPath = (points: number[]) =>
    points
      .map((point, index) => {
        const x = (index / (points.length - 1)) * width
        const y = height - point * 1.6
        return `${index === 0 ? "M" : "L"} ${x} ${y}`
      })
      .join(" ")

  return (
    <div className="rounded-[16px] border border-[#efe4d3] bg-[#fffefb] p-2.5">
      <div className="mb-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-[#71695c]">
        {forecastSeries.map((series) => (
          <div key={series.label} className="flex items-center gap-1.5">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: series.color }}
            />
            <span>{series.label}</span>
          </div>
        ))}
      </div>
      <div className="mb-1 text-[9px] text-[#857d70]">Harga (Rp/kg)</div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-[116px] w-full"
        role="img"
        aria-labelledby="forecast-chart-title"
      >
        <title id="forecast-chart-title">
          Prediksi harga komoditas 90 hari
        </title>
        {[30, 60, 90].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2={width}
            y2={y}
            stroke="#eee2d1"
            strokeDasharray="4 7"
          />
        ))}
        <line
          x1="360"
          y1="8"
          x2="360"
          y2={height}
          stroke="#d8ccb9"
          strokeDasharray="4 6"
        />
        {forecastSeries.map((series) => (
          <path
            key={series.label}
            d={toPath(series.points)}
            fill="none"
            stroke={series.color}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        ))}
      </svg>
      <div className="mt-1.5 grid grid-cols-7 items-center gap-1 text-[8px] text-[#93897a]">
        <span>19 Mei</span>
        <span>2 Jun</span>
        <span>16 Jun</span>
        <span>30 Jun</span>
        <Badge
          variant="outline"
          className="mx-auto rounded-full border-[#e6dbc9] bg-[#fffaf2] px-1.5 py-0 text-[9px] text-[#6b655a]"
        >
          Hari ini
        </Badge>
        <span>28 Jul</span>
        <span className="text-right">11 Agu</span>
      </div>
    </div>
  )
}

function MapPreview() {
  return (
    <div className="rounded-[16px] border border-[#ece2d2] bg-[#f8f4ea] p-2.5">
      <div className="relative h-[150px] overflow-hidden rounded-[14px] border border-[#e2d7c4] bg-[radial-gradient(circle_at_18%_18%,rgba(154,197,151,0.18),transparent_24%),linear-gradient(180deg,#f4f0e7_0%,#e8e2d5_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_40%,rgba(180,213,183,0.65)_0%,rgba(180,213,183,0.65)_6%,transparent_6%),radial-gradient(circle_at_40%_52%,rgba(144,198,166,0.9)_0%,rgba(144,198,166,0.9)_5%,transparent_5%),radial-gradient(circle_at_56%_43%,rgba(227,207,139,0.95)_0%,rgba(227,207,139,0.95)_5%,transparent_5%),radial-gradient(circle_at_66%_56%,rgba(150,204,165,0.9)_0%,rgba(150,204,165,0.9)_6%,transparent_6%),radial-gradient(circle_at_78%_40%,rgba(182,223,183,0.75)_0%,rgba(182,223,183,0.75)_5%,transparent_5%)] opacity-80" />
        <div className="absolute left-[10%] top-[13%] h-[100px] w-[74%] rounded-[42%_58%_44%_56%/52%_38%_62%_48%] border border-[#8cb38a] bg-[linear-gradient(180deg,#b7dbb9_0%,#c8e8cb_100%)] opacity-90" />
        <div className="absolute left-[18%] top-[21%] h-[74px] w-[58%] rounded-[56%_44%_50%_50%/44%_56%_40%_60%] border border-dashed border-[#c5bea9]" />
        <div className="absolute left-[42%] top-[39%] flex size-7 items-center justify-center rounded-full bg-[#214f3c] text-white shadow-lg">
          <MapPin className="size-4 fill-current" />
        </div>
        <div className="absolute bottom-2 left-2 right-2 flex flex-wrap items-center gap-1.5 rounded-full bg-white/92 px-2 py-0.75 text-[7px] text-[#6f6659] shadow-sm">
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-sm bg-[#1d7a43]" />
            Sangat Sesuai
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-sm bg-[#71c97b]" />
            Sesuai
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-sm bg-[#f0bf43]" />
            Cukup
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-sm bg-[#d9d1bf]" />
            Tidak
          </span>
        </div>
      </div>
    </div>
  )
}

function NotificationAlert({
  title,
  body,
  age,
  tone,
}: {
  title: string
  body: string
  age: string
  tone: "warning" | "success" | "info"
}) {
  const icon =
    tone === "warning" ? (
      <AlertTriangle className="size-4 text-[#da7a1d]" />
    ) : tone === "success" ? (
      <Leaf className="size-4 text-[#35724b]" />
    ) : (
      <CircleHelp className="size-4 text-[#c09120]" />
    )

  return (
    <Alert className="rounded-[14px] border-[#ecdcc8] bg-white px-3 py-2.5 shadow-none">
      {icon}
      <div className="flex w-full items-start justify-between gap-2">
        <div className="flex-1">
          <AlertTitle className="text-[11px] font-semibold text-[#30402f]">
            {title}
          </AlertTitle>
          <AlertDescription className="mt-0.5 text-[10px] leading-4 text-[#7e7669]">
            {body}
          </AlertDescription>
        </div>
        <span className="shrink-0 text-[9px] text-[#9b9285]">{age}</span>
      </div>
    </Alert>
  )
}

export function TaniLinkDashboard() {
  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_290px] xl:items-start">
      <div className="grid gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <h1 className="font-[Fraunces] text-[1.85rem] leading-[0.95] tracking-[-0.05em] text-[#1d3429] md:text-[2rem]">
              Selamat pagi, Andi Setiawan
            </h1>
            <p className="text-[13px] text-[#6c675d]">
              Ringkasan kondisi pertanian di Kab. Jombang, Jawa Timur
            </p>
          </div>
          <Button className="hidden h-9 rounded-xl bg-[#215b39] px-4 text-sm text-white shadow-sm hover:bg-[#1a4a2f] lg:inline-flex">
            Ekspor Laporan
          </Button>
        </div>

        <div className="grid items-stretch gap-3 lg:grid-cols-[1.12fr_1fr_0.78fr]">
          <Card className="flex h-full min-h-[178px] flex-col rounded-[20px] border-[#dce6d2] bg-[linear-gradient(135deg,#f8fbf3_0%,#eef5e6_100%)] shadow-sm">
            <CardHeader className={CARD_HEADER}>
              <div className="flex items-center gap-2 text-[#46633a]">
                <Leaf className="size-4" />
                <CardTitle className="text-[13px] font-semibold">
                  Skor Kesesuaian Tertinggi
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className={CARD_CONTENT}>
              <div className="space-y-1.5">
                <div className="flex items-end gap-1.5">
                  <span className="font-[Fraunces] text-[2.75rem] leading-none text-[#28432f]">
                    87
                  </span>
                  <span className="pb-0.5 text-[1.15rem] text-[#6d695f]">
                    /100
                  </span>
                </div>
                <p className="text-[0.92rem] font-medium text-[#364233]">
                  Padi Sawah
                </p>
                <ScorePill label="Sangat Sesuai" />
              </div>
            </CardContent>
          </Card>

          <Card className="flex h-full min-h-[178px] flex-col rounded-[20px] border-[#eddcc0] bg-[linear-gradient(135deg,#fffdf8_0%,#fff6e8_100%)] shadow-sm">
            <CardHeader className={CARD_HEADER}>
              <div className="flex items-center gap-2 text-[#c17c1f]">
                <TrendingUp className="size-4" />
                <CardTitle className="text-[13px] font-semibold">
                  Prediksi Kenaikan Harga
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className={CARD_CONTENT}>
              <div className="space-y-1.5">
                <div className="font-[Fraunces] text-[2.55rem] leading-none text-[#3b2c1b]">
                  +12,4%
                </div>
                <p className="text-[12px] text-[#6d6559]">
                  Rata-rata 5 komoditas utama
                </p>
                <p className="text-[12px] text-[#6d6559]">90 hari ke depan</p>
              </div>
            </CardContent>
          </Card>

          <Card className="flex h-full min-h-[178px] flex-col rounded-[20px] border-[#eadcc8] bg-[linear-gradient(180deg,#fffdfa_0%,#fff8ee_100%)] shadow-sm">
            <CardHeader className={CARD_HEADER}>
              <div className="flex items-center gap-2 text-[#7f5528]">
                <CalendarDays className="size-4" />
                <CardTitle className="text-[13px] font-semibold">
                  Rekomendasi Tanam Aktif
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className={CARD_CONTENT}>
              <div className="space-y-1">
                <div className="font-[Fraunces] text-[2.55rem] leading-none text-[#3d342b]">
                  3
                </div>
                <p className="text-[12px] text-[#6d6559]">komoditas</p>
                <p className="text-[12px] text-[#6d6559]">
                  Dalam 30 hari ke depan
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid items-stretch gap-3 xl:grid-cols-[0.92fr_1.38fr]">
          <Card className="flex h-full min-h-[344px] flex-col rounded-[20px] border-[#eadfcf] bg-white shadow-sm">
            <SectionTitle
              title="Peringkat Kesesuaian Lahan"
              description="Skor kesesuaian komoditas di lokasi Anda"
              trailing={<CircleHelp className="mt-0.5 size-4 text-[#968d80]" />}
            />
            <CardContent className={CARD_CONTENT}>
              <Table>
                <TableHeader>
                  <TableRow className="border-[#f0e7d9] hover:bg-transparent">
                    <TableHead className="px-0 text-[11px]">
                      Komoditas
                    </TableHead>
                    <TableHead className="text-[11px]">Skor (0-100)</TableHead>
                    <TableHead className="text-right text-[11px]">
                      Kelas
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suitabilityRows.map((row) => (
                    <TableRow key={row.commodity} className="border-[#f2eadf]">
                      <TableCell className="px-0 py-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="flex size-6.5 items-center justify-center rounded-full bg-[#eef3e6] text-[9px] font-semibold text-[#547048]">
                            {row.marker}
                          </span>
                          <span className="text-[12px] font-medium text-[#30402f]">
                            {row.commodity}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1.5">
                        <div className="flex items-center gap-2.5">
                          <div className="min-w-[72px] flex-1">
                            <StatBar value={row.score} />
                          </div>
                          <span className="min-w-7 text-[12px] text-[#615c53]">
                            {row.score}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1.5 text-right">
                        <ScorePill label={row.badge} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className={CARD_FOOTER}>
              <CardLink label="Lihat analisis lengkap" />
            </CardFooter>
          </Card>

          <Card className="flex h-full min-h-[344px] flex-col rounded-[20px] border-[#eadfcf] bg-white shadow-sm">
            <SectionTitle
              title="Prediksi Harga Komoditas (90 Hari) - Jawa Timur"
              trailing={<CircleHelp className="mt-0.5 size-4 text-[#968d80]" />}
            />
            <CardContent className={`${CARD_CONTENT} space-y-3`}>
              <Select defaultValue="semua">
                <SelectTrigger className="h-8 w-[145px] rounded-xl border-[#e5dacb] bg-[#fffdf8] text-[11px] shadow-none">
                  <SelectValue placeholder="Semua Komoditas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="semua">Semua Komoditas</SelectItem>
                    <SelectItem value="padi">Padi</SelectItem>
                    <SelectItem value="jagung">Jagung</SelectItem>
                    <SelectItem value="cabai">Cabai Merah</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <ForecastChart />
            </CardContent>
            <CardFooter className={`${CARD_FOOTER} text-[10px] text-[#8d8478]`}>
              <span>Interval kepercayaan 80%</span>
              <CardLink label="Lihat detail & data" />
            </CardFooter>
          </Card>
        </div>

        <div className="grid items-stretch gap-3 xl:grid-cols-[1.02fr_0.98fr]">
          <Card className="flex h-full min-h-[294px] flex-col rounded-[20px] border-[#eadfcf] bg-white shadow-sm">
            <SectionTitle
              title="Peta Wilayah & Lahan"
              description="Kab. Jombang, Jawa Timur"
              trailing={<CircleHelp className="mt-0.5 size-4 text-[#968d80]" />}
            />
            <CardContent className={CARD_CONTENT}>
              <MapPreview />
            </CardContent>
            <CardFooter className={CARD_FOOTER}>
              <CardLink label="Buka peta interaktif" />
            </CardFooter>
          </Card>

          <Card className="flex h-full min-h-[294px] flex-col rounded-[20px] border-[#eadfcf] bg-white shadow-sm">
            <SectionTitle
              title="Rekomendasi Tanam (30 Hari Ke Depan)"
              trailing={<CircleHelp className="mt-0.5 size-4 text-[#968d80]" />}
            />
            <CardContent className={CARD_CONTENT}>
              <div className="grid grid-cols-[18px_1fr] gap-2.5">
                <div className="relative flex flex-col items-center pt-2">
                  <span className="size-4 rounded-full border-[3px] border-[#5c9a59] bg-white" />
                  <span className="mt-1 h-11 w-px bg-[#dccfbf]" />
                  <span className="size-4 rounded-full border-[3px] border-[#efb33d] bg-white" />
                  <span className="mt-1 h-11 w-px bg-[#dccfbf]" />
                  <span className="size-4 rounded-full border-[3px] border-[#df7b65] bg-white" />
                  <span className="absolute bottom-0 top-2 w-px bg-[#dccfbf] -z-10" />
                </div>
                <div className="space-y-1.5">
                  {recommendations.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[14px] border border-[#efe4d3] bg-[#fffdf9] px-3 py-2"
                    >
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[10px] text-[#8d8478]">
                            {item.date}
                          </p>
                          <p className="mt-0.5 text-[12px] font-semibold text-[#2f3f2f]">
                            {item.title}
                          </p>
                        </div>
                        <ScorePill label={item.badge} />
                      </div>
                      <p className="text-[9px] leading-3.5 text-[#6d6559]">
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className={CARD_FOOTER}>
              <CardLink label="Lihat kalender tanam lengkap" />
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="grid gap-3">
        <Button className="h-9 justify-self-end rounded-xl bg-[#215b39] px-4 text-sm text-white shadow-sm hover:bg-[#1a4a2f] lg:hidden">
          Ekspor Laporan
        </Button>

        <Card className="flex min-h-[326px] flex-col rounded-[20px] border-[#eadfcf] bg-white shadow-sm">
          <SectionTitle
            title="Cuaca Saat Ini"
            description="Jombang, Jawa Timur"
          />
          <CardContent className={`${CARD_CONTENT} space-y-3`}>
            <div className="grid grid-cols-[auto_1fr] gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-full bg-[#fff4df]">
                <CloudSun className="size-4.5 text-[#d79328]" />
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2.5">
                <div>
                  <div className="font-[Fraunces] text-[2.05rem] leading-none text-[#23392d]">
                    27°C
                  </div>
                  <p className="mt-0.5 text-[12px] text-[#666156]">
                    Cerah Berawan
                  </p>
                  <p className="text-[10px] text-[#8b8173]">
                    Terasa seperti 31°C
                  </p>
                </div>
                <div className="space-y-1 text-[9px] text-[#615c53]">
                  <div className="flex items-center gap-1.5">
                    <Droplets className="size-3 text-[#2d7451]" />
                    <span>Kelembapan</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wind className="size-3 text-[#2d7451]" />
                    <span>Angin</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CloudRain className="size-3 text-[#2d7451]" />
                    <span>Curah Hujan</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <SunMedium className="size-3 text-[#de8a1c]" />
                    <span>UV Index</span>
                  </div>
                </div>
              </div>
            </div>
            <Separator className="bg-[#eee4d5]" />
            <div className="grid grid-cols-5 gap-0.5">
              {weeklyWeather.map((day) => {
                const Icon = day.icon
                return (
                  <div key={day.day} className="space-y-1 text-center">
                    <p className="text-[9px] text-[#6a6458]">{day.day}</p>
                    <Icon className="mx-auto size-4 text-[#d79328]" />
                    <p className="text-[9px] leading-3.5 text-[#6a6458]">
                      {day.high} / {day.low}
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
          <CardFooter className={CARD_FOOTER}>
            <CardLink label="Lihat prakiraan 7 hari" />
          </CardFooter>
        </Card>

        <Card className="flex min-h-[272px] flex-col rounded-[20px] border-[#eadfcf] bg-white shadow-sm">
          <SectionTitle
            title="Kondisi Tanah"
            description="Lokasi Anda"
            trailing={
              <div className="flex items-center gap-1.5 text-[10px] text-[#9a907f]">
                <CircleHelp className="size-3.5" />
                <span>18 Mei 2025</span>
              </div>
            }
          />
          <CardContent className={`${CARD_CONTENT} pb-0`}>
            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-[14px] border border-[#efe4d3] bg-[#efe4d3]">
              {soilStats.map((item) => (
                <div key={item.label} className="bg-[#fffdfa] p-2">
                  <div className="mb-1 flex items-center gap-1.5 text-[8px] text-[#6c665b]">
                    <span className="flex size-4 items-center justify-center rounded-full bg-[#f0f5eb] text-[#2d6d45]">
                      <Leaf className="size-2.5" />
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <p className="font-[Fraunces] text-[1.22rem] leading-none text-[#23392d]">
                    {item.value}
                  </p>
                  <p className="mt-0.5 text-[8px] text-[#8b8173]">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className={CARD_FOOTER}>
            <CardLink label="Lihat rekomendasi ameliorasi" />
          </CardFooter>
        </Card>

        <Card className="flex min-h-[220px] flex-col rounded-[20px] border-[#eadfcf] bg-white shadow-sm">
          <SectionTitle title="Peringatan & Informasi" />
          <CardContent className={`${CARD_CONTENT} space-y-2`}>
            {notifications.map((item) => (
              <NotificationAlert key={item.title} {...item} />
            ))}
          </CardContent>
          <CardFooter className={CARD_FOOTER}>
            <CardLink label="Lihat semua notifikasi" />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
