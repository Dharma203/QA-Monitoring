import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const user = await User.findById(params.id);
  if (!user) {
    return NextResponse.json(
      { error: "User tidak ditemukan" },
      { status: 404 }
    );
  }

  if (user.role === "superadmin") {
    return NextResponse.json(
      { error: "Tidak bisa menghapus superadmin" },
      { status: 403 }
    );
  }

  await User.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
