"use client";

import { FormEvent, useState } from "react";
import { IoPaperPlane, IoBus } from "react-icons/io5";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getRouteAndShelter, getSchedule } from "@/http/api";
import { useSchedule } from "@/utils/store";
import responseExtractor from "@/utils/responseExtractor";
import Loader from "./Loader";

export default function MJTForm() {
  const { data, isFetching } = useQuery({
    queryKey: ["shelters"],
    queryFn: async () => {
      const responseData = await getRouteAndShelter();
      const cleanData = Array.isArray(responseData)
        ? responseData
        : responseData?.data || [];

      if (cleanData.length === 0) {
        throw new Error("Failed to fetch shelters");
      }

      const routes = cleanData.map((res: any) => ({
        id: res.id_rute,
        name: res.arah_tujuan,
      }));

      const shelters: any = {};

      cleanData.forEach((res: any) => {
        shelters[res.id_rute] = res.halte.map((h: any) => {
          return {
            shelter: h.nama_shelter,
            lat: h.latitude,
            long: h.longitude,
          };
        });
      });

      return { routes, shelters };
    },
    staleTime: Infinity,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["schedule"],
    mutationFn: getSchedule,
  });

  const storeSchedules = useSchedule((state) => state.storeSchedules);

  const [routeId, setRouteId] = useState<string>("");
  const [routeShelters, setRouteShelters] = useState({
    origin: "",
    toward: "",
  });
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      prediksi: "kedatangan",
      nama_shelter: routeShelters.origin,
      halte_tujuan: routeShelters.toward,
      target_datetime: `${date} ${time}:00`,
    };
    mutate(payload, {
      onSuccess: (data) => {
        const responseData = data.data[0].jadwal_kedatangan;
        const cleanData = responseExtractor(responseData);
        storeSchedules(cleanData);
      },
    });
  };

  return (
    <section className="p-6 rounded-lg border border-blue-400">
      {(isFetching || isPending) && <Loader />}
      <form onSubmit={onSubmit} className="space-y-4">
        <div id="route-section" className="space-y-1.5">
          <label htmlFor="routes" className="inline-block">
            Pilih Rute MJT
          </label>
          <div className="flex gap-2 items-center">
            <div className="w-9 h-9 rounded-md bg-blue-600 flex items-center justify-center">
              <IoPaperPlane className="text-white" size={24} />
            </div>
            <select
              name="routes"
              id="routes"
              className="p-2 rounded-md border-b border-blue-600 outline-0 focus:outline-1 focus:outline-blue-300 w-full"
              onChange={(e) => setRouteId(e.target.value)}
            >
              <option value="">-- Pilih --</option>
              {data?.routes.map((r: any) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div id="origin-shelter-section" className="space-y-1.5">
          <label htmlFor="origin" className="inline-block">
            Halte Awal
          </label>
          <div className="flex gap-2 items-center">
            <div className="w-9 h-9 rounded-md bg-white flex items-center justify-center">
              <IoBus className="text-blue-600" size={32} />
            </div>
            <select
              name="origin"
              id="origin"
              className="p-2 rounded-full border border-blue-600 outline-0 focus:outline-1 focus:outline-blue-300 w-full"
              onChange={(e) =>
                setRouteShelters((prev) => ({
                  ...prev,
                  [e.target.id]: e.target.value.toLowerCase(),
                }))
              }
            >
              <option value="">-- Pilih --</option>
              {data?.shelters[routeId]?.map((s: any) => (
                <option
                  key={`${s.lat} - ${s.long}`}
                  value={s.shelter.toLowerCase()}
                >
                  {s.shelter}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div id="toward-shelter-section" className="space-y-1.5">
          <label htmlFor="toward" className="inline-block">
            Halte Akhir
          </label>
          <div className="flex gap-2 items-center">
            <div className="w-9 h-9 rounded-md bg-white flex items-center justify-center">
              <IoBus className="text-blue-600" size={32} />
            </div>
            <select
              name="toward"
              id="toward"
              className="p-2 rounded-full border border-blue-600 outline-0 focus:outline-1 focus:outline-blue-300 w-full"
              onChange={(e) =>
                setRouteShelters((prev) => ({
                  ...prev,
                  [e.target.id]: e.target.value.toLowerCase(),
                }))
              }
            >
              <option value="">-- Pilih --</option>
              {data?.shelters[routeId]?.map((s: any) => (
                <option
                  key={`${s.lat} - ${s.long}`}
                  value={s.shelter.toLowerCase()}
                >
                  {s.shelter}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div id="date-section" className="flex flex-col gap-1.5">
            <label htmlFor="date">Tanggal Pergi</label>
            <input
              id="date"
              type="date"
              className="p-2 rounded-full border border-blue-600 outline-0 focus:outline-1 focus:outline-blue-300"
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div id="time-section" className="flex flex-col gap-1.5">
            <label htmlFor="time">Waktu Berangkat</label>
            <input
              id="time"
              type="time"
              className="p-2 rounded-full border border-blue-600 outline-0 focus:outline-1 focus:outline-blue-300"
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-blue-600 py-2 text-white mt-6 hover:cursor-pointer hover:bg-blue-500"
        >
          Periksa Waktu
        </button>
      </form>
    </section>
  );
}
