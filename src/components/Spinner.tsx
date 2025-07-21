"use client";
import { motion } from "framer-motion";

export default function Spinner() {
  return (
    <div className="flex items-center justify-center py-10 text-blue-600">
      <motion.div
        className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 1,
        }}
      />
      <span className="ml-4 text-sm font-medium text-blue-700">
        Memuat...
      </span>
    </div>
  );
}
