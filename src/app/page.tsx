import AppContent from "./AppContent";

export default function Home() {
  return (
    <main className="min-h-screen w-screen bg-slate-100 font-poppins">
      <div className="mx-auto h-full max-w-lg bg-white">
        <nav className="py-4 px-6 border-b border-slate-300">
          <h1>Brand Name</h1>
        </nav>
        <AppContent />
      </div>
    </main>
  );
}
