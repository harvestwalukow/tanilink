TaniLink

TaniLink adalah aplikasi web rekomendasi komoditas pertanian berbasis lokasi.
Aplikasi ini menggunakan backend FastAPI, frontend React + Vite, database PostgreSQL, dan data hasil precompute ML dari folder handoff.

Library dan tools yang dibutuhkan:

1. Docker Desktop
2. Docker Compose
3. Bun
4. uv
5. PostgreSQL, jika ingin menjalankan aplikasi tanpa Docker

Cara menjalankan dengan Docker:

1. Ekstrak file zip project.

2. Buka terminal di folder project hasil ekstrak.

3. Buat file .env dari .env.example jika belum ada.

4. Jalankan aplikasi:
   .\scripts\docker-up-local.ps1

5. Buka aplikasi di browser:
   Frontend: http://localhost:5173
   Backend API: http://localhost:8000

Setelah pertama kali berhasil dijalankan, aplikasi bisa dimulai lagi dengan:
docker compose start

Dan dihentikan dengan:
docker compose stop

Cara menjalankan tanpa Docker:

1. Pastikan PostgreSQL sudah berjalan.

2. Buat database dengan nama:
   app

3. Sesuaikan file .env:
   POSTGRES_SERVER=localhost
   POSTGRES_PORT=5432
   POSTGRES_DB=app
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=password_postgres_kalian

4. Jalankan backend:
   cd backend
   uv sync
   uv run python app/backend_pre_start.py
   uv run alembic upgrade head
   uv run python app/initial_data.py
   uv run fastapi dev app/main.py

5. Jalankan frontend di terminal lain:
   cd frontend
   bun install
   bun run dev

6. Buka aplikasi:
   http://localhost:5173

Akun awal:

Email dan password superadmin mengikuti isi file .env:
FIRST_SUPERUSER
FIRST_SUPERUSER_PASSWORD

Fitur utama:

1. Login dan daftar akun
2. Rekomendasi tanam berdasarkan lokasi dan bulan tanam
3. Detail kecocokan lahan
4. Prediksi harga komoditas
5. Dashboard

Catatan:

Jika hanya ingin menyalakan container yang sudah pernah dibuat:
docker compose start
