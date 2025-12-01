# Test Programming Akhdani

## Ketentuan

1. Dapat diimplementasikan dengan bahasa pemrograman atau framework apa pun.
2. Aplikasi harus runnable dan memiliki user interface.
3. Jika ada hal yang kurang jelas dapat diasumsikan sendiri.

---

# SOAL

Buatlah sebuah aplikasi untuk melakukan pengelolaan perjalanan dinas (perdin) pegawai dalam sebuah perusahaan.  
Aplikasi ini digunakan untuk mencatat perjalanan dinas serta menghitung besaran nominal uang saku yang diberikan kepada pegawai selama perjalanan dinas.

---

# Spesifikasi Aplikasi

## 1. Autentikasi & Role User

Setiap user harus memiliki:

- Username
- Password

Role user yang tersedia:

- PEGAWAI
- DIVISI-SDM

Admin dapat mengatur role masing-masing user.

---

## 2. Pengajuan Perdin oleh Pegawai

### Data yang diajukan:

- Maksud tujuan perdin (teks)
- Tanggal berangkat
- Tanggal pulang
- Kota asal
- Kota tujuan
- Durasi perdin (otomatis dihitung dari tanggal)

### Master Data Kota

Data kota memuat:

- Nama kota
- Latitude
- Longitude
- Provinsi
- Pulau
- Luar negeri (Ya/Tidak)

**Contoh data Kota Bandung:**

- Nama: Kota Bandung
- Latitude: -6.917500
- Longitude: 107.619100
- Provinsi: Jawa Barat
- Pulau: Jawa
- Luar negeri: Tidak

---

## 3. Aturan Uang Saku Perdin (per hari)

| Jarak                                        | Keterangan               | Uang Saku |
| -------------------------------------------- | ------------------------ | --------- |
| 0–60 km                                      | Tidak mendapat uang saku | Rp 0      |
| >60 km dan dalam satu provinsi               | Rp 200.000 per hari      |
| >60 km luar provinsi tetapi masih satu pulau | Rp 250.000 per hari      |
| >60 km luar provinsi dan luar pulau          | Rp 300.000 per hari      |
| Perdin luar negeri                           | USD 50 per hari          |

---

## 4. Perhitungan Jarak

Jarak perjalanan dihitung berdasarkan koordinat latitude–longitude kota asal dan tujuan.  
Peserta dipersilakan menggunakan rumus perhitungan jarak lat-lon (misalnya Haversine).

---

## 5. Approval oleh SDM

Setiap pengajuan perdin harus diproses dan disetujui oleh user dengan role SDM.  
Pada halaman approval harus ditampilkan:

- Total hari perjalanan dinas
- Total uang perdin yang harus dibayarkan

---

# Contoh UI

- Login Form
- Daftar Perdin Pegawai
- Form Input Perdin
- Daftar Perdin untuk Diproses (SDM)
- Approval Perdin Pegawai

---

# Master Data Kota

Berisi daftar kota yang akan digunakan sebagai referensi pada pengajuan perdin.
