from fastapi.testclient import TestClient

from app.core.config import settings


def test_ml_health(client: TestClient) -> None:
    response = client.get(f"{settings.API_V1_STR}/ml/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["n_points"] == 746
    assert "padi" in data["komoditas"]
    assert data["data_freshness"]["harga_per_komoditas"]["jagung"] == "December 2025"


def test_ml_recommend(client: TestClient) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/ml/recommend",
        params={"lat": -7.98, "lon": 112.62, "month": 11, "k": 3},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["matched_point"]["point_id"] == "PT_00136"
    assert len(data["recommendations"]) == 3
    assert data["recommendations"][0]["komoditas"] == "kedelai"
    assert data["recommendations"][0]["harga_data_terakhir"] == "December 2025"


def test_ml_forecast(client: TestClient) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/ml/forecast",
        params={"commodity": "padi"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["komoditas"] == "padi"
    assert data["kelas_risiko"] == "rendah"
    assert len(data["forecast"]) > 0
    assert {"harga_pred", "harga_lower", "harga_upper"}.issubset(data["forecast"][0])
