# Aplikasi QA Monitoring

Aplikasi berbasis **Next.js 15** yang digunakan untuk mendata aktivitas layanan, termasuk fitur:

- Input Data melalui Form atau Upload Excel
- Filter, Edit, Hapus Data
- Export PDF & Excel dengan filter tanggal
- Grafik jumlah input 7 hari terakhir
- Login Admin dan Super Admin
- Manajemen Dropdown dinamis (keterangan, sistem, atasan, penerima)

---

## 🧑‍💻 Teknologi yang Digunakan

- **Next.js 15** + App Router
- **Tailwind CSS** untuk styling
- **MongoDB** untuk penyimpanan data
- **Framer Motion** untuk animasi modal
- **jsPDF** dan **xlsx** untuk export
- **react-hook-form** untuk manajemen form
- **Recharts** untuk grafik harian
- **NextAuth** atau sistem otentikasi manual (jika diterapkan)

---

## 🚀 Fitur Utama

### 📥 Input Data
- Input manual melalui form
- Upload file Excel (`.xlsx`)
- Data otomatis disimpan ke MongoDB
- Field: tanggal, sistem, user, atasan, keterangan, dll

### 📊 Dashboard
- Statistik total data
- Tanggal input terakhir
- Grafik 7 hari terakhir berdasarkan `tanggal_entry`

### 📦 Export
- Export PDF & Excel
- Filter tanggal sebelum export
- Tampilan PDF rapi dengan border jelas

### 🔧 Manajemen Dropdown
- Admin bisa menambah/menghapus opsi dropdown:
  - Keterangan
  - Sistem
  - Atasan
  - Penerima

### 👮 Login Sistem
- Admin & Super Admin
- Super Admin bisa mengelola akun admin lainnya
