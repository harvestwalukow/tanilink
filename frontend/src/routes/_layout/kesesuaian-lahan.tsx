import { createFileRoute } from "@tanstack/react-router"
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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

export const Route = createFileRoute("/_layout/kesesuaian-lahan")({
  component: KesesuaianLahan,
  head: () => ({
    meta: [
      {
        title: "Kesesuaian Lahan - TaniLink",
      },
    ],
  }),
})

const initialSuitabilityData = [
  {
    commodity: "Padi Sawah",
    score: 87,
    class: "Sangat Sesuai",
    ph: "6.4",
    cOrganik: "1.82%",
    nTotal: "0.12%",
    p2o5: "18 ppm",
    k2o: "0.35 me/100g",
    ktk: "16.2 me/100g",
  },
  {
    commodity: "Jagung",
    score: 74,
    class: "Sesuai",
    ph: "6.2",
    cOrganik: "1.75%",
    nTotal: "0.10%",
    p2o5: "15 ppm",
    k2o: "0.30 me/100g",
    ktk: "15.0 me/100g",
  },
  {
    commodity: "Cabai Merah",
    score: 68,
    class: "Cukup Sesuai",
    ph: "6.0",
    cOrganik: "1.60%",
    nTotal: "0.09%",
    p2o5: "12 ppm",
    k2o: "0.28 me/100g",
    ktk: "14.5 me/100g",
  },
  {
    commodity: "Bawang Merah",
    score: 61,
    class: "Cukup Sesuai",
    ph: "5.8",
    cOrganik: "1.55%",
    nTotal: "0.08%",
    p2o5: "10 ppm",
    k2o: "0.25 me/100g",
    ktk: "13.8 me/100g",
  },
  {
    commodity: "Tebu",
    score: 58,
    class: "Cukup Sesuai",
    ph: "6.5",
    cOrganik: "1.90%",
    nTotal: "0.15%",
    p2o5: "20 ppm",
    k2o: "0.40 me/100g",
    ktk: "17.0 me/100g",
  },
  {
    commodity: "Kedelai",
    score: 52,
    class: "Cukup Sesuai",
    ph: "6.1",
    cOrganik: "1.70%",
    nTotal: "0.11%",
    p2o5: "14 ppm",
    k2o: "0.32 me/100g",
    ktk: "14.8 me/100g",
  },
  {
    commodity: "Kacang Tanah",
    score: 49,
    class: "Cukup Sesuai",
    ph: "5.9",
    cOrganik: "1.65%",
    nTotal: "0.08%",
    p2o5: "11 ppm",
    k2o: "0.26 me/100g",
    ktk: "14.0 me/100g",
  },
  {
    commodity: "Ubi Kayu",
    score: 45,
    class: "Tidak Sesuai",
    ph: "5.5",
    cOrganik: "1.40%",
    nTotal: "0.07%",
    p2o5: "8 ppm",
    k2o: "0.22 me/100g",
    ktk: "12.0 me/100g",
  },
  {
    commodity: "Kelapa Sawit",
    score: 35,
    class: "Tidak Sesuai",
    ph: "5.0",
    cOrganik: "1.20%",
    nTotal: "0.05%",
    p2o5: "5 ppm",
    k2o: "0.18 me/100g",
    ktk: "10.5 me/100g",
  },
  {
    commodity: "Kacang Hijau",
    score: 55,
    class: "Cukup Sesuai",
    ph: "6.0",
    cOrganik: "1.50%",
    nTotal: "0.09%",
    p2o5: "13 ppm",
    k2o: "0.27 me/100g",
    ktk: "14.2 me/100g",
  },
  {
    commodity: "Sorgum",
    score: 71,
    class: "Sesuai",
    ph: "6.3",
    cOrganik: "1.72%",
    nTotal: "0.11%",
    p2o5: "16 ppm",
    k2o: "0.31 me/100g",
    ktk: "15.5 me/100g",
  },
  {
    commodity: "Kentang",
    score: 40,
    class: "Tidak Sesuai",
    ph: "5.6",
    cOrganik: "1.45%",
    nTotal: "0.08%",
    p2o5: "9 ppm",
    k2o: "0.23 me/100g",
    ktk: "12.5 me/100g",
  },
]

function StatBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-[#ece4d8]">
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
      ? "bg-[#e5efda] text-[#4d6839] border-[#cce0b8]"
      : label === "Sesuai"
        ? "bg-[#edf1e7] text-[#56704b] border-[#d7e2cb]"
        : label === "Cukup Sesuai"
          ? "bg-[#fbedd7] text-[#8f6f35] border-[#f5dbb2]"
          : "bg-[#fde2e2] text-[#9b2c2c] border-[#fbc4c4]"

  return (
    <Badge
      variant="outline"
      className={`rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide border ${tone}`}
    >
      {label}
    </Badge>
  )
}

function KesesuaianLahan() {
  const [search, setSearch] = useState("")
  const [classFilter, setClassFilter] = useState("all")
  const [sortBy, setSortBy] = useState("skor-desc")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 4, 18)) // 18 Mei 2025 matches mockup data date
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const calendarRef = useRef<HTMLDivElement>(null)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Calendar month state
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(4) // Mei
  const [currentCalendarYear, setCurrentCalendarYear] = useState(2025)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleDownloadCSV = () => {
    const headers = [
      "Komoditas",
      "Skor Kesesuaian",
      "Kelas",
      "pH H2O",
      "C-Organik",
      "N-Total",
      "P2O5",
      "K2O",
      "KTK",
    ]
    const rows = filteredData.map((d) => [
      d.commodity,
      d.score,
      d.class,
      d.ph,
      d.cOrganik,
      d.nTotal,
      d.p2o5,
      d.k2o,
      d.ktk,
    ])
    const csvContent = `\uFEFF${[headers.join(","), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(","))].join("\n")}`
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    const dateStr = selectedDate.toISOString().split("T")[0]
    link.setAttribute("download", `Kesesuaian_Lahan_Jombang_${dateStr}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("File CSV berhasil diunduh!")
  }

  // Filter & Sort Logic
  const filteredData = initialSuitabilityData
    .filter((row) => {
      const matchSearch = row.commodity
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchClass =
        classFilter === "all" ? true : row.class === classFilter
      return matchSearch && matchClass
    })
    .sort((a, b) => {
      if (sortBy === "skor-desc") return b.score - a.score
      if (sortBy === "skor-asc") return a.score - b.score
      if (sortBy === "name-asc") return a.commodity.localeCompare(b.commodity)
      if (sortBy === "name-desc") return b.commodity.localeCompare(a.commodity)
      return 0
    })

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Generate Calendar Days (Simplified helper for calendar display)
  const getDaysInMonth = (month: number, year: number) => {
    const date = new Date(year, month, 1)
    const days = []
    const firstDayIndex = date.getDay() // 0 = Sun, 1 = Mon...

    // Add offset spaces for empty days before month start
    const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1 // Start week on Mon
    for (let i = 0; i < offset; i++) {
      days.push(null)
    }

    const numDays = new Date(year, month + 1, 0).getDate()
    for (let i = 1; i <= numDays; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

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

  const calendarDays = getDaysInMonth(currentCalendarMonth, currentCalendarYear)

  const changeMonth = (direction: number) => {
    let nextMonth = currentCalendarMonth + direction
    let nextYear = currentCalendarYear
    if (nextMonth < 0) {
      nextMonth = 11
      nextYear -= 1
    } else if (nextMonth > 11) {
      nextMonth = 0
      nextYear += 1
    }
    setCurrentCalendarMonth(nextMonth)
    setCurrentCalendarYear(nextYear)
  }

  return (
    <div className="space-y-4">
      {/* Advanced Toolbar */}
      <Card className="rounded-[20px] border-[#eadfcf] bg-white shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative min-w-[200px] flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8d8478]" />
              <Input
                placeholder="Cari komoditas..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-9 h-10 rounded-xl border-[#e3d7c6] text-sm text-[#163127] shadow-none bg-[#fffdfa]"
              />
            </div>

            {/* Class Filter */}
            <Select
              value={classFilter}
              onValueChange={(val) => {
                setClassFilter(val)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="h-10 w-[160px] rounded-xl border-[#d8ccb7] bg-[#f7f2e8] text-xs text-[#24473b] shadow-none data-[placeholder]:text-[#6f7d70] [&_svg]:text-[#24473b]">
                <SelectValue placeholder="Pilih Kelas" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-[#d8ccb7] bg-[#fffaf2] text-[#24473b] shadow-[0_12px_30px_rgba(74,98,79,0.12)]">
                <SelectGroup>
                  <SelectItem value="all" className="rounded-xl text-[#24473b] focus:bg-[#e7efe7] focus:text-[#17352b]">Semua Kelas</SelectItem>
                  <SelectItem value="Sangat Sesuai" className="rounded-xl text-[#24473b] focus:bg-[#e7efe7] focus:text-[#17352b]">Sangat Sesuai</SelectItem>
                  <SelectItem value="Sesuai" className="rounded-xl text-[#24473b] focus:bg-[#e7efe7] focus:text-[#17352b]">Sesuai</SelectItem>
                  <SelectItem value="Cukup Sesuai" className="rounded-xl text-[#24473b] focus:bg-[#e7efe7] focus:text-[#17352b]">Cukup Sesuai</SelectItem>
                  <SelectItem value="Tidak Sesuai" className="rounded-xl text-[#24473b] focus:bg-[#e7efe7] focus:text-[#17352b]">Tidak Sesuai</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Sorting */}
            <Select
              value={sortBy}
              onValueChange={(val) => {
                setSortBy(val)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="h-10 w-[180px] rounded-xl border-[#d8ccb7] bg-[#f7f2e8] text-xs text-[#24473b] shadow-none data-[placeholder]:text-[#6f7d70] [&_svg]:text-[#24473b]">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-[#d8ccb7] bg-[#fffaf2] text-[#24473b] shadow-[0_12px_30px_rgba(74,98,79,0.12)]">
                <SelectGroup>
                  <SelectItem value="skor-desc" className="rounded-xl text-[#24473b] focus:bg-[#e7efe7] focus:text-[#17352b]">Skor Tertinggi</SelectItem>
                  <SelectItem value="skor-asc" className="rounded-xl text-[#24473b] focus:bg-[#e7efe7] focus:text-[#17352b]">Skor Terendah</SelectItem>
                  <SelectItem value="name-asc" className="rounded-xl text-[#24473b] focus:bg-[#e7efe7] focus:text-[#17352b]">Nama A - Z</SelectItem>
                  <SelectItem value="name-desc" className="rounded-xl text-[#24473b] focus:bg-[#e7efe7] focus:text-[#17352b]">Nama Z - A</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Custom Calendar Date Picker */}
            <div className="relative" ref={calendarRef}>
              <Button
                variant="outline"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="h-10 gap-2 px-3 rounded-xl border-[#e5dacb] bg-[#fffdfa] text-xs font-normal text-[#6c655a] shadow-none hover:bg-[#fffcf7]"
              >
                <CalendarIcon className="size-4 text-[#8a806f]" />
                <span>
                  {selectedDate.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </Button>
              {isCalendarOpen && (
                <div className="absolute left-0 mt-2 z-20 w-[280px] bg-white rounded-2xl border border-[#eadfcf] shadow-xl p-3">
                  <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#f2eadf]">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 rounded-lg text-[#6c655a] hover:bg-[#faf6ee]"
                      onClick={() => changeMonth(-1)}
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <span className="text-xs font-bold text-[#163127]">
                      {monthNames[currentCalendarMonth]} {currentCalendarYear}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 rounded-lg text-[#6c655a] hover:bg-[#faf6ee]"
                      onClick={() => changeMonth(1)}
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-1">
                    {["Sn", "Sl", "Rb", "Km", "Jm", "Sb", "Mg"].map((day) => (
                      <span
                        key={day}
                        className="text-[9px] font-bold text-[#8d8478]"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, idx) => {
                      if (!day) return <div key={`empty-${idx}`} />
                      const isSelected =
                        selectedDate.getDate() === day.getDate() &&
                        selectedDate.getMonth() === day.getMonth() &&
                        selectedDate.getFullYear() === day.getFullYear()
                      const isToday =
                        new Date().toDateString() === day.toDateString()

                      return (
                        <button
                          type="button"
                          key={day.toISOString()}
                          onClick={() => {
                            setSelectedDate(day)
                            setIsCalendarOpen(false)
                            toast.info(
                              `Menampilkan data untuk tanggal: ${day.toLocaleDateString("id-ID")}`,
                            )
                          }}
                          className={`size-7 rounded-lg text-[10px] font-medium flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-primary text-primary-foreground font-bold"
                              : isToday
                                ? "bg-[#e5efe9] text-[#2d6d45] border border-[#2d6d45]/20 font-bold"
                                : "text-[#3b3b34] hover:bg-[#faf6ee]"
                          }`}
                        >
                          {day.getDate()}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Download CSV */}
          <Button
            onClick={handleDownloadCSV}
            className="h-10 rounded-xl bg-primary px-4 text-xs font-semibold text-white shadow-sm hover:bg-[#24473b] gap-2 md:w-auto"
          >
            <Download className="size-4" />
            <span>Unduh CSV</span>
          </Button>
        </CardContent>
      </Card>

      {/* Main Table View */}
      <Card className="rounded-[20px] border-[#eadfcf] bg-white shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#fffbf4]">
                <TableRow className="border-[#efe4d3] hover:bg-transparent">
                  <TableHead className="py-3 px-4 text-xs font-bold text-[#423d33]">
                    Komoditas
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-[#423d33] w-[220px]">
                    Skor Kesesuaian
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-[#423d33]">
                    Kelas
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-[#423d33]">
                    pH Tanah
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-[#423d33]">
                    C-Organik
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-[#423d33]">
                    N-Total
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-[#423d33]">
                    P2O5
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-[#423d33]">
                    K2O
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-[#423d33]">
                    KTK
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row) => (
                    <TableRow
                      key={row.commodity}
                      className="border-[#f3ebd6]/60 hover:bg-[#fffefb]/50"
                    >
                      <TableCell className="py-3.5 px-4 font-semibold text-sm text-[#163127]">
                        {row.commodity}
                      </TableCell>
                      <TableCell className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <StatBar value={row.score} />
                          <span className="text-xs font-bold text-[#5c564c] w-6">
                            {row.score}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5 px-4">
                        <ScorePill label={row.class} />
                      </TableCell>
                      <TableCell className="py-3.5 px-4 text-xs text-[#5c564c]">
                        {row.ph}
                      </TableCell>
                      <TableCell className="py-3.5 px-4 text-xs text-[#5c564c]">
                        {row.cOrganik}
                      </TableCell>
                      <TableCell className="py-3.5 px-4 text-xs text-[#5c564c]">
                        {row.nTotal}
                      </TableCell>
                      <TableCell className="py-3.5 px-4 text-xs text-[#5c564c]">
                        {row.p2o5}
                      </TableCell>
                      <TableCell className="py-3.5 px-4 text-xs text-[#5c564c]">
                        {row.k2o}
                      </TableCell>
                      <TableCell className="py-3.5 px-4 text-xs text-[#5c564c]">
                        {row.ktk}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="py-8 text-center text-sm text-[#8d8478]"
                    >
                      Data komoditas tidak ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Table Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#f2eadf] p-4 bg-[#fffdfb]">
              <div className="text-xs text-[#8d8478]">
                Menampilkan{" "}
                <span className="font-semibold">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>
                -
                <span className="font-semibold">
                  {Math.min(currentPage * itemsPerPage, filteredData.length)}
                </span>{" "}
                dari{" "}
                <span className="font-semibold">{filteredData.length}</span>{" "}
                komoditas
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="h-8 w-8 p-0 rounded-lg border-[#e5dacb] bg-[#fffdfa] shadow-none disabled:opacity-40"
                >
                  <ChevronLeft className="size-4 text-[#6c655a]" />
                </Button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(i + 1)}
                    className={`h-8 w-8 p-0 rounded-lg shadow-none text-xs ${
                      currentPage === i + 1
                        ? "bg-primary text-primary-foreground hover:bg-[#24473b] font-semibold"
                        : "border-[#e5dacb] bg-[#fffdfa] text-[#6c655a] hover:bg-[#fffcf7]"
                    }`}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="h-8 w-8 p-0 rounded-lg border-[#e5dacb] bg-[#fffdfa] shadow-none disabled:opacity-40"
                >
                  <ChevronRight className="size-4 text-[#6c655a]" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
