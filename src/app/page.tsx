import { FaPersonShelter } from "react-icons/fa6";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { IoPaperPlane, IoBus } from "react-icons/io5";

function MJTForm() {
  return (
    <section className="p-6 rounded-lg border border-blue-400">
      <form action="" className="space-y-4">
        <div id="route-section" className="space-y-1.5">
          <label className="inline-block">Pilih Rute MJT</label>
          <div className="flex gap-2 items-center">
            <div className="w-9 h-9 rounded-md bg-blue-600 flex items-center justify-center">
              <IoPaperPlane className="text-white" size={24} />
            </div>
            <select
              name=""
              id=""
              className="p-2 rounded-md border-b border-blue-600 outline-0 focus:outline-1 focus:outline-blue-300 w-full"
            >
              <option value="">Jatinangor - Dipatiukur</option>
              <option value="">Dipatiukur - Jatinangor</option>
            </select>
          </div>
        </div>
        <div id="origin-shelter-section" className="space-y-1.5">
          <label className="inline-block">Halte Awal</label>
          <div className="flex gap-2 items-center">
            <div className="w-9 h-9 rounded-md bg-white flex items-center justify-center">
              <IoBus className="text-blue-600" size={32} />
            </div>
            <select
              name=""
              id=""
              className="p-2 rounded-full border border-blue-600 outline-0 focus:outline-1 focus:outline-blue-300 w-full"
            >
              <option value="">Jatinangor - Dipatiukur</option>
              <option value="">Dipatiukur - Jatinangor</option>
            </select>
          </div>
        </div>
        <div id="toward-shelter-section" className="space-y-1.5">
          <label className="inline-block">Halte Akhir</label>
          <div className="flex gap-2 items-center">
            <div className="w-9 h-9 rounded-md bg-white flex items-center justify-center">
              <IoBus className="text-blue-600" size={32} />
            </div>
            <select
              name=""
              id=""
              className="p-2 rounded-full border border-blue-600 outline-0 focus:outline-1 focus:outline-blue-300 w-full"
            >
              <option value="">Jatinangor - Dipatiukur</option>
              <option value="">Dipatiukur - Jatinangor</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div id="date-section" className="flex flex-col gap-1.5">
            <label>Tanggal</label>
            <input
              type="date"
              className="p-2 rounded-full border border-blue-600 outline-0 focus:outline-1 focus:outline-blue-300"
            />
          </div>
          <div id="time-section" className="flex flex-col gap-1.5">
            <label>Waktu</label>
            <input
              type="time"
              className="p-2 rounded-full border border-blue-600 outline-0 focus:outline-1 focus:outline-blue-300"
            />
          </div>
        </div>
      </form>
    </section>
  );
}

function TripInfo() {
  return (
    <div className="space-y-2">
      <div className="px-2 py-1 rounded-lg border-3 border-amber-400 bg-amber-200">
        <p>Misal ada tulisan di sini</p>
      </div>
      <div className="px-2 py-1 rounded-lg border-3 border-green-500 bg-green-200">
        <p>Misal ada tulisan di sini</p>
      </div>
      <div className="px-2 py-1 rounded-lg border-3 border-blue-500 bg-blue-200">
        <p>Misal ada tulisan di sini</p>
      </div>
    </div>
  );
}

function TripCard() {
  return (
    <div className="rounded-xl p-1.5 bg-blue-600 overflow-hidden">
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
              <p className="border-b border-blue-600 w-full">10.45 AM</p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p>Halte Awal</p>
            <div className="flex items-center gap-3">
              <IoBus className="text-blue-600" size={32} />
              <p className="border-b border-blue-600 w-full">10.45 AM</p>
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
              10.45 AM
            </p>
          </div>
        </div>
        <TripInfo />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen w-screen bg-slate-100 font-poppins">
      <div className="mx-auto h-full max-w-lg bg-white">
        <nav className="py-4 px-6 border-b border-slate-300">
          <h1>Brand Name</h1>
        </nav>
        <div className="p-6 overflow-hidden space-y-6">
          <MJTForm />
          <TripCard />
        </div>
      </div>
    </main>
  );
}
