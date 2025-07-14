"use client";

import { useRef, useState, useEffect } from "react";
import { exportToExcel } from "@/app/lib/excel";
import { exportToPDF } from "@/app/lib/pdf";
import { DataEntry } from "@/app/types/data";
import { AnimatePresence, motion } from "framer-motion";

export default function ExportButtons({ data }: { data: DataEntry[] }) {
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
            key="dropdown"
            initial={{
              opacity: 0,
              scale: 0.5,
              y: 30,
              rotateZ: -30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              rotateZ: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.5,
              y: 30,
              rotateZ: 30,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
            }}
            className="absolute right-0 bottom-full mb-2 w-32 bg-white border rounded-md shadow-lg z-50"
          >
            <button
              onClick={async () => {
                setOpen(false);
                await exportToPDF(data);
              }}
              className="w-full px-4 py-2 text-black text-sm text-left hover:bg-gray-100"
            >
              Export PDF
            </button>

            <button
              onClick={() => {
                setOpen(false);
                exportToExcel(data);
              }}
              className="w-full px-4 py-2 text-black text-sm text-left hover:bg-gray-100"
            >
              Export Excel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
