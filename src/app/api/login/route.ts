import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";

export async function POST(req: NextRequest) {
  await connectDB();
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username & password wajib diisi" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ username });
  if (!user || user.password !== password) {
    return NextResponse.json(
      { error: "Username atau password salah" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    username: user.username,
    role: user.role,
  });
}
