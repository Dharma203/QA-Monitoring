"use client";

import { useRef, useState, useEffect } from "react";
import { exportToExcel } from "@/app/lib/excelbs";
import { exportToPDF } from "@/app/lib/pdfbs";
import { UserEntryBS } from "@/app/types/user";
import { AnimatePresence, motion } from "framer-motion";

export default function ExportButtons({
  allData,
  filteredData,
}: {
  allData: UserEntryBS[];
  filteredData: UserEntryBS[];
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        event.target instanceof Node &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-blue-600 hover:bg-blue-700 h-10 text-white px-6 py-2 rounded-md font-semibold text-sm shadow flex items-center"
      >
        Export ▼
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "tween", duration: 0.2 }}
            className="absolute right-0 bottom-full mb-2 w-56 bg-white border rounded-md shadow-lg z-50 overflow-hidden"
          >
            {/* Export PDF */}
            <div className="text-xs text-gray-500 px-4 pt-3 pb-1">
              Export PDF
            </div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.05 }}
              onClick={async () => {
                setOpen(false);
                await exportToPDF(filteredData);
              }}
              className="w-full px-4 py-2 text-left text-sm text-black hover:bg-gray-100"
            >
              Hanya Data Terfilter
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.1 }}
              onClick={async () => {
                setOpen(false);
                await exportToPDF(allData);
              }}
              className="w-full px-4 py-2 text-left text-sm text-black hover:bg-gray-100"
            >
              Semua Data
            </motion.button>

            {/* Export Excel */}
            <div className="text-xs text-gray-500 px-4 pt-3 pb-1 border-t">
              Export Excel
            </div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.15 }}
              onClick={() => {
                setOpen(false);
                exportToExcel(filteredData);
              }}
              className="w-full px-4 py-2 text-left text-sm text-black hover:bg-gray-100"
            >
              Hanya Data Terfilter
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.2 }}
              onClick={() => {
                setOpen(false);
                exportToExcel(allData);
              }}
              className="w-full px-4 py-2 text-left text-sm text-black hover:bg-gray-100"
            >
              Semua Data
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
