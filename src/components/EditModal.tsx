"use client";

import { useForm } from "react-hook-form";
import { DataEntry } from "@/app/types/data";
import { useState, useEffect } from "react";

export default function EditModal({
  data,
  onClose,
  onSave,
}: {
  data: DataEntry;
  onClose: () => void;
  onSave: (updates: DataEntry) => void;
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
    if (data.tanggal_form) {
      setValue("tanggal_form", data.tanggal_form.slice(0, 10));
    }
    if (data.tanggal_eskalasi) {
      setValue("tanggal_eskalasi", data.tanggal_eskalasi.slice(0, 10));
    }
  }, []);

  const submit = async (values: any) => {
    const response = await fetch(`/api/data/${data._id}`, {
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
          <input
            type="date"
            {...register("tanggal_form")}
            className="border p-2"
          />
          <input
            type="date"
            {...register("tanggal_eskalasi")}
            className="border p-2"
          />

          <select
            {...register("keterangan")}
            className="border p-2"
            defaultValue={data.keterangan || ""}
          >
            <option value="" disabled hidden>
              Pilih Keterangan
            </option>
            {options.keterangan?.map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>

          <select
            {...register("sistem")}
            className="border p-2"
            defaultValue={data.sistem || ""}
          >
            <option value="" disabled hidden>
              Pilih Sistem
            </option>
            {options.sistem?.map((val) => (
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
            {...register("penerima")}
            className="border p-2"
            defaultValue={data.penerima || ""}
          >
            <option value="" disabled hidden>
              Pilih Penerima
            </option>
            {options.penerima?.map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>

          <select
            {...register("atasan")}
            className="border p-2"
            defaultValue={data.atasan || ""}
          >
            <option value="" disabled hidden>
              Pilih Atasan
            </option>
            {options.atasan?.map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
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
