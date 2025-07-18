import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import UserEntry from "@/app/models/UserEntry";
import { Types } from "mongoose";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const entry = await UserEntry.findById(params.id);
  return NextResponse.json(entry);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  await connectDB();
  const body = await req.json();
  const updated = await UserEntry.findByIdAndUpdate(id, body, {
    new: true,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await UserEntry.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
