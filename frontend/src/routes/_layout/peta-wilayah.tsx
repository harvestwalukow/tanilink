import { createFileRoute } from "@tanstack/react-router"
import { Droplets, Layers, Leaf, MapPin, Minus, Plus, Wind } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const Route = createFileRoute("/_layout/peta-wilayah")({
  component: PetaWilayah,
  head: () => ({
    meta: [
      {
        title: "Peta & Wilayah Lahan - TaniLink",
      },
    ],
  }),
})

type DistrictKey =
  | "ploso"
  | "peterongan"
  | "kesamben"
  | "sumobito"
  | "diwek"
  | "jogoroto"
  | "gudo"
  | "tembelang"

interface DistrictData {
  name: string
  score: number
  class: "Sangat Sesuai" | "Sesuai" | "Cukup Sesuai" | "Tidak Sesuai"
  ph: string
  cOrganik: string
  nTotal: string
  p2o5: string
  k2o: string
  ktk: string
  weather: string
  temp: string
  humidity: string
  recommendations: string[]
  // Map shape configuration
  path: string
  cx: number
  cy: number
}

// Sub-districts database for Jombang
const districtsData: Record<DistrictKey, DistrictData> = {
  ploso: {
    name: "Ploso (Jombang Utara)",
    score: 85,
    class: "Sangat Sesuai",
    ph: "6.5",
    cOrganik: "1.90%",
    nTotal: "0.14%",
    p2o5: "20 ppm",
    k2o: "0.38 me/100g",
    ktk: "17.0 me/100g",
    weather: "Cerah Berawan",
    temp: "28°C",
    humidity: "72%",
    recommendations: ["Padi Sawah", "Tebu", "Sorgum"],
    path: "M 100,60 C 140,50 220,40 250,70 C 270,90 260,110 240,120 C 190,130 110,120 90,100 C 80,90 85,70 100,60 Z",
    cx: 170,
    cy: 85,
  },
  kesamben: {
    name: "Kesamben (Jombang Timur Laut)",
    score: 78,
    class: "Sesuai",
    ph: "6.2",
    cOrganik: "1.70%",
    nTotal: "0.10%",
    p2o5: "15 ppm",
    k2o: "0.32 me/100g",
    ktk: "15.0 me/100g",
    weather: "Cerah Berawan",
    temp: "27°C",
    humidity: "75%",
    recommendations: ["Jagung", "Tebu", "Kacang Tanah"],
    path: "M 250,70 C 290,50 360,60 380,90 C 400,120 380,140 340,150 C 300,160 260,150 240,120 C 260,110 270,90 250,70 Z",
    cx: 310,
    cy: 105,
  },
  tembelang: {
    name: "Tembelang (Jombang Tengah-Utara)",
    score: 80,
    class: "Sangat Sesuai",
    ph: "6.4",
    cOrganik: "1.80%",
    nTotal: "0.13%",
    p2o5: "19 ppm",
    k2o: "0.36 me/100g",
    ktk: "16.5 me/100g",
    weather: "Cerah Berawan",
    temp: "28°C",
    humidity: "73%",
    recommendations: ["Padi Sawah", "Bawang Merah", "Jagung"],
    path: "M 90,100 C 110,120 190,130 240,120 C 250,140 240,170 210,180 C 170,195 120,185 95,160 C 80,145 80,115 90,100 Z",
    cx: 165,
    cy: 145,
  },
  peterongan: {
    name: "Peterongan (Jombang Tengah-Timur)",
    score: 87,
    class: "Sangat Sesuai",
    ph: "6.4",
    cOrganik: "1.82%",
    nTotal: "0.12%",
    p2o5: "18 ppm",
    k2o: "0.35 me/100g",
    ktk: "16.2 me/100g",
    weather: "Hujan Ringan",
    temp: "26°C",
    humidity: "82%",
    recommendations: ["Padi Sawah", "Jagung", "Cabai Merah"],
    path: "M 240,120 C 260,150 300,160 340,150 C 360,180 340,210 300,220 C 260,230 220,220 210,180 C 240,170 250,140 240,120 Z",
    cx: 280,
    cy: 175,
  },
  sumobito: {
    name: "Sumobito (Jombang Timur)",
    score: 82,
    class: "Sangat Sesuai",
    ph: "6.3",
    cOrganik: "1.78%",
    nTotal: "0.11%",
    p2o5: "17 ppm",
    k2o: "0.34 me/100g",
    ktk: "15.8 me/100g",
    weather: "Berawan",
    temp: "27°C",
    humidity: "78%",
    recommendations: ["Padi Sawah", "Bawang Merah", "Cabai Merah"],
    path: "M 340,150 C 380,140 400,120 420,140 C 440,165 410,210 380,225 C 340,240 310,230 300,220 C 340,210 360,180 340,150 Z",
    cx: 370,
    cy: 185,
  },
  diwek: {
    name: "Diwek (Jombang Selatan)",
    score: 74,
    class: "Sesuai",
    ph: "6.1",
    cOrganik: "1.68%",
    nTotal: "0.10%",
    p2o5: "14 ppm",
    k2o: "0.29 me/100g",
    ktk: "14.8 me/100g",
    weather: "Cerah Berawan",
    temp: "28°C",
    humidity: "70%",
    recommendations: ["Jagung", "Kacang Hijau", "Kedelai"],
    path: "M 95,160 C 120,185 170,195 210,180 C 220,220 260,230 300,220 C 280,260 220,280 180,270 C 140,260 110,220 95,160 Z",
    cx: 200,
    cy: 230,
  },
  jogoroto: {
    name: "Jogoroto (Jombang Tengah)",
    score: 68,
    class: "Cukup Sesuai",
    ph: "5.9",
    cOrganik: "1.58%",
    nTotal: "0.09%",
    p2o5: "12 ppm",
    k2o: "0.26 me/100g",
    ktk: "14.2 me/100g",
    weather: "Hujan Sedang",
    temp: "26°C",
    humidity: "84%",
    recommendations: ["Jagung", "Kedelai", "Cabai Merah"],
    path: "M 210,180 C 220,220 180,270 140,260 C 145,230 160,200 210,180 Z",
    cx: 175,
    cy: 220,
  },
  gudo: {
    name: "Gudo (Jombang Barat Daya)",
    score: 65,
    class: "Cukup Sesuai",
    ph: "5.8",
    cOrganik: "1.52%",
    nTotal: "0.08%",
    p2o5: "10 ppm",
    k2o: "0.24 me/100g",
    ktk: "13.8 me/100g",
    weather: "Berawan",
    temp: "27°C",
    humidity: "74%",
    recommendations: ["Tebu", "Ubi Kayu", "Kacang Tanah"],
    path: "M 95,160 C 110,220 140,260 180,270 C 150,300 90,320 60,290 C 40,265 50,210 95,160 Z",
    cx: 110,
    cy: 250,
  },
}

function ScorePill({ label }: { label: string }) {
  const tone =
    label === "Sangat Sesuai"
      ? "bg-[#e5efda] text-[#4d6839] border-[#cce0b8]"
      : label === "Sesuai"
        ? "bg-[#edf1e7] text-[#56704b] border-[#d7e2cb]"
        : "bg-[#fbedd7] text-[#8f6f35] border-[#f5dbb2]"

  return (
    <Badge
      variant="outline"
      className={`rounded-md px-2 py-0.5 text-[10px] font-semibold border ${tone}`}
    >
      {label}
    </Badge>
  )
}

function PetaWilayah() {
  const [selectedLayer, setSelectedLayer] = useState("kesesuaian-padi")
  const [selectedDistrict, setSelectedDistrict] =
    useState<DistrictKey>("peterongan")
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictKey | null>(
    null,
  )
  const [zoomLevel, setZoomLevel] = useState(1)

  const handleZoom = (type: "in" | "out" | "reset") => {
    if (type === "in") setZoomLevel((prev) => Math.min(2, prev + 0.2))
    if (type === "out") setZoomLevel((prev) => Math.max(0.6, prev - 0.2))
    if (type === "reset") setZoomLevel(1)
  }

  // Helper to get color of district based on the current layer
  const getDistrictFillColor = (key: DistrictKey) => {
    const data = districtsData[key]
    const isSelected = selectedDistrict === key
    const isHovered = hoveredDistrict === key

    if (selectedLayer === "kesesuaian-padi") {
      // High score = deep green, lower = yellow/beige
      if (data.score >= 85)
        return isSelected ? "#2d6d45" : isHovered ? "#3d8558" : "#5ca876"
      if (data.score >= 75)
        return isSelected ? "#609b52" : isHovered ? "#75b366" : "#8ecd7f"
      return isSelected ? "#c8a53e" : isHovered ? "#dbc056" : "#ebd471"
    }

    if (selectedLayer === "ph-tanah") {
      const phVal = parseFloat(data.ph)
      if (phVal >= 6.4)
        return isSelected ? "#2b6cb0" : isHovered ? "#3182ce" : "#4299e1"
      if (phVal >= 6.0)
        return isSelected ? "#319795" : isHovered ? "#38b2ac" : "#4fd1c5"
      return isSelected ? "#dd6b20" : isHovered ? "#ed8936" : "#f6ad55"
    }

    if (selectedLayer === "curah-hujan") {
      // Humidity as proxy
      const humVal = parseInt(data.humidity, 10)
      if (humVal >= 80)
        return isSelected ? "#1a365d" : isHovered ? "#2a4365" : "#3182ce"
      if (humVal >= 74)
        return isSelected ? "#2b6cb0" : isHovered ? "#4299e1" : "#63b3ed"
      return isSelected ? "#ebf8ff" : isHovered ? "#bee3f8" : "#90cdf4"
    }

    return "#cbd5e0"
  }

  const activeDistrictData = districtsData[selectedDistrict]

  return (
    <div className="space-y-4">
      {/* Toolbar Layer Control */}
      <Card className="rounded-[20px] border-[#eadfcf] bg-white shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Layers className="size-4.5 text-[#8d8478]" />
            <span className="text-xs font-bold text-[#6c655a] uppercase">
              Overlay Peta:
            </span>
            <Select value={selectedLayer} onValueChange={setSelectedLayer}>
              <SelectTrigger className="h-10 w-[220px] rounded-xl border-[#d8ccb7] bg-[#f7f2e8] text-xs text-[#24473b] shadow-none data-[placeholder]:text-[#6f7d70] [&_svg]:text-[#24473b]">
                <SelectValue placeholder="Pilih Layer" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-[#d8ccb7] bg-[#fffaf2] text-[#24473b] shadow-[0_12px_30px_rgba(74,98,79,0.12)]">
                <SelectGroup>
                  <SelectItem value="kesesuaian-padi" className="rounded-xl text-[#24473b] focus:bg-[#e7efe7] focus:text-[#17352b]">
                    Kesesuaian Padi Sawah
                  </SelectItem>
                  <SelectItem value="ph-tanah" className="rounded-xl text-[#24473b] focus:bg-[#e7efe7] focus:text-[#17352b]">Kandungan pH Tanah</SelectItem>
                  <SelectItem value="curah-hujan" className="rounded-xl text-[#24473b] focus:bg-[#e7efe7] focus:text-[#17352b]">
                    Indeks Curah Hujan
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleZoom("in")}
              className="size-9 rounded-xl border-[#e5dacb] bg-[#fffdfa] shadow-none hover:bg-[#fffcf7]"
            >
              <Plus className="size-4 text-[#6c655a]" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleZoom("out")}
              className="size-9 rounded-xl border-[#e5dacb] bg-[#fffdfa] shadow-none hover:bg-[#fffcf7]"
            >
              <Minus className="size-4 text-[#6c655a]" />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleZoom("reset")}
              className="h-9 px-3 rounded-xl border-[#e5dacb] bg-[#fffdfa] text-xs font-semibold text-[#6c655a] shadow-none hover:bg-[#fffcf7]"
            >
              Reset View
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Interactive Map & Details layout */}
      <div className="grid gap-4 lg:grid-cols-12 xl:grid-cols-10">
        {/* Map Canvas (7 Columns) */}
        <Card className="lg:col-span-7 xl:col-span-6 rounded-[20px] border-[#eadfcf] bg-white shadow-sm overflow-hidden flex flex-col justify-between min-h-[460px]">
          <CardContent className="p-4 flex-1 flex items-center justify-center relative bg-[radial-gradient(circle_at_50%_50%,_#fffdfb_0%,_#fbf7ed_100%)]">
            <div
              className="w-full max-w-[500px] transition-transform duration-300 origin-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <svg
                viewBox="0 0 500 360"
                className="w-full h-auto drop-shadow-xl"
              >
                <title>Peta Interaktif Kabupaten Jombang</title>
                {/* Background water/river lines for aesthetic detail */}
                <path
                  d="M -20,200 C 100,210 200,180 300,240 C 400,280 450,220 520,240"
                  fill="none"
                  stroke="#e0eef5"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                <path
                  d="M 150,-20 C 130,80 180,180 140,260 C 110,320 80,380 90,400"
                  fill="none"
                  stroke="#e0eef5"
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.5"
                />

                {/* Subdistricts (Kecamatan) shapes */}
                {(Object.keys(districtsData) as DistrictKey[]).map((key) => {
                  const data = districtsData[key]
                  const isSelected = selectedDistrict === key

                  return (
                    /* biome-ignore lint/a11y/useSemanticElements: SVG groups must remain g elements for vector layout */
                    <g
                      key={key}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedDistrict(key)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setSelectedDistrict(key)
                        }
                      }}
                      onMouseEnter={() => setHoveredDistrict(key)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                      className="cursor-pointer group focus:outline-none"
                    >
                      {/* Polygon path */}
                      <path
                        d={data.path}
                        fill={getDistrictFillColor(key)}
                        stroke={isSelected ? "#163127" : "#fffefc"}
                        strokeWidth={isSelected ? "2.5" : "1.5"}
                        className="transition-all duration-300 hover:opacity-90"
                      />

                      {/* Sub-district Pin & Name */}
                      <g transform={`translate(${data.cx}, ${data.cy})`}>
                        <circle r="3" fill="#ffffff" opacity="0.8" />
                        <text
                          y="-8"
                          textAnchor="middle"
                          className="text-[8px] font-bold fill-[#23392d] select-none opacity-80 group-hover:opacity-100 bg-white/70"
                          style={{ textShadow: "1px 1px 1px #ffffff" }}
                        >
                          {data.name.split(" ")[0]}
                        </text>
                      </g>
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Custom Map Floating Legend */}
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm p-2 rounded-xl border border-[#eadfcf] text-[9px] text-[#6f6659] space-y-1 shadow-sm max-w-[150px]">
              <div className="font-bold text-[#30402f] border-b border-[#f2eadf] pb-0.5 mb-1.5 uppercase tracking-wider">
                Legenda (
                {selectedLayer === "kesesuaian-padi"
                  ? "Padi"
                  : selectedLayer === "ph-tanah"
                    ? "pH"
                    : "Hujan"}
                )
              </div>
              {selectedLayer === "kesesuaian-padi" ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded bg-[#2d6d45]" />
                    <span>Sangat Sesuai (&ge;80)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded bg-[#8ecd7f]" />
                    <span>Sesuai (70-79)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded bg-[#ebd471]" />
                    <span>Cukup Sesuai (50-69)</span>
                  </div>
                </>
              ) : selectedLayer === "ph-tanah" ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded bg-[#2b6cb0]" />
                    <span>Netral (&ge;6.4)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded bg-[#319795]" />
                    <span>Agak Masam (6.0-6.3)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded bg-[#dd6b20]" />
                    <span>Masam (&lt;6.0)</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded bg-[#1a365d]" />
                    <span>Tinggi (Kelembapan &ge;80)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded bg-[#4299e1]" />
                    <span>Sedang (74-79)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded bg-[#bee3f8]" />
                    <span>Rendah (&lt;74)</span>
                  </div>
                </>
              )}
            </div>

            {/* Map Hover Tooltip Overlay */}
            {hoveredDistrict && (
              <div
                className="absolute z-10 bg-[#fffdfb]/95 border border-[#eadfcf] rounded-xl p-2.5 shadow-lg text-xs"
                style={{ right: "4%", top: "4%" }}
              >
                <div className="font-bold text-[#163127]">
                  {districtsData[hoveredDistrict].name}
                </div>
                <div className="text-[10px] text-[#8d8478] mt-0.5">
                  Skor:{" "}
                  <span className="font-bold text-[#163127]">
                    {districtsData[hoveredDistrict].score}
                  </span>{" "}
                  | pH:{" "}
                  <span className="font-bold text-[#163127]">
                    {districtsData[hoveredDistrict].ph}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Region Information Sidebar (5 Columns) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-3">
          <Card className="rounded-[20px] border-[#eadfcf] bg-[#fffdf7] shadow-sm flex-1 flex flex-col justify-between">
            <CardHeader className="px-4.5 pb-2 pt-3 border-b border-[#f2eadf]">
              <div className="flex items-center gap-2 text-[#2d6d45]">
                <MapPin className="size-4" />
                <CardTitle className="text-[13px] font-semibold uppercase tracking-wider">
                  Detail Analisa Wilayah
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4 flex-1">
              <div>
                <h3 className="font-[Fraunces] text-lg font-bold text-[#1d3429] leading-tight">
                  Kec. {activeDistrictData.name}
                </h3>
                <p className="text-[10px] text-[#8d8478] mt-0.5">
                  Kab. Jombang, Jawa Timur
                </p>
              </div>

              {/* Suitability score bar */}
              <div className="space-y-1.5 bg-[#fbf8f2] border border-[#efe6d8] p-3 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#6c655a]">
                    Skor Indeks Kesesuaian
                  </span>
                  <ScorePill label={activeDistrictData.class} />
                </div>
                <div className="flex items-end gap-2">
                  <span className="font-[Fraunces] text-2.5xl font-bold text-[#1d3429] leading-none">
                    {activeDistrictData.score}
                  </span>
                  <span className="text-xs text-[#8d8478] pb-1">/100</span>
                </div>
              </div>

              {/* Climate and Weather Card */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#fffdfa] border border-[#efe6db] p-2 rounded-xl flex items-center gap-2">
                  <Wind className="size-4 text-[#d18a2f]" />
                  <div>
                    <div className="text-[9px] text-[#8d8478]">
                      Suhu Rata-rata
                    </div>
                    <div className="font-bold text-[#163127]">
                      {activeDistrictData.temp}
                    </div>
                  </div>
                </div>
                <div className="bg-[#fffdfa] border border-[#efe6db] p-2 rounded-xl flex items-center gap-2">
                  <Droplets className="size-4 text-[#4299e1]" />
                  <div>
                    <div className="text-[9px] text-[#8d8478]">
                      Kelembapan Udara
                    </div>
                    <div className="font-bold text-[#163127]">
                      {activeDistrictData.humidity}
                    </div>
                  </div>
                </div>
              </div>

              {/* Soil Composition Statistics Grid */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-[#8d8478] uppercase tracking-wider">
                  Unsur Hara Tanah
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="bg-[#fffdfa] border border-[#efe6db] p-1.5 rounded-xl">
                    <div className="text-[8px] text-[#8d8478]">pH H2O</div>
                    <div className="text-[13px] font-bold text-[#163127] mt-0.5">
                      {activeDistrictData.ph}
                    </div>
                  </div>
                  <div className="bg-[#fffdfa] border border-[#efe6db] p-1.5 rounded-xl">
                    <div className="text-[8px] text-[#8d8478]">C-Organik</div>
                    <div className="text-[13px] font-bold text-[#163127] mt-0.5">
                      {activeDistrictData.cOrganik}
                    </div>
                  </div>
                  <div className="bg-[#fffdfa] border border-[#efe6db] p-1.5 rounded-xl">
                    <div className="text-[8px] text-[#8d8478]">N-Total</div>
                    <div className="text-[13px] font-bold text-[#163127] mt-0.5">
                      {activeDistrictData.nTotal}
                    </div>
                  </div>
                  <div className="bg-[#fffdfa] border border-[#efe6db] p-1.5 rounded-xl">
                    <div className="text-[8px] text-[#8d8478]">P2O5</div>
                    <div className="text-[13px] font-bold text-[#163127] mt-0.5">
                      {activeDistrictData.p2o5}
                    </div>
                  </div>
                  <div className="bg-[#fffdfa] border border-[#efe6db] p-1.5 rounded-xl">
                    <div className="text-[8px] text-[#8d8478]">K2O</div>
                    <div className="text-[13px] font-bold text-[#163127] mt-0.5">
                      {activeDistrictData.k2o}
                    </div>
                  </div>
                  <div className="bg-[#fffdfa] border border-[#efe6db] p-1.5 rounded-xl">
                    <div className="text-[8px] text-[#8d8478]">KTK</div>
                    <div className="text-[13px] font-bold text-[#163127] mt-0.5">
                      {activeDistrictData.ktk}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-[#8d8478] uppercase tracking-wider">
                  Rekomendasi Utama Komoditas
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeDistrictData.recommendations.map((rec) => (
                    <Badge
                      key={rec}
                      variant="secondary"
                      className="rounded-lg bg-[#e5efe9] text-[#2d6d45] border-0 text-[10px] py-1 px-2.5 font-bold flex items-center gap-1.5"
                    >
                      <Leaf className="size-3" />
                      <span>{rec}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
