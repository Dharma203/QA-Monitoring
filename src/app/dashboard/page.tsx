"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/app/context/AuthContext";
import Chart from "@/components/LineChart";
import ChartBS from "@/components/LineChartBS";
import { motion } from "framer-motion";

interface ChartPoint {
  name: string;
  value: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [totalData, setTotalData] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [lastInputData, setLastInputData] = useState("");
  const [lastInputUser, setLastInputUser] = useState("");
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [chartUser, setChartUser] = useState<ChartPoint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/data");
      const json = await res.json();

      setTotalData(json.total || 0);

      if (json.lastInputData) {
        const date = new Date(json.lastInputData);
        const options: Intl.DateTimeFormatOptions = {
          day: "numeric",
          month: "long",
          year: "numeric",
        };
        setLastInputData(date.toLocaleDateString("id-ID", options));
      }

      if (json.chartData) {
        setChartData(json.chartData);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user");
      const json = await res.json();

      setTotalUser(json.total || 0);

      if (json.lastInputUser) {
        const date = new Date(json.lastInputUser);
        const options: Intl.DateTimeFormatOptions = {
          day: "numeric",
          month: "long",
          year: "numeric",
        };
        setLastInputUser(date.toLocaleDateString("id-ID", options));
      }

      if (json.chartUser) {
        setChartUser(json.chartUser);
      }
    };

    fetchUser();
  }, []);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="p-6 space-y-6 bg-[#e9f0ff] text-black sm:pl-70 pt-20">
            <h1 className="text-2xl font-semibold text-gray-800">
              Selamat Datang,{" "}
              <span className="font-bold">{user?.username}!</span>
            </h1>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                className="bg-[#F26A21] text-white p-4 shadow-md rounded-lg transform transition-transform duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <p className="text-sm font-medium">Total List Aktivitas User</p>
                <p className="text-4xl font-bold">{totalData}</p>
                <Link
                  href="/data"
                  className="underline text-sm mt-2 inline-block"
                >
                  Lihat Data
                </Link>
              </motion.div>

              <motion.div
                className="bg-blue-900 text-white p-4 shadow-md rounded-lg transform transition-transform duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
              >
                <p className="text-sm font-medium">Total Nominatif User BS</p>
                <p className="text-4xl font-bold">{totalUser}</p>
                <Link
                  href="/user"
                  className="underline text-sm mt-2 inline-block"
                >
                  Lihat User
                </Link>
              </motion.div>
            </div>

            {/* Chart */}
            <motion.div
              className="bg-white rounded-md shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">
                    Grafik List Aktivitas User 7 Hari Terakhir
                  </h2>
                  <Chart data={chartData} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-4">
                    Grafik Input User BS 3 Bulan Terakhir
                  </h2>
                  <ChartBS data={chartUser} />
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
