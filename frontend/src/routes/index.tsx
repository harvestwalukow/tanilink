import { createFileRoute, Link as RouterLink } from "@tanstack/react-router"
import {
  ArrowRight,
  BadgeCheck,
  ChartColumnIncreasing,
  ChevronDown,
  Leaf,
  Map,
  Sprout,
} from "lucide-react"
import { useState } from "react"

import { Logo } from "@/components/Common/Logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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

  return (
    <div className="public-shell min-h-screen bg-[linear-gradient(180deg,#fffdf8_0%,#f6eddc_100%)] text-[#163127]">
      <header className="sticky top-0 z-20 border-b border-[#e7dbc8]/80 bg-[#fffaf2]/90 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <Logo tone="dark" />
          <nav className="hidden items-center gap-8 text-sm font-medium text-[#586255] md:flex">
            <a href="#fitur" className="transition hover:text-[#163127]">
              Fitur
            </a>
            <a href="#alur" className="transition hover:text-[#163127]">
              Alur Kerja
            </a>
            <a href="#insight" className="transition hover:text-[#163127]">
              Insight
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="rounded-full px-5 text-[#24473b] hover:bg-[#efe6d7]"
              asChild
            >
              <RouterLink to="/login">Masuk</RouterLink>
            </Button>
            <Button
              className="rounded-full bg-[#24473b] px-5 text-[#fffaf2] hover:bg-[#24473b]"
              asChild
            >
              <RouterLink to="/signup">Coba Sekarang</RouterLink>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative flex min-h-[calc(100svh-5rem)] items-center overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,251,243,0.96)_0%,rgba(250,242,228,0.86)_100%)]" />
          <div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_14%_22%,rgba(212,163,93,0.18),transparent_24%),radial-gradient(circle_at_84%_18%,rgba(108,143,65,0.22),transparent_28%),radial-gradient(circle_at_62%_62%,rgba(255,255,255,0.7),transparent_26%)]" />
          <div className="absolute inset-y-0 left-[-8%] hidden w-[28rem] rounded-full bg-[#f4dcb2]/25 blur-3xl lg:block" />
          <div className="absolute right-[-6%] top-12 hidden h-[24rem] w-[24rem] rounded-full bg-[#dbe8cf]/55 blur-3xl lg:block" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(255,250,242,0)_0%,rgba(255,250,242,0.75)_72%,rgba(255,250,242,0.96)_100%)]" />
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-16">
            <div className="relative z-10 flex max-w-2xl flex-col gap-7">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d9ccb5] bg-white/80 px-4 py-2 text-sm font-medium text-[#53604f] shadow-[0_10px_30px_rgba(113,94,60,0.08)]">
                <BadgeCheck className="size-4 text-[#6c8f41]" />
                Platform keputusan tanam yang lebih terarah
              </div>
              <div className="flex flex-col gap-4">
                <h1 className="max-w-xl font-[Fraunces] text-5xl leading-[1.02] tracking-[-0.05em] text-[#24473b] md:text-6xl">
                  Tautkan data lahan, harga, dan wilayah ke keputusan tanam yang
                  lebih yakin.
                </h1>
                <p className="max-w-xl text-lg leading-8 text-[#5d6659]">
                  TaniLink membantu petani membaca kondisi lahan, memantau
                  pergerakan harga, dan menemukan rekomendasi tanam dalam satu
                  alur yang sederhana.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="h-12 rounded-full bg-[#24473b] px-6 text-base text-[#fffaf2] hover:bg-[#24473b]"
                  asChild
                >
                  <RouterLink to="/signup">
                    Mulai Gratis
                    <ArrowRight data-icon="inline-end" />
                  </RouterLink>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-[#d8ccb7] bg-white/70 px-6 text-base text-[#24473b] hover:bg-white"
                  asChild
                >
                  <RouterLink to="/login">Masuk ke Dashboard</RouterLink>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-4 top-10 hidden h-36 w-36 rounded-full bg-[#d8e5d3] blur-3xl lg:block" />
              <Card className="relative overflow-hidden rounded-[32px] border-[#e5dac8] bg-[#fffdf8]/95">
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
          </div>
        </section>

        <section
          id="fitur"
          className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-14"
        >
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
