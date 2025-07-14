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

        if (typeof copy.tanggal_form === "number") {
          copy.tanggal_form = excelDateToISO(copy.tanggal_form);
        }
        if (typeof copy.tanggal_eskalasi === "number") {
          copy.tanggal_eskalasi = excelDateToISO(copy.tanggal_eskalasi);
        }
        if (typeof copy.tanggal_entry === "number") {
          copy.tanggal_entry = excelDateToISO(copy.tanggal_entry);
        }

        return copy;
      });

      resolve(fixed);
    };
    reader.onerror = reject;
    reader.readAsBinaryString(file);
  });
}

// Bersihkan & isi default jika kosong
export function sanitizeExcelData(raw: any[]) {
  return raw
    .filter((item) => item.keterangan || item.sistem || item.user)
    .map((item) => ({
      keterangan: item.keterangan || "",
      sistem: item.sistem || "",
      user: item.user || "",
      code_user: item.code_user || "",
      penerima: item.penerima || "",
      atasan: item.atasan || "",
      tanggal_form: item.tanggal_form
        ? new Date(item.tanggal_form).toISOString()
        : null,
      tanggal_eskalasi: item.tanggal_eskalasi
        ? new Date(item.tanggal_eskalasi).toISOString()
        : null,
      tanggal_entry: item.tanggal_entry
        ? new Date(item.tanggal_entry).toISOString()
        : null,
    }));
}

export function exportToExcel(data: any[], fileName = "export.xlsx") {
  const cleaned = data.map(({ _id, __v, ...rest }) => rest);
  const ws = XLSX.utils.json_to_sheet(cleaned);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");
  XLSX.writeFile(wb, fileName);
}
