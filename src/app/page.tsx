"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import Image from "next/image";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error || "Gagal login");
        return;
      }

      const user = await res.json(); // { username, role }
      login(user);
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Terjadi kesalahan saat login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EAF0FB] px-4 py-12">
      <div className="flex flex-col md:flex-row-reverse items-center gap-12 max-w-4xl w-full">
        <motion.div
          className="flex justify-center md:justify-start w-full md:w-1/2"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Image
            src="/logo-banklampung.png"
            alt="Bank Lampung"
            width={350}
            height={350}
            priority
          />
        </motion.div>
        {/* Login Form */}
        <motion.div
          className="bg-white rounded-2xl border-1 border-black shadow-[8px_8px_5px_rgba(0,0,0,0.40)] p-8 md:p-10 w-full md:w-1/2"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Login
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <motion.p
                className="text-red-500 text-sm text-center"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.p>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Masukkan Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                className="w-full px-4 py-3 text-black placeholder-gray-400 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Masukkan Kata Sandi"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full px-4 py-3 text-black placeholder-gray-400 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#007AFF] text-white font-semibold py-3 rounded-md hover:bg-blue-600 transition"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
