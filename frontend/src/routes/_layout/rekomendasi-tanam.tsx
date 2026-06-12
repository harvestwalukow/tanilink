import { createFileRoute } from "@tanstack/react-router"
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Droplets,
  Leaf,
  Sliders,
  Sprout,
} from "lucide-react"
import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const Route = createFileRoute("/_layout/rekomendasi-tanam")({
  component: RekomendasiTanam,
  head: () => ({
    meta: [
      {
        title: "Rekomendasi Kalender Tanam - TaniLink",
      },
    ],
  }),
})

interface CropEvent {
  id: string
  title: string
  commodity: string
  startDay: number
  endDay: number
  month: number // 0-indexed (4 = Mei)
  year: number
  class: string
  color: string
  bg: string
  border: string
  details: {
    description: string
    soilPrep: string
    watering: string
    fertilizing: string
    harvestPeriod: string
  }
}

const cropEvents: CropEvent[] = [
  {
    id: "padi-mt2",
    title: "Padi Sawah (MT II)",
    commodity: "Padi Sawah",
    startDay: 20,
    endDay: 30,
    month: 4, // Mei
    year: 2025,
    class: "Sangat Sesuai",
    color: "text-[#4d6839]",
    bg: "bg-[#e5efda]",
    border: "border-[#cce0b8]",
    details: {
      description:
        "Penanaman Musim Tanam II padi sawah lokal. Sangat optimal karena pasokan air dari irigasi primer stabil dan curah hujan harian masih mencukupi.",
      soilPrep:
        "Pembajakan tanah sedalam 15-20cm, penggaruan hingga melumpur sempurna, pendiaman lahan selama 7-10 hari untuk menekan gas organik beracun.",
      watering:
        "Pertahankan genangan air setinggi 2-5cm pasca tanam bibit selama fase awal vegetatif. Keringkan berkala untuk merangsang anakan produktif.",
      fertilizing:
        "Pupuk urea dasar 100 kg/ha ditambah NPK Phonska 150 kg/ha saat penyiapan lahan atau H-3 tanam.",
      harvestPeriod:
        "Pertengahan September 2025 (sekitar 110-115 Hari Setelah Tanam)",
    },
  },
  {
    id: "jagung-kemarau",
    title: "Jagung (Musim Kemarau)",
    commodity: "Jagung",
    startDay: 25,
    endDay: 31, // Ends early June (handled in logic)
    month: 4, // Mei
    year: 2025,
    class: "Sesuai",
    color: "text-[#8f6f35]",
    bg: "bg-[#fbedd7]",
    border: "border-[#f5dbb2]",
    details: {
      description:
        "Sangat direkomendasikan untuk lahan kering dan tegalan di musim kemarau karena kebutuhan air jagung hibrida jauh lebih rendah dibanding padi sawah.",
      soilPrep:
        "Gemburkan tanah tegalan secara intensif, buat bedengan drainase setinggi 15cm dengan jarak antar guludan 70-75cm untuk cegah genangan air hujan sisa.",
      watering:
        "Penyiraman berkala 5-7 hari sekali terutama pada fase kritis pembungaan dan pengisian biji. Hindari genangan air parit.",
      fertilizing:
        "NPK 15-15-15 sebanyak 200 kg/ha dan Urea 100 kg/ha secara tugal di samping lubang tanam (jarak 7cm dari batang).",
      harvestPeriod: "Awal September 2025 (sekitar 100 Hari Setelah Tanam)",
    },
  },
  {
    id: "cabai-merah",
    title: "Cabai Merah",
    commodity: "Cabai Merah",
    startDay: 1,
    endDay: 12,
    month: 5, // Juni
    year: 2025,
    class: "Cukup Sesuai",
    color: "text-[#9b2c2c]",
    bg: "bg-[#fde2e2]",
    border: "border-[#fbc4c4]",
    details: {
      description:
        "Penanaman cabai merah besar varietas lokal unggul. Gunakan mulsa plastik perak-hitam untuk mengontrol kelembapan tanah dan menekan gulma pengganggu.",
      soilPrep:
        "Pemberian kompos matang 2 ton/ha dan kapur dolomit 1 ton/ha jika pH tanah di bawah 6.0. Buat bedengan setinggi 30-40cm.",
      watering:
        "Gunakan penyiraman gembor atau irigasi tetes 2 kali sehari pada fase awal tanam, kurangi jika memasuki masa pembungaan.",
      fertilizing:
        "Pupuk dasar SP-36 150 kg/ha, pemupukan kocor NPK mutiara 16-16-16 terlarut setiap 10 hari pasca tanam.",
      harvestPeriod:
        "November 2025 (Panen bertahap 10-15 kali mulai umur 80 HST)",
    },
  },
  {
    id: "bawang-merah",
    title: "Bawang Merah",
    commodity: "Bawang Merah",
    startDay: 10,
    endDay: 22,
    month: 5, // Juni
    year: 2025,
    class: "Cukup Sesuai",
    color: "text-[#6b358f]",
    bg: "bg-[#f3e9fd]",
    border: "border-[#e5cbfd]",
    details: {
      description:
        "Bawang merah varietas Tajuk. Memerlukan tanah gembur berpasir dengan sistem drainase parit got pembuangan air yang dalam untuk cegah busuk umbi.",
      soilPrep:
        "Cangkul lahan sedalam 30cm, bedengan lebar 1.2m dengan parit drainase dalam 40-50cm di sekeliling bedengan.",
      watering:
        "Memerlukan penyiraman rutin harian pagi dan sore di masa awal tanam, dikurangi menjadi pagi saja setelah tanaman berumur 30 hari.",
      fertilizing:
        "Pupuk dasar SP-36 150 kg/ha, dilanjutkan pemupukan urea susulan pada umur 15 HST dan NPK susulan pada umur 30 HST.",
      harvestPeriod:
        "Agustus 2025 (umur panen singkat 55-60 Hari Setelah Tanam)",
    },
  },
]

function RekomendasiTanam() {
  const [selectedMonth, setSelectedMonth] = useState(4) // Mei
  const [selectedYear, setSelectedYear] = useState(2025) // 2025 based on mockup dates
  const [selectedCommodity, setSelectedCommodity] = useState("all")
  const [selectedEvent, setSelectedEvent] = useState<CropEvent | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ]

  // Filtered events based on commodity
  const filteredEvents = useMemo(() => {
    return cropEvents.filter((event) => {
      const matchComm =
        selectedCommodity === "all" || event.commodity === selectedCommodity
      return matchComm
    })
  }, [selectedCommodity])

  // Helper to generate Gregorian monthly layout
  const getDaysInMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1)
    const firstDayIndex = firstDay.getDay() // 0 = Sun, 1 = Mon...

    // Shift index to start week on Monday (0 = Mon, 6 = Sun)
    const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1

    const totalDays = new Date(year, month + 1, 0).getDate()

    const daysGrid = []

    // Fill previous month empty pads
    for (let i = 0; i < offset; i++) {
      daysGrid.push(null)
    }

    // Fill current month days
    for (let i = 1; i <= totalDays; i++) {
      daysGrid.push(i)
    }

    return daysGrid
  }

  const daysGrid = getDaysInMonth(selectedMonth, selectedYear)

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11)
      setSelectedYear((prev) => prev - 1)
    } else {
      setSelectedMonth((prev) => prev - 1)
    }
  }

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0)
      setSelectedYear((prev) => prev + 1)
    } else {
      setSelectedMonth((prev) => prev + 1)
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Card className="rounded-[20px] border-[#eadfcf] bg-white shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Month Navigator */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevMonth}
              className="size-9 rounded-xl border-[#e5dacb] bg-[#fffdfa] shadow-none hover:bg-[#fffcf7]"
            >
              <ChevronLeft className="size-4 text-[#6c655a]" />
            </Button>
            <div className="flex items-center gap-1.5 min-w-[140px] justify-center">
              <CalendarIcon className="size-4 text-[#8d8478]" />
              <span className="text-sm font-bold text-[#163127]">
                {monthNames[selectedMonth]} {selectedYear}
              </span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
              className="size-9 rounded-xl border-[#e5dacb] bg-[#fffdfa] shadow-none hover:bg-[#fffcf7]"
            >
              <ChevronRight className="size-4 text-[#6c655a]" />
            </Button>
          </div>

          {/* Filter options */}
          <div className="flex items-center gap-2">
            <Sliders className="size-4 text-[#8d8478] hidden sm:block" />
            <Select
              value={selectedCommodity}
              onValueChange={setSelectedCommodity}
            >
              <SelectTrigger className="h-10 w-[180px] rounded-xl border-[#d8ccb7] bg-[#f7f2e8] text-xs text-[#24473b] shadow-none data-[placeholder]:text-[#6f7d70] [&_svg]:text-[#24473b]">
                <SelectValue placeholder="Pilih Komoditas" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-[#d8ccb7] bg-[#fffaf2] text-[#24473b] shadow-[0_12px_30px_rgba(74,98,79,0.12)]">
                <SelectGroup>
                  <SelectItem value="all" className="rounded-xl text-[#24473b] focus:bg-[#e7efe7] focus:text-[#17352b]">Semua Komoditas</SelectItem>
                  <SelectItem value="Padi Sawah" className="rounded-xl text-[#24473b] focus:bg-[#e7efe7] focus:text-[#17352b]">Padi Sawah</SelectItem>
                  <SelectItem value="Jagung" className="rounded-xl text-[#24473b] focus:bg-[#e7efe7] focus:text-[#17352b]">Jagung</SelectItem>
                  <SelectItem value="Cabai Merah" className="rounded-xl text-[#24473b] focus:bg-[#e7efe7] focus:text-[#17352b]">Cabai Merah</SelectItem>
                  <SelectItem value="Bawang Merah" className="rounded-xl text-[#24473b] focus:bg-[#e7efe7] focus:text-[#17352b]">Bawang Merah</SelectItem>
                  <SelectItem value="Tebu" className="rounded-xl text-[#24473b] focus:bg-[#e7efe7] focus:text-[#17352b]">Tebu</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Calendar Grid */}
      <Card className="rounded-[20px] border-[#eadfcf] bg-white shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {/* Day Names Grid */}
          <div className="grid grid-cols-7 border-b border-[#f2eadf] bg-[#fffbf4] text-center py-2.5">
            {[
              "Senin",
              "Selasa",
              "Rabu",
              "Kamis",
              "Jumat",
              "Sabtu",
              "Minggu",
            ].map((day) => (
              <span key={day} className="text-xs font-bold text-[#6a6458]">
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-px bg-[#efe4d3]">
            {daysGrid.map((day, idx) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="min-h-[105px] bg-[#faf8f4] p-2 text-[10px] text-gray-300"
                  />
                )
              }

              // Filter events that fall on this day
              const dayEvents = filteredEvents.filter((event) => {
                const sameMonth = event.month === selectedMonth
                const sameYear = event.year === selectedYear
                const dayMatch = day >= event.startDay && day <= event.endDay
                return sameMonth && sameYear && dayMatch
              })

              return (
                <div
                  key={day}
                  className="min-h-[105px] bg-white p-2 flex flex-col justify-between hover:bg-[#fffefc] transition-colors"
                >
                  {/* Day Number */}
                  <span className="text-xs font-bold text-[#4c4840]">
                    {day}
                  </span>

                  {/* Day events badges container */}
                  <div className="space-y-1 mt-1.5 flex-1 flex flex-col justify-end">
                    {dayEvents.map((event) => (
                      <button
                        type="button"
                        key={event.id}
                        onClick={() => {
                          setSelectedEvent(event)
                          setIsDialogOpen(true)
                        }}
                        className={`w-full text-left truncate text-[9px] font-bold py-1 px-1.5 rounded-[6px] border border-solid tracking-tight transition-transform active:scale-95 ${event.bg} ${event.color} ${event.border}`}
                      >
                        {event.title.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Crop details Dialog popup modal */}
      {selectedEvent && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-[480px] rounded-[24px] border-[#eadfcf] bg-[#fffdfb] p-6 shadow-2xl">
            <DialogHeader className="space-y-1">
              <div className="flex items-center gap-2 text-[#2d6d45] mb-1">
                <Sprout className="size-5" />
                <Badge
                  variant="outline"
                  className={`rounded-md px-2 py-0.5 text-[10px] font-semibold border ${selectedEvent.color} ${selectedEvent.bg} ${selectedEvent.border}`}
                >
                  {selectedEvent.class}
                </Badge>
              </div>
              <DialogTitle className="font-[Fraunces] text-xl text-[#1d3429] tracking-tight">
                Instruksi Budidaya: {selectedEvent.title}
              </DialogTitle>
              <DialogDescription className="text-[11px] text-[#6c655a] leading-relaxed">
                {selectedEvent.details.description}
              </DialogDescription>
            </DialogHeader>

            {/* Event crop instructions details */}
            <div className="space-y-3 pt-3 border-t border-[#f2eadf]">
              <div className="grid grid-cols-[20px_1fr] gap-2.5">
                <div className="size-5 rounded-full bg-[#fbf5e6] flex items-center justify-center text-[#d18a2f]">
                  <Leaf className="size-3" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-[#1d3429]">
                    1. Pengolahan Lahan dasar
                  </h4>
                  <p className="text-[10px] text-[#6c655a] leading-normal mt-0.5">
                    {selectedEvent.details.soilPrep}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-[20px_1fr] gap-2.5">
                <div className="size-5 rounded-full bg-[#e6effb] flex items-center justify-center text-[#4299e1]">
                  <Droplets className="size-3" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-[#1d3429]">
                    2. Kebutuhan Pengairan & Air
                  </h4>
                  <p className="text-[10px] text-[#6c655a] leading-normal mt-0.5">
                    {selectedEvent.details.watering}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-[20px_1fr] gap-2.5">
                <div className="size-5 rounded-full bg-[#f3e9fd] flex items-center justify-center text-[#8f64d8]">
                  <Sliders className="size-3" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-[#1d3429]">
                    3. Dosis & Jadwal Pemupukan
                  </h4>
                  <p className="text-[10px] text-[#6c655a] leading-normal mt-0.5">
                    {selectedEvent.details.fertilizing}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-[20px_1fr] gap-2.5">
                <div className="size-5 rounded-full bg-[#e5efda] flex items-center justify-center text-[#4d6839]">
                  <Clock className="size-3" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-[#1d3429]">
                    4. Proyeksi Masa Panen
                  </h4>
                  <p className="text-[10px] text-[#6c655a] leading-normal mt-0.5">
                    {selectedEvent.details.harvestPeriod}
                  </p>
                </div>
              </div>
            </div>

            {/* Close action */}
            <div className="mt-4 pt-3 border-t border-[#f2eadf] flex justify-end">
              <DialogClose asChild>
                <Button className="h-9 px-4 rounded-xl bg-primary text-xs font-semibold text-white shadow-sm hover:bg-[#24473b]">
                  Tutup Panduan
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
