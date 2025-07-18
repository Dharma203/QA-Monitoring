# 🌐 QA Monitoring & User Management System

Aplikasi berbasis **Next.js 15** yang digunakan untuk mendata aktivitas layanan, termasuk fitur:

- Input Data melalui Form atau Upload Excel
- Filter, Edit, Hapus Data
- Export PDF & Excel dengan filter
- Grafik jumlah input 7 hari terakhir
- Login Admin dan Super Admin
- Manajemen Dropdown dinamis

> 📍 Proyek ini dikembangkan dalam rangka kerja praktik dan pengembangan sistem informasi berbasis web di lingkungan perbankan.

---

## ⚙️ Teknologi yang Digunakan

| Teknologi            | Deskripsi                                     |
|----------------------|-----------------------------------------------|
| **Next.js 15**       | Framework React dengan App Router             |
| **Tailwind CSS**     | Styling responsif & utility-first             |
| **MongoDB**          | Database NoSQL untuk penyimpanan data         |
| **Framer Motion**    | Animasi modal transisi mulus                  |
| **jsPDF** + **xlsx** | Export data ke PDF & Excel                    |
| **react-hook-form**  | Validasi dan manajemen form input             |
| **Recharts**         | Visualisasi data grafik input harian          |

---

## 🚀 Fitur Utama

### 📥 Input Data
- Input manual melalui form dinamis
- Upload file Excel (`.xlsx`) dengan parsing otomatis
- Validasi otomatis termasuk tanggal (`tanggal_entry`, `tanggal_proses`)
- Data disimpan langsung ke MongoDB

### 📊 Dashboard Monitoring
- Statistik **Total Data** dan **Total User**
- Informasi **Tanggal Input Terakhir**
- **Grafik 7 hari terakhir** berdasarkan tanggal input

### 📤 Export & Upload
- Export ke **PDF** dan **Excel**
- Filter data sebelum export berdasarkan **range tanggal**
- Tampilan PDF rapi dan profesional dengan **border yang jelas**

### 🧑‍💼 Manajemen Dropdown Dinamis
- Admin dapat menambah atau menghapus opsi dropdown:
  - `keterangan`
  - `sistem`
  - `atasan`
  - `penerima`
- Dropdown terhubung langsung dengan form input

### 👥 Login dan Hak Akses
- Login untuk **Admin** dan **Super Admin**
- Super Admin dapat:
  - Menambah dan menghapus akun admin
  - Melihat data yang lebih luas
- Setiap halaman dilindungi dengan **ProtectedRoute**

### 🗂️ Halaman User BS
- Halaman terpisah untuk pendataan **User Banking System**
- Fitur setara dengan halaman QA:
  - Upload Excel
  - Export PDF/Excel
  - Edit & Delete data
  - Pagination dan filter

---

## ✅ Cara Menjalankan Proyek

1. Clone repo:
   
   ```bash
   git clone https://github.com/username/qa-monitoring.git
   cd qa-monitoring
   
3. Install dependencies:

  ```bash
  npm install


3. Jalankan server development:

  ```bash
  npm run dev
