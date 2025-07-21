"use client";

import { useEffect, useState } from "react";
import { DataEntry } from "../types/data";
import { parseExcel, sanitizeExcelData } from "../lib/excel";
import InputForm from "@/components/InputForm";
import EditModal from "@/components/EditModal";
import ProtectedRoute from "@/components/ProtectedRoute";
import { formatDate } from "@/app/lib/date";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Search, ChevronRight, ChevronLeft } from "lucide-react";
import UploadButton from "@/components/UploadButton";
import ExportButtons from "@/components/ExportButton";
import InputButton from "@/components/InputButton";
import { AnimatePresence, motion } from "framer-motion";
import FilterForm from "@/components/FilterButton";
import Spinner from "@/components/Spinner";

export default function DataPage() {
  const [data, setData] = useState<DataEntry[]>([]);
  const [search, setSearch] = useState("");
  const [rawSearch, setRawSearch] = useState("");
  const [editItem, setEditItem] = useState<DataEntry | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [jumpPage, setJumpPage] = useState("");
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(20); //ubah jumlah data per page <<
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState({
    keterangan: "",
    sistem: "",
    penerima: "",
    atasan: "",
    startDate: "",
    endDate: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true); // mulai loading
      const res = await fetch("/api/data");
      const json = await res.json();
      const sorted = (json.data || []).sort((a: DataEntry, b: DataEntry) => {
        return (
          new Date(b.tanggal_entry).getTime() -
          new Date(a.tanggal_entry).getTime()
        );
      });
      setData(sorted);
    } catch (err) {
      console.error("❌ Failed to fetch data", err);
    } finally {
      setLoading(false); // selesai loading
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(rawSearch);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [rawSearch]);

  const handleJumpPage = () => {
    const targetPage = parseInt(jumpPage);
    if (!isNaN(targetPage) && targetPage >= 1 && targetPage <= totalPages) {
      setCurrentPage(targetPage);
      setJumpPage("");
    }
  };

  const visiblePages = () => {
    const pages = [];

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages);
    } else if (currentPage > totalPages - 2) {
      startPage = Math.max(1, totalPages - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const filtered = data.filter((d) => {
    const q = search.toLowerCase();
    const matchSearch =
      d.keterangan?.toLowerCase().includes(q) ||
      d.keterangan_detail?.toLowerCase().includes(q) ||
      d.sistem?.toLowerCase().includes(q) ||
      d.user?.toLowerCase().includes(q) ||
      d.penerima?.toLowerCase().includes(q) ||
      d.atasan?.toLowerCase().includes(q) ||
      formatDate(d.tanggal_entry || "").includes(q) ||
      formatDate(d.tanggal_eskalasi || "").includes(q) ||
      formatDate(d.tanggal_form || "").includes(q) ||
      d.code_user?.toLowerCase().includes(q);

    const matchFilter =
      (!filter.keterangan ||
        d.keterangan?.toLowerCase() === filter.keterangan.toLowerCase()) &&
      (!filter.sistem ||
        d.sistem?.toLowerCase() === filter.sistem.toLowerCase()) &&
      (!filter.penerima ||
        d.penerima?.toLowerCase() === filter.penerima.toLowerCase()) &&
      (!filter.atasan ||
        d.atasan?.toLowerCase() === filter.atasan.toLowerCase());

    return matchSearch && matchFilter;
  });

  const getFilteredByDate = () => {
    if (!filter.startDate || !filter.endDate) return filtered;

    const start = new Date(filter.startDate);
    const end = new Date(filter.endDate);
    end.setHours(23, 59, 59, 999);

    return filtered.filter((d) => {
      const tgl = new Date(d.tanggal_entry);
      return tgl >= start && tgl <= end;
    });
  };

  const totalPages = Math.ceil(getFilteredByDate().length / itemsPerPage);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    await fetch(`/api/data/${id}`, { method: "DELETE" });
    await fetchData();
  };

  const handleSaveEdit = async (updated: DataEntry) => {
    await fetch(`/api/data/${updated._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setEditItem(null);
    await fetchData();
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 bg-[#e9f0ff] p-6 space-y-4 overflow-y-auto text-black sm:pl-70 pt-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="space-y-4"
            >
              <div className="flex gap-3 items-center">
                <div className="flex-1 flex items-center bg-white shadow rounded-full px-4 py-2">
                  <Search className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Cari data atau tanggal (dd/mm/yyyy)..."
                    value={rawSearch}
                    onChange={(e) => setRawSearch(e.target.value)}
                    className="outline-none flex-1 text-gray-700 placeholder-gray-400 text-sm bg-transparent"
                  />
                </div>
                <FilterForm
                  onFilter={(newFilter) => {
                    setFilter(newFilter);
                    setCurrentPage(1);
                  }}
                  onReset={() => {
                    setFilter({
                      keterangan: "",
                      sistem: "",
                      penerima: "",
                      atasan: "",
                      startDate: "",
                      endDate: "",
                    });
                  }}
                />
              </div>
              {loading ? (
                <Spinner />
              ) : (
                <div className="overflow-x-auto rounded-lg shadow">
                  <table className="table-fixed w-full text-sm text-center border-collapse bg-white">
                    <thead>
                      <motion.tr
                        className="bg-[#F5F5F5]"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        {[
                          "Entry",
                          "Form",
                          "Eskalasi",
                          "Keterangan",
                          "Sistem",
                          "Code User",
                          "Nama User",
                          "Penerima",
                          "Atasan",
                          "Apps",
                          "Detail",
                          "Aksi",
                        ].map((title, idx) => (
                          <th
                            key={idx}
                            className="p-2 font-semibold text-gray-700 border-b border-gray-200"
                          >
                            {title}
                          </th>
                        ))}
                      </motion.tr>
                    </thead>
                    <tbody>
                      {getFilteredByDate()
                        .slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage
                        )
                        .map((d, index) => (
                          <motion.tr
                            key={index}
                            className="border-t hover:bg-gray-50"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <td className="px-2 py-1 align-top text-center">
                              {formatDate(d.tanggal_entry)}
                            </td>
                            <td className="px-2 py-1 align-top text-center">
                              {formatDate(d.tanggal_form)}
                            </td>
                            <td className="px-2 py-1 align-top text-center">
                              {formatDate(d.tanggal_eskalasi)}
                            </td>
                            <td
                              className="px-2 py-1 text-justify align-top hyphens-auto break-words max-w-[150px]"
                              style={{
                                hyphens: "auto",
                                wordBreak: "break-word",
                              }}
                            >
                              {d.keterangan}
                            </td>
                            <td
                              className="px-2 py-1 text-justify align-top hyphens-auto break-words max-w-[150px]"
                              style={{
                                hyphens: "auto",
                                wordBreak: "break-word",
                              }}
                            >
                              {d.sistem}
                            </td>
                            <td
                              className="px-2 py-1 text-justify align-top hyphens-auto break-words max-w-[150px]"
                              style={{
                                hyphens: "auto",
                                wordBreak: "break-word",
                              }}
                            >
                              {d.code_user}
                            </td>
                            <td
                              className="px-2 py-1 text-justify align-top hyphens-auto break-words max-w-[150px]"
                              style={{
                                hyphens: "auto",
                                wordBreak: "break-word",
                              }}
                            >
                              {d.user}
                            </td>
                            <td
                              className="px-2 py-1 text-justify align-top hyphens-auto break-words max-w-[150px]"
                              style={{
                                hyphens: "auto",
                                wordBreak: "break-word",
                              }}
                            >
                              {d.penerima}
                            </td>
                            <td
                              className="px-2 py-1 text-justify align-top hyphens-auto break-words max-w-[150px]"
                              style={{
                                hyphens: "auto",
                                wordBreak: "break-word",
                              }}
                            >
                              {d.atasan}
                            </td>
                            <td
                              className="px-2 py-1 text-justify align-top hyphens-auto break-words max-w-[150px]"
                              style={{
                                hyphens: "auto",
                                wordBreak: "break-word",
                              }}
                            >
                              {d.keterangan_apps}
                            </td>
                            <td
                              className="px-2 py-1 text-justify align-top hyphens-auto break-words max-w-[150px]"
                              style={{
                                hyphens: "auto",
                                wordBreak: "break-word",
                              }}
                            >
                              {d.keterangan_detail}
                            </td>
                            <td className="p-2 border-b space-x-2 whitespace-nowrap">
                              <button
                                onClick={() => setEditItem(d)}
                                className="text-blue-600 hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(d._id)}
                                className="text-red-600 hover:underline"
                              >
                                Hapus
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white rounded-lg sm:rounded-full shadow-sm px-6 py-3 w-full border border-gray-200">
                {/* Navigasi Halaman */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="text-lg font-semibold px-2 py-1 rounded-full hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft />
                  </button>

                  {visiblePages().map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 text-sm rounded-full border transition 
          ${
            currentPage === page
              ? "bg-indigo-100 text-indigo-700 border-indigo-300 font-semibold"
              : "hover:bg-indigo-50 hover:text-indigo-700 border-transparent"
          }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="text-lg font-semibold px-2 py-1 rounded-full hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight />
                  </button>
                </div>

                {/* Jumlah per halaman & Go To */}
                <div className="flex items-center gap-4">
                  {/* Jumlah per halaman */}
                  <div className="flex items-center gap-1 text-sm">
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="border border-indigo-300 rounded-full px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
                    >
                      {[5, 10, 20, 50].map((val) => (
                        <option key={val} value={val}>
                          {val} / page
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Lompat ke halaman */}
                  <div className="flex items-center gap-1 text-sm">
                    <span>Go to</span>
                    <input
                      type="number"
                      placeholder=""
                      value={jumpPage}
                      onChange={(e) => setJumpPage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleJumpPage()}
                      className="w-14 border border-indigo-300 rounded-full px-3 py-1 text-center outline-none focus:ring-2 focus:ring-indigo-300"
                      min={1}
                      max={totalPages}
                    />
                    <span>Page</span>
                  </div>
                </div>

                {/* Info Data */}
                <div className="text-sm text-gray-500">
                  Menampilkan {(currentPage - 1) * itemsPerPage + 1} –{" "}
                  {Math.min(
                    currentPage * itemsPerPage,
                    getFilteredByDate().length
                  )}{" "}
                  dari {getFilteredByDate().length} data
                </div>
              </div>

              <div className="flex flex-wrap justify-end items-center gap-4 p-4 bg-[#e9f0ff] rounded-xl">
                <div className="flex gap-2">
                  <UploadButton onUpload={fetchData} />
                  <ExportButtons
                    allData={data}
                    filteredData={getFilteredByDate()}
                  />
                  <InputButton onClick={() => setShowModal(true)} />
                </div>
              </div>

              <AnimatePresence>
                {showModal && (
                  <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="bg-white text-black rounded-2xl w-full max-w-3xl p-4 shadow-xl"
                      initial={{ y: 50, opacity: 0, scale: 0.9 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ y: 50, opacity: 0, scale: 0.9 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      <InputForm
                        onClose={() => setShowModal(false)}
                        onSave={(newData) => {
                          setData((prev) => [newData, ...prev]);
                        }}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {editItem && (
                  <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full"
                      initial={{ y: 50, opacity: 0, scale: 0.9 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ y: 50, opacity: 0, scale: 0.9 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      <EditModal
                        data={editItem}
                        onClose={() => setEditItem(null)}
                        onSave={handleSaveEdit}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
