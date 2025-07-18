"use client";

import { useState, useEffect, useRef } from "react";
import { Funnel } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type FilterProps = {
  onFilter: (filter: {
    kd_ktr: string;
    kd_group: string;
    startDate: string;
    endDate: string;
  }) => void;
  onReset: () => void;
};

export default function FilterDropdownBS({ onFilter, onReset }: FilterProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState({
    kd_ktr: "",
    kd_group: "",
    petugas: "",
    startDate: "",
    endDate: "",
  });
  const [options, setOptions] = useState<{ [key: string]: string[] }>({});

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      const res = await fetch("/api/options");
      const json = await res.json();

      const grouped: { [key: string]: string[] } = {};
      json.forEach((opt: any) => {
        if (!grouped[opt.type]) grouped[opt.type] = [];
        grouped[opt.type].push(opt.value);
      });

      setOptions(grouped);
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApply = () => {
    onFilter(filter);
    setOpen(false);
  };

  const handleReset = () => {
    const resetState = {
      kd_ktr: "",
      kd_group: "",
      petugas: "",
      startDate: "",
      endDate: "",
    };
    setFilter(resetState);
    onReset();
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-white border text-gray-400 h-10 border-gray-300 px-4 py-2 rounded-xl text-sm shadow hover:bg-gray-100"
      >
        <span className="flex items-center gap-2">
          <Funnel className="w-4 h-4" />
          Filter
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown"
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={{
              hidden: { opacity: 0, y: -10 },
              show: {
                opacity: 1,
                y: 0,
                transition: {
                  staggerChildren: 0.05, // delay antar elemen
                  delayChildren: 0.05,
                },
              },
            }}
            className="absolute z-50 mt-2 right-0 bg-white border rounded-lg shadow-lg p-4 w-72 space-y-3"
          >
            {["kd_ktr", "kd_group", "petugas"].map((key) => (
              <motion.div
                key={key}
                variants={{
                  hidden: { opacity: 0, y: -10 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <select
                  value={filter[key as keyof typeof filter]}
                  onChange={(e) =>
                    setFilter((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="w-full border px-3 py-2 rounded text-sm"
                >
                  <option value="">-- {key} --</option>
                  {options[key]?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </motion.div>
            ))}

            <motion.div
              variants={{
                hidden: { opacity: 0, y: -10 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <label className="block text-sm text-gray-700">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={filter.startDate}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, startDate: e.target.value }))
                }
                className="w-full border px-3 py-2 rounded text-sm"
              />
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: -10 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <label className="block text-sm text-gray-700">
                Tanggal Akhir
              </label>
              <input
                type="date"
                value={filter.endDate}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, endDate: e.target.value }))
                }
                className="w-full border px-3 py-2 rounded text-sm"
              />
            </motion.div>

            <motion.div
              className="flex justify-between pt-2"
              variants={{
                hidden: { opacity: 0, y: -10 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <button
                onClick={handleReset}
                className="text-sm text-gray-600 hover:underline"
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700"
              >
                Terapkan
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
