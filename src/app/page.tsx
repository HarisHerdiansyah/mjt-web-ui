import AppContent from "./AppContent";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen w-screen bg-slate-100 font-poppins">
      <div className="mx-auto h-full max-w-lg bg-white">
        <nav className="px-6 border-b border-slate-300">
          <div className="relative w-48 h-12">
            <Image
              src="/assets/logo.webp"
              alt="Transion Logo"
              className="object-contain"
              loading="eager"
              aria-label="Transion Logo"
              fill
            />
          </div>
        </nav>
        <AppContent />
      </div>
    </main>
  );
}
