import { connectDB } from "@/app/lib/mongodb";
import DataEntry from "@/app/models/DataEntry";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

// GET BY ID (optional, for future use)
export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const entry = await DataEntry.findById(params.id);
  return NextResponse.json(entry);
}

// UPDATE DATA
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const body = await request.json();

  await connectDB();

  const updated = await DataEntry.findByIdAndUpdate(
    id,
    {
      ...body,
      // Perbarui keterangan_apps dan keterangan_detail
      keterangan_apps: [body.keterangan, body.sistem]
        .filter(Boolean)
        .join(" ")
        .trim(),
      keterangan_detail: [body.keterangan, body.sistem, "User", body.user]
        .filter(Boolean)
        .join(" ")
        .trim(),
    },
    { new: true } // Mengembalikan data terbaru
  );

  return NextResponse.json(updated);
}

// DELETE DATA
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await DataEntry.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
