"use client";

import { clsx } from "clsx";
import { FaPersonShelter } from "react-icons/fa6";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { IoBus } from "react-icons/io5";
import { useSchedule } from "@/utils/store";

function TripInfo({ sch }: { sch: any }) {
  return (
    <div className="space-y-2">
      <div
        className={clsx("px-2 py-1 rounded-lg border-3", {
          "border-amber-400 bg-amber-200": sch.trafficJam,
          "border-green-500 bg-green-200": !sch.trafficJam,
        })}
      >
        <p>{sch.trafficJamMsg}</p>
      </div>
      <div className="px-2 py-1 rounded-lg border-3 border-blue-500 bg-blue-200">
        <p>{sch.weatherMsg}</p>
      </div>
    </div>
  );
}

export default function TripCard() {
  const schedules = useSchedule((state) => state.schedules);

  return schedules.map((sch: any) => (
    <div
      key={sch.policeNumber}
      className="rounded-xl p-1.5 bg-blue-600 overflow-hidden"
    >
      <div className="flex gap-1 items-center mb-2">
        <IoMdCheckmarkCircle className="text-white" size={20} />
        <p className="text-white">Prediksi</p>
      </div>
      <div className="w-full bg-white rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <p>Halte Awal</p>
            <div className="flex items-center gap-3">
              <IoBus className="text-blue-600" size={32} />
              <p className="border-b border-blue-600 w-full">
                {sch.timeAtDepart}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p>Halte Awal</p>
            <div className="flex items-center gap-3">
              <IoBus className="text-blue-600" size={32} />
              <p className="border-b border-blue-600 w-full">
                {sch.timeAtArrive}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FaPersonShelter className="text-blue-600" size={32} />
          <div className="flex flex-col w-full">
            <span className="text-sm">
              Saran berada di Halte Awal paling lambat pada:
            </span>
            <p className="border-b border-blue-600 w-full font-semibold">
              {sch.timeAtStart}
            </p>
          </div>
        </div>
        <TripInfo sch={sch} />
      </div>
    </div>
  ));
}
