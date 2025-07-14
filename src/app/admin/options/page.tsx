"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import SuperAdminRoute from "@/components/SuperAdminRoute";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

interface Option {
  _id: string;
  type: string;
  value: string;
}

export default function DropdownManagementPage() {
  const { user } = useAuth();
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOptions = async () => {
    const res = await fetch("/api/options");
    const data = await res.json();
    setOptions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleAdd = async (e: any) => {
    e.preventDefault();
    const type = e.target.type.value;
    const value = e.target.value.value;

    const res = await fetch("/api/options", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, value }),
    });

    if (res.ok) {
      e.target.reset();
      fetchOptions();
    } else {
      const error = await res.json();
      alert("Gagal menambah: " + error.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus opsi ini?")) return;
    const res = await fetch(`/api/options?id=${id}`, { method: "DELETE" });

    if (res.ok) {
      fetchOptions();
    } else {
      const err = await res.json();
      alert("Gagal hapus: " + err.error);
    }
  };

  if (!user || user.role !== "superadmin") {
    return (
      <p className="p-6 text-red-600 font-medium">
        ❌ Hanya superadmin yang dapat mengakses halaman ini.
      </p>
    );
  }

  return (
    <SuperAdminRoute>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Header />

          <main className="p-6 space-y-6 bg-[#e9f0ff] h-full text-black sm:pl-70 pt-20">
            <h1 className="text-2xl font-bold text-gray-800">
              🛠️ Manajemen Dropdown
            </h1>

            {/* Form Tambah Opsi */}
            <form
              onSubmit={handleAdd}
              className="bg-white p-6 rounded shadow flex flex-wrap items-end gap-4 max-w-3xl"
            >
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Jenis Opsi
                </label>
                <select
                  name="type"
                  className="border rounded p-2 text-sm"
                  required
                >
                  <option value="">-- Pilih Tipe --</option>
                  <option value="keterangan">Keterangan</option>
                  <option value="sistem">Sistem</option>
                  <option value="penerima">Penerima</option>
                  <option value="atasan">Atasan</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Nilai
                </label>
                <input
                  type="text"
                  name="value"
                  placeholder="Contoh: Bug Baru"
                  className="border rounded p-2 text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 mt-5"
              >
                Tambah
              </button>
            </form>

            {/* List Dropdown per Tipe */}
            {loading ? (
              <p className="text-gray-600">🔄 Memuat opsi...</p>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                {["keterangan", "sistem", "penerima", "atasan"].map((type) => (
                  <div
                    key={type}
                    className="bg-white rounded shadow-md p-4 transform transition-transform duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <h2 className="font-semibold text-gray-700 capitalize mb-3">
                      {type}
                    </h2>
                    <ul className="space-y-2 max-h-64 overflow-y-auto text-sm">
                      {options
                        .filter((opt) => opt.type === type)
                        .map((opt) => (
                          <li
                            key={opt._id}
                            className="flex justify-between items-center border-b pb-1"
                          >
                            <span>{opt.value}</span>
                            <button
                              onClick={() => handleDelete(opt._id)}
                              className="text-red-600 text-xs hover:underline"
                            >
                              Hapus
                            </button>
                          </li>
                        ))}
                      {options.filter((opt) => opt.type === type).length ===
                        0 && <li className="text-gray-400 italic">Kosong</li>}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </SuperAdminRoute>
  );
}
