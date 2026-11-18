# Deploy ScanGo ke server SIDATA (srv-wikrama)

| | |
|---|---|
| Server | `srv-wikrama`, user `adminwikrama` (sama dengan SIDATA) |
| Folder aplikasi | `/var/www/scango.smkwikrama.sch.id` |
| Domain | `scango.smkwikrama.sch.id` (ganti jika berbeda) |
| Port internal Node | `3100` (hanya diakses nginx) |
| Database | tetap Supabase (tidak memakai MySQL SIDATA) |
| Branch | `deploy` (server hanya menarik branch ini) |

ScanGo **harus** punya subdomain sendiri karena semua aset memakai path absolut `/frontEnd/...`.
SIDATA tidak terganggu: ScanGo hanya menambah satu server block nginx dan satu service systemd.

---

## A. Setup pertama kali (sekali saja)

### 0. DNS
Buat A record `scango.smkwikrama.sch.id` → IP publik yang sama dengan `sidata.smkwikrama.sch.id`.

### 1. Pastikan Node.js ≥ 18 ada di server
```bash
node -v || true
# Jika belum ada / versi lama (Ubuntu):
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
command -v node   # harus /usr/bin/node (sesuai scango.service)
```

### 2. Clone repo
```bash
sudo mkdir -p /var/www/scango.smkwikrama.sch.id
sudo chown adminwikrama:www-data /var/www/scango.smkwikrama.sch.id
git clone -b deploy https://github.com/mazdim131/ScanGo.git /var/www/scango.smkwikrama.sch.id
cd /var/www/scango.smkwikrama.sch.id
```
Jika repo private, pakai deploy key SSH atau personal access token.

### 3. Siapkan `.env`
Pastikan `/var/www/scango.smkwikrama.sch.id/.env` berisi nilai produksi: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `JWT_SECRET`, `DATABASE_URL`.
`CORS_ORIGIN` boleh `https://scango.smkwikrama.sch.id` (request dari domain yang sama tetap diizinkan otomatis).
`PORT` diabaikan; port diatur `scango.service` (3100).

```bash
sudo chgrp www-data .env && sudo chmod 640 .env
npm ci --omit=dev
```

### 4. Service systemd
```bash
sudo cp deploy/scango.service /etc/systemd/system/scango.service
sudo systemctl daemon-reload
sudo systemctl enable --now scango
sudo systemctl status scango --no-pager
curl -sI http://127.0.0.1:3100/api-docs | head -n 1   # HTTP/1.1 200 OK
```

### 5. Nginx + HTTPS
```bash
sudo cp deploy/nginx-scango.conf /etc/nginx/sites-available/scango
sudo ln -s /etc/nginx/sites-available/scango /etc/nginx/sites-enabled/scango
sudo nginx -t && sudo systemctl reload nginx
# Tidak pakai certbot: HTTPS memakai sertifikat sidata-local (sama seperti situs lain), di belakang Cloudflare.
```
`nginx -t` wajib lolos sebelum reload. Kalau gagal, SIDATA tetap jalan dengan config lama; perbaiki dulu errornya.

### 6. Cek
```bash
curl -sI https://scango.smkwikrama.sch.id/ | head -n 1             # 200
curl -sI https://scango.smkwikrama.sch.id/.env | head -n 1         # 404 (WAJIB 404)
curl -sI https://scango.smkwikrama.sch.id/backend/app.js | head -n 1  # 404
```

---

## B. Deploy rutin

Di laptop: gabungkan perubahan ke branch `deploy` lalu push (lihat di bawah). Di server:
```bash
cd /var/www/scango.smkwikrama.sch.id
bash deploy.sh
```
Berhasil jika baris terakhir `Deploy ScanGo selesai.`

## C. Jika ada masalah

| Gejala | Tindakan |
|---|---|
| 502 Bad Gateway | `sudo journalctl -u scango -n 50` (biasanya `.env` salah / node tidak ditemukan) |
| Halaman tampil tapi data kosong | Cek `.env` Supabase, lalu `sudo systemctl restart scango` |
| `git pull` gagal fast-forward | Ada perubahan lokal di server: `git status`, jangan dihapus sebelum dicek |

## D. Alur branch `deploy`

Pengembangan tetap di `master`. Yang naik ke server hanya isi branch `deploy`.

```bash
# di laptop, saat master siap dirilis
git checkout deploy
git merge --ff-only master     # atau: git merge master
git push origin deploy
git checkout master
```
Lalu di server: `cd /var/www/scango.smkwikrama.sch.id && bash deploy.sh`.

Server yang terlanjur di-clone dari `master` bisa dipindah:
```bash
cd /var/www/scango.smkwikrama.sch.id
git fetch origin deploy
git checkout -b deploy origin/deploy
```
