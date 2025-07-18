"use client";

import { useState } from "react";
import { parseExcel, sanitizeExcelData } from "@/app/lib/excelbs";
import { motion, AnimatePresence } from "framer-motion";

export default function UploadButtonBS({ onUpload }: { onUpload: () => void }) {
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);

    try {
      const raw = await parseExcel(file);
      const clean = sanitizeExcelData(raw as any[]);

      for (const item of clean) {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const penginput = user.username || "Tidak diketahui";
        const role = user.role || "Tidak diketahui";

        await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...item, penginput, role }),
        });
      }

      onUpload(); // Refresh data di halaman
      setShowModal(false);
      setFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold text-sm shadow"
      >
        Upload
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl"
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <h2 className="text-xl font-bold text-center text-blue-900 mb-4">
                Upload File Excel
              </h2>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="w-full border rounded px-3 py-2 mb-4 text-gray-700"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  disabled={isUploading}
                >
                  Batal
                </button>
                <button
                  onClick={handleUpload}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={!file || isUploading}
                >
                  {isUploading ? "Mengunggah..." : "Upload"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
