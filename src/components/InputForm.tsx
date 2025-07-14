"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DataEntry } from "@/app/types/data";

export default function InputForm({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (newData: DataEntry) => void;
}) {
  const { register, handleSubmit, reset } = useForm();
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
  }, []);

  const onSubmit = async (data: any) => {
    const res = await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const newEntry = await res.json();
      reset();
      onSave(newEntry); // panggil untuk update data luar
      onClose(); // tutup modal
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
      <div className="bg-white text-black rounded-2xl w-full max-w-3xl p-4 shadow-xl">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">
          Input Data
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 bg-white p-6 rounded shadow"
        >
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
              defaultValue=""
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
              defaultValue=""
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
              defaultValue=""
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
              defaultValue=""
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

          <div className="flex justify-end mt-6">
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
