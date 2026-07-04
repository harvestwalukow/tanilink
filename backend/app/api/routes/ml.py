import csv
import math
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from typing import Any

from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/ml", tags=["ml"])

ROOT = Path(__file__).resolve().parents[2]
ML_DATA = ROOT / "ml_data"
DEC_CSV = ML_DATA / "processed" / "decision_scores.csv"
FC_CSV = ML_DATA / "processed" / "price_forecast.csv"
SUMMARY_CSV = ML_DATA / "processed" / "price_summary.csv"
POINTS_CSV = ML_DATA / "points.csv"


def _read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8-sig", newline="") as file:
        return list(csv.DictReader(file))


def _float(value: str | None, default: float = 0) -> float:
    if value in (None, ""):
        return default
    return float(value)


def _load_data() -> dict[str, Any]:
    decisions_by_key: dict[tuple[str, int], list[dict[str, str]]] = defaultdict(list)
    commodities: set[str] = set()
    for row in _read_csv(DEC_CSV):
        row["point_id"] = row["point_id"].strip()
        row["komoditas"] = row["komoditas"].strip()
        month = int(row["month"])
        decisions_by_key[(row["point_id"], month)].append(row)
        commodities.add(row["komoditas"])

    points = [
        {
            "point_id": row["point_id"].strip(),
            "latitude": _float(row["latitude"]),
            "longitude": _float(row["longitude"]),
        }
        for row in _read_csv(POINTS_CSV)
    ]

    forecasts_by_commodity: dict[str, list[dict[str, str]]] = defaultdict(list)
    for row in _read_csv(FC_CSV):
        forecasts_by_commodity[row["komoditas"].strip()].append(row)

    summary_by_commodity = {
        row["komoditas"].strip(): row for row in _read_csv(SUMMARY_CSV)
    }

    return {
        "decisions": decisions_by_key,
        "points": points,
        "forecasts": forecasts_by_commodity,
        "summary": summary_by_commodity,
        "commodities": sorted(commodities),
    }


DATA = _load_data()
PRICE_FRESHNESS = {
    commodity: row["data_terakhir"]
    for commodity, row in DATA["summary"].items()
    if row.get("data_terakhir")
}


def _mtime(path: Path) -> str | None:
    return datetime.fromtimestamp(path.stat().st_mtime).isoformat() if path.exists() else None


def _nearest_point(lat: float, lon: float) -> tuple[str, float]:
    best_point = min(
        DATA["points"],
        key=lambda point: math.hypot(point["latitude"] - lat, point["longitude"] - lon),
    )
    distance = math.hypot(best_point["latitude"] - lat, best_point["longitude"] - lon)
    return best_point["point_id"], float(distance)


@router.get("/health")
def health() -> dict[str, Any]:
    return {
        "status": "ok",
        "n_points": len(DATA["points"]),
        "komoditas": DATA["commodities"],
        "data_freshness": {
            "decision_scores_file": _mtime(DEC_CSV),
            "price_forecast_file": _mtime(FC_CSV),
            "harga_per_komoditas": {
                commodity: PRICE_FRESHNESS.get(commodity)
                for commodity in DATA["commodities"]
            },
        },
    }


@router.get("/recommend")
def recommend(
    lat: float = Query(..., ge=-9.0, le=-5.5, description="Lintang Jawa Timur"),
    lon: float = Query(..., ge=110.0, le=116.0, description="Bujur Jawa Timur"),
    month: int = Query(..., ge=1, le=12, description="Bulan tanam 1-12"),
    k: int = Query(6, ge=1, le=6),
) -> dict[str, Any]:
    point_id, distance = _nearest_point(lat, lon)
    subset = DATA["decisions"].get((point_id, month), [])

    if not subset:
        raise HTTPException(status_code=404, detail="Tidak ada skor untuk titik/bulan ini")

    sorted_rows = sorted(
        subset, key=lambda row: _float(row["final_score"]), reverse=True
    )[:k]
    recommendations = [
        {
            "rank": rank,
            "komoditas": row["komoditas"],
            "final_score": round(_float(row["final_score"]), 4),
            "suitability_norm": round(_float(row["suitability_norm"]), 4),
            "suitability_lo": round(_float(row.get("suit_lo")), 4)
            if row.get("suit_lo")
            else None,
            "suitability_hi": round(_float(row.get("suit_hi")), 4)
            if row.get("suit_hi")
            else None,
            "price_trend_norm": round(_float(row["price_trend_norm"]), 4),
            "price_volatility_norm": round(_float(row["price_volatility_norm"]), 4),
            "harga_data_terakhir": PRICE_FRESHNESS.get(row["komoditas"]),
            "sumber_suitability": row["sumber"],
        }
        for rank, row in enumerate(sorted_rows, start=1)
    ]

    return {
        "query": {"lat": lat, "lon": lon, "month": month},
        "matched_point": {"point_id": point_id, "distance_deg": round(distance, 4)},
        "recommendations": recommendations,
    }


@router.get("/forecast")
def forecast(
    commodity: str = Query(
        ..., description="padi, jagung, kedelai, tebu, cabai, atau bawang_merah"
    ),
) -> dict[str, Any]:
    subset = DATA["forecasts"].get(commodity, [])
    if not subset:
        choices = sorted(DATA["forecasts"].keys())
        raise HTTPException(
            status_code=404,
            detail=f"Komoditas '{commodity}' tak ada. Pilihan: {choices}",
        )

    meta = DATA["summary"].get(commodity, {})
    series = [
        {
            "tanggal": row["tanggal"],
            "harga_pred": round(_float(row["harga_pred"]), 1),
            "harga_lower": round(_float(row["harga_lower"]), 1),
            "harga_upper": round(_float(row["harga_upper"]), 1),
            "status": row.get("status") or "tervalidasi",
            "sudah_lewat": (row.get("sudah_lewat") or "").lower() == "true",
        }
        for row in subset
    ]

    volatility = _float(meta.get("volatility_annual"))
    risk = "rendah" if volatility < 0.15 else "sedang" if volatility < 0.35 else "tinggi"
    ci_width = _float(meta.get("ci_width_pct"))
    trend = meta.get("trend")
    pct_change = _float(meta.get("pct_change"))
    direction = {
        "naik": "cenderung naik",
        "turun": "cenderung turun",
        "stabil": "cenderung stabil",
    }.get(trend or "", trend)
    ringkasan = (
        f"Harga {direction} ({pct_change:+.1f}% dalam 90 hari), rentang "
        f"ketidakpastian +/-{ci_width / 2:.0f}% (risiko {risk})."
    )
    n_extra = sum(1 for point in series if point["status"] == "ekstrapolasi")
    catatan_ekstrapolasi = (
        f"{n_extra} dari {len(series)} titik adalah ekstrapolasi di luar horizon "
        f"tervalidasi (3 bulan); data harga terakhir {meta.get('data_terakhir')}. "
        "CI melebar sesuai jarak, jadi perlakukan bagian ekstrapolasi sebagai indikatif."
    ) if n_extra else None

    return {
        "komoditas": commodity,
        "model_menang": meta.get("model_menang"),
        "model_mae_terbaik": meta.get("model_mae_terbaik"),
        "aturan_seleksi": meta.get("aturan_seleksi"),
        "trend": trend,
        "pct_change_horizon": pct_change,
        "ci_width_pct": ci_width,
        "bentuk_forecast_pct": meta.get("shape_amplitude_pct"),
        "volatility_annual": volatility,
        "kelas_risiko": risk,
        "mae_model": _float(meta.get("mae_model_menang"))
        if meta.get("mae_model_menang")
        else None,
        "mae_naive_baseline": _float(meta.get("mae_naive"))
        if meta.get("mae_naive")
        else None,
        "biaya_akurasi_vs_terbaik_pct": meta.get("biaya_akurasi_vs_terbaik_pct"),
        "data_terakhir": meta.get("data_terakhir"),
        "origin_data": meta.get("origin_data"),
        "forecast_menjangkau": meta.get("forecast_menjangkau"),
        "catatan_ekstrapolasi": catatan_ekstrapolasi,
        "ringkasan": ringkasan,
        "forecast": series,
    }
