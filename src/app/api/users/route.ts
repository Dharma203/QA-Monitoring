import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";

export async function GET() {
  await connectDB();
  const users = await User.find();
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { username, password, role } = await req.json();
    const roleLower = role?.toLowerCase() || "user";

    // Validasi input
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    // Validasi role hanya salah satu dari enum
    const validRoles = ["superadmin", "admin", "user"];
    if (!validRoles.includes(roleLower)) {
      return NextResponse.json({ error: "Role tidak valid" }, { status: 400 });
    }

    // Cek apakah username sudah ada
    const exists = await User.findOne({ username });
    if (exists) {
      return NextResponse.json(
        { error: "Username sudah digunakan" },
        { status: 409 }
      );
    }

    // Buat user baru
    const user = new User({ username, password, role: roleLower });
    await user.save();

    return NextResponse.json({
      success: true,
      message: "User berhasil ditambahkan",
    });
  } catch (err) {
    console.error("Gagal tambah user:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
