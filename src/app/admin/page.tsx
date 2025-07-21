"use client";

import { useEffect, useState } from "react";
import SuperAdminRoute from "@/components/SuperAdminRoute";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { UserPlus, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "@/components/Spinner";

export default function AdminManage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", password: "", role: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/users");
    const json = await res.json();
    setUsers(json);
    setLoading(false);
  };

  const handleAdd = async () => {
    setError("");
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ username: "", password: "", role: "" });
      fetchUsers();
    } else {
      let errorMessage = "Gagal menambahkan pengguna.";
      try {
        const data = await res.json();
        if (data.error) errorMessage = data.error;
      } catch (err) {
        console.warn("Respons bukan JSON:", err);
      }
      setError(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus ini?")) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchUsers();
    } else {
      const json = await res.json();
      alert(json.error || "Gagal hapus");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <SuperAdminRoute>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header />

          <main className="p-6 space-y-8 bg-[#e9f0ff] h-full text-black sm:pl-70 pt-20">
            <motion.h1
              className="text-2xl font-bold text-gray-800 flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Users className="w-6 h-6 text-blue-600" /> Manajemen Pengguna
            </motion.h1>

            <motion.div
              className="grid md:grid-cols-2 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {/* Card Tambah */}
              <motion.div
                className="bg-white p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-green-600" />
                  Tambah Pengguna
                </h2>

                <div className="space-y-4">
                  <input
                    placeholder="Username"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="">-- Pilih Role --</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                  <motion.button
                    onClick={handleAdd}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.03 }}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-medium"
                  >
                    Tambah {form.role || "pengguna"}
                  </motion.button>
                  {error && (
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                  )}
                </div>
              </motion.div>

              {/* Card Tabel */}
              <motion.div
                className="bg-white p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  📋 Daftar Pengguna
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700">
                        <th className="px-4 py-2 text-left font-medium">
                          Username
                        </th>
                        <th className="px-4 py-2 text-left font-medium">
                          Role
                        </th>
                        <th className="px-4 py-2 text-left font-medium">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={3}>
                            <Spinner />
                          </td>
                        </tr>
                      ) : (
                        <AnimatePresence initial={false}>
                          {users.map((u: any, i: number) => (
                            <motion.tr
                              key={u._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: i * 0.1,
                              }}
                              className="border-b hover:bg-gray-50 transition"
                            >
                              <td className="px-4 py-2">{u.username}</td>
                              <td className="px-4 py-2 capitalize">{u.role}</td>
                              <td className="px-4 py-2">
                                <button
                                  onClick={() => handleDelete(u._id)}
                                  className={`text-red-600 hover:underline text-sm disabled:text-gray-400`}
                                  disabled={u.role === "superadmin"}
                                >
                                  {u.role === "superadmin"
                                    ? "Tidak bisa hapus"
                                    : "Hapus"}
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      )}
                    </tbody>
                  </table>
                  {users.length === 0 && (
                    <p className="text-sm text-gray-400 mt-4">
                      Belum ada pengguna
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </main>
        </div>
      </div>
    </SuperAdminRoute>
  );
}
