import mongoose from "mongoose";
import { date } from "zod/v4";

const UserEntrySchema = new mongoose.Schema({
  kd_ktr: String,
  code_user: String,
  user: String,
  kd_group: String,
  nama: String,
  jabatan: String,
  petugas: String,
  tanggal_proses: Date,
  penginput: String,
  role: String,
});

export default mongoose.models.UserEntry ||
  mongoose.model("UserEntry", UserEntrySchema);
