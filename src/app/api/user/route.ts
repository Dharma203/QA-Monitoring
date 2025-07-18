import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import UserEntry from "@/app/models/UserEntry";

// GET semua data
export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const sevenDaysAgo = new Date(todayStart);
    sevenDaysAgo.setDate(todayStart.getDate() - 6);

    const rawData = await UserEntry.find({
      tanggal_proses: { $gte: sevenDaysAgo },
    }).select("tanggal_proses");

    const dailyCount: Record<string, number> = {};

    // Inisialisasi count harian 7 hari terakhir
    for (let i = 0; i < 7; i++) {
      const d = new Date(todayStart);
      d.setDate(todayStart.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      dailyCount[key] = 0;
    }

    rawData.forEach((entry) => {
      const key = new Date(entry.tanggal_proses).toISOString().slice(0, 10);
      if (dailyCount[key] !== undefined) {
        dailyCount[key]++;
      }
    });

    // Format data chart
    const chartData = Object.entries(dailyCount).map(([date, value]) => {
      const label = new Date(date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
      return { name: label, value };
    });

    const total = await UserEntry.countDocuments();
    const lastEntry = await UserEntry.findOne().sort({ tanggal_proses: -1 });
    const lastInput = lastEntry?.tanggal_proses ?? null;
    const allData = await UserEntry.find().sort({ tanggal_proses: -1 });

    return NextResponse.json({
      total,
      lastInput,
      chartData,
      data: allData,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

// POST data baru
export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json(
      { error: "Body tidak valid (bukan JSON)" },
      { status: 400 }
    );
  }

  if (!body || Object.keys(body).length === 0) {
    return NextResponse.json({ error: "Body kosong" }, { status: 400 });
  }

  await connectDB();

  const entry: any = {
    kd_ktr: body.kd_ktr || "-",
    code_user: body.code_user || "-",
    user: body.user || "-",
    kd_group: body.kd_group || "-",
    nama: body.nama || "-",
    jabatan: body.jabatan || "-",
    petugas: body.petugas || "-",
    penginput: body.penginput || "Tidak diketahui",
    role: body.role || "Tidak diketahui",
  };

  // Tambahkan tanggal_proses HANYA jika ada
  if (body.tanggal_proses && !isNaN(Date.parse(body.tanggal_proses))) {
    entry.tanggal_proses = new Date(body.tanggal_proses);
  }

  const newEntry = await UserEntry.create(entry);
  return NextResponse.json(newEntry);
}
