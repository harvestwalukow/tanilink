import { createFileRoute, Link as RouterLink } from "@tanstack/react-router"
import {
  ArrowRight,
  ChartColumnIncreasing,
  ChevronDown,
  Leaf,
  Map,
  Sprout,
} from "lucide-react"
import { useEffect, useState } from "react"

import { Logo } from "@/components/Common/Logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const featureCards = [
  {
    icon: Leaf,
    title: "Rekomendasi tanam berbasis kondisi lahan",
    description:
      "Pahami tanaman yang paling cocok berdasarkan unsur tanah, suhu, dan pola musim di wilayah Anda.",
  },
  {
    icon: ChartColumnIncreasing,
    title: "Prediksi harga untuk rencana panen",
    description:
      "Lihat kecenderungan harga komoditas agar keputusan tanam dan panen lebih terukur.",
  },
  {
    icon: Map,
    title: "Peta wilayah yang lebih mudah dibaca",
    description:
      "Pantau sebaran area tani dan konteks wilayah dalam tampilan yang ringkas dan informatif.",
  },
]

const workflowSteps = [
  "Pilih wilayah dan komoditas yang ingin dianalisis.",
  "Tinjau data lahan, tren harga, dan rekomendasi tanam dalam satu alur.",
  "Gunakan hasilnya sebagai dasar keputusan musim tanam berikutnya.",
]

const faqItems = [
  {
    question: "Apa yang bisa dilakukan TaniLink untuk petani?",
    answer:
      "TaniLink membantu membaca kondisi lahan, melihat prediksi harga komoditas, dan meninjau rekomendasi tanam dalam satu dashboard yang lebih ringkas.",
  },
  {
    question: "Apakah saya harus punya data lahan lengkap untuk mulai memakai platform?",
    answer:
      "Tidak harus lengkap sejak awal. Anda bisa mulai dari wilayah dan komoditas utama terlebih dahulu, lalu menambah data lahan secara bertahap saat analisis dibutuhkan lebih detail.",
  },
  {
    question: "Siapa yang cocok menggunakan TaniLink?",
    answer:
      "Platform ini cocok untuk petani, penyuluh lapangan, koperasi, maupun tim agribisnis yang ingin melihat keputusan tanam dengan konteks harga dan wilayah secara bersamaan.",
  },
  {
    question: "Apakah hasil rekomendasi bisa dipakai sebagai bahan diskusi tim?",
    answer:
      "Bisa. Tampilan TaniLink dirancang agar hasil analisis mudah dibaca dan dipakai sebagai titik awal diskusi sebelum mengambil keputusan musim tanam berikutnya.",
  },
]

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      {
        title: "TaniLink",
      },
    ],
  }),
})

function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [isNavSolid, setIsNavSolid] = useState(false)
  const [isDashboardPreviewMounted, setIsDashboardPreviewMounted] =
    useState(false)
  const [showDashboardPreview, setShowDashboardPreview] = useState(false)

  useEffect(() => {
    const updateNavSurface = () => {
      setIsNavSolid(window.scrollY > window.innerHeight - 96)
    }

    updateNavSurface()
    window.addEventListener("scroll", updateNavSurface, { passive: true })
    window.addEventListener("resize", updateNavSurface)

    return () => {
      window.removeEventListener("scroll", updateNavSurface)
      window.removeEventListener("resize", updateNavSurface)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsDashboardPreviewMounted(true)
      window.requestAnimationFrame(() => {
        setShowDashboardPreview(true)
      })
    }, 5000)

    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="public-shell min-h-screen bg-[#f7f0e3] text-[#163127]">
      <header className="fixed inset-x-0 top-0 z-[100] px-4 pt-4 sm:px-6">
        <div
          className={cn(
            "mx-auto flex w-full max-w-[calc(100rem-2rem)] items-center justify-between gap-4 rounded-full border px-4 py-3 transition-all duration-300 lg:px-6",
            isNavSolid
              ? "border-[#eadfcd]/80 bg-[#fffaf2]/86 shadow-[0_18px_55px_rgba(82,69,45,0.12)] backdrop-blur-md"
              : "border-transparent bg-transparent shadow-none",
          )}
        >
          <Logo tone={isNavSolid ? "dark" : "light"} />
          <nav
            className={cn(
              "hidden items-center gap-9 text-sm font-semibold transition-colors duration-300 md:flex",
              isNavSolid ? "text-[#24473b]" : "text-white/86",
            )}
          >
            <a
              href="#fitur"
              className={cn(
                "transition",
                isNavSolid ? "hover:text-[#163127]" : "hover:text-white",
              )}
            >
              Fitur
            </a>
            <a
              href="#alur"
              className={cn(
                "transition",
                isNavSolid ? "hover:text-[#163127]" : "hover:text-white",
              )}
            >
              Alur Kerja
            </a>
            <a
              href="#insight"
              className={cn(
                "transition",
                isNavSolid ? "hover:text-[#163127]" : "hover:text-white",
              )}
            >
              Insight
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className={cn(
                "hidden rounded-full px-5 sm:inline-flex",
                isNavSolid
                  ? "text-[#24473b] hover:bg-[#efe6d7] hover:text-[#163127]"
                  : "text-white hover:bg-white/12 hover:text-white",
              )}
              asChild
            >
              <RouterLink to="/login">Masuk</RouterLink>
            </Button>
            <Button
              className={cn(
                "rounded-full px-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)]",
                isNavSolid
                  ? "bg-[#24473b] text-[#fffaf2] hover:bg-[#24473b]"
                  : "bg-white text-[#111917] hover:bg-white",
              )}
              asChild
            >
              <RouterLink to="/signup">
                Coba Sekarang
                <ArrowRight data-icon="inline-end" />
              </RouterLink>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative z-20 overflow-visible bg-[#f7f0e3] p-3 pb-0 sm:p-4 sm:pb-0">
          <div className="relative flex min-h-[calc(120svh-1.5rem)] items-start justify-center overflow-visible rounded-[2rem] pt-[12rem] sm:min-h-[calc(120svh-2rem)] sm:rounded-[2.4rem] md:pt-[12.5rem]">
            <img
              src="/assets/images/hero-sawah-bg.png"
              alt=""
              className="absolute inset-0 size-full rounded-[2rem] object-cover sm:rounded-[2.4rem]"
              aria-hidden="true"
            />
            <div className="absolute inset-0 rounded-[2rem] bg-[linear-gradient(180deg,rgba(6,20,27,0.18)_0%,rgba(6,20,27,0.14)_34%,rgba(6,20,27,0.28)_74%,rgba(6,20,27,0.46)_100%)] sm:rounded-[2.4rem]" />
            <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.15),transparent_30%)] sm:rounded-[2.4rem]" />
            <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-col items-center px-6 pb-20 text-center sm:pb-24 md:pb-[26rem] lg:pb-[28rem] lg:px-8">
              <div className="flex max-w-5xl flex-col items-center gap-5">
                <h1 className="font-[Fraunces] text-5xl leading-[1.02] text-white drop-shadow-[0_8px_34px_rgba(0,0,0,0.28)] sm:text-6xl md:text-7xl lg:text-[6.8rem]">
                  Buat keputusan tanam yang lebih terarah
                </h1>
                <p className="max-w-2xl text-base leading-8 text-white/82 md:text-lg">
                  TaniLink membantu petani membaca kondisi lahan, memantau
                  pergerakan harga, dan menemukan rekomendasi tanam dalam satu
                  alur yang sederhana.
                </p>
              </div>
            </div>

            {isDashboardPreviewMounted ? (
              <div
                className={cn(
                  "absolute inset-x-4 bottom-[-16rem] z-30 mx-auto hidden max-w-6xl transform-gpu transition-all duration-[900ms] ease-out md:block lg:bottom-[-17rem]",
                  showDashboardPreview
                    ? "translate-y-0 scale-100 opacity-100 blur-0"
                    : "translate-y-20 scale-[0.985] opacity-0 blur-md",
                )}
              >
                <Card className="relative overflow-hidden rounded-[32px] border-[#e5dac8] bg-[#fffdf8]/95 shadow-none">
                  <CardContent className="flex flex-col gap-6 p-6 md:p-7">
                    <div className="flex items-center justify-between rounded-[26px] border border-[#ebe0cf] bg-[#fffaf2] px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-[#7a7468]">
                          Wilayah aktif
                        </p>
                        <p className="pt-1 text-xl font-semibold text-[#24473b]">
                          Kab. Jombang
                        </p>
                      </div>
                      <div className="rounded-full bg-[#eaf1e8] px-4 py-2 text-sm font-semibold text-[#24473b]">
                        Musim tanam siap
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                      <div className="rounded-[28px] border border-[#ebe0cf] bg-[linear-gradient(180deg,#24473b_0%,#19362c_100%)] p-4 text-[#f9f5eb]">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-sm text-[#d7e1d6]">
                              Rekomendasi utama
                            </p>
                            <h2 className="pt-2 text-[1.9rem] leading-[1.18] font-semibold">
                              Padi dan jagung pada lahan lempung berpasir
                            </h2>
                          </div>
                          <div className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#ecf5e8]">
                            Stabil
                          </div>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-3">
                          {[
                            ["Kelembapan", "68%"],
                            ["pH Tanah", "6.3"],
                          ].map(([label, value]) => (
                            <div
                              key={label}
                              className="flex min-h-[6.2rem] min-w-0 flex-col rounded-2xl border border-white/10 bg-white/8 px-4 py-3.5"
                            >
                              <p className="text-xs leading-5 text-[#d7e1d6]">
                                {label}
                              </p>
                              <p className="pt-3 text-[1.6rem] leading-none font-semibold">
                                {value}
                              </p>
                            </div>
                          ))}
                          <div className="col-span-2 flex min-h-[5.8rem] min-w-0 flex-col rounded-2xl border border-white/10 bg-white/8 px-4 py-3.5">
                            <p className="text-xs leading-5 text-[#d7e1d6]">
                              Curah Hujan
                            </p>
                            <p className="pt-3 text-[1.3rem] leading-none font-semibold">
                              Sedang
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4">
                        <div className="rounded-[28px] border border-[#ebe0cf] bg-[#f5eedf] p-5">
                          <p className="text-sm font-medium text-[#7a7468]">
                            Prediksi harga
                          </p>
                          <p className="pt-2 text-3xl font-semibold text-[#24473b]">
                            Rp5.450/kg
                          </p>
                          <div className="mt-4 flex items-end gap-2">
                            {[56, 72, 64, 86, 78, 92].map((height, index) => (
                              <span
                                key={`${height}-${index}`}
                                className="block flex-1 rounded-full bg-[#c98a4b]"
                                style={{ height }}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="rounded-[28px] border border-[#ebe0cf] bg-white p-5">
                          <p className="text-sm font-medium text-[#7a7468]">
                            Pemetaan cepat
                          </p>
                          <div className="mt-4 overflow-hidden rounded-[22px] border border-[#eef1e5] bg-[#eef4e7]">
                            <img
                              src="/assets/images/hero-map-card.png"
                              alt="Peta lahan"
                              className="h-[10.75rem] w-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </div>
        </section>

        <section
          id="fitur"
          className="relative z-10 -mt-1 rounded-t-[2.5rem] bg-[#f7f0e3] px-6 pt-80 pb-10 lg:px-8 lg:pt-88 lg:pb-14"
        >
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-8 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7b8067]">
              Fitur utama
            </p>
            <h2 className="pt-3 font-[Fraunces] text-4xl tracking-[-0.04em] text-[#24473b]">
              Dibuat untuk membaca kondisi lapangan tanpa membuat alur kerja
              terasa rumit.
            </h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
            {featureCards.map((feature) => (
              <Card
                key={feature.title}
                className="rounded-[28px] border-[#e5dac8] bg-[#fffdf8]"
              >
                <CardContent className="flex h-full flex-col gap-5 p-6">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#eaf1e8] text-[#24473b]">
                    <feature.icon className="size-5" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-semibold text-[#24473b]">
                      {feature.title}
                    </h3>
                    <p className="text-base leading-7 text-[#61695d]">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          </div>
        </section>

        <section id="alur" className="border-y border-[#eadfcd] bg-[#fffaf2]">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7b8067]">
                Alur kerja
              </p>
              <h2 className="pt-3 font-[Fraunces] text-4xl tracking-[-0.04em] text-[#24473b]">
                Dari pemetaan lahan sampai rekomendasi musim tanam berikutnya.
              </h2>
            </div>
            <div className="grid gap-4">
              {workflowSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex gap-4 rounded-[26px] border border-[#e6dac7] bg-white px-5 py-5 shadow-[0_14px_35px_rgba(104,79,44,0.06)]"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#24473b] text-sm font-semibold text-[#fffaf2]">
                    0{index + 1}
                  </div>
                  <p className="pt-1 text-lg leading-8 text-[#4f594e]">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="insight"
          className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-8 lg:py-16"
        >
          <Card className="overflow-hidden rounded-[34px] border-[#d9ccb7] bg-[linear-gradient(135deg,#24473b_0%,#24473b_58%,#24473b_100%)]">
            <CardContent className="grid gap-8 p-8 text-[#f7f2e8] lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-[#f0ebdf]">
                  <Sprout className="size-4" />
                  Insight yang lebih siap dipakai
                </div>
                <h2 className="pt-5 font-[Fraunces] text-4xl tracking-[-0.04em] text-white">
                  Satu tempat untuk membaca data penting sebelum menentukan
                  langkah berikutnya.
                </h2>
                <p className="pt-4 text-base leading-8 text-[#dfe7dc]">
                  Masuk ke dashboard TaniLink untuk menggabungkan data lahan,
                  prediksi harga, dan konteks wilayah ke keputusan yang terasa
                  lebih praktis di lapangan.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Ringkas untuk dibaca cepat saat meninjau kondisi lahan.",
                  "Visual lebih jelas untuk harga, wilayah, dan rekomendasi.",
                  "Cocok digunakan sebagai titik awal diskusi musim tanam.",
                  "Tetap sederhana untuk petani, penyuluh, dan tim lapangan.",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[26px] border border-white/10 bg-white/8 p-5 text-base leading-7 text-[#ecf2e8]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 py-6 lg:px-8 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7b8067]">
                FAQ
              </p>
              <h2 className="pt-3 font-[Fraunces] text-4xl tracking-[-0.04em] text-[#24473b]">
                Pertanyaan yang sering muncul sebelum mulai memakai TaniLink.
              </h2>
              <p className="pt-4 text-base leading-8 text-[#61695d]">
                Kami rangkum beberapa hal dasar agar Anda bisa memahami fungsi
                platform lebih cepat.
              </p>
            </div>

            <div className="grid gap-3">
              {faqItems.map((item, index) => {
                const isOpen = openFaq === index

                return (
                  <div
                    key={item.question}
                    className="overflow-hidden rounded-[26px] border border-[#e4d8c7] bg-white"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaq((current) =>
                          current === index ? null : index,
                        )
                      }
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="text-lg font-semibold text-[#24473b]">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`size-5 shrink-0 text-[#6d705c] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isOpen ? (
                      <div className="border-t border-[#efe5d6] px-5 py-4 text-base leading-7 text-[#5f675b]">
                        {item.answer}
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e6dac7] bg-[#fffaf2]">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="max-w-xl">
            <Logo tone="dark" />
            <p className="pt-4 text-base leading-7 text-[#60685c]">
              TaniLink membantu keputusan tanam terasa lebih terarah dengan
              menghubungkan lahan, harga, dan wilayah dalam satu alur yang
              mudah dibaca.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7b8067]">
                Navigasi
              </p>
              <div className="mt-4 flex flex-col gap-3 text-base text-[#24473b]">
                <a href="#fitur" className="hover:text-[#24473b]">
                  Fitur
                </a>
                <a href="#alur" className="hover:text-[#24473b]">
                  Alur Kerja
                </a>
                <a href="#insight" className="hover:text-[#24473b]">
                  Insight
                </a>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7b8067]">
                Akses
              </p>
              <div className="mt-4 flex flex-col gap-3 text-base text-[#24473b]">
                <RouterLink to="/login" className="hover:text-[#24473b]">
                  Masuk
                </RouterLink>
                <RouterLink to="/signup" className="hover:text-[#24473b]">
                  Daftar
                </RouterLink>
                <RouterLink to="/app" className="hover:text-[#24473b]">
                  Demo Dashboard
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-[#eee4d5] px-6 py-4 text-center text-sm text-[#7f776a]">
          2026 TaniLink. Dirancang untuk keputusan tanam yang lebih jelas.
        </div>
      </footer>
    </div>
  )
}
