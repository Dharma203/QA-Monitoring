import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";

export async function GET() {
  await connectDB();
  const users = await User.find({ role: "admin" });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const { username, password, role } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username dan password wajib diisi" },
      { status: 400 }
    );
  }

  const exists = await User.findOne({ username });
  if (exists) {
    return NextResponse.json({ error: "Username sudah ada" }, { status: 409 });
  }

  const user = new User({ username, password, role: role || "admin" });
  await user.save();
  return NextResponse.json({ success: true });
}
