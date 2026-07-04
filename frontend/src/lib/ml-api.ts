const API_BASE = `${import.meta.env.VITE_API_URL ?? ""}/api/v1/ml`

export const COMMODITIES = [
  "padi",
  "jagung",
  "kedelai",
  "tebu",
  "cabai",
  "bawang_merah",
] as const

export type Commodity = (typeof COMMODITIES)[number]

export interface MlHealth {
  status: string
  n_points: number
  komoditas: Commodity[]
  data_freshness: {
    decision_scores_file: string | null
    price_forecast_file: string | null
    harga_per_komoditas: Record<string, string>
  }
}

export interface Recommendation {
  rank: number
  komoditas: Commodity
  final_score: number
  suitability_norm: number
  suitability_lo: number | null
  suitability_hi: number | null
  price_trend_norm: number
  price_volatility_norm: number
  harga_data_terakhir: string | null
  sumber_suitability: string
}

export interface RecommendResponse {
  query: {
    lat: number
    lon: number
    month: number
  }
  matched_point: {
    point_id: string
    distance_deg: number
  }
  recommendations: Recommendation[]
}

export interface ForecastPoint {
  tanggal: string
  harga_pred: number
  harga_lower: number
  harga_upper: number
  status: "tervalidasi" | "ekstrapolasi"
  sudah_lewat: boolean
}

export interface ForecastResponse {
  komoditas: Commodity
  model_menang: string | null
  aturan_seleksi: string | null
  trend: "naik" | "turun" | "stabil" | null
  pct_change_horizon: number | null
  ci_width_pct: number | null
  volatility_annual: number
  kelas_risiko: "rendah" | "sedang" | "tinggi"
  mae_model: number | null
  mae_naive_baseline: number | null
  data_terakhir: string | null
  origin_data: string | null
  forecast_menjangkau: string | null
  catatan_ekstrapolasi: string | null
  ringkasan: string
  forecast: ForecastPoint[]
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`)
  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    const detail = payload?.detail
    const message = Array.isArray(detail)
      ? (detail[0]?.msg ?? "Permintaan tidak valid.")
      : (detail ?? "Layanan ML belum tersedia.")
    throw new Error(message)
  }
  return response.json() as Promise<T>
}

export function getMlHealth() {
  return request<MlHealth>("/health")
}

export function getRecommendations({
  lat,
  lon,
  month,
  k = 6,
}: {
  lat: number
  lon: number
  month: number
  k?: number
}) {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    month: String(month),
    k: String(k),
  })
  return request<RecommendResponse>(`/recommend?${params}`)
}

export function getForecast(commodity: Commodity) {
  const params = new URLSearchParams({ commodity })
  return request<ForecastResponse>(`/forecast?${params}`)
}

export function commodityLabel(commodity: string) {
  const labels: Record<string, string> = {
    padi: "Padi",
    jagung: "Jagung",
    kedelai: "Kedelai",
    tebu: "Tebu",
    cabai: "Cabai",
    bawang_merah: "Bawang Merah",
  }
  return labels[commodity] ?? commodity
}

export function formatPercent(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "-"
  return `${Math.round(value * 100)}%`
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value)
}
