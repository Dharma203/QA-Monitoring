"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InputButtonBS({ onClick }: { onClick: () => void }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <button
      className="bg-blue-600 hover:bg-blue-700 h-10 text-white px-6 py-2 rounded-md font-semibold text-sm shadow flex items-center"
      onClick={onClick}
    >
      Input Data
    </button>
  );
}
