"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/app/context/AuthContext";
import Chart from "@/components/LineChart";

interface ChartPoint {
  name: string;
  value: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [totalData, setTotalData] = useState(0);
  const [lastInput, setLastInput] = useState("");
  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/data");
      const json = await res.json();

      setTotalData(json.total || 0);

      if (json.lastInput) {
        const date = new Date(json.lastInput);
        const options: Intl.DateTimeFormatOptions = {
          day: "numeric",
          month: "long",
          year: "numeric",
        };
        setLastInput(date.toLocaleDateString("id-ID", options));
      }

      if (json.chartData) {
        setChartData(json.chartData);
      }
    };

    fetchData();
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
              <div className="bg-green-400 text-white p-4 shadow-md rounded-lg transform transition-transform duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl">
                <p className="text-sm font-medium">Total Data</p>
                <p className="text-4xl font-bold">{totalData}</p>
                <Link
                  href="/data"
                  className="underline text-sm mt-2 inline-block"
                >
                  Lihat Data
                </Link>
              </div>

              <div className="bg-indigo-400 text-white p-4 shadow-md rounded-lg transform transition-transform duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl">
                <p className="text-sm font-medium">Input Terakhir</p>
                <p className="text-4xl font-bold">{lastInput || "-"}</p>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-md shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">
                Grafik Input 7 Hari Terakhir
              </h2>
              <Chart data={chartData} />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
