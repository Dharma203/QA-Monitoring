import { connectDB } from "@/app/lib/mongodb";
import DataEntry from "@/app/models/DataEntry";
import { NextResponse } from "next/server";

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

    const rawData = await DataEntry.find({
      tanggal_entry: { $gte: sevenDaysAgo },
    }).select("tanggal_entry");

    const dailyCount: Record<string, number> = {};

    // Inisialisasi count harian 7 hari ke belakang
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(now.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10); // "YYYY-MM-DD"
      dailyCount[key] = 0;
    }

    rawData.forEach((entry) => {
      const key = new Date(entry.tanggal_entry).toISOString().slice(0, 10);
      if (dailyCount[key] !== undefined) {
        dailyCount[key]++;
      }
    });

    // Format final untuk line chart: { date, total }
    const chartData = Object.entries(dailyCount).map(([date, value]) => {
      const label = new Date(date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
      return {
        name: label,
        value,
      };
    });

    const total = await DataEntry.countDocuments();
    const lastEntry = await DataEntry.findOne().sort({ tanggal_entry: -1 });
    const lastInput = lastEntry?.tanggal_entry ?? null;
    const allData = await DataEntry.find().sort({ createdAt: -1 });

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

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
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

  // Perbaikan utama: pastikan tanggal_entry valid
  let tanggalEntry: Date;
  if (body.tanggal_entry) {
    const parsed = new Date(body.tanggal_entry);
    if (!isNaN(parsed.getTime())) {
      tanggalEntry = parsed;
    } else {
      return NextResponse.json(
        { error: "Format tanggal tidak valid" },
        { status: 400 }
      );
    }
  } else {
    tanggalEntry = new Date(); // fallback ke sekarang
  }

  const entry = {
    ...body,
    tanggal_entry: tanggalEntry,
    keterangan_apps: [body.keterangan, body.sistem]
      .filter(Boolean)
      .join(" ")
      .trim(),
    keterangan_detail: [body.keterangan, body.sistem, "User", body.user]
      .filter(Boolean)
      .join(" ")
      .trim(),
    penginput: body.penginput || "Tidak diketahui",
    role: body.role || "Tidak diketahui",
  };

  const newEntry = await DataEntry.create(entry);
  return NextResponse.json(newEntry);
}
