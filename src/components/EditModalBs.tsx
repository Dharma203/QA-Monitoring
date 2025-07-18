"use client";

import { useForm } from "react-hook-form";
import { UserEntryBS } from "@/app/types/user";
import { useState, useEffect } from "react";

export default function EditModalBS({
  data,
  onClose,
  onSave,
}: {
  data: UserEntryBS;
  onClose: () => void;
  onSave: (updates: UserEntryBS) => void;
}) {
  const { register, handleSubmit, setValue } = useForm({ defaultValues: data });
  const [options, setOptions] = useState<{ [key: string]: string[] }>({});

  const fetchOptions = async () => {
    const res = await fetch("/api/options");
    const json = await res.json();

    const grouped: { [key: string]: string[] } = {};
    json.forEach((opt: any) => {
      if (!grouped[opt.type]) grouped[opt.type] = [];
      grouped[opt.type].push(opt.value);
    });

    setOptions(grouped);
  };

  useEffect(() => {
    fetchOptions();
    // Set tanggal awal (harus dalam format yyyy-MM-dd agar input type="date" bisa menerima)
    if (data.tanggal_proses) {
      setValue("tanggal_proses", data.tanggal_proses.slice(0, 10));
    }
  }, []);

  const submit = async (values: any) => {
    const response = await fetch(`/api/user/${data._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      const updated = await response.json();
      onSave(updated); // kirim data hasil update ke parent
      onClose();
    } else {
      alert("Gagal menyimpan perubahan.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit(submit)}
        className="bg-white p-6 rounded shadow-lg w-[90%] max-w-xl space-y-4"
      >
        <h2 className="text-lg font-bold">Edit Data</h2>
        <div className="grid grid-cols-2 gap-4">
          <select
            {...register("kd_ktr")}
            className="border p-2"
            defaultValue={data.kd_ktr || ""}
          >
            <option value="" disabled hidden>
              Kode Kantor
            </option>
            {options.kd_ktr?.map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
          <input
            placeholder="Code User"
            {...register("code_user")}
            className="border p-2"
          />
          <input
            placeholder="User"
            {...register("user")}
            className="border p-2"
          />
          <select
            {...register("kd_group")}
            className="border p-2"
            defaultValue={data.kd_group || ""}
          >
            <option value="" disabled hidden>
              Kode Group
            </option>
            {options.kd_group?.map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
          <input
            placeholder="Nama"
            {...register("nama")}
            className="border p-2"
          />
          <input
            placeholder="Jabatan"
            {...register("jabatan")}
            className="border p-2"
          />
          <input
            placeholder="Petugas"
            {...register("petugas")}
            className="border p-2"
          />
          <input
            type="date"
            {...register("tanggal_proses")}
            className="border p-2"
          />
        </div>
        <div className="flex justify-between mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Simpan
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
