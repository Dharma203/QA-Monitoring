"use client";

import { useEffect, useState } from "react";
import SuperAdminRoute from "@/components/SuperAdminRoute";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { UserPlus, Users } from "lucide-react";

export default function AdminManage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const json = await res.json();
    setUsers(json);
  };

  const handleAdd = async () => {
    setError("");
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, role: "admin" }),
    });

    if (res.ok) {
      setForm({ username: "", password: "" });
      fetchUsers();
    } else {
      const json = await res.json();
      setError(json.error || "Gagal menambahkan admin");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus admin ini?")) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchUsers();
    } else {
      const json = await res.json();
      alert(json.error || "Gagal hapus admin");
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
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" /> Manajemen Admin
            </h1>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Card Tambah Admin */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-green-600" />
                  Tambah Admin
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
                  <button
                    onClick={handleAdd}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-medium"
                  >
                    Tambah Admin
                  </button>
                  {error && (
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                  )}
                </div>
              </div>

              {/* Card Tabel Admin */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  📋 Daftar Admin
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
                      {users.map((u: any) => (
                        <tr
                          key={u._id}
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && (
                    <p className="text-sm text-gray-400 mt-4">
                      Belum ada admin.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SuperAdminRoute>
  );
}
