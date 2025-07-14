import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DataEntry } from "../types/data";
import { formatDate } from "./date";

// Ambil gambar dari /public
function getImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;

    img.onload = () => resolve(img);
    img.onerror = (err) => reject("Gagal memuat gambar: " + err);
  });
}

export async function exportToPDF(data: DataEntry[], fileName = "data-report.pdf") {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Tambahkan judul terlebih dahulu di atas
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  const title = "LAPORAN QA MONITORING";
  const textWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - textWidth) / 2, 20); // Judul di Y: 20

  // Ambil logo dari folder public
  const logoImg = await getImageFromUrl("/logo-banklampung.png");

  // Hitung ukuran logo proporsional
  const maxWidth = 30;
  const ratio = logoImg.height / logoImg.width;

  let logoWidth = maxWidth;
  let logoHeight = logoWidth * ratio;

  if (logoHeight > 20) {
    logoHeight = 20;
    logoWidth = logoHeight / ratio;
  }

  // Tentukan posisi logo di bawah judul (misalnya Y = 25)
  const logoY = 25;
  doc.addImage(logoImg, "PNG", 10, logoY, logoWidth, logoHeight);

  // Tentukan posisi awal tabel di bawah logo
  const tableStartY = logoY + logoHeight + 5; // +5 mm spasi bawah logo

  // Siapkan data tabel
  const tableData = data.map((d) => [
    formatDate(d.tanggal_entry),
    formatDate(d.tanggal_form),
    formatDate(d.tanggal_eskalasi),
    d.keterangan || "",
    d.sistem || "",
    d.code_user || "",
    d.user || "",
    d.penerima || "",
    d.atasan || "",
    d.keterangan_apps || "",
    d.keterangan_detail || "",
  ]);

  // Buat tabelnya
  autoTable(doc, {
    startY: tableStartY,
    head: [[
      "Entry", "Form", "Eskalasi", "Keterangan", "Sistem", "Code",
      "User", "Penerima", "Atasan", "Apps", "Detail"
    ]],
    body: tableData,
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [1, 86, 214],
      halign: "center",
      textColor: [255, 255, 255],
    },
    columnStyles: {
      0: { cellWidth: 20 }, 1: { cellWidth: 20 }, 2: { cellWidth: 20 },
      3: { cellWidth: 30 }, 4: { cellWidth: 30 }, 5: { cellWidth: 20 },
      6: { cellWidth: 20 }, 7: { cellWidth: 20 }, 8: { cellWidth: 20 },
      9: { cellWidth: 35 }, 10: { cellWidth: 45 },
    },
  });

  doc.save(fileName);
}
