import mongoose from "mongoose";
import { date } from "zod/v4";

const DataEntrySchema = new mongoose.Schema(
  {
    tanggal_entry: { type: date, required: true },
    tanggal_form: String,
    tanggal_eskalasi: String,
    keterangan: String,
    sistem: String,
    code_user: String,
    user: String,
    penerima: String,
    atasan: String,
    keterangan_apps: String,
    keterangan_detail: String,
    penginput: String,
    role: String,
  },
  { timestamps: true }
);

export default mongoose.models.DataEntry ||
  mongoose.model("DataEntry", DataEntrySchema);
