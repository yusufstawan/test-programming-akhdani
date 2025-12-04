# Product Requirements Document (PRD)

## Aplikasi Pengelolaan Perjalanan Dinas (Perdin)

---

# 1. Ringkasan Produk

Aplikasi Pengelolaan Perjalanan Dinas (Perdin) digunakan untuk mengajukan, mengelola, menghitung, dan memproses perjalanan dinas pegawai.  
Termasuk pengajuan oleh pegawai, perhitungan otomatis uang saku berdasarkan jarak, serta approval oleh Divisi SDM.

---

# 2. Role & Autentikasi

## 2.1 Role User

### PEGAWAI

- Mengajukan perjalanan dinas
- Melihat daftar perdin
- Melihat status (Pending / Approved / Rejected)

### DIVISI-SDM

- Melihat seluruh pengajuan
- Meng-approve atau menolak pengajuan
- Melihat history pengajuan

## 2.2 Autentikasi

- Username & password
- Admin mengatur role user

---

# 3. Fitur Pegawai

## 3.1 Pengajuan Perdin

Field yang diajukan:

- Maksud perjalanan
- Tanggal berangkat
- Tanggal pulang
- Kota asal
- Kota tujuan
- Durasi (otomatis)
- Jarak perjalanan (otomatis)

### Validasi

- Tanggal pulang ≥ tanggal berangkat
- Kota asal ≠ kota tujuan
- Semua field wajib

## 3.2 Daftar Perdin Pegawai

Kolom minimal:

- Kota asal → Kota tujuan
- Tanggal perjalanan
- Total hari
- Maksud perjalanan
- Jarak (km)
- Status (Pending / Approved / Rejected)

Tombol: **Tambah Perdin**

---

# 4. Master Data Kota

## 4.1 Struktur Data Kota

- Nama kota
- Latitude
- Longitude
- Provinsi
- Pulau
- Luar negeri (Ya/Tidak)

### Contoh:

- Nama: Bandung
- Latitude: -6.917500
- Longitude: 107.619100
- Provinsi: Jawa Barat
- Pulau: Jawa
- Luar negeri: Tidak

### Pengelola:

- Admin / SDM dapat menambah atau mengedit data kota

---

# 5. Perhitungan Teknis

## 5.1 Durasi Perjalanan (Hari)

Durasi dihitung secara **inklusif**:
Durasi = (Tanggal Pulang – Tanggal Berangkat) + 1

## 5.2 Perhitungan Jarak

Menggunakan rumus **Haversine** berdasarkan koordinat latitude–longitude kota asal dan tujuan.

## 5.3 Aturan Uang Saku Per Hari

| Kriteria                           | Uang Saku per Hari |
| ---------------------------------- | ------------------ |
| 0–60 km                            | Rp 0               |
| >60 km, satu provinsi              | Rp 200.000         |
| >60 km, beda provinsi & satu pulau | Rp 250.000         |
| >60 km, beda provinsi & beda pulau | Rp 300.000         |
| Luar negeri                        | USD 50             |

### Catatan:

- Jika **luar negeri = Ya**, selalu USD 50/hari
- Jika jarak ≤ 60 km → langsung Rp 0

---

# 6. Status & Alur Pengajuan

Status pengajuan:

- **PENDING** — setelah pegawai submit
- **APPROVED** — jika disetujui SDM
- **REJECTED** — jika ditolak SDM

Alur:

1. Pegawai submit → Pending
2. SDM review → Approve / Reject

---

# 7. Fitur SDM

## 7.1 Daftar Pengajuan Pending

Kolom minimal:

- Nama pegawai
- Kota asal → tujuan
- Tanggal perjalanan
- Total hari
- Jarak tempuh
- Status

Aksi:

- **Review / Approve / Reject**

## 7.2 Halaman Approval Perdin

Menampilkan:

- Nama pegawai
- Maksud perjalanan
- Kota asal → tujuan
- Jarak tempuh (km)
- Tanggal berangkat & pulang
- Total hari
- Uang saku per hari
- Total uang saku

Aksi:

- **Approve**
- **Reject**

## 7.3 History Pengajuan

Menampilkan seluruh pengajuan dengan status:

- Approved
- Rejected

Kolom minimal:

- Nama pegawai
- Kota asal → tujuan
- Tanggal
- Total hari
- Total uang saku
- Status

---

# 8. Asumsi Teknis

- Mata uang domestik: IDR
- Luar negeri: USD
- Tidak ada konversi kurs
- Jarak dibulatkan (2 desimal atau integer, konsisten)
- Tidak ada tanda tangan digital
- UI bebas namun minimal memenuhi kebutuhan form dan daftar

---

# 9. UI yang Harus Ada

1. Login Form
2. Daftar Perdin Pegawai
3. Form Input Perdin
4. Daftar Perdin Pending untuk SDM
5. Halaman Detail/Approval Perdin
6. History Approval SDM

---

# 10. Non-Functional Requirements (Opsional)

- Aplikasi dapat dijalankan secara lokal
- Responsif & mudah digunakan
- Password di-hash
- Validasi input memadai
- Perhitungan jarak & uang saku otomatis

---

# 11. (Opsional) Endpoint API

- POST /login
- GET /cities
- POST /perdin
- GET /perdin/my
- GET /perdin/pending
- POST /perdin/{id}/approve
- POST /perdin/{id}/reject

---

# 12. Selesai

Dokumen ini mencakup seluruh kebutuhan aplikasi pengelolaan perjalanan dinas, termasuk rule bisnis, perhitungan jarak, regulasi uang saku, alur approval, serta struktur data utama.
