import { NextRequest } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Option from "@/app/models/Option";

// GET: Ambil semua opsi
export async function GET() {
  await connectDB();

  try {
    const options = await Option.find();
    return new Response(JSON.stringify(options), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Gagal mengambil data opsi" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// POST: Tambah opsi baru
export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { type, value } = await req.json();

    if (!type || !value) {
      return new Response(
        JSON.stringify({ error: "Tipe dan nilai wajib diisi" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const exists = await Option.findOne({ type, value });
    if (exists) {
      return new Response(JSON.stringify({ error: "Opsi sudah ada" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newOption = await Option.create({ type, value });

    return new Response(JSON.stringify(newOption), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Gagal menambahkan opsi" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// DELETE: Hapus opsi berdasarkan ID (?id=xxxxx)
export async function DELETE(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID wajib dikirim sebagai query parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const deleted = await Option.findByIdAndDelete(id);

    if (!deleted) {
      return new Response(JSON.stringify({ error: "Opsi tidak ditemukan" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Berhasil dihapus" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Gagal menghapus opsi" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
