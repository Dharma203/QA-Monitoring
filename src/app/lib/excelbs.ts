import * as XLSX from "xlsx";

// Konversi Excel serial date ke ISO
function excelDateToISO(serial: number): string | null {
  if (typeof serial !== "number") return null;

  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400; // detik
  const date = new Date(utc_value * 1000); // ms

  return isNaN(date.getTime()) ? null : date.toISOString().split("T")[0]; // hanya ambil yyyy-mm-dd
}

export function parseExcel(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target?.result, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json(sheet, { raw: true }); // raw:true untuk serial date

      const fixed = raw.map((row: any) => {
        const copy = { ...row };

        if (typeof copy.tanggal_proses === "number") {
          copy.tanggal_proses = excelDateToISO(copy.tanggal_proses);
        }

        return copy;
      });

      resolve(fixed);
    };
    reader.onerror = reject;
    reader.readAsBinaryString(file);
  });
}

// Periksa validitas tanggal sebelum parsing
function isValidDateValue(value: any): boolean {
  if (value == null) return false;
  if (typeof value === "number" && isNaN(value)) return false;
  return true;
}

// Bersihkan & isi default jika kosong
export function sanitizeExcelData(raw: any[]) {
  return raw.map((item) => {
    let tanggal_proses = null;

    if (isValidDateValue(item.tanggal_proses)) {
      if (typeof item.tanggal_proses === "number") {
        const iso = excelDateToISO(item.tanggal_proses);
        if (iso) tanggal_proses = new Date(iso).toISOString();
      } else if (typeof item.tanggal_proses === "string") {
        const parsed = new Date(item.tanggal_proses);
        if (!isNaN(parsed.getTime())) {
          tanggal_proses = parsed.toISOString();
        }
      }
    }

    return {
      kd_ktr: item.kd_ktr || "",
      code_user: item.code_user || "",
      user: item.user || "",
      kd_group: item.kd_group || "",
      nama: item.nama || "",
      jabatan: item.jabatan || "",
      petugas: item.petugas || "",
      tanggal_proses,
    };
  });
}

export function exportToExcel(data: any[], fileName = "export.xlsx") {
  const cleaned = data.map(({ _id, __v, ...rest }) => ({
    ...rest,
    tanggal_proses: rest.tanggal_proses
      ? new Date(rest.tanggal_proses).toISOString().slice(0, 10)
      : "",
    penginput: rest.penginput || "Tidak diketahui",
    role: rest.role || "Tidak diketahui",
  }));
  const ws = XLSX.utils.json_to_sheet(cleaned);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");
  XLSX.writeFile(wb, fileName);
}
